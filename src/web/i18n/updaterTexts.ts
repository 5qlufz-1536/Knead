import en from './locales/en.json'
import ja from './locales/ja.json'

type UpdaterTexts = {
    title: string
    updateTitle: string
    message: string
    buttons: string[]
    progressTitle: string
    launchingUpdater: string
    errorTitle: string
    notfoundUpdater: string
}

interface TranslationFile {
    [key: string]: unknown
    updater: UpdaterTexts
}

const dictionary: Record<string, UpdaterTexts> = {
    en: (en as unknown as TranslationFile).updater,
    ja: (ja as unknown as TranslationFile).updater,
}

export const getUpdaterTexts = (lang: string): UpdaterTexts => {
    return dictionary[lang] ?? dictionary.en
}
