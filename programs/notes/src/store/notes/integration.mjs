"use strict";
import { AppConfig } from "../../config.mjs";
import { Logger } from "../../log.mjs";
import { Notes } from "./index.mjs";
import { initConfig, setupLogger } from "./standalone.mjs";

let log;

/**
 * Function to integrate notes into a cookware product;
 * logging and project settings.
 *
 * @param {boolean} standalone For cron jobs, tests and alike
 */
export function integrate(standalone = false) {
	let cfg = AppConfig.getInstance("notes");
	if (cfg.options.store.notes) {
		Notes.options = cfg.options.store.notes;
	}
	Notes.vars.serverName = cfg.options.server.name;
	Notes.options.domain = cfg.options.domain.domain;

	if (standalone) {
		initConfig();
		setupLogger(Logger.getInstance(cfg.options.logging));
	}

	log = Logger.getInstance(cfg.options.logging);
}

export { log };
