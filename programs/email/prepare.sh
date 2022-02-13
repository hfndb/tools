#!/bin/bash

# Prepare for sending

cd `dirname $0`
if [ -f ./custom/env.sh ]; then
	source ./custom/env.sh
else
	source ./env.sh
fi

LANGUAGE=$1
if [ "$LANGUAGE" == "" ]; then
	LANGUAGE=$DEFAULT_LANGUAGE
fi

# Extract email from template
sed -n '/@ -->/,/<!-- @/p' $FILE_ORG | \
	# Remove surrouding tags
	sed '/-->/d' | \
	# Remove paragraph counter
	sed '/<ol><li>/d' | \
	sed '/<\/li><li>/d' | \
	sed '/<\/li><\/ol>/d' | \
	# Remove empty lines
	sed '/^$/d' \
	> $FILE_TMP

# Replace <p> tags with <br>
if [ $REPLACE_P -eq 1 ]; then
	sed -i 's$<p>$<br>$g'  $FILE_TMP
	sed -i 's$</p>$<br>$g' $FILE_TMP
fi

# Check spell with spell check
aspell \
	--backup \
	--lang=$LANGUAGE \
	--mode=html \
	--personal=~/.aspell.$LANGUAGE.pws \
	-c $FILE_TMP

echo $'\nAfter your corrections, spell checker sounds the alarm about these words:\n'
aspell \
	--lang=$LANGUAGE \
	--list \
	--mode=html \
	--personal=~/.aspell.$LANGUAGE.pws \
	< $FILE_TMP


# Open temp file in editor
$EDITOR $FILE_TMP

echo "
File $FILE_TMP ready for email client
"
