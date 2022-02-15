"use strict";

/** Transform variants aka types to string vice versa
 *
 * TODO consider [newline] and [tab] in string value
 */
export default class FormatPlugin {
	name = "tsv";

	/**
	 * String to variant
	 *
	 * @private
	 * @param {string} variant
	 * @param {string} val Value
	 * @returns {*}
	 */
	str2variant(variant, val) {
		let rt = val;

		switch (variant) {
			case "boolean":
				rt = val ? true : false;
				break;
			case "float":
				rt = val.includes(".") ? parseFloat(val) : parseInt(val);
				break;
			case "int":
				rt = parseInt(val);
				break;
			case "date":
				rt = new Date(
					parseInt(val.substring(0, 4)),
					parseInt(val.substring(4, 6)),
					parseInt(val.substring(6, 8)),
				);
				break;
			case "datetime":
				rt = new Date(
					parseInt(val.substring(0, 4)),
					parseInt(val.substring(4, 6)),
					parseInt(val.substring(6, 8)),
					parseInt(val.substring(8, 10)),
					parseInt(val.substring(10, 12)),
				);
				break;
			case "array":
			case "object":
				rt = JSON.parse(val);
				break;
			default:
				rt = val;
		}
		return rt;
	}

	/**
	 * Variant to string
	 *
	 * @private
	 * @param {string} variant
	 * @param {*} val Value
	 * @returns {string}
	 */
	variant2string(variant, val) {
		switch (variant) {
			case "boolean":
				val = val ? "1" : "0";
				break;
			case "float":
			case "int":
				val = val.toString();
				break;
			case "date":
			case "datetime":
				if (!val) return val; // Empty date
				val =
					val.getFullYear().toString() +
					val
						.getMonth()
						.toString()
						.padStart(2, "0") +
					val
						.getDate()
						.toString()
						.padStart(2, "0");

				if (variant == "datetime")
					val +=
						val
							.getHours()
							.toString()
							.padStart(2, "0") +
						val
							.getMinutes()
							.toString()
							.padStart(2, "0");
				break;
			case "array":
			case "object":
				val = JSON.stringify(val);
				break;
		}
		return val;
	}

	/**
	 * Parts in a structure to writable for file system
	 *
	 * @param {Note} obj
	 * @returns {string}
	 */
	parts2writable(obj) {
		let ta = [];
		let part, val;
		for (let i = 0; i < obj.__structure.parts.length; i++) {
			part = obj.__structure.parts[i];
			val = obj[part.name];
			ta.push(this.variant2string(part.variant, val));
		}
		return ta.join("\t");
	}

	/**
	 * Writable for file system to object.
	 * Empty parts will be set to a value of null.
	 *
	 * @param {string} str Incoming from file system
	 * @param {Part[]} prts
	 * @returns {Object|null}
	 */
	writable2object(str, prts, obj) {
		let ta = str.split("\t"),
			tr = {},
			part,
			val;

		for (let i = 0; i < prts.length; i++) {
			part = prts[i];
			val = ta[i];
			if (!val) {
				tr[part.name] = null;
				continue;
			}
			tr[part.name] = this.str2variant(part.variant, val);
		}

		return tr;
	}
}
