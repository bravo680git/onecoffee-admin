FROM node:20-alpine3.19 as builder
WORKDIR /app
COPY package*.json pnpm-lock.yaml ./
RUN npm i -g pnpm
RUN pnpm i --frozen-lockfile
COPY . .
RUN pnpm build

FROM nginx:1.27.0-alpine3.19
COPY --from=builder  /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD [ "nginx", "-g", "daemon off;" ]
