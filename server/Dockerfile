FROM node:24.0.0-bullseye-slim AS install

ENV VERSION=0.1
#VOLUME  /app
WORKDIR /app

ENV NODE_ENV=PRODUCTION
ENV NODE_OPTIONS=--openssl-legacy-provider

RUN   apt-get update && apt-get -y --allow-change-held-packages full-upgrade
      
RUN   apt-get update && apt-get -y --allow-change-held-packages install git python3 build-essential
LABEL TEST=1      
RUN git clone https://github.com/thomasesr/karaoke-forever-docker.git /app

RUN npm i
#RUN npm install @distube/ytdl-core@4.15.9 --legacy-peer-deps

FROM install AS build
ENV VERSION=0.1
WORKDIR /app/server
ENV NODE_OPTIONS=--openssl-legacy-provider
ENV DEBIAN_FRONTEND=noninteractive
      
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
      make

RUN npm run build

FROM build AS run
ENV VERSION=0.1
ENV NODE_OPTIONS=--openssl-legacy-provider
WORKDIR /app
#COPY ./cuda-archive-keyring.gpg /usr/share/keyrings/cuda-archive-keyring.gpg
RUN   echo "deb [signed-by=/usr/share/keyrings/cuda-archive-keyring.gpg] https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2404/x86_64/ /" > /etc/apt/sources.list.d/cuda-ubuntu.list
RUN   wget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2404/x86_64/cuda-keyring_1.1-1_all.deb
RUN   apt install ./cuda-keyring_1.1-1_all.deb
RUN   apt-get update && \
      apt-get -y --allow-change-held-packages full-upgrade
      
RUN   apt-get update && apt-get -y --allow-change-held-packages install libnss3 ffmpeg python3-pip wget tar gzip
RUN   pip install spleeter==2.4.0
RUN   pip install "numpy<2.0"

RUN   mkdir /app/2stems

RUN   wget -O /app/2stems-finetune.tar.gz https://github.com/deezer/spleeter/releases/download/v1.4.0/2stems-finetune.tar.gz

RUN   wget -O /app/2stems.tar.gz https://github.com/deezer/spleeter/releases/download/v1.4.0/2stems.tar.gz

RUN   tar -xf /app/2stems-finetune.tar.gz -C /app/2stems
 
RUN   tar -xf /app/2stems.tar.gz -C /app/2stems
ENV   KF_SERVER_DB_PATH="/config"
ENV.  KF_SERVER_PORT=3000
#ENV   KES_PORT=3000

VOLUME /config
EXPOSE 3000
RUN npm run youtube-update
CMD npm run serve
