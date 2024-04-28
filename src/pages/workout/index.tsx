import { gotoWorkout } from "../../utils.ts";
import { Button, Chip, Group, Stack } from "@mantine/core";
import { useMainStore } from "../../store.ts";
import WorkoutView from "./WorkoutView.tsx";
import { useNavigate } from "react-router-dom";

export default function WorkoutPage() {
  return <WorkoutList />;
}

function WorkoutList() {
  const navigate = useNavigate();
  const workouts = useMainStore(({ workouts }) => workouts);
  const selected = useMainStore(({ workoutSelected }) => workoutSelected);

  function onAddWorkout() {
    navigate(gotoWorkout("new"));
  }

  return (
    <>
      <Group mb={12}>
        <Button variant="outline" color="violet" radius="xl" size="xs" onClick={onAddWorkout}>
          Добавить тренировку
        </Button>
        <TagsSelector />
      </Group>
      <Stack gap={4}>
        {workouts
          .filter((r) => (selected.length ? r.tags.find((t) => selected.includes(t)) : true))
          .map((r) => (
            <WorkoutView key={r.id} data={r} />
          ))}
      </Stack>
    </>
  );
}

function TagsSelector() {
  const selected = useMainStore(({ workoutSelected }) => workoutSelected);
  const tags = useMainStore(({ tags }) => tags);

  return (
    <Chip.Group defaultValue={selected.map(String)} onChange={handleChanged} multiple>
      {tags.map((t) => (
        <Chip value={String(t.id)} key={t.id} color="orange" size="xs">
          {t.label}
        </Chip>
      ))}
    </Chip.Group>
  );
}

function handleChanged(rows: string[] | string) {
  useMainStore.setState({ workoutSelected: (rows as string[]).map(Number) });
}
