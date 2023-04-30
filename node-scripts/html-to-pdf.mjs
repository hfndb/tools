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
 * Usage:
 *   One file:
 *     html-to-pdf.mjs /path/to/file.html /path/to/output-file.pdf [w for watch]
 *   Batch as registered in .json file
 *     html-to-pdf.mjs /path/to/batch.json
 *
 * @see https://blog.risingstack.com/pdf-from-html-node-js-puppeteer/
 * @see https://www.bannerbear.com/blog/how-to-convert-html-into-pdf-with-node-js-and-puppeteer/
 */

let browser;
let vars = {
	changed: Date.now(),
	engine: Misc.getArg(3) || "puppeteer",
	html: Misc.getArg(),
	output: Misc.getArg(1),
	watch: Misc.getArg(2),
};

export class Manage {
	static async init() {
		if (vars.engine == "puppeteer") {
			// Create a browser instance and load
			console.log("Initializing...");
			browser = await puppeteer.launch({ headless: true });
		}
	}

	static async writePDF(opts) {
		// Check and succeed or fail and exit
		Files.pathExists(opts.html);

		await Files.mkDir(dirname(opts.output));

		const p = opts.engine == "puppeteer"; // shorthand
		let settings = await Misc.getSettings();
		if (!settings?.htmlToPdf?.margin) {
			if (!settings.htmlToPdf) settings.htmlToPdf = {};
			settings.htmlToPdf.margin = {
				top: p ? "50px" : "10mm",
				right: p ? "50px" : "10mm",
				bottom: p ? "50px" : "10mm",
				left: p ? "50px" : "10mm",
			};
		}
		const m = settings.htmlToPdf.margin; // shorthand

		process.stdout.write(`Writing ${opts.output}...`);
		if (p) {
			// Slower than wkhtmltopdf, better quality,
			// though without bookmarking headers in PDF
			let page = await browser.newPage();
			await page.goto("file://" + opts.html, { waitUntil: "networkidle0" });
			await page.emulateMediaType("print");
			await page.pdf({
				path: opts.output,
				margin: settings.htmlToPdf.margin,
				printBackground: true,
				format: "A4",
			});
			/*
			 * const html = await Files.readFile(opts.html);
			 * await page.setContent(html, { waitUntil: 'domcontentloaded' });
			 *	setContent() doesn't read .css and .js
			 */
		} else if (opts.engine == "wkhtmltopdf") {
			// TODO Makes fontsize smaller than using puppeteer, doesn't run JavaScript
			let cmd = "wkhtmltopdf -q ";
			cmd += "-s A4 ";
			cmd += `-B ${m.bottom} -T ${m.top} `;
			cmd += `-L ${m.left} -R ${m.right} `;
			cmd += "--encoding UTF-8 ";
			cmd += "--enable-local-file-access ";
			cmd += "--enable-javascript ";
			cmd += "--load-error-handling ignore "; // default
			cmd += "--print-media-type ";

			// For debugging
			/*
			cmd += "--debug-javascript ";
			cmd += "--no-stop-slow-scripts ";
			cmd += "--javascript-delay 1000  ";
			*/

			cmd += `${opts.html} ${opts.output} `;
			await Misc.exec(cmd);
		}
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
		if (vars.engine == "puppeteer") {
			// Close the browser instance
			await browser.close();
		}
	}
}

if (vars.watch) {
	await Manage.init();
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
} else if (vars.output) {
	// Command line, one file
	await Manage.init();
	await Manage.writePDF(vars);
	await Manage.shutdown();
}
