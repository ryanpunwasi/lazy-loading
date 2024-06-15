import { useState } from "react";

export const useFetchPermission = (defaultPermission: boolean = true) => {
  const [allowFetch, setAllowFetch] = useState(defaultPermission);

  return { allowFetch, setAllowFetch };
};
