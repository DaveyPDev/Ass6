### Conceptual Exercise

Answer the following questions below:

- What are some ways of managing asynchronous code in JavaScript?

	* 	Callbacks, promises, await

- What is a Promise?
	* a value thats available at a later time thats resolved with a value or an error

- What are the differences between an async function and a regular function?
	- regular functions are executed line by line
	- async await for a promise resolve to execute

- What is the difference between Node.js and Express.js?
	- node is JS that allows you to run code outside the browser server side.
	- express is a web app framework that runs over node adding more utilites.

- What is the error-first callback pattern?
	- checks if there is an error and if no error runs the else.

- What is middleware?
	- it allows the processing requests like error handling and authentication

- What does the `next` function do?
	- after the completion of a middleware functon it uses next to run the next middleware or route.

- What are some issues with the following code? (consider all aspects: performance, structure, naming, etc)
	-  	promise.all would make running them easier
	-   no error handling

```js
async function getUsers() {
  const elie = await $.getJSON('https://api.github.com/users/elie');
  const joel = await $.getJSON('https://api.github.com/users/joelburton');
  const matt = await $.getJSON('https://api.github.com/users/mmmaaatttttt');

  return [elie, matt, joel];
}
```
