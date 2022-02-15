"use strict";
import { join, sep } from "path";
import { pid } from "process";
import { exec, test, touch, fdir, FileUtils, Notes } from "./index.mjs";

/** Manage files
 *
 * Files maintained:
 * - [topic name]/structure.json
 *     Structure of topic
 * - [topic name]/[structure name]/[serverName]/merged.[ext]
 * - [topic name]/[structure name]/[serverName]/[pid]/current.[ext]
 * - [topic name]/[structure name]/[serverName]/[pid]/[sequence number].[ext]
 *     Sequence number starts with 1, goes to 100 and then cycles back to 1
 */
export class StoreManager {
	/**
	 * @param {Object} tpc Structure of topic
	 */
	constructor(tpc) {
		this.ext = tpc.transformer.ext;
		this.dir = join(Notes.options.dir, tpc.name);

		FileUtils.mkdir(this.dir);

		this.files = {
			current: join(Notes.options.domain, pid.toString(), "current" + this.ext),
			merged: join(Notes.options.domain, "merged." + this.ext),
			structure: "structure.json",
			queue: [],
		};

		if (!test("-f", join(this.dir, this.files.structure))) {
			FileUtils.writeJsonFile(tpc, this.dir, this.files.structure, true);
		}

		let path = join(this.dir, Notes.options.domain, pid.toString());
		FileUtils.mkdir(path);

		let file = join(this.dir, this.files.current);
		if (!test("-f", file)) touch(file);
		file = join(this.dir, this.files.merged);
		if (!test("-f", file)) touch(file);
	}

	/** Get next filename for queue, or all found queue files.
	 * Repeating cyles from 1 to 100r.
	 */
	getNextQueueFile() {
		let path = join(this.dir, Notes.options.domain, pid.toString());
		FileUtils.mkdir(path);

		const fl = new fdir()
			.crawlWithOptions(path, {
				group: true,
			})
			.sync();
		let files = fl[0].files;

		let max = 1;
		for (let i = 0; i < files.length; i++) {
			let f = files[i].substring(0, 7);
			if (f == "current") continue;
			max = Math.max(max, parseInt(f));
		}
		if (max > 100) max = 1;

		return max.toString().padStart(7, "0").concat(this.ext);
	}
}
