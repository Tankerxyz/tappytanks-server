FROM node:10

ENV HOME /tappytanks-server

WORKDIR ${HOME}
ADD . $HOME

RUN npm i && npm run build

ENV NODE_ENV production

# envs --
ENV SECRET webgo

ENV MONGODB_URI mongodb://web-go-user:web-go-user@ds133961.mlab.com:33961/web-go-demo
ENV POSTGRES_URL postgres://ymuxoegt:ONfBcCQylth3boOdUE2EkcZbC2OAbtcm@tantor.db.elephantsql.com:5432/ymuxoegt

ENV REDIS_PORT 17929
ENV REDIS_HOST redis-17929.c1.us-central1-2.gce.cloud.redislabs.com

ENV SENTRY_DSN https://70484e0dda784a1081081ca9c8237792:51b5a95ee1e545efba3aba9103c6193e@sentry.io/236866
# -- envs

# processes --
ENV WEB_CONCURRENCY 1
# -- processes

EXPOSE 3000

CMD node processes.js
