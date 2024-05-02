import { RouterProvider } from "react-router-dom";
import { createTheme, MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { DatesProvider } from "@mantine/dates";
import router from "./router.tsx";
import "dayjs/locale/ru";
import "./index.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";

const theme = createTheme({});

function App() {
  return (
    <MantineProvider theme={theme}>
      <DatesProvider settings={{ locale: "ru" }}>
        <ModalsProvider>
          <Notifications position="bottom-right" />
          <RouterProvider router={router} />
        </ModalsProvider>
      </DatesProvider>
    </MantineProvider>
  );
}

export default App;
