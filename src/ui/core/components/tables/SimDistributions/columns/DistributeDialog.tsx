import * as React from 'react'

import {
  AdminLogScreen,
  SimulationType,
  UserSimulationStatus,
} from 'src/utils/status'

import { AdminLogManager } from 'src/classes/adminLogManager'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import User from 'src/models/user'
import UserAssessmentCycle from 'src/models/userAssessmentCycle'
import UserSimulation from 'src/models/userSimulation'
import axios from 'axios'
import compose from '@shopify/react-compose'
import { observer } from 'mobx-react'
import { useSnackbar } from 'notistack'
import withFind from 'src/hocs/withFind'
import withFindOne from 'src/hocs/withFindOne'
import Swal from 'sweetalert2'

type Props = {
  user: User
  userSimulation: UserSimulation
  userSimulationStore: any
  disabled: boolean
  mutate: any
}

const DistributeDialog = observer(
  ({ user, userSimulation, disabled, mutate }: Props) => {
    const [open, setOpen] = React.useState(false)
    const { enqueueSnackbar } = useSnackbar()

    const handleClickOpen = () => {
      setOpen(true)
    }

    const handleClose = () => {
      setOpen(false)
    }
    const onClickDistribute = async () => {
      Swal.fire({
        title: 'Distributing..',
        html: 'Do not close this window.',
        timerProgressBar: true,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading()
        },
        allowOutsideClick: false,
      })
      const adminLogManager = AdminLogManager.getInstance()
      try {
        if (userSimulation.simulationType === SimulationType.Baseline) {
          await axios.patch(
            `/v3/simDistribution/userSimulations/${userSimulation._id}/baselineDistribute`
          )
        } else if (userSimulation.simulationType === SimulationType.Followup) {
          await axios.patch(
            `/v3/simDistribution/userSimulations/${userSimulation._id}/followupDistribute`
          )
        }
        await adminLogManager?.createDistributeSimulationLog({
          screen: AdminLogScreen.SimDistribution,
          target: {
            type: 'userSimulations',
            _id: userSimulation._id,
          },
          message: `${
            (userSimulation as any)?.simulation?.name || ''
          } has been distributed.`,
        })
        await mutate()
        // enqueueSnackbar('Distributed', { variant: 'success' })
        Swal.fire({
          html: 'Distributed.',
          showConfirmButton: false,
        })
      } catch (error) {
        Swal.fire({
          html: 'Failed. Please try later.',
          showConfirmButton: false,
        })
        return console.error(error)
      }
      handleClose()
    }

    return (
      <div>
        <Button
          variant="outlined"
          onClick={handleClickOpen}
          disabled={disabled}
        >
          Distribute
        </Button>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Are you sure you want to mark {user.name || 'unknown'}
            's {userSimulation.simulationType} as 'Distributed' ?
          </DialogTitle>
          <DialogContent>
            {/* <DialogContentText id="alert-dialog-description">
            Let Google help apps determine location. This means sending
            anonymous location data to Google, even when no apps are running.
          </DialogContentText> */}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={onClickDistribute} autoFocus>
              Distribute
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
)

export default compose<any>(
  withFindOne({
    collectionName: 'users',
    getFilter: (props: any) => ({
      _id: props.userSimulation.userId,
    }),
  })
)(DistributeDialog)
