
import { build } from "electron-builder";



build({
  config: {
    appId: "com.neac.knead",
    productName: "Knead",
    artifactName: "${productName}-${version}-${platform}-${arch}.${ext}",
    files: ["dist/**/*"],
    directories: {
      output: "release",
    },
    icon: "build/icon.ico",
    nsis: {
      oneClick: false,
      allowToChangeInstallationDirectory: true
    },
    win: {
      target: {
        target: "nsis",
        arch: ["x64", "ia32"]
      }
    }
  },
});