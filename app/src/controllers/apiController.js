const boom = require("boom");
const fastify = require("fastify")({ logger: true });
const { PenthouseService } = require("../services/penthouseService");
const url = require("url");
const Projects = require("../models/ProjectModel");
const Outputs = require("../models/OutputModel");
const getProject = async (identifier, referer) => {
  if (!referer) {
    throw new Error("referer is mandatory");
  }
  const { hostname } = url.parse(referer);
  const project = await Projects.findOne({
    identifier,
    hostname
  });
  if (!project) {
    throw new Error(`hostname: ${hostname} projectid: ${identifier} not valid`);
  }
  return project;
};
exports.getCriticalCss = async (req, reply) => {
  try {
    const referer = req.query.referer;
    const identifier = req.params.projectid;
    const project = await getProject(identifier, referer);
    const critical = await Outputs.findOne({
      identifier: project.identifier,
      referer: referer
    });
    if (!critical) {
      throw new Error(`output not found for ${identifier}/${referer}`);
    }
    fastify.log.info(critical.inputs.length);
    reply.view("critical-css", {
      inputs: critical.inputs || [],
      output: critical.output || ""
    });
  } catch (err) {
    throw boom.boomify(err);
  }
};
exports.getPixel = async (req, reply) => {
  try {
    const referer = req.headers.referer || req.query.referer;
    const project = getProject(req.params.projectid, referer);
    const service = new PenthouseService({
      url: referer,
      projectid: project.identifier
    });
    let { css } = req.query;
    if (!css) {
      css = await service.lookup();
    }
    if (!(css && css.length)) {
      throw new Error("no CSS input provided nor CSS found in page");
    }
    css = Array.isArray(css) ? css : [css];
    service
      .extract({
        css
      })
      .then(criticalCss => {
        Outputs.updateOne(
          {
            identifier: project.identifier,
            referer: referer
          },
          {
            identifier: project.identifier,
            referer: referer,
            inputs: css,
            output: criticalCss,
            lastUpdate: new Date()
          },
          {
            upsert: true
          },
          (err, raw) => {
            if (err) {
              throw err;
            }
            fastify.log.info(`saved for ${project.identifier}:${referer}`);
          }
        );
      });
    reply.sendFile("1x1.png");
  } catch (err) {
    throw boom.boomify(err);
  }
};
