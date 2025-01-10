import { Box } from '@mui/material'
import IDomain from 'src/models/domain/domain.interface'
import { ISimDoc } from 'src/models/simDoc/types'
import _ from 'lodash'
import compose from '@shopify/react-compose'
import { observer } from 'mobx-react'

const SubdomainsView = observer((props: any) => {
  const {
    domains,
  }: {
    domains: IDomain[]
  } = props

  return (
    <Box>
      {domains.map((domain) => (
        <Box>{domain.name}</Box>
      ))}
    </Box>
  )
})

export default compose<any>()(SubdomainsView)
