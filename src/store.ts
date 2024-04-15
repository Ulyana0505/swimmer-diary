import { StoreStruct } from "./types.ts";
import { persist } from "zustand/middleware";
import { createWithEqualityFn } from "zustand/traditional";

const currentDate = new Date();

function init(): StoreStruct {
  return {
    workouts: [],
    workoutOpenId: "",
    workoutSelected: [],
    tags: [],
    schedule: new Map(),
    // ---
    scheduleYear: currentDate.getFullYear(),
    scheduleMonth: currentDate.getMonth() + 1,
    noticeDate: ""
  };
}

export const useMainStore = createWithEqualityFn(
  persist(init, {
    name: "site-storage",
    storage: {
      getItem(name) {
        const str = localStorage.getItem(name);
        if (str) {
          try {
            const data = JSON.parse(str) as StoreStruct;
            return { state: { ...init(), ...data, schedule: new Map(data.schedule) } };
          } catch (_e) {
            return { state: init() };
          }
        } else {
          return { state: init() };
        }
      },
      setItem: (name, newValue) => {
        const { scheduleMonth: _1, scheduleYear: _2, noticeDate: _3, ...data } = newValue.state;
        const str = JSON.stringify({
          ...data,
          schedule: Array.from(data.schedule.entries())
        });
        localStorage.setItem(name, str);
      },
      removeItem: (name) => localStorage.removeItem(name)
    }
  })
);
