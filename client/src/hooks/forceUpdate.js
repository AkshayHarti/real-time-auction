import { useState } from "react";

const useForceUpdate = () => {
  const [, setTime] = useState(new Date());

  return () => {
    setTime(new Date());
  };
};

export default useForceUpdate;
