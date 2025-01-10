import { Box } from '@mui/material'
import { ISimDoc } from 'src/models/simDoc/types'
import Typography from '@components/Typography/Typography'
import _ from 'lodash'
import compose from '@shopify/react-compose'
import { observer } from 'mobx-react'

const SimDocsView = observer((props: any) => {
  const {
    simDocs,
  }: {
    simDocs: ISimDoc[]
  } = props

  const simDocTitles = simDocs.map((simDoc) => (
    <Typography sx={{ fontSize: '12px' }}>{simDoc.title}</Typography>
  ))

  return <Box>{simDocTitles}</Box>
})

export default compose<any>()(SimDocsView)
