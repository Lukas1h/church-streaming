FROM node:slim AS builder

# Install Docker CLI
RUN apt-get update && \
    apt-get install -y docker.io jq gettext && \
    apt-get clean


WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN 
# RUN npm run build
# RUN npm run dev
# RUN npm prune --production

# FROM node:slim
# WORKDIR /app
# COPY --from=builder /app/build build/
# COPY --from=builder /app/node_modules node_modules/
# COPY package.json .
# EXPOSE 3000
# ENV NODE_ENV=production
# CMD [ "node", "build" ]