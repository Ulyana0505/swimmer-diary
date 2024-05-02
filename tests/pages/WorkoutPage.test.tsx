import { fireEvent, render, waitFor } from "@testing-library/react";
import { TestApp } from "../wrapper";
import WorkoutPage from "../../src/pages/workout";
import { gotoWorkout } from "../../src/utils";
import { Route, Routes } from "react-router-dom";
import { WorkoutEditPage } from "../../src/pages/workout-edit";
import { useMainStore } from "../../src/store";
import { WorkoutStruct } from "../../src/types";

describe("WorkoutPage", () => {
  it("default", async () => {
    const workoutId = "1";
    const marlId = 1;
    const label = "label";
    const mark1 = "mark-1";

    const row = {
      id: workoutId,
      label,
      tags: [1, 2],
      basics: "basics",
      comment: "comment",
      hitch: "hitch",
      volume: "volume",
      warm_up: "warm_up"
    } as WorkoutStruct;

    useMainStore.setState({
      workouts: [row],
      tags: [
        { id: marlId, label: mark1 },
        { id: 2, label: "mark-2" }
      ]
    });
    const result = render(
      <TestApp>
        <WorkoutPage />
      </TestApp>
    );

    await waitFor(async () => fireEvent.click(result.getByText(mark1)));
    expect(useMainStore.getState().workoutSelected).toEqual([marlId]);
    await waitFor(async () => fireEvent.click(result.getByText(label)));
    expect(useMainStore.getState().workoutOpenId).toEqual(workoutId);
    await waitFor(async () => fireEvent.click(result.getByText(label)));
    expect(useMainStore.getState().workoutOpenId).toEqual("");
  });
  it("add", async () => {
    const result = render(
      <TestApp path={gotoWorkout("")}>
        <Routes>
          <Route path={gotoWorkout("")} Component={WorkoutPage} />
          <Route path={gotoWorkout(":editId")} Component={WorkoutEditPage} />
        </Routes>
      </TestApp>
    );
    await waitFor(async () => fireEvent.click(result.getByText("Добавить тренировку")));
    expect(!!result.getByTestId("btn-confirm")).toBeTruthy();
  });
});
