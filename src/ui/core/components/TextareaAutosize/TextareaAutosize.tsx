import compose from '@shopify/react-compose'
import TextareaAutosizeView from './TextareaAutosizeView'
import { TextareaAutosizeProps as MuiTextareaAutosizeProps } from '@mui/material'
export type TextareaAutosizeProps = MuiTextareaAutosizeProps & {
    state: any
    path: string
}
export type HocComponent = {}
export type TextareaAutosizeViewProps = TextareaAutosizeProps & HocComponent

export default compose<TextareaAutosizeProps>()(TextareaAutosizeView)
