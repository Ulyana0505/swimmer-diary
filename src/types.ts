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
  schedule: Map<string, ScheduleRow>;
  scheduleRemove: boolean;
  scheduleYear: number;
  scheduleMonth: number;
  noticeDate: string;
}

export type ScheduleRow = {
  date: string;
  children: ScheduleData[];
};

export type ScheduleData = { time: DayTime; workoutId: string; comment?: string };

export type ScheduleDay = {
  date: string;
  children: ScheduleDayData[];
};

export type ScheduleDayData = { time: DayTime; label: string; comment?: string };

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
