const Setting = require("./setting.model");
const Config = require("../../config");
const BD = require("../bd/bd.model");
const Admin = require("../admin/admin.model");
const axios = require("axios");
const mongoose = require("mongoose");

const Joi = require("joi");

const sha256Regex = /^([A-F0-9]{2}:){31}[A-F0-9]{2}$/;
const androidAssetLinksSchema = Joi.array()
  .min(1)
  .max(5)
  .items(
    Joi.object({
      relation: Joi.array().items(Joi.string().valid("delegate_permission/common.handle_all_urls")).min(1).required(),

      target: Joi.object({
        namespace: Joi.string().valid("android_app").required(),

        package_name: Joi.string()
          .pattern(/^[a-zA-Z0-9_.]+$/)
          .required(),

        sha256_cert_fingerprints: Joi.array().min(1).max(10).items(Joi.string().uppercase().pattern(sha256Regex).required()).required(),
      })
        .required()
        .unknown(false),
    })
      .required()
      .unknown(false),
  )
  .required();

// get setting
exports.getSetting = async (req, res) => {
  try {
    const data = global.settingJSON ? global.settingJSON : null;

    return res.status(200).send({ status: true, message: "Success", setting: data });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ status: false, message: "Internal server error" || error });
  }
};

// update the setting data
exports.update = async (req, res) => {
  try {
    const setting = await Setting.findById(req.params.settingId);
    if (!setting) return res.status(200).json({ status: false, message: "Setting data does not Exist!" });

    if (req.body.rCoinForDiamond && req.body?.rCoinForDiamond !== "0") {
      //setting.rCoinForDiamond = Math.floor(req.body.rCoinForDiamond);
      setting.rCoinForDiamond = req.body.rCoinForDiamond;
    }

    setting.livekitApiKey = req.body?.livekitApiKey ? req.body?.livekitApiKey : setting.livekitApiKey;
    setting.livekitApiSecret = req.body?.livekitApiSecret ? req.body?.livekitApiSecret : setting.livekitApiSecret;
    setting.wsURL = req.body?.wsURL ? req.body?.wsURL : setting.wsURL;

    setting.referralBonus = req.body?.referralBonus ? Math.floor(req.body?.referralBonus) : setting.referralBonus;
    setting.referralCoinBonus = req.body?.referralCoinBonus ? Math.floor(req.body?.referralCoinBonus) : setting.referralCoinBonus;
    setting.agoraKey = req.body?.agoraKey ? req.body?.agoraKey : setting.agoraKey;
    setting.agoraCertificate = req.body.agoraCertificate ? req.body.agoraCertificate : setting.agoraCertificate;
    setting.maxSecondForVideo = req.body.maxSecondForVideo ? Math.floor(req.body.maxSecondForVideo) : setting.maxSecondForVideo;
    setting.privacyPolicyLink = req.body.privacyPolicyLink ? req.body.privacyPolicyLink : setting.privacyPolicyLink;
    setting.privacyPolicyText = req.body.privacyPolicyText ? req.body.privacyPolicyText : setting.privacyPolicyText;

    setting.termsAndConditionLink = req.body.termsAndConditionLink ? req.body.termsAndConditionLink : setting.termsAndConditionLink;
    setting.aboutUsLink = req.body.aboutUsLink ? req.body.aboutUsLink : setting.aboutUsLink;

    setting.chatCharge = req.body.chatCharge ? Math.floor(req.body.chatCharge) : setting.chatCharge;

    setting.maleCallCharge = req.body.maleCallCharge ? Math.floor(req.body.maleCallCharge) : setting.maleCallCharge;
    setting.femaleCallCharge = req.body.femaleCallCharge ? Math.floor(req.body.femaleCallCharge) : setting.femaleCallCharge;

    setting.audioCallChargeMale = req.body.audioCallChargeMale ? Math.floor(req.body.audioCallChargeMale) : setting.audioCallChargeMale;
    setting.audioCallChargeFemale = req.body.audioCallChargeFemale ? Math.floor(req.body.audioCallChargeFemale) : setting.audioCallChargeFemale;

    setting.googlePlayEmail = req.body.googlePlayEmail ? req.body.googlePlayEmail : setting.googlePlayEmail;
    setting.googlePlayKey = req.body.googlePlayKey ? req.body.googlePlayKey : setting.googlePlayKey;
    setting.stripePublishableKey = req.body.stripePublishableKey ? req.body.stripePublishableKey : setting.stripePublishableKey;
    setting.stripeSecretKey = req.body.stripeSecretKey ? req.body.stripeSecretKey : setting.stripeSecretKey;
    setting.resendApiKey = req.body.resendApiKey ? req.body.resendApiKey : setting.resendApiKey;
    setting.version = req.body.version ? req.body.version : setting.version;

    setting.currency = req.body.currency ? req.body.currency : setting.currency; // only currency
    //setting.diamond = req.body.diamond ? Math.floor(req.body.diamond) : setting.diamond;

    setting.minRcoinForCashOut = req.body.minRcoinForCaseOut ? req.body.minRcoinForCaseOut : setting.minRcoinForCashOut;
    setting.rCoinForCashOut = req.body?.rCoinForCaseOut ? req.body?.rCoinForCaseOut : setting.rCoinForCashOut;

    setting.vipDiamond = req.body.vipDiamond ? Math.floor(req.body.vipDiamond) : setting.vipDiamond;
    setting.paymentGateway = req.body.paymentGateway ? req.body.paymentGateway : setting.paymentGateway;
    setting.loginBonus = req.body.loginBonus ? Math.floor(req.body.loginBonus) : setting.loginBonus;
    setting.gameCoin = req.body.gameCoin ? req.body.gameCoin : setting.gameCoin;
    setting.gameRule = req.body.gameRule ? req.body.gameRule : setting.gameRule;
    setting.roulette_gameRule = req.body.roulette_gameRule ? req.body.roulette_gameRule : setting.roulette_gameRule;
    setting.liveDurationTime = req.body?.liveDurationTime ? parseInt(req.body?.liveDurationTime) : 0;
    setting.pkEndTime = req.body.pkEndTime ? req.body.pkEndTime : setting.pkEndTime;
    setting.privateKey = req.body.privateKey ? JSON.parse(req.body.privateKey.trim()) : setting.privateKey;

    setting.locationApiKey = req.body.locationApiKey ? req.body.locationApiKey : setting.locationApiKey;
    setting.callReceiverPercent = req.body.callReceiverPercent ? req.body.callReceiverPercent : setting.callReceiverPercent;

    setting.agencyCommission = req.body.agencyCommission ? req.body.agencyCommission : setting.agencyCommission;
    setting.minRcoinForCashOutAgency = req.body?.minRcoinForCashOutAgency ? parseInt(req.body?.minRcoinForCashOutAgency) : setting.minRcoinForCashOutAgency;

    setting.femaleRandomCallRate = req.body?.femaleRandomCallRate ? parseInt(req.body?.femaleRandomCallRate) : setting.femaleRandomCallRate;
    setting.maleRandomCallRate = req.body?.maleRandomCallRate ? parseInt(req.body?.maleRandomCallRate) : setting.maleRandomCallRate;
    setting.bothRandomCallRate = req.body?.bothRandomCallRate ? parseInt(req.body?.bothRandomCallRate) : setting.bothRandomCallRate;

    setting.coinForGameAnnouncement = req.body?.coinForGameAnnouncement ? parseInt(req.body?.coinForGameAnnouncement) : setting.coinForGameAnnouncement;
    setting.coinForAllRoomAnnouncement = req.body?.coinForAllRoomAnnouncement ? parseInt(req.body?.coinForAllRoomAnnouncement) : setting.coinForAllRoomAnnouncement;

    setting.minRcoinForCashOutBd = req.body?.minRcoinForCashOutBd ? parseInt(req.body?.minRcoinForCashOutBd) : setting.minRcoinForCashOutBd;

    if ("androidAppVersion" in req.body) {
      setting.androidAppVersion = req.body.androidAppVersion.trim();
    }
    if ("androidAppLink" in req.body) {
      setting.androidAppLink = req.body.androidAppLink.trim();
    }

    setting.cashfreeClientId = req.body.cashfreeClientId?.trim() ?? setting?.cashfreeClientId;
    setting.cashfreeClientSecret = req.body.cashfreeClientSecret?.trim() ?? setting?.cashfreeClientSecret;

    setting.paystackPublicKey = req.body.paystackPublicKey?.trim() ?? setting?.paystackPublicKey;
    setting.paystackSecretKey = req.body.paystackSecretKey?.trim() ?? setting?.paystackSecretKey;

    setting.paypalClientId = req.body.paypalClientId?.trim() ?? setting?.paypalClientId;
    setting.paypalSecretKey = req.body.paypalSecretKey?.trim() ?? setting?.paypalSecretKey;

    setting.razorPayId = req.body.razorPayId?.trim() ?? setting?.razorPayId;
    setting.razorSecretKey = req.body.razorSecretKey?.trim() ?? setting?.razorSecretKey;

    setting.flutterWaveId = req.body.flutterWaveId?.trim() ?? setting?.flutterWaveId;

    if (req.body.bdCommission) {
      setting.bdCommission = req.body.bdCommission;
      await BD.updateMany({ bdCommission: { $lt: req.body.bdCommission } }, { bdCommission: req.body.bdCommission })
    }

    if (req.body.androidAssetLinks !== undefined) {
      let parsedAndroidAssetLinks = req.body.androidAssetLinks;

      if (typeof parsedAndroidAssetLinks === "string") {
        try {
          parsedAndroidAssetLinks = JSON.parse(parsedAndroidAssetLinks.trim());
        } catch (err) {
          return res.status(200).json({
            status: false,
            message: "androidAssetLinks must be valid JSON",
          });
        }
      }

      const { error, value } = androidAssetLinksSchema.validate(parsedAndroidAssetLinks, {
        abortEarly: true,
      });

      if (error) {
        return res.status(200).json({
          status: false,
          message: error.details[0].message,
        });
      }

      setting.androidAssetLinks = Object.freeze(value);
    }

    await setting.save();

    updateSettingFile(setting);

    return res.status(200).json({ status: true, message: "Success!!", setting });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: error.message || "Server Error" });
  }
};

// handle setting switch
exports.handleSwitch = async (req, res) => {
  try {
    if (!req.params.settingId || !req.query.type) {
      return res.status(200).json({ status: false, message: "Oops ! Invalid details!" });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.settingId)) {
      return res.status(200).json({ status: false, message: "Invalid settingId!" });
    }

    const setting = await Setting.findById(req.params.settingId);
    if (!setting) return res.status(200).json({ status: false, message: "Setting data does not Exist!" });

    const key = req.query.type.trim();

    const PAYMENT_TYPES = [
      "googlePlaySwitch",
      "stripeSwitch",
      "paystackAndroidEnabled",
      "cashfreeAndroidEnabled",
      "paypalAndroidEnabled",
      "razorPayAndroidEnabled",
      "isFlutterwaveEnabled",
    ];

    const ALLOWED_KEYS = [...PAYMENT_TYPES, "isAppActive", "isFake"];

    if (!ALLOWED_KEYS.includes(key)) {
      return res.status(200).json({ status: false, message: "type passed must be valid." });
    }

    setting[key] = !setting[key];
    await setting.save();

    updateSettingFile(setting);

    return res.status(200).json({ status: true, message: "Success", setting });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: error.message || "Server Error" });
  }
};

// add game
exports.addGame = async (req, res) => {
  try {
    const setting = await Setting.findById(req.params.settingId);
    if (!setting) return res.status(200).json({ status: false, message: "Setting data does not Exist!" });

    if (!req.body.name || !req.file || !req.body.link) {
      return res.status(200).json({ status: false, message: "Invalid Details" });
    }

    const isGameExists = setting.game.some((game) => game.name.toLowerCase() === req.body.name.toLowerCase());
    if (isGameExists) {
      return res.status(200).json({
        status: false,
        message: "Game with the same name already exists!",
      });
    }

    setting.game.push({
      name: req.body.name,
      image: Config.baseURL + req.file.path,
      link: req.body.link,
      minWinPercent: req.body.minWinPercent,
      maxWinPercent: req.body.maxWinPercent,
    });
    await setting.save();

    updateSettingFile(setting);

    return res.status(200).json({ status: true, message: "Success!!", setting });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: error.message || "Server Error" });
  }
};

// delete game
exports.deleteGame = async (req, res) => {
  try {
    const setting = await Setting.findById(req.params.settingId);
    if (!setting) return res.status(200).json({ status: false, message: "Setting data does not Exist!" });

    if (!req.query.gameId) {
      return res.status(200).json({ status: false, message: "Invalid Details !!" });
    }

    const index = setting.game.findIndex((item) => item._id.toString() === req.query.gameId);
    if (index !== -1) setting.game.splice(index, 1);
    await setting.save();

    updateSettingFile(setting);

    return res.status(200).json({ status: true, message: "Success!!", setting });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: error.message || "Server Error" });
  }
};

// update game
exports.updateGame = async (req, res) => {
  try {
    const setting = await Setting.findById(req.params.settingId);
    if (!setting) return res.status(200).json({ status: false, message: "Setting data does not Exist!" });

    if (!req.body.gameId) {
      return res.status(200).json({ status: false, message: "Invalid Details !!" });
    }

    const index = setting.game.findIndex((item) => item._id.toString() === req.body.gameId);
    if (index !== -1) {
      setting.game[index].name = req.body.name || setting.game[index].name;
      setting.game[index].image = req.file ? Config.baseURL + req.file.path : setting.game[index].image;
      setting.game[index].link = req.body.link ? req.body.link : setting.game[index].link;
      setting.game[index].minWinPercent = req.body.minWinPercent || setting.game[index].minWinPercent;
      setting.game[index].maxWinPercent = req.body.maxWinPercent || setting.game[index].maxWinPercent;
      await setting.save();
    }

    updateSettingFile(setting);

    return res.status(200).json({ status: true, message: "Success!!", setting });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: error.message || "Server Error" });
  }
};

// update game
exports.updateGameStatus = async (req, res) => {
  try {
    // req.params.gameId
    const setting = await Setting.findOne({
      "game._id": req.params.gameId,
    });
    if (!setting) return res.status(200).json({ status: false, message: "Game does not Exist!" });

    if (!req.params.gameId) {
      return res.status(200).json({ status: false, message: "Invalid Details !!" });
    }

    const index = setting.game.findIndex((item) => item._id.toString() === req.params.gameId);
    if (index !== -1) {
      setting.game[index].isActive = !setting.game[index].isActive;
      await setting.save();
    }

    updateSettingFile(setting);

    return res.status(200).json({ status: true, message: "Success!!", setting });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: error.message || "Server Error" });
  }
};

// get game
exports.getGameSetting = async (req, res) => {
  try {
    const data = global.settingJSON && global.settingJSON.game ? global.settingJSON.game : null;

    return res.status(200).send({
      status: true,
      message: "Success",
      game: data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: false,
      message: error?.message || "Internal server error",
    });
  }
};
