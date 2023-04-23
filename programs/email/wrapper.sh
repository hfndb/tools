#!/bin/bash

# Wrapper script to initialize email,
#   then to prepare for sending using an email client
#
# Usage: wrapper.sh init|prep [language]
#

cd `dirname $0`
ACTION=$1

if [ "$ACTION" == "init" ]; then
	echo
	echo "Continue where you were? (y/n, default y)"
	read -p "> " CONTINUE

	if [ "$CONTINUE" == "n" ]; then
		# Backup previous email, just to be sure
		cp -af $EMAIL_TEMPLATE $EMAIL_TEMPLATE.bak
		# Prepare next email
		CUSTOMIZED=./custom/template-org.html
		if [ -f $CUSTOMIZED ]; then
			cp -af $CUSTOMIZED $EMAIL_TEMPLATE
		else
			cp -af ./template-org.html $EMAIL_TEMPLATE
		fi
	fi

	# Open temp file in web browser
	$EMAIL_BROWSER $EMAIL_TEMPLATE

	# Open temp file in editor
	$EMAIL_EDITOR $EMAIL_TEMPLATE

	exit 0
fi

# From here: prepare for sending using an email client

LANGUAGE=$2
if [ "$LANGUAGE" == "" ]; then
	LANGUAGE=$EMAIL_DEFAULT_LANGUAGE
fi

# Extract email from template and write a temp file
DIR=`dirname $EMAIL_TMP`
if [ ! -d $DIR ]; then
	mkdir -p $DIR
fi

# Check spell with spell check
aspell \
	--backup \
	--lang=$LANGUAGE \
	--mode=html \
	--personal=~/.aspell.$LANGUAGE.pws \
	-c $EMAIL_TEMPLATE

echo $'\nAfter your corrections, spell checker sounds the alarm about these words:\n'
aspell \
	--lang=$LANGUAGE \
	--list \
	--mode=html \
	--personal=~/.aspell.$LANGUAGE.pws \
	< $EMAIL_TEMPLATE

# Create temp file and open in editor
./manage.mjs edit
$EMAIL_EDITOR $EMAIL_TMP

echo "
File $EMAIL_TMP ready for email client
"
