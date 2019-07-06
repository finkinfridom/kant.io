const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const projectSchema = new Schema(
  {
    identifier: String,
    hostname: String
  },
  {
    collection: "projects"
  }
);
projectSchema.index({ identifier: 1, hostname: 1 });
module.exports = projectSchema;
