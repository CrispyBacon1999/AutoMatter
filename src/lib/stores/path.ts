import { readable, writable } from "svelte/store";
import type { Path } from "../paths";

export const paths = writable<Path[]>([]);
export const activePathId = writable<number>(0);
