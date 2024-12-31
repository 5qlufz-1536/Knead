import { build } from 'electron-builder'

build({
  config: {
    appId: 'com.neac.knead',
    productName: 'Knead',
    copyright: 'Copyright © 2025 ${author}',
    artifactName: '${productName}-${version}-${arch}.${ext}',
    files: ['dist/**/*'],
    directories: {
      output: 'release',
    },
    icon: 'build/icon.png',
    nsis: {
      oneClick: false,
      allowToChangeInstallationDirectory: true,
    },
    win: {
      target: ['nsis', 'zip'],
      publisherName: 'NeAc',
      icon: 'build/icon.png',
    },
    mac: {
      icon: 'build/icon.icns',
      target: {
        target: 'default',
        arch: 'universal',
      },
      // コード署名しない場合は null の設定が必須
      identity: null,
    },
    linux: {
      icon: 'build/icon.icns',
      target: ['AppImage'],
      category: 'Development',
    },
  },
})
