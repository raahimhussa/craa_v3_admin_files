import compose from '@shopify/react-compose'
import AutocompleteView from './AutocompleteView'
import { AutocompleteProps as MuiAutocompleteProps } from '@mui/material'

type AutocompleteProps = MuiAutocompleteProps<any, any, any, any, any> & any

export default compose<AutocompleteProps>()(AutocompleteView)
