const mongoose = require("mongoose");
const outputSchema = require("../schemas/OutputSchema");
const Outputs = mongoose.model("outputs", outputSchema);
module.exports = Outputs;
