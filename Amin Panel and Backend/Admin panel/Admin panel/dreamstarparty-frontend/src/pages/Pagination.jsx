import React from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

const TablePagination = (props) => {
  const totalPages = Math.ceil(
    (props.userTotal || 0) / (Number(props.rowsPerPage) || 1)
  );

  const handlePage = (event, page) => {
    props.handlePageChange(page);
  };

  const handleRowsPerPage = (value) => {
    props.handleRowsPerPage(value);
  };

  const total = props.userTotal || 0;
  const page = props.activePage || 1;
  const rows = Number(props.rowsPerPage) || 10;
  
  const start = total === 0 ? 0 : (page - 1) * rows + 1;
  const end = Math.min(page * rows, total);

  return (
    <div className="d-flex flex-column flex-md-row align-items-center justify-content-between py-3 gap-3">
      {/* Rows Per Page */}
      <div className="d-flex align-items-center order-1">
        <span className="text-white opacity-75">
          Rows per page :
        </span>

        <select
          className="form-select form-control ms-2"
          style={{
            maxHeight: 40,
            width: "auto",
            backgroundColor: "#1f1f2b",
            color: "#fff",
            borderColor: "#2e303a",
          }}
          value={props.rowsPerPage}
          onChange={(e) => handleRowsPerPage(e.target.value)}
        >
          {[5, 10, 25, 50, 100].map((val) => (
            <option
              key={val}
              value={val}
              className="bg-dark"
            >
              {val}
            </option>
          ))}
        </select>
      </div>

      <div className="d-flex flex-column flex-md-row align-items-center gap-4 order-2">
        {/* Showing entries info */}
        <div className="text-white opacity-75" style={{ fontSize: "14px" }}>
          Showing {start} - {end} of {total} entries
        </div>

        {/* Pagination */}
        <div className="d-flex justify-content-center">
          <Stack spacing={2}>
            <Pagination
              count={totalPages}
              page={props.activePage || 1}
              onChange={handlePage}
              variant="outlined"
              shape="rounded"
              siblingCount={1}
              boundaryCount={1}
              sx={{
                "& .MuiPaginationItem-root": {
                  color: "#fff",
                  borderColor: "#2e303a",
                  backgroundColor: "#1f1f2b",
                },
                "& .Mui-selected": {
                  backgroundColor: "#7367f0 !important",
                  color: "#fff",
                },
              }}
            />
          </Stack>
        </div>
      </div>
    </div>
  );
};

export default TablePagination;