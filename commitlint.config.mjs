export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-enum": [
      2,
      "always",
      [
        "ui",
        "web",
        "tokens",
        "registry",
        "docs",
        "spec",
        "skills",
        "ci",
        "lint",
        "deps",
        "repo",
        "release",
      ],
    ],
    "body-max-line-length": [0],
    "footer-max-line-length": [0],
  },
}
