import { getLifts } from '$lib/server/db';

export const load = (() => {
  const lifts = getLifts();

  return {
    lifts
  };
});
