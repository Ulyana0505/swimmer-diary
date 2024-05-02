import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Chip, Group, Stack, Text, Textarea, TextInput } from "@mantine/core";
import { useMainStore } from "../../store.ts";
import { nanoid } from "nanoid";
import { WorkoutStruct } from "../../types.ts";
import { modals } from "@mantine/modals";
import { gotoWorkout } from "../../utils.ts";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  id: z.string().optional(),
  label: z.string().trim().min(3, "Минимум 3 символов"),
  warm_up: z.string().trim().optional(),
  basics: z.string().trim().min(5, "Минимум 5 символов"),
  hitch: z.string().trim().optional(),
  volume: z.string().trim().optional(),
  comment: z.string().trim().optional(),
  tags: z.array(z.string())
});

type FormData = z.infer<typeof schema>;

export default function WorkoutEdit({ currentId }: { currentId: string }) {
  const navigate = useNavigate();
  const prev = useMainStore.getState().workouts.find((r) => r.id === currentId);
  const tags = useMainStore(({ tags }) => tags);

  const currentTags = prev ? prev.tags.map(String) : [];
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      ...prev,
      tags: currentTags
    }
  });

  function onSubmit(data: FormData) {
    const { workouts } = useMainStore.getState();
    const tagsNew = data.tags.map(Number);
    if (data.id) {
      const ind = workouts.findIndex((r) => r.id === data.id);
      workouts[ind] = { ...data, tags: tagsNew } as WorkoutStruct;
    } else {
      workouts.unshift({ ...data, id: nanoid(), tags: tagsNew } as WorkoutStruct);
    }
    useMainStore.setState({ workouts: [...workouts] });
    onClose();
  }

  function onClose() {
    navigate(gotoWorkout(""));
  }

  function onRemoveBefore() {
    modals.openConfirmModal({
      title: "Подтверждение",
      children: (
        <Text size="sm">
          Удалить тренировку <q>{prev?.label}</q>?
        </Text>
      ),
      labels: { confirm: "Да", cancel: "Нет" },
      onConfirm: handleRemove
    });
  }

  function handleRemove() {
    const { workouts } = useMainStore.getState();
    useMainStore.setState({ workouts: [...workouts.filter((r) => r.id !== prev?.id)] });
    onClose();
  }

  function onTags(tags: string[]) {
    form.setValue("tags", tags);
  }

  const labelConfirm = prev ? "Сохранить изменения" : "Добавить тренировку";

  return (
    <>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Stack>
            <FieldTextInput
              name="label"
              label="Название тренировки"
              placeholder="Название тренировки"
            />
            <Group>
              <Chip.Group defaultValue={currentTags} onChange={onTags} multiple>
                {tags.map((t) => (
                  <Chip value={String(t.id)} key={t.id} color="orange" size="xs">
                    {t.label}
                  </Chip>
                ))}
              </Chip.Group>
            </Group>
            <FieldTextarea name="warm_up" label="Разминка" placeholder="Разминка" />
            <FieldTextarea name="basics" label="Основное" placeholder="Основное" />
            <FieldTextarea name="hitch" label="Заминка" placeholder="Заминка" />
            <FieldTextarea name="volume" label="Объем" placeholder="Объем" />
            <FieldTextarea name="comment" label="Комментарий" placeholder="Комментарий" />
            <Group>
              {!!prev && (
                <Button variant="outline" color="pink" onClick={onRemoveBefore}>
                  Удалить
                </Button>
              )}
              <Button variant="outline" onClick={onClose}>
                Отмена
              </Button>
              <Button onClick={form.handleSubmit(onSubmit)} data-testid="btn-confirm">
                {labelConfirm}
              </Button>
            </Group>
          </Stack>
        </form>
      </FormProvider>
    </>
  );
}

type Props = {
  name: keyof FormData;
  label: string;
  placeholder: string;
};

function FieldTextInput(p: Props) {
  const {
    register,
    formState: { errors }
  } = useFormContext<FormData>();
  return <TextInput {...p} {...register(p.name)} error={errors[p.name]?.message} />;
}

function FieldTextarea(p: Props) {
  const {
    register,
    formState: { errors }
  } = useFormContext<FormData>();
  return <Textarea autosize {...p} {...register(p.name)} error={errors[p.name]?.message} />;
}
