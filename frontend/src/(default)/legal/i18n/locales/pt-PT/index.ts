// src/(default)/legal/i18n/locales/pt-PT/index.ts

import type { LegalLocaleBundle } from '@/src/(default)/legal/i18n/legal-locale.types.ts'
import { privacy } from '@/src/(default)/legal/i18n/locales/pt-PT/privacy.ts'
import { terms } from '@/src/(default)/legal/i18n/locales/pt-PT/terms.ts'
import { ui } from '@/src/(default)/legal/i18n/locales/pt-PT/ui.ts'

/** European Portuguese (pt-PT) legal content. */
const bundle: LegalLocaleBundle = {
    ui,
    documents: { terms, privacy },
}

export default bundle
