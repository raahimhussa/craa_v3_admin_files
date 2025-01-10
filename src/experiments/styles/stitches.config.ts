import type { PropertyValue } from '@stitches/react'
import { createStitches, defaultThemeMap } from '@stitches/react'
import {
  borderStyles,
  borderWidths,
  colors,
  fonts,
  fontSizes,
  fontWeights,
  letterSpacings,
  lineHeights,
  radii,
  shadows,
  sizes,
  space,
  transitions,
  zIndices,
} from './foundations'
import { media } from './media'

export const {
  config,
  createTheme,
  css,
  getCssText,
  globalCss,
  styled,
  theme,
} = createStitches({
  prefix: 'fluido',
  media,
  theme: {
    borderStyles,
    borderWidths,
    colors,
    fonts,
    fontSizes,
    fontWeights,
    letterSpacings,
    lineHeights,
    radii,
    shadows,
    sizes,
    space,
    transitions,
    zIndices,
  },
  utils: {
    marginX: (value: PropertyValue<'marginRight'>) => ({
      marginLeft: value,
      marginRight: value,
    }),
    marginY: (value: PropertyValue<'marginTop'>) => ({
      marginTop: value,
      marginBottom: value,
    }),
    paddingX: (value: PropertyValue<'paddingRight'>) => ({
      paddingLeft: value,
      paddingRight: value,
    }),
    paddingY: (value: PropertyValue<'paddingTop'>) => ({
      paddingTop: value,
      paddingBottom: value,
    }),
    bg: (value: PropertyValue<'backgroundColor'>) => ({
      backgroundColor: value,
    }),
    justify: (value: PropertyValue<'justifyContent'>) => ({
      justifyContent: value,
    }),
    items: (value: PropertyValue<'alignItems'>) => ({
      alignItems: value,
    }),
    space: (value: PropertyValue<'marginTop'>) => ({
      '& > * + *': {
        marginTop: value,
      },
    }),
    linearGradient: (value: PropertyValue<'backgroundImage'>) => ({
      backgroundImage:
        'linear-gradient(to right, $$gradientStart, $$gradientEnd)',
    }),
    gradientStart: (value: PropertyValue<'backgroundColor'>) => ({
      $$gradientStart: value,
    }),
    gradientEnd: (value: PropertyValue<'backgroundColor'>) => ({
      $$gradientEnd: value,
    }),
  },
  themeMap: {
    ...defaultThemeMap,
    gradientStart: 'colors',
    gradientEnd: 'colors',
  },
})
