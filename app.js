const fs = require("fs");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");

const Admin = require("./models/admin");

const adminRouter = require("./routes/admin");
const homeController = require("./controllers/homeController");
const clientRouter = require("./routes/client");

const errorController = require("./controllers/error");

const app = express();

const MONGODB_Uri = `mongodb+srv://its a secret`;
const store = new MongoDBStore({
  uri: MONGODB_Uri,
  collection: "sessions",
  expires: 1000 * 60 * 60 * 24,
});
const csrfProtection = csrf();

app.set("view engine", "ejs");
app.set("views", "views");

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);
//secure the traffic
app.use(helmet());
app.use(compression());
app.use(morgan("combined", { stream: accessLogStream }));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "In the name of Allah most gracious most merciful",
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);
app.use(csrfProtection);

app.use(async (req, res, next) => {
  if (!req.session.admin) {
    return next();
  }
  try {
    const admin = await Admin.findById(req.session.admin._id);
    req.admin = admin;
    next();
  } catch (err) {
    console.log(err);
  }
});

app.use((req, res, next) => {
  res.locals.adminAuthenticated = req.session.adminLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use(adminRouter);
app.use(clientRouter);
app.get("/", homeController.getHomePage);

app.use("/500", errorController.get500);
app.use(errorController.getNotFound);
app.use((error, req, res, next) => {
  console.log(error);
  res.redirect("/500");
});

mongoose
  .connect(MONGODB_Uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    const server = app.listen(5000, "localhost", () => {
      console.log("lestening on port 5000");
    });
    const io = require("./socket").init(server);
    io.on("connection", (socket) => {
      console.log("connected...");
    });
  })
  .catch((err) => {
    console.log(err);
  });
