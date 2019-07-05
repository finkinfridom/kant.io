const apiController = require("../controllers/apiController");
const package = require("../../package.json");
const routes = [
  {
    method: "GET",
    schema: {
      hide: true
    },
    url: "/",
    handler: async (request, reply) => {
      return {
        name: package.name,
        version: package.version
      };
    }
  },
  {
    method: "GET",
    url: "/api/:projectid/pixel",
    handler: apiController.getPixel
  }
];
module.exports = routes;
