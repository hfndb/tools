#!/bin/bash

# Script using vim to create syntax highlighted PDF from source file.
#
# Pre-condition:
# - function ExportToHtml in .vimrc, see ../vim/vimrc
# - wkhtmltopdf installed
#
# Usage: /absolute/path/to/pdf-from-source.sh <file?
#

FILE_IN=$1
MARGIN="10mm"
PDF_DIR=`dirname $FILE_IN`
PDF_STEM=`basename $FILE_IN | cut -d'.' -f1`
PDF_PATH=$PDF_DIR/$PDF_STEM.pdf

vim -c 'call ExportToHtml()' $FILE_IN

echo "Creating PDF file $PDF_PATH..."
wkhtmltopdf -q \
	-s A4 \
	--encoding UTF-8 \
	-B $MARGIN -T $MARGIN \
	-L $MARGIN -R $MARGIN \
	/tmp/exported.html $PDF_PATH
