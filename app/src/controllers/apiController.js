const boom = require("boom");
const fastify = require("fastify")({ logger: true });
const { PenthouseService } = require("../services/penthouseService");
const url = require("url");
const domainRegex = new RegExp(/[\w]*\.([\w.]*)/gi);
const Projects = require("../models/ProjectModel");
const Outputs = require("../models/OutputModel");
exports.getPixel = async (req, reply) => {
  try {
    const referer = req.headers.referer || req.query.referer;
    if (!referer) {
      throw new Error("referer is mandatory");
    }
    fastify.log.info(`req.headers.referer ${referer}`);
    fastify.log.info(`projectid: ${req.params.projectid}`);
    fastify.log.info(`css: ${req.query.css}`);
    const { hostname } = url.parse(referer);
    if (process.env.ALLOWED_DOMAINS) {
      domainRegex.lastIndex = 0;
      const match = domainRegex.exec(hostname);
      if (
        !(
          match &&
          match[1] &&
          process.env.ALLOWED_DOMAINS.indexOf(match[1]) > -1
        )
      ) {
        return fastify.notFound(request, reply);
      }
    }
    fastify.log.info(`hostname ${hostname}`);
    const project = await Projects.findOne({
      identifier: req.params.projectid,
      hostname: hostname
    });
    if (!project) {
      throw new Error(
        `hostname: ${hostname} projectid: ${req.params.projectid} not valid`
      );
    }
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
        css: css
      })
      .then(criticalCss => {
        Outputs.update(
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
            fastify.log.info(raw);
          }
        );
      });
    return reply.sendFile("1x1.png");
  } catch (err) {
    throw boom.boomify(err);
  }
};
