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
import dayjs from "dayjs";
import Rcoin from "../../../assets/images/rcoin.webp";
import Pagination from "../../../pages/Pagination";
import { formatNumber } from "../../../util/formatNumber";

const TablePaginationActions = React.lazy(() => import("../TablePagination"));

const AcceptedRedeemTable = (props) => {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [coinSort, setCoinSort] = useState(true);
  const [activePage, setActivePage] = useState(1);

  useEffect(() => {
    dispatch(getSetting());
    // dispatch(getRedeem("solved"));
  }, [dispatch]);

  const redeem = useSelector((state) => state.redeem.redeem);
  const setting = useSelector((state) => state.setting.setting);

  useEffect(() => {
    setData(redeem.redeem);
  }, [redeem]);

  useEffect(() => {
    dispatch(getRedeem("solved", search, activePage, rowsPerPage));
  }, [activePage, rowsPerPage]);

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  const searchTimeout = useRef(null);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      dispatch(getRedeem("solved", value, 1, rowsPerPage));
      setActivePage(1);
    }, 1000);
  };

  const handleRowsPerPage = (value) => {
    setActivePage(1);
    setRowsPerPage(value);
  };

  // const handleSearch = (e) => {
  //   const value = e.target.value.toUpperCase()
  //     ? e.target.value.trim().toUpperCase()
  //     : e.target.value.trim();
  //   if (value) {
  //     const data = redeem.filter((data) => {
  //       return (
  //         data?.userId?.name?.toUpperCase()?.indexOf(value) > -1 ||
  //         data?.paymentGateway?.toUpperCase()?.indexOf(value) > -1 ||
  //         data?.description?.toUpperCase()?.indexOf(value) > -1 ||
  //         data?.rCoin?.toString()?.indexOf(value) > -1
  //       );
  //     });
  //     setData(data);
  //   } else {
  //     return setData(redeem);
  //   }
  // };

  const handleCoinSort = () => {
    setCoinSort(!coinSort);
    arraySort(data, "rCoin", { reverse: coinSort });
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
                  placeholder="Search by name, payment getway or descrption"
                  className="search-input"
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
                      <th>User</th>
                      <th>Payment Gateway</th>
                      <th>Description</th>
                      <th
                        onClick={handleCoinSort}
                        style={{ cursor: "pointer" }}
                      >
                        RCoin {coinSort ? " ▼" : " ▲"}
                      </th>
                      <th>Amount({setting.currency?.symbol || "$"})</th>
                      <th>Accepted date</th>
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
                            <td>{data.user?.name}</td>
                            <td>{data.paymentGateway}</td>
                            <td>{data.description}</td>
                            <td>
                              <img
                                src={Rcoin}
                                width="15px"
                                height="15px"
                                style={{
                                  verticalAlign: "middle",
                                  marginRight: "1px",
                                }}
                              />{" "}
                              {formatNumber(data.rCoin) || 0}
                            </td>
                            <td>
                               {data.amount !== undefined && data.amount !== null
                                 ? Number(data.amount).toFixed(2)
                                 : (setting.rCoinForCashOut
                                   ? (data.rCoin / setting.rCoinForCashOut).toFixed(2)
                                   : "0.00")}{" "}
                               {setting.currency?.symbol || "$"}
                            </td>
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

export default connect(null, { getRedeem, getSetting })(AcceptedRedeemTable);
