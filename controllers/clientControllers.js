const { validationResult } = require("express-validator");
const Client = require("../models/client");

exports.postRegisterClient = async (req, res, next) => {
  const {
    name,
    phoneNumber,
    address,
    initialWeight,
    height,
    age,
    target,
    activity,
    activityDays,
    trainingPeriod,
    trainingIntensity,
    healthIssues,
    foodAllergic,
    favoriteDish,
    notFavoriteDish,
    snacks,
    nutritions,
    notices,
    meals,
    dailySnacks,
  } = req.body;
  const error = validationResult(req);
  if (!error.isEmpty() && error.array()[0].msg !== "Invalid value") {
    return res.status(422).render("home", {
      hasError: true,
      errorMessage: error.array()[0].msg,
      oldInputs: {
        name,
        phoneNumber,
        address,
        initialWeight,
        height,
        age,
        activity,
        trainingPeriod,
        healthIssues,
        favoriteDish,
        notFavoriteDish,
        snacks,
        nutritions,
        notices,
        meals,
        dailySnacks,
      },
    });
  }
  try {
    let newClient;
    const lastClient = await Client.findOne().sort({ _id: -1 }).limit(1);
    if (lastClient) {
      const currentSerial = lastClient.clientSerial;
      let nextSerial = currentSerial + 1;
      newClient = new Client({
        clientSerial: nextSerial,
        name,
        phoneNumber,
        address,
        initialWeight,
        height,
        age,
        target,
        activity,
        activityDays,
        trainingPeriod,
        trainingIntensity,
        healthIssues,
        foodAllergic,
        favoriteDish,
        notFavoriteDish,
        snacks,
        nutritions,
        notices,
        meals,
        dailySnacks,
      });
      await newClient.save();
    } else {
      newClient = new Client({
        name,
        phoneNumber,
        address,
        initialWeight,
        height,
        age,
        target,
        activity,
        activityDays,
        trainingPeriod,
        trainingIntensity,
        healthIssues,
        foodAllergic,
        favoriteDish,
        notFavoriteDish,
        snacks,
        nutritions,
        notices,
        meals,
        dailySnacks,
      });
      await newClient.save();
    }
    const io = require("../socket").getIo();
    io.emit("request_created", {
      message: `طلب جديد من العميل ${newClient.name}`,
    });
    res.render("client/success", { hasError: false });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    next(error);
  }
};
