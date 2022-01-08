const express = require("express");
const { body } = require("express-validator");
const Client = require("../models/client");
const adminController = require("../controllers/adminController");
const isAuth = require("../validations/adminAuth");
const validations = require("../validations/inputValidate");

const router = express.Router();

router.get("/admin/dashboard", isAuth, adminController.getAdminDashboard);

router.get(
  "/admin/add/subscriper",
  isAuth,
  adminController.getAddNewSubscriper
);

router.post(
  "/add/new/subscriper",
  isAuth,
  [
    validations.validatePhoneNumber.custom(async (value, { req }) => {
      const registeredClient = await Client.findOne({ phoneNumber: value });
      if (registeredClient) {
        throw new Error("رقم التليفون تم ادخاله من قبل");
      }
    }),
    body("subscriperId").custom(async (value, { req }) => {
      const existingSubId = await Client.findOne({ subscriperId: value });
      if (existingSubId) {
        throw new Error("رقم العضويه تم ادخاله من قبل");
      }
    }),
  ],
  adminController.postAddSubscriper
);

router.get(
  "/process/client/request/:clientId",
  isAuth,
  adminController.getClientData
);

router.post(
  "/client/subscription",
  isAuth,
  [
    body("subscriperId").custom(async (value, { req }) => {
      const existingSubId = await Client.findOne({ subscriperId: value });
      if (existingSubId) {
        throw new Error("رقم العضويه تم ادخاله من قبل");
      }
    }),
    validations.validateSDate,
    validations.validateEDate,
    validations.validatePrice,
  ],
  adminController.postClientSubscription
);

router.get("/allClients/report", isAuth, adminController.getAllClientsReport);

router.post(
  "/allSubscripers/report",
  isAuth,
  adminController.postAllSubscripersReport
);

router.get("/clients/search", isAuth, adminController.getClientSearch);

router.post(
  "/find/subscriper",
  [
    validations.validatePhoneNumber.custom(async (value, { req }) => {
      if (req.url === "/find/subscriper") {
        const subscriper = await Client.findOne({ phoneNumber: value });
        if (!subscriper) {
          throw new Error("هذا الرقم غير موجود");
        }
      }
    }),
  ],
  isAuth,
  adminController.postFindSubscriper
);

router.get(
  "/find/subscriper/:clientId/:onTheFly",
  isAuth,
  adminController.postFindSubscriper
);

router.post("/edit/subscriper", isAuth, adminController.postEditSubscriper);

router.get("/clients/remove", isAuth, adminController.getClientsRemove);

router.post(
  "/search/subscriper/info",
  isAuth,
  adminController.postGetSubscriperInfo
);

router.post(
  "/admin/remove/subscriper",
  isAuth,
  adminController.postRemoveClient
);

router.get("/login", adminController.getLogin);

router.post("/admin/login", adminController.postAdminLogin);

router.get("/logout", adminController.getAdminLogout);

module.exports = router;
