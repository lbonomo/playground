<?php
/**
 * PHP file to use when rendering the block type on the server to show on the front end.
 *
 * The following variables are exposed to the file:
 *     $attributes (array): The block attributes.
 *     $content (string): The block default content.
 *     $block (WP_Block): The block instance.
 *
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */

// Generates a unique id for aria-controls.
$unique_id = wp_unique_id( 'p-' );
$result_id = wp_unique_id( 'result-' );

// Adds the global state.
wp_interactivity_state(
	'dynamic-blocks',
	array(
		'isDark'    => false,
		'darkText'  => esc_html__( 'Switch to Light', 'dynamic-blocks' ),
		'lightText' => esc_html__( 'Switch to Dark', 'dynamic-blocks' ),
		'themeText'	=> esc_html__( 'Switch to Dark', 'dynamic-blocks' ),
	)
);
?>

<div
	<?php echo get_block_wrapper_attributes(); ?>
	data-wp-interactive="dynamic-blocks"
	<?php echo wp_interactivity_data_wp_context( array( 'isOpen' => false ) ); ?>
	data-wp-watch="callbacks.logIsOpen"
	data-wp-class--dark-theme="state.isDark"
>
	<button
		data-wp-on--click="actions.toggleTheme"
		data-wp-text="state.themeText"
	></button>

	<button
		data-wp-on--click="actions.toggleOpen"
		data-wp-bind--aria-expanded="context.isOpen"
		aria-controls="<?php echo esc_attr( $unique_id ); ?>"
	>
		<?php esc_html_e( 'Toggle', 'dynamic-blocks' ); ?>
	</button>

	<p
		id="<?php echo esc_attr( $unique_id ); ?>"
		data-wp-bind--hidden="!context.isOpen"
	>
		<?php
			esc_html_e( 'Example Interactive TypeScript - hello from an interactive block!', 'dynamic-blocks' );
		?>
	</p>


	<div
		<?php echo get_block_wrapper_attributes(); ?>
		data-wp-interactive="uou-simple-block-search"
		data-wp-context="{}"
	>

		<form role="search" method="get" action="">
			<input
				data-wp-on--keyup="actions.search" 
				type="search" 
				placeholder="Buscar productos…" 
				value=""
				autocomplete="off"
				name="s"
			/>
			<input type="hidden" name="post_type" value="product" />
			<button type="submit" value="Buscar" class="">Buscar</button>
		</form>
		<div aria-controls="<?php echo esc_attr( $result_id ); ?>" class="search-results"></div>
	</div>
</div>
