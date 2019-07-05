const boom = require("boom");
const fastify = require("fastify")({ logger: true });
const { PenthouseService } = require("../services/penthouseService");
exports.getPixel = (req, reply) => {
  try {
    fastify.log.info(`req.headers.referer ${req.headers.referer}`);
    fastify.log.info(`projectid: ${req.params.projectid}`);
    if (req.headers.referer && req.params.projectid) {
      const service = new PenthouseService({
        url: req.headers.referer,
        projectid: req.params.projectid
      });
      service.create();
    }
    return reply.sendFile("1x1.png");
  } catch (err) {
    throw boom.boomify(err);
  }
};
