import { DayTime } from "./utils.ts";

export type RouteHandle = {
  title: string;
  linkText: string;
};

export interface StoreStruct {
  workouts: WorkoutStruct[];
  workoutOpenId: string;
  workoutSelected: number[];
  tags: TagStruct[];
  schedule: ScheduleRow[];
  scheduleYear: number;
  scheduleMonth: number;
}

export type ScheduleRow = { date: string; workoutId: string; time: DayTime; comment?: string };

export type ScheduleDay = { date: string; children: { time: DayTime; label: string }[] };

export interface StoreFile {
  version: number;
  tags: TagStruct[];
  workouts: WorkoutStruct[];
}

export type TagStruct = {
  id: number;
  label: string;
};

export interface WorkoutStruct {
  id: string;
  label: string;
  warm_up: string;
  basics: string;
  hitch: string;
  volume: string;
  comment: string;
  tags: number[];
}
