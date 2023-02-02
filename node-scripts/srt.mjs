#! /usr/bin/env node
import { Files, Misc, basename, dirname, join } from "./lib.mjs";

/**
 * Script to do whatever you want with .srt files
 * without empty lines, time codes and mentions of sounds
 *
 * Pre-condition: Convert .srt file to utf8.
 *
 * Usage: srt.mjs /path-to/file.srt | /path-to/file.txt
 */

// --------------------------------------------------------------------
// Declare, initialize, verify variables
// --------------------------------------------------------------------

let file = {
	input: Misc.getArg(),
	output: "",
};

if (!file.input) {
	console.log("Usage: srt.mjs <source file, .srt or .txt>");
	process.exit(-1);
} else if (!Files.pathExists(file.input)) {
	console.log(`File ${file.input} could not be found`);
	process.exit(-1);
}

// --------------------------------------------------------------------
// Executive functions
// --------------------------------------------------------------------

/**
 * Write elements of a string array to a file
 *
 * @param {string} whichFile To which file
 * @param {string[]} what    Waht to write
 */
async function write2file(whichFile, what) {
	// Marge elements of array into one string
	let what2write = what.join("\n");

	// And... write
	await Files.writeFile(whichFile, what2write);
}

/**
 * Transform .srt file to a .txt file
 */
async function srtToTxt() {
	let paths = {
		srt: file.input,
		txt: join(dirname(file.input), basename(file.input, ".srt") + ".txt"),
	};

	// Read data
	let data = await Files.readFile(paths.srt);
	data = data.split("\n");

	// Loop existing data
	let result = [];
	for (let i = 0; i < data.length; i++) {
		let line = data[i].trim();

		// Checks for lines to skip
		if (!line) continue; // Empty line
		if (line.includes("-->")) continue; // Time
		let isNum = /^\d+$/.test(line);
		if (isNum) continue; // Only numeric

		if (line.startsWith("-")) line = line.substring(1).trim();

		line = line
			.replace("<i>", "")
			.replace("</i>", "")
			.replace("...", "")
			.replace("…", "")
			.replace(/\(.+\)/g, "")
			.trim();

		if (line.length > 0) result.push(line);
	}

	await write2file(paths.txt, result);
}

/**
 * Transform .txt file to HTML code
 */
async function txtToHtml() {
	let paths = {
		txt: file,
		html: join(dirname(file.input), basename(file.input, ".txt") + ".html"),
	};

	// Read data
	let data = await Files.readFile(paths.txt);
	data = data.split("\n");

	// Loop existing data
	let result = [];
	for (let i = 0; i < data.length; i++) {
		let line = data[i].trim();
		result.push("<br>" + line);
	}

	await write2file(paths.html, result);
}

async function showMenu(urge) {
	let headers = {
		choices: Misc.color().green(`1/2/e`),
		want: Misc.color().blue(`What do you want?`),
	};

	// I'm here to help you...
	let help = ``;

	Misc.menuSpace();
	Misc.menuHeader(headers.want);
	Misc.menuItem("1.  Transform .srt file to .txt (both utf8 encoded)");
	Misc.menuItem("2.  Transform .txt file to .html - add <br>");
	Misc.menuItem("e.  Exit");
	Misc.menuSpace();
	let choice = await Misc.ask(`Your choice please [${headers.choices}]: `);

	let done = true;
	switch (choice) {
		case "1":
			await srtToTxt();
			break;
		case "2":
			await txtToHtml();
			break;
		case "e":
			break;
		default:
			done = false;
			break;
	}

	return done;
}

let done = await showMenu(false);
while (!done) {
	done = await showMenu(true);
}
console.log(``);
