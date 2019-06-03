const boom = require("boom");
const fastify = require("fastify")({ logger: true });
exports.getPixel = (req, reply) => {
  try {
    fastify.log.info(
      `req.headers.referer ${JSON.stringify(req.headers.referer)}`
    );
    return reply.sendFile("1x1.png");
  } catch (err) {
    throw boom.boomify(err);
  }
};
