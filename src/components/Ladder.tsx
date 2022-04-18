import { useEffect, useRef, useState } from "react";
import { ISelectedScreen } from "../@interface";
import "../App.css";

interface Result {
  result: boolean;
  isShow: boolean;
}

const Ladder = ({ callback }: ISelectedScreen) => {
  const [count, setCount] = useState(4);
  const [ladder, setLadder] = useState<number[][] | null>(null);
  const [playerIdx, setPlayerIdx] = useState(-1);
  const [results, setResults] = useState<Result[]>([]);
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
    setPlayerIdx(-1);
    setCount((count) => count - 1);
  };

  const increaseClickHandler: React.MouseEventHandler<HTMLDivElement> = (
    evt
  ) => {
    if (count >= 8) return;
    setPlayerIdx(-1);
    setCount((count) => count + 1);
  };

  const drawCanvas = (ladder: number[][]) => {
    if (!ref.current) return;
    const canvas = ref.current;
    const context = canvas.getContext("2d");
    if (context && ladder) {
      const arr = [];
      for (let i = 0; i < count; i++) {
        const startPosX = (i / count) * 300 + ((1 / count) * 300) / 2;
        arr.push(startPosX);
        console.log(startPosX);
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
          const posY = j * 40 + 20;
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
    const nowLadder = initLadder();
    setLadder(nowLadder);
    drawCanvas(nowLadder);
    const results = Array.from({ length: count }, (_, i) => {
      return { result: false, isShow: false };
    });
    const randIdx = Math.floor(Math.random() * count);
    results[randIdx] = { ...results[randIdx], result: true };
    setResults(() => results);
    return clearCanvas;
  }, [count]);

  const playerColor = [
    "yellow",
    "blue",
    "red",
    "green",
    "orange",
    "navy",
    "purple",
    "brown",
  ];
  useEffect(() => {
    if (playerIdx === -1) return;
    if (!ref.current || ladder === null) return;
    const canvas = ref.current;
    const context = canvas.getContext("2d");
    if (!context || playerIdx === -1) return;
    clearCanvas();
    drawCanvas(ladder);
    const nextResults = [...results];
    setResults(() => nextResults.map((nr, i) => ({ ...nr, isShow: true })));
    const arr: any[] = [];
    for (let i = 0; i < count; i++) {
      const startPosX = (i / count) * 300 + ((1 / count) * 300) / 2;
      arr.push(startPosX);
    }
    let ladderIdx = playerIdx * 2;
    let posX = arr[Math.floor(ladderIdx / 2)];
    let yIdx = 0;
    let posY = 20;
    const moveDown = setInterval(() => {
      if (posY >= 380) {
        clearInterval(moveDown);
      } else {
        if (
          ladderIdx < count + (count - 1) - 1 &&
          ladder[ladderIdx + 1][yIdx] === 1
        ) {
          ladderIdx += 2;
          const nextPosX = arr[Math.floor(ladderIdx / 2)];
          context.strokeStyle = playerColor[playerIdx];
          context.lineWidth = 3;
          context.beginPath();
          context.moveTo(posX, posY);
          context.lineTo(nextPosX, posY);
          context.stroke();
          posX = nextPosX;
        } else if (ladderIdx > 0 && ladder[ladderIdx - 1][yIdx] === 1) {
          ladderIdx -= 2;
          const nextPosX = arr[Math.floor(ladderIdx / 2)];
          context.strokeStyle = playerColor[playerIdx];
          context.lineWidth = 3;
          context.beginPath();
          context.moveTo(posX, posY);
          context.lineTo(nextPosX, posY);
          context.stroke();
          posX = nextPosX;
        }
        const nextPosY = posY + 40;
        context.strokeStyle = playerColor[playerIdx];
        context.lineWidth = 3;
        context.beginPath();
        context.moveTo(posX, posY);
        context.lineTo(posX, nextPosY);
        context.stroke();
        posY = nextPosY;
        yIdx = yIdx + 1;
      }
    }, 50);
    return () => {
      clearInterval(moveDown);
    };
  }, [playerIdx]);

  const renderPlayer = () => {
    const players = Array.from({ length: count }, (_, i) => i + 1);
    return players.map((p, i) => {
      const onClickHandler = () => {
        setPlayerIdx(i);
      };
      return (
        <div className="PlayerElement" key={i} onClick={() => onClickHandler()}>
          {p}
        </div>
      );
    });
  };

  const renderResults = () => {
    return results.map((r, i) => {
      return (
        <div
          className={`ResultElement ${r.result === true ? "Target" : ""} ${
            r.isShow === false ? "Hide" : ""
          }`}
          key={i}
        >
          {r.isShow === false ? "뭘까" : r.result === true ? "당첨" : "꽁짜"}
        </div>
      );
    });
  };
  return (
    <div className="LadderWrapper">
      <div className="CountWrapper">
        <div className="CountElement">
          <div className="CountButton" onClick={decreaseClickHandler}>
            -
          </div>
        </div>
        <div className="CountElement">{count}</div>
        <div className="CountElement">
          <div className="CountButton" onClick={increaseClickHandler}>
            +
          </div>
        </div>
      </div>
      <div></div>
      <div className={`PlayerWrapper-${count}`}>{renderPlayer()}</div>

      <canvas ref={ref} height={400} width={300}></canvas>
      <div className={`PlayerWrapper-${count}`}>{renderResults()}</div>
      <div className="MoreSelectButton" onClick={firstScreenButtonClickHandler}>
        첨화면 ㄱ
      </div>
    </div>
  );
};

export default Ladder;
