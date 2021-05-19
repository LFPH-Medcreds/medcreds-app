# build environment
FROM node:14-alpine AS builder
WORKDIR /app
RUN apk add python make g++
COPY ./package*.json /app/
RUN [ "npm", "install"]
COPY . .
RUN [ "npm", "run-script", "build" ]


# server environment
FROM nginx

COPY fix-baseurl-patch.sh /docker-entrypoint.d/
COPY nginx.conf /etc/nginx/conf.d/configfile.template
ENV PORT 8080
ENV HOST 0.0.0.0
RUN sh -c "envsubst '\$PORT'  < /etc/nginx/conf.d/configfile.template > /etc/nginx/conf.d/default.conf"

COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
