import FindingAutocompleteCompareView from './FindingAutocompleteCompareView'
import { AutocompleteProps as MuiAutocompleteProps } from '@mui/material'
import compose from '@shopify/react-compose'

type AutocompleteProps = MuiAutocompleteProps<any, any, any, any, any> & any

export default compose<AutocompleteProps>()(FindingAutocompleteCompareView)
