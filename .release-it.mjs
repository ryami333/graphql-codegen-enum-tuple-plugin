/**
 * @type {import("release-it").Config}
 */
const config = {
  git: {
    commitMessage: "release: v${version}",
    tagName: "v${version}",
    requireCleanWorkingDir: true,
    requireUpstream: true,
    requireBranch: "main",
    tag: true,
    commit: true,
    push: true,
  },
  github: {
    release: true,
  },
  npm: {
    publish: true,
  },
  hooks: {
    "before:init": [
      "yarn prettier . --check",
      "yarn tsc",
      "yarn eslint .",
      "yarn test",
      "yarn build",
    ],
  },
};

export default config;
