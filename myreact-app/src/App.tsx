// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css';
import mainPic from './img/main.png';
import closedEye from './img/eye-closed.png';
// import openedEye from './img/eye-open.png';

export function App() {
  return <div className="app">
  <div className="header">
    <h1 className="heading">Дневник пловца</h1>
    <img src={mainPic} width="120"></img>
    <h2 className="navigator">Тренировки</h2>
    <h2 className="navigator">Календарь</h2>
    <h2 className="navigator">Питание</h2>
    <h2 className="navigator">Заметки</h2>
  </div>
  <div className="main">
    <div className="workouts">
      <div className="workouts_heading">
          <h2 className="workouts_heading_name">Тренировки</h2>
          <h3 className="workouts_heading_id">Идентификатор #123</h3>
      </div>
      <div className="workouts_navigator">
          <div className="workouts_navigator_all">
            <h4>Все</h4>
          </div>
          <div className="workouts_navigator_ids">
            <h4>Смотреть идентификаторы</h4>
          </div>
      </div>
      <div className='list_all_workouts'>
        <div className='each_workout'>
          <h4 className='workout_name'>1. Тренировка аэробная 1</h4>
          <img src={closedEye} alt="" style={{ height: "auto", width: "auto", maxWidth: "30px" }} />
        </div>       
      </div>
      <div className="workouts_list">
          <div className="workoutone"></div>
      </div>
    </div>
    <div className='add_workout'>
      <h2>Добавить тренировку</h2>
      <div className='new_workout'>
        <h4>Название тренировки:</h4>
        <h4>Разминка:</h4>
        <h4>Основное:</h4>
        <h4>Заминка:</h4>
        <h4>Объем:</h4>
        <h4>Идентификатор группы:</h4>
      </div>
      <button className='btn_add_workout'>Добавить</button>
    </div>
  </div>
</div>
}

export default App
