import React, { useState } from 'react'
import {
  Box, VStack, HStack, Text, IconButton, Select, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Spacer, Button, useDisclosure, Dialog, DialogOverlay, DialogHeader, DialogBody, DialogFooter, Reorder, ReorderItem, ReorderTrigger,
  FormControl
} from '@yamada-ui/react'
import { FaPlay, FaPause, FaCopy, FaTrash, FaPlus } from 'react-icons/fa6'
import { useAppSelector } from '../../store/_store'

interface SoundGroup {
  id: string
  sound: string
  pitch: number
  volume: number
  playing: boolean
}

export const SubApp = () => {
  // Reduxストアからサウンドリストを取得
  const sounds = useAppSelector(state => state.fetch.sounds)
  const soundIdList = sounds.map(s => s.id)

  // 初期値はサウンドリストが空でなければ最初のID
  const initialId = soundIdList[0] || ''
  const initialSound = sounds.find(s => s.id === initialId)?.sounds[0]?.path || ''

  const [groups, setGroups] = useState<SoundGroup[]>([
    { id: initialId, sound: initialSound, pitch: 1, volume: 50, playing: false },
  ])
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef(null)

  // 並び替え
  const handleReorder = (values: SoundGroup[]) => setGroups(values)

  // Reorder用の値（value）には一意な値（id+index）を使う
  // onChangeの引数は新しい順序のvalue配列なので、groupsをvalue順に並び替える必要がある
  const reorderValues = groups.map((g, i) => ({ ...g, _reorderKey: g.id + '-' + g.sound + '-' + i }))

  // valueから元のSoundGroupを復元する関数
  const getGroupByReorderKey = (key: string) => reorderValues.find(g => g._reorderKey === key) as SoundGroup

  // ReorderのonChangeで新しい順序のkey配列が渡るので、それに従ってgroupsを並び替える
  const handleReorderKeys = (keys: string[]) => {
    setGroups(keys.map(getGroupByReorderKey))
  }

  // グループ追加
  const addGroup = () => {
    const id = soundIdList[0] || ''
    const sound = sounds.find(s => s.id === id)?.sounds[0]?.path || ''
    setGroups([...groups, { id, sound, pitch: 1, volume: 50, playing: false }])
  }

  // 複製
  const duplicateGroup = (idx: number) => setGroups([
    ...groups.slice(0, idx + 1),
    { ...groups[idx] },
    ...groups.slice(idx + 1)
  ])

  // 削除
  const confirmDelete = (idx: number) => {
    setDeleteIndex(idx)
    onOpen()
  }
  const deleteGroup = () => {
    if (deleteIndex !== null) {
      setGroups(groups.filter((_, i) => i !== deleteIndex))
      setDeleteIndex(null)
      onClose()
    }
  }

  // 再生/停止
  const togglePlay = (idx: number) => {
    setGroups(groups.map((g, i) => i === idx ? { ...g, playing: !g.playing } : g))
  }

  // ID変更
  const changeId = (idx: number, id: string) => {
    const sound = sounds.find(s => s.id === id)?.sounds[0]?.path || ''
    setGroups(groups.map((g, i) => i === idx ? { ...g, id, sound } : g))
  }
  // サウンド変更
  const changeSound = (idx: number, sound: string) => {
    setGroups(groups.map((g, i) => i === idx ? { ...g, sound } : g))
  }
  // ピッチ・音量変更
  const changePitch = (idx: number, pitch: number) => {
    setGroups(groups.map((g, i) => i === idx ? { ...g, pitch } : g))
  }
  const changeVolume = (idx: number, volume: number) => {
    setGroups(groups.map((g, i) => i === idx ? { ...g, volume } : g))
  }

  return (
    <VStack h="100vh" w="full" maxW="container.lg" mx="auto">
      <Box padding={2} flex={1} w="full" maxW="container.lg" mx="auto">
        <Box
          padding={2}
          border="1px solid"
          borderColor="inherit"
          borderRadius={5}
          h="calc(100vh - 120px)"
          overflowY="auto"
          w="full"
          maxW="container.lg"
          mx="auto"
        >
          <Reorder orientation="vertical" onChange={handleReorderKeys} w="full">
            {reorderValues.map((group, idx) => {
              const soundOptions = sounds.find(s => s.id === group.id)?.sounds || []
              const selectId = `sound-id-${idx}`
              const soundSelectId = `sound-path-${idx}`

              return (
                <ReorderItem
                  value={group._reorderKey}
                  key={group._reorderKey}
                  w="full"
                  border="1px solid"
                  borderColor="gray.700"
                  borderRadius={8}
                  p={3}
                  mb={3}
                  bg="bg"
                >
                  <HStack w="full" alignItems="center" gap={2}>
                    <ReorderTrigger />
                    <IconButton
                      size="sm"
                      colorScheme={group.playing ? 'green' : 'gray'}
                      icon={group.playing ? <FaPause /> : <FaPlay />}
                      onClick={() => togglePlay(idx)}
                      aria-label={group.playing ? '停止' : '再生'}
                    />

                    {/* サウンドID選択 */}
                    <FormControl id={selectId} w={260}>
                      <Select
                        value={group.id}
                        onChange={value => changeId(idx, value)}
                        aria-label="サウンドID"
                        title="サウンドID"
                      >
                        {soundIdList.map(id => (
                          <option key={id} value={id}>
                            {id}
                          </option>
                        ))}
                      </Select>
                    </FormControl>

                    {/* サウンドパス選択 */}
                    <FormControl id={soundSelectId} w={210}>
                      <Select
                        value={group.sound}
                        onChange={value => changeSound(idx, value)}
                        aria-label="サウンドパス"
                        title="サウンドパス"
                      >
                        {soundOptions.map(s => (
                          <option key={s.path} value={s.path}>
                            {s.path}
                          </option>
                        ))}
                        <option value="random">ランダム</option>
                      </Select>
                    </FormControl>

                    {/* ピッチ */}
                    <Box w={140}>
                      <Text fontSize="xs">ピッチ</Text>
                      <Slider
                        min={0.5}
                        max={2}
                        step={0.01}
                        value={group.pitch}
                        onChange={v => changePitch(idx, v)}
                        aria-label="ピッチ"
                      >
                        <SliderTrack>
                          <SliderFilledTrack />
                        </SliderTrack>
                        <SliderThumb />
                      </Slider>
                    </Box>

                    {/* 音量 */}
                    <Box w={140}>
                      <Text fontSize="xs">音量</Text>
                      <Slider
                        min={0}
                        max={100}
                        step={1}
                        value={group.volume}
                        onChange={v => changeVolume(idx, v)}
                        aria-label="音量"
                      >
                        <SliderTrack>
                          <SliderFilledTrack />
                        </SliderTrack>
                        <SliderThumb />
                      </Slider>
                    </Box>

                    <IconButton size="sm" icon={<FaCopy />} aria-label="複製" onClick={() => duplicateGroup(idx)} />
                    <IconButton size="sm" colorScheme="red" icon={<FaTrash />} aria-label="削除" onClick={() => confirmDelete(idx)} />
                  </HStack>
                </ReorderItem>
              )
            })}
          </Reorder>
        </Box>
      </Box>

      {/* 下部ボタン群 */}
      <HStack w="full" justifyContent="center" padding={2} borderTop="1px solid" borderColor="inherit">
        <Button onClick={() => {/* リスタート処理 */}}>リスタート</Button>
        <Button leftIcon={<FaPlay />} colorScheme="green" onClick={() => {/* 全体再生処理 */}}>再生</Button>
        <Button leftIcon={<FaPlus />} onClick={addGroup}>グループ追加</Button>
        <Button onClick={() => {/* メインウィンドウの選択中IDで追加 */}}>メイン選択IDで追加</Button>
      </HStack>

      {/* 削除確認ダイアログ */}
      <Dialog open={isOpen} onClose={onClose}>
        <DialogOverlay />
        <Box bg="white" borderRadius={8} p={6} minW={300}>
          <DialogHeader>グループ削除</DialogHeader>
          <DialogBody>本当に削除しますか？</DialogBody>
          <DialogFooter>
            <Button ref={cancelRef} onClick={onClose}>キャンセル</Button>
            <Button colorScheme="red" onClick={deleteGroup} ml={3}>削除</Button>
          </DialogFooter>
        </Box>
      </Dialog>
    </VStack>
  )
}
