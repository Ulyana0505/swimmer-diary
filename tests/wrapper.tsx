import { createTheme, MantineProvider } from "@mantine/core";
import { DatesProvider } from "@mantine/dates";
import { ModalsProvider, useModals } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { MemoryRouter } from "react-router-dom";
import { ReactNode } from "react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { ModalsContextProps } from "@mantine/modals/lib/context";
import "dayjs/locale/ru";
import { ScheduleRow } from "../src/types";

const theme = createTheme({});

const modals = { current: null as null | ModalsContextProps };

export function testModalsLength() {
  return modals.current.modals.length;
}

export function testModalProps(index: number) {
  return modals.current.modals[index].props as {
    onCancel: () => void;
    onConfirm: () => void;
    title: string;
  };
}

function Test({ children }: { children: ReactNode }) {
  modals.current = useModals();
  return <>{children}</>;
}

export function TestApp({ children, path }: { children: ReactNode; path?: string }) {
  return (
    <MantineProvider theme={theme}>
      <DatesProvider settings={{ locale: "ru" }}>
        <ModalsProvider>
          <Notifications position="bottom-right" />
          <MemoryRouter initialEntries={[path || "/"]}>
            <Test>{children}</Test>
          </MemoryRouter>
        </ModalsProvider>
      </DatesProvider>
    </MantineProvider>
  );
}

export async function timer(t = 0) {
  return new Promise((r) => setTimeout(r, t));
}

export function scheduleRow(day_source: number) {
  const now = new Date();
  now.setDate(day_source);
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const date = `${year}-${("0" + month).slice(-2)}-${("0" + day).slice(-2)}`;
  const row = {
    date,
    children: [
      { time: 0, workoutId: "1" },
      { time: 1, workoutId: "1" }
    ]
  } as ScheduleRow;
  return [row.date, row] as [string, ScheduleRow];
}
