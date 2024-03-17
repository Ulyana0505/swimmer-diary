import { gotoWorkout, tagsIdToString, tagsStringToId, tagsToString } from "../../utils.ts";
import { Button, Chip, Group, MultiSelect, Stack } from "@mantine/core";
import { useMainStore } from "../../store.ts";
import WorkoutView from "../workout-edit/WorkoutView.tsx";
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
  if (tags.length > 10) {
    return (
      <MultiSelect
        placeholder="Выбрать по метке"
        data={tagsToString(tags)}
        defaultValue={tagsIdToString(tags, selected)}
        clearable
        radius="xl"
        onChange={(rows) => useMainStore.setState({ workoutSelected: tagsStringToId(tags, rows) })}
      />
    );
  }

  return (
    <Chip.Group defaultValue={selected.map(String)} onChange={handleChanged} multiple>
      {tags.map((t) => (
        <Chip value={t.id} key={t.id} checked={selected.includes(t.id)} color="orange" size="xs">
          {t.label}
        </Chip>
      ))}
    </Chip.Group>
  );
}

function handleChanged(rows: string[] | string) {
  if (Array.isArray(rows)) {
    useMainStore.setState({ workoutSelected: rows.map(Number) });
  }
}
