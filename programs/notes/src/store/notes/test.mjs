#! /usr/bin/env node
"use strict";
import { randomUUID } from "crypto";
import { StringExt, log, Notes } from "./index.mjs";
import { Note, Part, Structure, Topic } from "./index.mjs";
import { Kitchen, Recipe } from "./howto/structure.mjs";
import { Transformer } from "./transform/transformer.mjs";

// -----------------------------------------------------------------------------------
// Section: Test for adding notes
// -----------------------------------------------------------------------------------

let vars = {
	debug: false, // debug info from Topic while adding note
	interval: 50,
	lastDate: new Date(2000, 1, 1),
	nr: 0,
	show: {
		lastNote: false,
		notes: false,
		structure: false,
	},
	start: performance.now(),
	qtyTestItems: 10,
};

// Function called from a loop
function addNote() {
	vars.nr++;
	if (vars.nr % vars.interval == 0) {
		vars.lastDate.setDate(vars.lastDate.getDate() + 1); // rolls over
	}

	let result = kitchen.add(
		{
			stringExample: randomUUID(),
			dateExample: vars.lastDate,
			intExample: Math.floor(Math.random() * 1000),
			floatExample: Math.random() * 1000,
		},
		recipe,
		vars.debug,
	);
	if (result.key < -1) return false;

	//vars.debug = true;

	return true;
}

let kitchen, recipe;

export async function test() {
	// If cookware logger active... switch file logging off
	if (log.opts) {
		log.opts.transports.file.active = false;
	}

	kitchen = await Kitchen.getInstance(); // Topic
	recipe = new Recipe(); // Structure

	// Loop to add notes
	for (let i = 0; i < vars.qtyTestItems; i++) {
		addNote();
	}

	// Show some possibly interesting info

	if (vars.show.structure) log.info("Structure:", kitchen.toStructure());

	if (vars.show.notes) {
		log.info("Note(s):");
		for (let i = 0; i < kitchen.notes.length; i++) {
			let item = kitchen.notes[i];
			log.info(Note.get2write(kitchen, item));
			if (vars.show.lastNote && i == kitchen.notes.length - 1) {
				Reflect.deleteProperty(item, "__structure");
				let dt = item.dateExample;
				log.info(
					"Last item: ",
					item,
					"Date parts: ",
					dt.getFullYear(),
					dt.getMonth(),
					dt.getDate(),
					dt.getHours(),
					dt.getMinutes(),
				);
			}
		}
	}

	// Statistics for adding notes
	log.info(`Notes added but not written yet: ${vars.nr}`);

	let now = performance.now();
	let timeElapsed = now - vars.start;
	log.info(`Time needed: ${StringExt.microSeconds2string(timeElapsed)}`);

	await log.info(kitchen.retain());

	// -----------------------------------------------------------------------------------
	// Section: Generic statistics
	// -----------------------------------------------------------------------------------
	log.info(`Stats:\n${Notes.getStats()}`);
}

await test();
