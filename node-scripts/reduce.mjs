#! /usr/bin/env node

/**
 * Script to test JavaScript reduce function to produce a resulting array
 *
 * Let's do some screening of expectations 😀
 */

let current = [
	"I want to be important",
	"I want to be rich",
	"I would like to be respectable again, especially while alone",
	"I will demand housing in view of human rights",
];

console.log("Current list of expectations", current, "\n");

let revised = current.reduce((acc, item) => {
	if (item.includes("ich")) {
		acc.push("Rich? Why? An itch? And who is going to scratch on my behalf?");
	} else if (item.includes("ant")) {
		acc.push("Important? Why? Relevance?");
	} else if (item.includes("demand")) {
		return acc; // ignore demands
	} else {
		acc.push(item);
	}

	return acc;
}, []);

console.log("The same list after reducing", revised.sort());

/*

Output:

Current list of expectations [
'I want to be important',
'I want to be rich',
'I would like to be respectable again, especially while alone',
'I will demand housing in view of human rights'
]

The same list after reducing [
'I would like to be respectable again, especially while alone'
'Important? Why? Relevance?',
'Rich? Why? An itch? And who is going to scratch on my behalf?',
]

*/
