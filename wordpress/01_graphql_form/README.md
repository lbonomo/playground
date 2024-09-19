# GraphQL and Qravity forms

## Resources
 - https://github.com/AxeWP/wp-graphql-gravity-forms

## Goal

 - GraphQL Client (Bruno) > WordPress > CF
 - Get from dato to render on client (Bruno)

## Installing WordPress to play.

Start Docker container with Lando

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
wp plugin install wp-graphql --activate
wp plugin install tools/plugins/gravity-forms-plugin-2.8.17.zip --activate
wp plugin install tools/plugins/wp-graphql-gravity-forms-0.13.0.1.zip --activate

# Removing useless plugins
wp plugin delete hello
wp plugin delete akismet

# Enabling logs
wp config set WP_DEBUG true --raw
wp config set WP_DEBUG_LOG true --raw
wp config set WP_DEBUG_DISPLAY true --raw
wp config set SCRIPT_DEBUG true --raw
```

## 

`https://{{base_url}}/index.php?graphql=` is equal `https://{{base_url}}/graphql/`

## Project structure.
  - `.wp-cli`: WordPerss CLI config
  - `wordpress`: WordPress core and third-parties code. 
  - `tools`: Plugins and files necessaries for this example.
