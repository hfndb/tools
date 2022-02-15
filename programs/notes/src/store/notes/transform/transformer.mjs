"use strict";
import { log, Notes } from "../index.mjs";

export class Transformer {
	static formats = {};

	static async get(f) {
		try {
			if (!Transformer.formats[f]) {
				let file = `./plugins/${f}.mjs`;
				let frmt = await import(file);
				Transformer.formats[f] = new frmt.default();
			}
		} catch (err) {
			log.error(`Loading format ${f} failed`, err);
			process.exit(-1);
		}

		return Transformer.formats[f];
	}

	static microSeconds2string(ms) {
		let nts = [
			"microseconds",
			"milliseconds",
			"seconds",
			"minutes",
			"hours",
			"days",
		];
		let unit = nts[0];

		for (let i = 0; ms > 1000 && i < nts.length; i++) {
			switch (i) {
				case 1: // milli
				case 2: // seconds
				case 3: // minutes
					ms /= 1000;
					break;
				case 4: // hours
					ms /= 60;
					break;
				case 5: // days
					ms /= 24;
					break;
			}
			unit = nts[i];
		}

		return `${Math.round(ms)} ${unit}`;
	}
}
