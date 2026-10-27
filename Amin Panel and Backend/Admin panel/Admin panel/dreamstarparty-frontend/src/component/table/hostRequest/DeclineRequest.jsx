import { IconCopy } from "@tabler/icons-react";
import dayjs from "dayjs";
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Pagination from "../../../pages/Pagination";
import { getHostRequest } from "../../../store/hostRequest/action";

import Male from "../../../assets/images/male.png";
import { Toast } from "../../../util/Toast";

const DeclineRequest = () => {
  const dispatch = useDispatch();
  const { request, total } = useSelector((state) => state.hostRequest);
  const navigate = useNavigate();
  const [coinSort, setCoinSort] = useState(true);
  const [data, setData] = useState([]);
  const [type, setType] = useState("Pending");
  const [activePage, setActivePage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(getHostRequest(activePage, rowsPerPage, 3));
  }, [activePage, rowsPerPage, 3]);

  useEffect(() => {
    setData(request);
  }, [request]);

  //   pagination

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
      const val = value.trim().toLowerCase();
      if (val) {
        const filteredData = request.filter((item) => {
          return (
            item?.user?.name?.toLowerCase().includes(val) ||
            item?.agencyCode?.toString().includes(val)
          );
        });
        setData(filteredData);
      } else {
        setData(request);
      }
    }, 1000);
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
              {/* Left — Action buttons placeholder */}
              <div className="d-flex align-items-center gap-2">
                {/* Add buttons here if needed */}
              </div>

              {/* Right — Search */}
              <div className="search-wrapper">
                <i className="fas fa-search search-icon"></i>
                <input
                  type="search"
                  id="searchBar"
                  autoComplete="off"
                  placeholder="Search by username or agency code"
                  className="search-input"
                  value={search}
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
            <div
              style={{ overflowX: "auto", width: "100%" }}
              // className="table-card-body"
            >
              {/* <div className="d-sm-flex align-items-center justify-content-between mb-4"></div> */}
              <table className="table table-striped">
                <thead className="text-white">
                  <tr>
                    <th>No.</th>
                    <th>Image</th>
                    <th>User Name</th>
                    <th>Agency Code</th>
                    <th>CreatedAt</th>
                  </tr>
                </thead>
                <tbody className="t">
                  {data?.length > 0 ? (
                    data?.map((data, index) => {
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>
                            <img
                              height="50px"
                              width="50px"
                              alt="app"
                              src={data?.user?.image || Male}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = Male;
                              }}
                              style={{
                                boxShadow: "0 5px 15px 0 rgb(105 103 103 / 0%)",
                                border: "2px solid #fff",
                                borderRadius: 10,
                                objectFit: "cover",
                                display: "block",
                              }}
                              className="mx-auto"
                            />
                          </td>
                          <td>
                            {data?.user?.name}{" "}
                            {data?.user?.name && (
                            <IconCopy
                              size={16}
                              className="ms-1"
                              style={{ cursor: "pointer" }}
                              onClick={() => copyToClipboard(data?.user?.name)}
                            />
                            )}
                          </td>

                          <td>
                            {data?.agencyCode ? data?.agencyCode : "-"}{" "}
                            {data?.agencyCode && (
                            <IconCopy
                              size={16}
                              className="ms-1"
                              style={{ cursor: "pointer" }}
                              onClick={() =>
                                copyToClipboard(
                                  data?.agencyCode ? data?.agencyCode : "-",
                                )
                              }
                            />
                            )}
                          </td>

                          <td>
                            {dayjs(data?.createdAt).format("DD MMM, YYYY")}
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

export default DeclineRequest;
