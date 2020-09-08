#!/bin/bash

# Script to generate or update a 'tags' file in current directory. In this case used for JavaScript and TypeScript
# See
# - http://ctags.sourceforge.net/
# - https://manpages.debian.org/testing/exuberant-ctags/ctags-exuberant.1.en.html
#
# Used by vim to ctrl-] (goto definition) which requires a 'tags' file in project root
#
# Prerequisites:
# - https://github.com/romainl/ctags-patterns-for-javascript - slightly modified version in this repo, ctags.cfg
# - apt-get install ctags-exuberant universal-ctags
# - ctags-exuberant
#     cp -af ./ctags.cfg ~/.ctags
# - ctags-universal
#     cp -afr ./ctags.d ~/.ctags.d
#
# Some others references found on the way:
# - https://fossies.org/linux/global/gtags.vim
#
# In ~/.bashrc you could add the alias:
# alias t="/abosolute/path/to/tags-file.sh"
#    (t abbreviation for tag)
#

GENERATOR="universal"

if [ "$GENERATOR" = "universal" ]
then
	ctags-universal --fields=nksSaf --file-scope=yes  --sort=no --tag-relative=yes --totals=yes -R ./src &> /dev/null
elif [ "$GENERATOR" = "exuberant" ]
then
	ctags-exuberant --sort=no --fields=nksSaf --file-scope=yes -R  ./src
	# For a single file this would be:
	# ctags-exuberant --sort=no --fields=nksSaf -f <output file name> --file-scope=yes <input file name>
fi
