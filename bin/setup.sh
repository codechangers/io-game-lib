#!/bin/bash

function usage() {
  echo ""
  echo " * Usage:"
  echo "    ./bin/setup.sh path/to/game"
  echo ""
  echo " - Example:"
  echo "    ./bin/setup.sh examples/io-soccer"
  echo ""
}

grep 'path' .gitmodules | cut -d'=' -f2 | awk '{$1=$1};1' | while read -r module ; do
  if [[ "$1" == "$module" ]]; then
    echo ""
    echo " * Setting up $module..."
    [ -d code ] && rm -rf code
    cp -r $module/code ./
    rsync -q --exclude=node_modules -a template/ $module/code
    cp -r code $module/
    [ -d code ] && rm -rf code
    echo " * Successfully setup $module!"
    echo ""
    touch setup_success
  fi
done

# Show Usage if there is not a valid input
[ ! -f setup_success ] && usage
[ -f setup_success ] && rm setup_success
