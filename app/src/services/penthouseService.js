const penthouse = require("penthouse");
const https = require("https");
const http = require("http");
const url = require("url");
const { parse } = require("node-html-parser");

class PenthouseService {
  constructor(url, projectid) {
    this.url = url;
    this.projectid = projectid;
  }
  create() {
    return new Promise(function(resolve, reject) {
      const { protocol, host } = url.parse(this.url);
      const req = (protocol === "http:" ? http : https).request(
        {
          host,
          path,
          method: "GET"
        },
        function(res) {
          const chunks = [];
          res
            .on("data", function(chunk) {
              chunks.push(chunk);
            })
            .on("end", () => {
              const body = Buffer.concat(chunks).toString();
              const root = parse(body);
              const cssStylesheet = root.querySelectorAll("link");
              for (const css in cssStylesheet) {
                //iterate and download them
              }
              resolve(body);
              console.log(`${name}: ${body}`);
            })
            .on("error", reject);
        }
      );
      req.on("error", reject);
      req.end();
      console.log(this.url, this.projectid);
    });
  }
}

module.exports = {
  PenthouseService
};
