const penthouse = require("penthouse");
const fastify = require("fastify")({ logger: true });
const https = require("https");
const http = require("http");
const url = require("url");
const fs = require("fs");
const parse = require("node-html-parser").parse;

class PenthouseService {
  constructor(props) {
    this.url = props.url;
    this.projectid = props.projectid;
  }
  async get(_url, _path) {
    return new Promise((resolve, reject) => {
      const { protocol, host, path } = url.parse(url.resolve(_url, _path));
      const req = (protocol === "http:" ? http : https).request(
        {
          host,
          path,
          method: "GET"
        },
        res => {
          const chunks = [];
          if (res.statusCode > 400) {
            reject();
            return;
          }
          res
            .on("data", chunk => {
              chunks.push(chunk);
            })
            .on("end", () => {
              const body = Buffer.concat(chunks).toString();
              resolve(body || "");
            })
            .on("error", reject);
        }
      );
      req.on("error", reject);
      req.end();
    });
  }
  async lookup() {
    const body = await this.get(this.url, "");
    const root = parse(body);
    const links = root.querySelectorAll("link");
    return links
      .filter(link => link.attributes["rel"] === "stylesheet")
      .map(link => link.attributes["href"]);
  }
  async extract(opts) {
    return new Promise(async (resolve, reject) => {
      const cssString = [];

      for (const css of opts.css) {
        const result = await this.get(this.url, css);
        cssString.push(result);
      }

      penthouse({
        url: this.url,
        cssString: cssString.join(""),
        keepLargerMediaQueries: true
      }).then(criticalCss => {
        resolve(criticalCss);
        fs.writeFileSync("out.css", criticalCss);
        //write to mapping:
        //- list of input css
        // output css
        // output snippet for CSS critical
      });
    });
  }
}

module.exports = {
  PenthouseService
};
