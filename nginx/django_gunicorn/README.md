# nginx multi sites.

If we want to run it monually in other king of containter, we can use the next lines.

```
$ docker run -it -p 80:80 -v ./sites-available:/etc/nginx/sites-available -v ./www:/var/www/ ubuntu:jammy bash
```

```
apt-get update
apt-get -y upgrade
apt-get -o Dpkg::Options::="--force-confdef" -o Dpkg::Options::="--force-confold" install nginx -y
/etc/init.d/nginx start
```


## Python
Curren LTS version is 3.12

https://devguide.python.org/versions/