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
import { insertBd, updateBd } from "../../store/Bd/action";
import { CLOSE_BD_DIALOG } from "../../store/Bd/type";
import { apiInstanceFetch } from "../../util/api";
import InfoTooltip from "../../util/InfoTooltip";
import { Toast } from "../../util/Toast";

const BdDialogue = (props) => {
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);
  const isStaff = sessionStorage.getItem("loginType") === "staff";

  const { dialog: open, dialogData } = useSelector((state) => state.bd);

  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const [mongoId, setMongoId] = useState("");
  const [imageData, setImageData] = useState(null);
  const [name, setName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [uniqueId, setUniqueId] = useState(null);
  const [regions, setRegions] = useState([""]);

  const [regionSearch, setRegionSearch] = useState("");
  const [allRegions, setAllRegions] = useState([]);
  const [filteredRegions, setFilteredRegions] = useState([]);
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);
  const [bdCommission, setBdCommission] = useState(0);
  const regionDropdownRef = useRef(null);

  const [errors, setError] = useState({
    name: "",
    uniqueId: "",
    mobileNumber: "",
    regions: "",
    imageData: "",
    bdCommission: "",
  });

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        regionDropdownRef.current &&
        !regionDropdownRef.current.contains(e.target)
      ) {
        setShowRegionDropdown(false);
        setRegionSearch("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (dialogData) {
      setUniqueId(dialogData?.uniqueId);
      setMongoId(dialogData?._id);
      setName(dialogData?.name);
      setImageData(dialogData?.image);
      setMobileNumber(dialogData?.mobile);
      setRegions(dialogData?.regions?.length > 0 ? dialogData.regions : []);
      // Staff members can view the fixed default commission only. The actual
      // commission remains editable by admins.
      setBdCommission(isStaff ? 5 : (dialogData?.bdCommission ?? 0));
    }
  }, [dialogData]);

  useEffect(
    () => () => {
      setError({
        name: "",
        uniqueId: "",
        mobileNumber: "",
        regions: "",
        imageData: "",
      });
      setMongoId("");
      setName("");
      setUniqueId("");
      setMobileNumber("");
      setImageData(null);
      setBdCommission(isStaff ? 5 : 0);
    },
    [open],
  );

  useEffect(() => {
    return () => {
      dispatch({ type: CLOSE_BD_DIALOG });
    };
  }, [dispatch]);

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  const handleSubmit = (e) => {
    // Do not trust the client-side field value for staff submissions.
    const bdVal = isStaff ? 5 : Number(bdCommission);
    if (isNaN(bdVal) || bdVal < 0 || bdVal > 100) {
      return setError((prev) => ({
        ...prev,
        bdCommission: "BD Commission must be between 0 and 100!",
      }));
    }

    if (
      !name ||
      !mobileNumber ||
      (!mongoId && !uniqueId) ||
      !imageData ||
      !regions
    ) {
      const errors = {};
      if (!name) errors.name = "Name can't be a blank!";
      if (!mongoId && !uniqueId && search)
        errors.uniqueId = "Please select a valid UniqueId from the list!";
      else if (!mongoId && !uniqueId) errors.uniqueId = "UniqueId Is Required !";
      if (!mobileNumber) errors.mobileNumber = "Mobile Number Is Required !";
      if (!imageData) errors.imageData = "ImageData is Required !";
      if (regions.length === 0) errors.regions = "Regions is Required !";

      return setError({ ...errors });
    }

    const formData = new FormData();

    if (mongoId) {
      if (name !== dialogData?.name) {
        formData.append("name", name);
      }

      if (mobileNumber !== dialogData?.mobile) {
        formData.append("mobile", mobileNumber);
      }

      const originalRegionIds = dialogData?.regions
        ?.map((r) => r._id)
        .sort()
        .join(",");
      const currentRegionIds = regions
        .map((r) => (typeof r === "object" ? r._id : r))
        .sort()
        .join(",");

      if (originalRegionIds !== currentRegionIds) {
        if (regions.length === 0) {
          formData.append("regions", "");
        } else {
          regions.forEach((region, index) => {
            formData.append(
              `regions[${index}]`,
              typeof region === "object" ? region._id : region,
            );
          });
        }
      }

      if (imageData && typeof imageData !== "string") {
        formData.append("image", imageData);
      }
    } else {
      formData.append("name", name);
      formData.append("uniqueId", uniqueId);
      formData.append("mobile", mobileNumber);

      if (regions.length === 0) {
        formData.append("regions", "");
      } else {
        regions.forEach((region, index) => {
          formData.append(
            `regions[${index}]`,
            typeof region === "object" ? region._id : region,
          );
        });
      }
      formData.append("image", imageData);
    }

    if (mongoId) {
      // Staff cannot modify an existing BD's commission.
      if (!isStaff && bdVal !== dialogData?.bdCommission) {
        formData.append("bdCommission", bdVal);
      }
    } else {
      formData.append("bdCommission", bdVal);
    }

    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    if (mongoId) {
      const hasChanges = [...formData.entries()].length > 0;

      if (!hasChanges) {
        Toast("info", "Nothing changed!");
        closePopup();
        return;
      }

      props.updateBd(mongoId, formData);
    } else {
      props.insertBd(formData);
    }

    closePopup();
  };

  const closePopup = () => {
    dispatch({ type: CLOSE_BD_DIALOG });
  };

  useEffect(() => {
    if (!open) return;

    const debounceTimer = setTimeout(() => {
      apiInstanceFetch
        .get(`bd/getUsersDropdown?search=${encodeURIComponent(search)}`)
        .then((res) => {
          setUsers(res.data);
          setFilteredUsers(res.data);
        });
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [open, search]);

  useEffect(() => {
    if (!open) {
      setSearch("");
      setUniqueId("");
      setShowDropdown(false);
      setRegions([]);
      setRegionSearch("");
      setShowRegionDropdown(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    apiInstanceFetch.get("region/getActiveRegions?search=").then((res) => {
      console.log("region api response:", res);
      setAllRegions(res.data || []);
      setFilteredRegions(res.data || []);
    });
  }, [open]);

  const handleRegionSearch = (e) => {
    const value = e.target.value;
    setRegionSearch(value);

    const filtered = (allRegions || []).filter((region) =>
      region.name?.toLowerCase().includes(value.toLowerCase()),
    );

    setFilteredRegions(filtered);
    setShowRegionDropdown(true);
  };

  const selectRegion = (region) => {
    const alreadyAdded = regions.find(
      (r) => (typeof r === "object" ? r._id : r) === region._id,
    );
    if (alreadyAdded) return;

    setRegions([...regions, region]);
    setRegionSearch("");
    setShowRegionDropdown(false);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    setUniqueId("");
    setShowDropdown(true);
  };

  const selectUser = (user) => {
    setSearch(user.uniqueId);
    setUniqueId(user.uniqueId);
    setShowDropdown(false);
  };

  const removeRegion = (index) => {
    const updated = regions.filter((_, i) => i !== index);
    setRegions(updated);
  };

  const handleInputImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageData(file);
  };

  const handleRegionFocus = () => {
    setFilteredRegions(allRegions || []);
    setShowRegionDropdown(true);

    setTimeout(() => {
      regionDropdownRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 10);
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
          <span className="text-danger font-weight-bold h4"> Bd </span>
        </DialogTitle>

        <IconButton
          style={{
            position: "absolute",
            right: 4,
            top: 4,
          }}
        >
          <Tooltip title="Close">
            <Cancel className="text-danger" onClick={closePopup} />
          </Tooltip>
        </IconButton>
        <DialogContent>
          <div className="modal-body pt-1 px-1 pb-3">
            <div className="d-flex flex-column">
              <form>
                <div className="row">
                  <div className="col-12">
                    <div className="form-group">
                      {errors.bd && (
                        <div className="ml-2 mt-1">
                          {errors.bd && (
                            <div className="pl-1 text__left">
                              <span className="text-red">{errors.bd}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  {!dialogData && (
                    <div className="col-12 mt-3">
                      <div className="form-group">
                        <label className="mb-2 text-gray">
                          Unique Id of User
                        </label>

                        <div style={{ position: "relative" }} ref={dropdownRef}>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Search user"
                            value={search}
                            onChange={handleSearch}
                            onFocus={() => setShowDropdown(true)}
                          />

                          {showDropdown && (
                            <ul
                              style={{
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
                              }}
                            >
                              {filteredUsers.map((user) => (
                                <li
                                  key={user._id}
                                  className="d-flex gap-3 align-items-center"
                                  style={{
                                    padding: "8px",
                                    paddingLeft: "15px",
                                    cursor: "pointer",
                                    borderBottom: "1px solid #eee",
                                  }}
                                  onClick={() => selectUser(user)}
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

                        {errors.uniqueId && (
                          <div className="ml-2 mt-1">
                            {errors.uniqueId && (
                              <div className="pl-1 text__left">
                                <span className="text-red">
                                  {errors.uniqueId}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

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
                          return setError({
                            ...errors,
                            name: "",
                          });
                        }
                      }}
                    />
                    {errors.name && (
                      <div className="ml-2 mt-1">
                        {errors.name && (
                          <div className="pl-1 text__left">
                            <span className="text-red">{errors.name}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className={`${mongoId ? "col-12" : "col-md-12"}`}>
                  <div className="form-group mt-3">
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
                          return setError({
                            ...errors,
                            mobileNumber: "",
                          });
                        }
                      }}
                    />
                    {errors.mobileNumber && (
                      <div className="ml-2 mt-1">
                        {errors.mobileNumber && (
                          <div className="pl-1 text__left">
                            <span className="text-red">
                              {errors.mobileNumber}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* BD Commission Field */}
                <div className="col-12">
                  <div className="form-group mt-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <label className="mb-0 text-gray">
                        BD Commission (%)
                      </label>
                      <InfoTooltip
                        title="BD Commission Info"
                        content={[
                          {
                            label: "BD Commission (%)",
                            description:
                              "Percentage commission allocated to this BD. Must be between 0 and 100.",
                          },
                        ]}
                      />
                    </div>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter BD Commission (0 - 100)"
                      min="0"
                      max="100"
                      value={bdCommission}
                      disabled={isStaff}
                      onKeyPress={handleKeyPress}
                      onChange={(e) => {
                        setBdCommission(e.target.value);
                        setError((prev) => ({ ...prev, bdCommission: "" }));
                      }}
                    />
                    {errors.bdCommission && (
                      <div className="ml-2 mt-1">
                        <div className="pl-1 text__left">
                          <span className="text-red">
                            {errors.bdCommission}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-12 mt-3">
                  <div className="d-flex justify-content-between">
                    <label className="mb-2 text-gray d-flex align-items-center gap-2">
                      Regions
                    </label>

                    <InfoTooltip
                      title="Regions Dropdown Info"
                      content={[
                        {
                          label: "No Regions Visible?",
                          description:
                            "If no regions appear in the dropdown, it means no active regions have been created yet. Please navigate to the Regions page to create and activate regions — they will then be available for selection here.",
                        },
                        {
                          label: "Available Regions",
                          description:
                            "Only active regions configured on the Regions page are listed in this dropdown.",
                        },
                      ]}
                    />
                  </div>

                  {/* Selected regions as tags */}
                  <div className="d-flex flex-wrap gap-2 mb-2">
                    {regions.map((region, index) => (
                      <span
                        key={index}
                        className="badge bg-secondary d-flex align-items-center gap-1"
                        style={{ fontSize: "13px", padding: "6px 10px" }}
                      >
                        {typeof region === "object" ? region.name : region}
                        <span
                          style={{ cursor: "pointer", marginLeft: "6px" }}
                          onClick={() => removeRegion(index)}
                        >
                          ✕
                        </span>
                      </span>
                    ))}
                  </div>

                  {/* Search input with dropdown */}
                  <div style={{ position: "relative" }} ref={regionDropdownRef}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search and add region"
                      value={regionSearch}
                      onChange={handleRegionSearch}
                      onFocus={handleRegionFocus}
                    />

                    {showRegionDropdown && filteredRegions.length === 0 && (
                      <ul
                        style={{
                          listStyle: "none",
                          margin: 0,
                          padding: 0,
                          border: "1px solid #ddd",
                          position: "absolute",
                          width: "100%",
                          background: "#fff",
                          zIndex: 10,
                          top: "100%",
                          left: 0,
                          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                        }}
                      >
                        <li
                          style={{
                            padding: "10px 15px",
                            color: "#999",
                            textAlign: "center",
                          }}
                        >
                          No data found
                        </li>
                      </ul>
                    )}

                    {showRegionDropdown && filteredRegions.length > 0 && (
                      <ul
                        style={{
                          listStyle: "none",
                          margin: 0,
                          padding: 0,
                          border: "1px solid #ddd",
                          maxHeight: "200px",
                          overflowY: "auto",
                          overflowX: "hidden",
                          position: "absolute",
                          width: "100%",
                          background: "#fff",
                          zIndex: 10,
                          top: "100%",
                          left: 0,
                          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                        }}
                      >
                        {filteredRegions.map((region) => (
                          <li
                            key={region._id}
                            style={{
                              padding: "8px",
                              paddingLeft: "15px",
                              cursor: "pointer",
                              borderBottom: "1px solid #eee",
                              backgroundColor: regions.find(
                                (r) =>
                                  (typeof r === "object" ? r._id : r) ===
                                  region._id,
                              )
                                ? "#f0f0f0"
                                : "#fff",
                            }}
                            onClick={() => selectRegion(region)}
                          >
                            {region.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  
                  {errors.regions && (
                    <div className="ml-2 mt-1">
                      <span className="text-red">{errors.regions}</span>
                    </div>
                  )}

                  <div className="form-group mt-4">
                    <label className="mb-2 text-gray">Image</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/jpg ,image/jpeg ,image/png"
                      onChange={handleInputImage}
                    />

                    {errors.imageData && (
                      <div className="ml-2 mt-1">
                        {errors.imageData && (
                          <div className="pl-1 text__left">
                            <span className="text-red">{errors.imageData}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {imageData && (
                      <img
                        height="70px"
                        width="70px"
                        alt="app"
                        src={
                          typeof imageData === "string"
                            ? imageData
                            : URL.createObjectURL(imageData)
                        }
                        style={{
                          borderRadius: 10,
                          marginTop: 10,
                          float: "left",
                          objectFit: "cover",
                        }}
                      />
                    )}
                  </div>
                </div>
                <div className={imageData ? "mt-3 pt-3" : "mt-5"}>
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

export default connect(null, { insertBd, updateBd })(BdDialogue);
