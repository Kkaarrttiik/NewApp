import React, { useEffect } from "react";
import { ReactComponent as LeftIcon } from "../assets/image/LeftArrow.svg";
import { imageShowData } from "../GiftImage";

export default function RecordsDialog(props) {
  const { open, setOpen, historyRecord } = props;

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (open && !event.target.closest(".records-dialog")) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("click", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [open, setOpen]);

  function dateFunction(dateString) {
    const dateObject = new Date(dateString);
    const timeString = dateObject.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const dateSting = dateObject.toLocaleDateString([], {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
    return dateSting + " " + timeString;
  }

  return (
    <>
      {open && (
        <div className="records-dialog">
          <div className="dialog-box">
            <div className="dialog-head">
              <button onClick={() => setOpen(false)}>
                <LeftIcon />
              </button>
              <div>
                <h5>Records</h5>
                <h6>Only Show 100 Records</h6>
              </div>
            </div>
            <div className="dialog-body">
              {historyRecord ? (
                <div className="table-responsive-wrapper" style={{ width: "100%", overflowX: "auto", overflowY: "auto", maxHeight: "400px", paddingBottom: "10px" }}>
                  <table
                    style={{
                      width: "100%",
                      minWidth: "400px",
                      display: "table",
                    }}
                  >
                    <thead>
                      <tr>
                        <th style={{ whiteSpace: "nowrap" }}>Dimond</th>
                        <th style={{ whiteSpace: "nowrap" }}>Selected</th>
                        <th style={{ whiteSpace: "nowrap" }}>Result</th>
                        <th style={{ whiteSpace: "nowrap" }}>Win or Loss</th>
                        <th style={{ whiteSpace: "nowrap" }}>Time</th>
                      </tr>
                    </thead>
                    <tbody>
                    {historyRecord?.map((item) => {
                      return (
                        <>
                          <tr>
                            <td>
                              <span>{item?.Bit}</span>
                            </td>
                            <td>
                              <img
                                src={imageShowData[item?.selectedFrame - 1]}
                              />
                            </td>
                            <td>
                              <img
                                src={imageShowData[item?.winnerNumber - 1]}
                              />
                            </td>
                            <td>
                              <span>
                                {item?.isWinner === true ? (
                                  <>
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                      }}
                                    >
                                      <h6>Yes</h6>
                                      <h6>{`(${item?.winnerNumberTimes + "times"})`}</h6>
                                    </div>
                                  </>
                                ) : (
                                  "No"
                                )}
                              </span>
                            </td>
                            <td>
                              <span>
                                {item?.createdAt
                                  ? dateFunction(item?.createdAt)
                                  : "-"}
                              </span>
                            </td>
                          </tr>
                        </>
                      );
                    })}
                  </tbody>
                </table>
                </div>
              ) : (
                <h5>No Records...</h5>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
