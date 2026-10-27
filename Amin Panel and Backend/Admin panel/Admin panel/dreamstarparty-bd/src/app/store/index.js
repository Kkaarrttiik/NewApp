import { configureStore } from "@reduxjs/toolkit";
import bdReducer from "./bdSlice";
import dashboardReducer from "./dashboardSlice";
import agenciesReducer from "./agenciesSlice";
import agencyDetailReducer from "./agencyDetailSlice";
import hostsReducer from "./hostsSlice";
import commissionReducer from "./commissionSlice";
import withdrawReducer from "./withdrawSlice";
import transactionReducer from "./transactionSlice";
import profileReducer from "./profileSlice";
import languageReducer from "./languageSlice";

export const store = configureStore({
  reducer: {
    bd: bdReducer,
    dashboard: dashboardReducer,
    agencies: agenciesReducer,
    agencyDetail: agencyDetailReducer,
    hosts: hostsReducer,
    commission: commissionReducer,
    withdraw: withdrawReducer,
    transactions: transactionReducer,
    profile: profileReducer,
    language: languageReducer,
  },
});
