import { useParams } from "react-router-dom";
import WorkoutEdit from "./WorkoutEdit.tsx";

export function WorkoutEditPage() {
  const { editId } = useParams();
  return <WorkoutEdit currentId={editId || "-"} />;
}
