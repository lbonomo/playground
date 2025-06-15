<?php
/*
Plugin Name: Upload Block
Plugin URI: https://example.com/upload-block
Description: A simple plugin to block file uploads based on file type.
Version: 1.0
Author: Your Name
Author URI: https://example.com
License: GPL2
*/
// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}
// Hook into the 'wp_handle_upload_prefilter' filter
function upload_block_init() {
	register_block_type_from_metadata( __DIR__ . '/build' );
}
add_action( 'init', 'upload_block_init' );