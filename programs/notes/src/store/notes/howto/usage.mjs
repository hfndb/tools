"use strict";
import { Kitchen, Recipe } from "./structure.mjs";

/**
 * Howto's about usage, in function blocks
 */

class Howto {
	/**
	 * Adding a note
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
		 */

		await kitchen.retain(); // Elsewhere known as 'save' or 'update'

		// If you want new keys of written notes NOW, then:
		await kitchen.coerce2write();
		// If you don't use this coercive methode, notes will be written
		// in a way which is optimized for the file system.
	}
}
