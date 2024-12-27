import { VersionSelector } from "./VersionSelector"
import { SoundSelector } from "./SoundSelector"
import { Configuration } from "./Configuration"
import { Footer } from "./Footer"
import { Separator, Flex, Button, Spacer, useColorMode, Wrap } from "@yamada-ui/react"


export const App = () => {
  const { colorMode, changeColorMode, toggleColorMode } = useColorMode()


  return (
    <>
      <Flex w="full" gap="md" padding={1} paddingBottom={0}>
        <VersionSelector />

        <Spacer />

        <Button onClick={() => changeColorMode("system")}>システムカラー</Button>
        <Configuration />
      </Flex>
      <Separator margin={1} size="xs" />
    </>
  );
};