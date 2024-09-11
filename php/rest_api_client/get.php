<?php

// wp_remote_get().
// https://developer.wordpress.org/reference/functions/wp_remote_get/.

$url  = 'https://httpbin.org/get';
$curl = curl_init( $url );
// curl_setopt( $curl, CURLOPT_URL, $url );
$result = curl_exec( $curl );
curl_close( $curl );

var_dump( $result );
