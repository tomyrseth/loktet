import { writable } from 'svelte/store';

export const showCalendar = writable(true);
export const showDay = writable(false);
export const day_id = writable(0);