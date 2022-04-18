import React, { useEffect, useRef, useState } from "react";
import { ISelectedScreen } from "./@interface";
import "./App.css";
import Ladder from "./components/Ladder";
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
  LADDER = "LADDER",
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

const MenuList = ({ callback }: ISelectedScreen) => {
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
          <div
            className="MoreSelectButton"
            onClick={() => {
              initCallback();
            }}
          >
            다시 ㄱ
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
  );
};

const CategoryList = ({ callback }: ISelectedScreen) => {
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

const Map = ({ selectedPlace }: { selectedPlace: any }) => {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (mapRef.current && selectedPlace) {
      const latlng = new (window as any).kakao.maps.LatLng(
        selectedPlace.y,
        selectedPlace.x
      );

      const options = {
        center: latlng,
        level: 3,
      };
      const map = new (window as any).kakao.maps.Map(mapRef.current, options);
      map.relayout();
      map.setCenter(latlng);

      const marker = new (window as any).kakao.maps.Marker({
        position: new (window as any).kakao.maps.LatLng(
          selectedPlace.y,
          selectedPlace.x
        ),
      });

      marker.setMap(map);

      const content = `<div style="padding:5px;font-size:12px;">  ${selectedPlace.place_name} </div>`;
      const infowindow = new (window as any).kakao.maps.InfoWindow({
        content: content,
      });

      infowindow.open(map, marker);

      const zoomControl = new (window as any).kakao.maps.ZoomControl();
      map.addControl(
        zoomControl,
        (window as any).kakao.maps.ControlPosition.RIGHT
      );
    }
  }, [selectedPlace]);

  return (
    <div className="MapWrapper">
      <div ref={mapRef} className="Map"></div>
    </div>
  );
};

const MapContainer = ({
  list,
  initCallback,
}: {
  list: any[];
  initCallback: () => void;
}) => {
  const [selectedPlace, setSelectedPlace] = useState(null);
  useEffect(() => {
    if (list.length > 0) {
      const shuffledList = shuffle(list);
      const curSelectedPlace = shuffledList.at(shuffledList.length / 2);
      setSelectedPlace(curSelectedPlace);
    }
  }, [list]);
  return (
    <div className="MapContainer">
      {list.length > 0 ? (
        <div>
          <Map selectedPlace={selectedPlace} />
          <div
            className="MoreSelectButton"
            onClick={() => {
              initCallback();
            }}
          >
            이전화면
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

const SearchList = ({
  distance,
  lat,
  lng,
  initCallback,
}: {
  distance: number;
  lat: number;
  lng: number;
  initCallback: () => void;
}) => {
  const [searchResults, setSearchResults] = useState<[]>([]);
  useEffect(() => {
    const places = new (window as any).kakao.maps.services.Places();

    const callback = (result: any, status: any) => {
      if (status === (window as any).kakao.maps.services.Status.OK) {
        setSearchResults(result);
      }
    };
    places.keywordSearch("식당", callback, {
      location: new (window as any).kakao.maps.LatLng(lat, lng),
      radius: distance,
    });
  }, []);
  return <MapContainer list={searchResults} initCallback={initCallback} />;
};

const DistacneList = ({
  distance,
  initCallback,
}: {
  distance: number;
  initCallback: () => void;
}) => {
  const [lat, setLat] = useState(987654321);
  const [lng, setLng] = useState(987654321);
  useEffect(() => {
    navigator?.geolocation.getCurrentPosition((position) => {
      setLat(position.coords.latitude);
      setLng(position.coords.longitude);
    });
  });

  return lat === 987654321 && lng === 987654321 ? (
    <div>gps 문제 있어</div>
  ) : (
    <SearchList
      distance={distance}
      lat={lat}
      lng={lng}
      initCallback={initCallback}
    />
  );
};

const CloseDistanceyList = ({ callback }: ISelectedScreen) => {
  const [distance, setDistance] = useState(0);
  const [isSelected, setIsSelected] = useState(false);

  const curInitCallback = () => {
    setDistance(0);
    setIsSelected(false);
  };

  const firstScreenButtonClickHandler: React.MouseEventHandler<
    HTMLDivElement
  > = (evt) => {
    curInitCallback();
    callback();
  };

  const clickHandler = (distance: number) => {
    setDistance(distance);
    setIsSelected(true);
  };
  return isSelected === false ? (
    <div className="SelectList">
      <div
        className="SelectElement"
        onClick={() => {
          clickHandler(500);
        }}
      >
        500m
      </div>
      <div
        className="SelectElement"
        onClick={() => {
          clickHandler(1000);
        }}
      >
        1km
      </div>
      <div className="MoreSelectButton" onClick={firstScreenButtonClickHandler}>
        첨 화면 ㄱ
      </div>
    </div>
  ) : (
    <DistacneList distance={distance} initCallback={curInitCallback} />
  );
};

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

  const ladderClickHandler: React.MouseEventHandler<HTMLDivElement> = (evt) => {
    setIsSelected(() => SelectType.LADDER);
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
        <div className="SelectElement" onClick={ladderClickHandler}>
          음식값 사다리타기
        </div>
      </div>
    );
  };

  const selectAndSelect = ({
    callback: callbackSelectInit,
  }: ISelectedScreen) => {
    if (isSelected === SelectType.CATEGORY)
      return <CategoryList callback={callbackSelectInit} />;
    if (isSelected === SelectType.MENU)
      return <MenuList callback={callbackSelectInit}></MenuList>;
    if (isSelected === SelectType.LADDER)
      return <Ladder callback={callbackSelectInit}></Ladder>;
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
  return (
    <div className="App">
      <Intro />
      <Select />
    </div>
  );
}

export default App;
