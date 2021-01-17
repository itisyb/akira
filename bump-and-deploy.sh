#!/usr/bin/env bash

set -e

###
# Bump and tag a Node.js module
#
# Assuming 'x.x.x' semver format automatically parses the current package.json
# version, bumps it depending on provided major / minor / patch strategy,
# overrides the 'version' field on the package.json file, adds a git tag and
# creates the version bump commit.
##

# Parse current version from 'package.json'
get_package_version() {
  echo $(cat package.json \
    | grep version \
    | head -1 \
    | awk -F: '{ print $2 }' \
    | sed 's/[",]//g' \
    | tr -d '[[:space:]]'
    )
}

write_package_version() {
  local SEARCH="version\": \"$(get_package_version)\""
  local REPLACE="version\": \"${1}\""
  sed -i"" "s/${SEARCH}/${REPLACE}/g" package.json
}

# Increment given semver by x, y, z
bump() {
  echo $1 | awk -F. -v a="$2" -v b="$3" -v c="$4" \
      '{printf("%d.%d.%d", $1+a, $2+b , $3+c)}'
}

# Show usage manual
usage() {
  echo "Usage: bump [major|minor|patch]"
  echo "Bumps the package.json version, creates a git tag and a bump commit."
  exit 1
}

# Prompt for user confirmation displaying current and bumped version
prompt_confirmation() {
  echo
  read -p "$1 [Y/y]" -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
      exit 0
  fi
}

# Get current branch name
get_branch() {
  git branch --no-color | grep -E '^\*' | awk '{print $2}'
}

# Run script
run() {
  # Semver bump type argument: 'major' | 'minor' | 'patch' (default)
  local BUMP_TYPE="${1:-patch}"

  # Parse version string from package.json
  local PACKAGE_VERSION=$(get_package_version)

  # Get current branch name
  BRANCH_NAME=$(get_branch)

  # Define arguments used to bump version depending on the bump type argument
  case $BUMP_TYPE in
    major) local BUMP_ARGS=$"1 0 0";;
    minor) local BUMP_ARGS="0 1 0";;
    patch) local BUMP_ARGS="0 0 1";;
    *) usage && exit 1
  esac

  # Bump current package version
  local NEXT_VERSION=$(bump $PACKAGE_VERSION $BUMP_ARGS)

  # Prompt for bump confirmation
  prompt_confirmation "Bump from $PACKAGE_VERSION to v$NEXT_VERSION?"

  # Override package version
  write_package_version $NEXT_VERSION

  # Write git tag and commit package changes
  git add package.json
  git commit -m "chore: bump version to v$NEXT_VERSION"
  git tag "v$NEXT_VERSION"

  # Prompt for push confirmation
  prompt_confirmation "Push the tag and commit to ${BRANCH_NAME}?"

  # Push branch and tag
  git push origin $BRANCH_NAME
  git push origin "v$NEXT_VERSION"
}

run $@
