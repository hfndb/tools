"use strict";
import { Note, Part, Structure, Topic } from "../index.mjs";

/**
 * Howto setup a topic with structure
 */


export class Recipe extends Structure {
	constructor() {
		super({
			name: "recipe",
			additional: [], // For example; ingredients of recipe
			// @ts-ignore
			// Choices for variant: INTERACTION, LOOKUP
			variant: Structure.LOOKUP,
			parts: [
				// Part 'key' is automatically added (auto increment)

				// Choices for variant:
				// string (default), boolean, date, datetime, int, float
				// string with unlimited lenght, like blob or text in a database.

				new Part({
					name: "stringExample",
				}),
				// If variant is date or datetime, default value can be set to now,
				// which will be auto-replaced while adding a note,
				// if no value provided.
				new Part({
					defaultValue: "now",
					name: "dateExample",
					variant: "date",
				}),
				new Part({
					name: "intExample",
					variant: "int",
				}),
				new Part({
					name: "floatExample",
					variant: "float",
				}),
			],
		});
	}
}

export class Kitchen extends Topic {
	/**
	 * @private
	 * @var {Kitchen}
	 */
	static _instance;

	constructor() {
		super({
			format: "tsv", // File format on hard disk
			name: "kitchen",
			structures: [Recipe],
		});
	}

	/**
	 * Singleton factory to get instance
	 *
	 * @returns {Kitchen}
	 */
	static async getInstance() {
		if (!Kitchen._instance) {
			Kitchen._instance = new Kitchen();
			await Topic.init(Kitchen._instance);
		}
		return Kitchen._instance;
	}
}