#! /usr/bin/env node
import { Files, Misc, join, homedir } from "./lib.mjs";

/**
 * Script to clean .bash_history in home directory
 *
 * Usage: clean-bash-history.mjs /path-to/config-file.json
 */

// --------------------------------------------------------------------
// Declare, initialize variables
// --------------------------------------------------------------------
let paths = {
	config: Misc.getArg(),
	hist: join(homedir(), ".bash_history"),
};

// Check and succeed or fail and exit
Files.pathExists(paths.config);
Files.pathExists(paths.hist);

// Read config and data
let cfg = await Files.readJSON(paths.config);
let data = await Files.readFile(paths.hist);
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
await Files.writeFile(paths.hist, data);
