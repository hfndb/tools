#! /usr/bin/env node

/**
 * Generic Node.js library for scripts in this directory
 */

import { existsSync } from "fs";
import { join } from "path";

// ----------------------------------------------------------------------
// Bug in Node.js: Cannot find global package
// import { $, argv, cd, chalk, fs, question } from "zx";

// Workaround using dynamic import. Directory import is not supported resolving ES modules
if (!process.env.NODE_PATH) {
	console.error("Environment variable NODE_PATH not exported yet in ~/.bashrc");
	process.exit(1);
}
let zx = await import(join(process.env.NODE_PATH, "zx/dist/index.cjs"));
export let $ = zx.$;
export let argv = zx.argv;
export let chalk = zx.chalk;
export let fs = zx.fs;
export let question = zx.question;

// ----------------------------------------------------------------------

export function checkFileExists(file) {
	if (!existsSync(file)) {
		console.error(zx.chalk.red(`File ${file} doesn't exist`));
		process.exit(1);
	}
}
