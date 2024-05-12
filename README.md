# Square

This is a sample Angular 17 project that loads posts from the
[jsonplaceholder](https://jsonplaceholder.typicode.com/) API.
It displays the post titles as squares on a grid.
By clicking on a post, you can select it.
By clicking multiple times on a selected post,
you can cycle through the other properties of the post:
User ID, Post ID, and Post body. The goal of the project is
to demonstrate the code structure of a simple app using
Angular with effective state management.

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

On top of what comes standard with Angular,
the project makes use of
some further technologies. These are:

-   [NGXS](https://www.ngxs.io/) for state management.
-   [TailwindCSS](https://tailwindcss.com/) for styling.
-   [Angular Material](https://material.angular.io/)
    for theming and prebuilt UI elements.
-   [ESLint](https://eslint.org/) for code linting.
-   [Ramda](https://ramdajs.com/)
    for functional programming style when beneficial.

I chose NGXS as the state management library
because it was designed to be relatively lightweight
and low-boilerplate. It makes a few simplifications
of the patterns seen in other libraries like NgRx.
It is a good fit because this project is always intended
to stay very small.

## Browser support

I sanity checked the app in Chrome, Brave, and Safari,
using the latest MacOS desktop versions of the browsers
that existed at the time.
More information about Angular browser support can be found
[here](https://angular.io/guide/browser-support).

## Additional questions

I was asked a few other questions in relation to this project.
Please see my responses below.

### 1. What are the security implications of using JSON Web Tokens (JWTs)?

JWTs are a reasonable way to secure your application.
However, it is important that they are [signed](https://jwt.io/introduction) to prevent
them from being tampered with by a malicious actor.

Additionally, it is important to consider the risk that the
JWT could fall into the hands of hackers. If a hacker were
to get access to a user's access token in JWT form, they
could access the application as that user in an attack called
_session hijacking_. Some ways to mitigate this risk are:

1. Ensure access tokens are never exposed in logs.
2. Ensure access tokens are kept out of URLs.
   This might be achieved by using the OpenID Connect (OIDC)
   auth code flow with PKCE and not the implicit flow.
3. Ensure access tokens have a short expiration period.
   That way, in the worst case scenario where it is leaked, it
   hopefully expires before a hacker has time to do much damage
   with it.
4. Keep access tokens out of local / session storage. It
   could be easily accessed by malicious JavaScript there in
   case of a [Cross Site Scripting (XSS)](https://owasp.org/www-community/attacks/xss/) attack. Instead, you could keep
   it in memory or use Web Workers.

### 2. What are the security implications of sending messages that contain HTML? What are 2 potential attack vectors, and how could you mitigate them?

#### Cross Site Scripting (XSS)

One obvious risk of HTML email is that it can potentially
allow the sender to input malicious JavaScript and
run it on the receiver's computer without them knowing.
This vulnerability is often referred to as
[Cross Site Scripting (XSS)](https://owasp.org/www-community/attacks/xss/).
Such a script could, for example,
gather the receiver's confidential
data from their device and submit it to a third party API.
At the very least,
it exposes the user to unwanted tracking and being spied on
by an interested actor. However, if the confidential
accessible data includes access tokens, it
could potentially facilitate session hijacking as well.
Some potential ways for the email client to mitigate this
risk are:

1. Disallowing `script` or `iframe` tags in emails altogether.
2. Keeping access tokens and any
   other highly sensitive user data out of
   local / session storage.
3. Proper use of [Content Security Policy header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy).
4. Running any email HTML input through a credible [sanitizer](https://owasp.org/www-project-java-html-sanitizer/)
   before sending to catch known vulnerabilities.

#### Phishing

Another vector an attacker can use is to employ features
of HTML, like embedded image files or CSS styling, to
closely imitate a trustworthy organization's visual
brand. This can help to lure receivers
into a false sense of security,
because the email looks exactly like those they are
used to receiving from a company they really trust. Thus,
they are more likely to follow prompts to download malicious
files or follow a malicious third-party link. This type of
attack is called _phishing_ and is part of a
broader category called _social engineering_.
_Phishing_ via email has been
linked to major hacks, such as the
[2014 Sony Pictures hack](https://www.sipa.columbia.edu/sites/default/files/2022-11/Sony%20-%20Written%20Case.pdf).

Ways to mitigate this risk might include:

1. Prompts inside the email client
   educating end users and reminding them to treat
   links / files in emails with suspicion.
2. Effective spam email filters.

### 3. What is the difference between mutable and immutable objects? Explain the pros and cons of immutability and how you achieve immutability in your own code.

A mutable object's contents can be changed after it has been
created. For example, you might reassign
or increment a property of a `Person` object as follows:

```
const ageJill = (): void => {
    const jill = new Person();
    jill.age = 42;
    jill.age++;
    console.log(jill.age); // 43
}

ageJill();
```

Some mutable objects may make use of mutating
methods like 'setter' methods instead of
directly accessing properties.
This is a common pattern in some other
popular languages like Java.
This adds a layer of indirection, but the
object's state can still be considered ultimately mutable.
For example:

```
const ageJill = (): void => {
    const jill = new Person();
    jill.setAge(42);
    jill.incrementAge();
    console.log(jill.getAge()); // 43
}

ageJill();
```

On the other hand, immutability means that,
once an object has been created,
nothing about its content can be changed. This includes not
only public properties, but also the encapsulated private
internal state of the object: an immutable object should never
have 'setter' methods or other impure methods that have side effects on the object's internal state.

In my TypeScript code, I use immutable objects
everywhere unless there is a specific
and compelling reason not to. I do this because I feel the
pros of immutability strongly outweigh the cons in TypeScript
programming in almost all scenarios.

#### Pros of immutability

Some advantages of immutability are:

1. Thread safety: Can help to reduce the risk of bugs
   in asynchronous code, e.g. race conditions where the same
   shared object is mutated in multiple threads in an undefined
   order.

2. Testability: reduces risk of hidden dependencies between
   unit tests that reference the same shared object, e.g. tests
   passing when called in a certain order, but failing
   when called in a different order.

3. Caching: Immutable objects can be more easily cached
   because their contents do not change over time.

4. Developer productivity: Reduces the cognitive overhead of
   developers considering if their object
   could have been unexpectedly modified by some other
   code in the project they were not aware of. Personally, I
   find this helps me focus and makes me more productive.

#### Cons of immutability

The major disadvantage of immutability is performance. If
you make new copies of immutable objects rather than mutating
existing ones in place, that can use more memory and require
more CPU cycles. If you are working on a application where
optimal performance is absolutely critical, for example, a
game engine in C++, this can be a big deal. However, in my
opinion, in the context of a typical
TypeScript web app, the overhead
is normally acceptable.
This is especially true if the developer is aware
of the problem and willing to fall back on mutable objects
in the handful of cases where it is really important for
performance.

Another disadvantage of immutability is that, in languages
like TypeScript where data is not immutable
by default, you can need to
introduce additional boilerplate or external libraries to
attain immutability. Whereas pure
Functional Programming (FP) languages
like Haskell have immutability baked in as a core principle,
JavaScript was not designed with immutability in mind. This
can increase the complexity of your TypeScript code and make
it slower to write.

Related to the above issue is the problem of accessibility to
novice developers. Many 'beginner languages' that developers
tend to start out with, such as Python or Vanilla JS, do not
handle immutability well and tend to have mutable objects
everywhere across codebases as the default. It is rare for
new developers to start with an FP language like Haskell. So
TypeScript code with immutable objects is likely to pose more
of an obstacle for junior developers.

#### Immutability in Vanilla JS

There are ways to try and produce immutable objects
at runtime in compiled JavaScript code, but personally I am
not sure they are the best solution to the problem. The
most common way is the
[Object.freeze](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze)
static method. However, the downside of this is that
attempting to mutate a frozen object can throw an error
at runtime. If it is not caught this can break your app for
the end user, or at the very least produce an error in
the console that looks unprofessional.

Accordingly, rather than focusing on immutability at runtime,
I like to use TypeScript's features to catch issues
at compile time instead. This means that attempts to mutate
an immutable object are caught early, not through end users'
complaints.

#### Immutability in TypeScript

To help ensure immutability when declaring a type, I make
heavy use of TypeScript's built-in
[Readonly utility type](https://www.typescriptlang.org/docs/handbook/utility-types.html#readonlytype).
For example, see how the [`Post` type](https://github.com/TobyBladen/square/blob/main/src/app/types/post/post.type.ts)
is declared in the current project. This helps to prevent
any properties of the object being reassigned. There is
currently an
[open issue](https://github.com/microsoft/TypeScript/issues/13347)
about the odd behaviour of `readonly`
in TypeScript in some limited circumstances.
But I find it is still useful in most cases
and I am keeping track of progress on the problem.

Similarly, I always mark individual properties of a
component or service as `readonly` if they are never
reassigned outside the constructor. For example, see
the [AppComponent](https://github.com/TobyBladen/square/blob/main/src/app/app.component.ts) in the current project.

Additionally, when a property of an immutable object
is an array, I use the built-in
[ReadonlyArray](https://www.geeksforgeeks.org/typescript-object-the-readonlyarray-type/) type. This
helps to prevent you from mutating the internal state
of the array. For example, see the [AppStateModel](https://github.com/TobyBladen/square/blob/main/src/app/state-management/app.state.model.ts#L6) type in
this project.

#### A Note on state management

As I indicated, I normally try and use immutable objects
everywhere I can. However, there are some cases where some
globally mutable state is unavoidable. In these cases, I like
to use a state management library like
[NGXS](https://www.ngxs.io/).
An NGXS state can only be mutated by dispatching predefined
actions, inspired by the Flux pattern. While the
state is still ultimately mutable, it restricts your
ability to interact with the state outside of specific,
explicit ways. It also provides great debugging tools
for you to step back through the actions that were dispatched.
This helps to mitigate some of the issues with mutability,
such as the mental overhead for a developer of keeping track
of how an object was mutated and by which parts of the app.

### 4. How can you speed up the loading of an Angular web-application?

First, try and diagnose what the bottleneck is. It is
just assets like image files that are loading slowly?
Or is the problem bundle size? Or all your users are in
a country that's geographically far away? Depending on the
source of the issue, you could consider some of the following:

-   Eliminate any [CommonJS dependencies](https://web.dev/articles/commonjs-larger-bundles)
-   Use a reputable Content Delivery Network (CDN)
    like [CloudFront](https://aws.amazon.com/cloudfront/)
    to cache assets geographically closer
    to your users.
-   Check you are using [lazy-loading](https://angular.io/guide/standalone-components#lazy-loading-a-standalone-component) wherever possible
-   Check your compiled JS and CSS code is minified
-   Compress assets like image files to be a smaller size
-   Consider implementing [Server Side Rendering](https://angular.io/guide/ssr)

### 5. Would you rather have free choice over software or hardware as a developer?

As a web developer, I would rather have free choice
over software. It's rare that you will need very high
performance hardware for your regular work laptop
in this line of programming and,
if you find yourself needing it,
it's possible you are doing something wrong anyway. If I were
working in computer graphics then the hardware can certainly
be crucial. But for just building normal
websites, mediocre hardware
ought to be fine.

On the other hand, needing to install a new software
tool is something that happens to me
all the time. Even something
as simple as having the right IDE / Code Editor can make an
enormous difference to developer productivity. Getting
blocked by overzealous company firewalls,
and so on, can be a real drag on development. Sometimes it
can be a necessary evil in some security contexts. But
I would not choose to have **unnecessary** restrictions on
software if it could reasonably be avoided.
