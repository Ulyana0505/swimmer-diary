import { RouteHandle, TagStruct } from "./types.ts";
import { AgnosticRouteObject } from "@remix-run/router/utils.ts";

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

export function getHandle(route: AgnosticRouteObject) {
  return route.handle as RouteHandle;
}

export function tagsToString(tags: TagStruct[]): string[] {
  return tags.map((r) => r.label);
}

export function tagsIdToString(tags: TagStruct[], selected: number[]): string[] {
  const map = new Map(tags.map((r) => [r.id, r]));
  return selected.reduce((p, c) => {
    const v = map.get(c);
    return v ? [...p, v.label] : p;
  }, [] as string[]);
}

export function tagsStringToId(tags: TagStruct[], selected: string[]): number[] {
  const map = new Map(tags.map((r) => [r.label, r]));
  return selected.reduce((p, c) => {
    const v = map.get(c);
    return v ? [...p, v.id] : p;
  }, [] as number[]);
}

export function getDayTimeLabel(v: DayTime) {
  switch (v) {
    case DayTime.morning:
      return "утро";
    case DayTime.evening:
      return "вечер";
  }
}
