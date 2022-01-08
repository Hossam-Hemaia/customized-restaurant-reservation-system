const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subscriptionSchema = new Schema({
  date: {
    type: Date,
    default: new Date(),
    required: true,
  },
  subscriptionPeriod: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  numberOfMeals: {
    type: Number,
    required: true,
  },
  numberOfSnacks: {
    type: Number,
  },
  carbohydrates: {
    type: String,
  },
  protine: {
    type: String,
  },
  fridaysCount: {
    type: Boolean,
    default: true,
  },
  fridays: {
    type: Number,
    default: 0,
  },
  notes: {
    type: String,
  },
  subscriptionPrice: {
    type: Number,
    required: true,
  },
  clientId: {
    type: Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },
});

module.exports = mongoose.model("subscription", subscriptionSchema);
