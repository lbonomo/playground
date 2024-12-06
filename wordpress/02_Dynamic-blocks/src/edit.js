/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, useState, InspectorControls } from '@wordpress/block-editor';

/**
 * 
 */

import { TextControl,PanelBody } from '@wordpress/components';
// import { InputControl } from '@wordpress/components';
// import { useState } from 'react';
// import { useState } from 'preact';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @param {Object}   props               Properties passed to the function.
 * @param {Object}   props.attributes    Available block attributes.
 * @param {Function} props.setAttributes Function that updates individual attributes.
 *
 * @return {Element} Element to render.
 */
export default function Edit( { attributes, setAttributes } ) {
	const blockProps = useBlockProps();
	// const [ value, setValue ] = useState( '' );
	const { placeholder } = attributes;
	// const columnStyles = { columnCount };
	// const [ value, setValue ] = useState( '' );
	const [ value, setValue ] = ['',''];

	function onChangeTextField( newValue ) {
		setAttributes( { placeholder: newValue } );
	}

	return (
		<div { ...blockProps } >
			<InspectorControls key="setting">
				<PanelBody title={ __( 'Settings' ) }>
					<TextControl
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						label="Search placeholder"
						help="Set the search placeholder text"
						onChange={ onChangeTextField }
						value={ placeholder }
					/>
				</PanelBody>
			</InspectorControls>
			
			<form role="search" method="get" action="">
				<input type="search" placeholder={ placeholder } disabled />
				<input type="hidden" name="post_type" value="product" />
				<button type="submit" value="Buscar">Buscar</button>
			</form>
			<div id="result-3" className="search-results hidden"></div>
		</div>
	);
}
