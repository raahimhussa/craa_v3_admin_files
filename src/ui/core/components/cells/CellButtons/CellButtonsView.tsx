import * as React from 'react'

import {
  AdminLogScreen,
  FindingStatus,
  UserSimulationStatus,
} from 'src/utils/status'
import {
  AppBar,
  Backdrop,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputAdornment,
  Modal,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material'
import {
  Badge,
  Delete,
  Edit,
  FormatListBulleted,
  Lock,
  LockOpen,
} from '@mui/icons-material'
import { observer, useLocalObservable } from 'mobx-react'

import { AdminLogManager } from 'src/classes/adminLogManager'
import { BusinessCycle } from 'src/models/clientUnit/clientUnit.interface'
import ButtonGroup from '@mui/material/ButtonGroup'
import { CellProps } from 'react-table'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import DeleteDialogue from '@components/DeleteDialogue/DeleteDialogue'
import Reporting from 'src/ui/pages/admin/Reporting/Reporting'
import { RootStore } from 'src/stores/root'
import SimCard from 'src/ui/pages/admin/SimCard/SimCard'
import Swal from 'sweetalert2'
import UiState from 'src/stores/ui'
import UpdateDialogueView from '@components/UpdateDialogue/UpdateDialogueView'
import UserSimulationRepository from 'src/repos/v2/userSimulation'
import { UserStore } from 'src/stores/userStore'
import axios from 'axios'
import { blue } from '@mui/material/colors'
import compose from '@shopify/react-compose'
import green from '@mui/material/colors/green'
import { off } from 'process'
import palette from 'src/theme/palette'
import red from '@mui/material/colors/red'
import { toJS } from 'mobx'
import { useRootStore } from 'src/stores'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { useUser } from '@hooks'
import yellow from '@mui/material/colors/yellow'

function CellButtonsView(props: CellProps<any>) {
  const Props = {
    cellProps: props,
    userId: props.row.original.user?._id,
  }
  const {
    column: {
      edit,
      remove,
      storeKey,
      mutateKey,
      name,
      mutate,
      hideDelete,
      screen,
    },
    clientUnits,
    assessmentCycles,
    assessmentTypes,
    simulationMappers,
    simulations,
  }: any = props
  const _storeKey: keyof RootStore = storeKey
  const _mutateKey: keyof UiState = mutateKey
  const rootStore = useRootStore()
  const { userStore, documentStore, userSimulationStore, findingStore } =
    useRootStore()
  const { data: user } = useUser()
  const { enqueueSnackbar } = useSnackbar()

  const [deleteDialogueOpen, setDeleteDialogueOpen] = useState<boolean>(false)
  const [updateDialogueOpen, setUpdateDialogueOpen] = useState<boolean>(false)

  const onClickEdit = async () => {
    const adminLogManager = AdminLogManager.getInstance()
    rootStore[_storeKey].form = props.row.original
    await edit({ ...props })
    await adminLogManager?.createEditLog({
      screen: screen ? screen : AdminLogScreen.Undefined,
      target: {
        type: _storeKey,
        _id: props.row.original._id,
        message: 'click edit button',
      },
    })
  }
  const onClickActivate = async () => {
    const adminLogManager = AdminLogManager.getInstance()
    rootStore[_storeKey].form = {
      ...props.row.original,
      isActivated: !props.row.original.isActivated,
      status: !props.row.original.isActivated ? 'Active' : 'Inactive' 
    }
    try {
      if (!props.row.original._id) return
      (rootStore[_storeKey] as any).update &&
        (await (rootStore[_storeKey] as any).update())
      // await userStore.repository.update(query)
      await adminLogManager?.createEditLog({
        screen: screen ? screen : AdminLogScreen.Undefined,
        target: {
          type: _storeKey,
          _id: props.row.original._id,
          message: !props.row.original.isActivated ? 'activate' : 'deactivate',
        },
      })
    } catch (error) {
      return rootStore.uiState.alert.error()
    }

    const ui: any = rootStore.uiState[_mutateKey]
    ui.mutate && ui.mutate()
    mutate && mutate()
  }

  const getActivatedAssessmentCycleCount = () => {
    const businessCycles: BusinessCycle[] = []
    clientUnits?.forEach((_cu: any) => {
      _cu.businessUnits.forEach((_bu: any) => {
        _bu.businessCycles.forEach((_bc: any) => {
          businessCycles.push(_bc)
        })
      })
    })
    const ret = businessCycles
      .filter((_bc) => {
        return (
          _bc.startDate &&
          _bc.endDate &&
          new Date(_bc.startDate) < new Date() &&
          new Date(_bc.endDate) > new Date()
        )
      })
      .filter((_bc) => {
        const assessmentCycle = assessmentCycles.find(
          (_ac: any) => _ac._id === _bc.assessmentCycleId
        )
        const localAssessmentTypes = assessmentTypes.filter((_at: any) => {
          return assessmentCycle.assessmentTypeIds.includes(_at._id)
        })
        let localSimulationIds: string[] = []
        localAssessmentTypes.forEach((_lat: any) => {
          localSimulationIds.push(_lat.baseline.simulationId)
          _lat.followups.forEach((_f: any) =>
            localSimulationIds.push(_f.simulationId)
          )
        })
        localSimulationIds = Array.from(new Set(localSimulationIds))
        return simulationMappers.find((_sm: any) => {
          const simulationVisibleIds = localSimulationIds.map((_lsi) => {
            return simulations.find((_s: any) => _s._id === _lsi)?.visibleId
          })
          return simulationVisibleIds.includes(_sm.simulationId)
        })
      }).length
    return ret
  }

  const handleDeleteDialogueOpen = () => {
    setDeleteDialogueOpen(true)
  }

  const handleDeleteDialogueClose = () => {
    setDeleteDialogueOpen(false)
  }

  const handleUpdateDialogueOpen = () => {
    setUpdateDialogueOpen(true)
  }

  const handleUpdateDialogueClose = () => {
    setUpdateDialogueOpen(false)
  }

  const onClickDelete = async () => {
    try {
      const adminLogManager = AdminLogManager.getInstance()
      rootStore[_storeKey].form = props.row.original
      if (remove) {
        await remove({ ...props })
      } else {
        try {
          if (_storeKey === 'userStore') {
            await rootStore[_storeKey].delete(true)
          } else if (
            _storeKey === 'documentStore' ||
            _storeKey === 'documentVariableStore' ||
            _storeKey === 'documentVariableGroupStore'
          ) {
            await rootStore[_storeKey].delete(props.row.original._id)
          } else {
            await rootStore[_storeKey].delete()
          }
        } catch (error) {
          return rootStore.uiState.alert.error()
        }
      }
      const ui = rootStore.uiState[_mutateKey]
      // @ts-ignore
      await adminLogManager?.createDeleteLog({
        screen: screen ? screen : AdminLogScreen.Undefined,
        target: {
          type: _storeKey,
          _id: props.row.original._id,
          message: 'single delete',
        },
      })

      ui.mutate && ui.mutate()
      mutate && mutate()
    } catch (error) {
      console.log(error)
    }
  }

  if (mutateKey == 'userStatus') {
    return (
      <IconButton
        onClick={onClickDelete}
        sx={{
          backgroundColor: palette.light.button.green,
          borderRadius: '2px !important',
          ml: 1,
        }}
      >
        <Badge htmlColor="white" />
      </IconButton>
    )
  } else if (mutateKey == 'users') {
    return (
      <ButtonGroup>
        <IconButton onClick={onClickEdit}>
          <Edit htmlColor={palette.light.button.blue} />
        </IconButton>
        <IconButton onClick={onClickActivate}>
          {props.row.original.isActivated ? (
            <Lock htmlColor={palette.light.button.yellow} />
          ) : (
            <LockOpen htmlColor={palette.light.button.green} />
          )}
        </IconButton>
        <IconButton onClick={handleDeleteDialogueOpen}>
          <Delete htmlColor={palette.light.button.red} />
        </IconButton>
        <DeleteDialogue
          open={deleteDialogueOpen}
          handleClose={handleDeleteDialogueClose}
          onDelete={onClickDelete}
          title={`Are you sure you want to delete ${
            name
              ? `"${name.length > 20 ? name.substring(0, 20) + '...' : name}"`
              : 'item'
          }?`}
          text={
            "This item will be deleted permanently. You can't undo this action."
          }
          yesText={'Delete'}
          noText={'Cancel'}
        />
      </ButtonGroup>
    )
  } else if (mutateKey == 'documents') {
    const [isActivated, setIsActivated] = useState(
      props.row.original.isActivated
    )
    return (
      <ButtonGroup>
        <IconButton onClick={onClickEdit}>
          <Edit htmlColor={palette.light.button.blue} />
        </IconButton>
        <IconButton onClick={handleDeleteDialogueOpen}>
          <Delete htmlColor={palette.light.button.red} />
        </IconButton>
        <IconButton
          onClick={async () => {
            const query = {
              filter: { _id: props.row.original._id },
              update: {
                isActivated: !props.row.original.isActivated,
              },
            }
            try {
              await documentStore.documentRepository.update(query)
              setIsActivated(!props.row.original.isActivated)
            } catch (error) {
              return rootStore.uiState.alert.error()
            }
            enqueueSnackbar('Document modified..', {
              variant: 'success',
            })
            const ui: any = rootStore.uiState[_mutateKey]
            ui.mutate && ui.mutate()
            mutate && mutate()
          }}
        >
          {isActivated ? (
            <Lock htmlColor={palette.light.button.yellow} />
          ) : (
            <LockOpen htmlColor={palette.light.button.green} />
          )}
        </IconButton>
        <IconButton
          onClick={async () => {
            const data = await documentStore.copy(props.row.original)
            if (data) {
              enqueueSnackbar('Document copied..', {
                variant: 'success',
              })
            } else {
              enqueueSnackbar('Please try again later.', {
                variant: 'error',
              })
            }
            const ui: any = rootStore.uiState[_mutateKey]
            ui.mutate && ui.mutate()
            mutate && mutate()
          }}
        >
          <ContentCopyIcon htmlColor={palette.light.button.yellow} />
        </IconButton>
        <DeleteDialogue
          open={deleteDialogueOpen}
          handleClose={handleDeleteDialogueClose}
          onDelete={onClickDelete}
          title={`Are you sure you want to delete ${
            name
              ? `"${name.length > 20 ? name.substring(0, 20) + '...' : name}"`
              : 'item'
          }?`}
          text={
            "This item will be deleted permanently. You can't undo this action."
          }
          yesText={'Delete'}
          noText={'Cancel'}
        />
      </ButtonGroup>
    )
  } else if (mutateKey == 'findings' || mutateKey == 'findingManagement') {
    return (
      <ButtonGroup>
        <IconButton onClick={onClickEdit}>
          <Edit htmlColor={palette.light.button.blue} />
        </IconButton>
        <IconButton
          onClick={
            getActivatedAssessmentCycleCount() === 0
              ? onClickActivate
              : handleUpdateDialogueOpen
          }
        >
          {props.row.original.status === FindingStatus.Active ? (
            <Lock htmlColor={palette.light.button.yellow} />
          ) : (
            <LockOpen htmlColor={palette.light.button.green} />
          )}
        </IconButton>
        {hideDelete ? null : (
          <IconButton onClick={handleDeleteDialogueOpen}>
            <Delete htmlColor={palette.light.button.red} />
          </IconButton>
        )}
        <DeleteDialogue
          open={deleteDialogueOpen}
          handleClose={handleDeleteDialogueClose}
          onDelete={onClickDelete}
          title={`Are you sure you want to delete ${
            name
              ? `"${name.length > 20 ? name.substring(0, 20) + '...' : name}"`
              : 'item'
          }?`}
          text={
            "This item will be deleted permanently. You can't undo this action."
          }
          yesText={'Delete'}
          noText={'Cancel'}
        />
        <UpdateDialogueView
          open={updateDialogueOpen}
          handleClose={handleUpdateDialogueClose}
          onUpdate={onClickActivate}
          title={`Are you sure you want to ${
            props.row.original.status === FindingStatus.Active
              ? 'deactivate'
              : 'activate'
          } this finding? [ ${getActivatedAssessmentCycleCount()} assessment cycles have it. ]`}
          text={
            "This item will be updated permanently. You can't undo this action."
          }
          yesText={
            props.row.original.status === FindingStatus.Active
              ? 'Deactivate'
              : 'Activate'
          }
          noText={'Cancel'}
        />
      </ButtonGroup>
    )
  } else {
    return (
      <ButtonGroup>
        <IconButton onClick={onClickEdit}>
          <Edit htmlColor={palette.light.button.blue} />
        </IconButton>
        <IconButton onClick={handleDeleteDialogueOpen}>
          <Delete htmlColor={palette.light.button.red} />
        </IconButton>
        <DeleteDialogue
          open={deleteDialogueOpen}
          handleClose={handleDeleteDialogueClose}
          onDelete={onClickDelete}
          title={`Are you sure you want to delete ${
            name
              ? `"${name.length > 20 ? name.substring(0, 20) + '...' : name}"`
              : 'item'
          }?`}
          text={
            "This item will be deleted permanently. You can't undo this action."
          }
          yesText={'Delete'}
          noText={'Cancel'}
        />
      </ButtonGroup>
    )
  }
}
export default observer(CellButtonsView)

const UserReportingCardView = observer((cellProps: any) => {
  const state = useLocalObservable(() => ({
    isOpen: false,
  }))
  const onClcikReporting = () => {
    state.isOpen = true
  }

  const onClickClose = () => {
    state.isOpen = false
  }

  return (
    <>
      <IconButton
        sx={{
          backgroundColor: green[700],
          borderRadius: '2px !important',
          ml: 1,
          '&:hover': {
            bgcolor: green[900],
          },
        }}
        size="small"
        onClick={onClcikReporting}
      >
        <Badge htmlColor={yellow[50]} />
      </IconButton>
      <Modal open={state.isOpen}>
        <Box>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Reporting
              </Typography>
              <Button onClick={onClickClose} color="inherit">
                Close
              </Button>
            </Toolbar>
          </AppBar>
          <Reporting userId={cellProps.row?.original.user._id} />
        </Box>
      </Modal>
    </>
  )
})

export const UserReportingCard = compose<any>()(UserReportingCardView)

const SimCardView = observer((cellProps: any) => {
  const state = useLocalObservable(() => ({
    isOpen: false,
  }))
  const onClcikCard = () => {
    state.isOpen = true
  }

  const onClickClose = () => {
    state.isOpen = false
  }

  return (
    <>
      <IconButton
        onClick={onClcikCard}
        sx={{
          backgroundColor: green[500],
          borderRadius: '2px !important',
          ml: 1,
          '&:hover': {
            bgcolor: green[900],
          },
        }}
        size="small"
      >
        <FormatListBulleted htmlColor={yellow[50]} />
      </IconButton>
      <Modal open={state.isOpen}>
        <Box>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Simulation Card
              </Typography>
              <Button onClick={onClickClose} color="inherit">
                Close
              </Button>
            </Toolbar>
          </AppBar>
          <SimCard
            userId={cellProps.row?.original.user._id}
            props={cellProps}
          />
        </Box>
      </Modal>
    </>
  )
})

export const UserSimCard = compose<any>()(SimCardView)
