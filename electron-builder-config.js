/* eslint-disable */

const PackageJson = require('./release/app/package.json');

const config = {
  productName: 'Koii Desktop Node',
  appId: 'com.koii.network.desktopnode',
  asar: true,
  asarUnpack: '**\\*.{node,dll}',
  files: ['dist', 'node_modules', 'package.json'],
  directories: {
    app: 'release/app',
    buildResources: 'assets',
    output: 'release/build',
  },
  extraResources: ['assets/**'],
  generateUpdatesFilesForAllChannels: true,
  mac: {
    category: 'public.app-category.productivity',
    target: ['dmg', 'zip'],
    type: 'distribution',
    artifactName: 'koii-desktop-node-${version}-${os}-${arch}.${ext}',
    hardenedRuntime: true,
    gatekeeperAssess: false,
    provisioningProfile: 'build/comkoiinetworkdesktopnode.provisionprofile',
    entitlements: 'build/entitlements.mac.plist',
    entitlementsInherit: 'build/entitlements.mac.plist',
  },
  dmg: {
    contents: [
      {
        x: 130,
        y: 220,
      },
      {
        x: 410,
        y: 220,
        type: 'link',
        path: '/Applications',
      },
    ],
    sign: false,
  },
  win: {
    target: [
      {
        target: 'nsis',
        arch: ['x64', 'ia32'],
      },
    ],
    publisherName: 'Koii Network',
    legalTrademarks: '',
    artifactName: 'koii-desktop-node-${version}-${os}-${arch}.${ext}',
    verifyUpdateCodeSignature: false,
    signDlls: false,
    icon: 'assets/icon.ico',
  },
  nsis: {
    oneClick: true,
    installerIcon: 'assets/icon.ico',
    uninstallerIcon: 'assets/icon.ico',
    uninstallDisplayName: '${productName} ${version}',
    deleteAppDataOnUninstall: false,
    unicode: true,
    warningsAsErrors: true,
    runAfterFinish: true,
    createDesktopShortcut: 'always',
    createStartMenuShortcut: true,
    menuCategory: false,
  },
  linux: {
    target: ['AppImage', 'tar.gz', 'deb', 'rpm'],
    executableName: 'koii-desktop-node-desktop',
    category: 'GNOME;GTK;Network;',
    desktop: {
      StartupWMClass: 'Koii.desktop.node',
      MimeType: 'x-scheme-handler/koii-desktop-node',
    },
    artifactName: 'koii-desktop-node-${version}-${os}-${arch}.${ext}',
  },
  rpm: {
    fpm: ['--rpm-rpmbuild-define=_build_id_links none'],
  },
  afterSign: '.erb/scripts/notarize.js',
  publish: [
    {
      provider: 'github',
      owner: 'koii-network',
      repo: 'desktop-node',
      releaseType: PackageJson.version.includes('alpha') ? 'prerelease' : 'release'
    },
  ],
};
module.exports = config;
