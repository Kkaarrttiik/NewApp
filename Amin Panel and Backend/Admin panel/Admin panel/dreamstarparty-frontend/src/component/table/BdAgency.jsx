import { useEffect, useState, useRef } from "react";

//routing
import { Link, useLocation, useNavigate } from "react-router-dom";

//image
import Pagination from "../../pages/Pagination";
import { apiInstanceFetch } from "../../util/api";
import { IconCopy } from "@tabler/icons-react";
import { Toast } from "../../util/Toast";

const BdAgency = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const id = location.state?.id;
  const [data, setData] = useState([]);

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [activePage, setActivePage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = (pageNum, limit, query) => {
    if (!id) return;
    apiInstanceFetch
      .get(
        `bd/bdAgencies?bdId=${id}&start=${pageNum}&limit=${limit}&search=${query}`,
      )
      .then((res) => {
        if (res.status) {
          setData(res.data);
          setTotal(res.total);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchData(page, rowsPerPage, searchQuery);
  }, [id, page, rowsPerPage, searchQuery]);

  const searchTimeout = useRef(null);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      setSearchQuery(value.trim());
      setActivePage(1);
      setPage(1);
    }, 1000);
  };

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
    setPage(pageNumber);
  };

  const handleRowsPerPage = (value) => {
    setActivePage(1);
    setPage(1);
    setRowsPerPage(value);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    Toast("success", "Copied successfully!");
  };

  return (
    <>
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last mb-4">
            <button
              className="btn btn-danger custom-btn"
              onClick={() => navigate("/admin/bd")}
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
                <li className="breadcrumb-item">
                  <Link to="/admin/bd" className="text-white">
                    Bd
                  </Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Agency
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-12">
          <div className="filter-bar">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
              <div></div>

              <div className="search-wrapper">
                <i className="fas fa-search search-icon"></i>
                <input
                  type="search"
                  placeholder="Search by name or uniqueId"
                  className="search-input"
                  value={search}
                  onChange={handleSearch}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── TABLE CARD ── */}
      <div className="row mt-4">
        <div className="col">
          <div className="table-card">
            {/* <div className="table-card-body"> */}
            <div style={{ overflowX: "auto", width: "100%" }}>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th className="text-nowrap">Profile</th>
                    <th>User</th>
                    <th>rCoin</th>
                    <th>isActive</th>
                    <th>Agency Code</th>
                    <th>mobile</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.length > 0 ? (
                    data?.map((data, index) => {
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>

                          {/* Current User */}
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <img
                                height="50px"
                                width="50px"
                                alt="app"
                                src={data?.image}
                                style={{
                                  border: "2px solid #1e2640",
                                  borderRadius: 10,
                                  objectFit: "cover",
                                  display: "block",
                                }}
                              />
                              <div className="text-start">
                                <p className="m-0 small-text text-nowrap">
                                  {data?.name ? data?.name : "-"}
                                </p>
                                <p
                                  className="m-0 small-text text-nowrap"
                                  style={{ color: "#9CA3AF" }}
                                >
                                  • {data?.uniqueId ? data?.uniqueId : "-"}
                                  <IconCopy
                                    size={16}
                                    className="ms-1"
                                    style={{ cursor: "pointer" }}
                                    onClick={() =>
                                      copyToClipboard(
                                        data?.uniqueId ? data?.uniqueId : "-",
                                      )
                                    }
                                  />
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* User */}
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <img
                                height="50px"
                                width="50px"
                                alt="app"
                                src={data?.user?.image}
                                style={{
                                  border: "2px solid #1e2640",
                                  borderRadius: 10,
                                  objectFit: "cover",
                                  display: "block",
                                }}
                              />
                              <div className="text-start">
                                <p className="m-0 small-text text-nowrap">
                                  {data?.user?.name ? data?.user?.name : "-"}
                                </p>
                                <p
                                  className="m-0 small-text text-nowrap"
                                  style={{ color: "#9CA3AF" }}
                                >
                                  •{" "}
                                  {data?.user?.uniqueId
                                    ? data?.user?.uniqueId
                                    : "-"}
                                    <IconCopy
                                    size={16}
                                    className="ms-1"
                                    style={{ cursor: "pointer" }}
                                    onClick={() =>
                                      copyToClipboard(
                                        data?.uniqueId ? data?.uniqueId : "-",
                                      )
                                    }
                                  />
                                </p>
                              </div>
                            </div>
                          </td>

                          <td>{data?.rCoin}</td>

                          <td>
                            <p
                              style={{
                                fontSize: 12,
                                color: "#ffffff",
                                marginTop: "6px",
                              }}
                            >
                              {data?.isActive ? "Yes" : "No"}
                            </p>
                          </td>

                          <td>{data?.agencyCode}</td>
                          <td>{data?.mobile}</td>
                          <td className="text-nowrap">
                            {new Date(data?.createdAt).toLocaleString()}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="25" align="center">
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

export default BdAgency;
