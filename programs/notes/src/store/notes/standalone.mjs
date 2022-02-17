"use strict";
import { AppConfig } from "../../../generic/config.mjs";

AppConfig.getInstance("notes"); // Avoid errors during standalone tests

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

export let logOptions = {
	exitOnError: true,
	level: "debug",
	playSoundOn: {
		error: false,
		warning: false,
	},
	transports: {
		console: {
			active: true,
			format: "HH:mm:ss",
		},
		file: {
			active: true,
			dir: "/tmp/notes",
			format: "DD-MM-YYYY HH:mm:ss",
		},
		udf: {
			active: false,
		},
	},
}

export function setup(logger) {
	log = logger;
}
