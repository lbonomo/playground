<?php
/*
 * sudo apt-get install php8.2-curl
 * composer require automattic/woocommerce
 * 
 */
require __DIR__ . '/../vendor/autoload.php';
use Automattic\WooCommerce\Client;


$env = parse_ini_file('.env');

$woo = new Client(
    $env['woo_url'], /* URL */
    $env['woo_key'], /* Client Key */
    $env['woo_secret'], /* Secret Key */
    [
        'version' => 'wc/v3', /* API Version */
    ]
);

var_dump($woo);

?>