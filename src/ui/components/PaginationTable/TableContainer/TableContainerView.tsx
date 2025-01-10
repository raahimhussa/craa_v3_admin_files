import { Box } from '@mui/material'
import FindingsTable from 'src/ui/core/components/tables/Findings/Findings'
import Loading from '@components/Loading/Loading'
import _ from 'lodash'
import { observer } from 'mobx-react'

type Props = {
  Table: React.ComponentType
} & any

function TableContainerView({ Table, ...rest }: Props) {
  const data = rest[rest.collectionName]
  const isValidating = rest.isValidating ? false : true
  if (rest.collectionName !== 'assessments') {
    if (data.length !== 0) return <Table {...rest} data={data} />
    if (data.length === 0 && isValidating)
      return <Table {...rest} data={data} />
  } else {
    return <Table {...rest} data={data} />
  }
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: rest.height ? rest.height : 'calc(100vh - 130px)',
      }}
    >
      <Loading />
    </Box>
  )
}
export default observer(TableContainerView)
