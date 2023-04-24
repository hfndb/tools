#! /usr/bin/env node
import { watch } from "node:fs";
import { basename, dirname, join, sep } from "node:path";
import puppeteer from "puppeteer";
import { Files, Misc } from "./lib.mjs";

/**
 * Script to generate a .pdf file from a .html file
 *
 * Pre-conditions: Puppeteer doesn't work with global install, so:
 *   npm -i puppeteer
 *
 * Usage: html-to-pdf.mjs /path/to/file.html /path/to/output-file.pdf [w for watch]
 *
 * @see https://blog.risingstack.com/pdf-from-html-node-js-puppeteer/
 * @see https://www.bannerbear.com/blog/how-to-convert-html-into-pdf-with-node-js-and-puppeteer/
 */

let vars = {
	changed: Date.now(),
	html: Misc.getArg(),
	output: Misc.getArg(1),
	watch: Misc.getArg(2),
};

// Check and succeed or fail and exit
Files.pathExists(vars.html);

// Create a browser instance and load
console.log(`Initializing. Will write PDF file to ${vars.output}.`);
const browser = await puppeteer.launch({ headless: true });

class Manage {
	static async writePDF() {
		let settings = await Misc.getSettings();
		if (!settings?.htmlToPdf?.margin) {
			settings.htmlToPdf = {};
			settings.htmlToPdf.margin = {
				top: "50px",
				right: "50px",
				bottom: "50px",
				left: "50px",
			};
		}

		process.stdout.write("Writing PDF...");
		let page = await browser.newPage();
		await page.goto("file://" + vars.html, { waitUntil: "networkidle0" });
		await page.emulateMediaType("print");
		await page.pdf({
			path: vars.output,
			margin: settings.htmlToPdf.margin,
			printBackground: true,
			format: "A4",
		});
		/*
		 * const html = await Files.readFile(vars.html);
		 * await page.setContent(html, { waitUntil: 'domcontentloaded' });
		 *	setContent() doesn't read .css and .js
		 */
		console.log("  done");
	}

	static async change(event, file) {
		if (!file || file.endsWith("swp")) return;

		// Delaying to prevent a phenomenon like "contact bounce"
		if (Date.now() - vars.changed < 100) return;
		vars.changed = Date.now();

		await Manage.writePDF();
	}

	static async shutdown() {
		// Close the browser instance
		await browser.close();
	}
}

if (vars.watch) {
	let wtch = watch(
		vars.html,
		{
			persistent: true,
			recursive: false,
			encoding: "utf8",
		},
		Manage.change,
	);
	console.log("Watching...");

	process.on("SIGINT", Manage.shutdown); // Ctrl-c
	process.on("SIGTERM", Manage.shutdown); // Kill process otherwise
} else {
	await Manage.writePDF();
	await Manage.shutdown();
}
