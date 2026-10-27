import React, { useEffect, useState, useRef } from "react";

//react-redux
import { connect, useDispatch, useSelector } from "react-redux";

//routing

import arraySort from "array-sort";

//action
import { getSetting } from "../../../store/setting/action";

//MUI

//dayjs
import { IconCopy } from "@tabler/icons-react";
import dayjs from "dayjs";
import Pagination from "../../../pages/Pagination";
import { clearBdRedeem, getBdRedeem } from "../../../store/bdRedeem/action";
import { Toast } from "../../../util/Toast";

const TablePaginationActions = React.lazy(() => import("../TablePagination"));

const AcceptedRedeemTable = (props) => {
  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [coinSort, setCoinSort] = useState(true);
  const [activePage, setActivePage] = useState(1);

  useEffect(() => {
    dispatch(getSetting());
    dispatch(clearBdRedeem());
  }, [dispatch]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(getBdRedeem("approved", activePage, rowsPerPage, search));
    }, 100);
    return () => clearTimeout(timeout);
  }, [activePage, rowsPerPage]);

  const redeem = useSelector((state) => state.bdRedeem.bdRedeem);
  const setting = useSelector((state) => state.setting.setting);

  useEffect(() => {
    setData(redeem.data);
  }, [redeem]);

  const searchTimeout = useRef(null);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    
    searchTimeout.current = setTimeout(() => {
      setActivePage(1);
      dispatch(getBdRedeem("approved", 1, rowsPerPage, value));
    }, 1000);
  };

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  const handleRowsPerPage = (value) => {
    setActivePage(1);
    setRowsPerPage(value);
  };

  const handleCoinSort = () => {
    setCoinSort(!coinSort);
    arraySort(data, "amount", { reverse: coinSort });
  };

  const copyToClipboard = (Text) => {
    navigator.clipboard.writeText(Text);
    Toast("success", "Copied successfully!");
  };

  return (
    <>
      {/* ── SEPARATE SEARCH/ACTION BAR ── */}
      <div className="row mb-3">
        <div className="col-12">
          <div className="filter-bar">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
              <div></div>
              <div className="search-wrapper">
                <i className="fas fa-search search-icon"></i>
                <input
                  type="search"
                  placeholder="Search by name"
                  className="search-input"
                  onChange={handleSearchChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── SEPARATE TABLE CARD ── */}
      <div className="row mt-4">
        <div className="col">
          <div className="table-card">
            {/* <div className="table-card-body"> */}
              <div style={{ overflowX: "auto", width: "100%" }}>
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>Profile</th>
                      <th>Unique ID</th>
                      <th>BD Code</th>
                      <th
                        onClick={handleCoinSort}
                        style={{ cursor: "pointer" }}
                      >
                        Amount {coinSort ? " ▼" : " ▲"}
                      </th>
                      <th>Accepted Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.length > 0 ? (
                      (rowsPerPage > 0
                        ? data?.slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage,
                          )
                        : data
                      ).map((data, index) => {
                        return (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>
                              <img
                                src={data.bd?.image}
                                alt="Profile"
                                width="40px"
                                height="40px"
                                style={{
                                  borderRadius: "50%",
                                  objectFit: "cover",
                                  border: "2px solid #1e2640",
                                  marginRight: 8,
                                }}
                              />
                              {data.bd?.name || "-"}
                            </td>
                            <td>{data.bd?.uniqueId || "-"}</td>
                            <td>
                              {data.bd?.bdCode || "-"}
                              {data.bd?.bdCode && (
                              <IconCopy
                                size={16}
                                className="ms-1"
                                style={{ cursor: "pointer" }}
                                onClick={() => copyToClipboard(data.bd?.bdCode)}
                              />
                              )}
                            </td>
                            <td>{data.amount}</td>
                            <td>
                              {dayjs(data.updatedAt).format("DD MMM, YYYY")}
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

export default connect(null, { getSetting })(AcceptedRedeemTable);
