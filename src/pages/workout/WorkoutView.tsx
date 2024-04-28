import { WorkoutStruct } from "../../types.ts";
import { useMainStore } from "../../store.ts";
import { Box, Chip, Group } from "@mantine/core";
import IconEdit from "../../assets/edit.svg?react";
import styles from "./WorkoutView.module.css";
import classNames from "classnames";
import { Link } from "react-router-dom";
import { gotoWorkout, tagsIdToString } from "../../utils.ts";

export default function WorkoutView({ data }: { data: WorkoutStruct }) {
  const { tags } = useMainStore.getState();
  const workoutOpenId = useMainStore(({ workoutOpenId }) => workoutOpenId);
  if (workoutOpenId !== data.id) {
    return <WorkoutTitle data={data} currentId={workoutOpenId} />;
  }
  return (
    <>
      <WorkoutTitle data={data} currentId={workoutOpenId} />
      <Box pl="0.5em">
        {data.warm_up && (
          <pre className={styles.pre} data-prefix="Разминка">
            {data.warm_up}
          </pre>
        )}
        <pre className={styles.pre} data-prefix="Основное">
          {data.basics}
        </pre>
        {data.hitch && (
          <pre className={styles.pre} data-prefix="Заминка">
            {data.hitch}
          </pre>
        )}
        {data.volume && (
          <pre className={styles.pre} data-prefix="Объем">
            {data.volume}
          </pre>
        )}
        {!!data.tags.length && (
          <>
            {tagsIdToString(tags, data.tags).map((label) => (
              <Chip variant="outline" key={label} color="orange" hidden checked size="xs">
                {label}
              </Chip>
            ))}
          </>
        )}
        {!!data.comment && (
          <pre className={styles.pre} data-prefix="Комментарий">
            {data.comment}
          </pre>
        )}
      </Box>
    </>
  );
}

function WorkoutTitle({ data, currentId }: { data: WorkoutStruct; currentId: string }) {
  return (
    <Group>
      <button
        className={classNames(styles.button, currentId === data.id && styles.active)}
        onClick={() => handleOpen(data.id)}>
        {data.label}
      </button>
      <Link to={gotoWorkout(data.id)}>
        <IconEdit width={20} height={20} fill="none" />
      </Link>
    </Group>
  );
}

function handleOpen(id: string) {
  const current = useMainStore.getState().workoutOpenId;
  useMainStore.setState({ workoutOpenId: current === id ? "" : id });
}
