FROM node:14-alpine
RUN apk add --no-cache libc6-compat

WORKDIR /usr/src/app

COPY . ./

# building the app
RUN yarn install
RUN yarn build

# Running the app
CMD [ "yarn", "start" ]
