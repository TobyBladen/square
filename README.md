# Square

This is a sample Angular 17 project that loads posts from the
[jsonplaceholder](https://jsonplaceholder.typicode.com/) API.
It displays the post titles as squares on a grid.
By clicking on a post, you can select it.
By clicking multiple times on a selected post,
you can cycle through the other properties of the post:
User ID, Post ID, and Post body. The goal of the project is
to demonstrate the code structure of a simple app using
Angular with [NGXS](https://www.ngxs.io/) state management.

I chose NGXS as the state management library
because it was designed to be relatively lightweight
and low-boilerplate. It makes a few simplifications
of the patterns seen in other libraries like NgRx.
It is a good fit because this project is always intended
to stay very small.

_NB You should be familiar with the standard NGXS architecture
to fully understand this codebase. It differs from other popular
state management libraries like NgRx in important ways.
You can access detailed, excellent documentation about the
library [here](https://ngxs.io/)._

## Running the project

First, install dependencies:

`npm i`

You can then run the app:

`npm run start`

Navigate to [localhost port 4200](http://localhost:4200/)
in your browser of choice to view it.

If you like, you can also lint the project using ESLint:

`npm run lint`

or run unit tests using Karma/Jasmine:

`npm run test`

## Technologies

On top of Angular and NGXS,
the project makes use of
some further technologies. These are:

-   [TailwindCSS](https://tailwindcss.com/) for styling.
-   [Angular Material](https://material.angular.io/)
    for theming and prebuilt UI elements.
-   [ESLint](https://eslint.org/) for code linting.
-   [Ramda](https://ramdajs.com/)
    for functional programming style when beneficial.

## Browser support

I sanity checked the app in Chrome, Brave, and Safari,
using the latest MacOS desktop versions of the browsers
that existed at the time.
More information about Angular browser support can be found
[here](https://angular.io/guide/browser-support).

## Copyright

Copyright Toby Bladen, 2024.
