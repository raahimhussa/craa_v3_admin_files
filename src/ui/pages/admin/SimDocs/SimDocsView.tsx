import { observer, useLocalObservable } from 'mobx-react'
import { reaction, toJS } from 'mobx'
import { useEffect, useState } from 'react'

import AssessmentType from 'src/models/assessmentType'
import Box from '@mui/material/Box'
import DetailLayout from 'src/ui/layouts/DetailLayout/DetailLayout'
import { Dialog } from '@mui/material'
import { Doc } from 'src/models/doc'
import { DocKind } from './SimDocs'
import Folder from 'src/models/folder'
import Instruction from '../modals/Instruction/Instruction'
import Instructions from 'src/ui/core/components/tables/Instructions/Instructions'
import Protocol from '../modals/Protocol/Protocol'
import ProtocolView from '../modals/Protocol/ProtocolView'
import Protocols from 'src/ui/core/components/tables/Protocols/Protocols'
import RiskManagement from '@components/tables/RiskManagement/RiskManagement'
import SimDoc from 'src/models/simDoc'
import SimDocs from 'src/ui/core/components/tables/SimDocs/SimDocs'
import Simulation from 'src/models/simulation'
import SimulationSelect from '@components/tables/SimDocs/SimulationSelect/SimulationSelect'
import StudyDocument from '../modals/StudyDocument/StudyDocument'
import StudyDocuments from 'src/ui/core/components/tables/StudyDocuments/StudyDocuments'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import { useRootStore } from 'src/stores'
import FolderStore from 'src/stores/folderStore'

function SimDocsView({
  simDocs,
  simDocsMutate,
  folders,
  simulations,
  docs,
  assessmentTypes,
  assessmentTypesMutate,
}: any) {
  // const { findingStore } = useRootStore()
  const { folderStore, simDocStore, findingStore, uiState } = useRootStore()  
  const [value, setValue] = useState(0)
  const [open, setOpen] = useState<boolean>(false)
  const [dataBySimulation, setDataBySimulation] = useState<
    {
      simulationId: string
      instructionIds: string[]
      protocolIds: string[]
      studyLogIds: string[]
    }[]
  >([])
  const [selectedSimulationId, setSelectedSimulationId] = useState<string>('')
  const [selectedSimulation, setSelectedSimulation] = useState<any>('')
  const [instructions, setInstructions] = useState<Doc[]>([])
  const [studyDocuments, setStudyDocuments] = useState<SimDoc[]>([])
  const [protocols, setProtocols] = useState<Doc[]>([])
  const [selectedSimulationSimDocs, setSelectedSimulationSimDocs] = useState<
    SimDoc[]
  >([])

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }
  const onClickOpen = () => {
    setOpen(true)
  }
  const onClickClose = () => {
    setOpen(false)
  }

  useEffect(() => {
    findingStore.resetForm()
    const _dataBySimulation: {
      simulationId: string
      instructionIds: string[]
      protocolIds: string[]
      studyLogIds: string[]
    }[] = []
    const _instructions: Doc[] = []
    const _studyDocuments: Doc[] = []
    const _protocols: Doc[] = []
    assessmentTypes.forEach((_assessmentType: AssessmentType) => {
      const baselineSimulationId = _assessmentType.baseline?.simulationId || ''
      const baselineInstructionIds =
        _assessmentType.baseline?.instructionIds || []
      const baselineProtocolIds = _assessmentType.baseline?.protocolIds || []
      const baselineStudyLogIds = _assessmentType.baseline?.studyLogIds || []
      if (
        _dataBySimulation.find(
          (_ds) => _ds.simulationId === baselineSimulationId
        )
      ) {
        _dataBySimulation.forEach((_ds) => {
          if (_ds.simulationId === baselineSimulationId) {
            _ds.instructionIds = [
              ..._ds.instructionIds,
              ...baselineInstructionIds,
            ]
            _ds.studyLogIds = [..._ds.studyLogIds, ...baselineStudyLogIds]
            _ds.protocolIds = [..._ds.protocolIds, ...baselineProtocolIds]
          }
        })
      } else {
        _dataBySimulation.push({
          simulationId: baselineSimulationId,
          instructionIds: baselineInstructionIds,
          protocolIds: baselineProtocolIds,
          studyLogIds: baselineStudyLogIds,
        })
      }
      _assessmentType.followups.forEach((_followup) => {
        const followupSimulationId = _followup?.simulationId || ''
        const followupInstructionIds = _followup?.instructionIds || []
        const followupProtocolIds = _followup?.protocolIds || []
        const followupStudyLogIds = _followup?.studyLogIds || []
        if (
          _dataBySimulation.find(
            (_ds) => _ds.simulationId === followupSimulationId
          )
        ) {
          _dataBySimulation.forEach((_ds) => {
            if (_ds.simulationId === followupSimulationId) {
              _ds.instructionIds = [
                ..._ds.instructionIds,
                ...followupInstructionIds,
              ]
              _ds.studyLogIds = [..._ds.studyLogIds, ...followupStudyLogIds]
              _ds.protocolIds = [..._ds.protocolIds, ...followupProtocolIds]
            }
          })
        } else {
          _dataBySimulation.push({
            simulationId: followupSimulationId,
            instructionIds: followupInstructionIds,
            protocolIds: followupProtocolIds,
            studyLogIds: followupStudyLogIds,
          })
        }
      })
    })
    setDataBySimulation(_dataBySimulation)
  }, [])

  useEffect(() => {
    if (dataBySimulation.length === 0) return
    const data = dataBySimulation.find(
      (_ds) => _ds.simulationId === selectedSimulationId
    )
    if (selectedSimulationId) {
      setInstructions(
        docs.filter((_doc: Doc) => data?.instructionIds.includes(_doc._id))
      )
      setProtocols(
        docs.filter((_doc: Doc) => data?.protocolIds.includes(_doc._id))
      )
      const simulation = simulations.find(
        (_simulation: Simulation) => _simulation._id === selectedSimulationId
      )

      if (!simulation) return

      //-- this is critical to get sim data (eg. sim name for AdminLog)
      setSelectedSimulation(simulation)
      // folderStore.selectedSimulation = simulation
      // console.log("SimDocsView0::simulation: ", simulation)

      const folderIds = simulation.folderIds || []

      const subFolders = folders.filter((_folder: Folder) =>
        folderIds.includes(_folder.folderId)
      )

      const subFolderIds = subFolders?.map((folder: Folder) => folder._id) || []

      const totalFolderIds = [...folderIds, ...subFolderIds]

      const simulationSimDocs = simDocs.filter((_simDoc: SimDoc) =>
        totalFolderIds.includes(_simDoc.folderId)
      )

      setSelectedSimulationSimDocs(
        simulationSimDocs.filter((_sSimDoc: SimDoc) =>
          data?.studyLogIds.includes(_sSimDoc._id)
        )
      )

      //-- To close resources etc. window
      folderStore.selectedFolder = null;      
      findingStore.selectedSimDoc = null;
      
    } else {
      setInstructions(
        docs.filter((_doc: Doc) => _doc.kind === DocKind.Instruction)
      )
      setProtocols(docs.filter((_doc: Doc) => _doc.kind === DocKind.Protocol))
      setSelectedSimulationSimDocs([])
    }
  }, [dataBySimulation.length, selectedSimulationId])

  return (
    <Box>
      <Tabs
        variant="fullWidth"
        indicatorColor={'primary'}
        textColor="primary"
        sx={{ mb: 2, boxShadow: 2 }}
        onChange={handleChange}
        value={value}
        aria-label="Tabs where each tab needs to be selected manually"
      >
        <Tab
          label="Document Management"
          sx={{ fontSize: 12, fontWeight: 600 }}
        />
        <Tab
          label="Protocol Management"
          sx={{ fontSize: 12, fontWeight: 600 }}
        />
        <Tab
          label="Instruction Management"
          sx={{ fontSize: 12, fontWeight: 600 }}
        />
        <Tab
          label="Study Document Management"
          sx={{ fontSize: 12, fontWeight: 600 }}
        />
        {/* <Tab label="Risk Management" sx={{ fontSize: 12, fontWeight: 600 }} /> */}
      </Tabs>
      {value === 0 && (
        <SimDocs
          simDocs={simDocs}
          simDocsMutate={simDocsMutate}
          selectedSimulationId={selectedSimulationId}
          setSelectedSimulationId={setSelectedSimulationId}
          dataBySimulation={dataBySimulation}
          setDataBySimulation={setDataBySimulation}
          selectedSimulation={selectedSimulation}
          // setSelectedSimulation={setSelectedSimulation}          
        />
      )}
      {value === 1 && (
        <Box>
          <Box sx={{ position: 'absolute', zIndex: 1000 }}>
            <SimulationSelect
              selectedSimulationId={selectedSimulationId}
              setSelectedSimulationId={setSelectedSimulationId}
              // selectedSimulation={selectedSimulation}
              // setSelectedSimulation={setSelectedSimulation}               
            />
          </Box>
          <Protocols
            protocols={protocols}
            onClickOpen={onClickOpen}
            selectedSimulationId={selectedSimulationId}
            setSelectedSimulationId={setSelectedSimulationId}
          />
          <Dialog
            open={open}
            onClose={onClickClose}
            fullWidth={true}
            maxWidth={'lg'}
          >
            <Protocol onClose={onClickClose} />
          </Dialog>
        </Box>
      )}
      {value === 2 && (
        <Box>
          <Box sx={{ position: 'absolute', zIndex: 1000 }}>
            <SimulationSelect
              selectedSimulationId={selectedSimulationId}
              setSelectedSimulationId={setSelectedSimulationId}
            />
          </Box>
          <Instructions
            instructions={instructions}
            onClickOpen={onClickOpen}
            selectedSimulationId={selectedSimulationId}
            setSelectedSimulationId={setSelectedSimulationId}
          />
          <Dialog
            open={open}
            onClose={onClickClose}
            fullWidth={true}
            maxWidth={'lg'}
          >
            <Instruction onClose={onClickClose} />
          </Dialog>
        </Box>
      )}
      {value === 3 && (
        <Box>
          <Box sx={{ position: 'absolute', zIndex: 1000 }}>
            <SimulationSelect
              selectedSimulationId={selectedSimulationId}
              setSelectedSimulationId={setSelectedSimulationId}
            />
          </Box>
          <StudyDocuments
            studyDocuments={selectedSimulationSimDocs}
            onClickOpen={onClickOpen}
            selectedSimulationId={selectedSimulationId}
            setSelectedSimulationId={setSelectedSimulationId}
          />
          <Dialog
            open={open}
            onClose={onClickClose}
            fullWidth={true}
            maxWidth={'lg'}
          >
            <StudyDocument onClose={onClickClose} />
          </Dialog>
        </Box>
      )}
    </Box>
  )
}
export default observer(SimDocsView)
