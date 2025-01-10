import {
  Alert,
  AlertTitle,
  Box,
  Button,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  InputLabel,
  Menu,
  MenuItem,
  MenuList,
  Popover,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material'
import IFinding, { FindingSeverity } from 'src/models/finding/finding.interface'
import { useEffect, useState } from 'react'

import Autocomplete from 'src/ui/core/components/mui/inputs/Autocomplete/Autocomplete'
import Card from '@mui/material/Card'
import DetailLayout from 'src/ui/layouts/DetailLayout/DetailLayout'
import { DocumentType } from 'src/utils/status'
import FindingAutocomplete from './FindingAutocomplete/FindingAutocomplete'
import FindingAutocompleteCompare from './FindingAutocompleteCompare/FindingAutocompleteCompare'
import IDomain from 'src/models/domain/domain.interface'
import IFolder from 'src/models/folder/folder.interface'
import IKeyConcept from 'src/models/keyConcept/keyconcept.interface'
import { ISimDoc } from 'src/models/simDoc/types'
import ISimulation from 'src/models/simulation/simulation.interface'
import { KeyedMutator } from 'swr'
import PDFViewer from './PDFViewer/PDFViewer'
import { Required } from 'src/ui/components/Required'
import Select from 'src/ui/core/components/mui/inputs/Select/Select'
import Swal from 'sweetalert2'
import { TextField } from 'src/ui/core/components'
import _ from 'lodash'
import compose from '@shopify/react-compose'
import { observer } from 'mobx-react'
import { toJS } from 'mobx'
import { useRootStore } from 'src/stores'
import { useSnackbar } from 'notistack'
import { withFind } from '@hocs'
import withFindOne from 'src/hocs/withFindOne'
import withStore from 'src/hocs/withStore'

const FindingView = observer((props: any) => {
  const {
    keyConcepts,
    simDocs,
    domains,
    folders,
    simulations,
    simulationMappers,
    simulationMappersMutate,
    finding,
    findingsMutate,
  }: {
    keyConcepts: IKeyConcept[]
    simDocs: ISimDoc[]
    finding: IFinding
    domains: IDomain[]
    folders: IFolder[]
    simulations: ISimulation[]
    simulationMappers: { simulationId: number; findingId: number }[]
    simulationMappersMutate: KeyedMutator<any>
    findingsMutate: KeyedMutator<any>
  } = props
  const { findingStore } = useRootStore()
  const [selectedTab, setSelectedTab] = useState<number>(0)
  const [selectedCompareDocId, setSelectedCompareDocId] = useState<string>('')
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  const handlePopoverButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setAnchorEl(event.currentTarget)
  }

  const keyConceptOptions = keyConcepts
    .filter((keyConcept) => {
      const selectedDomain = domains.find(
        (domain) => domain._id === findingStore.form.domainId
      )
      if (
        keyConcept.domainId === selectedDomain?._id ||
        keyConcept.domainId === selectedDomain?.parentId
      )
        return true
      return false
    })
    .map((keyConcept) => {
      return {
        text: keyConcept.description,
        value: keyConcept._id,
      }
    })

  const simDocOptions = simDocs.map((simDoc) => {
    return {
      text: simDoc.title,
      value: simDoc._id,
    }
  })

  const severityOptions = [
    {
      text: 'Critical',
      value: FindingSeverity.Critical,
    },
    {
      text: 'Major',
      value: FindingSeverity.Major,
    },
    {
      text: 'Minor',
      value: FindingSeverity.Minor,
    },
  ]

  const domainOptions = domains
    .sort((a, b) => a.seq - b.seq)
    .map((domain) => ({
      text: domain.name,
      value: domain._id,
    }))

  const getDocumentType = (simDocId: string) => {
    const simDoc = simDocs.find((_simDoc) => _simDoc._id === simDocId)
    return simDoc?.kind || DocumentType.Document
  }

  const getDocumentUrl = (simDocId: string) => {
    const simDoc = simDocs.find((_simDoc) => _simDoc._id === simDocId)
    if (getDocumentType(simDocId) === DocumentType.Document) {
      return simDoc?.files?.[0]?.url || null
    }
    return null
  }
  console.log(toJS(findingStore.form))
  return (
    <DetailLayout
      store={findingStore}
      mutate={
        (() => {
          findingsMutate && findingsMutate()
          simulationMappersMutate && simulationMappersMutate()
        }) as KeyedMutator<any>
      }
    >
      <Box sx={{ bgcolor: 'rgb(242, 243, 243)' }}>
        <Grid container spacing={2} sx={{ p: 2 }}>
          <Grid item xs={6}>
            <Card className="paper-grid" sx={{ p: 0 }}>
              <CardContent>
                <Stack spacing={1}>
                  {props.isNew ? null : (
                    <>
                      <InputLabel>ID</InputLabel>
                      <TextField
                        disabled
                        label="id"
                        state={findingStore}
                        path="form.visibleId"
                        fullWidth
                        size="small"
                        variant="outlined"
                      />
                    </>
                  )}
                  <InputLabel sx={{ display: 'flex' }}>
                    <Typography>Finding</Typography>
                    <Required />
                  </InputLabel>
                  <Box className="multiline">
                    <TextField
                      label="finding"
                      state={findingStore}
                      path="form.text"
                      fullWidth
                      multiline
                      rows={4}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                  <InputLabel sx={{ display: 'flex' }}>
                    <Typography>Severity</Typography>
                    <Required />
                  </InputLabel>
                  <Select
                    // label="severity"
                    state={findingStore}
                    path="form.severity"
                    options={severityOptions}
                  />
                  <InputLabel sx={{ display: 'flex' }}>
                    <Typography>Domain</Typography>
                    <Required />
                  </InputLabel>
                  <Select
                    // label="domain"
                    state={findingStore}
                    path="form.domainId"
                    options={domainOptions}
                  />
                  <InputLabel>KeyConcept</InputLabel>
                  <Select
                    // label="keyConcept"
                    state={findingStore}
                    path="form.keyConceptId"
                    options={keyConceptOptions}
                  />
                  <Stack direction={'row'} spacing={2}>
                    <Box sx={{ width: '50%' }}>
                      <InputLabel sx={{ display: 'flex' }}>
                        <Typography>ICH_GCP</Typography>
                      </InputLabel>
                      <TextField
                        label="ich_gcp"
                        state={findingStore}
                        path="form.ich_gcp"
                        fullWidth
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                    <Box sx={{ width: '50%' }}>
                      <InputLabel sx={{ display: 'flex' }}>
                        <Typography>CFR</Typography>
                      </InputLabel>
                      <TextField
                        label="cfr"
                        fullWidth
                        size="small"
                        state={findingStore}
                        path="form.cfr"
                        variant="outlined"
                      />
                    </Box>
                  </Stack>
                  <InputLabel sx={{ display: 'flex' }}>
                    <Typography>Main Document</Typography>
                  </InputLabel>
                  <FindingAutocomplete
                    state={findingStore}
                    path="form.simDocId"
                    options={simDocOptions}
                    className="d"
                    simDocs={simDocs}
                    simulationMappers={simulationMappers}
                    simulations={simulations}
                    folders={folders}
                  />
                  {/* <Select
                    // label="main document"
                    disabled={props.addFinding}
                    state={findingStore}
                    path="form.simDocId"
                    options={simDocOptions}
                  /> */}
                  <InputLabel>
                    <Typography>Documents To Compare With</Typography>
                  </InputLabel>
                  <FindingAutocompleteCompare
                    limitTags={3}
                    max={2}
                    maxErrorMessage={'Too many compare simDocs'}
                    state={findingStore}
                    options={simDocOptions.filter((_sdo) =>
                      findingStore.form.possibleCompareSimDocs?.includes(
                        _sdo.value
                      )
                    )}
                    path="form.simDocIds"
                    className="d"
                  />
                  {/* <Alert>
                    <AlertTitle>Fill in all fields.</AlertTitle>
                  </Alert> */}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card className="paper-grid" sx={{ p: 0 }}>
              <CardContent>
                <Box>
                  <Tabs
                    value={selectedTab}
                    onChange={(e, v) => setSelectedTab(v)}
                  >
                    <Tab label="main document" value={0} />
                    <Tab label="compare documents" value={1} />
                  </Tabs>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    ml: 4,
                  }}
                >
                  {selectedTab === 1 ? (
                    <Button onClick={handlePopoverButtonClick}>
                      Select Document
                    </Button>
                  ) : (
                    <Button disabled></Button>
                  )}
                  <Popover
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                  >
                    <MenuList>
                      {toJS(findingStore.form.simDocIds).map((_simDocId) => {
                        return (
                          <MenuItem
                            key={_simDocId}
                            onClick={() => {
                              setSelectedCompareDocId(_simDocId)
                              setAnchorEl(null)
                            }}
                          >
                            <Box>
                              {simDocs.find(
                                (_simDoc) => _simDoc._id === _simDocId
                              )?.title || ''}
                            </Box>
                          </MenuItem>
                        )
                      })}
                    </MenuList>
                  </Popover>
                  {selectedTab === 0 ? (
                    <Box>
                      <Button disabled>
                        {simDocs.find(
                          (_simDoc) =>
                            _simDoc._id === toJS(findingStore.form.simDocId)
                        )?.title || ''}
                      </Button>
                    </Box>
                  ) : (
                    <Box>
                      <Button disabled>
                        {simDocs.find(
                          (_simDoc) => _simDoc._id === selectedCompareDocId
                        )?.title
                          ? simDocs.find(
                              (_simDoc) => _simDoc._id === selectedCompareDocId
                            )!.title.length > 20
                            ? simDocs
                                .find(
                                  (_simDoc) =>
                                    _simDoc._id === selectedCompareDocId
                                )
                                ?.title.substring(0, 20) + '...'
                            : simDocs.find(
                                (_simDoc) =>
                                  _simDoc._id === selectedCompareDocId
                              )?.title
                          : ''}
                      </Button>
                    </Box>
                  )}
                </Box>
                <Box sx={{ mt: 1 }}>
                  {selectedTab === 0 ? (
                    <PDFViewer
                      fileUrl={getDocumentUrl(
                        toJS(findingStore.form.simDocId) || ''
                      )}
                      key={
                        getDocumentUrl(toJS(findingStore.form.simDocId) || '') +
                        selectedTab
                      }
                    />
                  ) : (
                    <PDFViewer fileUrl={getDocumentUrl(selectedCompareDocId)} />
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </DetailLayout>
  )
})

export default compose<any>(
  withStore('findingStore'),
  withFindOne({
    isDocNeeded: false,
    collectionName: 'findings',
    version: 2,
    getFilter: (props: any) => {
      const filter = { isDeleted: false } as any
      if (props.findingStore?.selectedSimDoc?._id) {
        filter.simDocId = props.findingStore?.selectedSimDoc?._id
      }
      if (props.isNew) {
        filter._id = 'nothing to find'
      } else if (props.findingStore?.form._id) {
        filter._id = props.findingStore?.form._id
      }
      return filter
    },
  }),
  withFind({
    collectionName: 'keyConcepts',
    getFilter: () => ({
      isDeleted: false,
    }),
    version: 2,
  })
)(FindingView)
