import { observer } from 'mobx-react'
function SnippetView({ ...rest }: any) {
  return <div {...rest} />
}
export default observer(SnippetView)
