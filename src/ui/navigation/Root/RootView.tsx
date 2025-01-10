import _ from 'lodash'
import { observer } from 'mobx-react'
import { useRoutes } from 'react-router-dom'
function RootView({ adminRoutes }: any) {
  return useRoutes(adminRoutes)
}
export default observer(RootView)
