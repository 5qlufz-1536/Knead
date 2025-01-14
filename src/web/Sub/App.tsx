import React from 'react'
import { Box, VStack, Reorder, ReorderItem, ReorderTrigger, HStack, Text } from '@yamada-ui/react'

export const SubApp = () => {
  // こいつもバーチャルスクロールで実装しなければいけなさそう？
  const items = ['test1', 'test2', 'test3', 'test4', 'test5', 'test6', 'test7', 'test8', 'test9', 'test10'].map(item => (
    <ReorderItem value={item} key={item} padding={2}>
      <HStack>
        <ReorderTrigger />
        <Text>{item}</Text>
      </HStack>
    </ReorderItem>
  ))

  return (
    <>
      <VStack h="100vh">
        <Box padding={2}>
          <Box padding={2} border="1px solid" borderColor="inherit" borderRadius={5} h="calc(100vh - 30px)" overflowY="scroll">
            <Reorder position="relative" gap={2}>
              {items}
            </Reorder>
          </Box>
        </Box>
      </VStack>
    </>
  )
}
