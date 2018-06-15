# Labo HTTP-Infra

## Introduction
This repo is used for the HTTP-Labo made for the RES course at the HEIG-VD

## Part 1 : static HTTP sever with apache

### DockerFile :
```
FROM php:7.0-apache

COPY content/ /var/www/html/
```
As you can see, just copy the content of the content directoy in docker. So if you want to modify the server change the files inside this  folder.
### How to run it :

```
go to /docker-images/apache-php-image
docker build -t nameOfCountainer .
docker run -p 9090:80 (-d if you want to run in background) nameOfCountainer
```
With this you can access with the apache in your webbrowser at the port 9090

## Part 2 : dynamic express with express.js

### DockerFile

```
FROM node:8.11.2

COPY src /opt/app

CMD ["node","/opt/app/index.js"]
```

Like in part 1 if you want to change the countent of the express apache you have to change rhe src folder.

### How to run it

```
go to /docker-images/express-image
docker build -t nameOfCountainer .
docker run -p 9091:3000 (-d if you want to run in background) nameOfCountainer
```

If you make a request at you docker ip and port 9091, you will receive a JSON with random city names in it.
## Part 3 : Reverse Proxy static

### DockerFile :

```
FROM php:5.6-apache

COPY conf/ /etc/apache2/

RUN a2enmod proxy proxy_http
RUN a2ensite 000-* 001-*
```

### configuration of reverse proxy

The file that is important to us is the 001-reverse-proxy.conf :

```
<VirtualHost *:80>
    ServerName demo.res.ch

    ProxyPass '/api/city' 'http://172.17.0.3:3000/'
    ProxyPassReverse '/api/city' 'http://172.17.0.3:3000/'

     ProxyPass '/' 'http://172.17.0.2:80/'
     ProxyPassReverse '/' 'http://172.17.0.2:80/'

</VirtualHost>
```

Before you try to run docker images, you have to link your host to the name demo.res.ch. You will ahve to edit the host file that is in the following path:
```
    - /etc/hosts on unix
    -C:\Windows\System32\Drivers\etc
```

As i can see i hardcoded the IP addresses of our countainers So you have to run the dcoker images in the order as follow :

```
cd /docker-images/apache-reverse-proxy (to do if you didn't build the image)
docker build -t apache_reverse_proxy . (to do if you didn't build the image)
docker run  -d apache_php_images
docker run  -d express_images
docker run -p 8080:80 -d apache_reverse_proxy
```

Then you can test in your webbrowser at demo.res.ch:8080 if see the site in Part 1.

## Part 4 : Ajax requests
In order to make this part, i just had to change our index.html and insert a line to load our AJAX script

### Configuration of AJAX
```
<!-- Custom scripts AJAX -->
<script src="js/city.js"></script>
```

Then i made a script that get a random city and change one of the header in our index.html file

```
$(function(){
    console.log("Loading cities");

    function loadCities() {
        $.getJSON("/api/city",function(cities) {
            var message = "No cities nearby";
            if (cities.length > 0){
                message = cities[0].city ;
            }
            $('.brand-heading').text(message);
        });
    }

    loadCities();
    setInterval(loadCities,2000);
});
```


Then i just did the same thing as Part 2 : How to run it.

## Part 5 : Dynamic Reverse Proxy

### Configuration of Reverse Proxy

For this part, i had to make the proxy dynamic. In order to do this i copied the apache2-forground from the github repo from php 7.0.


Once this done, i changed the DockerFile:

```
FROM php:7.0-apache

COPY templates/ /var/apache2/templates

COPY conf/ /etc/apache2/

COPY ./apache2-foreground /usr/local/bin/

RUN a2enmod proxy proxy_http
RUN a2ensite 000-* 001-*

```

Then i created a config-template.php in the templates folder. H

```
<?php
  $dynamic_app = getenv('DYNAMIC_APP');
  $static_app = getenv('STATIC_APP');
?>
<VirtualHost *:80>
    ServerName demo.res.ch

    ProxyPass '/api/city' 'http://<?php print "$dynamic_app"?>/'
    ProxyPassReverse '/api/city' 'http://<?php print "$dynamic_app"?>/'

    ProxyPass '/' 'http://<?php print "$static_app"?>/'
    ProxyPassReverse '/' 'http://<?php print "$static_app"?>/'

</VirtualHost>

```

This is the file you want to change if you want to add dynamic countainer. the changes will be the following :

```
//add a variable in php
$name = geten(NAME_OF_THE_ENV_VARIABLE)

//Make another rule for proxy in order to acces your container
ProxyPass '/url' 'http://<?php print "$name"?>/'
ProxyPassReverse '/url' 'http://<?php print "$name"?>/'
```

Once this is all done, i done i changed the apache-foreground with the following line :

```
php /var/apache2/templates/config-template.php > /etc/apache2/sites-available/001-reverse-proxy.conf
```

Once againt if you have another template.php for your rules you juste have to change the /var/apache2/templates/config-template.php with your template path.

### How to use it :

You have to do the following steps :

Launch the apache_php and express containers:
```
docker run -d apache
docker run -d express
````

Then you have to find the local ipadress of the countainers :

```
docker inspect nameOfRunningApacherContainer | grep -i ipaddr
docker inspect nameOfRunningExpressContainer | grep -i ipaddr
```

Once this is done you have to launch the reverser proxy :
```
docker run -e STATIC_APP=ipaddrOfRunningApacheContainer:80 -e DYNAMIC_APP=ipaddOfRunningExpresContainer:3000 -p 8080:80 -d nameOfReversProxyImage
```

Then you load check at demo.res.ch:8080 if this worked

## Managment UI

For managment UI : use Portainer at the address https://portainer.io/install.html
It's an easy to use UI for your docker.
All the installation process is explain in the link above.

Once it is installed you can just run it with :

```
docker run -d -p 9000:9000 -v /var/run/docker.sock:/var/run/docker.sock -v portainer_data:/data portainer/portainer
```