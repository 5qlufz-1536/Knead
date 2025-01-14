import React, { useEffect } from 'react'
import { Box, VStack, Reorder, ReorderItem, ReorderTrigger, HStack, Text, useColorMode } from '@yamada-ui/react'

export const SubApp = () => {
  const { changeColorMode, internalColorMode } = useColorMode()

  const items = ['test1', 'test2', 'test3', 'test4', 'test5', 'test6', 'test7', 'test8', 'test9', 'test10'].map(item => (
    <ReorderItem value={item} key={item}>
      <HStack>
        <ReorderTrigger />
        <Text>{item}</Text>
      </HStack>
    </ReorderItem>
  ))

  useEffect(() => {
    console.log(internalColorMode)
    changeColorMode(internalColorMode)
  }, [changeColorMode, internalColorMode])

  return (
    <>
      <VStack h="100vh">
        <Box padding={2}>
          <Reorder>
            {items}
          </Reorder>
        </Box>
      </VStack>
    </>
  )
}
