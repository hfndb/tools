# Tools

In this repo some notes and tools that I use in a Linux environment, [Kubuntu](https://kubuntu.org/).

+ Bash scripts to git commit, search for text, replace in text etc. If aliases are added in ~/.bashrc:
  - s - Search for a string in files within a certain directory
  - sf - Search on file name within a certain directory
  - r - Replace a string in files within a certain directory
  - gg - Open gvim (or neovim) with provided files
  - t - Use ctags-exuberant or ctags-universal to generate a tags file in the current directory. If using [cookware-headless-ice](https://github.com/hfndb/cookware-headless-ice), this script doesn't need to be used.

* Node scripts:
  - clean-bash-history.mjs: Clean ~/.bash_history and append configured items.
  - html-to-pdf.mjs: Watch a .html file for changes and use the [puppeteer](https://www.npmjs.com/package/puppeteer) package to generate a PDF file. Or don't watch but generate a PDF file.
  - manage-git-remote.mjs: Manage remote repositories. Configure, create, install, list, auto-pack remotes, auto-pull remotes. Menu driven.
  - srt.mjs: Transform .srt files for subtitles of films to readable .txt without time codes. And convert what's in a .txt file to .html (br tags added). Menu driven.
  - md-to-html/convert.mjs: Transform .md file to templated .html file
  - md-to-html/wrapper.sh: Transform .md file to .pdf file, in background using .html file output by convert.mjs
  - md-to-html/batch.mjs: Use a settings.json file for a batch to transform from .md files to .pdf files. All .md files in settings.json (entry fileIn) are relative to the directory where the settings.json file is put.

* Programs:
	- [Email](./programs/email/readme.md) Tiny system to write and spell check email. Scripts in node-scripts/md-to-html are based on .css in this tiny project.
	- [Notifications](./programs/notifications/readme.md) Tiny program to show system notifications as a modal dialog or popups from the system tray: Birthdays, once a year and 'once a day notifications' like alarm signals or reminders.

* [Vim](./vim/readme.md) with notes about installation, configuration and utility script(s)

It's just a beginning, more will come later.


## Prerequisites

For reasons of system administration, you don't want to have [Node.js](https://en.wikipedia.org/wiki/Node.js) from the repository installed, an older version. According to [this article](https://github.com/nodesource/distributions/blob/master/README.md#debmanual) the latest version of Node.js automatically comes in from NodeSource by:


```bash
$ cd /tmp
$ wget https://deb.nodesource.com/setup_current.x
$ FILE=./setup_current.x
$ chmod +x $FILE
$ sudo $FILE
$ rm $FILE
$ sudo apt-get install -y nodejs # Including npm

# Global node package(s)
$ sudo npm install -g ascii-table3 zx

```


## Installation

```bash
# Get this git repository, tools:
$ cd /opt
$ git clone https://github.com/hfndb/tools
$ npm install

```

[comment]: <> (No comments here)
