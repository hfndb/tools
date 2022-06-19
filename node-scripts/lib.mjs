#! /usr/bin/env node
import { statSync } from "fs";
import { promisify } from "util";
import { homedir, platform, tmpdir } from "os";
import { basename, dirname, join, normalize } from "path";
import { fileURLToPath } from "url";
import { exec as execOrg } from "child_process"
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
	tmpDir: tmpdir()
}
vars.bashScripts = join(vars.root, "bash-scripts");
vars.nodeScripts = join(vars.root, "node-scripts");

// ----------------------------------------------------------------------

export {basename, dirname, join, homedir, statSync, vars};

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
		}
		catch (err) {
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
			console.log(cmd)
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
			console.log(`Exit code: ${p.exitCode}`)
			console.log(`Error: ${p.stderr}`)
		}
	}

	/**
	 * Get the first anonymous parameter
	 */
	static getArg() {
		return zx.argv._[0] || "";
	}

	/**
	 * Get named parameters
	 */
	static getArgs() {
		return zx.argv;
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
