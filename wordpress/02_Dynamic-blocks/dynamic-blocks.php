<?php
/**
 * Plugin Name:       Example Interactive TypeScript
 * Description:       An interactive block with the Interactivity API using TypeScript.
 * Version:           0.1.0
 * Requires at least: 6.6
 * Requires PHP:      7.2
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       dynamic-blocks
 *
 * @package           dynamic-blocks
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function dynamic_blocks_dynamic_blocks_block_init() {
	register_block_type_from_metadata( __DIR__ . '/build' );
}
add_action( 'init', 'dynamic_blocks_dynamic_blocks_block_init' );
