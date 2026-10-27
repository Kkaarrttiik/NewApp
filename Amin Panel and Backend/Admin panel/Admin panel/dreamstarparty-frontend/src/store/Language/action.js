import axios from "axios";
import { alert } from "../../util/Alert";
import { apiInstanceFetch } from "../../util/api";
import { Toast } from "../../util/Toast";
import {
  CREATE_LANGUAGE,
  DELETE_LANGUAGE,
  GET_LANGUAGE,
  GET_SINGLE_LANGUAGE,
  GET_TRANSLATION,
  TOGGLE_LANGUAGE,
  UPDATE_LANGUAGE,
  UPDATE_TRANSLATION,
  UPLOAD_TRANSLATION,
} from "./types";

// 1. GET ALL
export const getLanguage =
  ({ start, limit, search = "" }) =>
  (dispatch) => {
    const query = `language/getAllLanguages?start=${start}&limit=${limit}${search ? `&search=${encodeURIComponent(search)}` : ""}`;
    apiInstanceFetch
      .get(query)
      .then((res) => {
        if (res.status) {
          dispatch({
            type: GET_LANGUAGE,
            payload: { languages: res.data, total: res.total },
          });
        }
      })
      .catch((err) => console.log("GET LANGUAGE ERROR:", err));
  };

// 2. GET SINGLE
export const getSingleLanguage = (languageCode) => (dispatch) => {
  apiInstanceFetch
    .get(`language/getLanguage?languageCode=${languageCode}`)
    .then((res) => {
      if (res.status) {
        dispatch({
          type: GET_SINGLE_LANGUAGE,
          payload: res.data,
        });
      }
    })
    .catch((err) => {
      console.log("GET SINGLE LANGUAGE ERROR:", err);
      Toast("error", "Error fetching language details");
    });
};

// 3. CREATE
export const createLanguage = (formData) => (dispatch) => {
  axios
    .post(`language/createLanguage`, formData)
    .then((res) => {
      if (res.data.status) {
        Toast("success", "Language created successfully!");
        dispatch({ type: CREATE_LANGUAGE, payload: res.data.data });
      } else {
        Toast("error", res.data.message || "Failed to create language");
      }
    })
    .catch((err) => {
      console.log("CREATE LANGUAGE ERROR:", err?.response?.data || err);
      Toast("error", err?.response?.data?.message || "Something went wrong!");
    });
};

// 4. UPDATE
export const updateLanguage = (id, formData) => (dispatch) => {
  axios
    .patch(`language/updateLanguage?languageId=${id}`, formData)
    .then((res) => {
      if (res.data.status) {
        Toast("success", "Language updated successfully!");
        dispatch({
          type: UPDATE_LANGUAGE,
          payload: { id, data: res.data.data },
        });
      } else {
        Toast("error", res.data.message || "Failed to update language");
      }
    })
    .catch((err) => {
      console.log("UPDATE LANGUAGE ERROR:", err?.response?.data || err);
      Toast("error", err?.response?.data?.message || "Something went wrong!");
    });
};

// 5. DELETE
export const deleteLanguage = (code) => (dispatch) => {
  apiInstanceFetch
    .delete(`language/deleteLanguage?languageCode=${code}`)
    .then((res) => {
      if (res.status) {
        Toast("success", "Language deleted successfully!");
        dispatch({ type: DELETE_LANGUAGE, payload: code });
        alert("Deleted!", "Language has been deleted!", "success");
      } else {
        Toast("error", res.message || "Failed to delete language");
      }
    })
    .catch((err) => {
      console.log("DELETE LANGUAGE ERROR:", err);
      Toast("error", "Something went wrong!");
    });
};

// 6. TOGGLE
export const toggleLanguage = (languageCode, toggleType) => (dispatch) => {
  axios
    .patch(
      `language/toggleSwitch?languageCode=${languageCode}&toggleType=${toggleType}`,
      {},
    )
    .then((res) => {
      if (res.data.status) {
        Toast("success", "Status changed successfully!");
        dispatch({
          type: TOGGLE_LANGUAGE,
          payload: { languageCode, toggleType, data: res.data },
        });
      } else {
        Toast("error", res.data.message || "Failed to change status");
      }
    })
    .catch((err) => {
      console.log("TOGGLE LANGUAGE ERROR:", err?.response?.data || err);
      Toast("error", err?.response?.data?.message || "Something went wrong!");
    });
};

// 7. GET TRANSLATION
export const getTranslation =
  (languageCode, module, search = "") =>
  (dispatch) => {
    const query = `translation/getSingleLanguage?languageCode=${languageCode}&module=${module}${search ? `&search=${encodeURIComponent(search)}` : ""}`;
    apiInstanceFetch
      .get(query)
      .then((res) => {
        if (res.status) {
          dispatch({
            type: GET_TRANSLATION,
            payload: res.doc || res.data?.doc || res.data,
          });
        }
      })
      .catch((err) => {
        console.log("GET TRANSLATION ERROR:", err);
        Toast("error", "Failed to fetch translations");
      });
  };

// 8. UPDATE TRANSLATION
export const updateTranslation = (data) => (dispatch) => {
  axios
    .patch(`translation/updateLanguageTranslations`, data)
    .then((res) => {
      if (res.data.status) {
        Toast("success", "Translations updated successfully");
        dispatch({ type: UPDATE_TRANSLATION, payload: data });
      } else {
        Toast("error", res.data.message || "Failed to update translations");
      }
    })
    .catch((err) => {
      console.log("UPDATE TRANSLATION ERROR:", err?.response?.data || err);
      Toast("error", "Something went wrong!");
    });
};

// 9. UPLOAD CSV
export const uploadTranslation = (formData) => (dispatch) => {
  axios
    .post(`translation/uploadTranslations`, formData)
    .then((res) => {
      if (res.data.status) {
        Toast("success", res.data.message || "File uploaded successfully!");
        dispatch({ type: UPLOAD_TRANSLATION });
      } else {
        Toast("error", res.data.message || "Upload failed");
      }
    })
    .catch((err) => {
      console.log("UPLOAD TRANSLATION ERROR:", err?.response?.data || err);
      Toast("error", err?.response?.data?.message || "Something went wrong!");
    });
};

// 10. DOWNLOAD CSV
export const downloadTranslation = () => () => {
  axios({
    url: `translation/downloadTranslationsCSV`,
    method: "GET",
    responseType: "blob",
  })
    .then((res) => {
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "translations.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    })
    .catch((err) => {
      console.log("DOWNLOAD TRANSLATION ERROR:", err);
      Toast("error", "Failed to download CSV");
    });
};
