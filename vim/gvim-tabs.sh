#!/bin/bash

#
# Script to if - necessary open gvim and - open files in tabs
#
# Usage: /abosolute/path/to/gvim-tab.sh <file> [<file>] etc
#
# In ~/.bashrc you could add the alias:
# alias gg="/abosolute/path/to/gvim-tab.sh"
#    (gg abbreviation for gvim go)
#
# Taken from https://stackoverflow.com/questions/894811/open-files-in-existing-gvim-in-multiple-new-tabs

ANS=`pgrep -fx "gvim --servername GVIM"`

echo $@

if [[ ! $ANS ]]; then
    gvim --servername GVIM
fi

if [[ $1 ]]; then
    gvim --servername GVIM --remote-tab "${@}"
fi
