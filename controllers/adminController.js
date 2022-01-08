const { validationResult } = require("express-validator");
const Admin = require("../models/admin");
const Client = require("../models/client");
const Subscription = require("../models/subscription");
const utilities = require("../utilities/utils");
const bcrypt = require("bcryptjs");

exports.getAdminDashboard = async (req, res, next) => {
  try {
    const clientRequests = await Client.find({ subscriped: false });
    res.status(200).render("admin/dashBoard", { requests: clientRequests });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    next(error);
  }
};

exports.getAddNewSubscriper = (req, res, next) => {
  try {
    res.status(200).render("admin/addSubscriper", { hasError: false });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    next(error);
  }
};

exports.postAddSubscriper = async (req, res, next) => {
  const {
    name,
    phoneNumber,
    subscriperId,
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
    subscriptionPeriod,
    startDate,
    endDate,
    fridaysCount,
    numberOfMeals,
    numberOfSnacks,
    carbohydrates,
    protine,
    notes,
    subscriptionPrice,
  } = req.body;
  const error = validationResult(req);
  if (!error.isEmpty() && error.array()[0].msg !== "Invalid value") {
    return res.status(422).render("admin/addSubscriper", {
      hasError: true,
      errorMessage: error.array()[0].msg,
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
        subscriperId,
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
    } else {
      newClient = new Client({
        name,
        phoneNumber,
        subscriperId,
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
    }
    const client = await newClient.save();
    const clientId = client._id;
    const fullEndDate = utilities.fullDay(endDate);
    let numberOfFridays = 0;
    let isNotFridays;
    if (fridaysCount === "on") {
      isNotFridays = true;
      numberOfFridays = utilities.fridayCounter(startDate, endDate);
    }
    const subscripe = new Subscription({
      subscriptionPeriod,
      startDate,
      endDate: fullEndDate,
      numberOfMeals,
      numberOfSnacks,
      carbohydrates,
      protine,
      fridaysCount: isNotFridays ? false : true,
      fridays: numberOfFridays,
      notes,
      subscriptionPrice,
      clientId,
    });
    await subscripe.save();
    newClient.subscriped = true;
    await newClient.save();
    res.status(201).redirect("/admin/dashboard");
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    next(error);
  }
};

exports.getClientData = async (req, res, next) => {
  try {
    const clientId = req.params.clientId;
    const clientData = await Client.findById(clientId);
    res.status(200).render("admin/subscription", {
      hasError: false,
      clientData: clientData,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    next(error);
  }
};

exports.postClientSubscription = async (req, res, next) => {
  const {
    clientId,
    subscriperId,
    subscriptionPeriod,
    startDate,
    endDate,
    numberOfMeals,
    numberOfSnacks,
    carbohydrates,
    protine,
    fridaysCount,
    notes,
    subscriptionPrice,
  } = req.body;
  const client = await Client.findById(clientId);
  const error = validationResult(req);
  if (!error.isEmpty() && error.array()[0].msg !== "Invalid value") {
    return res.status(422).render("admin/subscription", {
      hasError: true,
      errorMessage: error.array()[0].msg,
      oldInputs: {
        clientData: client,
        subscriperId,
        subscriptionPeriod,
        numberOfMeals,
        numberOfSnacks,
        carbohydrates,
        protine,
        notes,
        subscriptionPrice,
        subscriptionPrice,
      },
    });
  }
  try {
    const fullEndDate = utilities.fullDay(endDate);
    let numberOfFridays = 0;
    let isNotFridays;
    if (fridaysCount === "on") {
      isNotFridays = true;
      numberOfFridays = utilities.fridayCounter(startDate, endDate);
    }
    const subscripe = new Subscription({
      subscriptionPeriod,
      startDate,
      endDate: fullEndDate,
      numberOfMeals,
      numberOfSnacks,
      carbohydrates,
      protine,
      fridaysCount: isNotFridays ? false : true,
      fridays: numberOfFridays,
      notes,
      subscriptionPrice,
      subscriptionPrice,
      clientId,
    });
    await subscripe.save();
    client.subscriperId = subscriperId;
    client.subscriped = true;
    await client.save();
    res.status(201).redirect("/admin/dashboard");
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    next(error);
  }
};

exports.getAllClientsReport = async (req, res, next) => {
  try {
    const subscriptions = await Subscription.find({});
    let clientsArr = [];
    const currentDate = new Date();
    for (let sub of subscriptions) {
      let subscripeObj = {};
      let clientData = await sub.populate("clientId");
      subscripeObj.clientSerial = clientData.clientId.clientSerial;
      subscripeObj.clientName = clientData.clientId.name;
      subscripeObj.clientNumber = clientData.clientId.phoneNumber;
      subscripeObj.subscriperId = clientData.clientId.subscriperId;
      subscripeObj.subscriptionPeriod = sub.subscriptionPeriod;
      subscripeObj.startDate = utilities.shortDate(sub.startDate);
      subscripeObj.endDate = utilities.shortDate(sub.endDate);
      let remainingDays;
      if (!sub.fridaysCount) {
        remainingDays =
          Math.ceil(utilities.numberOfDays(currentDate, sub.endDate)) -
          sub.fridays;
      } else {
        remainingDays = Math.ceil(
          utilities.numberOfDays(currentDate, sub.endDate)
        );
      }
      subscripeObj.remainingPeriod = remainingDays > 0 ? remainingDays : 0;
      subscripeObj.numberOfMeals = sub.numberOfMeals;
      subscripeObj.numberOfSnacks = sub.numberOfSnacks;
      subscripeObj.notices = sub.notes;
      subscripeObj.subscriptionPrice = sub.subscriptionPrice;
      subscripeObj.clientId = clientData.clientId._id;
      clientsArr.push(subscripeObj);
    }
    clientsArr.sort((a, b) => {
      return a.remainingPeriod - b.remainingPeriod;
    });
    res
      .status(200)
      .render("admin/subscripersReport", { subscripers: clientsArr });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    next(error);
  }
};

exports.postAllSubscripersReport = async (req, res, next) => {
  try {
    const { dateFrom, dateTo } = req.body;
    const isoDateFrom = utilities.toIsoDate(dateFrom, "start");
    const isoDateTo = utilities.toIsoDate(dateTo, "");
    const subscriptions = await Subscription.find({
      startDate: { $gte: isoDateFrom },
      endDate: { $lte: isoDateTo },
    });
    let clientsArr = [];
    const currentDate = new Date();
    for (let sub of subscriptions) {
      let subscripeObj = {};
      let clientData = await sub.populate("clientId");
      subscripeObj.clientSerial = clientData.clientId.clientSerial;
      subscripeObj.clientName = clientData.clientId.name;
      subscripeObj.clientNumber = clientData.clientId.phoneNumber;
      subscripeObj.subscriperId = clientData.clientId.subscriperId;
      subscripeObj.subscriptionPeriod = sub.subscriptionPeriod;
      subscripeObj.startDate = utilities.shortDate(sub.startDate);
      subscripeObj.endDate = utilities.shortDate(sub.endDate);
      let remainingDays;
      if (!sub.fridaysCount) {
        remainingDays =
          Math.ceil(utilities.numberOfDays(currentDate, sub.endDate)) -
          sub.fridays;
      } else {
        remainingDays = Math.ceil(
          utilities.numberOfDays(currentDate, sub.endDate)
        );
      }
      subscripeObj.remainingPeriod = remainingDays > 0 ? remainingDays : 0;
      subscripeObj.numberOfMeals = sub.numberOfMeals;
      subscripeObj.numberOfSnacks = sub.numberOfSnacks;
      subscripeObj.notices = sub.notes;
      subscripeObj.subscriptionPrice = sub.subscriptionPrice;
      subscripeObj.clientId = clientData.clientId._id;
      clientsArr.push(subscripeObj);
    }
    clientsArr.sort((a, b) => {
      return a.remainingPeriod - b.remainingPeriod;
    });
    res.status(201).json({ subscripers: clientsArr });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    next(error);
  }
};

exports.getClientSearch = (req, res, next) => {
  try {
    res
      .status(200)
      .render("admin/searchClients", { hasError: false, searching: false });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    next(error);
  }
};

exports.postFindSubscriper = async (req, res, next) => {
  try {
    const clientId = req.params.clientId;
    const onTheFly = req.params.onTheFly;
    const phoneNumber = req.body.phoneNumber;
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.render("admin/searchClients", {
        hasError: true,
        errorMessage: error.array()[0].msg,
        searching: false,
      });
    }
    let subscriper;
    if (onTheFly) {
      subscriper = await Client.findById(clientId);
    } else {
      subscriper = await Client.findOne({ phoneNumber: phoneNumber });
    }
    let subObj = {};
    if (subscriper.subscriped) {
      const subscription = await Subscription.find({
        clientId: subscriper._id,
      });
      dateFromStr = subscription[0].startDate
        .toLocaleString()
        .split(",")[0]
        .split("/");
      datetoStr = subscription[0].endDate
        .toLocaleString()
        .split(",")[0]
        .split("/");
      dateStart = dateFromStr[1] + "-" + dateFromStr[0] + "-" + dateFromStr[2];
      dateEnd = datetoStr[1] + "-" + datetoStr[0] + "-" + datetoStr[2];
      subObj = {
        subscriptionPeriod: subscription[0].subscriptionPeriod,
        startDate: dateStart,
        endDate: dateEnd,
        numberOfMeals: subscription[0].numberOfMeals,
        numberOfSnacks: subscription[0].numberOfSnacks,
        carbohydrates: subscription[0].carbohydrates,
        protine: subscription[0].protine,
        notes: subscription[0].notes,
        subscriptionPrice: subscription[0].subscriptionPrice,
      };
    }
    res.status(201).render("admin/searchClients", {
      hasError: false,
      searching: true,
      clientData: subscriper,
      sub: subObj,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    next(error);
  }
};

exports.postEditSubscriper = async (req, res, next) => {
  const {
    clientId,
    name,
    phoneNumber,
    subscriperId,
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
    startDate,
    endDate,
    fridaysCount,
    subscriptionPeriod,
    numberOfMeals,
    numberOfSnacks,
    carbohydrates,
    protine,
    notes,
    subscriptionPrice,
  } = req.body;
  try {
    const registeredClient = await Client.findById(clientId);
    registeredClient.name = name.length > 0 ? name : registeredClient.name;
    registeredClient.phoneNumber = phoneNumber;
    registeredClient.subscriperId = subscriperId;
    registeredClient.initialWeight = initialWeight;
    registeredClient.height = height;
    registeredClient.age = age;
    registeredClient.target = target;
    registeredClient.activity = activity;
    registeredClient.activityDays = activityDays;
    registeredClient.trainingPeriod = trainingPeriod;
    registeredClient.trainingIntensity = trainingIntensity;
    registeredClient.healthIssues = healthIssues;
    registeredClient.foodAllergic = foodAllergic;
    registeredClient.favoriteDish = favoriteDish;
    registeredClient.notFavoriteDish = notFavoriteDish;
    registeredClient.snacks = snacks;
    registeredClient.nutritions = nutritions;
    registeredClient.notices = notices;
    registeredClient.meals = meals;
    registeredClient.dailySnacks = dailySnacks;
    const subscripe = await Subscription.find({ clientId: clientId });
    subscripe[0].subscriptionPeriod =
      subscriptionPeriod.length > 0
        ? subscriptionPeriod
        : subscripe[0].subscriptionPeriod;
    subscripe[0].startDate = startDate ? startDate : subscripe[0].startDate;
    subscripe[0].endDate = endDate
      ? utilities.fullDay(endDate)
      : subscripe[0].endDate;
    subscripe[0].fridaysCount = fridaysCount === "on" ? false : true;
    if (fridaysCount === "on") {
      subscripe[0].fridays = utilities.fridayCounter(startDate, endDate);
    }
    subscripe[0].numberOfMeals = numberOfMeals;
    subscripe[0].numberOfSnacks = numberOfSnacks;
    subscripe[0].carbohydrates = carbohydrates;
    subscripe[0].protine = protine;
    subscripe[0].notes = notes;
    subscripe[0].subscriptionPrice = subscriptionPrice;
    await registeredClient.save();
    await subscripe[0].save();
    res.status(201).redirect("/admin/dashboard");
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    next(error);
  }
};

exports.getClientsRemove = (req, res, next) => {
  try {
    res.status(200).render("admin/removeClient", { searching: false });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    next(error);
  }
};

exports.postGetSubscriperInfo = async (req, res, next) => {
  try {
    const phoneNumber = req.body.phoneNumber;
    const subscriper = await Client.findOne({ phoneNumber: phoneNumber });
    if (!subscriper) {
      throw new Error("this phone number is not registered");
    }
    const subscription = await Subscription.find({
      clientId: subscriper._id,
    });
    if (!subscription) {
      throw new Error("this client is not subscriped");
    }
    dateFromStr = subscription[0].startDate
      .toLocaleString()
      .split(",")[0]
      .split("/");
    datetoStr = subscription[0].endDate
      .toLocaleString()
      .split(",")[0]
      .split("/");
    dateStart = dateFromStr[1] + "-" + dateFromStr[0] + "-" + dateFromStr[2];
    dateEnd = datetoStr[1] + "-" + datetoStr[0] + "-" + datetoStr[2];
    let subObj = {
      subscriptionPeriod: subscription[0].subscriptionPeriod,
      startDate: dateStart,
      endDate: dateEnd,
      numberOfMeals: subscription[0].numberOfMeals,
      subscriptionPrice: subscription[0].subscriptionPrice,
    };
    res.status(201).render("admin/removeClient", {
      searching: true,
      clientData: subscriper,
      sub: subObj,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    next(error);
  }
};

exports.postRemoveClient = async (req, res, next) => {
  const clientId = req.body.clientId;
  const onTheFlyRemove = req.body.onTheFly;
  try {
    const isSubscriped = await Subscription.findOne({ clientId: clientId });
    if (isSubscriped) {
      await Subscription.findOneAndRemove({ clientId: clientId });
    }
    await Client.findByIdAndRemove(clientId);
    if (onTheFlyRemove) {
      return res.status(201).json({ message: "removed" });
    } else {
      return res.status(201).redirect("/admin/dashboard");
    }
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    next(error);
  }
};

exports.getLogin = (req, res, next) => {
  try {
    res.status(200).render("admin/login");
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    next(error);
  }
};

exports.postAdminLogin = async (req, res, next) => {
  const { userName, password } = req.body;
  try {
    const admin = await Admin.findOne({ userName: userName });
    if (!admin) {
      throw new Error("Invalid login credentials");
    }
    // const hashedPass = await bcrypt.hash(password, 12);
    // admin = new Admin({
    //   userName: userName,
    //   password: hashedPass,
    // });
    //await admin.save();
    const doMatch = await bcrypt.compare(password, admin.password);
    if (doMatch) {
      req.session.admin = admin;
      req.session.adminLoggedIn = true;
      res.status(201).redirect("/admin/dashboard");
    }
    // req.session.admin = admin;
    // req.session.adminLoggedIn = true;
    // res.status(201).redirect("/admin/dashboard");
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    next(error);
  }
};

exports.getAdminLogout = async (req, res, next) => {
  await req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
    res.status(201).redirect("/");
  });
};
