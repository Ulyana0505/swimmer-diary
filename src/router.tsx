import { createBrowserRouter } from "react-router-dom";
import MainPage from "./pages/MainPage.tsx";
import WorkoutPage from "./pages/workout";
import CalendarPage from "./pages/CalendarPage.tsx";
import NutritionPage from "./pages/NutritionPage.tsx";
import NotesPage from "./pages/NotesPage.tsx";
import Layout from "./Layout.tsx";
import { RouteHandle } from "./types.ts";
import { WorkoutEditPage } from "./pages/workout-edit";
import { pathWorkout } from "./utils.ts";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      {
        index: true,
        path: "",
        Component: MainPage,
        handle: { linkText: "Главная", title: "Дневник пловца" } as RouteHandle
      },
      {
        path: pathWorkout,
        handle: { linkText: "Тренировки", title: "Тренировки" } as RouteHandle,
        children: [
          {
            index: true,
            path: "",
            Component: WorkoutPage,
            handle: { linkText: "Тренировки", title: "Тренировки" } as RouteHandle
          },
          {
            path: ":editId",
            Component: WorkoutEditPage,
            handle: {
              linkText: "Редактирование",
              title: "Редактирование тренировки"
            } as RouteHandle
          }
        ]
      },
      {
        path: "calendar",
        Component: CalendarPage,
        handle: { linkText: "Календарь", title: "Календарь" } as RouteHandle
      },
      {
        path: "nutrition",
        Component: NutritionPage,
        handle: { linkText: "Питание", title: "Питание" } as RouteHandle
      },
      {
        path: "notes",
        Component: NotesPage,
        handle: { linkText: "Заметки", title: "Заметки" } as RouteHandle
      }
    ]
  }
]);

if (import.meta.hot) {
  import.meta.hot.dispose(() => router.dispose());
}

export default router;
