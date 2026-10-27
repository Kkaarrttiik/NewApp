import React, { useEffect, useState } from "react";

//MUI

//react-router-dom
import { Link } from "react-router-dom";

//rect-redux
import { connect, useDispatch, useSelector } from "react-redux";

//image
import Male from "../../assets/images/male.png";

//action
import { getReportedUser } from "../../store/reportedUser/action";

//dayjs
import dayjs from "dayjs";
import $ from "jquery";

import Diamond from "../../assets/images/diamond.png";
import male from "../../assets/images/male.png";
import Rcoin from "../../assets/images/rcoin.webp";
import Pagination from "../../pages/Pagination";
import { formatNumber } from "../../util/formatNumber";

//pagination
const TablePaginationActions = React.lazy(() => import("./TablePagination"));

const ReportedUser = (props) => {
  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [activePage, setActivePage] = useState(1);
  const { reportedUser, total } = useSelector((state) => state.report);

  useEffect(() => {
    dispatch(getReportedUser({ start: page, limit: rowsPerPage }));
  }, [dispatch, page, rowsPerPage]);

  useEffect(() => {
    setData(reportedUser);
  }, [reportedUser]);

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
    setPage(pageNumber);
  };

  const handleRowsPerPage = (value) => {
    setActivePage(1);
    setRowsPerPage(value);
  };

  // set default image

  $(document).ready(function () {
    $("img").bind("error", function () {
      // Set the default image
      $(this).attr("src", male);
    });
  });

  return (
    <>
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3 className="mb-3 text-white">Reported User</h3>
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
                  Reported User
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      {/* ── SEPARATE TABLE CARD ── */}
      <div className="row mt-4">
        <div className="col">
          <div className="table-card">
            <div
              style={{ overflowX: "auto", width: "100%" }}
              // className="table-card-body"
            >
              <table className="table table-striped" style={{ borderCollapse: "collapse" }}>
                <thead className="text-center">
                  <tr>
                    <th>No</th>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Diamond</th>
                    <th>RCoin</th>
                    <th>Country</th>
                    <th>Count</th>
                    <th>Info</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {data?.length > 0 ? (
                    data?.map((data, index) => {
                      return (
                        <>
                          <tr
                            data-bs-toggle="collapse"
                            data-bs-target={`#demo${index}`}
                            className="accordion-toggle pointer-cursor"
                          >
                            <td>{index + 1}</td>
                            <td>
                              <img
                                height="50px"
                                width="50px"
                                alt="app"
                                className="mx-auto"
                                src={data._id?.image ? data._id.image : Male}
                                style={{
                                  boxShadow:
                                    "0 5px 15px 0 rgb(105 103 103 / 0%)",
                                  border: "2px solid #1e2640",
                                  borderRadius: 10,
                                  objectFit: "cover",
                                  display: "block",
                                }}
                              />
                            </td>
                            <td>{data._id.name}</td>
                            <td className="text-success">
                              <img
                                src={Diamond}
                                width="15"
                                height="15"
                                style={{
                                  verticalAlign: "middle",
                                  marginRight: "1px",
                                }}
                              />{" "}
                              {formatNumber(data._id.diamond) || 0}
                            </td>
                            <td className="text-warning">
                              <img
                                src={Rcoin}
                                width="15px"
                                height="15px"
                                style={{
                                  verticalAlign: "middle",
                                  marginRight: "1px",
                                }}
                              />{" "}
                              {formatNumber(data._id.rCoin) || 0}
                            </td>
                            <td className="text-info">
                              {data._id.country ? data?._id?.country : "-"}
                            </td>
                            <td className="text-danger">{data.count}</td>
                            <td className="pointer-cursor">
                              <i className="fas fa-info-circle fa-lg"></i>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan="8" className="hiddenRow">
                              <div
                                id={`demo${index}`}
                                className="accordian-body collapse"
                              >
                                <h6 className="text-white">
                                  Report User Detail
                                </h6>
                                <table className="w-100">
                                  <thead>
                                    <tr>
                                      <th>No</th>
                                      <th>Image</th>
                                      <th>Name</th>
                                      <th>Diamond</th>
                                      <th>RCoin</th>
                                      <th>Country</th>
                                      <th>Description</th>
                                      <th>Arrived on</th>
                                    </tr>
                                  </thead>
                                  <tbody
                                    style={{
                                      maxHeight: 100,
                                      overflowY: "auto",
                                    }}
                                  >
                                    {data.report.length > 0 ? (
                                      data.report.map((report, no) => {
                                        return (
                                          <tr key={no}>
                                            <td>{no + 1}</td>
                                            <td>
                                              <img
                                                height="35px"
                                                width="35px"
                                                alt="app"
                                                src={
                                                  report?.toUserId?.image
                                                    ? report?.toUserId.image
                                                    : Male
                                                }
                                                style={{
                                                  boxShadow:
                                                    "0 5px 15px 0 rgb(105 103 103 / 0%)",
                                                  border: "2px solid #1e2640",
                                                  borderRadius: 10,
                                                  objectFit: "cover",
                                                }}
                                              />
                                            </td>
                                            <td>{report?.toUserId?.name}</td>
                                            <td className="text-success">
                                              <img
                                                src={Diamond}
                                                width="15"
                                                height="15"
                                              />
                                              {formatNumber(report?.toUserId?.diamond) || 0}
                                            </td>
                                            <td className="text-warning">
                                              <img
                                                src={Rcoin}
                                                width="15px"
                                                height="15px"
                                              />
                                              {formatNumber(report?.toUserId?.rCoin) || 0}
                                            </td>
                                            <td className="text-info">
                                              {report?.toUserId?.country
                                                ? report.toUserId?.country
                                                : "-"}
                                            </td>
                                            <td>{report?.description}</td>
                                            <td>
                                              {dayjs(
                                                report?.toUserId?.createdAt,
                                              ).format("DD MMM, YYYY")}
                                            </td>
                                          </tr>
                                        );
                                      })
                                    ) : (
                                      <tr>
                                        <td colSpan="7" align="center">
                                          Nothing to show!!
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        </>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="7" align="center">
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
                userTotal={total}
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

export default connect(null, { getReportedUser })(ReportedUser);
