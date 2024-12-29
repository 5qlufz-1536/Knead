import { Box, Flex, IconButton, Input, NumberInput, Select, SelectItem, Separator, Slider, Spacer, Switch, Text, Toggle, useBoolean, useClipboard } from "@yamada-ui/react";
import { FaPlay, FaPause, FaArrowRotateLeft } from "react-icons/fa6";
import { CheckIcon, CopyIcon, SlashIcon } from "@yamada-ui/lucide";
import { PiTildeBold, PiCaretUpBold, PiSelectionBold } from "react-icons/pi";



type PitchScale = {
  name: string
  value: number
}




export const Footer = () => {

  const { onCopy, hasCopied } = useClipboard()
  const [SlashSwitch, { toggle: toggleSlash }] = useBoolean(false)

  const selected_sound = "test.sound.id"
  const command = (SlashSwitch ? "/" : "") + "playsound " + selected_sound

  const isPlaying = false



  const PlaySource: SelectItem[] = [

    { label: "ambient", value: "ambient" },
    { label: "block", value: "block" },
    { label: "hostile", value: "hostile" },

    { label: "music", value: "music" },
    { label: "neutral", value: "neutral" },
    { label: "player", value: "player" },
    { label: "record", value: "record" },
    { label: "voice", value: "voice" },
    { label: "weather", value: "weather" },
    {
      label: "非推奨", items: [
        { label: "master", value: "master" },
      ]
    },
  ]

  const PitchScale: PitchScale[] = [
    { name: "F#0 (ファ#)", value: 0.5 },
    { name: "G0  (ソ)", value: 0.53 },
    { name: "G#0 (ソ#)", value: 0.56 },
    { name: "A0  (ラ)", value: 0.59 },
    { name: "A#0 (ラ#)", value: 0.63 },
    { name: "B0  (シ)", value: 0.67 },
    { name: "C1  (ド)", value: 0.71 },
    { name: "C#1 (ド#)", value: 0.75 },
    { name: "D1  (レ)", value: 0.79 },
    { name: "D#1 (レ#)", value: 0.84 },
    { name: "E1  (ミ)", value: 0.89 },
    { name: "F1  (ファ)", value: 0.94 },
    { name: "F#1 (ファ#)", value: 1.0 },
    { name: "G1  (ソ)", value: 1.06 },
    { name: "G#1 (ソ#)", value: 1.12 },
    { name: "A1  (ラ)", value: 1.19 },
    { name: "A#1 (ラ#)", value: 1.26 },
    { name: "B1  (シ)", value: 1.33 },
    { name: "C2  (ド)", value: 1.41 },
    { name: "C#2 (ド#)", value: 1.5 },
    { name: "D2  (レ)", value: 1.59 },
    { name: "D#2 (レ#)", value: 1.68 },
    { name: "E2  (ミ)", value: 1.78 },
    { name: "F2  (ファ)", value: 1.89 },
    { name: "F#2 (ファ#)", value: 2.0 }
  ]

  let PitchScaleMenu: SelectItem[] = PitchScale.map((item) => {
    return { label: item.name, value: item.name }
  })

  const timeToString = (sec: number) => {
    const second = ("0" + Math.floor(sec % 60)).slice(-2);
    const minutes = ("0" + Math.floor(sec / 60) % 60).slice(-2);
    //let hour = ("0" + Math.floor((time / 60) / 60)).slice(-2);
    return minutes + ":" + second;
  }


  return (
    <>
      <footer>
        <Box w="full" bg="footerBackground" padding={2} style={{ userSelect: "none" }}>

          <Box alignContent="center" paddingX={1}>
            <Slider defaultValue={0} filledTrackColor="red.600" thumbColor="red.600" trackColor="gray.200" thumbSize={2.5} thumbProps={{ _focusVisible: { boxShadow: "" } }} />
          </Box>

          <Flex w="full" marginTop={2} >
            <IconButton icon={<FaArrowRotateLeft size={20} />} variant="ghost" />
            <Spacer maxW={1} />
            <IconButton icon={isPlaying ? <FaPause size={20} /> : <FaPlay size={20} />} variant="ghost" />
            <Spacer maxW={1} />
            <Text alignContent="center" paddingX={1} style={{ userSelect: "none" }} fontSize="lg">
              {timeToString(0)} / {timeToString(100)}
            </Text>
            <Spacer />
            <Slider w={32} step={0.01} defaultValue={1} min={0.5} max={2} filledTrackColor="gray.200" thumbColor="sky.600" trackColor="gray.200" thumbSize={2.5} thumbProps={{ _focusVisible: { boxShadow: "" } }} />
            <Spacer maxW={3} />
            <Input width={20} alignItems="left" placeholder="pitch" defaultValue={1} />
            <Spacer maxW={1} />
            <Select items={PitchScaleMenu} defaultValue="F#1 (ファ#)" alignItems="left" placeholderInOptions={false} w={40} animation="bottom" />
          </Flex>

          <Flex w="full" marginTop={1} >
            <Toggle variant="outline" icon={<SlashIcon fontSize="lg" />} onClick={toggleSlash} />
            <Spacer maxW={1} />
            <Select items={PlaySource} alignItems="left" defaultValue="master" placeholderInOptions={false} w={32} animation="bottom" />
            <Spacer />
            <NumberInput w={40} defaultValue={1.0} precision={2} min={0.0} step={0.1} />
            <Spacer maxW={1} />
            <NumberInput w={40} defaultValue={1.0} precision={2} min={0.0} step={0.1} />
          </Flex>

          <Flex w="full" marginTop={1} >
            <Input alignItems="left" placeholder="Coordinate" defaultValue="" />
            <Box w="xs" >
              <Flex>
              <Spacer />
                <Spacer maxW={1} />
                <Box border="1px solid" borderColor="inherit" boxShadow="md" borderRadius={5} >
                  <IconButton icon={<PiTildeBold size={20} />} variant="ghost" />
                </Box>
                <Spacer maxW={1} />
                <Box border="1px solid" borderColor="inherit" boxShadow="md" borderRadius={5} >
                  <IconButton icon={<PiCaretUpBold size={20} />} variant="ghost" />
                </Box>
                <Spacer maxW={1} />
                <Box border="1px solid" borderColor="inherit" boxShadow="md" borderRadius={5} >
                  <IconButton icon={<PiSelectionBold size={20} />} variant="ghost" />
                </Box>
              </Flex>
            </Box>
          </Flex>

          <Flex w="full" marginTop={1} >
            <Input alignItems="left" placeholder="Selector" defaultValue="@a" />
            <Spacer />
            <Switch defaultChecked reverse w="sm">同ディメンション</Switch>
          </Flex>

          <Box w="full" marginTop={1} border="1px solid" borderColor="inherit" boxShadow="md" borderRadius={5} >
            <Flex>
              <Box alignContent="center" paddingX={3} style={{ userSelect: "none" }} >{command}</Box>
              <Spacer />
              <Box><Separator orientation="vertical" /></Box>
              {/* <Tooltip label={hasCopied ? "Copied!" : "Copy"}> */}
              <IconButton icon={hasCopied ? <CheckIcon color="success" marginX={6} /> : <CopyIcon marginX={6} />} onClick={() => onCopy(command)} variant="ghost" borderLeftRadius={0} borderRightRadius={2} />
              {/* </Tooltip> */}
            </Flex>
          </Box>

        </Box>
      </footer>
    </>
  );
};