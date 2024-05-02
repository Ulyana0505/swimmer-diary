import React, { useEffect, useMemo } from "react";
import { useMainStore } from "../store.ts";
import { ActionIcon, Group, Stack, Text, Textarea } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import IconLeft from "../assets/arrow-left.svg?react";
import IconRight from "../assets/arrow-right.svg?react";
import { ScheduleData } from "../types.ts";
import { getDayTimeLabel } from "../utils.ts";

export default function NotesPage() {
  useEffect(() => {
    const { noticeDate, schedule } = useMainStore.getState();
    if (!noticeDate) {
      let selectedDate = "";
      const current = new Date().toJSON().slice(0, 10);
      const currentDay = +current.slice(8, 10);
      for (const row of schedule.values()) {
        if (row.date.slice(0, 7) == current.slice(0, 7) && +row.date.slice(8, 10) <= currentDay) {
          selectedDate = row.date;
        }
      }
      useMainStore.setState({ noticeDate: selectedDate });
    }
  }, []);
  return <ViewNotes />;
}

function ViewNotes() {
  const noticeDate = useMainStore(({ noticeDate }) => noticeDate);
  if (!noticeDate) {
    return null;
  }
  return (
    <Stack>
      <Group align="center" gap={3}>
        <ActionIcon variant="transparent" onClick={handlePrev} data-testid="btn-prev">
          <IconLeft width={26} height={26} fill="none" />
        </ActionIcon>
        <DateInput
          key={noticeDate}
          valueFormat="DD.MM.YYYY"
          value={new Date(noticeDate)}
          readOnly
        />
        <ActionIcon variant="transparent" onClick={handleNext} data-testid="btn-next">
          <IconRight width={26} height={26} fill="none" />
        </ActionIcon>
      </Group>
      <ViewComments />
    </Stack>
  );
}

function handlePrev() {
  setNoticeDate(-1);
}

function handleNext() {
  setNoticeDate(1);
}

function setNoticeDate(delta: 1 | -1) {
  const { noticeDate, schedule } = useMainStore.getState();
  const list = [...schedule.values()];
  const pos = list.map((r) => r.date).indexOf(noticeDate);
  if (pos > -1) {
    const nextRow = list[pos + delta];
    if (nextRow) {
      useMainStore.setState({ noticeDate: nextRow.date });
    }
  }
}

function ViewComments() {
  const workouts = useMainStore(({ workouts }) => workouts);
  const mapIds = useMemo(() => new Map(workouts.map((r) => [r.id, r.label])), [workouts]);
  const dataRow = useMainStore(({ noticeDate, schedule }) => schedule.get(noticeDate));
  return (
    <>
      {dataRow && (
        <Stack key={dataRow.date}>
          {dataRow.children.map((r) => (
            <ViewComment key={r.time} date={dataRow.date} data={r} mapIds={mapIds} />
          ))}
        </Stack>
      )}
    </>
  );
}

function ViewComment({
  date,
  data,
  mapIds
}: {
  date: string;
  data: ScheduleData;
  mapIds: Map<string, string>;
}) {
  function handleComment(e: React.FocusEvent<HTMLTextAreaElement>) {
    const { schedule } = useMainStore.getState();
    const row = schedule.get(date);
    if (row) {
      const selected = row.children.find((r) => r.time === data.time);
      if (selected) {
        selected.comment = e.target.value.trim();
        useMainStore.setState({ schedule: schedule.set(date, JSON.parse(JSON.stringify(row))) });
      }
    }
  }

  return (
    <Stack gap={3}>
      <Text>{`${getDayTimeLabel(data.time)} ${mapIds.get(data.workoutId)}`}</Text>
      <Textarea defaultValue={data.comment} onBlur={handleComment} autosize />
    </Stack>
  );
}
