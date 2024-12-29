import { CheckIcon, CopyIcon } from "@primer/octicons-react";
import { Box, Flex, IconButton, Input, InputGroup, Separator, Slider, Spacer, Tooltip, useClipboard } from "@yamada-ui/react";

export const Footer = () => {

  const { onCopy, hasCopied } = useClipboard()

  const value = "Test String"

  return (
    <footer>
      <Box h={10}>
        <Slider thumbSize={3} />
      </Box>
      <Box w="full" marginTop={2} border="1px solid" borderColor="inherit" boxShadow="md" borderRadius={5}>
        <Flex>
          <Box alignContent="center" paddingX={3} style={{ userSelect: "none"}} >{value}</Box>
          <Spacer />
          <Box><Separator orientation="vertical" /></Box>
          <Tooltip label={hasCopied ? "Copied!": "Copy"}>
            <IconButton icon={hasCopied ? <Box color="success" alignContent="center" paddingBottom={1} ><CheckIcon /></Box> : <CopyIcon />} onClick={() => onCopy(value)} colorScheme={"primary"} variant="primary" borderLeftRadius={0} borderRightRadius={2} />
          </Tooltip>
        </Flex>
      </Box>
    </footer>
  );
};