const boom = require("boom");
const fastify = require("fastify")({ logger: true });
const { PenthouseService } = require("../services/penthouseService");
const url = require("url");
const domainRegex = new RegExp(/[\w]*\.([\w.]*)/gi);
exports.getPixel = async (req, reply) => {
  try {
    fastify.log.info(`req.headers.referer ${req.headers.referer}`);
    fastify.log.info(`projectid: ${req.params.projectid}`);
    fastify.log.info(`css: ${req.query.css}`);
    if (process.env.ALLOWED_DOMAINS) {
      const { hostname } = url.parse(req.headers.referer);
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
    if (req.headers.referer && req.params.projectid) {
      const service = new PenthouseService({
        url: req.headers.referer,
        projectid: req.params.projectid
      });
      let { css } = req.query;
      if (!css) {
        css = await service.lookup();
      }
      service.extract({
        css: Array.isArray(css) ? css : [css]
      });
    }
    return reply.sendFile("1x1.png");
  } catch (err) {
    throw boom.boomify(err);
  }
};
