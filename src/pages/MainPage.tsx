import { appDataVersion } from "../utils.ts";
import {
  ActionIcon,
  Button,
  FileButton,
  Group,
  Stack,
  Text,
  TextInput,
  Title
} from "@mantine/core";
import { useMainStore } from "../store.ts";
import { StoreFile, TagStruct } from "../types.ts";
import { notificationError, notificationSuccess } from "../notification.ts";
import { useRef, useState } from "react";
import IconEdit from "../assets/edit.svg?react";
import IconAdd from "../assets/add.svg?react";
import { modals } from "@mantine/modals";

export default function MainPage() {
  return (
    <>
      <Stack>
        <Title order={5}>Настройки и данные</Title>
        <Group>
          <FileButton onChange={handleLoad} accept=".json">
            {(props) => <Button {...props}>Загрузить из файла</Button>}
          </FileButton>
          <Button onClick={handleSave}>Сохранить в файл</Button>
        </Group>
        <Title order={5}>Список меток</Title>
        <ViewTags />
      </Stack>
    </>
  );
}

function ViewTags() {
  const tags = useMainStore(({ tags }) => tags);
  return (
    <Stack>
      <AddTag />
      {tags.map((r) => (
        <TagEdit row={r} key={r.id} />
      ))}
    </Stack>
  );
}

function AddTag() {
  const ref = useRef<HTMLInputElement>(null);

  function handleAdd() {
    const value = ref.current!.value.trim();
    if (!value) return;
    const { tags } = useMainStore.getState();
    if (tags.find((r) => r.label === value)) return;
    const nextId = Math.max.apply(null, [0, ...tags.map((r) => r.id)]) + 1;
    tags.push({ id: nextId, label: value });
    tags.sort((a, b) => a.label.localeCompare(b.label));
    useMainStore.setState({ tags: [...tags] });
    ref.current!.value = "";
  }

  return (
    <Group>
      <TextInput ref={ref} />
      <ActionIcon variant="transparent" onClick={handleAdd}>
        <IconAdd width={30} height={30} fill="none" />
      </ActionIcon>
    </Group>
  );
}

function TagEdit({ row }: { row: TagStruct }) {
  const [edit, setEdit] = useState(false);

  const ref = useRef<HTMLInputElement>(null);

  function handleEdit() {
    let nextState = !edit;
    if (edit && ref.current) {
      const value = ref.current.value.trim();
      const { tags } = useMainStore.getState();
      const ind = tags.findIndex((r) => r.id === row.id);
      if (value) {
        if (tags.find((r) => r.label === value && r.id !== row.id)) {
          nextState = true;
          notificationError("Есть метка с таким же именем");
        } else {
          tags[ind].label = value;
          tags.sort((a, b) => a.label.localeCompare(b.label));
          useMainStore.setState({ tags: [...tags] });
        }
      } else {
        modals.openConfirmModal({
          title: "Подтверждение",
          children: (
            <Text size="sm">
              Удалить метку <q>{tags[ind].label}</q>?
            </Text>
          ),
          labels: { confirm: "Да", cancel: "Нет" },
          onConfirm: () => handleTagRemove(row.id),
          onCancel: () => {
            setEdit(true);
          }
        });
      }
    }
    setEdit(nextState);
  }

  return (
    <Group>
      <TextInput defaultValue={row.label} ref={ref} disabled={!edit} />
      <ActionIcon variant="transparent" onClick={handleEdit}>
        <IconEdit width={20} height={20} fill="none" />
      </ActionIcon>
    </Group>
  );
}

function handleTagRemove(id: number) {
  const { tags, workouts, workoutSelected } = useMainStore.getState();

  for (const row of workouts) {
    row.tags = row.tags.filter((r) => r !== id);
  }

  useMainStore.setState({
    tags: tags.filter((r) => r.id !== id),
    workouts: [...workouts],
    workoutSelected: [...workoutSelected.filter((r) => r === id)]
  });
}

function handleSave() {
  const { workouts, tags } = useMainStore.getState();
  const json: StoreFile = { version: appDataVersion, tags, workouts };
  const data = JSON.stringify(json);
  const blob = new Blob([data], { type: "application/json" });
  const jsonObjectUrl = URL.createObjectURL(blob);

  const date = new Date().toJSON().substring(0, 19).replace("T", "_").replace(/:/g, "-");
  const filename = `swimmer-diary-${date}.json`;
  const anchor = document.createElement("a");
  anchor.href = jsonObjectUrl;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(jsonObjectUrl);
}

function handleLoad(file: File | null) {
  if (!file) return;

  const reader = new FileReader();
  reader.addEventListener("load", function (e) {
    const text = e.target?.result;
    if (typeof text == "string") {
      try {
        const data = JSON.parse(text) as StoreFile;
        if (data.version === appDataVersion) {
          useMainStore.setState({ workouts: data.workouts, tags: data.tags });
          notificationSuccess("Файл успешно загружен");
        } else {
          notificationError("Версия файла не совпадает с актуальной");
        }
      } catch (e) {
        notificationError("Ошибка при чтении файла");
      }
    }
  });
  reader.readAsText(file);
}
