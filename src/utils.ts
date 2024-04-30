import { RouteHandle, TagStruct } from "./types.ts";

export const cssBlock = "block";

export const appDataVersion = 1;

export enum DayTime {
  morning,
  evening
}

export const pathWorkout = "workout";
export const pathSchedule = "schedule";

export function gotoWorkout(link: string) {
  if (link) link = "/" + link;
  return `/${pathWorkout}${link}`;
}

export function gotoSchedule(link: string) {
  if (link) link = "/" + link;
  return `/${pathSchedule}${link}`;
}

// eslint-disable-next-line
export function getHandle(route: any) {
  return route.handle as RouteHandle;
}

export function tagsIdToString(tags: TagStruct[], selected: number[]): string[] {
  const map = new Map(tags.map((r) => [r.id, r]));
  return selected.reduce((p, c) => {
    const v = map.get(c);
    return v ? [...p, v.label] : p;
  }, [] as string[]);
}

export function getDayTimeLabel(v: DayTime) {
  switch (v) {
    case DayTime.morning:
      return "утро";
    case DayTime.evening:
      return "вечер";
  }
}
