const mongoose = require("mongoose");
const projectSchema = require("../schemas/ProjectSchema");
const Projects = mongoose.model("projects", projectSchema);
module.exports = Projects;
