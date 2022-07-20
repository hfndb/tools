#! /usr/bin/env node

/**
 * Script to run using a cron job, for displaying notifications:
 * - Daily
 * - Specific days
 *
 * Pre conditions: See install.sh
 */

import { existsSync, statSync, writeFileSync } from "fs";
import { join } from "path";

// Bug in Node.js: Cannot find global package
// import { $, chalk, fs } from "zx";

// Workaround using dynamic import. Directory import is not supported resolving ES modules
let zx = await import(join(process.env.NODE_PATH, "zx/build/index.js"));

// --------------------------------------------------------------------
// Declare, initialize variables
// --------------------------------------------------------------------
let cfg;
let tasks;
let nw = new Date();
let debugMode = parseInt(process.env.NOTIFICATIONS_DEBUG) == 1 ? true : false;
let tmpFile = process.env.NOTIFICATIONS_TMP;

// --------------------------------------------------------------------
// Functions, namespaced in classes
// --------------------------------------------------------------------

class Generic {
	static async execCmd(cmd, verbose = false) {
		$.verbose = verbose;
		const output = (await zx.$`${cmd}`).stdout.trim();
		console.log(output);
	}

	static async readJson(file) {
		let data;
		let path = join(process.env.NOTIFICATIONS_DIR, file);
		try {
			data = await zx.fs.readJSON(`${path}.json`);
		} catch (ex) {
			Generic.exitWithError(`Error reading ${path}.json`, ex);
		}
		return data;
	}

	static async triggerNotification(msg) {
		// Add to temp file
		writeFileSync(tmpFile, `${msg}\n`, {
			flag: "a",
		});
	}

	static exitWithError(err, msg) {
		console.log(err);
		console.error(zx.chalk.red(msg));
		process.exit(1);
	}
}

class Task {
	constructor(id) {
		this.lastModified = null;
		this.lastRunToday = false;
		this.path = join(process.env.NOTIFICATIONS_DIR, "." + id);
		this.firstRun = !existsSync(this.path);

		if (!this.firstRun) {
			let info = statSync(this.path);
			this.lastModified = info.mtime;
			this.lastRunToday = this.isSameDayMonth(info.mtime);
		}
	}

	/**
	 * See whether time task should run is already before current time
	 */
	afterEndOfTime(hours, minutes) {
		let taskMinutes = hours * 60 + minutes;
		let nowMinutes = nw.getHours() * 60 + nw.getMinutes() + 1;
		return nowMinutes >= taskMinutes;
	}

	/**
	 * Same calendar day regardless of year
	 */
	isSameDayMonth(ref) {
		return nw.getMonth() == ref.getMonth() && nw.getDate() == ref.getDate();
	}

	finish() {
		writeFileSync(this.path, "");
	}
}

class Birthday {
	static async process(t) {
		let inp; // Reference date
		try {
			inp = new Date(t.date);
		} catch (err) {
			Generic.exitWithError(`Error parsing birth date ${t.date}, ID ${t.id}`, err);
		}

		// Process task
		let tsk = new Task(t.id);
		if (tsk.lastRunToday || !tsk.isSameDayMonth(inp)) return;
		if (tsk.firstRun || tsk.afterEndOfTime(cfg.daily.hour, cfg.daily.minute)) {
			await Generic.triggerNotification(t.descr);
			tsk.finish();
		}
	}
}

class DailyOnce {
	static async process(t) {
		let tsk = new Task(t.id);
		if (tsk.lastRunToday) return;
		if (tsk.firstRun || tsk.afterEndOfTime(t.hour, t.minute)) {
			await Generic.triggerNotification(t.descr);
			tsk.finish();
		}
	}
}

// --------------------------------------------------------------------
// Main
// --------------------------------------------------------------------
cfg = await Generic.readJson("config");
tasks = await Generic.readJson("data");

writeFileSync(tmpFile, ""); // Create clean temp file

for (let i = 0; i < tasks.length; i++) {
	let t = tasks[i];
	switch (t.type) {
		case "birthday":
			await Birthday.process(t);
			break;
		case "daily-once":
			await DailyOnce.process(t);
			break;
	}
}
