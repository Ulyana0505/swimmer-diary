import { fireEvent, render, waitFor } from "@testing-library/react";
import App from "../src/App";

describe("App", () => {
  it("default", async () => {
    const result = render(<App />);
    expect(!!result.getByText("Настройки и данные")).toBeTruthy();

    await waitFor(() => fireEvent.click(result.getByText("Тренировки")));
    expect(!!result.getByText("Добавить тренировку")).toBeTruthy();
  });
});
