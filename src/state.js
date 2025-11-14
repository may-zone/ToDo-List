import { projCreator } from "./projects";

export const defaultState = {
  projects: [
    createProject("Default Project")
  ]
};

export let appState = structuredClone(defaultState);

export function setAppState(newState) {
  appState = newState;
}
