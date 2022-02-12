#! /usr/bin/env node

/**
 * Script to replace <br>\n<br> with \n
 */

import { join } from "path";

// Bug in Node.js: Cannot find global package
// import { $, chalk, fs } from "zx";

// Workaround using dynamic import. Directory import is not supported resolving ES modules
let zx = await import(join(process.env.NODE_PATH, "zx/dist/index.cjs"));
let tmpFile = "/tmp/template.html";

// Read, replace
let data = await zx.fs.readFile(tmpFile); // Outputs buffer, not a string
let out = data.toString().replace(new RegExp("<br>[\r]*\n<br>", "gim"), "");

// Backup, write
zx.fs.copy(tmpFile, tmpFile + "~"); // For safety
await zx.fs.writeFile(tmpFile, out);
