import { StoreStruct } from "./types.ts";
import { createJSONStorage, persist } from "zustand/middleware";
import { createWithEqualityFn } from "zustand/traditional";

const currentDate = new Date();

function init(): StoreStruct {
  return {
    workouts: [],
    workoutOpenId: "",
    workoutSelected: [],
    tags: [],
    schedule: [],
    scheduleYear: currentDate.getFullYear(),
    scheduleMonth: currentDate.getMonth() + 1
  };
}

export const useMainStore = createWithEqualityFn(
  persist(init, {
    name: "site-storage",
    storage: createJSONStorage(() => localStorage),
    partialize: (state) => {
      const { scheduleMonth: _1, scheduleYear: _2, ...data } = state;
      return data;
    }
  })
);
