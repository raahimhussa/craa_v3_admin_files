import {
  Alert,
  AlertTitle,
  Box,
  Button,
  CardActions,
  CardContent,
  CardHeader,
  MenuItem,
  Select,
  Stack,
} from '@mui/material'
import IFinding, { FindingSeverity } from 'src/models/finding/finding.interface'

import Autocomplete from 'src/ui/core/components/mui/inputs/Autocomplete/Autocomplete'
import Card from '@mui/material/Card'
import DocumentFindings from '@components/tables/DocumentFindings/DocumentFindings'
import { DocumentType } from 'src/utils/status'
import FileSelect from '@components/FileSelect/FileSelect'
import Finding from 'src/models/finding'
import IDomain from 'src/models/domain/domain.interface'
import IKeyConcept from 'src/models/keyConcept/keyconcept.interface'
import { ISimDoc } from 'src/models/simDoc/types'
import { KeyedMutator } from 'swr'
import RescueMedication from './RescueMedication/RescueMedication'
import SelectedDocument from './SelectedDocument/SelectedDocument'
import StudyMedication from './StudyMedication/StudyMedication'
import _ from 'lodash'
import axios from 'axios'
import compose from '@shopify/react-compose'
import { observer } from 'mobx-react'
import { toJS } from 'mobx'
import { useRootStore } from 'src/stores'
import { useState } from 'react'
import { withFind } from '@hocs'
import withStore from 'src/hocs/withStore'
import SelectedHtml from './SelectedHtml/SelectedHtml'

const FindingView = observer((props: any) => {
  const {
    simulationId,
    simulationVisibleId,
    simDocs,
    domains,
    finding,
    findings,
    findingsMutate,
    simulationMappers,
    simulationMappersMutate,
  }: {
    simulationId: string
    simulationVisibleId: number
    simDocs: ISimDoc[]
    finding: IFinding
    findings: IFinding[]
    domains: IDomain[]
    findingsMutate: KeyedMutator<any>
    simulationMappers: { simulationId: number; findingId: number }[]
    simulationMappersMutate: KeyedMutator<any>
  } = props
  const { findingStore, simDocStore } = useRootStore()

  const getAllFindingsBySimulation = () => {
    const simulationVisibleIds: number[] = []
    const ret: any[] = []
    simulationMappers.forEach((_sm) =>
      simulationVisibleIds.includes(_sm.simulationId)
        ? null
        : simulationVisibleIds.push(_sm.simulationId)
    )
    simulationVisibleIds.forEach((_svi) => {
      const _simulationMapping = simulationMappers.filter(
        (_sm) => _sm.simulationId === _svi
      )
      const _findings = findings.filter((_f) =>
        _simulationMapping.find((_sm) => _sm.findingId === _f.visibleId)
      )
      _findings.forEach((_f) => {
        ret.push({ ..._f, simulationVisibleId: _svi })
      })
    })
    return ret
  }
  // const findingOptions = findings.map((_finding) => ({
  //   text: _finding.text,
  //   value: _finding._id,
  // }))

  // const simDocOptions = simDocs.map((simDoc) => {
  //   return {
  //     text: simDoc.title,
  //     value: simDoc._id,
  //   }
  // })
  if (!findingStore.selectedSimDoc) {
    return (
      <Card>
        <CardContent>
          <Alert severity="info">
            <AlertTitle>Select Document in Folder</AlertTitle>
          </Alert>
        </CardContent>
      </Card>
    )
  }
  return (
    <Card>
      <CardHeader title={`${findingStore.selectedSimDoc.title}`} />
      <Box
        sx={{ marginLeft: '24px', marginTop: '18px', marginBottom: '-64px' }}
      >
        <Select
          label="Document type"
          value={findingStore.selectedSimDoc.kind}
          onChange={async (e) => {
            if (!findingStore.selectedSimDoc) return
            findingStore.selectedSimDoc.kind = e.target.value as DocumentType
            const simDocId = findingStore.selectedSimDoc._id
            const update = {
              ...findingStore.selectedSimDoc,
              store: undefined,
            }
            simDocStore.update(simDocId, update)
          }}
          variant="standard"
        >
          <MenuItem value={DocumentType.Document}>PDF</MenuItem>
          <MenuItem value={DocumentType.Html}>Document</MenuItem>
          <MenuItem value={DocumentType.StudyMedication}>
            Study Medication
          </MenuItem>
          <MenuItem value={DocumentType.RescueMedication}>
            Rescue Medication
          </MenuItem>
        </Select>
      </Box>
      <CardContent>
        {/* <FileSelect simDocId={findingStore.selectedSimDoc?._id} /> */}
        {findingStore.selectedSimDoc?.kind === DocumentType.Document ? (
          <>
            <SelectedDocument simDocId={findingStore.selectedSimDoc?._id} />
            <Box sx={{ fontWeight: 700, marginTop: '24px' }}>Findings</Box>
            <DocumentFindings
              findings={getAllFindingsBySimulation()}
              simDocId={findingStore.selectedSimDoc?._id}
              findingsMutate={findingsMutate}
              simulationId={simulationId}
              simulationVisibleId={simulationVisibleId}
              simulationMappers={simulationMappers}
              simulationMappersMutate={simulationMappersMutate}
            />
          </>
        ) : null}
        {findingStore.selectedSimDoc?.kind === DocumentType.Html ? (
          <>
            <SelectedHtml simDocId={findingStore.selectedSimDoc?._id} />
            <Box sx={{ fontWeight: 700, marginTop: '24px' }}>Findings</Box>
            <DocumentFindings
              findings={getAllFindingsBySimulation()}
              simDocId={findingStore.selectedSimDoc?._id}
              findingsMutate={findingsMutate}
              simulationId={simulationId}
              simulationVisibleId={simulationVisibleId}
              simulationMappers={simulationMappers}
              simulationMappersMutate={simulationMappersMutate}
            />
          </>
        ) : null}
        {findingStore.selectedSimDoc?.kind === DocumentType.StudyMedication ? (
          <>
            <StudyMedication />
          </>
        ) : null}
        {findingStore.selectedSimDoc?.kind === DocumentType.RescueMedication ? (
          <>
            <RescueMedication />
          </>
        ) : null}
      </CardContent>
    </Card>
  )
})

export default compose<any>(
  withStore('findingStore'),
  withFind({
    collectionName: 'findings',
    version: 2,
    getFilter: (props: any) => {
      let filter = { simDocId: 'nothing to find', isDeleted: false }
      if (props.findingStore?.selectedSimDoc?._id) {
        filter = {
          simDocId: props.findingStore?.selectedSimDoc?._id,
          isDeleted: false,
        }
      }
      return filter
    },
  }),
  withFind({
    collectionName: 'simulationMappers',
    version: 3,
    getFilter: (props: any) => {
      const filter = {
        isDeleted: false,
      } as any
      if (props?.simulationVisibleId) {
        filter.simulationId = props?.simulationVisibleId
      }
      return filter
    },
  })
)(FindingView)
