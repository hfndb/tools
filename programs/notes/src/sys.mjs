"use strict";
import { join } from "node:path";
import shelljs from "shelljs";
import { AppConfig } from "./config.mjs";
import { Logger } from "./log.mjs";
const { cd, chmod, cp, exec, mkdir, mv, pwd, rm, sed, test, touch } = shelljs;

// Shorthand since shelljs isn't an ESM package
export { cd, chmod, cp, exec, mkdir, mv, pwd, rm, sed, test, touch };

/**
 * Outgoing to system level
 */
export class SysUtils {
	/**
	 * Shortcut to explicitely use a bash shell
	 *
	 * @param {string} cmd Command
	 * @param {boolean} silent
	 * @param {boolean} snc Async or not
	 * @returns {Object}
	 */
	static execBashCmd(cmd, silent = false, snc = false) {
		return exec(cmd, {
			async: snc,
			silent: silent,
			shell: "/usr/bin/bash",
		});
	}
	/**
	 * Play an audio file
	 *
	 * @param {string} file Relative to program dir
	 * @todo Bug, package cannot find mplayer
	 */
	static async playFile(file) {
		let cfg = AppConfig.getInstance();
		let fullPath = join(cfg.dirMain, file);
		if (!test("-f", fullPath)) {
			throw new Error(
				`File ${file} doesn't exist. Current working directory: ${process.cwd()}`,
			);
		}
		try {
			exec(`${cfg.options.sys.audio.player} ${fullPath}`, {
				async: true,
				silent: true,
			});
		} catch (error) {
			let log = Logger.getInstance();
			log.warn(error);
		}
	}

	/**
	 * @param {string} msg
	 */
	static notify(msg) {
		let cfg = AppConfig.getInstance();
		if (!cfg.options.sys.notifications.command) return;
		let cmd =
			cfg.options.sys.notifications.command +
			' "' +
			msg +
			'" ' +
			cfg.options.sys.notifications.timeout.toString() +
			' "' +
			cfg.options.sys.notifications.title +
			'"';
		exec(cmd, { async: true });
	}

	/**
	 * Shortcut
	 * @param {string} tp Type of notification
	 */
	static notifyCode(tp) {
		let cfg = AppConfig.getInstance();
		switch (tp) {
			case "css":
			case "sass":
				if (cfg.options.sys.notifications.compileIssue.sass)
					SysUtils.notify("Sass issue");
				break;
			case "html":
				if (cfg.options.sys.notifications.compileIssue.html)
					SysUtils.notify("Html issue");
				break;
			case "babel":
			case "javascript":
			case "typescript":
				if (cfg.options.sys.notifications.compileIssue.code)
					SysUtils.notify("Code issue");
		}
	}
}
