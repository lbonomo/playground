/**
 * WordPress dependencies
 */
import { store } from '@wordpress/interactivity';

store ({
	'dynamic-blocks': {
		actions: {
			search:({ context }) => {
				context.showResult = ! context.showResult;
				console.log(context.showResult)
			}
		}
	}
})