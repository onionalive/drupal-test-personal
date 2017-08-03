# templates/

Templates provide HTML markup and some presentation logic. In Drupal 8 template files (.html.twig files) *must* be stored in the 'templates' sub folder.

If you follow particular naming conventions, then Drupal will replace the default core templates by the ones you provide, allowing you to override the default markup.

For example

`page.html.twig` in this folder will override the core page template.
`page--front.html.twig` will override the default core front page template.

More information can be found[here](https://www.drupal.org/node/2354645)
