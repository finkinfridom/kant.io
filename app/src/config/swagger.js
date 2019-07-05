const package = require("../../package.json");
exports.options = {
  routePrefix: "/documentation",
  exposeRoute: true,
  swagger: {
    info: {
      title: package.name,
      description: package.description,
      version: package.version
    },
    externalDocs: {
      url: package.repository,
      description: "Find more info here"
    },
    host: process.env.SWAGGER_HOST || `localhost:${process.env.PORT || 3000}`,
    schemes: ["http", "https"],
    consumes: ["application/json"],
    produces: ["application/json"]
  }
};
