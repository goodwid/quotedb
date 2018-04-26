## mike-quotedb

Many moons ago, my friend and I wrote a bartender eggdrop IRC bot.  One of its features was to spout random movie quotes, and it became rather popular, so in the end we accumulated hundreds of quotes from dozens of movies and TV shows.  While the bot has been defunct for quite a while now, I decided to resurrect the quote data in a RESTful API, using Node, MongoDB, and Express.  This is that API.

It is live at https://mike-quotedb.herokuapp.com/api/quotedb/v1

The data format is JSON:
``` json
{
  "data":"<Vizzini>Inconceivable!\n<Inigo Montoya> You keep using that word.  I do not think it means what you think it means.",
  "movie":"The Princess Bride",
  "series":""
}
```
The series field is intended for movies series, support will be implemented later.


Valid methods/endpoints are:

Public:
* [GET all quotes](https://mike-quotedb.herokuapp.com/api/quotedb/v1/quotes/)
* [GET single quote by id](https://mike-quotedb.herokuapp.com/api/quotedb/v1/quotes/:id)
* [GET random quote by movie](https://mike-quotedb.herokuapp.com/api/quotedb/v1/movies/random/:movie)
* [POST to sign in](https://mike-quotedb.herokuapp.com/api/quotedb/v1/quotes/signin)
* [POST to sign up](https://mike-quotedb.herokuapp.com/api/quotedb/v1/quotes/signup)


Requires a valid token:
* [POST to create a new quote](https://mike-quotedb.herokuapp.com/api/quotedb/v1/quotes/)

Requires a valid token and an admin role:
* [PUT to edit an existing quote](https://mike-quotedb.herokuapp.com/api/quotedb/v1/quotes/:id)
* [DELETE to delete an existing quote](https://mike-quotedb.herokuapp.com/api/quotedb/v1/quotes/:id)




[![Build Status](https://travis-ci.org/goodwid/quotedb.svg?branch=master)](https://travis-ci.org/goodwid/quotedb)