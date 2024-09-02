# nginx https.

If we want to run it monually in other king of containter, we can use the next lines.

To create de certificate and key
```
openssl req -x509 -out localhost.crt -keyout localhost.key \
  -newkey rsa:2048 -nodes -sha256 -days 3650 \
  -subj '/CN=localhost' -extensions EXT -config <( \
   printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")
```


```
docker run -it -p 80:80 -p 443:443 -v ./conf.d/:/etc/nginx/conf.d/ -v ./www/:/var/www/ nginx:stable-alpine
```

