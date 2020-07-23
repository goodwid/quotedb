## mike-quotedb

Many moons ago, my friend and I wrote a bartender eggdrop IRC bot.  One of its features was to spout random movie quotes, and it became rather popular, so in the end we accumulated hundreds of quotes from dozens of movies and TV shows.  While the bot has been defunct for quite a while now, I decided to resurrect the quote data in a RESTful API, using Node, MongoDB, and Express.  This is that API.

It is live at https://quotedb.flaim.net/api/quotedb/v1

Valid methods/endpoints are:

Public:
* [GET all quotes](https://quotedb.flaim.net/api/quotedb/v1/quotes/)
* [GET single quote by id](https://quotedb.flaim.net/api/quotedb/v1/quotes/:id)
* [GET random quite by movie](https://quotedb.flaim.net/api/quotedb/v1/movies/random/Ghostbusters)
* [POST to sign in](https://quotedb.flaim.net/api/quotedb/v1/quotes/signin)
* [POST to sign up](https://quotedb.flaim.net/api/quotedb/v1/quotes/signup)

Requires a valid token:
* [POST to create a new quote](https://quotedb.flaim.net/api/quotedb/v1/quotes/)

Requires a valid token and an admin role:
* [PUT to edit an existing quote](https://quotedb.flaim.net/api/quotedb/v1/quotes/:id)
* [DELETE to delete an existing quote](https://quotedb.flaim.net/api/quotedb/v1/quotes/:id)




[![Build Status](https://travis-ci.org/goodwid/quotedb.svg?branch=master)](https://travis-ci.org/goodwid/quotedb)
