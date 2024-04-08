#!/usr/bin/env bash

# Function to check if a command exists and then execute it
checkAndInvoke() {
  local command=$1
  local execName=$(echo $command | awk '{print $1}')

  echo "---------------------------------"
  if command -v $execName &> /dev/null; then
    echo "Running with $execName..."
    echo "---------------------------------"
    $command
  else
    echo "Command: $execName is not installed, skipping. prehaps (brew install $execName)"
  fi
}

ARGS="$@"
# Execute each command directly
checkAndInvoke "node src/index.mjs ${ARGS}"
checkAndInvoke "bun src/index.mjs ${ARGS}"
checkAndInvoke "deno run --allow-net --allow-env src/index.mjs ${ARGS}"
