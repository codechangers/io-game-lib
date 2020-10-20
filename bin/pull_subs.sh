#!/bin/bash

hq=$(pwd)

grep 'path' .gitmodules | cut -d'=' -f2 | awk '{$1=$1};1' | while read -r module ; do
	echo "Processing $module"
	cd $module
	git pull
	cd $hq
	updated=$(git status | grep "$module (new commits)" | wc -l)
	if [ "$updated" -eq "1" ]; then
		echo "$module was updated."
		git add $module
		git commit -m "Pull $module updates"
		git push
	else
		echo "$module is the same."
	fi
done



