"use strict";

// To be replaced by lib/log.mjs during integration
export let log = {
	debug: function(...pars) {
		console.log(...pars);
	},
	error: function(...pars) {
		console.log(...pars);
	},
	info: function(...pars) {
		console.log(...pars);
	},
};

export function setup(logger) {
	log = logger;
}
