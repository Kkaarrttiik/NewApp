import React, { useEffect, useRef, useState } from "react";
import SelectCricle from "./SelectCricle";
import DimondIcon from "../assets/image/dimondIcon.png";
import HandIcon from "../assets/image/head.png";
import RecordsDialog from "../Dialog/RecordsDialog";
import RulesDialog from "../Dialog/RulesDialog";
import CoinButton from "./CoinButton";
import { ToastConent } from "../ToastConent";
import WinnerDialog from "../Dialog/WinnerDialog";
import { imageShowData } from "../GiftImage";

const handClasses = [
  "hand1",
  "hand2",
  "hand3",
  "hand4",
  "hand5",
  "hand6",
  "hand7",
  "hand8",
];
let selectedCoin = 0;
let selectedFram = [
  { selectFrame: 1, Bit: 0 },
  { selectFrame: 2, Bit: 0 },
  { selectFrame: 3, Bit: 0 },
  { selectFrame: 4, Bit: 0 },
  { selectFrame: 5, Bit: 0 },
  { selectFrame: 6, Bit: 0 },
  { selectFrame: 7, Bit: 0 },
  { selectFrame: 8, Bit: 0 },
];
let totalMineBetCoin = 0;
let todayProfit = 0;
let historiesShow = [];
let gameRound = 0;
let gameRoundWinnerShow = 0;
let winnerShow = [];
let historyRecord = [];
let currentGame = [];
const queryParams = new URLSearchParams(window.location.search);
const userId = queryParams.get("id");
export default function WheelContent(props) {
  const { userData, socket, gameCoin, settingData } = props;
  const [seconds, setSeconds] = useState(0);
  const [roundCounter, setRoundCounter] = useState(0);
  const [rollCount, setRollCount] = useState(0);
  const [handClassIndex, setHandClassIndex] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [recordsDialogOpen, setRecordsDialogOpen] = useState(false);
  const [rulesDialogOpen, setRulesDialogOpen] = useState(false);
  const [winnerModelOpen, setWinnerModelOpen] = useState(false);
  const [time, setTime] = useState();
  const [canPressCoins, setCanPressCoins] = useState(true);
  const [timerText, setTimerText] = useState("0s");
  const [showCricle, setShowCricle] = useState(false);
  const [showHandImage, setShowHandImage] = useState(false);

  // WebView Optimization: Convert global variables to refs to avoid stale closures
  const winnerFram = useRef(0);
  const currentTime = useRef(0);
  const isStopping = useRef(false);
  const stepsRemaining = useRef(0);

  // WebView Optimization: Cache DOM references once to avoid querySelectorAll in animation frame loops
  const grayElementsRef = useRef(null);
  const winnerElementsRef = useRef(null);
  const detailsWinMapRef = useRef(new Map());

  const getGrayElements = () => {
    if (!grayElementsRef.current || grayElementsRef.current.length === 0) {
      grayElementsRef.current = Array.from(document.querySelectorAll(".cricle-wheel .gray"));
    }
    return grayElementsRef.current;
  };

  const getWinnerElements = () => {
    if (!winnerElementsRef.current || winnerElementsRef.current.length === 0) {
      winnerElementsRef.current = Array.from(document.querySelectorAll(".cricle-wheel .winnerFram"));
    }
    return winnerElementsRef.current;
  };

  const getDetailsWin = (grayItem) => {
    if (!detailsWinMapRef.current.has(grayItem)) {
      const detailsWin = grayItem.parentElement?.querySelector(".details-win");
      if (detailsWin) {
        detailsWinMapRef.current.set(grayItem, detailsWin);
      }
    }
    return detailsWinMapRef.current.get(grayItem);
  };

  useEffect(() => {
    socket?.on("time", (time) => {
      updateTime(time);
      setTime(time);
      currentTime.current = time;
    });

    socket?.on("game", (game) => {
      currentGame = game?.UsersBits;
      if (game) {
        selectedFram = selectedFram = [
          { selectFrame: 1, Bit: 0 },
          { selectFrame: 2, Bit: 0 },
          { selectFrame: 3, Bit: 0 },
          { selectFrame: 4, Bit: 0 },
          { selectFrame: 5, Bit: 0 },
          { selectFrame: 6, Bit: 0 },
          { selectFrame: 7, Bit: 0 },
          { selectFrame: 8, Bit: 0 },
        ];
        updateGame(game);
      }
    });

    socket?.on("randomWinnerNumber", (winner) => {
      winnerFram.current = winner;
    });

    socket?.on("winnerUserArray", (winnerUser) => {
      winnerShow = winnerUser;
    });

    socket?.on("gameRound", (gameRoundNo) => {
      gameRound = gameRoundNo;
    });

    socket?.on("todayProfit", (profit) => {
      todayProfit = profit;
    });

    socket?.on("lastHistories", (histories) => {
      historiesShow = histories;
    });
  }, [socket]);

  socket?.on("historyRecord", (historyRecordData) => {
    historyRecord = historyRecordData;
  });
  const intervalId = () => {
    const randomNumber = Math.floor(Math.random() * (900 - 700) + 700);
    const firstIntervalId = setInterval(() => {
      if (seconds < 10) {
        setRoundCounter((prevRoundCounter) => (prevRoundCounter % 7) + 1);
      }
      if (seconds >= 10) {
        clearInterval(firstIntervalId);
      }
    }, randomNumber);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds + 1);
      setElapsedTime((prevElapsedTime) => prevElapsedTime + 1000);

      if (seconds === 15) {
        setSeconds(0);
        setRoundCounter(-1);
        setElapsedTime(0);
        intervalId();
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [seconds]);

  useEffect(() => {
    if (showCricle) {
      // WebView Optimization: DOM Cache logic to avoid repeated DOM queries inside animation frame
      const grayElements = getGrayElements();
      const totalGrayElements = grayElements.length || 8;

      // Reset stopping state when new spin phase starts
      if (currentTime.current > -8) {
        isStopping.current = false;
        stepsRemaining.current = 0;
        winnerFram.current = 0; // Wait for backend to emit new winner at time = -9
      }

      // Calculate how many steps needed to land on winner
      if (!isStopping.current && currentTime.current <= -8 && winnerFram.current > 0) {
        isStopping.current = true;
        // winnerFram is 1-indexed, rollCount is 0-indexed
        let targetIndex = winnerFram.current - 1;
        let distance = (targetIndex - rollCount + totalGrayElements) % totalGrayElements;
        
        // Add extra loop + 1 to ensure the final timeout smoothly lands on the target
        stepsRemaining.current = distance + totalGrayElements + 1; 
      }

      // If stopped, just keep the winner highlighted and don't spin anymore
      if (isStopping.current && stepsRemaining.current <= 0) {
        return;
      }

      // Calculate speed: 100ms normal, slowing down at the end
      let speed = 100;
      if (isStopping.current) {
         if (stepsRemaining.current > 5) speed = 100;
         else if (stepsRemaining.current > 3) speed = 200;
         else if (stepsRemaining.current === 3) speed = 300;
         else if (stepsRemaining.current === 2) speed = 450;
         else if (stepsRemaining.current === 1) speed = 600;
      }

      const rollTimer = setTimeout(() => {
        // WebView Optimization: Iterate over cached grayElements instead of querySelectorAll
        grayElements.forEach((grayItem, index) => {
          if (grayItem) {
            grayItem.style.display = index === rollCount ? "none" : "block";
          }
        });

        if (isStopping.current) {
          stepsRemaining.current--;
        }

        setRollCount((prevRollCount) =>
          prevRollCount >= totalGrayElements - 1 ? 0 : prevRollCount + 1,
        );
      }, speed);
      return () => clearTimeout(rollTimer);
    }
    if (showHandImage) {
      // WebView Optimization: Cache DOM references
      const grayElements = getGrayElements();
      const totalGrayElements = grayElements.length;

      const rollTimer = setInterval(() => {
        // WebView Optimization: Iterate over cached grayElements instead of querySelectorAll
        grayElements.forEach((grayItem) => {
          if (grayItem) {
            grayItem.style.display = "none";
          }
        });

        setRollCount((prevRollCount) =>
          prevRollCount >= totalGrayElements - 1 ? 0 : prevRollCount + 1,
        );
        if (elapsedTime >= 1500) {
          setElapsedTime(0);
          setHandClassIndex(
            (prevIndex) => (prevIndex + 1) % handClasses.length,
          );
        }
      }, 400);
      return () => clearInterval(rollTimer);
    }
    if (showHandImage === false && showCricle === false) {
      // WebView Optimization: Cache DOM references
      const grayElements = getGrayElements();
      grayElements.forEach((grayItem) => {
        if (grayItem) {
          grayItem.style.display = "none";
        }
      });
    }
  }, [rollCount, elapsedTime]);

  const handleOpenModel = (type) => {
    if (type === "records") {
      setRecordsDialogOpen(true);
      setRulesDialogOpen(false);
      socket?.off("historyRecord")?.emit("historyRecord", {
        _id: userData?._id,
      });
    } else {
      setRulesDialogOpen(true);
      setRecordsDialogOpen(false);
    }
  };

  const updateTime = (time) => {
    if (time === 25) {
      selectedCoin = gameCoin[0];
    }
    if (time >= 4) {
      setCanPressCoins(true);
      setTimerText(time + "s");
    } else if (time >= 0 && time <= 3) {
      setCanPressCoins(false);
      setTimerText(time + "s");
    } else if (time <= 0 && time > -12) {
      selectedFram = [
        { selectFrame: 1, Bit: 0 },
        { selectFrame: 2, Bit: 0 },
        { selectFrame: 3, Bit: 0 },
        { selectFrame: 4, Bit: 0 },
        { selectFrame: 5, Bit: 0 },
        { selectFrame: 6, Bit: 0 },
        { selectFrame: 7, Bit: 0 },
        { selectFrame: 8, Bit: 0 },
      ];
      selectedCoin = -1;
      setCanPressCoins(false);
      setTimerText(11 + time + "s");
    }

    if (time >= 1 && time <= 24) {
      setShowHandImage(true);
      setShowCricle(false);
    }
    if (time <= 0 && time >= -12) {
      setShowHandImage(false);
      setShowCricle(true);
    }
    if (time === -12) {
      setShowHandImage(false);
      setShowCricle(false);
    }

    if (time === -12) {
      winnerFramFunction("show");
      setTimeout(() => {
        gameRoundWinnerShow = gameRound;
        setWinnerModelOpen(true);
      }, 500);
    }

    if (time === 22) {
      setWinnerModelOpen(false);
      gameRoundWinnerShow = gameRound;
      winnerFramFunction("close");
    }

    if (time === -13) {
      socket?.emit("user", {
        _id: userData?._id,
      });
    }
  };

  // WebView Optimization: winnerFramFunction optimized by utilizing cached DOM collections
  const winnerFramFunction = (type) => {
    const winnerElements = getWinnerElements();
    if (type === "show") {
      winnerElements.forEach((grayItem, index) => {
        if (grayItem) {
          grayItem.style.display =
            index + 1 === winnerFram.current ? "block" : "none";
          // WebView Optimization: Retrieve parent relative detailsWin from cached Map
          const detailsWin = getDetailsWin(grayItem);
          if (detailsWin) {
            if (index + 1 === winnerFram.current) {
              detailsWin.classList.add("winner-addText");
            } else {
              detailsWin.classList.remove("winner-addText");
            }
          }
        }
      });
    } else {
      winnerElements.forEach((grayItem, index) => {
        if (grayItem) {
          grayItem.style.display = "none";
          // WebView Optimization: Retrieve parent relative detailsWin from cached Map
          const detailsWin = getDetailsWin(grayItem);
          if (detailsWin) {
            detailsWin.classList.remove("winner-addText");
          }
        }
      });
    }
  };

  const updateGame = (game) => {
    const findUser = game?.UsersBits?.filter((user) => {
      return user?.userId === userId;
    });
    findUser?.forEach((data) => {
      const { Bit, SelectedFrame } = data;
      const gameIndex = selectedFram?.findIndex(
        (frame) => frame?.selectFrame === SelectedFrame,
      );
      if (gameIndex !== -1) {
        selectedFram[gameIndex].Bit += Bit;
      }
    });
  };

  const getAmount = (coin) => {
    let amount = 0;
    if (coin == gameCoin[0]) amount = gameCoin[0];
    else if (coin == gameCoin[1]) amount = gameCoin[1];
    else if (coin == gameCoin[2]) amount = gameCoin[2];
    else if (coin == gameCoin[3]) amount = gameCoin[3];
    else if (coin == gameCoin[4]) amount = gameCoin[4];

    return amount;
  };

  const addBit = (bitcoin, myframe) => {
    let amount = getAmount(bitcoin);
    if (bitcoin != -1 && myframe !== 0) {
      if (userData?.diamond - amount >= 0) {
        userData.diamond -= amount;
        socket?.emit("bit", {
          User: userData,
          Bit: bitcoin,
          SelectedFrame: myframe,
        });

        const selectedFrameIndex = selectedFram?.findIndex(
          (frame) => frame.selectFrame === myframe,
        );
        selectedFram[selectedFrameIndex].Bit += bitcoin;
      } else {
        ToastConent(
          "You don't enough diamond now, please  recharge first!",
          "warning",
        );
      }
    } else {
      ToastConent("Missing to select any Coin", "info");
    }
  };

  const handleFramClick = (fram) => {
    if (selectedCoin >= 0) {
      addBit(selectedCoin == 0 ? gameCoin[0] : selectedCoin, fram);
    }
  };
  const betButtonClick1 = (e) => {
    selectedCoin = gameCoin[0];
  };
  const betButtonClick2 = (e) => {
    selectedCoin = gameCoin[1];
  };
  const betButtonClick3 = (e) => {
    selectedCoin = gameCoin[2];
  };
  const betButtonClick4 = (e) => {
    selectedCoin = gameCoin[3];
  };

  return (
    <div className="row">
      <div className="col-12 col-md-3"></div>
      <div className="col-12 col-md-6">
        <div className="show-game">
          <div className="wheelContent">
            <div className="cricle-bg1"></div>
            <div className="header-buttons" style={{ display: "flex", justifyContent: "center", gap: "10px", alignItems: "center", position: "absolute", top: "12px", width: "100%", zIndex: 99999 }}>
              <div className="roundNumber" style={{ position: "relative", top: "auto", left: "auto", textWrap:"nowrap" }}>
                <h6>
                  Round: <span>{gameRound}</span>
                </h6>
              </div>
              <div className="top-button" style={{ position: "relative", top: "auto", right: "auto", display: "flex", gap: "10px" }}>
                <button
                  className="records-btn"
                  onClick={(event) => {
                    handleOpenModel("records");
                    event.stopPropagation();
                  }}
                >
                  Records
                </button>
                <button
                  className="rules-btn "
                  style={{ margin: 0 }}
                  onClick={(event) => {
                    handleOpenModel("rules");
                    event.stopPropagation();
                  }}
                >
                  Rules
                </button>
                {/* <button className="rank-btn">Rank</button> */}
              </div>
            </div>
            <div className="show-table">
              <div className="cricle-bg2"></div>
              <div className="wheel-text">
                {time <= 0 && time > -14 ? (
                  <h6 style={{ fontSize: "18px" }}>anonymous</h6>
                ) : (
                  <h6>
                    <span>Please</span>
                    <span>Select Food</span>
                  </h6>
                )}
                <h5>{`${timerText ? timerText : "0"}`}</h5>
              </div>
              <SelectCricle
                timeText={"5"}
                image={imageShowData[0]}
                cricleMainStlye={{
                  left: "37%",
                  bottom: "95%",
                  transform: "translate(0%, 0%)",
                }}
                selectFrame={selectedFram[0]}
                framNo={1}
                onClick={() => handleFramClick(1)}
              />
              <SelectCricle
                timeText={"5"}
                image={imageShowData[1]}
                cricleMainStlye={{
                  right: "20%",
                  bottom: "98%",
                  transform: "translate(50%, 50%)",
                }}
                framNo={2}
                selectFrame={selectedFram[1]}
                onClick={() => handleFramClick(2)}
              />
              <SelectCricle
                timeText={"10"}
                image={imageShowData[2]}
                cricleMainStlye={{
                  right: "10%",
                  bottom: "78%",
                  transform: "translate(50%, 50%)",
                }}
                framNo={3}
                selectFrame={selectedFram[2]}
                onClick={() => handleFramClick(3)}
              />
              <SelectCricle
                timeText={"15"}
                image={imageShowData[3]}
                cricleMainStlye={{
                  right: "20%",
                  bottom: "57%",
                  transform: "translate(50%, 50%)",
                }}
                framNo={4}
                selectFrame={selectedFram[3]}
                onClick={() => handleFramClick(4)}
              />
              <SelectCricle
                timeText={"25"}
                image={imageShowData[4]}
                cricleMainStlye={{
                  right: "50%",
                  bottom: "50%",
                  transform: "translate(50%, 50%)",
                }}
                framNo={5}
                selectFrame={selectedFram[4]}
                onClick={() => handleFramClick(5)}
              />
              <SelectCricle
                timeText={"45"}
                image={imageShowData[5]}
                cricleMainStlye={{
                  right: "81%",
                  bottom: "58%",
                  transform: "translate(50%, 50%)",
                }}
                framNo={6}
                selectFrame={selectedFram[5]}
                onClick={() => handleFramClick(6)}
              />
              <SelectCricle
                timeText={"5"}
                image={imageShowData[6]}
                cricleMainStlye={{
                  right: "92%",
                  bottom: "78%",
                  transform: "translate(50%, 50%)",
                }}
                framNo={7}
                selectFrame={selectedFram[6]}
                onClick={() => handleFramClick(7)}
              />
              <SelectCricle
                timeText={"5"}
                image={imageShowData[7]}
                cricleMainStlye={{
                  right: "79%",
                  bottom: "98%",
                  transform: "translate(50%, 50%)",
                }}
                framNo={8}
                selectFrame={selectedFram[7]}
                onClick={() => handleFramClick(8)}
              />
              {showHandImage && (
                <div className={`hand-content ${handClasses[handClassIndex]}`}>
                  <img src={HandIcon} />
                </div>
              )}
              <div className="dimond-select">
                <CoinButton
                  number={gameCoin[0]}
                  funcClick={betButtonClick1}
                  selectedClass={
                    selectedCoin == gameCoin[0] ? "selectedCoin" : ""
                  }
                  disabledClass={canPressCoins === false ? "coinDisabled" : ""}
                />
                <CoinButton
                  number={gameCoin[1]}
                  funcClick={betButtonClick2}
                  selectedClass={
                    selectedCoin == gameCoin[1] ? "selectedCoin" : ""
                  }
                  disabledClass={canPressCoins === false ? "coinDisabled" : ""}
                />
                <CoinButton
                  number={gameCoin[2]}
                  funcClick={betButtonClick3}
                  selectedClass={
                    selectedCoin == gameCoin[2] ? "selectedCoin" : ""
                  }
                  disabledClass={canPressCoins === false ? "coinDisabled" : ""}
                />
                <CoinButton
                  number={gameCoin[3]}
                  funcClick={betButtonClick4}
                  selectedClass={
                    selectedCoin == gameCoin[3] ? "selectedCoin" : ""
                  }
                  disabledClass={canPressCoins === false ? "coinDisabled" : ""}
                />
              </div>
              <div className="balance-profile">
                <div className="balance-box">
                  <h6>Gold balance</h6>
                  <div className="balance-number">
                    <img src={DimondIcon} />
                    <h5>
                      {userData?.diamond
                        ? userData?.diamond?.toLocaleString()
                        : 0}
                    </h5>
                  </div>
                </div>
                <div className="balance-box">
                  <h6>Today's profit</h6>
                  <div className="balance-number">
                    <img src={DimondIcon} />
                    <h5>{todayProfit}</h5>
                  </div>
                </div>
              </div>
              <div className="result-content">
                <div className="result-box">
                  <h5>Result</h5>
                  <div className="border-line"></div>
                  <div className="last-reslut">
                    {historiesShow ? (
                      historiesShow?.map((item, index) => {
                        return (
                          <div className="gift-reslut" key={index}>
                            <div className="new-label">
                              <span>NEW</span>
                            </div>
                            <img src={imageShowData[item - 1]} />
                          </div>
                        );
                      })
                    ) : (
                      <h6
                        style={{
                          color: "white",
                          textAlign: "center",
                          width: "100%",
                          marginTop: "5px",
                        }}
                      >
                        Not Result...
                      </h6>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <RecordsDialog
            open={recordsDialogOpen}
            historyRecord={historyRecord}
            setOpen={setRecordsDialogOpen}
          />
        </div>
        <RulesDialog open={rulesDialogOpen} setOpen={setRulesDialogOpen} />
        <WinnerDialog
          open={winnerModelOpen}
          setOpen={setWinnerModelOpen}
          winnerShow={winnerShow}
          currentGame={currentGame}
          userData={userData}
          gameRound={gameRoundWinnerShow}
        />
      </div>
      <div className="col-12 col-md-3">
        <div className="cricle-bg3"></div>
      </div>
    </div>
  );
}
