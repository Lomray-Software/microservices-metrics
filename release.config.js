module.exports = {
  branches: [
    'prod',
    {
      name: 'staging',
      prerelease: 'beta',
      channel: 'beta',
    },
  ],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    ['@semantic-release/exec', {
      publishCmd: "sed -i -e 's/1.0.0/${nextRelease.version}/g' lib/package.json.js" +
        " && sed -i -e 's/\"1.0.0\"/\"${nextRelease.version}\"/g' package.json" +
        " && zip -r build.zip lib"
    }],
    ['@semantic-release/github', {
      labels: false,
      releasedLabels: false,
      successComment: false,
      assets: [
        { path: 'build.zip', label: 'Build-${nextRelease.gitTag}' },
      ]
    }],
  ]
}
