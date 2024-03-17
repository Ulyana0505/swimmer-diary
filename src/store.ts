import { StoreStruct } from "./types.ts";
import { createJSONStorage, persist } from "zustand/middleware";
import { createWithEqualityFn } from "zustand/traditional";

function init(): StoreStruct {
  return {
    workouts: [],
    workoutOpenId: "",
    workoutSelected: [],
    tags: []
  };
}

export const useMainStore = createWithEqualityFn(
  persist(init, {
    name: "site-storage",
    storage: createJSONStorage(() => localStorage)
  })
);
