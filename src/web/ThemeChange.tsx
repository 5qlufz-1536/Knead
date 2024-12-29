
import { useColorMode, Menu, MenuButton, MenuList, MenuItem, IconButton, Box } from "@yamada-ui/react"

import { MoonIcon, PaletteIcon, SunIcon, MonitorCogIcon } from "@yamada-ui/lucide"



export const ThemeChange = () => {
    const { colorMode, changeColorMode, internalColorMode } = useColorMode()

    const isSystemColor = (internalColorMode == "system") ? "primary" : ""
    const isLightColor = (internalColorMode == "light") ? "primary" : ""
    const isDarkColor = (internalColorMode == "dark") ? "primary" : ""

    return (
        <Menu>
            <MenuButton as={IconButton} icon={<PaletteIcon fontSize="lg"/>} variant="outline" />

            <MenuList>
                <MenuItem icon={<MonitorCogIcon color={isSystemColor} fontSize="lg" />}
                    textColor={isSystemColor}
                    onClick={() => changeColorMode("system")}
                >
                    <Box paddingBottom={0.5}>System</Box>
                </MenuItem>
                <MenuItem icon={<SunIcon color={isLightColor} fontSize="lg" />}
                    textColor={isLightColor}
                    onClick={() => changeColorMode("light")}
                >
                    <Box paddingBottom={0.5}>Light</Box>
                </MenuItem>
                <MenuItem icon={<MoonIcon color={isDarkColor} fontSize="lg" />}
                    textColor={isDarkColor}
                    onClick={() => changeColorMode("dark")}
                >
                    <Box paddingBottom={0.5}>Dark</Box>
                </MenuItem>
            </MenuList>
        </Menu>
    );
};