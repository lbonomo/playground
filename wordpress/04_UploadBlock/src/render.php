<?php
/**
 * PHP file to use when rendering the block type on the server to show on the front end.
 */


?>

<div <?php echo get_block_wrapper_attributes(); ?> >
	<form method="post" enctype="multipart/form-data" role="search" action="" role="upload-block">
		<input type="file"/>
		<input type="hidden" name="upload-block-nonce" value="<?php echo esc_attr( wp_create_nonce( 'upload-block-nonce' ) ); ?>" />
		<button type="submit" value="Buscar" class=""><?php _e("Upload") ?></button>
	</form>
</div>
