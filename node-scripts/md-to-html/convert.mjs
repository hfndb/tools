#! /usr/bin/env node
import { marked } from 'marked';
import { Files, Misc, join, vars } from "../lib.mjs";

/**
 * Script to convert .rst to .html
 *
 * Usage: main.mjs file-in title
 */
let args = Misc.getArgs()._;

let data = {
	content: "",
	out: "",
	path: args[0] || "",
	title: args[1] || "",
	template: join(vars.root, "node-scripts", "md-to-html", "template.html"),
};

// Read files into vars
data.content = await Files.readFile(data.path);
data.template = await Files.readFile(data.template);

// Replace title and content
data.out = data.template
	.replace("#0#", data.title)
	.replace("#1#", marked.parse(data.content));

await Files.writeFile(join("/tmp", "md2.html"), data.out, undefined, false);

// https://marked.js.org/#usage
