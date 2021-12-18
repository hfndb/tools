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
import { $, argv, cd, chalk, fs, question } from "zx";

let cfg;
let tasks;
let nw = new Date();
let debugMode = parseInt(process.env.NOTIFICATIONS_DEBUG) == 1 ? true : false;
let tmpFile = 	process.env.NOTIFICATIONS_TMP;

// --------------------------------------------------------------------
// Functions, namespaced in classes
// --------------------------------------------------------------------

class Generic {
	static async execCmd(cmd, verbose = false) {
		console.log('executing', cmd);
		$.verbose = verbose;
		const output = (await $`${cmd}`).stdout.trim();
		console.log(output);
	}

	static async readJson(file) {
		let data;
		let path = join(process.env.NOTIFICATIONS_DIR, file);
		try {
			data = await fs.readJSON(`${path}.json`);
		}
		catch (ex) {
			Generic.exitWithError(`Error reading ${path}.json`, ex);
		}
		return data;
	}

	static async triggerNotification(msg) {
		// Add to temp file
		writeFileSync(tmpFile, `${msg}\n`, {
			flag: 'a'
		});
	}

	static exitWithError(err, msg) {
		console.log(err);
		console.error(chalk.red(msg));
		process.exit(1);
	}

}

class Task {
	constructor(id) {
		this.path = join(process.env.NOTIFICATIONS_DIR, "." + id);
	}

	needsAction(refDate) {
		if (!existsSync(this.path)) {
			return true;
		}
		return refDate > nw;
	}

	async finish() {
		writeFileSync(this.path, '');
	}
}

class Birthday {
	static async process(t) {
		// Get reference dates
		let inp;
		try {
			inp = new Date(t.date);
		} catch (err) {
			Generic.exitWithError(`Error parsing birth date ${t.date}, ID ${t.id}`, err);
		}

		// See if it's not too early
		let rl = new Date(nw.year, nw.month, nw.day, cfg.daily.hour, cfg.daily.minute);
		if (rl < nw) return;

		// Process task
		inp.setFullYear(nw.getFullYear());
		let tsk = new Task(t.id);
		if (tsk.needsAction(t.id, inp)) {
			await Generic.triggerNotification(t.descr);
			await tsk.finish();
		}
	}
}

class DailyOnce {
	static async process(t) {
		let inp = new Date(nw.year, nw.month, nw.day, t.hour, t.minute);
		if (inp < nw) return;  // See if it's not too early
		let tsk = new Task(t.id);
		if (tsk.needsAction(t.id, inp)) {
			await Generic.triggerNotification(t.descr);
			await tsk.finish();
		}
	}
}

// --------------------------------------------------------------------
// Main
// --------------------------------------------------------------------
cfg = await Generic.readJson('config');
tasks = await Generic.readJson('data');

writeFileSync(tmpFile, ''); // Create clean temp file

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
