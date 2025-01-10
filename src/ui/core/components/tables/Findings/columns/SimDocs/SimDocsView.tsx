import { Box } from '@mui/material'
import { ISimDoc } from 'src/models/simDoc/types'
import Typography from '@components/Typography/Typography'
import _ from 'lodash'
import compose from '@shopify/react-compose'
import { observer } from 'mobx-react'

const SimDocsView = observer((props: any) => {
  const {
    simDocs,
    searchString,
  }: {
    simDocs: ISimDoc[]
    searchString: string
  } = props

  const highlightedText = (text: any, query: any) => {
    if (query !== '' && text?.toString()?.toLowerCase()?.includes(query)) {
      const parts = text.split(new RegExp(`(${query})`, 'gi'))

      return (
        <>
          {parts.map((part: any, index: any) =>
            part.toLowerCase() === query.toLowerCase() ? (
              <mark key={index}>{part}</mark>
            ) : (
              part
            )
          )}
        </>
      )
    }

    return text
  }

  const simDocTitles = simDocs.map((simDoc) => (
    <Typography sx={{ fontSize: '12px' }}>
      {highlightedText(simDoc.title, searchString)}
    </Typography>
  ))

  return <Box>{simDocTitles}</Box>
})

export default compose<any>()(SimDocsView)
