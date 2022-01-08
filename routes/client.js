const express = require("express");
const Client = require("../models/client");

const clientController = require("../controllers/clientControllers");
const validations = require("../validations/inputValidate");

const router = express.Router();

router.post(
  "/register",
  [
    validations.validateName,
    validations.validatePhoneNumber.custom(async (value, { req }) => {
      if (req.url === "/register") {
        const registeredClient = await Client.findOne({ phoneNumber: value });
        if (registeredClient) {
          throw new Error("هذا الرقم مسجل من قبل");
        }
      }
    }),
    validations.validateWeight,
    validations.validateHeight,
    validations.validateAge,
  ],
  clientController.postRegisterClient
);

module.exports = router;
