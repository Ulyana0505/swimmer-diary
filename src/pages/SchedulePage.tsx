import { Button, Group, NumberInput, Stack } from "@mantine/core";
import { useMainStore } from "../store.ts";
import { useNavigate } from "react-router-dom";
import { getDayTimeLabel, gotoSchedule } from "../utils.ts";
import { ScheduleDay } from "../types.ts";

const currentDate = new Date().toJSON().slice(0, 10);

export default function SchedulePage() {
  const { scheduleMonth, scheduleYear } = useMainStore(({ scheduleMonth, scheduleYear }) => ({
    scheduleMonth,
    scheduleYear
  }));
  const navigate = useNavigate();

  function handleAdd() {
    navigate(gotoSchedule("new"));
  }

  return (
    <>
      <Stack>
        <Group align="flex-end">
          <NumberInput
            key={scheduleYear}
            label="Год"
            min={2000}
            max={2050}
            defaultValue={scheduleYear}
            onChange={handleYear}
          />
          <NumberInput
            key={scheduleMonth}
            label="Месяц"
            min={0}
            max={13}
            defaultValue={scheduleMonth}
            onChange={handleMonth}
          />
          <Button variant="outline" color="violet" radius="xl" onClick={handleAdd}>
            Добавить тренировку
          </Button>
        </Group>
        <ViewTable />
      </Stack>
    </>
  );
}

function handleYear(valSrc: number | string) {
  const val = valSrc as number;
  if (val > 1999 && val < 2051) {
    useMainStore.setState({ scheduleYear: val });
  }
}

function handleMonth(valSrc: number | string) {
  const val = valSrc as number;
  if (val > 0 && val < 13) {
    useMainStore.setState({ scheduleMonth: val });
  } else if (val === 0) {
    const { scheduleYear } = useMainStore.getState();
    useMainStore.setState({ scheduleMonth: 12, scheduleYear: scheduleYear - 1 });
  } else if (val === 13) {
    const { scheduleYear } = useMainStore.getState();
    useMainStore.setState({ scheduleMonth: 1, scheduleYear: scheduleYear + 1 });
  }
}

function ViewTable() {
  const { schedule, workouts, scheduleYear, scheduleMonth } = useMainStore.getState();
  const mapIds = new Map(workouts.map((r) => [r.id, r.label]));
  const currentList = schedule.filter((r) =>
    r.date.startsWith(`${scheduleYear}-${("0" + scheduleMonth).slice(-2)}-`)
  );
  let hasToday = false;
  const grouped = [] as ScheduleDay[];
  for (const row of currentList) {
    let current = grouped[grouped.length - 1];
    if (!current || current.date !== row.date) {
      grouped.push({
        date: row.date,
        children: []
      });
      current = grouped[grouped.length - 1];
    }
    current.children.push({ time: row.time, label: String(mapIds.get(row.workoutId)) });
    if (row.date === currentDate) hasToday = true;
  }

  if (!hasToday) {
    grouped.push({ date: currentDate, children: [] });
    grouped.sort((a, b) => a.date.localeCompare(b.date));
  }

  return (
    <Stack>
      {grouped.map((r) => (
        <ViewDay key={r.date} row={r} />
      ))}
    </Stack>
  );
}

function ViewDay({ row }: { row: ScheduleDay }) {
  return (
    <Group bg={currentDate === row.date ? "yellow" : void 0}>
      {row.date}
      <Stack gap={0}>
        {row.children.map((r) => (
          <Group key={r.time}>
            {getDayTimeLabel(r.time)} {r.label}
          </Group>
        ))}
      </Stack>
    </Group>
  );
}
