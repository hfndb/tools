#! /usr/bin/env node
import { homedir } from "os";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

/**
 * Script to clean .bash_history in home directory
 *
 * Usage: clean-bash-history.mjs /path-to/config-file.json
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const lib = await import(join(__dirname, "./lib.mjs"));
let { argv, fs, checkFileExists } = lib;

// --------------------------------------------------------------------
// Declare, initialize variables
// --------------------------------------------------------------------
let paths = {
	config: argv._[0],
	hist: join(homedir(), ".bash_history"),
};

// Check and succeed or fail and exit
checkFileExists(paths.config);
checkFileExists(paths.hist);

// Read config and data
let cfg = await fs.readJSON(paths.config);
let data = await fs.readFile(paths.hist, "utf8");
data = data.split("\n");

// Loop existing data
let result = [];
for (let i = 0; i < data.length; i++) {
	let line = data[i].trim();
	let skip = result.includes(line);
	let sudoIgnored = line.replace("sudo ", "");

	// Check whether line contains certain strings
	cfg.contains.forEach(current => {
		skip = skip || line.includes(current);
	});

	// Check whether line begins with certain strings
	cfg.beginsWith.forEach(current => {
		skip = skip || line.startsWith(current);
	});

	if (!skip) result.push(line);
}

// Compose data for cleaned output file
data = result.sort().join("\n") + "\n\n" + cfg.append.join("\n") + "\n";

// And... write
await fs.outputFile(paths.hist, data);

console.log(`${paths.hist} written`);
