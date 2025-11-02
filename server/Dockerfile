FROM node:20.19.5-bookworm-slim AS install

ENV VERSION=0.2

WORKDIR /tmp/2stems

ENV NODE_ENV=PRODUCTION
ENV NODE_OPTIONS=--openssl-legacy-provider

RUN   apt update && apt -y --allow-change-held-packages full-upgrade && apt -y --allow-change-held-packages install wget tar gzip 

RUN   apt-get update && apt-get -y --allow-change-held-packages full-upgrade

RUN   apt-get update && apt-get -y --allow-change-held-packages install \
      libnss3 \
      build-essential \
      fonts-lato \
      fonts-open-sans \
      fonts-roboto \
      liblensfun-data-v1 \
      curl \
      vim \
      bash \
      make \
      python3-full \
      libnss3 \
      ffmpeg \
      python3-pip \
      pipx \
      git \
      whet \
      tar \
      gzip

WORKDIR /app

RUN   git clone https://github.com/thomasesr/karaoke-forever-docker.git /app

RUN   npm i

RUN apt remove --purge -y build-essential
RUN apt autoclean
RUN apt clean

FROM install AS build
ENV VERSION=0.2
WORKDIR /app/server
ENV NODE_OPTIONS=--openssl-legacy-provider
ENV DEBIAN_FRONTEND=noninteractive

RUN npm run build

FROM build AS run
ENV VERSION=0.2
ENV NODE_OPTIONS=--openssl-legacy-provider
WORKDIR /app

ENV   KF_SERVER_DB_PATH="/config"
ENV   KF_SERVER_PORT=3000

VOLUME /config
EXPOSE 3000
RUN npm run youtube-update
CMD npm run serve
