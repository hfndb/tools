#! /usr/bin/env node
import { dirname, join } from "node:path";
import { marked } from "marked";
import { Files, Misc, vars } from "../lib.mjs";
import { Manage } from "../html-to-pdf.mjs";

/**
 * Script to transform batch of .md files to .pdf
 *
 * Usage: batch.mjs /absolute/path/to/md-to-pdf.json
 */
let args = Misc.getArgs()._;

let data = {
	content: "",
	dirProject: "",
	out: "",
	path: args[0] || "",
	tmpFile: "/tmp/md2.html",
};

Files.pathExists(data.path);
data.dirProject = dirname(data.path);

const script = join(vars.nodeScripts, "md-to-html", "transform.mjs");
const settings = await Files.readJSON(data.path);

await Manage.init();

for (let i = 0; i < settings.batch.length; i++) {
	const item = settings.batch[i];
	const fileIn = join(data.dirProject, item.fileIn);
	const fileOut = join(settings.dirPdf, item.fileOut);

	// Only generate pdf if .md is changed since last time
	if (Files.pathExists(fileOut, false, false)) {
		const modifiedMd = Files.getLastModified(fileIn);
		const modifiedPdf = Files.getLastModified(fileOut);
		if (modifiedPdf > modifiedMd) continue;
	}

	// Generate temp .html
	await Misc.exec(`${script} ${fileIn} "${item.title}"`);

	// Then generate .pdf
	await Manage.writePDF({
		engine: settings.engine,
		html: data.tmpFile,
		output: fileOut,
	});

	// Cleanup
	Files.erase(data.tmpFile);
}

await Manage.shutdown();
console.log();
