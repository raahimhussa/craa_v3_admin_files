import { WrappingFunction } from "@shopify/react-compose"
import { observer } from "mobx-react"
import { useParams } from "react-router-dom"

const withParams: WrappingFunction = (WrappedComponent) => observer((props) => {
  const params = useParams()

  const _props = {
    ...props,
    ...params
  }

  return <WrappedComponent {..._props} />
})

export default withParams