import { Box } from '@mui/material'
import Finding from 'src/models/finding'
import { ISimDoc } from 'src/models/simDoc/types'
import Simulation from 'src/models/simulation'
import Typography from '@components/Typography/Typography'
import _ from 'lodash'
import compose from '@shopify/react-compose'
import { observer } from 'mobx-react'

const SimDocsView = observer((props: any) => {
  const {
    simulationMappers,
    findingId,
  }: {
    simDocId: string
    simulations: Simulation[]
    simulationMappers: { simulationId: number; findingId: number }[]
    findings: Finding[]
    findingId: number
  } = props
  const selectedSimulationIds = simulationMappers
    .filter((_sm) => _sm.findingId === findingId)
    .sort((a, b) => (a.simulationId > b.simulationId ? 1 : -1))
    .map((_sm) => _sm.simulationId)
    .join(',')

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

  return <Box>{selectedSimulationIds}</Box>
})

export default compose<any>()(SimDocsView)
