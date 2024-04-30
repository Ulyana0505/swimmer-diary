import { createBrowserRouter } from "react-router-dom";
import MainPage from "./pages/MainPage.tsx";
import WorkoutPage from "./pages/workout";
import SchedulePage from "./pages/SchedulePage.tsx";
import Layout from "./Layout.tsx";
import { RouteHandle } from "./types.ts";
import { WorkoutEditPage } from "./pages/workout-edit";
import { pathSchedule, pathWorkout } from "./utils.ts";
import ScheduleEditPage from "./pages/ScheduleEditPage.tsx";
import NotesPage from "./pages/NotesPage.tsx";

const router = createBrowserRouter(
  [
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
          path: pathSchedule,
          handle: { linkText: "Расписание", title: "Расписание" } as RouteHandle,
          children: [
            {
              index: true,
              path: "",
              Component: SchedulePage,
              handle: { linkText: "Расписание", title: "Расписание" } as RouteHandle
            },
            {
              path: "new",
              Component: ScheduleEditPage,
              handle: {
                linkText: "Добавление расписания",
                title: "Добавление расписания"
              } as RouteHandle
            }
          ]
        },
        {
          path: "notes",
          Component: NotesPage,
          handle: { linkText: "Заметки", title: "Заметки" } as RouteHandle
        }
      ]
    }
  ],
  { basename: "/swimmer-diary/" }
);

export default router;
