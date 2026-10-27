import React, { useEffect, useRef, useState } from "react";

//redux
import { connect, useDispatch, useSelector } from "react-redux";

//MUI
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material";

//action
import { Cancel } from "@mui/icons-material";
import $ from "jquery";
import Male from "../../assets/images/male.png";
import { createNewAgency, editAgency } from "../../store/agency/action";
import { CLOSE_AGENCY_DIALOG } from "../../store/agency/type";
import { apiInstanceFetch } from "../../util/api";
import { Toast } from "../../util/Toast";

const AgencyDialogue = (props) => {
  const dispatch = useDispatch();

  const {
    dialog: open,
    dialogData,
    agency,
  } = useSelector((state) => state.agency);

  // ── BD dropdown state ──
  const [bdUsers, setBdUsers] = useState([]);
  const [filteredBdUsers, setFilteredBdUsers] = useState([]);
  const [showBdDropdown, setShowBdDropdown] = useState(false);
  const [bdSearch, setBdSearch] = useState("");
  const bdDropdownRef = useRef(null);

  // ── User UniqueId dropdown state ──
  const [uniqueIdUsers, setUniqueIdUsers] = useState([]);
  const [filteredUniqueIdUsers, setFilteredUniqueIdUsers] = useState([]);
  const [showUniqueIdDropdown, setShowUniqueIdDropdown] = useState(false);
  const [uniqueIdSearch, setUniqueIdSearch] = useState("");
  const uniqueIdDropdownRef = useRef(null);
  const UNIQUE_ID_LIMIT = 10;
  const [uniqueIdStart, setUniqueIdStart] = useState(1); // API `start` (page) value
  const [uniqueIdHasMore, setUniqueIdHasMore] = useState(true);
  const [uniqueIdIsLoading, setUniqueIdIsLoading] = useState(false);
  const uniqueIdListRef = useRef(null);
  const uniqueIdSearchDebounceRef = useRef(null);
  const uniqueIdRequestIdRef = useRef(0);

  const [imageData, setImageData] = useState([]);
  const [uniqueId, setUniqueId] = useState("");
  const [bdId, setBdId] = useState("");
  const [imagePath, setImagePath] = useState(null);
  const [mongoId, setMongoId] = useState("");
  const [name, setName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [code, setCode] = useState("");
  const [bankDetails, setbankDetails] = useState("");
  const [errors, setError] = useState({
    name: "",
    uniqueId: "",
    mobileNumber: "",
    code: "",
    image: "",
    bankDetails: "",
    bd: "",
  });

  // ── Click outside handler for BD dropdown ──
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (bdDropdownRef.current && !bdDropdownRef.current.contains(e.target)) {
        setShowBdDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── Click outside handler for UniqueId dropdown ──
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        uniqueIdDropdownRef.current &&
        !uniqueIdDropdownRef.current.contains(e.target)
      ) {
        setShowUniqueIdDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── Fetch BD users when dialog opens ──
  useEffect(() => {
    if (!open) return;
    apiInstanceFetch.get("bd/getBDDropdown").then((res) => {
      setBdUsers(res.data);
      setFilteredBdUsers(res.data);
    });
  }, [open]);

  // ── Fetch UniqueId users when dialog opens ──
  useEffect(() => {
    if (!open) return;
    setUniqueIdUsers([]);
    setFilteredUniqueIdUsers([]);
    setUniqueIdStart(1);
    setUniqueIdHasMore(true);
    fetchUniqueIdUsersPage(1, "", false);
  }, [open]);

  // ── Reset dropdowns on close ──
  useEffect(() => {
    if (!open) {
      setBdSearch("");
      setShowBdDropdown(false);
      setUniqueIdSearch("");
      setShowUniqueIdDropdown(false);
      // Invalidate any in-flight fetch so late responses don't mutate state.
      uniqueIdRequestIdRef.current += 1;
      setUniqueIdUsers([]);
      setFilteredUniqueIdUsers([]);
      setUniqueIdStart(1);
      setUniqueIdHasMore(true);
      setUniqueIdIsLoading(false);
      if (uniqueIdSearchDebounceRef.current) {
        clearTimeout(uniqueIdSearchDebounceRef.current);
      }
    }
  }, [open]);

  // ── BD search handler ──
  const handleBdSearch = (e) => {
    const value = e.target.value;
    setBdSearch(value);
    setBdId("");
    const filtered = bdUsers.filter(
      (user) =>
        user.name?.toLowerCase().includes(value.toLowerCase()) ||
        String(user.uniqueId)?.toLowerCase().includes(value.toLowerCase()),
    );
    setFilteredBdUsers(filtered);
    setShowBdDropdown(true);
  };

  const selectBdUser = (user) => {
    setBdSearch(`${user.name} (${user.uniqueId})`);
    setBdId(user._id);
    setShowBdDropdown(false);
    setError({ ...errors, bd: "" });
  };

  // ── UniqueId search handler ──
  const handleUniqueIdSearch = (e) => {
    const value = e.target.value;
    setUniqueIdSearch(value);
    setUniqueId("");
    setShowUniqueIdDropdown(true);

    // Debounce to avoid firing an API request on every keystroke.
    if (uniqueIdSearchDebounceRef.current) {
      clearTimeout(uniqueIdSearchDebounceRef.current);
    }
    uniqueIdSearchDebounceRef.current = setTimeout(() => {
      setUniqueIdStart(1);
      setUniqueIdHasMore(true);
      setUniqueIdUsers([]);
      setFilteredUniqueIdUsers([]);
      fetchUniqueIdUsersPage(1, value, false);
    }, 300);
  };

  const selectUniqueIdUser = (user) => {
    setUniqueIdSearch(user.uniqueId);
    setUniqueId(user.uniqueId);
    setShowUniqueIdDropdown(false);
    setError({ ...errors, uniqueId: "" });
  };

  const fetchUniqueIdUsersPage = (startValue, searchTerm, append) => {
    const requestId = ++uniqueIdRequestIdRef.current;
    setUniqueIdIsLoading(true);

    const searchParam = searchTerm?.trim()
      ? encodeURIComponent(searchTerm.trim())
      : "";

    apiInstanceFetch
      .get(
        `user/getUsersUniqueId?start=${startValue}&limit=${UNIQUE_ID_LIMIT}&search=${searchParam}`,
      )
      .then((res) => {
        if (requestId !== uniqueIdRequestIdRef.current) return;

        const incoming = res?.data;
        const dataArray = Array.isArray(incoming) ? incoming : [];

        if (dataArray.length === 0) {
          // End of list (strictly based on empty array response).
          setUniqueIdHasMore(false);
          return;
        }

        // Local filter for safety (in case backend search isn't exact).
        const valueLower = searchTerm?.toLowerCase?.() ?? "";
        const filtered = valueLower
          ? dataArray.filter(
              (user) =>
                user.name?.toLowerCase().includes(valueLower) ||
                String(user.uniqueId)?.toLowerCase().includes(valueLower),
            )
          : dataArray;

        if (append) {
          setUniqueIdUsers((prev) => [...prev, ...filtered]);
          setFilteredUniqueIdUsers((prev) => [...prev, ...filtered]);
        } else {
          setUniqueIdUsers(filtered);
          setFilteredUniqueIdUsers(filtered);
        }

        setUniqueIdStart(startValue);
      })
      .catch((err) => {
        if (requestId !== uniqueIdRequestIdRef.current) return;
        console.error("Failed to fetch uniqueId users:", err);
      })
      .finally(() => {
        if (requestId !== uniqueIdRequestIdRef.current) return;
        setUniqueIdIsLoading(false);
      });
  };

  const handleUniqueIdScroll = () => {
    const el = uniqueIdListRef.current;
    if (!el) return;
    if (uniqueIdIsLoading || !uniqueIdHasMore) return;

    // Load next page when we're close to the bottom.
    const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 10;
    if (!nearBottom) return;

    fetchUniqueIdUsersPage(uniqueIdStart + 1, uniqueIdSearch, true);
  };

  // ── Populate on edit ──
  useEffect(() => {
    if (dialogData) {
      setMongoId(dialogData?._id);
      setName(dialogData?.name);
      setImagePath(dialogData?.image);
      setUniqueId(dialogData?.uniqueId);
      setUniqueIdSearch(dialogData?.uniqueId);
      setMobileNumber(dialogData?.mobile);
      setCode(dialogData?.agencyCode);
      setbankDetails(dialogData?.bankDetails);
      setBdId(dialogData?.bdId || dialogData?._id);
    }
  }, [dialogData]);

  $(document).ready(function () {
    $("img").bind("error", function () {
      $(this).attr("src", Male);
    });
  });

  // ── Reset on open/close ──
  useEffect(
    () => () => {
      setError({
        name: "",
        mobileNumber: "",
        password: "",
        code: "",
        image: "",
        uniqueId: "",
        bankDetails: "",
        bd: "",
      });
      setMongoId("");
      setName("");
      setUniqueId("");
      setUniqueIdSearch("");
      setBdSearch("");
      setBdId("");
      setCode("");
      setMobileNumber("");
      setImageData([]);
      setbankDetails("");
      setImagePath(null);
    },
    [open],
  );

  useEffect(() => {
    return () => {
      dispatch({ type: CLOSE_AGENCY_DIALOG });
    };
  }, [dispatch]);

  const handleInputImage = (e) => {
    if (e.target.files[0]) {
      setImageData(e.target.files[0]);
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImagePath(reader.result);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
    if (!e.target.files[0]) {
      return setError({ ...errors, image: "Please select an Image!" });
    } else {
      return setError({ ...errors, image: "" });
    }
  };

  const createCode = () => {
    const randomChars = "0123456789";
    let code_ = "";
    for (let i = 0; i < 5; i++) {
      code_ += randomChars.charAt(
        Math.floor(Math.random() * randomChars.length),
      );
    }
    setCode(code_);
    if (!code_) {
      return setError({ ...errors, code: "Code can't be a blank!" });
    } else {
      return setError({ ...errors, code: "" });
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") handleSubmit();
  };

  const handleSubmit = (e) => {
    if (!name || !code || !mobileNumber || !uniqueId || !bankDetails || !bdId) {
      const errors = {};
      if (!name) errors.name = "Name can't be a blank!";
      if (!uniqueId && uniqueIdSearch)
        errors.uniqueId = "Please select a valid UniqueId from the list!";
      else if (!uniqueId) errors.uniqueId = "UniqueId Is Required !";
      if (!mongoId && !bdId && bdSearch)
        errors.bd = "Please select a valid BD from the list!";
      else if (!mongoId && !bdId) errors.bd = "Please select a BD !";
      if (!mobileNumber) errors.mobileNumber = "MobileNumber is Required !";
      if (!code) errors.code = "Code can't be a blank!";
      if (!bankDetails) errors.bankDetails = "Bank Details can't be a blank!";
      return setError({ ...errors });
    }
    if (code?.length > 10) {
      return setError({ ...errors, code: "Maximum 6 Digits are Allowed!" });
    }
    if (code?.length < 5) {
      return setError({ ...errors, code: "Minimum 5 Digits are Allowed!" });
    }
    if (!mongoId) {
      const index = agency?.findIndex(
        (agency) => agency?.code?.toString() === code,
      );
      if (index > -1)
        return setError({ ...errors, code: "Code already exist." });

      const uniqueIdIndex = agency?.findIndex(
        (agency) => agency?.uniqueId?.toString() === uniqueId?.toString(),
      );
      if (uniqueIdIndex > -1)
        return setError({ ...errors, uniqueId: "UniqueId already exist." });
    } else {
      const index = agency?.find((agency) => agency?.code?.toString() === code);
      if (index !== undefined) {
        if (index?._id !== mongoId)
          return setError({ ...errors, code: "Code already exist." });
      }

      const uniqueIdIndex = agency?.find((agency) => agency?.uniqueId?.toString() === uniqueId?.toString());
      if (uniqueIdIndex !== undefined) {
        if (uniqueIdIndex?._id !== mongoId)
          return setError({ ...errors, uniqueId: "UniqueId already exist." });
      }
    }

    const formData = new FormData();
    formData.append("image", imageData);
    formData.append("name", name);
    formData.append("uniqueId", uniqueId);
    formData.append("agencyCode", code);
    formData.append("mobile", mobileNumber);
    formData.append("bankDetails", bankDetails);
    if (!mongoId && bdId) formData.append("bdId", bdId);

    if (mongoId) {
      if (
        name === dialogData?.name &&
        uniqueId === dialogData?.uniqueId &&
        code == dialogData?.agencyCode &&
        mobileNumber == dialogData?.mobile &&
        bankDetails === dialogData?.bankDetails &&
        (!imageData || imageData.length === 0)
      ) {
        Toast("info", "Nothing changed!");
        closePopup();
        return;
      }
      props.editAgency(formData, mongoId);
    } else {
      props.createNewAgency(formData);
    }
    closePopup();
  };

  const closePopup = () => {
    dispatch({ type: CLOSE_AGENCY_DIALOG });
  };

  // ── Reusable dropdown styles ──
  const dropdownListStyle = {
    listStyle: "none",
    margin: 0,
    padding: 0,
    border: "1px solid #ddd",
    maxHeight: "200px",
    overflowY: "auto",
    position: "absolute",
    width: "100%",
    background: "#fff",
    zIndex: 10,
  };

  const dropdownItemStyle = {
    padding: "8px",
    paddingLeft: "15px",
    cursor: "pointer",
    borderBottom: "1px solid #eee",
  };

  return (
    <>
      <Dialog
        open={open}
        aria-labelledby="responsive-dialog-title"
        onClose={closePopup}
        disableBackdropClick
        disableEscapeKeyDown
        fullWidth
        sx={{ maxWidth: "100%", margin: "0 auto" }}
      >
        <DialogTitle id="responsive-dialog-title">
          <span className="text-danger font-weight-bold h4"> Agency </span>
        </DialogTitle>

        <IconButton style={{ position: "absolute", right: 0 }}>
          <Tooltip title="Close">
            <Cancel className="text-danger" onClick={closePopup} />
          </Tooltip>
        </IconButton>

        <DialogContent>
          <div className="modal-body pt-1 px-1 pb-3">
            <div className="d-flex flex-column">
              <form>
                <div className="row">
                  {/* ── Select BD Dropdown ── */}
                  {!dialogData && (
                    <div className="col-12 mt-3">
                      <div className="form-group">
                        <label className="mb-2 text-gray">Select BD</label>
                        <div
                          style={{ position: "relative" }}
                          ref={bdDropdownRef}
                        >
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Search by BD"
                            value={bdSearch}
                            onChange={handleBdSearch}
                            onFocus={() => setShowBdDropdown(true)}
                          />
                          {showBdDropdown && (
                            <ul style={dropdownListStyle}>
                              {filteredBdUsers.map((user) => (
                                <li
                                  key={user._id}
                                  className="d-flex gap-3 align-items-center"
                                  style={dropdownItemStyle}
                                  onClick={() => selectBdUser(user)}
                                >
                                  <img
                                    alt="profile"
                                    height={25}
                                    width={25}
                                    src={user.image}
                                  />
                                  <div>
                                    {user.name} ({user.uniqueId})
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                        {errors.bd && (
                          <div className="ml-2 mt-1">
                            <div className="pl-1 text__left">
                              <span className="text-red">{errors.bd}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* ── Select User UniqueId Dropdown ── */}
                  {!dialogData && (
                    <div className="col-12 mt-3">
                      <div className="form-group">
                        <label className="mb-2 text-gray">
                          Select UniqueId
                        </label>
                        <div
                          style={{ position: "relative" }}
                          ref={uniqueIdDropdownRef}
                        >
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Search by unique ID"
                            value={uniqueIdSearch}
                            onChange={handleUniqueIdSearch}
                            onFocus={() => setShowUniqueIdDropdown(true)}
                          />
                          {showUniqueIdDropdown && (
                            <ul
                              style={dropdownListStyle}
                              ref={uniqueIdListRef}
                              onScroll={handleUniqueIdScroll}
                            >
                              {filteredUniqueIdUsers.map((user) => (
                                <li
                                  key={user._id}
                                  className="d-flex gap-3 align-items-center"
                                  style={dropdownItemStyle}
                                  onClick={() => selectUniqueIdUser(user)}
                                >
                                  <img
                                    alt="profile"
                                    height={25}
                                    width={25}
                                    src={user.image}
                                  />
                                  <div>
                                    {user.name} ({user.uniqueId})
                                  </div>
                                </li>
                              ))}
                              {uniqueIdIsLoading && (
                                <li
                                  style={{
                                    ...dropdownItemStyle,
                                    cursor: "default",
                                    background: "#fafafa",
                                  }}
                                >
                                  Loading...
                                </li>
                              )}
                              {!uniqueIdIsLoading &&
                                filteredUniqueIdUsers.length === 0 && (
                                  <li
                                    style={{
                                      ...dropdownItemStyle,
                                      cursor: "default",
                                      background: "#fafafa",
                                    }}
                                  >
                                    No results found
                                  </li>
                                )}
                              {!uniqueIdIsLoading &&
                                filteredUniqueIdUsers.length > 0 &&
                                !uniqueIdHasMore && (
                                  <li
                                    style={{
                                      ...dropdownItemStyle,
                                      cursor: "default",
                                      background: "#fafafa",
                                    }}
                                  >
                                    No more results
                                  </li>
                                )}
                            </ul>
                          )}
                        </div>
                        {errors.uniqueId && (
                          <div className="ml-2 mt-1">
                            <div className="pl-1 text__left">
                              <span className="text-red">
                                {errors.uniqueId}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* ── Name ── */}
                  <div className="form-group col-12 mt-3">
                    <label className="mb-2 text-gray">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Name"
                      required
                      value={name}
                      onKeyPress={handleKeyPress}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (!e.target.value) {
                          return setError({
                            ...errors,
                            name: "Name can't be a blank!",
                          });
                        } else {
                          return setError({ ...errors, name: "" });
                        }
                      }}
                    />
                    {errors.name && (
                      <div className="ml-2 mt-1">
                        <div className="pl-1 text__left">
                          <span className="text-red">{errors.name}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* ── Mobile Number ── */}
                <div className={`${mongoId ? "col-12" : "col-md-12"}`}>
                  <div className="form-group mt-2">
                    <label className="mb-2 text-gray">Mobile Number</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter Mobile Number"
                      required
                      value={mobileNumber}
                      onKeyPress={handleKeyPress}
                      onChange={(e) => {
                        setMobileNumber(e.target.value);
                        if (!e.target.value) {
                          return setError({
                            ...errors,
                            mobileNumber: "mobileNumber can't be a blank!",
                          });
                        } else {
                          return setError({ ...errors, mobileNumber: "" });
                        }
                      }}
                    />
                    {errors.mobileNumber && (
                      <div className="ml-2 mt-1">
                        <div className="pl-1 text__left">
                          <span className="text-red">
                            {errors.mobileNumber}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* ── Bank Details ── */}
                <div className="col-12 mt-2">
                  <div className="form-group">
                    <label className="mb-2 text-gray">Bank Details</label>
                    <textarea
                      className="form-control"
                      placeholder="Enter Bank Details"
                      required
                      rows={4}
                      value={bankDetails}
                      onKeyPress={handleKeyPress}
                      onChange={(e) => {
                        setbankDetails(e.target.value);
                        if (!e.target.value) {
                          return setError({
                            ...errors,
                            bankDetails: "bankDetails can't be a blank!",
                          });
                        } else {
                          return setError({ ...errors, bankDetails: "" });
                        }
                      }}
                    />
                    {errors.bankDetails && (
                      <div className="ml-2 mt-1">
                        <div className="pl-1 text__left">
                          <span className="text-red">{errors.bankDetails}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* ── Agency Code ── */}
                <div className="row d-flex mt-3">
                  <div className={`${mongoId ? "col-12" : "col-md-9"}`}>
                    <div className="form-group">
                      <label className="mb-2 text-gray">Agency Code</label>
                      <input
                        readOnly
                        type="number"
                        className="form-control"
                        placeholder="Enter Code"
                        required
                        value={code}
                        onKeyPress={handleKeyPress}
                        onChange={(e) => {
                          setCode(e.target.value);
                          if (!e.target.value) {
                            return setError({
                              ...errors,
                              code: "Code can't be a blank!",
                            });
                          } else {
                            return setError({ ...errors, code: "" });
                          }
                        }}
                      />
                      {errors.code && (
                        <div className="ml-2 mt-1">
                          <div className="pl-1 text__left">
                            <span className="text-red">{errors.code}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {!mongoId && (
                    <div
                      className="col-md-3 pl-0 d-flex justify-content-end align-items-center"
                      style={{ marginTop: "22.01px" }}
                    >
                      <button
                        type="button"
                        className="btn btn-round float__right btn-danger"
                        style={{
                          borderRadius: 5,
                          fontSize: "13px",
                          padding: "8px",
                          marginTop: "5px",
                        }}
                        onClick={createCode}
                      >
                        Auto Generate
                      </button>
                    </div>
                  )}
                </div>

                {/* ── Action Buttons ── */}
                <div className={imagePath ? "mt-3 pt-3" : "mt-5"}>
                  <button
                    type="button"
                    className="btn btn-outline-info ml-2 btn-round float__right icon_margin"
                    onClick={closePopup}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-round float__right btn-danger"
                    onClick={handleSubmit}
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default connect(null, { createNewAgency, editAgency })(AgencyDialogue);
