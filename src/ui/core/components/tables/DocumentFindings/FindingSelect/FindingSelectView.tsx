import { Divider, Typography } from '@mui/material'
import { observer, useLocalObservable } from 'mobx-react'
import { useEffect, useState } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Finding from 'src/models/finding'
import Findings from './Finding/Findings'
import PaginationTable from 'src/ui/components/PaginationTable'
import SearchBar from './SearchBar/SearchBar'
import SimDoc from 'src/models/simDoc'
import SimulationSelect from './SimulationSelect/SimulationSelect'
import UpdateDialogue from '../UpdateDialog/UpdateDialogue'
import axios from 'axios'
import { toJS } from 'mobx'
import { useRootStore } from 'src/stores'

type Props = {
  simDocId: string
  findingsMutate: any
  simulationId: string
  simulationMappersMutate: any
  prevFindingsMutate: any
  findings: Finding[]
}

function FindingSelectView(props: Props) {
  const [selectedSimulationId, setSelectedSimulationId] = useState<
    string | undefined
  >(undefined)
  const [searchString, setSearchString] = useState<string>('')
  const [open, setOpen] = useState<boolean>(false)
  const [dupItemCnt, setDupItemCnt] = useState<number>(0)

  const {
    uiState: { modal },
    findingStore,
  } = useRootStore()
  const localState = useLocalObservable(() => ({
    selectedRowIds: [],
  }))

  const handleSelect = async () => {
    try {
      const filter = {
        _id: { $in: localState.selectedRowIds },
      } as any
      const update = {
        simDocId: props.simDocId,
      } as any
      const options = {
        fields: {
          simulationId: props.simulationId,
        },
      }
      await axios.patch('v2/findings', {
        filter,
        update,
        options,
      })

      props.findingsMutate && (await props.findingsMutate())
      props.prevFindingsMutate && (await props.prevFindingsMutate())
      props.simulationMappersMutate && (await props.simulationMappersMutate())
      findingStore.mutate && (await findingStore.mutate())
      modal.close()
    } catch (e) {
      console.error({ e })
      throw e
    }
  }

  const onClickSelect = async () => {
    const localFindings = props.findings.filter((_lf) => {
      const _id = _lf._id as string
      return (
        toJS(localState.selectedRowIds as string[]).includes(_id) &&
        _lf.simDocId
      )
    })
    if (localFindings.length > 0) {
      setDupItemCnt(localFindings.length)
      return setOpen(true)
    }
    await handleSelect()
  }

  const onClickCancel = async () => {
    modal.close()
  }

  return (
    <>
      <Box sx={{ display: 'flex', bgcolor: 'white' }}>
        <Box sx={{ width: '100%' }}>
          <Box
            sx={{
              position: 'absolute',
              display: 'flex',
              zIndex: 200,
              top: 16,
              right: 20,
            }}
          >
            <Button
              variant="contained"
              fullWidth
              onClick={onClickSelect}
              sx={{ width: 96 }}
            >
              Select
            </Button>
            <Button
              variant="contained"
              fullWidth
              onClick={onClickCancel}
              sx={{ ml: 1, width: 96 }}
            >
              Cancel
            </Button>
          </Box>
          <Box sx={{ height: 1048, overflow: 'auto' }}>
            <Box
              sx={{
                display: 'flex',
                backgroundColor: 'white',
                position: 'absolute',
                // transform: 'translate(-50%, 0%)',
                mt: 2,
                zIndex: 100,
              }}
            >
              <Box sx={{ width: 32, height: 32, backgroundColor: 'white' }} />
              <SearchBar
                searchString={searchString}
                onChange={(e: any) => setSearchString(e.target.value)}
              />
            </Box>
            {/* <Box
            sx={{
              backgroundColor: 'white',
              position: 'absolute',
              left: '50%',
              transform: 'translate(-50%, 0%)',
              mt: 2,
              zIndex: 100,
            }}
          >
            <SimulationSelect
              setSelectedSimulationId={setSelectedSimulationId}
            />
          </Box> */}
            <PaginationTable
              collectionName={'findings'}
              Table={Findings}
              params={{
                filter: { isDeleted: false },
                options: {
                  fields: {
                    notSelectedSimulationId: props.simulationId,
                    notSelectedSimDocId: props.simDocId,
                    searchString,
                  },
                },
              }}
              state={localState}
              version={2}
              buttons={false}
            />
          </Box>
        </Box>
      </Box>
      <UpdateDialogue
        open={open}
        handleClose={() => setOpen(false)}
        onUpdate={handleSelect}
        title={`Are you sure you want to add findings to this document?`}
        text={`it contains ${dupItemCnt} findings selected by the other documents`}
        yesText={'Add'}
        noText={'Cancel'}
      />
    </>
  )
}
export default observer(FindingSelectView)
