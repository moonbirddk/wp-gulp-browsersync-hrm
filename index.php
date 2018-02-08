<?php get_header(); ?>
<main>
	<div class="page container">

		<?php if (have_posts()) : while (have_posts()) : the_post(); ?>
				
			<div class="post" id="post-<?php the_ID(); ?>">

				<h2 class=""><?php the_title(); ?></h2>

				<div class="entry ">
				
					<?php the_content(); ?>

					<?php wp_link_pages(array('before' => 'Pages: ', 'next_or_number' => 'number')); ?>

				</div>

	    </div>
			<?php endwhile;
		endif; ?>
	</div>
</main>
<?php get_footer(); ?>