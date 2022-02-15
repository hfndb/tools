"use strict";
import { Kitchen, Recipe } from "../structure.mjs";

/**
 * Howto's about usage, in function blocks
 */

class Howto {
	/**
	 * Adding a note
	 *
	 * @todo Updating file system not implemented fully
	 */
	async add() {
		// Get instance of Topic
		let kitchen = await Kitchen.getInstance();

		// Get instance of Note
		let note = kitchen.add(Recipe, {
			description: "blah blah",
			dateExample: Date.now(),
			intExample: 123,
			floatExample: 123.45,
		});

		/**
		 * Returned note: Added note with added property 'key'. Value of 'key':
		 * -2 if (for example checking required parts) failed,
		 * -1 if not written yet,
		 * >= 0 for key in file system (compare with auto-increment in database)
		 *
		 * Batch with added notes can be found in the array Kitchen.notes
		 */
	}
}
