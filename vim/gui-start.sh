#!/bin/bash

#
# Script to if - necessary open gvim of neovim-qt and - open file(s)
#
# Usage: /abosolute/path/to/gui-start.sh <file> [<file>] etc
#
# In ~/.bashrc you could add the alias:
# alias gg="/abosolute/path/to/guit-start.sh"
#    (gg abbreviation for gui go)
#

GUI="nvim"

# echo $@

if [ "$GUI" = "gvim" ]; then
	# Taken from https://stackoverflow.com/questions/894811/open-files-in-existing-gvim-in-multiple-new-tabs
	ANS=`pgrep -fx "gvim --servername GVIM"`

	if [[ ! $ANS ]]; then
		gvim --servername GVIM
	fi

	if [[ $1 ]]; then
		gvim --servername GVIM --remote-tab "${@}"
	fi
fi


if [ "$GUI" = "nvim" ]; then
	# Just start nvim in a standardized way
	nvim-qt --no-ext-tabline "$@"
fi
