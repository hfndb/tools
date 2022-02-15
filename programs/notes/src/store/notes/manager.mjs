"use strict";
import { join, sep } from "path";
import { pid } from "process";
import { exec, test, touch, fdir, FileUtils, Notes } from "./index.mjs";

/** Manage files
 *
 * Files maintained:
 * - [topic name]/structure.json
 *     Structure of topic
 * - [topic name]/[structure name]/[server name]/merged.[ext]
 * - [topic name]/[structure name]/[server name]/[pid]/current.[ext]
 * - [topic name]/[structure name]/[server name]/[pid]/[sequence number].[ext]
 */
export class StoreManager {
	static topics = {};

	/**
	 * @private
	 * @var {Kitchen}
	 */
	static _instance;

	/**
	 * Singleton factory to get instance
	 *
	 * @returns {Kitchen}
	 */
	static async getInstance() {
		if (!StoreManager._instance) {
			StoreManager._instance = new StoreManager();
		}
		return StoreManager._instance;
	}

	/**
	 * @param {Object} tpc Structure of topic
	 */
	add(tpc) {
		let toAdd = {
			ext: tpc.transformer.ext,
			dir: join(Notes.options.dir, tpc.name),
			files: {
				merged: join(Notes.options.domain, "merged." + tpc.transformer.ext),
				structure: "structure.json",
				queue: [],
			},
		};

		FileUtils.mkdir(toAdd.dir);

		if (!test("-f", join(toAdd.dir, toAdd.files.structure))) {
			FileUtils.writeJsonFile(tpc, toAdd.dir, toAdd.files.structure, true);
		}

		StoreManager.topics[tpc.name] = toAdd;

		this.getCurrent(tpc); // Force creation of 'current' file

		let file = join(toAdd.dir, toAdd.files.merged);
		if (!test("-f", file)) touch(file);
	}

	/** Get current file for topic
	 *
	 * @param {Object} tpc Structure of topic
	 * @returns {string} Full absolute path
	 */
	getCurrent(tpc) {
		let crrnt = StoreManager.topics[tpc.name];
		let path = join(crrnt.dir, Notes.options.domain, pid.toString());
		FileUtils.mkdir(path);

		let file = join(crrnt.dir, "current" + crrnt.ext);
		if (!test("-f", file)) touch(file);

		return file;
	}

	/** Get next filename for queue.
	 *
	 * @param {Object} tpc Structure of topic
	 * @returns {string} Full absolute path
	 */
	getNextQueueFile(tpc) {
		let crrnt = StoreManager.topics[tpc.name];
		let path = join(crrnt.dir, Notes.options.domain, pid.toString());
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
		if (max >= 9999999) max = 1; // Cycle after 7 * '9'

		return join(
			crrnt.dir,
			Notes.options.domain,
			pid.toString(),
			max
				.toString()
				.padStart(7, "0")
				.concat(crrnt.ext),
		);
	}
}
