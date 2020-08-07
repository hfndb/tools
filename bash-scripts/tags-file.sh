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
# - apt-get install ctags-exuberant
#
# Some others references found on the way:
# - https://fossies.org/linux/global/gtags.vim
# - https://medium.com/adorableio/modern-javascript-ctags-configuration-199884dbcc1
#
# In ~/.bashrc you could add the alias:
# alias t="/abosolute/path/to/tags-file.sh"
#    (t abbreviation for tag)
#

ctags-exuberant -R  ./src
