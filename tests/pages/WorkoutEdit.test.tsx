import { act, fireEvent, render, waitFor } from "@testing-library/react";
import { TestApp, testModalProps, timer } from "../wrapper";
import { WorkoutEditPage } from "../../src/pages/workout-edit";
import { gotoWorkout } from "../../src/utils";
import { useMainStore } from "../../src/store";
import { WorkoutStruct } from "../../src/types";
import { Route, Routes } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import WorkoutPage from "../../src/pages/workout";

const user = userEvent.setup();
describe("WorkoutEditPage", () => {
  it("new", async () => {
    const result = render(
      <TestApp path={gotoWorkout("")}>
        <WorkoutEditPage />
      </TestApp>
    );

    const inputLabel = result.container.querySelector(`[name="label"]`) as HTMLInputElement;
    const inputBasic = result.container.querySelector(`[name="basics"]`) as HTMLInputElement;

    await user.click(inputLabel);
    await user.keyboard("label");

    await user.click(inputBasic);
    await user.keyboard("basics");

    await waitFor(async () => fireEvent.click(result.getByTestId("btn-confirm")));
    await act(async () => {
      await timer();
    });

    expect(useMainStore.getState().workouts[0].label).toEqual("label");
  });
  it("edit", async () => {
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
      <TestApp path={gotoWorkout(id)}>
        <Routes>
          <Route path={gotoWorkout("")} Component={WorkoutPage} />
          <Route path={gotoWorkout(":editId")} Component={WorkoutEditPage} />
        </Routes>
      </TestApp>
    );

    expect(!!result.getByDisplayValue(label)).toBeTruthy();

    const inputLabel = result.container.querySelector(`[name="label"]`) as HTMLInputElement;
    const inputBasic = result.container.querySelector(`[name="basics"]`) as HTMLInputElement;

    await user.click(inputLabel);
    await user.keyboard("-2");

    await user.click(inputBasic);
    await user.keyboard("basics");

    await waitFor(async () => fireEvent.click(result.getByText(mark1)));

    await waitFor(async () => fireEvent.click(result.getByTestId("btn-confirm")));
    await act(async () => {
      await timer();
    });

    expect(useMainStore.getState().workouts[0].label).toEqual("label-2");
    expect(useMainStore.getState().workouts[0].tags).toEqual([2]);
  });
  it("remove", async () => {
    const id = "1";
    const label = "label";
    useMainStore.setState({
      workouts: [{ id, label, tags: [1, 2] } as WorkoutStruct],
      tags: [
        { id: 1, label: "1" },
        { id: 2, label: "2" }
      ]
    });
    const result = render(
      <TestApp path={gotoWorkout(id)}>
        <Routes>
          <Route path={gotoWorkout("")} Component={WorkoutPage} />
          <Route path={gotoWorkout(":editId")} Component={WorkoutEditPage} />
        </Routes>
      </TestApp>
    );

    await waitFor(async () => fireEvent.click(result.getByText("Удалить")));
    await act(async () => {
      await timer();
    });

    act(testModalProps(0).onConfirm);
    expect(useMainStore.getState().workouts.length).toEqual(0);
  });
});
