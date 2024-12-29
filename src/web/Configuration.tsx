
import { SettingsIcon } from "@yamada-ui/lucide";
import { Drawer, DrawerHeader, DrawerBody, DrawerFooter, useDisclosure, IconButton, Button } from "@yamada-ui/react"




export const Configuration = () => {

  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <IconButton onClick={onOpen} icon={<SettingsIcon />} />

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