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
		'showResult' => false,
		'resultHTML' => ''
	)
);

$context = array('searchTerm' => false);

?>

<div
	<?php echo get_block_wrapper_attributes(); ?>
	data-wp-interactive="dynamic-blocks"
	data-wp-effect="effects.showResult"
	data-wp-watch="callbacks.isThereData"
	
	aria-controls="<?php echo esc_attr( $result_id ); ?>"
	data-wp-context='{"showResult": false}'
	
>
	<form role="search" method="get" action="">
		<input
			data-wp-watch="callbacks.isThereData"
			data-wp-on--keyup="actions.search"
			data-wp-bind--aria-expanded="context.searchTerm"
			
			type="search" 
			placeholder="<?php echo esc_attr( $attributes['placeholder'] ); ?>"
			value=""
			autocomplete="off"
			name="s"
		/>
		<input type="hidden" name="post_type" value="product" />
		<button type="submit" value="Buscar" class="">Buscar</button>
	</form>
	<div 
		id="<?php echo esc_attr( $result_id ); ?>"
		class="search-results"
		data-wp-text="state.resultHTML"
		data-wp-bind--hidden="!context.showResult"
		data-wp-show="!context.showResult"
		data-wp-bind--aria-expanded="context.showResult"
	>
	</div>

</div>
