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
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';

/**
 * Core components.
 */

import { TextControl, PanelBody } from '@wordpress/components';

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
	const { placeholder } = attributes;
	function onChangeTextField( newValue ) {
		setAttributes( { placeholder: newValue } );
	}

	return (
		<>
			{/* Inspector panel controls */}
			<InspectorControls key="setting">
				<PanelBody title={ __( 'Search settings' ) }>
					<TextControl
						label={ __( 'Search placeholder' ) }
						help="Set the search placeholder text"
						onChange={ onChangeTextField }
						value={ placeholder }
					/>
				</PanelBody>
			</InspectorControls>
			{/* Inspector panel controls */}

			{/* Block */}
			<div { ...blockProps } >
				<form role="search" method="get" action="">
					<input type="search" placeholder={ placeholder } disabled />
					<input type="hidden" name="post_type" value="product" />
					<button type="submit" value="Buscar">Buscar</button>
				</form>
				<div id="result-3" className="search-results hidden"></div>
			</div>
			{/* Block */}
		</>
	);
}
