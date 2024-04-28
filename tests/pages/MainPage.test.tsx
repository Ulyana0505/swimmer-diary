import { act, fireEvent, render, waitFor } from "@testing-library/react";
import { TestApp, testModalProps, testModalsLength, timer } from "../wrapper";
import MainPage, { handleLoad } from "../../src/pages/MainPage";
import { useMainStore } from "../../src/store";
import { StoreFile, WorkoutStruct } from "../../src/types";
import { appDataVersion } from "../../src/utils";

describe("MainPage", () => {
  it("default", async () => {
    const result = render(
      <TestApp>
        <MainPage />
      </TestApp>
    );

    const btnAdd = result.getByTestId("add-tag");
    const input = result.getByTestId("input-tag") as HTMLInputElement;

    await waitFor(() => fireEvent.click(btnAdd));

    const label_new_tag = "new-tag";

    // добавляем тег - значение очищается
    input.value = label_new_tag;
    await waitFor(() => fireEvent.click(btnAdd));
    expect(input.value).toEqual("");

    // добавляем тег уже существующий - значение не очищается
    input.value = label_new_tag;
    await waitFor(() => fireEvent.click(btnAdd));
    expect(input.value).toEqual(label_new_tag);

    // добавляем еще новый тег - значение очищается
    input.value = label_new_tag + "-2";
    await waitFor(() => fireEvent.click(btnAdd));
    expect(input.value).toEqual("");

    const buttonsEdit = result.getAllByTestId("edit-tag");
    const inputsEdit = result.getAllByTestId("content-tag") as HTMLInputElement[];

    // редактирование без изменений
    await waitFor(() => fireEvent.click(buttonsEdit[0]));
    await waitFor(() => fireEvent.click(buttonsEdit[0]));

    // редактирование - с таким же именем
    await waitFor(() => fireEvent.click(buttonsEdit[0]));
    inputsEdit[0].value = label_new_tag + "-2";
    await waitFor(() => fireEvent.click(buttonsEdit[0]));
    expect(result.getAllByText("Есть метка с таким же именем").length).toEqual(1);

    // удаление при редактировании (если поле ввода пустое)
    inputsEdit[0].value = "";
    await waitFor(() => fireEvent.click(buttonsEdit[0]));
    expect(testModalsLength()).toEqual(1);

    // берем кнопки диалога подтверждения на удаление
    const { onCancel, onConfirm } = testModalProps(0);
    // выполняем отмену
    act(onCancel);

    // выполняем подтверждение удаления - при этом во всех тренировках этот тег будет удален
    useMainStore.setState({
      workouts: [{ id: "id", tags: [1, 2] } as WorkoutStruct],
      workoutSelected: [1]
    });
    act(onConfirm);
    expect(useMainStore.getState().workouts[0].tags).toEqual([2]);

    result.unmount();
  });
  it("save", async () => {
    global.URL.createObjectURL = jest.fn();
    global.URL.revokeObjectURL = jest.fn();

    const result = render(
      <TestApp>
        <MainPage />
      </TestApp>
    );

    const _err = console.error;
    console.error = jest.fn();
    waitFor(() => fireEvent.click(result.getByText("Сохранить в файл")));
    await timer();
    console.error = _err;

    expect(global.URL.createObjectURL).toBeCalledTimes(1);
  });

  it("handleLoad", async () => {
    expect(await handleLoad(null)).toEqual(false);
    expect(await handleLoad(new File([], ""))).toEqual(false);
    expect(await handleLoad(await json_file({}))).toEqual(false);
    expect(
      await handleLoad(
        await json_file({
          version: appDataVersion,
          tags: [],
          workouts: []
        } as StoreFile)
      )
    ).toEqual(true);
  });
});

// eslint-disable-next-line
async function json_file(obj: any) {
  const bstr = JSON.stringify(obj);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  const file = new File([u8arr], "file-name.json", { type: "application/json" });
  return Promise.resolve(file);
}
