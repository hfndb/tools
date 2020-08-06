#!/usr/bin/env python

# Script to clean the bash history and add some default entries to search history.
# Alter the arrays as you please.

import os
from user import home

contains = [
	'aptitude',
	'apt-get'
]

starts_with = [
	'#',
	'aptitude',
	'bzcat',
	'ca',
	'cat',
	'cd',
	'chmod',
	'chown',
	'cp',
	'cv',
	'dig',
	'diff',
	'echo',
	'gifdiff',
	'git',
	'gvim',
	'host',
	'ifconfig',
	'ln',
	'ls',
	'mkdir',
	'mv',
	'nano',
	'ping',
	'pip',
	'psql',
	'rm',
	'rmdir',
	'rsync',
	'service',
	'sudo',
	'tar',
	'tsc',
	'touch',
	'unzip',
	'vim',
	'whereis',
	'which',
	'whois',
	'zip',
]

#for x in sorted(starts_with):
    #print "'%s'," % x

file = os.path.join(home, '.bash_history')

f = open(file, 'r')
result = []
upload = False
for line in f:
    skip = False
    line = line.strip()
    if line in result:
        continue
    for keyword in contains:
        if keyword in line:
            skip = True
    if skip:
        continue

    words = line.split(' ')
    if words[0].strip() == 'sudo' and len(words) > 1:
        word = words[1].strip()
    else:
        word = words[0].strip()

    if word in starts_with:
        continue

    result.append(line)

f.close()

sorted = "\n".join(sorted(result))

f = open(file, 'w')
f.write(sorted + "\n\n")
# Some filtered lines
# f.write("~/Documents/system/Linux/pminstaller.sh\n")
f.write("apt autoremove; aptitude update; aptitude upgrade\n")

f.close()
