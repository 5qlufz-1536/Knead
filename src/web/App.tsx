
import { VersionList } from "./VersionList"
import { Footer } from "./Footer"
import { createTheme, MantineProvider } from '@mantine/core';

const theme = createTheme({
  /** Put your mantine theme override here */
});

export const App = () => {

  return (
    <MantineProvider theme={theme} defaultColorScheme="auto">
      <VersionList />
      {/* <Footer /> */}
    </MantineProvider>
  );
};