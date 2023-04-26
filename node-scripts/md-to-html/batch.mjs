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
	items: null,
	out: "",
	path: args[0] || "",
	dirProject: "",
};

Files.pathExists(data.path);
data.dirProject = dirname(data.path);
data.items = await Files.readJSON(data.path);

const script = join(vars.nodeScripts, "md-to-html", "transform.mjs");

await Manage.init();

for (let i = 0; i < data.items.length; i++) {
	const item = data.items[i];
	const path = join(data.dirProject, item.fileIn);

	// Generate temp .html
	await Misc.exec(`${script} ${path} "${item.title}"`);

	// Then generate .pdf
	await Manage.writePDF({
		html: "/tmp/md2.html",
		output: item.fileOut,
	});
}

await Manage.shutdown();
console.log();
