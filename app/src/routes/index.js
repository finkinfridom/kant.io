const apiController = require("../controllers/apiController");
const package = require("../../package.json");
const routes = [
  {
    method: "GET",
    schema: {
      hide: true
    },
    url: "/",
    handler: (request, reply) => {
      return {
        name: package.name,
        version: package.version,
        documentation: "/documentation"
      };
    }
  },
  {
    method: "GET",
    schema: {
      tags: ["html"],
      params: {
        projectid: { type: "string" }
      },
      querystring: {
        referer: { type: "string" }
      },
      response: {
        200: {
          type: "object"
        }
      }
    },
    url: "/api/:projectid/pixel",
    handler: apiController.getPixel
  },
  {
    method: "GET",
    url: "/api/:projectid/criticalcss",
    handler: apiController.getCriticalCss,
    querystring: {}
  }
];
module.exports = routes;
