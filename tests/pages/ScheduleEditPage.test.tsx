import { fireEvent, render, waitFor } from "@testing-library/react";
import { TestApp } from "../wrapper";
import ScheduleEditPage from "../../src/pages/ScheduleEditPage";
import { gotoSchedule } from "../../src/utils";
import { Route, Routes } from "react-router-dom";
import SchedulePage from "../../src/pages/SchedulePage";
import { useMainStore } from "../../src/store";
import { WorkoutStruct } from "../../src/types";
import userEvent from "@testing-library/user-event";

const user = userEvent.setup();

describe("ScheduleEditPage", () => {
  it("default", async () => {
    const id = "1";
    const label = "label";
    const mark1 = "mark-1";
    useMainStore.setState({
      workouts: [{ id, label, tags: [1, 2] } as WorkoutStruct],
      tags: [
        { id: 1, label: mark1 },
        { id: 2, label: "mark-2" }
      ]
    });
    const result = render(
      <TestApp path={gotoSchedule("new")}>
        <Routes>
          <Route path={gotoSchedule("")} Component={SchedulePage} />
          <Route path={gotoSchedule("new")} Component={ScheduleEditPage} />
        </Routes>
      </TestApp>
    );

    async function selectFirstWorkout() {
      const inputSelect = result.getByPlaceholderText("Выберите тренировку");
      await user.click(inputSelect);
      await user.keyboard("[ArrowDown][Enter]");
    }

    const inputPeriod = result.container.querySelector(`[name="period"]`) as HTMLInputElement;
    const inputDate = result.getByTestId("date-from");

    await selectFirstWorkout();

    await user.click(inputPeriod);
    await user.keyboard("[Backspace]2");

    await waitFor(async () => fireEvent.change(inputDate, { target: { value: "02.02.2020" } }));
    await user.click(result.getByText("вечер"));
    await user.click(result.getByTestId("btn-add"));

    expect(useMainStore.getState().schedule.size).toEqual(1);

    // добавляем вторую тренировку
    await user.click(result.getByText("Добавить тренировку"));
    await selectFirstWorkout();
    await user.click(result.getByTestId("btn-add"));
    expect(useMainStore.getState().schedule.size).toEqual(2);

    // перезаписываем существующую тренировку
    await user.click(result.getByText("Добавить тренировку"));
    await selectFirstWorkout();
    await user.click(result.getByTestId("btn-add"));
    expect(useMainStore.getState().schedule.get("2024-04-20")!.children.length).toEqual(1);

    // добавляем к существующему тренировочному дню еще одно время
    await user.click(result.getByText("Добавить тренировку"));
    await selectFirstWorkout();
    await user.click(result.getByText("вечер"));
    await user.click(result.getByTestId("btn-add"));
    expect(useMainStore.getState().schedule.get("2024-04-20")!.children.length).toEqual(2);
  });
});
