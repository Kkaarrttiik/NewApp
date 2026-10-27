import React, { useEffect, useState, useRef } from "react";

//react-redux
import { useDispatch, useSelector } from "react-redux";

//routing
import { useNavigate } from "react-router-dom";

import Male from "../../../assets/images/male.png";

//dayjs
import dayjs from "dayjs";

import { IconCopy } from "@tabler/icons-react";
import { usePermission } from "../../../context/PermissionProvider";
import Pagination from "../../../pages/Pagination";
import { getHostRequest } from "../../../store/hostRequest/action";
import {
  OPEN_AGENCY_CODE_DIALOGUE,
  OPEN_BANK_DETAILS_DIALOGUE,
  OPEN_REASON_DIALOGUE,
} from "../../../store/hostRequest/type";
import AddAgencyCodeDialogue from "./AddAgencyCodeDialogue";
import BankDetailsDialogue from "./BankDetailsDialogue";
import ReasonDialogue from "./ReasonDialogue";
import { Toast } from "../../../util/Toast";

// import ReasonDialogue from "./ReasonDialogue";
// import AddAgencyCodeDialogue from "./AddAgencyCodeDialogue";

const PendingRequest = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { request, total } = useSelector((state) => state.hostRequest);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [activePage, setActivePage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { can } = usePermission();
  const canCreate = can("admin/hostRequest", "Create");
  const canEdit = can("admin/hostRequest", "Edit");
  const canDelete = can("admin/hostRequest", "Delete");

  const [sDate, setsDate] = useState(() => {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    return dayjs(startOfMonth).format("YYYY/M/DD");
  });

  const [eDate, seteDate] = useState(() => {
    const endOfMonth = new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1, 0);
    return dayjs(endOfMonth).format("YYYY/M/DD");
  });

  // Add formatted date variables
  const formattedStart =
    sDate === "ALL" ? "ALL" : dayjs(sDate).format("YYYY/M/DD");
  const formattedEnd =
    eDate === "ALL" ? "ALL" : dayjs(eDate).format("YYYY/M/DD");

  useEffect(() => {
    dispatch(getHostRequest(activePage, rowsPerPage, 1));
  }, [activePage, rowsPerPage, 1]);

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

  const handleUserInfo = (user) => {
    sessionStorage.setItem("user", JSON.stringify(user));
    navigate("/admin/user/detail", {
      state: {
        id: user?.user?._id,
      },
    });
  };

  const handleAcceptDecline = (data, type) => {
    if (
      (data?.agencyCode === "" || data?.agencyCode == null) &&
      type === "accept"
    ) {
      dispatch({
        type: OPEN_AGENCY_CODE_DIALOGUE,
        payload: { data: data, type: type },
      });
    } else {
      dispatch({
        type: OPEN_BANK_DETAILS_DIALOGUE,
        payload: { data: data, type: type },
      });
    }
  };

  const handleDecline = (id, type) => {
    dispatch({ type: OPEN_REASON_DIALOGUE, payload: { id: id, type: type } });
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
                  placeholder="Search by name or agency code"
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
                    {canEdit && <th>Accept</th>}
                    {canEdit && <th>Decline</th>}
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
                                onClick={() =>
                                  copyToClipboard(data?.user?.name)
                                }
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
                          {canEdit && (
                            <td>
                              <button
                                className="btn-sm edit-btn"
                                onClick={() =>
                                  handleAcceptDecline(data, "accept")
                                }
                              >
                                <i className="fa fa-check"></i> Accept
                              </button>
                            </td>
                          )}
                          {canEdit && (
                            <td>
                              <button
                                className="btn-sm delete-btn"
                                onClick={() => handleDecline(data, "decline")}
                              >
                                <i className="fas fa-times"></i> Decline
                              </button>
                            </td>
                          )}
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
      <ReasonDialogue />
      <AddAgencyCodeDialogue />
      <BankDetailsDialogue />
    </>
  );
};

export default PendingRequest;
