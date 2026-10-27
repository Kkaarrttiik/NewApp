import { combineReducers } from "redux";

import adminReducer from "./admin/reducer";
import { admissionSVGAReducer } from "./AdmissionCar/reducer";
import advertisementReducer from "./advertisement/reducer";
import agencyReducer from "./agency/reducer";
import agencyRedeemReducer from "./agenyRedeem/reducer";
import { avatarFrameReducer } from "./AvatarFrame/reducer";
import bannerReducer from "./banner/reducer";
import bdReducer from "./Bd/reducer";
import bdPaymentMethodReducer from "./bdPaymentMethod/reducer";
import bdRedeemReducer from "./bdRedeem/reducer";
import broadcastGameReducer from "./BroadcastGame/reducer";
import broadcastGiftReducer from "./BroadcastGift/reducer";
import coinPlanReducer from "./coinPlan/reducer";
import { coinSellerReducer } from "./coinSeller/reducer";
import commissionReducer from "./commision/reducer";
import complainReducer from "./complain/reducer";
import currencyReducer from "./currency/reducer";
import dashboardReducer from "./dashboard/reducer";
import fakeCommentReducer from "./fakeComment/reducer";
import fakeUserReducer from "./FakeUser/Reducer";
import followerReducer from "./follower/reducer";
import gameReducer from "./game/reducer";
import { gameHistoryReducer } from "./GameHistory/reducer";
import giftReducer from "./gift/reducer";
import giftCategoryReducer from "./giftCategory/reducer";
import hashtagReducer from "./hashtag/reducer";
import hostReducer from "./host/reducer";
import hostCommissionReducer from "./hostCommision/reducer";
import hostRequestReducer from "./hostRequest/reducer";
import languageReducer from "./Language/reducer";
import levelReducer from "./level/reducer";
import notificationReducer from "./notification/reducer";
import postReducer from "./post/reducer";
import reactionReducer from "./reaction/reducer";
import redeemReducer from "./redeem/reducer";
import redeemOptReducer from "./redeemOptions/reducer";
import regionReducer from "./region/reducer";
import reportedUserReducer from "./reportedUser/reducer";
import roleReducer from "./role/reducer";
import settingReducer from "./setting/reducer";
import songReducer from "./song/reducer";
import spinnerReducer from "./spinner/reducer";
import staffReducer from "./staff/reducer";
import stickerReducer from "./sticker/reducer";
import suggestMsgReducer from "./suggestMessage/reducer";
import themeReducer from "./Theme/theme.reducer";
import userReducer from "./user/reducer";
import videoReducer from "./video/reducer";
import vipPlanReducer from "./vipPlan/reducer";

export default combineReducers({
  admin: adminReducer,
  user: userReducer,
  post: postReducer,
  song: songReducer,
  gift: giftReducer,
  host: hostReducer,
  banner: bannerReducer,
  game: gameReducer,
  video: videoReducer,
  level: levelReducer,
  suggestMessage: suggestMsgReducer,
  role: roleReducer,
  staff: staffReducer,
  redeemOption: redeemOptReducer,
  sticker: stickerReducer,
  reaction: reactionReducer,
  complain: complainReducer,
  gameHistory: gameHistoryReducer,
  redeem: redeemReducer,
  report: reportedUserReducer,
  dashboard: dashboardReducer,
  hostRequest: hostRequestReducer,
  hashtag: hashtagReducer,
  followersFollowing: followerReducer,
  giftCategory: giftCategoryReducer,
  vipPlan: vipPlanReducer,
  coinPlan: coinPlanReducer,
  setting: settingReducer,
  advertisement: advertisementReducer,
  spinner: spinnerReducer,
  fakeUser: fakeUserReducer,
  Comment: fakeCommentReducer,
  theme: themeReducer,
  admissionSVGA: admissionSVGAReducer,
  avatarFrame: avatarFrameReducer,
  agency: agencyReducer,
  commision: commissionReducer,
  hostCommision: hostCommissionReducer,
  coinSeller: coinSellerReducer,
  agencyRedeem: agencyRedeemReducer,
  notification: notificationReducer,
  currency: currencyReducer,
  broadcastgift: broadcastGiftReducer,
  broadcastgame: broadcastGameReducer,
  region: regionReducer,
  bd: bdReducer,
  bdRedeem: bdRedeemReducer,
  bdPaymentMethod: bdPaymentMethodReducer,
  language: languageReducer
});
