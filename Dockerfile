FROM node:10

ENV HOME /tappytanks-server

WORKDIR ${HOME}
ADD . $HOME

RUN npm i && npm run typed

EXPOSE 3000
