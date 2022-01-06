# Stage 1 - the builder
FROM 280035946601.dkr.ecr.us-east-1.amazonaws.com/node:12-alpine as build-deps
WORKDIR /usr/src/app
COPY . ./
RUN npm install
RUN npm run build

# Stage 2 - the runner
FROM 280035946601.dkr.ecr.us-east-1.amazonaws.com/nginx:stable-alpine
COPY ./rootfs/ /
COPY --from=build-deps /usr/src/app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
