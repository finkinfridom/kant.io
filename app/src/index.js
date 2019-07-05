// Require the framework and instantiate it
const fastify = require("fastify")({ logger: true });
const routes = require("./routes");
const path = require("path");
// Import Swagger Options
const swagger = require("./config/swagger");
const fastifyCaching = require("fastify-caching");

// Register Swagger
fastify.register(require("fastify-swagger"), swagger.options);
// Register fastify-static
fastify.register(require("fastify-static"), {
  root: path.join(__dirname, "public"),
  prefix: "/public/" // optional: default '/'
});
// Register fastify-cache
fastify.register(
  fastifyCaching,
  {
    privacy: fastifyCaching.privacy.PUBLIC,
    expiresIn: 86400
  },
  err => {
    if (err) throw err;
  }
);

routes.forEach(route => {
  fastify.route(route);
});

// Run the server!
const start = async () => {
  try {
    await fastify.listen(process.env.PORT || 3000, "::");
    fastify.swagger();
    fastify.log.info(`listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
