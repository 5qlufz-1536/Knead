import { VersionSelector } from "./VersionSelector"
import { SoundSelector } from "./SoundSelector"
import { Configuration } from "./Configuration"
import { Footer } from "./Footer"
import { Separator, Flex, Button, Spacer, useColorMode } from "@yamada-ui/react"


import "./App.css"



export const App = () => {
  const { colorMode, changeColorMode } = useColorMode()

  const style = document.createElement("style")
  style.textContent += "::-webkit-scrollbar { width: 7px; height: 7px; }"
  style.textContent += "::-webkit-scrollbar-track { background: transparent; border: none; }"
  if ( colorMode === "light" ) style.textContent += "::-webkit-scrollbar-thumb { background: var(--ui-colors-blackAlpha-600); border-radius: 10px; }"
  if ( colorMode === "dark" ) style.textContent += "::-webkit-scrollbar-thumb { background: var(--ui-colors-whiteAlpha-600); border-radius: 10px; }"
  document.head.appendChild(style)

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