import { notifications } from "@mantine/notifications";

export function notificationError(message: string) {
  notifications.show({
    color: "red",
    title: "Ошибка",
    message
  });
}

export function notificationSuccess(message: string) {
  notifications.show({
    title: "Выполнено",
    message: message
  });
}
