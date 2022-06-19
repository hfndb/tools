#! /usr/bin/env node
import { Files, Misc, basename, dirname, join } from "./lib.mjs";

/**
 * Script to do whatever you want with .srt files
 * without empty line and time codes.
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
	output: ""
}

if (!file.input) {
	console.log("Usage: srt.mjs <source file, .srt or .txt>")
	process.exit(-1)
}
else if (!Files.pathExists(file.input)) {
	console.log(`File ${file.input} could not be found`);
	process.exit(-1)
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
		txt: join(dirname(file.input), basename(file.input, ".srt") + ".txt")
	}

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

		if (line.startsWith("- "))
			line = line.substring(2);

		result.push(line
		.replace("<i>", "")
		.replace("</i>", "")
		.replace("...", "")
		);
	}

	await write2file(paths.txt, result);
}

/**
 * Transform .txt file to HTML code
 */
async function txtToHtml() {
	let paths = {
		txt: file,
		html: join(dirname(file.input), basename(file.input, ".txt") + ".html")
	}

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
		choices: Misc.color().green(`y/n/c/q`),
		hacking: Misc.color().yellow(`Creatively:`),
		help: Misc.color().blue(`About this quatrobolical dilemma`),
		want: Misc.color().blue(`What do you want?`),
	}

	// I'm here to help you...
	let help = ``

	if (urge) {
		console.log(`

I'm here to help, though respresented by this program.

Your attention has been hijacked by a quatrobolical dilemma.
My 'lemma' is that you have 4 choices and you MUST react in one of 4 predefined ways.
Of course I'm doing this for a higher purpose, so don't become too angry 😎

This was my whish for you. This program now demands that from you, believing in my divine power 😀

${headers.help}
Possible reactions I now expect from you: y(es), n(o), c(ancel), q(uit)

Philosophically:
- y is what collaborators, employees do. Say 'yes' to accept a plan.
- n is what administrators, leaders do. Say 'no' to deviations of a plan.
- c is like 'cancel culture', cancelling what you don't like for a deeper or higher purpose.
- q compares to the quid aka British Pound Sterling. Intell from you could be valuable.
Why continue or quit a stream of activity? That's the question.

${headers.hacking}
As your attention has been hijacked, you perhaps appreciate knowing that
increased control comes by also using the control key, to break out this situation.
- ctrl-c aborts this program, stronger 'cancel culture'.
- ctrl-d once or twice aborts the 'black power' of this shell, including 'white privelege' by this program.

So... once again:`);
	}
	Misc.menuSpace();
	Misc.menuHeader(headers.want);
	Misc.menuItem("1.  Transform .srt file to .txt (both utf8 encoded)");
	Misc.menuItem("2.  Transform .txt file to .html");
	Misc.menuSpace();
	// Hide choices 1 and 2, enable choices c and q 😀
	let choice = await Misc.ask(`Your choice please [${headers.choices}]: `);

	let done = true;
	switch (choice) {
		case "1":
			await srtToTxt();
			break;
		case "2":
			await txtToHtml();
			break;
		case "c":
		case "q":
			break;
		case "2":
		default:
			done = false;
			break;
	}

	return done;
}

/**
 * Show menu with predefined quatrobolical dilemma
 * Like a 4-wheel drive grip on 4 presented choices or else...
 */
let done = await showMenu(false);
while (!done) {
	done = await showMenu(true);
}
