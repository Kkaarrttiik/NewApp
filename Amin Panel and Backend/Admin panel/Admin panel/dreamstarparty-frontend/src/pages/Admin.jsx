import { useEffect, useState } from "react";

// js
import "../assets/js/main.min.js";

// router
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { apiInstanceFetch } from "../util/api";

// css
import "../assets/css/custom.css";
import "../assets/css/main.min.css";

// components
import FakeUserPage from "../component/dialog/FakeUserPage";
import GiftDialog from "../component/dialog/Gift/Add";
import SongDialog from "../component/dialog/Song";
import Navbar from "../component/navbar/Navbar";
import Topnav from "../component/navbar/Topnav";
import Page404 from "./Page404";
import AdmissionCar from "../component/table/AdmissionCar";
import Advertisement from "../component/table/Advertisement";
import Avatar from "../component/table/Avatar";
import Banner from "../component/table/Banner";
import CoinPlanTable from "../component/table/CoinPlan";
import CoinSellerHistory from "../component/table/CoinSellerHistory";
import FakeUser from "../component/table/FakeUser";
import GameTable from "../component/table/Game";
import GameHistory from "../component/table/GameHistory";
import GiftTable from "../component/table/Gift";
import GiftCategoryTable from "../component/table/GiftCategory";
import HashtagTable from "../component/table/Hashtag";
import HostRequest from "../component/table/hostRequest/HostRequest";
import LevelTable from "../component/table/Level";
import PostTable from "../component/table/Post";
import PurchaseCoinPlanHistoryTable from "../component/table/PurchaseCoinPlanHistory";
import PurchaseVIPPlanTable from "../component/table/PurchaseVipPlanHistory";
import Reaction from "../component/table/Reaction";
import ReportedUserTable from "../component/table/ReportedUser";
import SongTable from "../component/table/Song";
import StickerTable from "../component/table/Sticker";
import ThemeTable from "../component/table/Theme";
import UserTable from "../component/table/User";
import UserRedeemRequest from "../component/table/userRedeem/UserRedeemRequest";
import VideoTable from "../component/table/Video";
import VIPPlanTable from "../component/table/VIPPlan";
import CoinSeller from "./CoinSeller";
import Dashboard from "./Dashboard";
import PostDetail from "./PostDetail";
import Profile from "./Profile";
import Setting from "./Settings";
import UserDetail from "./UserDetail";
import UserHistory from "./UserHistory";
import VideoDetail from "./VideoDetail";

import FakeAudioUserPage from "../component/dialog/FakeAudioUserPage";
import FakePkUserPage from "../component/dialog/FakePkUserPage";
import FakePostPage from "../component/dialog/FakePostPage";
import FakeVideoPage from "../component/dialog/FakeVideoPage";
import AgencyRedeemRequest from "../component/table/agencyRedeem/AgencyRedeemRequest";
import Bd from "../component/table/Bd";
import BdAgency from "../component/table/BdAgency";
import BdWithdrawal from "../component/table/bdPaymentMethod";
import BdRedeemRequest from "../component/table/bdRedeem/BdRedeemRequest";
import BroadcastGame from "../component/table/BroadcastGame";
import BroadcastGift from "../component/table/BroadcastGift";
import ComplainRequest from "../component/table/complain/ComplainRequest";
import FakeComment from "../component/table/FakeComment";
import FakePost from "../component/table/FakePost";
import FakeVideo from "../component/table/FakeVideo";
import Host from "../component/table/Host";
import Language from "../component/table/Language";
import Region from "../component/table/Region";
import SuggestedMessage from "../component/table/SuggestedMessage";
import { PermissionProvider } from "../context/PermissionProvider";
import RequireModulePermission from "../util/RequireModulePermission";
import Agency from "./Agency";
import AgencyHistory from "./AgencyHistory";
import AgencyWiseHost from "./AgencyWiseHost";
import BdProfile from "./BdProfile";
import MainPlan from "./MainPlan";
import MainPost from "./MainPost";
import MainVideo from "./MainVideo";
import PlanHistory from "./PlanHistory";
import RoleTable from "./RoleTable";
import StaffTable from "./StaffTable";

import LanguageWarningDialog from "../component/dialog/LanguageWarningDialog";

const Admin = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openLangWarning, setOpenLangWarning] = useState(false);

  useEffect(() => {
    if (
      location.pathname === "/admin" ||
      location.pathname === "/admin/dashboard"
    ) {
      navigate("/admin/dashboard");
    }
  }, [location.pathname, navigate]);

  useEffect(() => {
    const token = sessionStorage.getItem("TOKEN");
    if (!token) return;

    if (sessionStorage.getItem("hasLanguage") === "true") return;

    if (location.pathname === "/admin/language") return;

    apiInstanceFetch
      .get("language/getAllLanguages?start=1&limit=1")
      .then((res) => {
        const count = res.total !== undefined ? res.total : (res.data ? res.data.length : 0);
        if (res && res.status) {
          if (count < 1) {
            setOpenLangWarning(true);
            navigate("/admin/language");
          } else {
            sessionStorage.setItem("hasLanguage", "true");
          }
        }
      })
      .catch((err) => {
        console.error("Error checking languages count:", err);
      });
  }, [location.pathname, navigate]);

  return (
    <PermissionProvider>
      <div className="page-container">
        <Navbar />
        <div className="page-content">
          <Topnav />
          <div className="main-wrapper">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route
                path="/banner"
                element={
                  <RequireModulePermission module="admin/banner">
                    <Banner />
                  </RequireModulePermission>
                }
              />
              <Route
                path="/region"
                element={
                  <RequireModulePermission module="admin/region">
                    <Region />
                  </RequireModulePermission>
                }
              />

              <Route
                path="/bd"
                element={
                  <RequireModulePermission module="admin/bd">
                    <Bd />
                  </RequireModulePermission>
                }
              />

              <Route
                path="/bd/profile"
                element={
                  <RequireModulePermission module="admin/bd">
                    <BdProfile />
                  </RequireModulePermission>
                }
              />

              <Route
                path="/bd/agency"
                element={
                  <RequireModulePermission module="admin/bd">
                    <BdAgency />
                  </RequireModulePermission>
                }
              />

              <Route
                path="/bdRedeem"
                element={
                  <RequireModulePermission module="admin/bdRedeem">
                    <BdRedeemRequest />
                  </RequireModulePermission>
                }
              />

              <Route
                path="/bdPaymentMethod"
                element={
                  <RequireModulePermission module="admin/bdPaymentMethod">
                    <BdWithdrawal />
                  </RequireModulePermission>
                }
              />

              <Route path="/adminProfile" element={<Profile />} />
              {/* Plan Module  */}
              <Route
                path="/mainPlan"
                element={
                  <RequireModulePermission module="admin/mainPlan">
                    <MainPlan />
                  </RequireModulePermission>
                }
              />
              <Route
                path="/coinplan"
                element={
                  <RequireModulePermission module="admin/mainPlan">
                    <CoinPlanTable />
                  </RequireModulePermission>
                }
              />
              <Route
                path="/vipplan"
                element={
                  <RequireModulePermission module="admin/mainPlan">
                    <VIPPlanTable />
                  </RequireModulePermission>
                }
              />

              {/* Plan History Module  */}
              <Route
                path="/planHistory"
                element={
                  <RequireModulePermission module="admin/planHistory">
                    <PlanHistory />
                  </RequireModulePermission>
                }
              />
              <Route
                path="/coinplan/history"
                element={
                  <RequireModulePermission module="admin/planHistory">
                    <PurchaseCoinPlanHistoryTable />
                  </RequireModulePermission>
                }
              />
              <Route
                path="/vipplan/history"
                element={
                  <RequireModulePermission module="admin/planHistory">
                    <PurchaseVIPPlanTable />
                  </RequireModulePermission>
                }
              />
              
              <Route
                path="/userRedeemRequest"
                element={
                  <RequireModulePermission module="admin/userRedeemRequest">
                    <UserRedeemRequest />
                  </RequireModulePermission>
                }
              />

              <Route
                path="/giftCategory"
                element={
                  <RequireModulePermission module="admin/giftCategory">
                    <GiftCategoryTable />
                  </RequireModulePermission>
                }
              />
              <Route
                path="/gameHistory"
                element={
                  <RequireModulePermission module="admin/gameHistory">
                    <GameHistory />
                  </RequireModulePermission>
                }
              />
              <Route
                path="/reaction"
                element={
                  <RequireModulePermission module="admin/reaction">
                    <Reaction />
                  </RequireModulePermission>
                }
              />
              {/* <Route
                path={`/comment`}
                element={
                  <RequireModulePermission module="admin/comment">
                    <FakeComment />
                  </RequireModulePermission>
                }
              /> */}

              <Route
                path="/agency"
                element={
                  <RequireModulePermission module="admin/agency">
                    <Agency />
                  </RequireModulePermission>
                }
              />
              <Route
                path="/agencyHistory"
                element={
                  <RequireModulePermission module="admin/agencyHistory">
                    <AgencyHistory />
                  </RequireModulePermission>
                }
              />
              <Route
                path="/agencyRedeemRequest"
                element={
                  <RequireModulePermission module="admin/agencyRedeemRequest">
                    <AgencyRedeemRequest />
                  </RequireModulePermission>
                }
              />
              <Route
                path="/agency/agencyWiseHost"
                element={
                  <RequireModulePermission module="admin/agency">
                    <AgencyWiseHost />
                  </RequireModulePermission>
                }
              />

              <Route
                path="/broadcastgift"
                element={
                  <RequireModulePermission module="admin/broadcastgift">
                    <BroadcastGift />
                  </RequireModulePermission>
                }
              />
              <Route
                path="/broadcastgame"
                element={
                  <RequireModulePermission module="admin/broadcastgame">
                    <BroadcastGame />
                  </RequireModulePermission>
                }
              />

              <Route
                path="/theme"
                element={
                  <RequireModulePermission module="admin/theme">
                    <ThemeTable />
                  </RequireModulePermission>
                }
              />
              <Route
                path="/fake/fakeUserdialog"
                element={
                  <RequireModulePermission module="admin/fakeUser">
                    <FakeUserPage />
                  </RequireModulePermission>
                }
              />
              <Route
                path="/fake/fakePkUserdialog"
                element={
                  <RequireModulePermission module="admin/fakeUser">
                    <FakePkUserPage />
                  </RequireModulePermission>
                }
              />
              <Route
                path="/fake/fakeAudioUserdialog"
                element={
                  <RequireModulePermission module="admin/fakeUser">
                    <FakeAudioUserPage />
                  </RequireModulePermission>
                }
              />

              <Route
                path="/gift"
                element={
                  <RequireModulePermission module="admin/gift">
                    <GiftTable />
                  </RequireModulePermission>
                }
              />
              <Route
                path="/gift/dialog"
                element={
                  <RequireModulePermission module="admin/gift">
                    <GiftDialog />
                  </RequireModulePermission>
                }
              />
              <Route
                path="/song"
                element={
                  <RequireModulePermission module="admin/song">
                    <SongTable />
                  </RequireModulePermission>
                }
              />
              <Route
                path="/song/dialog"
                element={
                  <RequireModulePermission module="admin/song">
                    <SongDialog />
                  </RequireModulePermission>
                }
              />
              <Route
                path="/hashtag"
                element={
                  <RequireModulePermission module="admin/hashtag">
                    <HashtagTable />
                  </RequireModulePermission>
                }
              />
              <Route
                path="/level"
                element={
                  <RequireModulePermission module="admin/level">
                    <LevelTable />
                  </RequireModulePermission>
                }
              />
              <Route
                path="/suggestMessage"
                element={
                  <RequireModulePermission module="admin/suggestMessage">
                    <SuggestedMessage />
                  </RequireModulePermission>
                }
              />
              <Route
                path="/user"
                element={
                  <RequireModulePermission module="admin/user">
                    <UserTable />
                  </RequireModulePermission>
                }
              />
              <Route
                path={`/fakeUser`}
                element={
                  <RequireModulePermission module="admin/fakeUser">
                    <FakeUser />
                  </RequireModulePermission>
                }
              />
              <Route
                path="/user/detail"
                element={
                  <RequireModulePermission module="admin/user">
                    <UserDetail />
                  </RequireModulePermission>
                }
              />
              <Route
                path="/user/history"
                element={
                  <RequireModulePermission module="admin/user">
                    <UserHistory />
                  </RequireModulePermission>
                }
              />

              {/* Post module  */}
              <Route
                path="/mainPost"
                element={
                  <RequireModulePermission module="admin/mainPost">
                    <MainPost />
                  </RequireModulePermission>
                }
              />
              <Route
                path="/post"
                element={
                  <RequireModulePermission module="admin/mainPost">
                    <PostTable />
                  </RequireModulePermission>
                }
              />
              <Route
                path="/post/fake"
                element={
                  <RequireModulePermission module="admin/mainPost">
                    <FakePost />
                  </RequireModulePermission>
                }
              />
              <Route
                path="/post/detail"
                element={
                  <RequireModulePermission module="admin/mainPost">
                    <PostDetail />
                  </RequireModulePermission>
                }
              />
              <Route
                path="/post/dialog"
                element={
                  <RequireModulePermission module="admin/mainPost">
                    <FakePostPage />
                  </RequireModulePermission>
                }
              />

              {/* Video Module  */}
              <Route
                path="/mainVideo"
                element={
                  <RequireModulePermission module="admin/mainVideo">
                    <MainVideo />
                  </RequireModulePermission>
                }
              />
              <Route
                path="/video"
                element={
                  <RequireModulePermission module="admin/mainVideo">
                    <VideoTable />
                  </RequireModulePermission>
                }
              />
              <Route
                path="/video/fake"
                element={
                  <RequireModulePermission module="admin/mainVideo">
                    <FakeVideo />
                  </RequireModulePermission>
                }
              />
              <Route
                path="/video/detail"
                element={
                  <RequireModulePermission module="admin/mainVideo">
                    <VideoDetail />
                  </RequireModulePermission>
                }
              />
              <Route
                path="/video/dialog"
                element={
                  <RequireModulePermission module="admin/mainVideo">
                    <FakeVideoPage />
                  </RequireModulePermission>
                }
              />

              <Route
                path="/setting"
                element={
                  <RequireModulePermission module="admin/Setting">
                    <Setting />
                  </RequireModulePermission>
                }
              />
              <Route
                path="/reportedUser"
                element={
                  <RequireModulePermission module="admin/reportedUser">
                    <ReportedUserTable />
                  </RequireModulePermission>
                }
              />
              <Route
                path="/advertisement"
                element={
                  <RequireModulePermission module="admin/advertisement">
                    <Advertisement />
                  </RequireModulePermission>
                }
              />
              <Route
                path="/language"
                element={
                  <RequireModulePermission module="admin/language">
                    <Language />
                  </RequireModulePermission>
                }
              />
              <Route
                path="/coinSeller"
                element={
                  <RequireModulePermission module="admin/coinSeller">
                    <CoinSeller />
                  </RequireModulePermission>
                }
              />
              <Route
                path="/coinSeller/history"
                element={
                  <RequireModulePermission module="admin/coinSeller">
                    <CoinSellerHistory />
                  </RequireModulePermission>
                }
              />
              <Route
                path="/hostRequest"
                element={
                  <RequireModulePermission module="admin/hostRequest">
                    <HostRequest />
                  </RequireModulePermission>
                }
              />
              <Route
                path="/host"
                element={
                  <RequireModulePermission module="admin/host">
                    <Host />
                  </RequireModulePermission>
                }
              />
              <Route
                path="/sticker"
                element={
                  <RequireModulePermission module="admin/sticker">
                    <StickerTable />
                  </RequireModulePermission>
                }
              />
              <Route
                path="/avatarFrame"
                element={
                  <RequireModulePermission module="admin/avatarFrame">
                    <Avatar />
                  </RequireModulePermission>
                }
              />
              <Route
                path="/entryEffect"
                element={
                  <RequireModulePermission module="admin/entryEffect">
                    <AdmissionCar />
                  </RequireModulePermission>
                }
              />
              <Route
                path="/game"
                element={
                  <RequireModulePermission module="admin/game">
                    <GameTable />
                  </RequireModulePermission>
                }
              />
              <Route
                path="/complainRequest"
                element={
                  <RequireModulePermission module="admin/complainRequest">
                    <ComplainRequest />
                  </RequireModulePermission>
                }
              />
              <Route path="*" element={<Page404 />} />
              <Route
                path="/role"
                element={
                  <RequireModulePermission module="admin/role">
                    <RoleTable />
                  </RequireModulePermission>
                }
              />
              <Route
                path="/staff"
                element={
                  <RequireModulePermission module="admin/staff">
                    <StaffTable />
                  </RequireModulePermission>
                }
              />
            </Routes>
          </div>
        </div>
      </div>
      <LanguageWarningDialog 
        open={openLangWarning} 
        onClose={() => setOpenLangWarning(false)} 
      />
    </PermissionProvider>
  );
};

export default Admin;
