
import { VersionList } from "./VersionList"
import { Footer } from "./Footer"
import { UIProvider, extendTheme } from "@yamada-ui/react"


export const App = () => {
  return (
    <UIProvider>
      <VersionList />
      {/* <Footer /> */}
    </UIProvider>
  );
};