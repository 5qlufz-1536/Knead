import { Box, Flex, IconButton, Input, NumberInput, Select, SelectItem, Separator, Slider, Spacer, Switch, Text, Toggle, Tooltip, useBoolean, useClipboard } from "@yamada-ui/react";
import { FaPlay, FaPause, FaArrowRotateLeft } from "react-icons/fa6";
import { CheckIcon, CopyIcon, SlashIcon, MegaphoneOffIcon } from "@yamada-ui/lucide";
import { PiTildeBold, PiCaretUpBold, PiSelectionBold } from "react-icons/pi";
import { useAppSelector } from "../store/_store";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SoundName } from "../store/fetchSlice";


const { myAPI } = window;


type PitchScale = {
  name: string
  value: number
}




export const Footer = () => {

  const PlaySourceItems: SelectItem[] = [

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

  const PitchScaleItems: SelectItem[] = PitchScale.map((item) => {
    return { label: item.name, value: item.name }
  })

  const timeToString = (sec: number) => {
    const second = ("0" + Math.floor(sec % 60)).slice(-2);
    const minutes = ("0" + Math.floor(sec / 60) % 60).slice(-2);
    //let hour = ("0" + Math.floor((time / 60) / 60)).slice(-2);
    return minutes + ":" + second;
  }


  const { onCopy, hasCopied } = useClipboard()


  // スラッシュスイッチ
  const [SlashSwitch, { toggle: toggleSlash }] = useBoolean(false)

  // サウンドを流すターゲット(masterとか)
  const [PlaySource, setPlaySource] = useState("master");


  // ピッチ関係
  const [Pitch, setPitch] = useState(1);
  const [SelectedPitchScale, setSelectedPitchScale] = useState("F#1 (ファ#)");
  const onChangePitchSlider = (value: number) => {
    setPitch(value)

    const scale: string = PitchScale.find(e => e.value == value)?.name ?? ""
    scale != "" ? setSelectedPitchScale(scale) : undefined
  }
  const onChangePitchInput = (e: string, value: number) => {
    setPitch(value)

    const scale: string = PitchScale.find(e => e.value == value)?.name ?? ""
    scale != "" ? setSelectedPitchScale(scale) : undefined
  }
  const onChangePitchScaleMenu = (scale: string) => {
    setSelectedPitchScale(scale)

    const pitch: number = PitchScale.find(e => e.name == scale)?.value ?? 1
    setPitch(pitch)
  }

  // 座標指定関系
  const [Coordinate, setCoordinate] = useState("");
  const [CoordinateError, { on: onCoordinateError, off: offCoordinateError }] = useBoolean(false);
  const onChangeCoordinate = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {

    const str = e.target.value

    // 条件に応じてエラー表示を行う
    // if (/([\^\~]?[\d]{1,})*/g.test(str) || str === "") offCoordinateError()
    // else onCoordinateError()

    setCoordinate(e.target.value)

  }, [setCoordinate])
  const onClickTilde = () => {
    const splitCoordinate: number[] = Coordinate.replaceAll("~", "").replaceAll("^", "").split(" ").map(v => v == "" ? 0 : Number(v))
    let returnCoordinate: string[] = ["~"]
    for (let i = 0; i <= 2; i++) {
      returnCoordinate.push((typeof splitCoordinate[i] === "number" && splitCoordinate[i] != 0 && splitCoordinate[i].toString() != "NaN") ? splitCoordinate[i].toString() : "")
      if (i < 2) returnCoordinate.push(" ~")
    }
    setCoordinate(returnCoordinate.join(""))
  }
  const onClickCaret = () => {
    const splitCoordinate: number[] = Coordinate.replaceAll("~", "").replaceAll("^", "").split(" ").map(v => v == "" ? 0 : Number(v))
    let returnCoordinate: string[] = ["^"]
    for (let i = 0; i <= 2; i++) {
      returnCoordinate.push((typeof splitCoordinate[i] === "number" && splitCoordinate[i] != 0 && splitCoordinate[i].toString() != "NaN") ? splitCoordinate[i].toString() : "")
      if (i < 2) returnCoordinate.push(" ^")
    }
    setCoordinate(returnCoordinate.join(""))
  }
  const onClickRemoveSymbol = () => {
    const splitCoordinate: number[] = Coordinate.replaceAll("~", "").replaceAll("^", "").split(" ").map(v => v == "" ? NaN : Number(v))
    const HasIndexes: boolean = splitCoordinate.filter(v => v.toString() != "NaN").length > 0
    let returnCoordinate: string[] = [""]
    for (let i = 0; i <= 2; i++) {
      returnCoordinate.push((typeof splitCoordinate[i] === "number" && splitCoordinate[i] != 0 && splitCoordinate[i].toString() != "NaN") ? splitCoordinate[i].toString() : (HasIndexes ? "0" : ""))
      if (HasIndexes && i < 2) returnCoordinate.push(" ")
    }
    setCoordinate(returnCoordinate.join(""))
  }

  // セレクター関系
  const [Selector, setSelector] = useState("@a");
  const [SelectorError, { on: onSelectorError, off: offSelectorError }] = useBoolean(false);
  const [SelectorX0, { toggle: toggleSelectorX0 }] = useBoolean(false)
  const onChangeSelector = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    // スペースを削除した文字列を入手
    // const selector = e.target.value.replaceAll(" ", "")

    // コンマでスプリット > イコールでスプリット

    // offSelectorError()
    setSelector(e.target.value)

  }, [setSelector])

  // ボリューム(生成)関係
  const [MaxVolume, setMaxVolume] = useState(1);
  const [MinVolume, setMinVolume] = useState(0);
  const onChangeMaxVolumeInput = (e: string, value: number) => {
    setMaxVolume(value)
  }
  const onChangeMinVolumeInput = (e: string, value: number) => {
    setMinVolume(value)
  }


  const sounds = useAppSelector(state => state.fetch.sounds);

  const selectedSound = useAppSelector(state => state.fetch.selectedSound);
  const soundSelectDetector = useAppSelector(state => state.fetch.soundSelectDetector);

  const targetVersion = useAppSelector(state => state.fetch.targetVersion);

  const appVolume = useAppSelector(state => state.fetch.appVolume);



  // コマンド生成
  const command = selectedSound != "" ? (
    [
      (SlashSwitch ? "/" : "") + "playsound",
      selectedSound,
      ((PlaySource == "master" && Coordinate == "" && MaxVolume == 1 && Pitch == 1 && MinVolume == 0) ? "" : PlaySource),
      ((Selector == "@a" && Coordinate == "" && MaxVolume == 1 && Pitch == 1 && MinVolume == 0) ? "" : Selector),
      ((Coordinate == "" && MaxVolume == 1 && Pitch == 1 && MinVolume == 0) ? "" : Coordinate),
      ((MaxVolume == 1 && Pitch == 1 && MinVolume == 0) ? "" : MaxVolume),
      ((Pitch == 1 && MinVolume == 0) ? "" : Pitch),
      (MinVolume == 0 ? "" : MinVolume)
    ].join(" ")
  ) : ""

  const isPlaying = false




  const [playTarget, setPlayTarget] = useState<SoundName>();

  useEffect(() => {
    (async () => {
      const targetSound = sounds.filter(sound => sound.id == selectedSound)[0];
      const targetHashes = targetSound?.sounds ?? []
      const sound = targetHashes[Math.floor(Math.random() * targetHashes.length)]

      try {
        const hash = await myAPI.get_mcSoundHash(sound?.hash ?? "")
        setPlayTarget({ hash, pitch: sound?.pitch ?? 1 });

      } catch (e: unknown) {
        alert(e);
      }
    })();
  }, [soundSelectDetector]);






  return (
    <>
      <footer className="fixed_bottom">
        <Box w="full" bg="footerBackground" padding={2} borderTop="1px solid" borderColor="inherit" style={{ userSelect: "none" }}>

          <Box alignContent="center" paddingX={1}>
            <Slider step={0.01} defaultValue={0} filledTrackColor="primary" thumbColor="primary" trackColor="gray.200" thumbSize={2.5} thumbProps={{ _focusVisible: { boxShadow: "" } }} />
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
            <Tooltip label="ピッチスライダー" placement="bottom" animation="top">
              <Box>
                <Slider onChange={onChangePitchSlider} value={Pitch} w={32} step={0.01} min={0.5} max={2} filledTrackColor="gray.200" thumbColor="primary" trackColor="gray.200" thumbSize={2.5} thumbProps={{ _focusVisible: { boxShadow: "" } }} />
              </Box>
            </Tooltip>
            <Spacer maxW={3} />
            <Tooltip label="ピッチ入力" placement="bottom" animation="top">
              <NumberInput onChange={onChangePitchInput} value={Pitch} w={20} placeholder="pitch" step={0.1} precision={2} min={0.5} max={2} />
            </Tooltip>
            <Spacer maxW={1} />
            <Tooltip label="音階(音ブロック用)" placement="bottom" animation="top">
              <Select onChange={onChangePitchScaleMenu} items={PitchScaleItems} value={SelectedPitchScale} placeholderInOptions={false} w={32} animation="bottom" listProps={{ padding: 0, margin: 0 }} />
            </Tooltip>
          </Flex>

          <Flex w="full" marginTop={1} >
            <Tooltip label="スラッシュをつける" placement="bottom" animation="top">
              <Toggle variant="outline" colorScheme="primary" icon={<SlashIcon fontSize="lg" />} onClick={toggleSlash} />
            </Tooltip>
            <Spacer maxW={1} />
            <Tooltip label="再生カテゴリ" placement="bottom" animation="top">
              <Select items={PlaySourceItems} onChange={setPlaySource} defaultValue="master" placeholderInOptions={false} w={32} animation="bottom" listProps={{ padding: 0, margin: 0 }} />
            </Tooltip>
            <Spacer />
            <Tooltip label="Max Volume" placement="bottom" animation="top">
              <NumberInput onChange={onChangeMaxVolumeInput} w={32} defaultValue={1.0} precision={2} min={0.0} step={0.1} />
            </Tooltip>
            <Spacer maxW={1} />
            <Tooltip label="Min Volume" placement="bottom" animation="top">
              <NumberInput onChange={onChangeMinVolumeInput} w={32} defaultValue={0.0} precision={2} min={0.0} step={0.1} />
            </Tooltip>
          </Flex>

          <Flex w="full" marginTop={1} >
            <Tooltip label="座標" placement="bottom" animation="top">
              <Input value={Coordinate} onChange={onChangeCoordinate} invalid={CoordinateError} w="calc(full - xs)" placeholder="Coordinate" />
            </Tooltip>
            <Spacer maxW={10} />
            <Tooltip label="相対" placement="bottom" animation="top">
              <Box border="1px solid" borderColor="inherit" borderRadius={5} >
                <IconButton onClick={onClickTilde} icon={<PiTildeBold size={20} />} variant="ghost" />
              </Box>
            </Tooltip>
            <Spacer maxW={1} />
            <Tooltip label="向き相対" placement="bottom" animation="top">
              <Box border="1px solid" borderColor="inherit" borderRadius={5} >
                <IconButton onClick={onClickCaret} icon={<PiCaretUpBold size={20} />} variant="ghost" />
              </Box>
            </Tooltip>
            <Spacer maxW={1} />
            <Tooltip label="シンボルクリア" placement="bottom" animation="top">
              <Box border="1px solid" borderColor="inherit" borderRadius={5} >
                <IconButton onClick={onClickRemoveSymbol} icon={<PiSelectionBold size={20} />} variant="ghost" />
              </Box>
            </Tooltip>
          </Flex>

          <Flex w="full" marginTop={1} >
            <Tooltip label="セレクタ" placement="bottom" animation="top">
              <Input onChange={onChangeSelector} invalid={SelectorError} defaultValue="@a" w="calc(full - xs)" placeholder="Selector" />
            </Tooltip>
            <Spacer maxW={10} />
            <Tooltip label="他ディメンションへの干渉を抑制" placement="bottom" animation="top">
              <Toggle disabled onClick={toggleSelectorX0} variant="outline" colorScheme="primary" defaultSelected icon={<MegaphoneOffIcon fontSize="lg" />} />
            </Tooltip>
          </Flex>

          <Box w="full" marginTop={1} border="1px solid" borderColor="bg" borderRadius={5} >
            <Flex>
              <Box alignContent="center" paddingX={3} style={{ userSelect: "none" }} >{command}</Box>
              <Spacer />
              <Box><Separator orientation="vertical" borderColor="bg" /></Box>
              <Tooltip label={hasCopied ? "Copied!" : "Copy"} placement="bottom" animation="top">
                <IconButton icon={hasCopied ? <CheckIcon color="success" marginX={6} /> : <CopyIcon marginX={6} />} onClick={() => onCopy(command)} variant="ghost" borderLeftRadius={0} borderRightRadius={2} />
              </Tooltip>
            </Flex>
          </Box>

        </Box>
      </footer>
    </>
  );
};