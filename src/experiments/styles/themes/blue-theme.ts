import { blue } from '../foundations/colors/palette'
import { createTheme } from '../stitches.config'

export const blueTheme = createTheme({
  colors: {
    surface: blue['800'],
    'on-surface': blue['100'],
    'on-surface-divider': blue['700'],

    background: blue['900'],
  },
})
