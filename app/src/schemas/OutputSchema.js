const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const outputSchema = new Schema(
  {
    identifier: String,
    referer: String,
    inputs: Array,
    output: String,
    lastUpdate: Date
  },
  {
    collection: "outputs"
  }
);
outputSchema.index({ identifier: 1, referer: 1 });
module.exports = outputSchema;
