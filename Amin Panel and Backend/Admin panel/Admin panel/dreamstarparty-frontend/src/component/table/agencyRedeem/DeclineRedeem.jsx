import React, { useEffect, useState, useRef } from "react";

//react-redux
import { connect, useDispatch, useSelector } from "react-redux";

//routing

import arraySort from "array-sort";

//action
import { getRedeem } from "../../../store/redeem/action";
import { getSetting } from "../../../store/setting/action";

//MUI

//dayjs
import { IconCopy } from "@tabler/icons-react";
import dayjs from "dayjs";
import Rcoin from "../../../assets/images/rcoin.webp";
import Pagination from "../../../pages/Pagination";
import { getAgencyRedeem } from "../../../store/agenyRedeem/action";
import { Toast } from "../../../util/Toast";

const TablePaginationActions = React.lazy(() => import("../TablePagination"));

const DeclineRedeemTable = (props) => {
  const dispatch = useDispatch();
  const [coinSort, setCoinSort] = useState(true);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [activePage, setActivePage] = useState(1);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    dispatch(getSetting());
    // dispatch(getAgencyRedeem("decline"));
  }, [dispatch]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(getAgencyRedeem("decline", activePage, rowsPerPage, search));
    }, 100);
    return () => clearTimeout(timeout);
  }, [activePage, rowsPerPage]);

  const redeem = useSelector((state) => state.agencyRedeem.agencyRedeem);
  const setting = useSelector((state) => state.setting.setting);

  useEffect(() => {
    setData(redeem.data);
  }, [redeem]);

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  const handleRowsPerPage = (value) => {
    setActivePage(1);
    setRowsPerPage(value);
  };

  const searchTimeout = useRef(null);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    
    searchTimeout.current = setTimeout(() => {
      setActivePage(1);
      dispatch(getAgencyRedeem("decline", 1, rowsPerPage, value));
    }, 1000);
  };

  const handleCoinSort = () => {
    setCoinSort(!coinSort);
    arraySort(data, "rCoin", { reverse: coinSort });
  };

  const copyToClipboard = (Text) => {
    navigator.clipboard.writeText(Text);
    Toast("success", "Copied successfully!");
  };

  return (
    <>
      <div className="row mb-3">
        <div className="col-12">
          <div className="filter-bar">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
              <div></div>
              <div className="search-wrapper">
                <i className="fas fa-search search-icon"></i>
                <input
                  type="search"
                  placeholder="Search by agency name"
                  className="search-input"
                  value={search}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col">
          <div className="table-card">
            {/* <div className="table-card-body"> */}
              <div style={{ overflowX: "auto", width: "100%" }}>
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>Agency Name</th>
                      <th>Agency Code</th>
                      <th>Description</th>
                      <th
                        onClick={handleCoinSort}
                        style={{ cursor: "pointer" }}
                      >
                        RCoin {coinSort ? " ▼" : " ▲"}
                      </th>
                      <th>Amount({setting.currency?.symbol || "$"})</th>
                      <th>Decline date</th>
                      <th>Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.length > 0 ? (
                      (rowsPerPage > 0
                        ? data.slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage,
                          )
                        : data
                      ).map((data, index) => {
                        return (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{data?.agency?.name || "-"}</td>
                            <td>
                              {data?.agency?.agencyCode || "-"}
                              {data?.agency?.agencyCode && (
                              <IconCopy
                                size={16}
                                className="ms-1"
                                style={{ cursor: "pointer" }}
                                onClick={() =>
                                  copyToClipboard(
                                    data?.agency?.agencyCode || "-",
                                  )
                                }
                              />
                              )}
                            </td>
                            <td>{data?.description}</td>
                            <td>
                              <img
                                src={Rcoin}
                                width="15px"
                                height="15px"
                                style={{
                                  verticalAlign: "middle",
                                  marginRight: "1px",
                                }}
                              />
                              {data?.rCoin}
                            </td>
                            <td>
                              {(data?.rCoin / setting?.rCoinForCashOut).toFixed(
                                2,
                              )}{" "}
                              {setting.currency?.symbol || "$"}
                            </td>
                            <td>
                              {dayjs(data?.updatedAt).format("DD MMM, YYYY")}
                            </td>
                            <td style={{ maxWidth: "200px" }}>
                              <div
                                style={{
                                  whiteSpace: expanded ? "normal" : "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {data?.reason || "-"}
                              </div>
                              {data?.reason?.length > 20 && (
                                <button
                                  onClick={() => setExpanded(!expanded)}
                                  style={{
                                    marginTop: "4px",
                                    border: "none",
                                    background: "transparent",
                                    color: "#6ea8fe",
                                    cursor: "pointer",
                                    fontSize: "12px",
                                    padding: "0",
                                  }}
                                >
                                  {expanded ? "Show Less" : "Show More"}
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="10" align="center">
                          Nothing to show!!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            {/* </div> */}
              <div className="px-5">
              <Pagination
                activePage={activePage}
                rowsPerPage={rowsPerPage}
                userTotal={redeem.total}
                handleRowsPerPage={handleRowsPerPage}
                handlePageChange={handlePageChange}
              />
              </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default connect(null, { getRedeem, getSetting })(DeclineRedeemTable);
