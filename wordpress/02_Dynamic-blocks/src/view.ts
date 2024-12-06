/**
 * WordPress dependencies
 */
import { store, getContext } from '@wordpress/interactivity';
import { createElement, render } from 'preact';

type ServerState = {
	state: {
		searchTerm: string;
		searchResults: {
			posts: WP_Post[];
		};
	};
};

// TODO: Maybe existe somthing oficial.
type WP_Post = {
	id: number;
	link: string;
	title: { rendered: string };
	content: { rendered: string };
	excerpt: { rendered: string };
	date: string;
	slug: string;
	status: 'publish' | 'draft' | 'pending';
	type: 'post' | 'page' | string;
	_embedded: any;
};

const storeDef = {
	actions: {
		search: ( event:any ) => {
			const term = event.currentTarget.value
			if ( term.length > 3 ) {
				search_products( term )
			}
		}
	},
	callbacks: {
		isThereData: () => {
			const context = getContext();
			// Log the value of `isOpen` each time it changes.
			console.log(`Is open: ${context}`);

		},
	}
};

type Store = ServerState & typeof storeDef;

const { state } = store< Store >( 'dynamic-blocks', storeDef );

const search_products = async( term: string ) => {
	const formData = new FormData();
	formData.append("term", term);
	// &_embed - Get embed data.
	// search=${term} - Term to seach.
	// search_columns=post_title - Seach just on post_title
	// _fields=id,title,link,_links,_embedded - Just get id, title and embed fields
	var url = `?rest_route=/wp/v2/posts&_embed&search_columns=post_title&_fields=id,title,link,_links,_embedded&search=${term}`

	const products = await fetch(url);
	
	renderResult( await products.json() )
}

const renderResult2 = async( posts:WP_Post[]) => {
	var innerHTML = ''
	posts.forEach(post => {
		let image = post._embedded?.['wp:featuredmedia'][0].media_details?.sizes.thumbnail.source_url
		innerHTML += `
		<div class="line">
			<a href="${post.link}">
				<img src="${image}" />
				<h2>${post.title.rendered}</h2>
			</a>
		</div>
		`;
	});
	// const postDiv = document.createElement("div");
	// postDiv.innerHTML = innerHTML;
	// console.log(postDiv)
	// return postDiv
	console.log(innerHTML)
	return innerHTML
}


const renderResult = async( posts:WP_Post[] ) => {

	var innerHTML = ''
	
	posts.forEach(post => {
		let image = post._embedded?.['wp:featuredmedia'][0].media_details?.sizes.thumbnail.source_url
		innerHTML += `
		<div class="line">
			<a href="${post.link}">
				<img src="${image}" />
				<h2>${post.title.rendered}</h2>
			</a>
		</div>
		`;
	});

	let vdom = createElement(
		'p',              // a <p> element
		{ class: 'big' }, // with class="big"
		innerHTML    // and the text "Hello World!"
	);

	render(vdom, document.body);
}