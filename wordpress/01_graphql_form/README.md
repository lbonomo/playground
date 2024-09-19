# GraphQL and Qravity forms

## Installing WordPress to play.
```
lando start
lando ssh
```

Now into Docker container
```
wp core download

wp config create \
  --dbname=wordpress \
  --dbuser=wordpress \
  --dbpass=wordpress \
  --dbhost=database

wp core install \
  --url=https://graphql_form.lndo.site/ \
  --title="My First Wordpress App" \
  --admin_user=admin \
  --admin_password=password \
  --admin_email=admin@graphql-form.lndo.site

touch /app/wordpress/.htaccess # Until the file creation issue was fixed.
wp rewrite flush --hard

# Installing necessary plugins
wp plugin install tools/plugins/gravity-forms-plugin-2.8.17.zip --activate
wp plugin install wp-graphql --activate

# Removing useless plugins
wp plugin delete hello
wp plugin delete akismet

# Enabling logs
wp config set WP_DEBUG true --raw
wp config set WP_DEBUG_LOG true --raw
wp config set WP_DEBUG_DISPLAY true --raw
wp config set SCRIPT_DEBUG true --raw
```

