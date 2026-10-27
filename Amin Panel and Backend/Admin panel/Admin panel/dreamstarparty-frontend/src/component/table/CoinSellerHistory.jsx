import React, { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { getCoinSellerHistory } from "../../store/coinSeller/action";
//pagination
import { useDispatch } from "react-redux";
import Diamond from "../../assets/images/diamond.png";
import Pagination from "../../pages/Pagination";
import { IconCopy } from "@tabler/icons-react";
import { Toast } from "../../util/Toast";

const TablePaginationActions = React.lazy(() => import("./TablePagination"));

const CoinSellerHistory = (props) => {
  const location = useLocation();
  const navigate = useNavigate();

  let history_ = location?.state;
  const { coinSellerHistory, totalCoin, totalHistory } = useSelector(
    (state) => state.coinSeller,
  );
  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    dispatch(getCoinSellerHistory(history_?._id, activePage, rowsPerPage));
  }, [location, activePage, rowsPerPage]);

  useEffect(() => {
    setData(coinSellerHistory);
  }, [coinSellerHistory]);

  //   pagination

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  const handleRowsPerPage = (value) => {
    setActivePage(1);
    setRowsPerPage(value);
  };

  const copyToClipboard = (Text) => {
    navigator.clipboard.writeText(Text);
    Toast("success", "Copied successfully!");
  };

  return (
    <>
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <button
              className="btn btn-danger custom-btn"
              onClick={() => navigate(-1)}
            >
              <i className="fas fa-chevron-left"></i> Go Back
            </button>
          </div>
          <div className="col-12 col-md-6 order-md-2 order-first">
            <nav
              aria-label="breadcrumb"
              className="breadcrumb-header float-start float-lg-end"
            >
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/admin/dashboard" className="text-white">
                    Dashboard
                  </Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  CoinSeller History
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between mt-4 px-2">
        <h4 className="text-white">
          {history_?.user?.name ? history_?.user?.name : "-"}'s History
        </h4>
        <span className="text-danger">
          Total Coin :<span className="text-info">&nbsp;&nbsp;{totalCoin}</span>
        </span>
      </div>

      {/* ── TABLE CARD ── */}
      <div className="row mt-4">
        <div className="col">
          <div className="table-card" id="card">
            <div
              style={{ overflowX: "auto", width: "100%" }}
              // className="table-card-body"
            >
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Profile</th>
                    <th>Name</th>
                    <th>Unique Id</th>
                    <th>Coin</th>
                    <th>Purchase Date</th>
                    <th>Purchase time</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.length > 0 ? (
                    data.map((data, index) => {
                      var date = data?.date ? data?.date?.split(",") : [];
                      return (
                        <tr key={index}>
                          <td>{(activePage - 1) * rowsPerPage + index + 1}</td>
                          <td>
                            <img
                              src={data?.user?.image}
                              alt="profilePicture"
                              height="50px"
                              width="50px"
                              style={{
                                boxShadow: "0 5px 15px 0 rgb(105 103 103 / 0%)",
                                border: "2px solid #fff",
                                borderRadius: 10,
                                objectFit: "cover",
                              }}
                            />
                          </td>
                          <td>
                            {data?.user == null || data?.user?.name == ""
                              ? data?.isIncome === true
                                ? "Add by admin"
                                : "Less by admin"
                              : data?.user?.name}
                          </td>
                          <td>
                            {data?.user?.uniqueId && data?.user?.uniqueId}{" "}
                            <IconCopy
                              size={16}
                              style={{ cursor: "pointer" }}
                              onClick={() =>
                                copyToClipboard(data?.user?.uniqueId)
                              }
                            />
                          </td>
                          <td
                            className={`${
                              data?.isIncome === true
                                ? "text-danger"
                                : "text-warning"
                            } fw-bold`}
                          >
                            <img
                              src={Diamond}
                              width="15"
                              height="15"
                              style={{
                                verticalAlign: "middle",
                                marginRight: "1px",
                              }}
                            />{" "}
                            {data?.isIncome === true
                              ? "+" + " " + data?.coin
                              : "-" + " " + data?.coin}
                          </td>
                          <td>{date[0]}</td>
                          <td>{date[1]}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="20" align="center">
                        Nothing to show!!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-5">
              <Pagination
                activePage={activePage}
                rowsPerPage={rowsPerPage}
                userTotal={totalHistory}
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

export default connect(null, { getCoinSellerHistory })(CoinSellerHistory);
