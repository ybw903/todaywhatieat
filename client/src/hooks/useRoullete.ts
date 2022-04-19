import { useEffect, useState } from "react";

interface IProps {
  items: any[];
  times: number;
  tick: number;
}

const useRoulette = ({ items, times, tick }: IProps) => {
  const [idx, setIdx] = useState(1);
  const [prevSelectedItem, setPrevSelectedItem] = useState(items[0]);
  const [selectedItem, setSelectedItem] = useState(items[1]);
  const [nextSelectedItem, setNextSelectedItem] = useState(items[2]);
  const [counter, setCounter] = useState(0);
  const [toggleTimer, setToggleTimer] = useState(true);
  const counterInit = () => {
    setCounter(0);
  };
  useEffect(() => {
    const countDown = setInterval(() => {
      if (toggleTimer) {
        setCounter((counter) => counter + tick);
        const nextIdx = (idx + 1) % items.length;
        setPrevSelectedItem(
          () => items[nextIdx === 0 ? items.length - 1 : nextIdx - 1]
        );
        setSelectedItem(() => items[nextIdx]);
        setNextSelectedItem(
          () => items[nextIdx === items.length - 1 ? 0 : nextIdx + 1]
        );
        setIdx(() => nextIdx);
        if (counter >= times) setToggleTimer(false);
      } else {
        clearInterval(countDown);
      }
    }, tick);
    return () => {
      clearInterval(countDown);
      setToggleTimer(true);
    };
  }, [counter]);
  return {
    prevSelectedItem,
    selectedItem,
    nextSelectedItem,
    counter,
    counterInit,
  };
};

export default useRoulette;
