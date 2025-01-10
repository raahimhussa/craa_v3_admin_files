import { observer } from 'mobx-react'
function ImageView({ ...rest }: any) {
  return <img {...rest}/>
}
export default observer(ImageView)
