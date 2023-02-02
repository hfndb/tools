#! /usr/bin/env node
import { Files, Misc, basename, dirname, join, vars } from "./lib.mjs";

/**
 * Script to manage remote git repositories
 */

let cfgFile = Misc.getArg();
Files.pathExists(cfgFile);
let data = await Files.readJSON(cfgFile);
let dirTemp = join(vars.tmpDir, "repositories");
let sshLogin = `${data.user}@${data.server}`;
let dry = false;

/**
 * Manage git repositoties
 */
class GitRemote {
	static async prepLocalTemp() {
		await Misc.exec(`rm -rf ${dirTemp}; mkdir ${dirTemp}`, dry);
	}

	/**
	 * Loop all repositories and execute passed function
	 */
	static async loop(fn) {
		for (let i = 0; i < data.items.length; i++) {
			let item = data.items[i];
			await fn(i, item[0], item[1]);
		}
	}

	/**
	 * List repositories
	 */
	static async list(idx, local, remote) {
		console.log(
			idx.toString().padEnd(5, " ") +
				remote.toString().padEnd(40, " ") +
				local.toString(),
		);
		Files.pathExists(local, false);
	}

	/**
	 * Auto-pull specified list of repositories
	 */
	static async autoPull() {
		let idx, item, name, path;
		for (let i = 0; i < data.autoPull.length; i++) {
			name = data.autoPull[i];
			idx = data.items.findIndex(el => el[1] == name);
			if (idx < 0) continue;
			item = data.items[idx];
			path = item[0];
			console.log(`Pulling ${item[1]}`);
			await Misc.exec(`cd ${path}; git pull`, dry);
		}
	}

	/**
	 * Create a remote repository
	 *
	 * @todo Needs test
	 */
	static async create() {
		// List configured repositories
		await GitRemote.loop(GitRemote.list);
		Misc.menuSpace();
		let choice = await Misc.ask("Your choice please: ");
		if (!choice) return;
		choice = parseInt(choice);
		if (!data.items[choice]) return;
		let local = data.items[choice][0];
		let localR = join(local, ".git");
		let remote = data.items[choice][1];

		// Already exists locally?
		if (Files.pathExists(localR, false)) {
			console.log(`Local repository already exist`);
			return;
		}

		// Create remote repository
		await Misc.exec(
			`ssh ${sshLogin} ` +
				`'cd ${data.repoPath}; mkdir ${remote}; cd ${remote}; git --bare init'`,
			dry,
		);

		// Clone remote to local
		await GitRemote.prepLocalTemp();
		await Misc.exec(
			`cd ${dirTemp}; git clone ssh://${sshLogin}:${data.repoPath}/${remote}`,
			dry,
		);

		// Move cloned repositories in temp dir to local directory
		await Misc.exec(`mv ${dirTemp}/${remote}/.git ${local}/`, dry);
	}

	/**
	 * Create remote repositories based on local
	 */
	static async install(idx, local, remote) {
		console.log(`Creating bare repository for ${local}`);
		await GitRemote.prepLocalTemp();
		await Misc.exec(`cd ${dirTemp}; git clone --bare ${local}`, dry);
		let dirRepo = join(dirTemp, basename(local) + ".git");

		Misc.menuSpace();
		console.log(`Uploading to remote ${data.server}`);
		await Misc.exec(
			`ssh ${sshLogin} ` +
				`'cd ${data.repoPath}; rm -rf ${remote}; mkdir ${remote}'`,
			dry,
		);
		await Misc.exec(
			`cd ${dirRepo}; ` + `rsync -ra ./ ${sshLogin}:${data.repoPath}/${remote}`,
			dry,
		);
		Misc.menuSpace();
	}

	/**
	 * Pack remote repositories
	 */
	static async packRemote() {
		let cmd = "`find ./objects -type f | wc -l`";
		let bashScipt = `
function packRepository {
	if [ ! -d ${data.repoPath}/$1 ]; then
		echo ""
		echo "- Repository $1 not found";
		return
	fi
	cd ${data.repoPath}/$1
	NR_FILES=${cmd}
	if [ $NR_FILES -gt 10 ]; then
		echo ""
		echo "- Compressing repo $1"
		${dry ? "echo " : ""}git gc
	fi
}

`;
		for (let i = 0; i < data.items.length; i++) {
			let item = data.items[i];
			bashScipt += `packRepository "${item[1]}"\n`;
		}

		let output = join(dirTemp, "pack.sh");

		await Files.mkDir(dirTemp);
		await Files.writeFile(output, bashScipt, undefined, false);

		// Remotely execute generated bash script
		await Misc.exec(`ssh ${sshLogin} 'bash -s' < ${output}`, dry);
	}

	static async showMenu() {
		let done = false;
		Misc.menuSpace();
		Misc.menuHeader(
			"Manage repositories at server " + Misc.color().blue(data.server),
		);
		Misc.menuSpace();
		Misc.menuItem("1.  List");
		Misc.menuItem("2.  Install all -> send bare copy to remote");
		Misc.menuItem("3.  Create remote repository");
		Misc.menuItem("4.  Pack remote repositories");
		Misc.menuItem("5.  Auto-pull repositories");
		Misc.menuSpace();
		let choice = await Misc.ask("Your choice please: ");
		Misc.menuSpace();

		switch (choice) {
			case "1":
				await GitRemote.loop(GitRemote.list);
				break;
			case "2":
				await GitRemote.loop(GitRemote.install);
				break;
			case "3":
				GitRemote.create();
				break;
			case "4":
				await GitRemote.packRemote();
				break;
			case "5":
				await GitRemote.autoPull();
				break;
			default:
				done = true;
		}

		return done;
	}
}

let done = await GitRemote.showMenu();
while (!done) {
	await Misc.enter2continue();
	done = await GitRemote.showMenu();
}
