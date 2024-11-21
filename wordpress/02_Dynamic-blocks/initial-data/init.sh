#! /bin/bash
posts=($(wp-env run cli wp post list --post_type=page,post --format=ids))
# posts=$(wp-env run cli wp post list --post_type=page,post --format=ids)
size=${#posts[@]}
# if there is just one post, import pages and posts.
if [[ $size -lt 5 ]]; then
	# Remove previus pages and post.
	for id in $posts; do
		wp-env run cli wp post delete $id --force
	done

	wp-env run cli wp import --authors=create ./initial-data/pages.xml
	wp-env run cli wp import --authors=create ./initial-data/posts.xml
	frontpage=$(wp-env run cli wp post list --post_type='page' --post_status='publish' --format=ids)
	wp-env run cli wp option update show_on_front page
	wp-env run cli wp option update page_on_front $frontpage
fi
