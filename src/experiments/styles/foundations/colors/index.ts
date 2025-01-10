import { purple, gray, blue } from './palette'

export const colors = {
  primary: purple['500'],
  'on-primary': purple['50'],
  'on-primary-weak': purple['200'],
  'on-primary-disabled': purple['300'],
  'on-primary-divider': purple['400'],

  secondary: blue['500'],
  'on-secondary': blue['50'],
  'on-secondary-weak': blue['200'],
  'on-secondary-disabled': blue['300'],
  'on-secondary-divider': blue['400'],

  background: gray['50'],
  'on-background': gray['800'],
  'on-background-weak': gray['600'],
  'on-background-disabled': gray['300'],
  'on-background-divider': gray['100'],

  surface: 'white',
  'on-surface': gray['800'],
  'on-surface-weak': gray['600'],
  'on-surface-disabled': gray['300'],
  'on-surface-divider': gray['100'],
}
