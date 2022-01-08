const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const clientSchema = new Schema({
  clientSerial: {
    type: Number,
    default: 1,
  },
  subscriperId: {
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
  date: {
    type: Date,
    default: new Date(),
  },
  initialWeight: {
    type: Number,
  },
  height: {
    type: Number,
  },
  age: {
    type: Number,
  },
  target: {
    type: String,
  },
  activity: {
    type: String,
  },
  activityDays: {
    type: Number,
  },
  trainingPeriod: {
    type: String,
  },
  trainingIntensity: {
    type: String,
  },
  healthIssues: {
    type: String,
  },
  foodAllergic: {
    type: String,
  },
  favoriteDish: {
    type: String,
  },
  notFavoriteDish: {
    type: String,
  },
  snacks: {
    type: String,
  },
  nutritions: {
    type: String,
  },
  notices: {
    type: String,
  },
  meals: {
    type: String,
  },
  dailySnacks: {
    type: String,
  },
  subscriped: {
    type: Boolean,
    default: false,
  },
});

module.exports = new mongoose.model("Client", clientSchema);
