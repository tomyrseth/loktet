import { getInfo } from '$lib/server/db';

export const load = (() => {
  const info = getInfo();


  return {
    info
  };
});

