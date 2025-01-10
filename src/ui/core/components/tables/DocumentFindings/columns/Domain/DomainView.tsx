import { Box } from '@mui/material'
import IDomain from 'src/models/domain/domain.interface'
import { ISimDoc } from 'src/models/simDoc/types'
import _ from 'lodash'
import compose from '@shopify/react-compose'
import { observer } from 'mobx-react'

const DomainView = observer((props: any) => {
  const {
    domain,
  }: {
    domain: IDomain
  } = props

  return <Box>{domain.name}</Box>
})

export default compose<any>()(DomainView)
