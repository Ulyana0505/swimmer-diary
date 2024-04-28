import { fireEvent, render, waitFor } from "@testing-library/react";
import { scheduleRow, TestApp } from "../wrapper";
import NotesPage from "../../src/pages/NotesPage";
import { useMainStore } from "../../src/store";
import { WorkoutStruct } from "../../src/types";

describe("NotesPage", () => {
  it("default", async () => {
    const currentDate = new Date().toJSON().slice(0, 10);
    useMainStore.setState({
      workouts: [{ id: "1", label: "label", tags: [1] } as WorkoutStruct],
      schedule: new Map([scheduleRow(new Date().getDate()), scheduleRow(new Date().getDate() + 1)])
    });
    render(
      <TestApp>
        <NotesPage />
      </TestApp>
    );
    expect(useMainStore.getState().noticeDate).toEqual(currentDate);
  });
  it("with noticeDate", async () => {
    const currentDate = new Date().toJSON().slice(0, 10);
    const d = new Date();
    d.setDate(d.getDate() + 1);
    const tomorrow = d.toJSON().slice(0, 10);
    useMainStore.setState({
      noticeDate: currentDate,
      workouts: [{ id: "1", label: "label", tags: [1] } as WorkoutStruct],
      schedule: new Map([scheduleRow(new Date().getDate()), scheduleRow(new Date().getDate() + 1)])
    });
    const result = render(
      <TestApp>
        <NotesPage />
      </TestApp>
    );

    const comment = "first comment";

    const btnPrev = result.getByTestId("btn-prev");
    const btnNext = result.getByTestId("btn-next");

    await waitFor(() => fireEvent.click(btnPrev));
    expect(useMainStore.getState().noticeDate).toEqual(currentDate);

    // добавляем комментарий
    await waitFor(() =>
      fireEvent.change(result.container.querySelector("textarea")!, {
        target: { value: comment }
      })
    );
    await waitFor(() => fireEvent.blur(result.container.querySelector("textarea")!));

    // нажимаем вперед (даты смещаются вперед, но только по существующим дням расписания)
    await waitFor(() => fireEvent.click(btnNext));
    expect(useMainStore.getState().noticeDate).toEqual(tomorrow);
    await waitFor(() => fireEvent.click(btnNext));
    expect(useMainStore.getState().noticeDate).toEqual(tomorrow);

    // на указанную дату - нет комментария
    expect(result.container.querySelector("textarea")!.value).toEqual("");
    // на предыдущую мы выше ввели
    await waitFor(() => fireEvent.click(btnPrev));
    expect(result.container.querySelector("textarea")!.value).toEqual(comment);
  });
});
