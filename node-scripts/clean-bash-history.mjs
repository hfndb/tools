#! /usr/bin/env node
import { existsSync } from "fs";
import { homedir } from "os";
import { join } from "path";

/**
 * Script to clean .bash_history in home directory
 *
 * Usage: clean-bash-history.mjs /path-to/config-file.json
 */

// Bug in Node.js: Cannot find global package
// import { argv, chalk, fs } from "zx";

// Workaround using dynamic import. Directory import is not supported resolving ES modules
if (!process.env.NODE_PATH) {
	console.error("Environment variable NODE_PATH not exported yet in ~/.bashrc");
	process.exit(1);
}
let zx = await import(join(process.env.NODE_PATH, "zx/dist/index.cjs"));

function checkFileExists(file) {
	if (!existsSync(file)) {
		console.error(zx.chalk.red(`File ${file} doesn't exist`));
		process.exit(1);
	}
}

// --------------------------------------------------------------------
// Declare, initialize variables
// --------------------------------------------------------------------
let paths = {
	config: zx.argv._[0],
	hist: join(homedir(), ".bash_history")
}

// Check and succeed or fail and exit
checkFileExists(paths.config);
checkFileExists(paths.hist);

// Read config and data
let cfg = await zx.fs.readJSON(paths.config);
let data = await zx.fs.readFile(paths.hist, 'utf8');
data = data.split("\n");

// Loop existing data
let result = [];
for (let i = 0; i < data.length; i++) {
	let line = data[i].trim();
	let skip = result.includes(line);
	let sudoIgnored = line.replace("sudo ", "");

	// Check whether line contains certain strings
	cfg.contains.forEach((current) => {
		skip = skip || line.includes(current);
	});

	// Check whether line begins with certain strings
	cfg.beginsWith.forEach((current) => {
		skip = skip || line.startsWith(current);
	});

	if (!skip) result.push(line);
}

// Compose data for cleaned output file
data = result.sort().join("\n") +
	"\n\n" +
	cfg.append.join("\n") +
	"\n";

// And... write
await zx.fs.outputFile(paths.hist, data);

console.log(`${paths.hist} written`);
