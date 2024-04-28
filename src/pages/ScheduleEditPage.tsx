import { Button, Chip, Group, NumberInput, Select, Stack } from "@mantine/core";
import { useMainStore } from "../store.ts";
import { z } from "zod";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DateInput } from "@mantine/dates";
import { DayTime, getDayTimeLabel, gotoSchedule } from "../utils.ts";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  function onSubmit(data: FormData) {
    const { schedule, workouts } = useMainStore.getState();
    const workoutId = workouts.find((r) => r.label === data.workout);
    const dayTime = data.dayTime;
    const startFrom = new Date(data.startFrom);
    for (let i = 0; i < data.amount; i++) {
      const date = startFrom.toJSON().slice(0, 10);
      const currentRow = schedule.get(date);
      if (currentRow) {
        const currentTime = currentRow.children.find(({ time }) => time === dayTime);
        if (currentTime) {
          currentTime.workoutId = workoutId!.id;
          delete currentTime.comment;
        } else {
          currentRow.children.push({ time: dayTime, workoutId: workoutId!.id });
          currentRow.children.sort((a, b) => a.time - b.time);
        }
      } else {
        schedule.set(date, { date, children: [{ time: dayTime, workoutId: workoutId!.id }] });
      }
      startFrom.setDate(startFrom.getDate() + data.period);
    }
    useMainStore.setState({
      schedule: new Map([...schedule.entries()].sort((a, b) => a[0].localeCompare(b[0])))
    });
    navigate(gotoSchedule(""));
  }

  return (
    <FormProvider {...form}>
      <Stack style={{ maxWidth: "300px" }}>
        <SelectWorkout name="workout" />
        <StartFrom name="startFrom" />
        <FieldNumber name="period" label="Периодичность [дней]" />
        <FieldNumber name="amount" label="Количество" />
        <SelectDayTime name="dayTime" />
        <Button onClick={form.handleSubmit(onSubmit)} data-testid="btn-add">
          Добавить расписание
        </Button>
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
      data-testid="date-from"
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
