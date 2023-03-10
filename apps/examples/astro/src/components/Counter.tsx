import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1);
  };

  return (
    <button tw="bg-red-500" tw-hover="bg-blue-400" onClick={handleClick}>
      Count is {count}
    </button>
  );
}
