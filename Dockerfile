FROM nginx:alpine

COPY ./dist /usr/share/nginx/html

RUN ["rm", "/etc/nginx/conf.d/default.conf"]

COPY ./default.conf /etc/nginx/conf.d

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]