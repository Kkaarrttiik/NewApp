import { useEffect, useRef, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

//Multi Select Dropdown
import { CheckCircle, ContentCopy } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { Multiselect } from "multiselect-react-dropdown";

// action
import {
  getSetting,
  handleSwitch,
  updateSetting,
} from "../store/setting/action";

import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import LicenseDialog from "../component/dialog/LicenseDialog";
import Currency from "../component/table/Currency";
import RedeemOptions from "../component/table/RedeemOptions";
import { usePermission } from "../context/PermissionProvider";
import { getRedeemOptionsDropdown } from "../store/redeemOptions/action";
import { projectName } from "../util/Config";
import InfoTooltip from "../util/InfoTooltip";
import { apiInstanceFetch } from "../util/api";

function validateAndroidAssetLinks(value) {
  const trimmed = (value || "").trim();
  if (!trimmed) return null;
  try {
    const parsed = JSON.parse(trimmed);
    if (!Array.isArray(parsed)) return "Must be a JSON array";
    for (let i = 0; i < parsed.length; i++) {
      const item = parsed[i];
      if (!item || typeof item !== "object")
        return `Item ${i + 1}: must be an object`;
      if (
        !Array.isArray(item.relation) ||
        !item.relation.every((r) => typeof r === "string")
      )
        return `Item ${i + 1}: "relation" must be an array of strings`;
      if (!item.target || typeof item.target !== "object")
        return `Item ${i + 1}: "target" is required`;
      if (item.target.namespace !== "android_app")
        return `Item ${i + 1}: target.namespace must be "android_app"`;
      if (typeof item.target.package_name !== "string")
        return `Item ${i + 1}: target.package_name must be a string`;
      if (
        !Array.isArray(item.target.sha256_cert_fingerprints) ||
        !item.target.sha256_cert_fingerprints.every(
          (f) => typeof f === "string",
        )
      )
        return `Item ${i + 1}: target.sha256_cert_fingerprints must be an array of strings`;
    }
    return null;
  } catch (e) {
    return "Must be valid JSON";
  }
}

const Setting = (props) => {
  const dispatch = useDispatch();
  const setting = useSelector((state) => state.setting.setting);
  const { can } = usePermission();
  const canEdit = can("admin/Setting", "Edit");

  const [type, setType] = useState(() => {
    return localStorage.getItem("settingTab") || "generalSetting";
  });
  const [mongoId, setMongoId] = useState("");
  const { redeemOptDropdown } = useSelector((state) => state.redeemOption);

  const [redeemOptData, setRedeemOptData] = useState([]);

  const [referralBonus, setReferralBonus] = useState(0);
  const [referralBonusCoin, setReferralBonusCoin] = useState(0);
  const [loginBonus, setLoginBonus] = useState(0);
  const [agoraKey, setAgoraKey] = useState("");
  const [agoraCertificate, setAgoraCertificate] = useState("");
  const [agencyCommission, setAgencyCommission] = useState("");
  const [maxSecondForVideo, setMaxSecondForVideo] = useState(0);
  const [privacyPolicyLink, setPrivacyPolicyLink] = useState("");
  const [privacyPolicyText, setPrivacyPolicyText] = useState("");
  const [femaleCallCharge, setFemaleCallCharge] = useState(0);
  const [maleCallCharge, setMaleCallCharge] = useState(0);
  const [audioCallChargeFemale, setaudioCallChargeFemale] = useState(0);
  const [audioCallChargeMale, setaudioCallChargeMale] = useState(0);

  const [currency, setCurrency] = useState("$");
  const [rCoinForCaseOut, setRCoinForCaseOut] = useState(0);
  const [rCoinForDiamond, setRCoinForDiamond] = useState(0);
  const [bdCommission, setBdCommission] = useState(0);
  const [minRcoinForCashOutAgency, setMinRCoinForCaseOutAgency] = useState(0);
  const [minRcoinForCashOutBd, setMinRcoinForCashOutBd] = useState(0);
  const [tooltipText, setTooltipText] = useState("https://abc.com");
  const [icon, setIcon] = useState(<ContentCopy fontSize="small" />);

  const [isFake, setIsFake] = useState(false);

  const [isAppActive, setIsAppActive] = useState(false);
  const [vipDiamond, setVipDiamond] = useState(0);
  const [locationApiKey, setLocationApiKey] = useState("");
  const [callReceiverPercent, setCallReceiverPercent] = useState("");
  const [minRCoinForCaseOut, setMinRCoinForCaseOut] = useState(0);
  const [paymentGateway, setPaymentGateway] = useState([]);
  const [selectedValue, setSelectedValue] = useState([]);
  const [gameCoin1, setGameCoin1] = useState(0);
  const [gameCoin2, setGameCoin2] = useState(0);
  const [gameCoin3, setGameCoin3] = useState(0);
  const [gameCoin4, setGameCoin4] = useState(0);
  const [gameCoin5, setGameCoin5] = useState(0);
  const [pkEndTime, setPkEndTime] = useState(300);
  const [privateKey, setPrivateKey] = useState();
  const [resendApiKey, setResendApiKey] = useState("");

  const [giftAnnouncementCoin, setGiftAnnouncementCoin] = useState(0);
  const [gameAnnouncementCoin, setGameAnnouncementCoin] = useState(0);
  const [aboutLink, setAboutLink] = useState("");
  const [termsLink, setTermsLink] = useState("");

  const [initialSetting, setInitialSetting] = useState(null);

  const [androidAppVersion, setAndroidAppVersion] = useState("");
  const [androidAppLink, setAndroidAppLink] = useState("");
  const [androidAssetLinks, setAndroidAssetLinks] = useState("");
  const [stripeSwitch, setStripeSwitch] = useState(false);
  const [stripePublishableKey, setStripePublishableKey] = useState("");
  const [stripeSecretKey, setStripeSecretKey] = useState("");

  const [googlePlaySwitch, setGooglePlaySwitch] = useState(false);

  const [paystackAndroidEnabled, setPaystackSwitch] = useState(false);
  const [paystackPublicKey, setPaystackPublicKey] = useState("");
  const [paystackSecretKey, setPaystackSecretKey] = useState("");

  const [cashfreeAndroidEnabled, setCashfreeSwitch] = useState(false);
  const [cashfreeClientId, setCashfreeClientId] = useState("");
  const [cashfreeClientSecret, setCashfreeClientSecret] = useState("");

  const [paypalAndroidEnabled, setPaypalSwitch] = useState(false);
  const [paypalClientId, setPaypalClientId] = useState("");
  const [paypalSecretKey, setPaypalClientSecret] = useState("");

  const [razorPayAndroidEnabled, setRazorpaySwitch] = useState(false);
  const [razorPayId, setRazorpayId] = useState("");
  const [razorSecretKey, setRazorpaySecret] = useState("");

  const [isFlutterwaveEnabled, setIsFlutterwaveEnabled] = useState(false);
  const [flutterWaveId, setFlutterWaveId] = useState("");

  const [isPurchaseCodeValid, setIsPurchaseCodeValid] = useState(false);
  const [purchaseCodeChecked, setPurchaseCodeChecked] = useState(false);
  const [showLicenseDialog, setShowLicenseDialog] = useState(false);

  const tabsRef = useRef(null);
  const [isSticky, setIsSticky] = useState(false);
  const [tabsOffsetTop, setTabsOffsetTop] = useState(0);

  const [errors, setError] = useState({
    flutterWaveId: "",
    paystackPublicKey: "",
    paystackSecretKey: "",
    cashfreeClientId: "",
    cashfreeClientSecret: "",
    razorPayId: "",
    razorSecretKey: "",
    paypalSecretKey: "",
    paypalClientId: "",
    referralBonus: "",
    referralBonusCoin: "",
    loginBonus: "",
    maxSecondForVideo: "",
    callCharge: "",
    rCoinForCaseOut: "",
    rCoinForDiamond: "",
    bdCommission: "",
    minRCoinForCaseOut: "",
    maleCallCharge: "",
    femaleCallCharge: "",
    vipDiamond: "",
    privateKey: "",
    agencyCommission: "",
    minRcoinForCashOutAgency: "",
    minRcoinForCashOutBd: "",
    locationApiKey: "",
    callReceiverPercent: "",
    audioCallChargeFemale: "",
    audioCallChargeMale: "",
    resendApiKey: "",
    aboutLink: "",
    termsLink: "",
    gameAnnouncementCoin: "",
    giftAnnouncementCoin: "",
    privacyPolicyLink: "",
    privacyPolicyText: "",
    androidAppVersion: "",
    androidAppLink: "",
    androidAssetLinks: "",
    stripePublishableKey: "",
    stripeSecretKey: "",
  });

  useEffect(() => {
    if (tabsRef.current) {
      setTabsOffsetTop(tabsRef.current.offsetTop);
    }

    const handleScroll = () => {
      if (tabsRef.current) {
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [tabsOffsetTop]);

  useEffect(() => {
    dispatch(getSetting());
    dispatch(getRedeemOptionsDropdown());
  }, [dispatch]);

  useEffect(() => {
    if (redeemOptDropdown) {
      setRedeemOptData(redeemOptDropdown);
    }
  }, [redeemOptDropdown]);

  useEffect(() => {
    setError({
      flutterWaveId: "",
      paystackPublicKey: "",
      paystackSecretKey: "",
      cashfreeClientId: "",
      paypalSecretKey: "",
      razorPayId: "",
      razorSecretKey: "",
      paypalClientSecret: "",
      paypalClientId: "",
      referralBonus: "",
      referralBonusCoin: "",
      loginBonus: "",
      maxSecondForVideo: "",
      callCharge: "",
      rCoinForCaseOut: "",
      rCoinForDiamond: "",
      bdCommission: "",
      minRCoinForCaseOut: "",
      pkEndTime: "",
      femaleCallCharge: "",
      maleCallCharge: "",
      vipDiamond: "",
      privateKey: "",
      agencyCommission: "",
      minRcoinForCashOutAgency: "",
      minRcoinForCashOutBd: "",
      locationApiKey: "",
      callReceiverPercent: "",
      audioCallChargeFemale: "",
      audioCallChargeMale: "",
      resendApiKey: "",
      gameAnnouncementCoin: "",
      giftAnnouncementCoin: "",
      aboutLink: "",
      termsLink: "",
      privacyPolicyLink: "",
      privacyPolicyText: "",
      androidAppVersion: "",
      androidAppLink: "",
      androidAssetLinks: "",
      stripePublishableKey: "",
      stripeSecretKey: "",
    });
    if (setting) {
      console.log("SETTING FULL:", setting);
      const data = setting?.paymentGateway?.map((data) => {
        return {
          name: data,
        };
      });
      if (setting?.gameCoin?.length > 0) {
        setGameCoin1(setting?.gameCoin[0]);
        setGameCoin2(setting?.gameCoin[1]);
        setGameCoin3(setting?.gameCoin[2]);
        setGameCoin4(setting?.gameCoin[3]);
        setGameCoin5(setting?.gameCoin[4]);
      }
      setIsFake(setting?.isFake);
      setMongoId(setting._id);
      setVipDiamond(setting?.vipDiamond);
      setReferralBonus(setting?.referralBonus);
      setReferralBonusCoin(setting?.referralCoinBonus);
      setAgoraKey(setting.agoraKey);
      setAgoraCertificate(setting.agoraCertificate);
      setMaxSecondForVideo(setting.maxSecondForVideo);
      setPrivacyPolicyLink(setting.privacyPolicyLink);
      setPrivacyPolicyText(setting.privacyPolicyText);
      setMaleCallCharge(setting?.maleCallCharge);
      setFemaleCallCharge(setting?.femaleCallCharge);
      setaudioCallChargeFemale(setting?.audioCallChargeFemale);
      setaudioCallChargeMale(setting?.audioCallChargeMale);
      // setGooglePlayEmail(setting.googlePlayEmail);
      // setGooglePlayKey(setting.googlePlayKey);
      setStripePublishableKey(setting.stripePublishableKey);
      setStripeSecretKey(setting.stripeSecretKey);
      setCurrency(setting.currency);
      setRCoinForCaseOut(setting.rCoinForCashOut);
      setAgencyCommission(setting?.agencyCommission);
      setRCoinForDiamond(setting.rCoinForDiamond);
      setBdCommission(setting.bdCommission);
      setGooglePlaySwitch(setting.googlePlaySwitch);
      setStripeSwitch(setting.stripeSwitch);
      setIsAppActive(setting.isAppActive);
      setLoginBonus(setting.loginBonus);
      setMinRCoinForCaseOut(setting.minRcoinForCashOut);
      setPaymentGateway(setting.paymentGateway);
      setPkEndTime(setting?.pkEndTime);
      setSelectedValue(data);
      setPrivateKey(JSON.stringify(setting?.privateKey));
      setMinRCoinForCaseOutAgency(setting?.minRcoinForCashOutAgency);
      setMinRcoinForCashOutBd(setting?.minRcoinForCashOutBd);
      setLocationApiKey(setting?.locationApiKey);
      setCallReceiverPercent(setting?.callReceiverPercent);
      setResendApiKey(setting?.resendApiKey);
      setGiftAnnouncementCoin(setting?.coinForAllRoomAnnouncement);
      setGameAnnouncementCoin(setting?.coinForGameAnnouncement);
      setAboutLink(setting?.aboutUsLink);
      setTermsLink(setting?.termsAndConditionLink);
      setAndroidAppVersion(setting?.androidAppVersion);
      setAndroidAppLink(setting?.androidAppLink);
      setAndroidAssetLinks(
        typeof setting?.androidAssetLinks === "string"
          ? setting.androidAssetLinks
          : JSON.stringify(setting?.androidAssetLinks ?? [], null, 2),
      );
      setPaystackSwitch(setting?.paystackAndroidEnabled);
      setCashfreeSwitch(setting?.cashfreeAndroidEnabled);
      setPaypalSwitch(setting?.paypalAndroidEnabled);
      setRazorpaySwitch(setting?.razorPayAndroidEnabled);

      setPaystackPublicKey(setting?.paystackPublicKey);
      setPaystackSecretKey(setting?.paystackSecretKey);

      setCashfreeClientId(setting?.cashfreeClientId);
      setCashfreeClientSecret(setting?.cashfreeClientSecret);

      setPaypalClientId(setting?.paypalClientId);
      setPaypalClientSecret(setting?.paypalSecretKey);

      setRazorpayId(setting?.razorPayId);
      setRazorpaySecret(setting?.razorSecretKey);

      setFlutterWaveId(setting?.flutterWaveId);
      setIsFlutterwaveEnabled(setting?.isFlutterwaveEnabled);
    }
  }, [setting]);

  useEffect(() => {
    if (setting) {
      setInitialSetting({
        referralBonus: setting?.referralBonus,
        referralBonusCoin: setting?.referralCoinBonus,
        loginBonus: setting?.loginBonus,
        agoraKey: setting?.agoraKey,
        agoraCertificate: setting?.agoraCertificate,
        maxSecondForVideo: setting?.maxSecondForVideo,
        privacyPolicyLink: setting?.privacyPolicyLink,
        privacyPolicyText: setting?.privacyPolicyText,
        femaleCallCharge: setting?.femaleCallCharge,
        maleCallCharge: setting?.maleCallCharge,
        audioCallChargeFemale: setting?.audioCallChargeFemale,
        audioCallChargeMale: setting?.audioCallChargeMale,
        rCoinForCaseOut: setting?.rCoinForCashOut,
        rCoinForDiamond: setting?.rCoinForDiamond,
        bdCommission: setting?.bdCommission,
        minRcoinForCashOutAgency: setting?.minRcoinForCashOutAgency,
        minRcoinForCashOutBd: setting?.minRcoinForCashOutBd,
        minRcoinForCaseOut: setting?.minRcoinForCashOut,
        agencyCommission: setting?.agencyCommission,
        pkEndTime: setting?.pkEndTime,
        vipDiamond: setting?.vipDiamond,
        callReceiverPercent: setting?.callReceiverPercent,
        locationApiKey: setting?.locationApiKey,
        resendApiKey: setting?.resendApiKey,
        gameCoin: setting?.gameCoin || [],
        coinForGameAnnouncement: setting?.coinForGameAnnouncement,
        coinForAllRoomAnnouncement: setting?.coinForAllRoomAnnouncement,
        aboutUsLink: setting?.aboutUsLink,
        termsAndConditionLink: setting?.termsAndConditionLink,
        paymentGateway: setting.paymentGateway || [],
        privateKey: JSON.stringify(setting.privateKey || {}),
        stripePublishableKey: setting.stripePublishableKey,
        stripeSecretKey: setting.stripeSecretKey,
        androidAppLink: setting.androidAppLink,
        paystackPublicKey: setting.paystackPublicKey,
        paystackSecretKey: setting.paystackSecretKey,
        cashfreeClientId: setting.cashfreeClientId,
        cashfreeClientSecret: setting.cashfreeClientSecret,
        razorPayId: setting.razorPayId,
        razorpaySecret: setting.razorpaySecret,
        razorSecretKey: setting.razorSecretKey,
        paypalClientId: setting.paypalClientId,
        flutterWaveId: setting.flutterWaveId,
        androidAppVersion: setting.androidAppVersion,
        currency: setting.currency,
        androidAssetLinks:
          typeof setting.androidAssetLinks === "string"
            ? setting.androidAssetLinks
            : JSON.stringify(setting.androidAssetLinks ?? [], null, 2),
      });
    }
  }, [setting]);

  const getUpdatedFields = (current, initial) => {
    const updated = {};

    Object.keys(current).forEach((key) => {
      if (JSON.stringify(current[key]) !== JSON.stringify(initial[key])) {
        updated[key] = current[key];
      }
    });

    return updated;
  };

  const handleTabChange = (newType) => {
    setType(newType);
    localStorage.setItem("settingTab", newType);
    if (newType === "redeemSetting") {
      dispatch(getRedeemOptionsDropdown());
    }
  };

  const handleSubmit = () => {
    if (gameCoin1 < 0) {
      return setError({
        ...errors,
        gameCoin1: " Game Diamond Invalid Value!! ",
      });
    }

    if (gameCoin2 < 0) {
      return setError({
        ...errors,
        gameCoin2: " Game Diamond Invalid Value!! ",
      });
    }
    if (gameCoin3 < 0) {
      return setError({
        ...errors,
        gameCoin3: " Game Diamond Invalid Value!! ",
      });
    }
    if (gameCoin4 < 0) {
      return setError({
        ...errors,
        gameCoin4: " Game Diamond  Invalid Value!! ",
      });
    }

    if (gameCoin5 < 0) {
      return setError({
        ...errors,
        gameCoin5: " Game Diamond Invalid Value!! ",
      });
    }
    if (pkEndTime <= 0) {
      return setError({
        ...errors,
        pkEndTime: " pkEnd Time  Invalid Value!! ",
      });
    }
    const vipDiamondValid = isNumeric(vipDiamond);
    if (!vipDiamondValid) {
      return setError({
        ...errors,
        vipDiamond: "Invalid Call Charge!!",
      });
    }

    const referralBonusValid = isNumeric(referralBonus);
    if (!referralBonusValid) {
      return setError({
        ...errors,
        referralBonus: "Invalid Referral Diamond Bonus!!",
      });
    }
    const referralBonusCoinValid = isNumeric(referralBonusCoin);
    if (!referralBonusCoinValid) {
      return setError({
        ...errors,
        referralBonusCoin: "Invalid Referral Coin Bonus!!",
      });
    }
    const loginBonusValid = isNumeric(loginBonus);
    if (!loginBonusValid) {
      return setError({ ...errors, loginBonus: "Invalid Login Bonus!!" });
    }
    const maxSecondForVideoValid = isNumeric(maxSecondForVideo);
    if (!maxSecondForVideoValid) {
      return setError({
        ...errors,
        maxSecondForVideo: "Invalid Value!!",
      });
    }

    const femaleCallChargeValid = isNumeric(femaleCallCharge);
    if (!femaleCallChargeValid) {
      return setError({
        ...errors,
        femaleCallCharge: "Invalid Female  Call Charge!!",
      });
    }
    const maleCallChargeValid = isNumeric(maleCallCharge);
    if (!maleCallChargeValid) {
      return setError({
        ...errors,
        maleCallCharge: "Invalid Male Call Charge!!",
      });
    }
    const audioCallChargeFemaleValid = isNumeric(audioCallChargeFemale);
    if (!audioCallChargeFemaleValid) {
      return setError({
        ...errors,
        audioCallChargeFemale: "Invalid Female Audio Call Rate!!",
      });
    }

    const audioCallChargeMaleValid = isNumeric(audioCallChargeMale);
    if (!audioCallChargeMaleValid) {
      return setError({
        ...errors,
        audioCallChargeMale: "Invalid Male Audio Call Rate!!",
      });
    }
    const rCoinForCaseOutValid = isNumeric(rCoinForCaseOut);
    if (!rCoinForCaseOutValid) {
      return setError({
        ...errors,
        rCoinForCaseOut: "Invalid Value!!",
      });
    }

    const rCoinForDiamondValid = isNumeric(rCoinForDiamond);
    if (!rCoinForDiamond) {
      return setError({
        ...errors,
        rCoinForDiamond: "Invalid Value!!",
      });
    }

    const bdCommissionValid = isNumeric(bdCommission);
    if (!bdCommissionValid) {
      return setError({
        ...errors,
        bdCommission: "Invalid Value!!",
      });
    }

    if (Number(bdCommission) < 0 || Number(bdCommission) > 100) {
      return setError({
        ...errors,
        bdCommission: "BD Commission must be between 0 and 100!!",
      });
    }

    const minRCoinForCaseOutValid = isNumeric(minRCoinForCaseOut);
    if (!minRCoinForCaseOutValid) {
      return setError({
        ...errors,
        minRCoinForCaseOut: "Invalid Value!!",
      });
    }
    if (!agencyCommission) {
      return setError({
        ...errors,
        agencyCommission: "Agency Commission is Required",
      });
    }

    if ((androidAssetLinks || "").trim()) {
      const androidErr = validateAndroidAssetLinks(androidAssetLinks);
      if (androidErr) {
        return setError({
          ...errors,
          androidAssetLinks: androidErr,
        });
      }
    }

    let gameCoinArray = [gameCoin1, gameCoin2, gameCoin3, gameCoin4, gameCoin5];

    const data = {
      referralBonus,
      referralBonusCoin,
      loginBonus,
      agoraKey,
      agoraCertificate,
      maxSecondForVideo: maxSecondForVideo === "" ? 0 : maxSecondForVideo,
      privacyPolicyLink,
      privacyPolicyText,
      // chatCharge: chatCharge === "" ? 0 : chatCharge,
      // chatCharge: 0,
      femaleCallCharge: femaleCallCharge === "" ? 0 : femaleCallCharge,
      maleCallCharge: maleCallCharge === "" ? 0 : maleCallCharge,
      // googlePlayEmail,
      // googlePlayKey,
      stripePublishableKey,
      stripeSecretKey,
      currency,
      rCoinForCaseOut: rCoinForCaseOut === "" ? 0 : rCoinForCaseOut,
      rCoinForDiamond: rCoinForDiamond === "" ? 1 : rCoinForDiamond,
      bdCommission: bdCommission === "" ? 0 : bdCommission,
      minRcoinForCashOutAgency: parseInt(minRcoinForCashOutAgency),
      minRcoinForCashOutBd: parseInt(minRcoinForCashOutBd),
      paymentGateway,
      minRcoinForCaseOut: minRCoinForCaseOut,
      gameCoin: gameCoinArray,
      agencyCommission,
      pkEndTime,
      vipDiamond,
      privateKey,
      callReceiverPercent,
      locationApiKey,
      audioCallChargeFemale,
      audioCallChargeMale,
      resendApiKey,
      coinForGameAnnouncement:
        gameAnnouncementCoin === "" ? 0 : gameAnnouncementCoin,
      coinForAllRoomAnnouncement:
        giftAnnouncementCoin === "" ? 0 : giftAnnouncementCoin,
      aboutUsLink: aboutLink,
      termsAndConditionLink: termsLink,
      androidAppVersion,
      androidAppLink,
      androidAssetLinks,
      paystackPublicKey,
      paystackSecretKey,
      cashfreeClientId,
      cashfreeClientSecret,
      paypalClientId,
      paypalSecretKey,
      razorPayId,
      razorSecretKey,
      flutterWaveId,
    };

    const updatedPayload = getUpdatedFields(data, initialSetting);

    if (Object.keys(updatedPayload).length === 0) {
      alert("No changes detected");
      return;
    }

    // Send androidAssetLinks as array to API (stored as string in form)
    if (updatedPayload.androidAssetLinks !== undefined) {
      const v = (updatedPayload.androidAssetLinks || "").trim();
      try {
        updatedPayload.androidAssetLinks = v ? JSON.parse(v) : [];
      } catch {
        updatedPayload.androidAssetLinks = [];
      }
    }

    props.updateSetting(mongoId, updatedPayload);
  };

  const handlePaymentSwitch = (switchType) => {
    // if (purchaseCodeChecked) {
    //   if (!isPurchaseCodeValid) {
    //     setShowLicenseDialog(true);
    //   } else {
        handleSwitch_(switchType);
      // }
      // return;
    // }

    // apiInstanceFetch
    //   .get("setting/isPurchaseCodeValid")
    //   .then((res) => {
    //     const valid = res.allowPaymentSettings === true;
    //     setIsPurchaseCodeValid(valid);
    //     setPurchaseCodeChecked(true);
    //     if (valid) {
    //       handleSwitch_(switchType);
    //     } else {
    //       setShowLicenseDialog(true);
    //     }
    //   })
    //   .catch(() => {
    //     setPurchaseCodeChecked(true);
    //     setIsPurchaseCodeValid(false);
    //     setShowLicenseDialog(true);
    //   });
  };

  const handlePreventToggle = (e) => {
    e.preventDefault();
  };

  const handleSwitch_ = (type) => {

    props.handleSwitch(mongoId, type);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(locationApiKey);
    setTooltipText("Copied!");
    setIcon(<CheckCircle fontSize="small" style={{ color: "green" }} />);
    setTimeout(() => {
      setTooltipText(locationApiKey);
      setIcon("?");
    }, 2000); // Reset tooltip and icon after 2 seconds
  };

  //onselect function of selecting multiple values
  function onSelect(selectedList, selectedItem) {
    paymentGateway.push(selectedItem.name);
  }

  //onRemove function for remove multiple values
  function onRemove(selectedList, removedItem) {
    setPaymentGateway(selectedList.map((data) => data.name));
  }

  const isNumeric = (value) => {
    const val = value === "" ? 0 : value;
    const validNumber = /^\d+$/.test(val);
    return validNumber;
  };

  const handleMouseEnter = () => {
    setTooltipText(locationApiKey);
  };

  const handleMouseLeave = () => {
    setTooltipText(locationApiKey);
  };

  return (
    <>
      <div className="page-title">
        <div className="row ">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3 className="mb-3 text-white">Setting</h3>
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
                <li className="breadcrumb-item active" aria-current="page">
                  Setting
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div
        className="row mb-3"
        style={{
          position: "sticky",
          top: 0, // adjust this value to match your navbar height e.g. "64px"
          zIndex: 100,
          backgroundColor: "#0f172a", // match your page background
          padding: "10px 0",
          margin: "0",
          borderBottom: "1px solid #2a3050",
        }}
      >
        <div className="col-12">
          <div className="filter-bar">
            <div className="d-flex align-items-center gap-2 flex-wrap">
              {[
                { type: "generalSetting", label: "General", color: "#1a6fd4" },
                { type: "coinSetting", label: "Coin", color: "#b45309" },
                { type: "agoraSetting", label: "Agora", color: "#0f766e" },
                {
                  type: "redeemOptions",
                  label: "Redeem Options",
                  color: "#1a6fd4",
                },
                { type: "redeemSetting", label: "Redeem", color: "#b45309" },
                { type: "paymentSetting", label: "Payment", color: "#0f766e" },
                { type: "gameSetting", label: "Game", color: "#1a6fd4" },
                {
                  type: "firebaseSetting",
                  label: "Firebase",
                  color: "#c0392b",
                },
                {
                  type: "currencySetting",
                  label: "Currency",
                  color: "#0f766e",
                },
                { type: "otherSetting", label: "Other", color: "#1a6fd4" },
              ].map((item) => (
                <button
                  key={item.type}
                  type="button"
                  className="btn btn-sm"
                  style={{
                    background: type === item.type ? item.color : "#1a1f2e",
                    color: type === item.type ? "#fff" : "#6b7280",
                    border: `1px solid ${type === item.type ? item.color : "#2a3050"}`,
                    borderRadius: 6,
                    transition: "0.2s",
                  }}
                  onClick={() => handleTabChange(item.type)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* General Setting  */}
      {type === "generalSetting" && (
        <div className="row ">
          <div className="col-md-12 col-12">
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="card-title">App Setting</h5>
                  <InfoTooltip
                    title="App Setting Info"
                    content={[
                      {
                        label: "Android Version",
                        description:
                          "Latest Android app version of your application.",
                      },
                      {
                        label: "App Link",
                        description:
                          "Play Store link for your Android application.",
                      },
                    ]}
                  />
                </div>

                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="row">
                    {/* Android Version */}
                    <div className="col-md-6 col-12 mb-3">
                      <label htmlFor="androidAppVersion" className="form-label">
                        Android App Version
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="androidAppVersion"
                        placeholder={"Enter Android App Version"}
                        value={androidAppVersion}
                        onChange={(e) => setAndroidAppVersion(e.target.value)}
                      />
                      {errors.androidAppVersion && (
                        <div className="mt-1">
                          <span className="text-danger">
                            {errors.androidAppVersion}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Android Link */}
                    <div className="col-md-6 col-12 mb-3">
                      <label htmlFor="androidAppLink" className="form-label">
                        Android App Link
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="androidAppLink"
                        placeholder={"Enter Android App Link"}
                        value={androidAppLink}
                        onChange={(e) => setAndroidAppLink(e.target.value)}
                      />
                      {errors.androidAppLink && (
                        <div className="mt-1">
                          <span className="text-danger">
                            {errors.androidAppLink}
                          </span>
                        </div>
                      )}
                    </div>
                    {/* Android assets Link */}
                    <div className="col-md-6 col-12 mb-3">
                      <label htmlFor="androidAssetLinks" className="form-label">
                        Android Assets Link
                      </label>
                      <textarea
                        className="form-control font-monospace"
                        id="androidAssetLinks"
                        rows={12}
                        placeholder={'JSON array e.g. [{"relation":["delegate_permission/common.handle_all_urls"],"target":{"namespace":"android_app","package_name":"com.example.app","sha256_cert_fingerprints":["AA:BB:..."]}}]'}
                        value={
                          typeof androidAssetLinks === "string"
                            ? androidAssetLinks
                            : JSON.stringify(androidAssetLinks ?? [], null, 2)
                        }
                        onChange={(e) => {
                          setAndroidAssetLinks(e.target.value);
                          if (errors.androidAssetLinks)
                            setError((prev) => ({
                              ...prev,
                              androidAssetLinks: "",
                            }));
                        }}
                      />
                      {errors.androidAssetLinks && (
                        <div className="mt-1">
                          <span className="text-danger">
                            {errors.androidAssetLinks}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="col-md-12 col-12">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 col-12">
                    <h5 className="card-title ">Other Setting</h5>
                  </div>

                  <div className="col-md-6 col-12 d-flex justify-content-between mb-0">
                    <div className="d-flex align-items-center">
                      {canEdit && (
                        <>
                          <h5 className="card-title mb-0 me-4">Fake Data</h5>
                          <label className="switch">
                            <input
                              type="checkbox"
                              checked={isFake}
                              onChange={() => handleSwitch_("isFake")}
                              onClick={handlePreventToggle}
                            />
                            <span className="slider">
                              <p
                                style={{
                                  fontSize: 12,
                                  marginLeft: `${isFake ? "7px" : "35px"}`,
                                  color: `${isFake ? "#fff" : "#000"}`,
                                  marginTop: "6px",
                                }}
                              ></p>
                            </span>
                          </label>
                        </>
                      )}
                    </div>

                    <InfoTooltip
                      title="Other Setting Information"
                      content={[
                        {
                          label: "Fake Data",
                          description:
                            "Enable this to show dummy data inside the app.",
                        },
                        {
                          label: "Referral Bonus",
                          description:
                            "Reward given to users for referring new users.",
                        },
                        {
                          label: "Login Bonus",
                          description: "Bonus users receive on daily login.",
                        },
                        {
                          label: "Maximum Video Seconds",
                          description:
                            "Maximum allowed duration for uploaded videos.",
                        },
                      ]}
                    />
                  </div>

                  <form>
                    <div className="mb-3 row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="referralBonus" className="form-label">
                          Referral Bonus ( Diamond )
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          id="referralBonus"
                          placeholder={"Enter Referral Bonus"}
                          value={referralBonus}
                          onChange={(e) => setReferralBonus(e.target.value)}
                        />
                        {errors.referralBonus && (
                          <div className="ml-2 mt-1">
                            {errors.referralBonus && (
                              <div className="pl-1 text__left">
                                <span className="text-red">
                                  {errors.referralBonus}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="col-md-6 mb-3">
                        <label
                          htmlFor="referralBonusCoin"
                          className="form-label"
                        >
                          Referral Bonus ( Coin )
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          id="referralBonusCoin"
                          placeholder={"Enter Referral Bonus Coin"}
                          value={referralBonusCoin}
                          onChange={(e) => setReferralBonusCoin(e.target.value)}
                        />
                        {errors.referralBonusCoin && (
                          <div className="ml-2 mt-1">
                            {errors.referralBonusCoin && (
                              <div className="pl-1 text__left">
                                <span className="text-red">
                                  {errors.referralBonusCoin}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="loginBonus" className="form-label">
                          Login Bonus
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          id="loginBonus"
                          placeholder={"Enter Login Bonus"}
                          value={loginBonus}
                          onChange={(e) => setLoginBonus(e.target.value)}
                        />
                        {errors.loginBonus && (
                          <div className="ml-2 mt-1">
                            {errors.loginBonus && (
                              <div className="pl-1 text__left">
                                <span className="text-red">
                                  {errors.loginBonus}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="mb-3 col-md-6">
                        <label htmlFor="videoSecond" className="form-label">
                          Maximum Seconds for Video
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          id="videoSecond"
                          placeholder={"Enter Video Time in Seconds"}
                          value={maxSecondForVideo}
                          onChange={(e) => setMaxSecondForVideo(e.target.value)}
                        />
                        {errors.maxSecondForVideo && (
                          <div className="ml-2 mt-1">
                            {errors.maxSecondForVideo && (
                              <div className="pl-1 text__left">
                                <span className="text-red">
                                  {errors.maxSecondForVideo}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-12 col-12">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  {/* <h5 className="card-title d-flex justify-content-between mb-3">
                    Is App Active (use at the time of app maintenance)
                    <label className="switch">
                      <input type="checkbox" checked={isAppActive} onChange={() => handleSwitch_("app active")} />
                      <span className="slider">
                        <p
                          style={{
                            fontSize: 12,
                            marginLeft: `${isAppActive ? "7px" : "35px"}`,
                            color: `${isAppActive ? "#fff" : "#000"}`,
                            marginTop: "6px",
                          }}
                        >
                          {isAppActive ? "Yes" : "No"}
                        </p>
                      </span>
                    </label>


                    <InfoTooltip
                      title="App Maintenance Control"
                      content={[
                        {
                          label: "Redirect URL",
                          description:
                            "Users will be redirected to this link when clicking on Privacy Policy inside the app.",
                        },
                        {
                          label: "Displayed Text",
                          description:
                            "This text will be shown inside the app if you are not redirecting users to a link.",
                        },
                        {
                          label: "About Page URL",
                          description:
                            "Users will be redirected to this link when clicking on About Us in the app.",
                        },
                        {
                          label: "Terms Page URL",
                          description:
                            "Users will be redirected to this link when clicking on Terms & Conditions in the app.",
                        },
                      ]}
                    />
                  </h5> */}

                  <div className="col-12 d-flex justify-content-between align-items-center mb-3">
                    {/* Left: Title + Toggle */}

                    <div className="d-flex align-items-center">
                      {canEdit && (
                        <>
                          <h5 className="card-title mb-0 me-2">
                            Is App Active (use at the time of app maintenance)
                          </h5>
                          <label className="switch">
                            <input
                              type="checkbox"
                              checked={isAppActive}
                              onChange={() => handleSwitch_("isAppActive")}
                              onClick={handlePreventToggle}
                            />
                            <span className="slider">
                              <p
                                style={{
                                  fontSize: 12,
                                  marginLeft: `${isAppActive ? "7px" : "35px"}`,
                                  color: `${isAppActive ? "#fff" : "#000"}`,
                                  marginTop: "6px",
                                }}
                              ></p>
                            </span>
                          </label>
                        </>
                      )}
                    </div>

                    {/* Right: Info Icon */}
                    <InfoTooltip
                      title="App Maintenance Control"
                      content={[
                        {
                          label: "Redirect URL",
                          description:
                            "Users will be redirected to this link when clicking on Privacy Policy inside the app.",
                        },
                        {
                          label: "Displayed Text",
                          description:
                            "This text will be shown inside the app if you are not redirecting users to a link.",
                        },
                        {
                          label: "About Page URL",
                          description:
                            "Users will be redirected to this link when clicking on About Us in the app.",
                        },
                        {
                          label: "Terms Page URL",
                          description:
                            "Users will be redirected to this link when clicking on Terms & Conditions in the app.",
                        },
                      ]}
                    />
                  </div>

                  <form>
                    <div className="mb-3">
                      <label htmlFor="policyLink" className="form-label">
                        Privacy Policy Link (redirect to this link in app in
                        privacy policy click)
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="policyLink"
                        placeholder={"Enter Privacy Policy Link"}
                        value={privacyPolicyLink}
                        onChange={(e) => setPrivacyPolicyLink(e.target.value)}
                      />
                    </div>
                    <div className="">
                      <label htmlFor="policyText" className="form-label">
                        Privacy Policy Text
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="policyText"
                        placeholder={"Enter Privacy Policy Text"}
                        value={privacyPolicyText}
                        onChange={(e) => setPrivacyPolicyText(e.target.value)}
                      />
                    </div>
                    <div className="mt-2 mb-4">
                      <label htmlFor="vipDiamond" className="form-label">
                        About Us Link
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="vipDiamond"
                        placeholder={"Enter About Us Link"}
                        min="0"
                        value={aboutLink}
                        onChange={(e) => setAboutLink(e.target.value)}
                      />
                      {errors.aboutLink && (
                        <div className="ml-2 mt-1">
                          {errors.aboutLink && (
                            <div className="pl-1 text__left">
                              <span className="text-red">
                                {errors.aboutLink}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="mt-2 mb-4">
                      <label htmlFor="vipDiamond" className="form-label">
                        Terms & Condition Link
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="vipDiamond"
                        placeholder={"Enter Terms-Conditions Link"}
                        min="0"
                        value={termsLink}
                        onChange={(e) => setTermsLink(e.target.value)}
                      />
                      {errors.termsLink && (
                        <div className="ml-2 mt-1">
                          {errors.termsLink && (
                            <div className="pl-1 text__left">
                              <span className="text-red">
                                {errors.termsLink}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>
            {canEdit && (
              <div className="d-flex justify-content-end">
                <button
                  type="button"
                  className="edit-btn"
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Coin Setting  */}
      {type === "coinSetting" && (
        // <h3 className="mb-3 text-white">Coin Setting</h3>
        <div className="row">
          <div className="col-md-12 col-12">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 col-6">
                    <h5 className="card-title ">Private Call Charges</h5>

                    <form>
                      <div className="mb-3 row">
                        <div className="col-md-12">
                          <label
                            htmlFor="femaleCallCHarge"
                            className="form-label"
                          >
                            Female Call Charge (per min for user)
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            id="referralBonus"
                            placeholder={"Enter Female Call Charge"}
                            value={femaleCallCharge}
                            onChange={(e) =>
                              setFemaleCallCharge(e.target.value)
                            }
                          />
                          {errors.femaleCallCharge && (
                            <div className="ml-2 mt-1">
                              {errors.femaleCallCharge && (
                                <div className="pl-1 text__left">
                                  <span className="text-red">
                                    {errors.femaleCallCharge}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="col-md-12 mt-3">
                          <label
                            htmlFor="maleCoinCharge"
                            className="form-label"
                          >
                            Male Call Charge (per min for user)
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            id="maleCallCharge"
                            placeholder={"Enter Male Call Charge"}
                            value={maleCallCharge}
                            onChange={(e) => setMaleCallCharge(e.target.value)}
                          />
                          {errors.maleCallCharge && (
                            <div className="ml-2 mt-1">
                              {errors.maleCallCharge && (
                                <div className="pl-1 text__left">
                                  <span className="text-red">
                                    {errors.maleCallCharge}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </form>
                  </div>
                  <div className="col-md-6 col-6">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="card-title mb-0">Audio Call Charges</h5>
                      <InfoTooltip
                        title="Call Charges Information"
                        content={[
                          {
                            label: "Female Private Rate",
                            description:
                              "Amount charged per minute when user calls a female user directly.",
                          },
                          {
                            label: "Male Private Rate",
                            description:
                              "Amount charged per minute when user calls a male user directly.",
                          },
                          {
                            label: "Female Audio Call",
                            description:
                              "Per minute charge when female user is matched randomly.",
                          },
                          {
                            label: "Male Audio Call",
                            description:
                              "Per minute charge when male user is matched randomly.",
                          },
                        ]}
                      />
                    </div>

                    <form>
                      <div className="mb-3 row">
                        <div className="col-md-6">
                          <label
                            htmlFor="audioCallChargeFemale"
                            className="form-label"
                          >
                            Female Audio Call Charge per min
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            id="referralBonus"
                            placeholder={"Enter Female Audio Call Charge"}
                            value={audioCallChargeFemale}
                            onChange={(e) =>
                              setaudioCallChargeFemale(e.target.value)
                            }
                          />
                          {errors.audioCallChargeFemale && (
                            <div className="ml-2 mt-1">
                              {errors.audioCallChargeFemale && (
                                <div className="pl-1 text__left">
                                  <span className="text-red">
                                    {errors.audioCallChargeFemale}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="col-md-6">
                          <label
                            htmlFor="maleCoinCharge"
                            className="form-label"
                          >
                            Male Audio Call Charge per min
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            id="audioCallChargeMale"
                            placeholder={"Enter Male Audio Call Charge"}
                            value={audioCallChargeMale}
                            onChange={(e) =>
                              setaudioCallChargeMale(e.target.value)
                            }
                          />
                          {errors.audioCallChargeMale && (
                            <div className="ml-2 mt-1">
                              {errors.audioCallChargeMale && (
                                <div className="pl-1 text__left">
                                  <span className="text-red">
                                    {errors.audioCallChargeMale}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </form>
                  </div>
                  {canEdit && (
                    <div className="row">
                      <div className="d-flex align-items-end justify-content-end">
                        <button
                          type="button"
                          className="edit-btn"
                          onClick={handleSubmit}
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-12 col-12">
            <div className="card">
              <div className="card-body">
                {/* <h5 className="card-title">Coin Setup
                  <InfoTooltip
                    title="Coin Setup Information"
                    content={[
                      {
                        label: "RCoin Rate (Cash Out)",
                        description:
                          "Defines the conversion ratio used when users cash out their earnings. Example: 1 USD = X RCoins.",
                      },
                      {
                        label: "Diamond to Dollar Conversion",
                        description:
                          "Determines how many RCoins are required to convert diamonds into real currency.",
                      },
                      {
                        label: "Diamond to RCoin Conversion",
                        description:
                          "Defines how many RCoins equal 1 Diamond inside the system.",
                      },
                      {
                        label: "Conversion Control",
                        description:
                          "These settings control the earning and withdrawal balance of users inside the platform.",
                      },
                    ]}
                  />
                </h5> */}

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="card-title mb-0">Coin Setup</h5>
                  <InfoTooltip
                    title="Coin Setup Information"
                    content={[
                      {
                        label: "RCoin Rate",
                        description:
                          "Sets how many RCoins are equal to 1 USD for cash-out calculations.",
                      },
                      {
                        label: "RCoin to Diamond Ratio",
                        description:
                          "Sets how many RCoins are equal to 1 Diamond inside the platform.",
                      },
                    ]}
                  />
                </div>

                <form>
                  <div className="mb-3 row">
                    <div className="col-5">
                      <label htmlFor="rCoin" className="form-label">
                        How Many RCoin ( Rcoin to{" "}
                        {setting?.currency?.symbol || "$"} conversion ratio )
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="rCoin"
                        placeholder={"Enter RCoin"}
                        value={rCoinForCaseOut}
                        onChange={(e) => setRCoinForCaseOut(e.target.value)}
                      />
                      {errors.rCoinForCaseOut && (
                        <div className="ml-2 mt-1">
                          {errors.rCoinForCaseOut && (
                            <div className="pl-1 text__left">
                              <span className="text-red">
                                {errors.rCoinForCaseOut}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="col-1 mt-5">=</div>
                    <div className="col-6">
                      <label htmlFor="rCoin" className="form-label">
                        RCoin Rate (for cash out conversion ratio)
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="rCoin"
                        placeholder={`1 ${setting?.currency?.currencyCode}`}
                        value={`1 ${setting?.currency?.currencyCode}`}
                        disabled
                      />
                    </div>
                  </div>
                  <div className="mb-3 row">
                    <div className="col-5">
                      <label htmlFor="rCoin" className="form-label">
                        How Many RCoin ( Rcoin to Diamond conversion ratio )
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="rCoin"
                        placeholder={"Enter RCoin"}
                        value={rCoinForDiamond}
                        onChange={(e) => setRCoinForDiamond(e.target.value)}
                      />
                      {errors.rCoinForDiamond && (
                        <div className="ml-2 mt-1">
                          {errors.rCoinForDiamond && (
                            <div className="pl-1 text__left">
                              <span className="text-red">
                                {errors.rCoinForDiamond}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="col-1 mt-5">=</div>
                    <div className="col-6">
                      <label htmlFor="rCoin" className="form-label">
                        Diamond
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="rCoin"
                        value="1 Diamond"
                        disabled
                      />
                    </div>
                  </div>
                  <div className="mb-3 row">
                    <div className="col-6">
                      <label htmlFor="rCoin" className="form-label">
                        BD Commission (%)
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="rCoin"
                        placeholder={"Enter RCoin"}
                        value={bdCommission}
                        onChange={(e) => setBdCommission(e.target.value)}
                      />
                      {errors.bdCommission && (
                        <div className="ml-2 mt-1">
                          {errors.bdCommission && (
                            <div className="pl-1 text__left">
                              <span className="text-red">
                                {errors.bdCommission}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </form>
                {canEdit && (
                  <div className="d-flex justify-content-end">
                    <button
                      type="button"
                      className="edit-btn"
                      onClick={handleSubmit}
                    >
                      Submit
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="row">
        {/* Agora Setting  */}
        {type === "agoraSetting" && (
          <div className="col-md-12">
            {/* <h3 className="mb-3 text-white">Agora Setting</h3> */}
            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div className="card-body">
                    <form onSubmit={(e) => e.preventDefault()}>
                      <div className="mb-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <label htmlFor="agoraKey" className="form-label">
                            Agora Key
                          </label>

                          <InfoTooltip
                            title="Agora Configuration Info"
                            content={[
                              {
                                label: "Agora Key",
                                description:
                                  "This is your Agora App ID used to initialize real-time audio and video communication in the application.",
                              },
                              {
                                label: "Agora Certificate",
                                description:
                                  "Used to generate secure tokens for real-time calls. Keep this confidential and do not expose it publicly.",
                              },
                              {
                                label: "Security Notice",
                                description:
                                  "Improper configuration may stop live streaming, voice calls, or video calls from working.",
                              },
                            ]}
                          />
                        </div>

                        <input
                          type="text"
                          className="form-control"
                          id="agoraKey"
                          placeholder={"Enter Agora Key"}
                          value={agoraKey}
                          onChange={(e) => setAgoraKey(e.target.value)}
                        />
                      </div>

                      <div className="mb-3">
                        <label
                          htmlFor="agoraCertificate"
                          className="form-label"
                        >
                          Agora Certificate
                        </label>

                        <input
                          type="text"
                          className="form-control"
                          id="agoraCertificate"
                          placeholder={"Enter Agora Certificate"}
                          value={agoraCertificate}
                          onChange={(e) => setAgoraCertificate(e.target.value)}
                        />
                      </div>

                      {canEdit && (
                        <div className="d-flex justify-content-end">
                          <button
                            type="button"
                            className="edit-btn"
                            onClick={handleSubmit}
                          >
                            Submit
                          </button>
                        </div>
                      )}
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* redeem options  */}
        {type === "redeemOptions" && (
          <div className="col-md-12">
            <RedeemOptions />
          </div>
        )}
        {/* Redeem Setting  */}
        {type === "redeemSetting" && (
          <div className="col-md-12">
            {/* <h3 className="mb-3 text-white">Redeem Setting</h3> */}
            <div className="row">
              <div className="col-md-12 col-12">
                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      <form>
                        <div
                          className="mb-3"
                        // onClick={() => dispatch(getRedeemOptionsDropdown())}
                        >
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <label
                              htmlFor="googlePlayEmail"
                              className="form-label"
                            >
                              Payment Gateway (option for cash out for user)
                            </label>
                            <InfoTooltip
                              title="Redeem Setting Information"
                              content={[
                                {
                                  label: "Payment Gateway",
                                  description:
                                    "Select which payment methods users can use to cash out their earnings.",
                                },
                                {
                                  label: "Minimum RCoin (User)",
                                  description:
                                    "Defines the minimum RCoin balance required for a normal user to request cash out.",
                                },
                                {
                                  label: "Minimum RCoin (Agency)",
                                  description:
                                    "Defines the minimum RCoin balance required for an agency account to request cash out.",
                                },
                                {
                                  label: "Minimum RCoin (Bd)",
                                  description:
                                    "Defines the minimum RCoin balance required for an bd account to request cash out.",
                                },
                                {
                                  label: "Important",
                                  description:
                                    "Incorrect configuration may prevent users or agencies from withdrawing their earnings.",
                                },
                              ]}
                            />
                          </div>
                          <Multiselect
                            options={redeemOptData}
                            selectedValues={selectedValue}
                            onSelect={onSelect}
                            onRemove={onRemove}
                            displayValue="name"
                            style={{
                              multiselectContainer: { width: "100%" },
                              searchBox: { width: "100%", maxWidth: "none", flexWrap: "wrap" },
                              optionContainer: {
                                background: "#111826",
                                border: "1px solid #1e2640",
                              },
                              option: {
                                color: "#c2c3ce",
                              }
                            }}
                          />
                        </div>

                        <div className="row">
                          <div className=" col-12 mb-2">
                            <label
                              htmlFor="minRCoinForCaseOut"
                              className="form-label"
                            >
                              Minimum RCoin for cash out (User)
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="minRCoinForCaseOut"
                              placeholder={"Enter RCoin for cash out (User)"}
                              value={minRCoinForCaseOut}
                              onChange={(e) =>
                                setMinRCoinForCaseOut(e.target.value)
                              }
                            />
                            {errors.minRCoinForCaseOut && (
                              <div className="ml-2 mt-1">
                                {errors.minRCoinForCaseOut && (
                                  <div className="pl-1 text__left">
                                    <span className="text-red">
                                      {errors.minRCoinForCaseOut}
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className=" row mb-3">
                          <label
                            htmlFor="minRCoinForCaseOut"
                            className="form-label"
                          >
                            Minimum RCoin for cash out (Agency)
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="minRCoinForCaseOut"
                            placeholder={"Enter RCoin for cash out(agency)"}
                            value={minRcoinForCashOutAgency}
                            onChange={(e) =>
                              setMinRCoinForCaseOutAgency(e.target.value)
                            }
                          />
                          {errors.minRcoinForCashOutAgency && (
                            <div className="ml-2 mt-1">
                              {errors.minRcoinForCashOutAgency && (
                                <div className="pl-1 text__left">
                                  <span className="text-red">
                                    {errors.minRcoinForCashOutAgency}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <div className=" row mb-3">
                          <label
                            htmlFor="minRCoinForCaseOut"
                            className="form-label"
                          >
                            Minimum RCoin for cash out (Bd)
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="minRCoinForCaseOut"
                            placeholder={"Enter RCoin for cash out(bd)"}
                            value={minRcoinForCashOutBd}
                            onChange={(e) =>
                              setMinRcoinForCashOutBd(e.target.value)
                            }
                          />
                          {errors.minRcoinForCashOutBd && (
                            <div className="ml-2 mt-1">
                              {errors.minRcoinForCashOutBd && (
                                <div className="pl-1 text__left">
                                  <span className="text-red">
                                    {errors.minRcoinForCashOutBd}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        {canEdit && (
                          <div className="d-flex justify-content-end">
                            <button
                              type="button"
                              className="edit-btn"
                              onClick={handleSubmit}
                            >
                              Submit
                            </button>
                          </div>
                        )}
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="row">
        {/* Payment Setting  */}

        {type === "paymentSetting" && (
          <div className="col-md-12">
            {/* <h3 className="mb-3 text-white">Payment Setting</h3> */}
            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      {/* Left: Title */}
                      <div className="d-flex align-items-center gap-3">
                        <h5 className="card-title mb-0">
                          Stripe Android Switch (enable/disable for payment in
                          app)
                        </h5>
                      </div>

                      {/* Right: Switch + Tooltip */}
                      <div className="d-flex align-items-center gap-3">
                        {/* Switch */}
                        {canEdit && (
                          <label className="switch mb-0">
                            <input
                              type="checkbox"
                              checked={stripeSwitch}
                              onChange={() =>
                                handlePaymentSwitch("stripeSwitch")
                              }
                              onClick={handlePreventToggle}
                            />
                            <span className="slider">
                              <p
                                style={{
                                  fontSize: 12,
                                  marginLeft: stripeSwitch ? "7px" : "35px",
                                  color: stripeSwitch ? "#fff" : "#000",
                                  marginTop: "6px",
                                }}
                              ></p>
                            </span>
                          </label>
                        )}

                        {/* Tooltip */}
                        <InfoTooltip
                          title="Stripe Payment Configuration"
                          content={[
                            {
                              label: "Stripe Switch",
                              description:
                                "Enable or disable Stripe payment gateway for Android in-app payments.",
                            },
                            {
                              label: "Publishable Key",
                              description:
                                "Used on frontend to initialize Stripe payment.",
                            },
                            {
                              label: "Secret Key",
                              description:
                                "Used on backend for secure Stripe transactions.",
                            },
                            {
                              label: "Important",
                              description:
                                "At least one payment gateway must remain enabled.",
                            },
                          ]}
                        />
                      </div>
                    </div>

                    {/* 🔽 FORM SAME RAHEGA (no change) */}
                    <form>
                      <div className="mb-3">
                        <label htmlFor="publishableKey" className="form-label">
                          Stripe Publishable Key
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="publishableKey"
                          placeholder={"Enter Stripe Publishable Key"}
                          value={stripePublishableKey}
                          onChange={(e) =>
                            setStripePublishableKey(e.target.value)
                          }
                        />
                      </div>

                      <div className="mb-3">
                        <label htmlFor="secretKey" className="form-label">
                          Stripe Secret Key
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="secretKey"
                          placeholder={"Enter Stripe Secret Key"}
                          value={stripeSecretKey}
                          onChange={(e) => setStripeSecretKey(e.target.value)}
                        />
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              <div className="col-12">
                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        {/* Left: Title */}
                        <div className="d-flex align-items-center gap-3">
                          <h5 className="card-title mb-0">
                            Paystack Android Switch (enable/disable for payment
                            in app)
                          </h5>
                        </div>

                        {/* Right: Switch + Tooltip */}
                        <div className="d-flex align-items-center gap-3">
                          {/* Switch */}
                          {canEdit && (
                            <label className="switch mb-0">
                              <input
                                type="checkbox"
                                checked={paystackAndroidEnabled}
                                onChange={() =>
                                  handlePaymentSwitch("paystackAndroidEnabled")
                                }
                                onClick={handlePreventToggle}
                              />
                              <span className="slider">
                                <p
                                  style={{
                                    fontSize: 12,
                                    marginLeft: paystackAndroidEnabled
                                      ? "7px"
                                      : "35px",
                                    color: paystackAndroidEnabled
                                      ? "#fff"
                                      : "#000",
                                    marginTop: "6px",
                                  }}
                                ></p>
                              </span>
                            </label>
                          )}

                          {/* Tooltip */}
                          <InfoTooltip
                            title="Paystack Configuration Info"
                            content={[
                              {
                                label: "Paystack Switch",
                                description:
                                  "Enable or disable Paystack payment gateway for Android in-app payments.",
                              },
                              {
                                label: "Paystack Public Key",
                                description:
                                  "Public key used on frontend to initialize Paystack payment.",
                              },
                              {
                                label: "Paystack Secret Key",
                                description:
                                  "Private key used on backend for secure Paystack transactions.",
                              },
                              {
                                label: "Important",
                                description:
                                  "At least one payment gateway must remain enabled.",
                              },
                            ]}
                          />
                        </div>
                      </div>
                    </div>

                    <form>
                      <div className="mb-3">
                        <label
                          htmlFor="paystackPublicKey"
                          className="form-label"
                        >
                          Paystack Public Key
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="paystackPublicKey"
                          placeholder={"Enter Paystack Public Key"}
                          value={paystackPublicKey}
                          onChange={(e) => setPaystackPublicKey(e.target.value)}
                        />
                      </div>

                      <div className="mb-3">
                        <label
                          htmlFor="paystackSecretKey"
                          className="form-label"
                        >
                          Paystack Secret Key
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="paystackSecretKey"
                          placeholder={"Enter Paystack Secret Key"}
                          value={paystackSecretKey}
                          onChange={(e) => setPaystackSecretKey(e.target.value)}
                        />
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              <div className="col-12">
                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        {/* Left: Title */}
                        <div className="d-flex align-items-center gap-3">
                          <h5 className="card-title mb-0">
                            Cashfree Android Switch (enable/disable for payment
                            in app)
                          </h5>
                        </div>

                        {/* Right: Switch + Tooltip */}
                        <div className="d-flex align-items-center gap-3">
                          {/* Switch */}
                          {canEdit && (
                            <label className="switch mb-0">
                              <input
                                type="checkbox"
                                checked={cashfreeAndroidEnabled}
                                onChange={() =>
                                  handlePaymentSwitch("cashfreeAndroidEnabled")
                                }
                                onClick={handlePreventToggle}
                              />
                              <span className="slider">
                                <p
                                  style={{
                                    fontSize: 12,
                                    marginLeft: cashfreeAndroidEnabled
                                      ? "7px"
                                      : "35px",
                                    color: cashfreeAndroidEnabled
                                      ? "#fff"
                                      : "#000",
                                    marginTop: "6px",
                                  }}
                                ></p>
                              </span>
                            </label>
                          )}

                          {/* Tooltip */}
                          <InfoTooltip
                            title="Cashfree Configuration Info"
                            content={[
                              {
                                label: "Cashfree Switch",
                                description:
                                  "Enable or disable Cashfree payment gateway for Android in-app payments.",
                              },
                              {
                                label: "Client ID",
                                description:
                                  "Used to identify your Cashfree account during API requests.",
                              },
                              {
                                label: "Client Secret",
                                description:
                                  "Used for secure authentication with Cashfree APIs.",
                              },
                              {
                                label: "Important",
                                description:
                                  "At least one payment gateway must remain enabled.",
                              },
                            ]}
                          />
                        </div>
                      </div>
                    </div>

                    <form>
                      <div className="mb-3">
                        <label
                          htmlFor="cashfreeClientId"
                          className="form-label"
                        >
                          Cashfree Client ID
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="cashfreeClientId"
                          placeholder={"Cashfree Client ID"}
                          value={cashfreeClientId}
                          onChange={(e) => setCashfreeClientId(e.target.value)}
                        />
                      </div>

                      <div className="mb-3">
                        <label
                          htmlFor="cashfreeClientSecret"
                          className="form-label"
                        >
                          Cashfree Client Secret
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="cashfreeClientSecret"
                          placeholder={"Cashfree Client Secret"}
                          value={cashfreeClientSecret}
                          onChange={(e) =>
                            setCashfreeClientSecret(e.target.value)
                          }
                        />
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              <div className="col-12">
                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        {/* Left: Title */}
                        <div className="d-flex align-items-center gap-3">
                          <h5 className="card-title mb-0">
                            Paypal Android Switch (enable/disable for payment in
                            app)
                          </h5>
                        </div>

                        {/* Right: Switch + Tooltip */}
                        <div className="d-flex align-items-center gap-3">
                          {/* Switch */}
                          {canEdit && (
                            <label className="switch mb-0">
                              <input
                                type="checkbox"
                                checked={paypalAndroidEnabled}
                                onChange={() =>
                                  handlePaymentSwitch("paypalAndroidEnabled")
                                }
                                onClick={handlePreventToggle}
                              />
                              <span className="slider">
                                <p
                                  style={{
                                    fontSize: 12,
                                    marginLeft: paypalAndroidEnabled
                                      ? "7px"
                                      : "35px",
                                    color: paypalAndroidEnabled
                                      ? "#fff"
                                      : "#000",
                                    marginTop: "6px",
                                  }}
                                ></p>
                              </span>
                            </label>
                          )}

                          {/* Tooltip */}
                          <InfoTooltip
                            title="Paypal Configuration Info"
                            content={[
                              {
                                label: "Paypal Switch",
                                description:
                                  "Enable or disable Paypal payment gateway for Android in-app payments.",
                              },
                              {
                                label: "Client ID",
                                description:
                                  "Used to identify your Paypal app during transactions.",
                              },
                              {
                                label: "Client Secret",
                                description:
                                  "Used for secure authentication with Paypal APIs.",
                              },
                              {
                                label: "Important",
                                description:
                                  "At least one payment gateway must remain enabled.",
                              },
                            ]}
                          />
                        </div>
                      </div>
                    </div>

                    <form>
                      <div className="mb-3">
                        <label htmlFor="paypalClientId" className="form-label">
                          Paypal Client ID
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="paypalClientId"
                          placeholder={"Enter Paypal Client ID"}
                          value={paypalClientId}
                          onChange={(e) => setPaypalClientId(e.target.value)}
                        />
                      </div>

                      <div className="mb-3">
                        <label htmlFor="paypalSecretKey" className="form-label">
                          Paypal Client Secret
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="paypalSecretKey"
                          placeholder={"Enter Paypal Client Secret"}
                          value={paypalSecretKey}
                          onChange={(e) =>
                            setPaypalClientSecret(e.target.value)
                          }
                        />
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              <div className="col-12">
                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        {/* Left: Title */}
                        <div className="d-flex align-items-center gap-3">
                          <h5 className="card-title mb-0">
                            Razor Pay Android Switch (enable/disable for payment
                            in app)
                          </h5>
                        </div>

                        {/* Right: Switch + Tooltip */}
                        <div className="d-flex align-items-center gap-3">
                          {/* Switch */}
                          {canEdit && (
                            <label className="switch mb-0">
                              <input
                                type="checkbox"
                                checked={razorPayAndroidEnabled}
                                onChange={() =>
                                  handlePaymentSwitch("razorPayAndroidEnabled")
                                }
                                onClick={handlePreventToggle}
                              />
                              <span className="slider">
                                <p
                                  style={{
                                    fontSize: 12,
                                    marginLeft: razorPayAndroidEnabled
                                      ? "7px"
                                      : "35px",
                                    color: razorPayAndroidEnabled
                                      ? "#fff"
                                      : "#000",
                                    marginTop: "6px",
                                  }}
                                ></p>
                              </span>
                            </label>
                          )}

                          {/* Tooltip */}
                          <InfoTooltip
                            title="Razorpay Configuration Info"
                            content={[
                              {
                                label: "Razorpay Switch",
                                description:
                                  "Enable or disable Razorpay payment gateway for Android in-app payments.",
                              },
                              {
                                label: "Razorpay ID",
                                description:
                                  "Used to identify your Razorpay account during transactions.",
                              },
                              {
                                label: "Secret Key",
                                description:
                                  "Used for secure authentication with Razorpay APIs.",
                              },
                              {
                                label: "Important",
                                description:
                                  "At least one payment gateway must remain enabled.",
                              },
                            ]}
                          />
                        </div>
                      </div>
                    </div>

                    <form>
                      <div className="mb-3">
                        <label htmlFor="razorPayId" className="form-label">
                          Razor Pay ID
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="razorPayId"
                          placeholder={"Enter Razor Pay ID"}
                          value={razorPayId}
                          onChange={(e) => setRazorpayId(e.target.value)}
                        />
                      </div>

                      <div className="mb-3">
                        <label htmlFor="razorSecretKey" className="form-label">
                          Razor Secret Key
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="razorSecretKey"
                          placeholder={"Enter Razor Secret Key"}
                          value={razorSecretKey}
                          onChange={(e) => setRazorpaySecret(e.target.value)}
                        />
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              <div className="col-12">
                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        {/* Left: Title */}
                        <div className="d-flex align-items-center gap-3">
                          <h5 className="card-title mb-0">
                            Flutterwave Android Switch (enable/disable for
                            payment in app)
                          </h5>
                        </div>

                        {/* Right: Switch + Tooltip */}
                        <div className="d-flex align-items-center gap-3">
                          {/* Switch */}
                          {canEdit && (
                            <label className="switch mb-0">
                              <input
                                type="checkbox"
                                checked={isFlutterwaveEnabled}
                                onChange={() =>
                                  handlePaymentSwitch("isFlutterwaveEnabled")
                                }
                                onClick={handlePreventToggle}
                              />
                              <span className="slider">
                                <p
                                  style={{
                                    fontSize: 12,
                                    marginLeft: isFlutterwaveEnabled
                                      ? "7px"
                                      : "35px",
                                    color: isFlutterwaveEnabled
                                      ? "#fff"
                                      : "#000",
                                    marginTop: "6px",
                                  }}
                                ></p>
                              </span>
                            </label>
                          )}

                          {/* Tooltip */}
                          <InfoTooltip
                            title="Flutterwave Configuration Info"
                            content={[
                              {
                                label: "Flutterwave Switch",
                                description:
                                  "Enable or disable Flutterwave payment gateway for Android in-app payments.",
                              },
                              {
                                label: "Flutterwave ID",
                                description:
                                  "Used to identify your Flutterwave account during transactions.",
                              },
                              {
                                label: "Important",
                                description:
                                  "At least one payment gateway must remain enabled.",
                              },
                            ]}
                          />
                        </div>
                      </div>
                    </div>

                    <form>
                      <div className="mb-3">
                        <label htmlFor="flutterWaveId" className="form-label">
                          Flutterwave ID
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="flutterWaveId"
                          placeholder={"Enter Flutterwave ID"}
                          value={flutterWaveId}
                          onChange={(e) => setFlutterWaveId(e.target.value)}
                        />
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              <div className="col-12">
                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        {/* Left: Title */}
                        <div className="d-flex align-items-center gap-3">
                          <h5 className="card-title mb-0">
                            Google Play Switch (enable/disable for payment in
                            app)
                          </h5>
                        </div>

                        {/* Right: Switch + Tooltip */}
                        <div className="d-flex align-items-center gap-3">
                          {/* Switch */}
                          {canEdit && (
                            <label className="switch mb-0">
                              <input
                                type="checkbox"
                                checked={googlePlaySwitch}
                                onChange={() =>
                                  handlePaymentSwitch("googlePlaySwitch")
                                }
                                onClick={handlePreventToggle}
                              />
                              <span className="slider">
                                <p
                                  style={{
                                    fontSize: 12,
                                    marginLeft: googlePlaySwitch
                                      ? "7px"
                                      : "35px",
                                    color: googlePlaySwitch ? "#fff" : "#000",
                                    marginTop: "6px",
                                  }}
                                ></p>
                              </span>
                            </label>
                          )}

                          {/* Tooltip */}
                          <InfoTooltip
                            title="Paystack Configuration Info"
                            content={[
                              {
                                label: "Google Play Switch",
                                description:
                                  "Enable or disable Google Play billing for Android in-app purchases.",
                              },
                            ]}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {canEdit && (
                <div className="d-flex justify-content-end">
                  <button
                    type="button"
                    className="edit-btn"
                    onClick={handleSubmit}
                  >
                    Submit
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Game Setting  */}
        {type === "gameSetting" && (
          <div className="col-md-12">
            {/* <h3 className="mb-3 text-white">Game Setting</h3> */}
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <form>
                    <div className="row d-flex justify-content-between">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <p>Game Diamonds Setting (coin options in game)</p>
                        <InfoTooltip
                          title="Game Coin Configuration"
                          content={[
                            {
                              label: "Bet 1 - Bet 5",
                              description:
                                "These values define the selectable diamond amounts users can bet inside the game.",
                            },
                            {
                              label: "Minimum Value",
                              description:
                                "All bet values must be greater than or equal to 0.",
                            },
                            {
                              label: "Game Balance",
                              description:
                                "These settings directly affect in-game economy and user betting options.",
                            },
                            {
                              label: "Important",
                              description:
                                "Incorrect configuration may impact gameplay balance and reward distribution.",
                            },
                          ]}
                        />
                      </div>
                      <div className="col-md-2">
                        {" "}
                        <div className="mb-3">
                          <label htmlFor="callCharge" className="form-label">
                            Bet 1
                          </label>
                          <input
                            min="0"
                            type="number"
                            className="form-control"
                            id="callCharge"
                            placeholder={"Enter Coin"}
                            value={gameCoin1}
                            onChange={(e) =>
                              setGameCoin1(parseInt(e.target.value))
                            }
                          />
                        </div>
                      </div>
                      <div className="col-md-2">
                        {" "}
                        <div className="mb-3">
                          <label htmlFor="callCharge" className="form-label">
                            Bet 2
                          </label>
                          <input
                            type="number"
                            min="0"
                            className="form-control"
                            id="callCharge"
                            placeholder={"Enter Coin"}
                            value={gameCoin2}
                            onChange={(e) =>
                              setGameCoin2(parseInt(e.target.value))
                            }
                          />
                        </div>
                      </div>
                      <div className="col-md-2">
                        {" "}
                        <div className="mb-3">
                          <label htmlFor="callCharge" className="form-label">
                            Bet 3
                          </label>
                          <input
                            min="0"
                            type="number"
                            className="form-control"
                            id="callCharge"
                            placeholder={"Enter Coin"}
                            value={gameCoin3}
                            onChange={(e) =>
                              setGameCoin3(parseInt(e.target.value))
                            }
                          />
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div className="mb-3">
                          <label htmlFor="callCharge" className="form-label">
                            Bet 4
                          </label>
                          <input
                            min="0"
                            type="number"
                            className="form-control"
                            id="callCharge"
                            placeholder={"Enter Coin"}
                            value={gameCoin4}
                            onChange={(e) =>
                              setGameCoin4(parseInt(e.target.value))
                            }
                          />
                        </div>
                      </div>
                      <div className="col-md-2">
                        {" "}
                        <div className="mb-3">
                          <label htmlFor="callCharge" className="form-label">
                            Bet 5
                          </label>
                          <input
                            min="0"
                            type="number"
                            className="form-control"
                            id="callCharge"
                            placeholder={"Enter Coin"}
                            value={gameCoin5}
                            onChange={(e) =>
                              setGameCoin5(parseInt(e.target.value))
                            }
                          />
                        </div>
                      </div>
                      {errors.gameCoin1 && (
                        <div className="ml-2 mt-1">
                          {errors.gameCoin1 && (
                            <div className="pl-1 text__left">
                              <span className="text-red">
                                {errors.gameCoin1}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {errors.gameCoin2 && (
                        <div className="ml-2 mt-1">
                          {errors.gameCoin2 && (
                            <div className="pl-1 text__left">
                              <span className="text-red">
                                {errors.gameCoin2}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                      {errors.gameCoin3 && (
                        <div className="ml-2 mt-1">
                          {errors.gameCoin3 && (
                            <div className="pl-1 text__left">
                              <span className="text-red">
                                {errors.gameCoin3}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                      {errors.gameCoin4 && (
                        <div className="ml-2 mt-1">
                          {errors.gameCoin4 && (
                            <div className="pl-1 text__left">
                              <span className="text-red">
                                {errors.gameCoin4}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                      {errors.gameCoin5 && (
                        <div className="ml-2 mt-1">
                          {errors.gameCoin5 && (
                            <div className="pl-1 text__left">
                              <span className="text-red">
                                {errors.gameCoin5}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {canEdit && (
                      <div className="d-flex justify-content-end">
                        <button
                          type="button"
                          className="edit-btn"
                          onClick={handleSubmit}
                          style={{
                            marginTop: "92px",
                          }}
                        >
                          Submit
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="row">
          {/* Firebase setting  */}
          {type === "firebaseSetting" && (
            <div className="col-md-12">
              {/* <h3 className="mb-3 text-white">Firebase Notification Setting</h3> */}
              <div className="row">
                <div className=" col-12">
                  <div className="card">
                    <div className="card-body">
                      <form>
                        <div className="">
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <label className="form-label" htmlFor="privateKey">
                              Private Key JSON ( use for firebase push
                              notification)
                            </label>
                            <InfoTooltip
                              title="Firebase Configuration Info"
                              content={[
                                {
                                  label: "Private Key JSON",
                                  description:
                                    "Upload the Firebase service account JSON file used to send push notifications from the backend.",
                                },
                                {
                                  label: "Valid JSON Required",
                                  description:
                                    "The input must be valid JSON format. Invalid JSON will cause notification services to fail.",
                                },
                                {
                                  label: "Security Notice",
                                  description:
                                    "This contains sensitive credentials. Do not expose it publicly or store it in frontend code.",
                                },
                                {
                                  label: "Important",
                                  description:
                                    "Incorrect configuration may stop push notifications from working.",
                                },
                              ]}
                            />
                          </div>
                          <textarea
                            name=""
                            className="form-control mt-2"
                            id="privateKey"
                            rows={10}
                            value={privateKey}
                            placeholder={`Enter firebaseKey`}
                            onChange={(e) => {
                              const newValue = e.target.value;
                              try {
                                const newData = JSON.parse(newValue);
                                setPrivateKey(newValue);
                                setError("");
                              } catch (error) {
                                // Handle invalid JSON input
                                console.error("Invalid JSON input:", error);
                                setPrivateKey(newValue);
                                return setError({
                                  ...error,
                                  privateKey: "Invalid JSON input",
                                });
                              }
                            }}
                          ></textarea>

                          {errors.privateKey && (
                            <div className="ml-2 mt-1">
                              {errors.privateKey && (
                                <div className="pl-1 text__left">
                                  <span className="text-red">
                                    {errors.privateKey}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </form>
                      {canEdit && (
                        <div className="d-flex justify-content-end mt-3">
                          <button
                            type="button"
                            className="edit-btn"
                            onClick={handleSubmit}
                          >
                            Submit
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Currency Setting  */}
          {type === "currencySetting" && (
            <div className="col-md-12">
              <Currency />
            </div>
          )}

          {/* Other Setting  */}
          {type === "otherSetting" && (
            <div className="col-md-12 col-12">
              <div className="card">
                <div className="card-body">
                  <form className="row">
                    {/* <div className="col-6 mb-2">
                      <label htmlFor="key" className="form-label">
                        PK-End Time (max time in seconds)
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder={"Enter PK-End Time"}
                        id="key"
                        value={pkEndTime}
                        onChange={(e) => setPkEndTime(e.target.value)}
                      />
                      {errors.pkEndTime && (
                        <div className="ml-2 mt-1">
                          {errors.pkEndTime && (
                            <div className="pl-1 text__left">
                              <span className="text-red">
                                {errors.pkEndTime}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div> */}

                    <div className="col-6 mb-2">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <label htmlFor="vipDiamond" className="form-label">
                          Vip Diamond Bonus
                        </label>
                        <InfoTooltip
                          title="PK & Commission Configuration"
                          content={[
                            {
                              label: "PK-End Time",
                              description:
                                "Maximum duration of PK battle in seconds. Example: 60 seconds.",
                            },
                            {
                              label: "VIP Diamond Bonus",
                              description:
                                "Extra diamond bonus awarded to VIP users.",
                            },
                            {
                              label: "Call Receiver Ratio (%)",
                              description:
                                "Percentage earning given to call receiver during call sessions.",
                            },
                            {
                              label: "Agency Commission (%)",
                              description:
                                "Commission percentage allocated to agency.",
                            },
                            {
                              label: "Location API Key",
                              description:
                                "External API key used for location services integration.",
                            },
                            {
                              label: "Email (Resend API Key)",
                              description:
                                "API key used for transactional email service configuration.",
                            },
                            {
                              label: "Important",
                              description:
                                "Changing these values will directly affect app revenue calculations and PK behavior.",
                            },
                          ]}
                        />
                      </div>
                      <input
                        type="number"
                        className="form-control"
                        id="vipDiamond"
                        min="0"
                        placeholder={"EnterVip Diamond Bonus"}
                        value={vipDiamond}
                        onChange={(e) =>
                          setVipDiamond(parseInt(e.target.value))
                        }
                      />
                      {errors.vipDiamond && (
                        <div className="ml-2 mt-1">
                          {errors.vipDiamond && (
                            <div className="pl-1 text__left">
                              <span className="text-red">
                                {errors.vipDiamond}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="col-6">
                      <label htmlFor="vipDiamond" className="form-label">
                        Call Receiver Ratio (%)
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="vipDiamond"
                        min="0"
                        placeholder={"Enter Call Receiver Ration"}
                        value={callReceiverPercent}
                        onChange={(e) =>
                          setCallReceiverPercent(parseInt(e.target.value))
                        }
                      />
                      {errors.callReceiverPercent && (
                        <div className="ml-2 mt-1">
                          {errors.callReceiverPercent && (
                            <div className="pl-1 text__left">
                              <span className="text-red">
                                {errors.callReceiverPercent}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="col-6">
                      <label htmlFor="vipDiamond" className="form-label">
                        Agency Commission (%)
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="vipDiamond"
                        min="0"
                        placeholder={"Enter Agency Commission"}
                        value={agencyCommission}
                        onChange={(e) =>
                          setAgencyCommission(parseInt(e.target.value))
                        }
                      />
                      {errors.agencyCommission && (
                        <div className="ml-2 mt-1">
                          {errors.agencyCommission && (
                            <div className="pl-1 text__left">
                              <span className="text-red">
                                {errors.agencyCommission}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="col-6">
                      <label htmlFor="vipDiamond" className="form-label mt-2">
                        Location API Key
                      </label>

                      <div style={{ position: "relative" }}>
                        <input
                          type="text"
                          className="form-control pr-5"
                          id="vipDiamond"
                          min="0"
                          placeholder={"Enter Location API Key"}
                          value={locationApiKey}
                          onChange={(e) => setLocationApiKey(e.target.value)}
                        />

                        {/* <Tooltip title={tooltipText} arrow> */}
                        <div
                          style={{
                            position: "absolute",
                            right: "0px",
                            top: "50%",
                            transform: "translateY(-50%)",
                          }}
                        >
                          <IconButton
                            onClick={handleCopy}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            style={{
                              padding: 0,
                              color: "blue",
                            }}
                          >
                            {locationApiKey ? (
                              <ContentCopyIcon fontSize="small" />
                            ) : (
                              <CloseIcon />
                            )}
                          </IconButton>
                          <IconButton
                            onClick={() => {
                              if (locationApiKey) {
                                const url = locationApiKey.startsWith("http")
                                  ? locationApiKey
                                  : `https://${locationApiKey}`;
                                window.open(url, "_blank");
                              }
                            }}
                            style={{
                              marginLeft: "2px",
                              marginRight: "5px",
                            }}
                          >
                            <OpenInNewIcon fontSize="small" />
                          </IconButton>
                        </div>

                        {/* </Tooltip> */}
                      </div>

                      {errors.locationApiKey && (
                        <div className="ml-2 mt-1">
                          <div className="pl-1 text__left">
                            <span className="text-red">
                              {errors.locationApiKey}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="col-6 mt-2">
                      <label htmlFor="vipDiamond" className="form-label">
                        Email Setting
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="vipDiamond"
                        placeholder={`Enter here resend API key`}
                        min="0"
                        value={resendApiKey}
                        onChange={(e) => setResendApiKey(e.target.value)}
                      />
                      {errors.resendApiKey && (
                        <div className="ml-2 mt-1">
                          {errors.resendApiKey && (
                            <div className="pl-1 text__left">
                              <span className="text-red">
                                {errors.resendApiKey}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {canEdit && (
                      <div className="d-flex justify-content-end ">
                        <button
                          type="button"
                          className="edit-btn"
                          onClick={handleSubmit}
                          style={{
                            marginTop: "10px",
                          }}
                        >
                          Submit
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              </div>

              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="card-title mb-0">
                      Banner Announcement Setting
                    </h5>
                    <InfoTooltip
                      title="Banner Announcement Configuration"
                      content={[
                        {
                          label: "Minimum Gift Announcement Coin",
                          description:
                            "When a user sends gifts equal to or above this coin value, a banner announcement will be displayed.",
                        },
                        {
                          label: "Minimum Game Announcement Coin",
                          description:
                            "When a user wins or earns coins in games equal to or above this value, a banner will be triggered.",
                        },
                        {
                          label: "Important",
                          description:
                            "Higher values reduce announcement frequency. Lower values increase visibility in the app.",
                        },
                      ]}
                    />
                  </div>

                  <form>
                    <div className="row mb-3">
                      <div className="col-6">
                        <label htmlFor="giftcoin" className="form-label">
                          Minimum Gift Announcement Coin
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="giftAnnouncementCoin"
                          placeholder={`Enter here minimun gift announcement coin`}
                          min="0"
                          value={giftAnnouncementCoin}
                          onChange={(e) =>
                            setGiftAnnouncementCoin(e.target.value)
                          }
                        />
                        {errors.giftAnnouncementCoin && (
                          <div className="ml-2 mt-1">
                            {errors.giftAnnouncementCoin && (
                              <div className="pl-1 text__left">
                                <span className="text-red">
                                  {errors.giftAnnouncementCoin}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="col-6">
                        <label htmlFor="giftanncoin" className="form-label">
                          Minimum Game Announcement Coin
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="gameAnnouncementCoin"
                          placeholder={`Enter here minimun game announcement coin`}
                          min="0"
                          value={gameAnnouncementCoin}
                          onChange={(e) =>
                            setGameAnnouncementCoin(e.target.value)
                          }
                        />
                        {errors.gameAnnouncementCoin && (
                          <div className="ml-2 mt-1">
                            {errors.gameAnnouncementCoin && (
                              <div className="pl-1 text__left">
                                <span className="text-red">
                                  {errors.gameAnnouncementCoin}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </form>
                  {canEdit && (
                    <div className="d-flex justify-content-end">
                      <button
                        type="button"
                        className="edit-btn"
                        onClick={handleSubmit}
                      >
                        Submit
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showLicenseDialog && (
        <LicenseDialog
          open={showLicenseDialog}
          onClose={() => setShowLicenseDialog(false)}
        />
      )}
    </>
  );
};

export default connect(null, { getSetting, updateSetting, handleSwitch })(
  Setting,
);
