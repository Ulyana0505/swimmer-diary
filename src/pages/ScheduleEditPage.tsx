import { Button, Chip, Group, NumberInput, Select, Stack } from "@mantine/core";
import { useMainStore } from "../store.ts";
import { z } from "zod";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DateInput } from "@mantine/dates";
import { DayTime, getDayTimeLabel, getScheduleKey } from "../utils.ts";
import { ScheduleRow } from "../types.ts";

const schema = z.object({
  workout: z.string().trim().min(1, "Обязательное значение"),
  startFrom: z.date(),
  period: z.number().min(1, "Минимум 1").max(10, "Максимально 10"),
  dayTime: z.number(),
  amount: z.number().min(1, "Минимум 1")
});

type FormData = z.infer<typeof schema>;

export default function ScheduleEditPage() {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      workout: "",
      dayTime: 0,
      period: 3,
      startFrom: new Date(),
      amount: 1
    }
  });

  function onSubmit(data: FormData) {
    const { schedule, workouts } = useMainStore.getState();
    const workoutId = workouts.find((r) => r.label === data.workout);
    const dayTime = data.dayTime;
    const map = new Map(schedule.map((r) => [getScheduleKey(r), r]));
    const startFrom = new Date(data.startFrom);
    for (let i = 0; i < data.amount; i++) {
      const row = {
        date: startFrom.toJSON().slice(0, 10),
        time: dayTime,
        workoutId: workoutId!.id
      } as ScheduleRow;
      map.set(getScheduleKey(row), row);
      startFrom.setDate(startFrom.getDate() + data.period);
    }
    const next = [...map.values()].sort((a, b) =>
      getScheduleKey(a).localeCompare(getScheduleKey(b))
    );
    useMainStore.setState({ schedule: next });
  }

  return (
    <FormProvider {...form}>
      <Stack style={{ maxWidth: "300px" }}>
        <SelectWorkout name="workout" />
        <StartFrom name="startFrom" />
        <FieldNumber name="period" label="Периодичность [дней]" />
        <FieldNumber name="amount" label="Количество" />
        <SelectDayTime name="dayTime" />
        <Button onClick={form.handleSubmit(onSubmit)}>Добавить расписание</Button>
      </Stack>
    </FormProvider>
  );
}

type Props = {
  name: keyof FormData;
  label?: string;
};

function SelectWorkout(p: Props) {
  const workouts = useMainStore(({ workouts }) => workouts);
  const {
    register,
    formState: { errors }
  } = useFormContext<FormData>();
  return (
    <Select
      label="Тренировка"
      placeholder="Выберите тренировку"
      data={workouts.map((r) => r.label)}
      searchable
      {...register(p.name)}
      onChange={(value) => register(p.name).onChange({ target: { value, name: p.name } })}
      error={errors[p.name]?.message}
    />
  );
}

function StartFrom(p: Props) {
  const {
    register,
    formState: { errors },
    getValues
  } = useFormContext<FormData>();
  return (
    <DateInput
      label="Начать с"
      valueFormat="DD.MM.YYYY"
      {...register(p.name)}
      defaultValue={getValues()[p.name] as Date}
      onChange={(value) => register(p.name).onChange({ target: { value, name: p.name } })}
      error={errors[p.name]?.message}
    />
  );
}

function FieldNumber(p: Props) {
  const {
    register,
    formState: { errors },
    getValues
  } = useFormContext<FormData>();

  return (
    <NumberInput
      label={p.label}
      defaultValue={getValues()[p.name] as number}
      name={p.name}
      onChange={(value) => register(p.name).onChange({ target: { value, name: p.name } })}
      error={errors[p.name]?.message}
    />
  );
}

function SelectDayTime(p: Props) {
  const { register, getValues } = useFormContext<FormData>();
  return (
    <Chip.Group
      defaultValue={String(getValues()[p.name])}
      onChange={(valueSrc) => {
        const value = Number(valueSrc as string);
        register(p.name).onChange({ target: { value, name: p.name } });
      }}>
      <Group justify="center">
        <Chip value={String(DayTime.morning)} color="orange">
          {getDayTimeLabel(DayTime.morning)}
        </Chip>
        <Chip value={String(DayTime.evening)} color="orange">
          {getDayTimeLabel(DayTime.evening)}
        </Chip>
      </Group>
    </Chip.Group>
  );
}
