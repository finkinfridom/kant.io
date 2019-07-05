FROM node:alpine

RUN mkdir /app
WORKDIR /app

ENV PATH ./node_modules/.bin:$PATH

COPY /app/package.json .
COPY /app/yarn.lock .

RUN npm set progress=false
RUN yarn install --production
RUN yarn install

COPY /app .

EXPOSE 3000

ENTRYPOINT [ "yarn", "run", "start" ]