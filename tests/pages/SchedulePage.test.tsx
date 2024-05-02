import { fireEvent, render, waitFor } from "@testing-library/react";
import { scheduleRow, TestApp } from "../wrapper";
import SchedulePage from "../../src/pages/SchedulePage";
import { useMainStore } from "../../src/store";
import { ScheduleRow, WorkoutStruct } from "../../src/types";

describe("SchedulePage", () => {
  it("default", async () => {
    const id = "1";
    const label = "label";
    const mark1 = "mark-1";
    const currentDate = new Date().toJSON().slice(0, 10);
    const row = {
      date: currentDate,
      children: [
        { time: 0, workoutId: id, comment: "comment" },
        { time: 1, workoutId: id }
      ]
    } as ScheduleRow;
    useMainStore.setState({
      workouts: [{ id, label, tags: [1, 2] } as WorkoutStruct],
      schedule: new Map([[row.date, row]]),
      tags: [
        { id: 1, label: mark1 },
        { id: 2, label: "mark-2" }
      ]
    });
    const result = render(
      <TestApp>
        <SchedulePage />
      </TestApp>
    );

    expect(!!result.getByText(currentDate)).toBeTruthy();

    for (const year of [2020, 1980]) {
      const inputYear = result.getByTestId("input-year");
      await waitFor(() => fireEvent.change(inputYear, { target: { value: String(year) } }));
    }
    expect(useMainStore.getState().scheduleYear).toEqual(2020);

    for (const month of [10, 13, 0, -1]) {
      const inputMonth = result.getByTestId("input-month");
      await waitFor(() => fireEvent.change(inputMonth, { target: { value: String(month) } }));
    }
    expect(useMainStore.getState().scheduleMonth).toEqual(12);
  });
  it("without today", async () => {
    const id = "1";
    const label = "label";

    useMainStore.setState({
      workouts: [{ id, label, tags: [1] } as WorkoutStruct],
      tags: [{ id: 1, label: "mark-1" }],
      scheduleYear: new Date().getFullYear(),
      scheduleMonth: new Date().getMonth() + 1,
      schedule: new Map([scheduleRow(1), scheduleRow(2), scheduleRow(3)])
    });

    render(
      <TestApp>
        <SchedulePage />
      </TestApp>
    );
  });
  it("remove", async () => {
    const id = "1";
    const label = "label";

    useMainStore.setState({
      workouts: [{ id, label, tags: [1] } as WorkoutStruct],
      tags: [{ id: 1, label: "mark-1" }],
      scheduleYear: new Date().getFullYear(),
      scheduleMonth: new Date().getMonth() + 1,
      schedule: new Map([
        scheduleRow(1),
        scheduleRow(2),
        scheduleRow(3),
        scheduleRow(new Date().getDate()),
        scheduleRow(new Date().getDate() + 1)
      ])
    });

    const result = render(
      <TestApp>
        <SchedulePage />
      </TestApp>
    );

    await waitFor(() => fireEvent.click(result.getByText("режим удаления")));
    await waitFor(() => fireEvent.click(result.getAllByTestId("btn-remove")[0]));
    await waitFor(() => fireEvent.click(result.getAllByTestId("btn-remove")[0]));
  });
});
