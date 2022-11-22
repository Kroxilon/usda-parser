import { defineConfig } from 'vitest/config'

import { resolve } from 'path'

const r = (p: string) => resolve(__dirname, p)

export default defineConfig({
    test: {
        cache: {
            dir: '.vitest'
        },

        // ...
    },
    resolve: {
        alias: {
            '@kroxilon/usda-parser': r('./')
        },
    }
})
