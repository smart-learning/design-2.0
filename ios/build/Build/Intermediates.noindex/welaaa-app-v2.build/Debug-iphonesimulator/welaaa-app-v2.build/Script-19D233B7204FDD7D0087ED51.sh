#!/bin/sh
set -eo pipefail

if [ "$CONFIGURATION" == "Debug" ]; then
  echo "Skipping asset bundling in debug mode."
  exit 0
fi

pushd ${SRCROOT}/..
value=$(cat ~/.expo/PATH)
dest=$CONFIGURATION_BUILD_DIR/$UNLOCALIZED_RESOURCES_FOLDER_PATH
PATH="$PATH:$value" exp bundle-assets --platform ios --dest "$dest"
popd
