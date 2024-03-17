export type RouteHandle = {
  title: string;
  linkText: string;
};

export interface StoreStruct {
  workouts: WorkoutStruct[];
  workoutOpenId: string;
  workoutSelected: number[];
  tags: TagStruct[];
}

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
