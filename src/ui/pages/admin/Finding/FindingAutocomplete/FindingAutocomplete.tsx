import FindingAutocompleteView from './FindingAutocompleteView'
import { AutocompleteProps as MuiAutocompleteProps } from '@mui/material'
import compose from '@shopify/react-compose'
import { withFind } from '@hocs'

// type AutocompleteProps = MuiAutocompleteProps<any, any, any, any, any> & any

export default compose<any>()(FindingAutocompleteView)
