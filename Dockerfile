FROM node:10-alpine as deps
# Allow both the environment ID and node env to be passed in at build time
ARG NODE_ENV=development
# Set the enrivonment vars according to the passed args
ENV NODE_ENV=$NODE_ENV
# Create the application directory
RUN mkdir /opt/app
# Set our working directory to the app directory
WORKDIR /opt/app
# Copy the package and package-lock files
COPY package*.json ./
# Install deps
RUN npm i

FROM node:10-alpine as prod
# Allow both the environment ID and node env to be passed in at build time
ARG NODE_ENV=production
# Set the enrivonment vars according to the passed args
ENV NODE_ENV=$NODE_ENV
# Create the application directory
RUN mkdir /opt/app
# Set our working directory to the app directory
WORKDIR /opt/app
# Copy the package and package-lock files
COPY package*.json ./
# Install deps
RUN npm ci --prod

FROM node:10-alpine as build
# Allow both the environment ID and node env to be passed in at build time
ARG NODE_ENV=development
# Set the enrivonment vars according to the passed args
ENV NODE_ENV=$NODE_ENV
# Create the application directory
RUN mkdir /opt/app
# Make the assets and server directories
# This is where the built assets will be placed
RUN mkdir /opt/app/.assets \
  && mkdir /opt/app/.server
# Set our working directory to the app directory
WORKDIR /opt/app
# Copy all non docker ignored files
COPY ./src ./src/
# Copy the package and package-lock files
COPY package*.json .npmrc ./
COPY babel.config.json ./
COPY babel.server.config.json ./
COPY check-lockfiles.js ./
COPY tsconfig.json ./
COPY package-scripts.js ./
COPY webpack.config.js ./
COPY src/Types/custom.d.ts ./
COPY src/Types/window.d.ts ./
# Copy node modules
COPY --from=deps /opt/app/node_modules ./node_modules
## Run the deploy build nps script
RUN npm config set unsafe-perm true \
  && npx nps build.server \
  && npx nps build.assets \
  && rm -rf /opt/app/node_modules

## SERVER
## This step puts the macro UI into a single container
## This will be the actual step that serves users
FROM node:10-alpine as server
# Allow both the environment ID and node env to be passed in at build time
ARG NODE_ENV=production
# Set the enrivonment vars according to the passed args
ENV NODE_ENV=$NODE_ENV
# Create the application directory
RUN mkdir /opt/app
# Set our working directory to the app directory
WORKDIR /opt/app
## Update packages
RUN apk --no-cache update && \
  apk --no-cache upgrade
## Install Python
RUN apk add --update \
    python \
    python-dev \
    py-pip \
    build-base \
  && pip install virtualenv \
  && rm -rf /var/cache/apk/*
# Copy docker files
COPY .docker ./.docker
## Make the scripts executable
RUN chmod +x .docker/harden.sh && \
  chmod +x .docker/boot.sh
## Execute the hardening script
## Delete the hardening script afterwards
RUN .docker/harden.sh && \
  rm -f ./.docker/harden.sh
# Copy the allowed files to the image
# You may need to add more for your production build
COPY --from=build /opt/app/.assets ./.assets
COPY --from=build /opt/app/.server ./.server
COPY --from=prod /opt/app/package*.json /opt/app/.npmrc ./
COPY --from=prod /opt/app/node_modules ./node_modules
# Run as non root user "node" from now on
USER node
# Run the built server code
CMD ["sh", "./.docker/boot.sh"]