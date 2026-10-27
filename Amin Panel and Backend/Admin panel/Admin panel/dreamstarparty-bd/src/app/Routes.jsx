import { createBrowserRouter } from "react-router";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import MyAgencies from "./pages/MyAgencies.jsx";
import AgencyDetail from "./pages/AgencyDetail.jsx";
import HostsUnderAgencies from "./pages/HostsUnderAgencies.jsx";
import CommissionOverview from "./pages/CommissionOverview.jsx";
import WithdrawRequest from "./pages/WithdrawRequest.jsx";
import BdIdGuard from "./components/BdIdGuard.jsx";
import Transactions from "./pages/Transactions.jsx";
import Profile from "./pages/Profile.jsx";

export const Routes = createBrowserRouter([
  {
    path: "/",
    element: (
      <BdIdGuard>
        <DashboardLayout />
      </BdIdGuard>
    ),
    children: [
      { index: true, Component: Dashboard },
      { path: "agencies", Component: MyAgencies },
      { path: "agencies/:id", Component: AgencyDetail },
      { path: "hosts", Component: HostsUnderAgencies },
      { path: "commission", Component: CommissionOverview },
      { path: "withdraw", Component: WithdrawRequest },
      { path: "transactions", Component: Transactions },
      { path: "profile", Component: Profile },
    ],
  },
]);
