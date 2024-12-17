
import { VersionList } from "./VersionList"
import { Footer } from "./Footer"
import { createTheme, MantineProvider, Divider, Button, Space } from '@mantine/core';

const theme = createTheme({
  /** Put your mantine theme override here */
});

export const App = () => {

  return (
    <MantineProvider theme={theme} defaultColorScheme="auto">
      <div style={{ padding: 5 }}>
        <VersionList />
        <Divider size="xs" />
      </div>
      {/* <Footer /> */}
    </MantineProvider>
  );
};