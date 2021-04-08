# Setting up a development environment

To get an environment running you first need to grab a postgresql database (i use heroku for my development environment)
which you put in the config of either the old-server or the new elixir server depending on which one you want to use.

To build all library/package in development/watch mode run `yarn build dev` and you can add `--exclude list,of,ids` to
not do that. I tend to exclude web and run `yarn workspace @collaborated/web next dev` separately so it's easier to see
in my IDE
