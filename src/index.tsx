import { ReactNode } from "react";

export function Header() {
    return <div className="header">
        <h1 className="heading">Дневник пловца</h1>
        <img src="../img/main.png" width="120"></img>
        <h2 className="navigator">Тренировки</h2>
        <h2 className="navigator">Календарь</h2>
        <h2 className="navigator">Питание</h2>
        <h2 className="navigator">Заметки</h2>
    </div>
}

export function Main() {
    return <div className="main">
    <div className="workouts">
        <div className="workouts_heading">
            <h2 className="workouts_heading_name">Тренировкт</h2>
            <h3 className="workouts_heading_id">Идентификатор #123</h3>
        </div>
        <div className="workouts_navigator">
            <div className="workouts_navigator_all">Все</div>
            <div className="workouts_navigator_ids">Идентификаторы</div>
        </div>
        <div className="workouts_list">
            <div className="workoutone"></div>
        </div>
    </div>
</div>
}

// style={{ fontWeight: "600" }}