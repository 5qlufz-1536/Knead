
import { Settings2Icon } from "@yamada-ui/lucide";
import { Button, Drawer, DrawerHeader, DrawerBody, DrawerFooter, useDisclosure } from "@yamada-ui/react"




export const Configuration = () => {

  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Button onClick={onOpen}><Settings2Icon /></Button>

      <Drawer isOpen={isOpen} onClose={onClose}>
        <DrawerHeader>設定</DrawerHeader>

        <DrawerBody>
          仮置き
        </DrawerBody>

        <DrawerFooter>
          <Button variant="ghost" onClick={onClose}>
            とじる
          </Button>
          <Button colorScheme="primary">あ</Button>
        </DrawerFooter>
      </Drawer>
    </>
  );
};