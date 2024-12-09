/**
 */
// import {select,dispatch} from '@wordpress/data'
import apiFetch from '@wordpress/api-fetch';

apiFetch( { path: '/wp/v2/posts' } ).then( ( posts ) => {
	posts.map( ( post ) => {
		console.log( post.title.rendered );
	} );
} );



