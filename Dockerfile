FROM node:18-alpine AS build
WORKDIR /app
COPY . .

RUN npm install
RUN npm run build 
RUN npm prune --production
RUN rm -rf app

FROM node:18-alpine

ENV NODE_ENV production
COPY --from=build /app /app
WORKDIR /app
EXPOSE 8888
CMD ["node", "dist/main.js"]
