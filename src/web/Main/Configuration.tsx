import React, { useState } from 'react'
import { SettingsIcon, ArrowDownAZIcon, FilterIcon } from '@yamada-ui/lucide'
import { Drawer, DrawerHeader, DrawerBody, useDisclosure, IconButton, Switch, Text, HStack, Card, CardHeader, CardBody, VStack } from '@yamada-ui/react'
import { ThemeChange } from './ThemeChange'
import { useTranslation } from 'react-i18next'
import { LanguageChange } from './LanguageChange'

export const Configuration = () => {
  const { open, onOpen, onClose } = useDisclosure()

  const { t } = useTranslation()

  const [holdSoundsSort, setHoldSoundsSort] = useState<boolean | undefined>(undefined)
  if (holdSoundsSort === undefined) setHoldSoundsSort(JSON.parse(localStorage.getItem('holdSoundsSort') ?? 'false'))
  const changesetHoldSoundsSort = (v: boolean) => {
    setHoldSoundsSort(v)
    localStorage.setItem('holdSoundsSort', v.toString())
  }

  const [holdRatingFilter, setHoldRatingFilter] = useState<boolean | undefined>(undefined)
  if (holdRatingFilter === undefined) setHoldRatingFilter(JSON.parse(localStorage.getItem('holdRatingFilter') ?? 'false'))
  const changeHoldRatingFilter = (v: boolean) => {
    setHoldRatingFilter(v)
    localStorage.setItem('holdRatingFilter', v.toString())
  }

  return (
    <>
      <IconButton onClick={onOpen} icon={<SettingsIcon fontSize="xl" />} />

      <Drawer open={open} onClose={onClose} size="lg" placement="right" style={{ userSelect: 'none' }}>
        <DrawerHeader>{t('settings')}</DrawerHeader>

        <DrawerBody>

          <VStack gap={2}>
            <Card w="full" variant="outline">
              <LanguageChange />
            </Card>

            <Card w="full" variant="outline">
              <ThemeChange />
            </Card>

            <Card w="full" variant="outline">
              <CardHeader>
                <HStack>
                  <ArrowDownAZIcon fontSize="xl" />
                  <Text>{t('sort')}</Text>
                </HStack>
              </CardHeader>
              <CardBody>
                <Switch checked={holdSoundsSort} onChange={() => changesetHoldSoundsSort(!holdSoundsSort)}>{t('hold_sounds_sort')}</Switch>
              </CardBody>
            </Card>

            <Card w="full" variant="outline">
              <CardHeader>
                <HStack>
                  <FilterIcon fontSize="xl" />
                  <Text>{t('rating_filter')}</Text>
                </HStack>
              </CardHeader>
              <CardBody>
                <Switch checked={holdRatingFilter} onChange={() => changeHoldRatingFilter(!holdRatingFilter)}>{t('hold_rating_filter')}</Switch>
              </CardBody>
            </Card>

          </VStack>

        </DrawerBody>

      </Drawer>
    </>
  )
}
