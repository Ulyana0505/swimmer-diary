import { Button, Group, Indicator, NumberInput, Popover, Stack, Text } from "@mantine/core";
import { useMainStore } from "../store.ts";
import { useNavigate } from "react-router-dom";
import { getDayTimeLabel, gotoSchedule } from "../utils.ts";
import { ScheduleDay, ScheduleDayData } from "../types.ts";
import { useDisclosure } from "@mantine/hooks";

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
  return (
    <Stack>
      {getFiltered().map((r) => (
        <ViewDay key={r.date} row={r} />
      ))}
    </Stack>
  );
}

function getFiltered() {
  const { schedule, workouts, scheduleYear, scheduleMonth } = useMainStore.getState();
  const mapIds = new Map(workouts.map((r) => [r.id, r.label]));
  const filtered = [] as ScheduleDay[];
  let hasToday = false;
  for (let day = 1; day < 32; day++) {
    const dateKey = `${scheduleYear}-${("0" + scheduleMonth).slice(-2)}-${("0" + day).slice(-2)}`;
    const current = schedule.get(dateKey);
    if (current) {
      filtered.push({
        date: current.date,
        children: current.children.map((r) => ({
          time: r.time,
          label: String(mapIds.get(r.workoutId)),
          comment: r.comment
        }))
      });
      if (current.date === currentDate) hasToday = true;
    }
  }
  if (!hasToday && filtered.length && currentDate.slice(0, 7) === filtered[0].date.slice(0, 7)) {
    filtered.push({ date: currentDate, children: [] });
    filtered.sort((a, b) => a.date.localeCompare(b.date));
  }

  return filtered;
}

function ViewDay({ row }: { row: ScheduleDay }) {
  return (
    <Group bg={currentDate === row.date ? "yellow" : void 0}>
      {row.date}
      <Stack gap={0}>
        {row.children.map((r) => (
          <Group key={r.time}>
            <ViewWorkout data={r} />
          </Group>
        ))}
      </Stack>
    </Group>
  );
}

function ViewWorkout({ data }: { data: ScheduleDayData }) {
  const [opened, { close, open }] = useDisclosure(false);
  const text = `${getDayTimeLabel(data.time)} ${data.label}`;
  if (data.comment) {
    return (
      <Popover width={300} shadow="lg" radius="md" opened={opened}>
        <Popover.Target>
          <Indicator withBorder position="middle-end">
            <Text mr={8} onMouseEnter={open} onMouseLeave={close}>
              {text}
            </Text>
          </Indicator>
        </Popover.Target>
        <Popover.Dropdown style={{ pointerEvents: "none" }}>
          <Text size="sm" style={{ whiteSpace: "pre" }}>
            {data.comment}
          </Text>
        </Popover.Dropdown>
      </Popover>
    );
  } else {
    return <Text mr={8}>{text}</Text>;
  }
}
