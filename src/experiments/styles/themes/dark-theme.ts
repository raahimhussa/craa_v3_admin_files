import { gray } from '../foundations/colors/palette'
import { createTheme } from '../stitches.config'

export const darkTheme = createTheme({
  colors: {
    surface: gray['800'],
    'on-surface': gray['100'],
    'on-surface-divider': gray['700'],

    background: gray['900'],
  },
})
