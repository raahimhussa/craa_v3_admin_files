import { Box } from '@mui/material'
import IDomain from 'src/models/domain/domain.interface'
import { ISimDoc } from 'src/models/simDoc/types'
import _ from 'lodash'
import compose from '@shopify/react-compose'
import { observer } from 'mobx-react'

const DomainView = observer((props: any) => {
  const {
    domain,
    searchString,
  }: {
    domain: IDomain
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

  return (
    <Box
      sx={{
        lineHeight: '18px',
        width: '100%',
        whiteSpace: 'normal',
        overflowX: 'auto',
      }}
    >
      {highlightedText(domain.name, searchString)}
    </Box>
  )
})

export default compose<any>()(DomainView)
