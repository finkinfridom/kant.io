const boom = require("boom");
const fastify = require("fastify")({ logger: true });
exports.getPixel = (req, reply) => {
  try {
    fastify.log.info(`req.headers.referer ${req.headers.referer}`);
    fastify.log.info(`projectid: ${req.params.projectid}`);
    return reply.sendFile("1x1.png");
  } catch (err) {
    throw boom.boomify(err);
  }
};
