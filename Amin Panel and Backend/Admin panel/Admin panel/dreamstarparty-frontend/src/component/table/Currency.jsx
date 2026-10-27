import { Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePermission } from "../../context/PermissionProvider";
import {
  deleteCurrency,
  getCurrency,
  updateCurrencyStatus,
} from "../../store/currency/action";
import { OPEN_CURRENCY_DIALOG } from "../../store/currency/types";
import { warning } from "../../util/Alert";
import CurrencyDialogue from "../dialog/CurrencyDialogue";

const Currency = () => {
  const dispatch = useDispatch();

  const { currency } = useSelector((state) => state.currency);
  const { can } = usePermission();
  const canCreate = can("admin/Setting", "Create");
  const canEdit = can("admin/Setting", "Edit");
  const canDelete = can("admin/Setting", "Delete");

  const [data, setData] = useState([]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    dispatch(getCurrency());
  }, []);

  useEffect(() => {
    setData(currency);
    setTotal(currency.total);
  }, [currency]);

  const handleOpen = () => {
    dispatch({ type: OPEN_CURRENCY_DIALOG });
  };

  const handleEdit = (data) => {
    dispatch({ type: OPEN_CURRENCY_DIALOG, payload: data });
  };

  const handleDelete = (id) => {
    const data = warning();
    data
    .then((isDeleted) => {
      if (isDeleted) {
          dispatch(deleteCurrency(id));
        }
      })
      .catch((err) => console.log(err));
  };

  const handleSwitch = (id) => {
    dispatch(updateCurrencyStatus(id));
  };

  return (
    <>
      <CurrencyDialogue />

      {/* ── SEPARATE ACTION BAR ── */}
      {canCreate && (
        <div className="row mb-3">
          <div className="col-12">
            <div className="filter-bar">
              <div className="d-flex align-items-center gap-2">
                <button
                  type="button"
                  className="edit-btn"
                  onClick={handleOpen}
                  id="bannerDialog"
                >
                  <i className="fa fa-plus"></i>
                  <span className="icon_margin">New</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── SEPARATE TABLE CARD ── */}
      <div className="row mt-4">
        <div className="col">
          <div className="table-card">
            <div
              style={{ overflowX: "auto", width: "100%" }}
              // className="table-card-body"
            >
              <table className="table table-striped">
                <thead className="text-white">
                  <tr>
                    <th>No.</th>
                    <th>Name</th>
                    <th>Symbol</th>
                    <th>Country code</th>
                    <th>Currency code</th>
                    {canEdit && <th>Is Default</th>}
                    <th>Created date</th>
                    {canEdit && <th>Edit</th>}
                    {canDelete && <th>Delete</th>}
                  </tr>
                </thead>
                <tbody className="text-center">
                  {data.length > 0 ? (
                    (rowsPerPage > 0
                      ? data.slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage,
                        )
                      : data
                    ).map((data, index) => {
                      return (
                        <tr key={index + data._id}>
                          <td>{index + 1}</td>
                          <td>{data?.name}</td>
                          <td>{data?.symbol}</td>
                          <td>{data?.countryCode}</td>
                          <td>{data?.currencyCode}</td>
                          {canEdit && (
                            <td>
                              <label className="switch">
                                <input
                                  type="checkbox"
                                  checked={data?.isDefault}
                                  onChange={() => handleSwitch(data?._id)}
                                />
                                <span className="slider"></span>
                              </label>
                            </td>
                          )}
                          <td>{data?.createdAt?.split("T")[0]}</td>
                          {canEdit && (
                            <td>
                              <Tooltip title="Edit">
                                <button
                                  type="button"
                                  className="btn-sm edit-btn"
                                  onClick={() => handleEdit(data)}
                                >
                                  <i className="fa fa-edit"></i>
                                </button>
                              </Tooltip>
                            </td>
                          )}
                          {canDelete && (
                            <td>
                              <Tooltip title="Delete">
                                <button
                                  type="button"
                                  className="btn-sm delete-btn"
                                  onClick={() => handleDelete(data._id)}
                                >
                                  <i className="fas fa-trash-alt"></i>
                                </button>
                              </Tooltip>
                            </td>
                          )}
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="9" align="center">
                        Nothing to show!!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {/* <Pagination
                      activePage={activePage}
                      rowsPerPage={rowsPerPage}
                      userTotal={redeemOptions.length}
                      handleRowsPerPage={handleRowsPerPage}
                      handlePageChange={handlePageChange}
                    /> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Currency;
