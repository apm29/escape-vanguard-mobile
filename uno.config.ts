import {
  createLocalFontProcessor,
} from '@unocss/preset-web-fonts/local'
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetWebFonts,
  presetWind3,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  shortcuts: [
    ['btn', 'px-4 py-1 rounded inline-block bg-teal-700 text-white cursor-pointer !outline-none hover:bg-teal-800 disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50'],
    ['icon-btn', 'inline-block cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100 hover:text-teal-600'],
  ],
  presets: [
    presetWind3(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
    }),
    presetTypography(),
    presetWebFonts({
      fonts: {
        sans: 'DM Sans',
        serif: 'DM Serif Display',
        mono: 'DM Mono',
      },
      processors: createLocalFontProcessor(),
    }),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  safelist: [
    'i-carbon:earthquake',
    'i-carbon:fire',
    'i-carbon:flood',
    'i-carbon:windy',
    'i-carbon:drought',
    'i-carbon:notification',
    'i-carbon:health-cross',
    'i-carbon:home',
    'i-carbon:car',
    'i-carbon:camera',
    'i-carbon:layers',
    'i-carbon:overflow-menu-vertical',
    'i-carbon:warning-alt-filled',
    'i-carbon:warning-alt',
    'i-carbon:warning',
    'i-carbon:warning-filled',
    
  ],
})
