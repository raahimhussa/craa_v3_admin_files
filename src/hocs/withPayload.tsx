import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'

const withPayload = (kind: string) => (WrappedComponent: any) =>
  observer((props: any) => {
    const { modalStore }: any = useRootStore()
    return <WrappedComponent {...props} {...modalStore[kind].payload} {...modalStore[kind]} />
  })

export default withPayload
