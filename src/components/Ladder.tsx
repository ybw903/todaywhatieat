import { useEffect, useRef, useState } from "react";
import { ISelectedScreen } from "../@interface";
import "../App.css";

const Ladder = ({ callback }: ISelectedScreen) => {
  const [count, setCount] = useState(4);
  const ref = useRef<HTMLCanvasElement | null>(null);
  const firstScreenButtonClickHandler: React.MouseEventHandler<
    HTMLDivElement
  > = (evt) => {
    callback();
  };

  const decreaseClickHandler: React.MouseEventHandler<HTMLDivElement> = (
    evt
  ) => {
    if (count <= 2) return;
    setCount((count) => count - 1);
  };

  const increaseClickHandler: React.MouseEventHandler<HTMLDivElement> = (
    evt
  ) => {
    if (count >= 8) return;
    setCount((count) => count + 1);
  };

  const drawCanvas = (ladder: number[][]) => {
    if (!ref.current) return;
    const canvas = ref.current;
    const context = canvas.getContext("2d");
    if (context) {
      const arr = [];
      for (let i = 0; i < count; i++) {
        const startPosX = (i / count) * 300 + ((1 / count) * 300) / 2;
        arr.push(startPosX);
        context.strokeStyle = "black";
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(startPosX, 20);
        context.lineTo(startPosX, 380);

        context.stroke();
      }
      for (let i = 1; i <= ladder.length - 2; i += 2) {
        for (let j = 1; j < 10; j++) {
          if (ladder[i][j] === 0) continue;
          const posY = j * 40;
          const startPosX = arr[Math.floor(i / 2)];
          const endPosX = arr[Math.floor(i / 2) + 1];
          context.beginPath();
          context.moveTo(startPosX, posY);
          context.lineTo(endPosX, posY);
          context.stroke();
        }
      }
      // for (let i = 0; i < arr.length - 1; i++) {
      //   context.beginPath();
      //   const randPosY = (Math.floor(Math.random() * 8) + 1) * 40;
      //   context.moveTo(arr[i], randPosY);
      //   context.lineTo(arr[i + 1], randPosY);
      //   context.stroke();
      // }
    }
  };
  const clearCanvas = () => {
    if (!ref.current) return;
    const canvas = ref.current;
    const context = canvas.getContext("2d");
    if (context) {
      context.clearRect(0, 0, 300, 400);
    }
  };
  const initLadder = () => {
    const ladder = Array.from({ length: count + count - 1 }, () =>
      Array.from({ length: 10 }, (v, i) => 0)
    );
    for (let i = 0; i < ladder.length; i += 2) {
      for (let j = 0; j < 10; j++) {
        ladder[i][j] = 1;
      }
    }
    const crossLineCnt =
      Math.floor(Math.random() * (count * 3 - 1 - (count - 1))) + (count - 1);
    for (let i = 0; i < crossLineCnt; i++) {
      const randPosX = Math.floor(Math.random() * (ladder.length - 2)) + 1;
      const randPosY = Math.floor(Math.random() * (10 - 2)) + 1;
      const randOddPosX = randPosX % 2 === 0 ? randPosX + 1 : randPosX;
      const isUseCrossLeft =
        randOddPosX > 1 && ladder[randOddPosX - 2][randPosY];
      const isUseCrossRight =
        randOddPosX < ladder.length - 2 && ladder[randOddPosX + 2][randPosY];
      if (randOddPosX === 1 && !isUseCrossRight) {
        ladder[randOddPosX][randPosY] = 1;
      } else if (randOddPosX === ladder.length - 2 && !isUseCrossLeft) {
        ladder[randOddPosX][randPosY] = 1;
      } else {
        if (!isUseCrossLeft && !isUseCrossRight)
          ladder[randOddPosX][randPosY] = 1;
      }
    }
    return ladder;
  };
  useEffect(() => {
    const ladder = initLadder();
    drawCanvas(ladder);
    return clearCanvas;
  }, [count]);
  return (
    <div className="LadderWrapper">
      <div className="CountWrapper">
        <div
          className={["CountElement", "CountButton"].join(" ")}
          onClick={decreaseClickHandler}
        >
          -
        </div>
        <div className="CountElement">{count}</div>
        <div
          className={["CountElement", "CountButton"].join(" ")}
          onClick={increaseClickHandler}
        >
          +
        </div>
      </div>
      <canvas ref={ref} height={400} width={300}></canvas>
      <div className="MoreSelectButton" onClick={firstScreenButtonClickHandler}>
        첨화면 ㄱ
      </div>
    </div>
  );
};

export default Ladder;
