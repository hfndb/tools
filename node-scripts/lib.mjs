#! /usr/bin/env node
import { exec as execOrg } from "node:child_process";
import { statSync } from "node:fs";
import { promisify } from "node:util";
import { homedir, platform, tmpdir } from "node:os";
import { basename, dirname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
const exec = promisify(execOrg);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
//import { $, argv, cd, chalk, fs, question } from "zx";

/**
 * Generic Node.js library
 *
 * @see https://github.com/google/zx
 * @see https://www.npmjs.com/package/fs-extra
 */

// ----------------------------------------------------------------------
// Bug in Node.js: Cannot find global package
// Workaround using dynamic import. Directory import is not supported resolving ES modules
if (!process.env.NODE_PATH) {
	console.error("Environment variable NODE_PATH not exported yet in ~/.bashrc");
	process.exit(1);
}
let zx = await import(join(process.env.NODE_PATH, "zx/build/index.js"));
// ----------------------------------------------------------------------

let vars = {
	root: normalize(join(__dirname, "..")),
	bashSripts: "",
	nodeScripts: "",
	tmpDir: tmpdir(),
};
vars.bashScripts = join(vars.root, "bash-scripts");
vars.nodeScripts = join(vars.root, "node-scripts");

// ----------------------------------------------------------------------

export { basename, dirname, join, homedir, statSync, vars };

export class Files {
	static async mkDir(directory) {
		await zx.fs.ensureDir(directory);
	}

	static pathExists(file, exit = true) {
		let exists = zx.fs.existsSync(file);
		if (!exists) {
			console.error(zx.chalk.red(`File ${file} doesn't exist`));
			if (exit) process.exit(1);
		}
		return exists;
	}

	static async readFile(path) {
		return await zx.fs.readFile(path, "utf8");
	}

	static async readJSON(path) {
		return await zx.fs.readJSON(path);
	}

	static async writeJSON(path, data) {
		return await zx.fs.outputJson(path, data);
	}

	static async writeFile(path, data, opts = undefined, verbose = true) {
		try {
			await zx.fs.outputFile(path, data, opts);
			if (verbose) {
				console.log(`${path} written`);
			}
		} catch (err) {
			console.error(zx.chalk.red(`Error writing file ${path}\n`), err);
		}
	}
}

export class Misc {
	static async ask(msg, opts) {
		return await zx.question(msg, opts);
	}

	static color() {
		return zx.chalk;
	}

	static async enter2continue() {
		await Misc.ask("\n     Press [enter] to continue...\n");
		await Misc.exec("clear");
	}

	static async exec(cmd, dry = false, returnOutput = false) {
		if (dry) {
			console.log(cmd);
			return;
		}

		const { stdout, stderr } = await exec(cmd);
		if (!returnOutput) console.log(stdout);
		if (stderr) {
			console.log(`Message:\n${stderr}`);
		}

		return returnOutput ? stdout : ""; // Zx exec() not usable

		try {
			await zx.$`${cmd}`.pipe(process.stdout);
		} catch (p) {
			console.log(`Exit code: ${p.exitCode}`);
			console.log(`Error: ${p.stderr}`);
		}
	}

	/**
	 * Get a positional parameter
	 *
	 * @param {number} [which]
	 */
	static getArg(which = 0) {
		which += 2; // First par isn't at 0 but at 2
		return process.argv[which] || "";
	}

	/**
	 * Get named parameters
	 */
	static getArgs() {
		return zx.argv;
	}

	/**
	 * Transform string in format dd-mm-yyyy to Date object
	 *
	 * @param {string} str
	 * @returns {Date|null}
	 */
	static str2date(str) {
		let lst = str.split("-") || "";
		if (!lst) return null;
		return new Date(lst[2], lst[1], lst[0]);
	}

	/**
	 * Get difference between dates
	 *
	 * @param {Date} dFrom
	 * @param {Date} dTo
	 * @returns {Object}
	 */
	static getDateDiff(dFrom, dTo) {
		let dTime = dTo.getTime() - dFrom.getTime(); // Time

		let rt = {
			days: Math.floor(dTime / (1000 * 60 * 60 * 24)),
			years: 0,
		};

		rt.years = rt.days / 365; // float
		rt.years = Math.round(rt.years * 100) / 100; // decimal, 2 digits

		return rt;
	}

	/**
	 * Get carriage return aka line end
	 */
	static getCr(forWindows = false) {
		return forWindows ? "\r\n" : "\r";
	}

	static menuHeader(msg) {
		console.log("".padEnd(2, " ") + msg);
	}

	static menuItem(msg) {
		console.log("".padEnd(7, " ") + msg);
	}

	static menuSpace() {
		console.log("");
	}
}
