import React, { useEffect, useState } from "react";
import apiKey from "./apiKey";
import "./App.css";
import useRoulette from "./hooks/useRoullete";
import useScript from "./hooks/useScript";
import {
  categorys,
  chineseFood,
  japaneseFood,
  koreanFoods,
  westernFood,
} from "./strArr";
import { shuffle } from "./utils/shuffle";

const Intro = () => {
  return (
    <div className="Intro">
      <div className="Title">오늘 뭐 먹지</div>
    </div>
  );
};

enum SelectType {
  MENU = "MENU",
  CATEGORY = "CATEGORY",
  CLOSE_DISTANCE = "CLOSE_DISTANCE",
  NONE = "NONE",
}

const categoryResolver = (category: string) => {
  if (category === "한식") return koreanFoods;
  if (category === "양식") return westernFood;
  if (category === "일식") return japaneseFood;
  return chineseFood;
};

interface IMoreListProps {
  category: string;
  changeCategoryToNone: () => void;
}

const MoreList = ({ category, changeCategoryToNone }: IMoreListProps) => {
  const { prevSelectedItem, selectedItem, nextSelectedItem, counterInit } =
    useRoulette({
      items: shuffle(categoryResolver(category)),
      times: 1000,
      tick: 20,
    });
  const [isMoreButtonHide, setIsMoreButtonHide] = useState(true);
  useEffect(() => {
    const timeOut = setTimeout(() => {
      setIsMoreButtonHide(false);
    }, 1000);
    return () => {
      clearTimeout(timeOut);
    };
  });
  const moreButtonClickHandler: React.MouseEventHandler<HTMLDivElement> = (
    evt
  ) => {
    setIsMoreButtonHide(true);
    counterInit();
  };
  return (
    <div className="CategoryList">
      <div className="CategoryElement">{prevSelectedItem}</div>
      <div className={["SelectedCategory", "CategoryElement"].join(" ")}>
        {selectedItem}
      </div>
      <div className="CategoryElement">{nextSelectedItem}</div>
      {isMoreButtonHide === false ? (
        <div>
          <div className="MoreSelectButton" onClick={moreButtonClickHandler}>
            다시 ㄱ
          </div>
          <div
            className="MoreSelectButton"
            onClick={() => {
              changeCategoryToNone();
            }}
          >
            뒤로 ㄱ
          </div>
        </div>
      ) : null}
    </div>
  );
};

const MenuList = ({ callback }: ICategoryList) => {
  const [isMoreButtonHide, setIsMoreButtonHide] = useState(true);
  const { prevSelectedItem, selectedItem, nextSelectedItem, counterInit } =
    useRoulette({
      items: shuffle(
        koreanFoods.concat(japaneseFood).concat(chineseFood).concat(westernFood)
      ),
      times: 1000,
      tick: 20,
    });

  const firstScreenButtonClickHandler: React.MouseEventHandler<
    HTMLDivElement
  > = (evt) => {
    initCallback();
    callback();
  };
  useEffect(() => {
    const timeOut = setTimeout(() => {
      setIsMoreButtonHide(false);
    }, 1000);
    return () => {
      clearTimeout(timeOut);
    };
  });
  const initCallback = () => {
    setIsMoreButtonHide(true);
    counterInit();
  };
  return (
    <div className="CategoryList">
      <div className="CategoryElement">{prevSelectedItem}</div>
      <div className={["SelectedCategory", "CategoryElement"].join(" ")}>
        {selectedItem}
      </div>
      <div className="CategoryElement">{nextSelectedItem}</div>
      {isMoreButtonHide === false ? (
        <div>
          <div className="MoreSelectButton">다시 ㄱ</div>
          <div
            className="MoreSelectButton"
            onClick={firstScreenButtonClickHandler}
          >
            첨 화면 ㄱ
          </div>
        </div>
      ) : null}
    </div>
  );
};

interface ICategoryList extends VoidCallbackProps {}

const CategoryList = ({ callback }: ICategoryList) => {
  const [isMoreButtonHide, setIsMoreButtonHide] = useState(true);
  const [isMoreButtonClicked, setIsMoreButtonClicked] = useState(false);
  const { prevSelectedItem, selectedItem, nextSelectedItem, counterInit } =
    useRoulette({
      items: shuffle(categorys),
      times: 1000,
      tick: 20,
    });

  const moreButtonClickHandler: React.MouseEventHandler<HTMLDivElement> = (
    evt
  ) => {
    setIsMoreButtonClicked(true);
  };
  const firstScreenButtonClickHandler: React.MouseEventHandler<
    HTMLDivElement
  > = (evt) => {
    initCallback();
    callback();
  };
  useEffect(() => {
    const timeOut = setTimeout(() => {
      setIsMoreButtonHide(false);
    }, 1000);
    return () => {
      clearTimeout(timeOut);
    };
  });
  const initCallback = () => {
    setIsMoreButtonHide(true);
    setIsMoreButtonClicked(false);
    counterInit();
  };
  return isMoreButtonClicked === false ? (
    <div className="CategoryList">
      <div className="CategoryElement">{prevSelectedItem}</div>
      <div className={["SelectedCategory", "CategoryElement"].join(" ")}>
        {selectedItem}
      </div>
      <div className="CategoryElement">{nextSelectedItem}</div>
      {isMoreButtonHide === false ? (
        <div>
          <div className="MoreSelectButton" onClick={moreButtonClickHandler}>
            기왕 메뉴도 골라줘
          </div>
          <div
            className="MoreSelectButton"
            onClick={firstScreenButtonClickHandler}
          >
            첨 화면 ㄱ
          </div>
        </div>
      ) : null}
    </div>
  ) : (
    <MoreList category={selectedItem} changeCategoryToNone={initCallback} />
  );
};

interface ICloseDistanceyList extends VoidCallbackProps {}

const CloseDistanceyList = ({ callback }: ICloseDistanceyList) => {
  const firstScreenButtonClickHandler: React.MouseEventHandler<
    HTMLDivElement
  > = (evt) => {
    callback();
  };
  return (
    <div>
      <div>500m</div>
      <div>1km</div>
      <div className="MoreSelectButton" onClick={firstScreenButtonClickHandler}>
        첨 화면 ㄱ
      </div>
    </div>
  );
};

interface VoidCallbackProps {
  callback: () => void;
}

const Select = () => {
  const [isSelected, setIsSelected] = useState<SelectType>(SelectType.NONE);

  const menuClickHandler: React.MouseEventHandler<HTMLDivElement> = (evt) => {
    setIsSelected(() => SelectType.MENU);
  };

  const categoryClickHandler: React.MouseEventHandler<HTMLDivElement> = (
    evt
  ) => {
    setIsSelected(() => SelectType.CATEGORY);
  };
  const closeDistanceClickHandler: React.MouseEventHandler<HTMLDivElement> = (
    evt
  ) => {
    setIsSelected(() => SelectType.CLOSE_DISTANCE);
  };

  const callbackSelectInit = () => {
    setIsSelected(() => SelectType.NONE);
  };

  const selectList = () => {
    return (
      <div className="SelectList">
        <div className="SelectElement" onClick={categoryClickHandler}>
          카테고리 별 추천
        </div>
        <div className="SelectElement" onClick={menuClickHandler}>
          메뉴 추천
        </div>
        <div className="SelectElement" onClick={closeDistanceClickHandler}>
          인근 거리 추천
        </div>
      </div>
    );
  };

  const selectAndSelect = ({
    callback: callbackSelectInit,
  }: VoidCallbackProps) => {
    if (isSelected === SelectType.CATEGORY)
      return <CategoryList callback={callbackSelectInit} />;
    if (isSelected === SelectType.MENU)
      return <MenuList callback={callbackSelectInit}></MenuList>;
    return <CloseDistanceyList callback={callbackSelectInit} />;
  };
  return (
    <div className="Select">
      {isSelected === SelectType.NONE
        ? selectList()
        : selectAndSelect({ callback: callbackSelectInit })}
    </div>
  );
};

function App() {
  useScript(
    `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&libraries=services,clusterer,drawing`
  );
  return (
    <div className="App">
      <Intro />
      <Select />
    </div>
  );
}

export default App;
