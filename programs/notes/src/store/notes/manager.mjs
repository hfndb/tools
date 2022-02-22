"use strict";
import { join, sep } from "path";
import { getDirList } from "../../file-system/dirs.mjs";
import { test, touch, FileUtils, Notes, Topic } from "./index.mjs";
import { Writer } from "./scribe/write.mjs";

/** Manage files
 *
 * Files maintained:
 * - [topic name]/structure.json
 *     Structure of topic
 * - [topic name]/keys.json
 *     Last used keys for all structures in topic
 * - [topic name]/[structure name]/[server name]/merged.[ext]
 * - [topic name]/[structure name]/[server name]/[pid]/current.[ext]
 * - [topic name]/[structure name]/[server name]/[pid]/[sequence number].[ext]
 */
export class StoreManager {
	static topics = {};

	/**
	 * @private
	 * @var {StoreManager}
	 */
	static _instance;

	/**
	 * Singleton factory to get instance
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
				keys: "keys.json",
				merged: "merged" + tpc.transformer.ext,
				structure: "structure.json",
				queue: [],
			},
		};
		StoreManager.topics[tpc.name] = toAdd;

		// Write structure.json if not exists yet
		Writer.structureWrite(tpc);

		// Write keys.json if not exists yet
		if (!test("-f", join(toAdd.dir, toAdd.files.keys))) {
			let keys = {};
			keys[tpc.name] = {};
			for (let i = 0; i < tpc.structures; i++) {
				keys[tpc.name][tpc.structures[i]] = 0;
			}
			Writer.keysWrite(tpc.name, keys);
		}
	}

	/** Get a directory
	 *
	 * @param {string} tpc Topic directory
	 * @param {string} [strctr] Name of structure
	 * @param {string} [server] Name of server
	 * @param {string} [pid]
	 * @returns {string} Full absolute path
	 */
	getDir(tpc, strctr, server, pid) {
		let rt = tpc;
		if (strctr) rt = join(rt, strctr);
		if (server) rt = join(rt, server);
		if (pid) rt = join(rt, pid);

		return rt;
	}

	/** Get current file for topic within process
	 *
	 * @param {Topic} tpc Topic
	 * @param {string} strctr Name of structure
	 * @param {string} server Name of server
	 * @param {string} pid
	 * @returns {string} Full absolute path
	 */
	getCurrent4process(tpc, strctr, server, pid) {
		let crrnt = StoreManager.topics[tpc.name];
		let path = this.getDir(crrnt.dir, strctr, server, pid);
		FileUtils.mkdir(path);

		let file = join(path, "current" + crrnt.ext);
		if (!test("-f", file)) touch(file);

		return file;
	}

	/** Get current sequence number
	 *
	 * @private
	 * @param {string} path
	 * @returns {number}
	 */
	getSequenceNr(path) {
		FileUtils.mkdir(path);

		let files = FileUtils.getFileList(path, {
			recursive: false,
		});

		let max = 0;
		for (let i = 0; i < files.length; i++) {
			let f = files[i].substring(0, 7);
			if (f == "current") continue;
			max = Math.max(max, parseInt(f));
		}

		return max;
	}

	/** Get next filename for queue within process
	 *
	 * @param {Topic} tpc Topic
	 * @param {string} strctr Name of structure
	 * @param {string} server Name of server
	 * @param {string} pid
	 * @param {boolean} next False is current, true if Next sequence number
	 * @returns {string} Full absolute path
	 */
	getQueueFile4process(tpc, strctr, server, pid, next) {
		let crrnt = StoreManager.topics[tpc.name];
		let path = this.getDir(crrnt.dir, strctr, server, pid);

		FileUtils.mkdir(path);
		let max = this.getSequenceNr(path); // Cycle after 7 * '9'
		if (next) {
			max++;
			if (max > 9999999) max = 1; // Cycle
		}

		return join(
			path,
			max
				.toString()
				.padStart(7, "0")
				.concat(crrnt.ext),
		);
	}

	/** Get current file for topic within process
	 *
	 * @param {Topic} tpc Topic
	 * @param {string} strctr Name of structure
	 * @param {string} server Name of server
	 * @param {boolean} [next] False is current, true if Next sequence number
	 * @returns {string} Full absolute path
	 */
	getMerged4server(tpc, strctr, server, next) {
		let crrnt = StoreManager.topics[tpc.name];
		let path = this.getDir(crrnt.dir, strctr, server);

		let max = this.getSequenceNr(path); // No cycling
		if (max == 0 || next) max++;

		let file = join(
			path,
			max
				.toString()
				.padStart(7, "0")
				.concat(crrnt.ext),
		);

		if (!test("-f", file)) touch(file);

		return file;
	}

	/**
	 * For Reader. Merged in all servers
	 *
	 * @param {Topic} tpc Topic
	 * @param {string} strctr Name of structure
	 * @param {number} what to read
	 * @returns {string[]}
	 */
	get4reading(tpc, strctr, what) {
		let crrnt = StoreManager.topics[tpc.name];
		let path = this.getDir(crrnt.dir, strctr);
		let file,
			files,
			pids,
			dir = "",
			rt = [];

		let servers = getDirList(path, false);
		for (let i = 0; i < servers.length; i++) {
			files = FileUtils.getFileList(join(path, servers[i]), {
				recursive: true,
			});

			for (let i = 0; files && i < files.length; i++) {
				if (what == 1 && files[i].includes(sep)) continue; // Not at top level for merged
				if (what > 1 && !files[i].includes(sep)) continue; // Not in pid but at top level
				if (what == 2 && files[i].includes("current")) continue; // We want queue file, not current
				if (what == 3 && !files[i].includes("current")) continue; // We want current file, not queue
				rt.push(join(path, files[i]));
			}
		}

		return rt;
	}
}
