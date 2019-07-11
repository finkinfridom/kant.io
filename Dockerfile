FROM node:alpine

RUN mkdir /app
WORKDIR /app

ENV PATH ./node_modules/.bin:$PATH
#ENV NODE_ENV production
COPY /app/package.json .
COPY /app/yarn.lock .

RUN yarn install --production --no-progress --pure-lockfile

COPY /app .

EXPOSE 3000

ENTRYPOINT [ "yarn", "run", "start" ]