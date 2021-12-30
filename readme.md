# Tools

In this repo some notes and tools that I use in a Linux environment, [Kubuntu](https://kubuntu.org/).

+ Bash scripts to git commit, search for text, replace in text etc. If aliases are added in ~/.bashrc:

  - s - Search for a string in files within a certain directory
  - sf - Search on file name within a certain directory
  - r - Replace a string in files within a certain directory
  - gg - Open gvim (or neovim) with provided files
  - t - Use ctags-exuberant or ctags-universal to generate a tags file in the current directory. If using [cookware-headless-ice](https://github.com/hfndb/cookware-headless-ice), this script doesn't need to be used.

* Node scripts to clean bash history etc.

* [Notifications](./notifications/readme.md) Tiny application to show system notifications as a modal dialog or popups from the system tray: Birthdays, once a year and 'once a day notifications' like alarm signals or reminders.

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
$ sudo npm install -g zx

```


## Installation

```bash
# Get this git repository, tools:
$ cd /opt
$ git clone https://github.com/hfndb/tools

```

See also [Vim](./vim/readme.md)

[comment]: <> (No comments here)
