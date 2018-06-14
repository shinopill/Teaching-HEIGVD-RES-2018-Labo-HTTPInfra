FROM php:7.0-apache

COPY templates/ /var/apache2/templates
COPY conf/ /etc/apache2/
COPY ./apache2-foreground /usr/local/bin/

RUN a2enmod proxy proxy_http
RUN a2ensite 000-* 001-*


