FROM node:20 AS build

RUN mkdir /react
WORKDIR /react

COPY package.json .

# RUN npm install --legacy-peer-deps
RUN npm install
#RUN npm install eslint-plugin-import --save-dev
RUN npm install --save-dev @types/js-cookie

COPY . .

RUN npm run build


RUN ls /react/dist
#RUN ls /react/build

RUN ls

FROM nginx:latest

WORKDIR /
# 한국 시간대로 설정
ENV TZ=Asia/Seoul
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

COPY --from=build /react/dist /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx/nginx.conf /etc/nginx/conf.d

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
