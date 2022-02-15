"use strict";
import { AppConfig } from "../../config.mjs";
import { Logger } from "../../log.mjs";
import { Notes } from "./index.mjs";

/**
 * Function to integrate notes into a cookware product;
 * logging and project settings.
 */
export function integrate() {
	let cfg = AppConfig.getInstance();
	if (cfg.options.store.notes) {
		Notes.options = cfg.options.store.notes;
	}
	Notes.vars.serverName = cfg.options.server.name;
	Notes.options.domain = cfg.options.domain.domain;

	Notes.setLogger(Logger.getInstance());
}
