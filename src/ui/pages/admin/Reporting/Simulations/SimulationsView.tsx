import {
  Box,
  Button,
  Checkbox,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material'
import { observer, useLocalObservable } from 'mobx-react'

import Simulation from 'src/models/simulation'
import { SimulationType } from 'src/utils/status'
import UserSimulation from 'src/models/userSimulation'
import { Utils } from '@utils'
import axios from 'axios'
import moment from 'moment'

type SimulationsProps = {
  userSimulations: UserSimulation[]
  simulations: Simulation[]
  onClickBaselineViewResult: (userSimulationId: string) => void
  onClickFollowupViewResult: (userSimulationId: string) => void
  userCardDataMutate: any
}

export default observer((props: SimulationsProps) => {
  const {
    userSimulations,
    simulations,
    onClickBaselineViewResult,
    onClickFollowupViewResult,
    userCardDataMutate,
  } = props

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell className="usercard-head-cell">Simulation</TableCell>
          <TableCell className="usercard-head-cell" align="center">
            Time Spent
          </TableCell>
          <TableCell className="usercard-head-cell" align="center">
            Assigned
          </TableCell>
          <TableCell className="usercard-head-cell" align="center">
            Started
          </TableCell>
          <TableCell className="usercard-head-cell" align="center">
            Submitted
          </TableCell>
          <TableCell className="usercard-head-cell" align="center">
            Published
          </TableCell>
          <TableCell className="usercard-head-cell" align="center">
            Distributed (Reviewed)
          </TableCell>
          <TableCell className="usercard-head-cell" align="center">
            Actions
          </TableCell>
          <TableCell className="usercard-head-cell" align="center">
            Minimum Effort
          </TableCell>
          <TableCell className="usercard-head-cell" align="center">
            Unusual Behavior
          </TableCell>
        </TableRow>
      </TableHead>
      {userSimulations.map((_userSimulation) => {
        const usage = Utils.convert(_userSimulation.usageTime, 'astr')
        const simulation = simulations.find(
          (_simulation) => _simulation._id === _userSimulation.simulationId
        )
        // const state = useLocalObservable(() => ({
        //   isOpen: false,
        // }))

        const onClickSaveUnusualBehavior = async () => {
          try {
            await axios.patch('/v2/userSimulations', {
              filter: { _id: _userSimulation._id },
              update: {
                $set: {
                  unusualBehavior: _userSimulation.unusualBehavior
                    ? false
                    : true,
                },
              },
            })
          } catch (e) {
            console.error(e)
          }
          await userCardDataMutate()
        }

        const onClickSaveMinimumEffort = async () => {
          try {
            await axios.patch('/v2/userSimulations', {
              filter: { _id: _userSimulation._id },
              update: {
                $set: {
                  minimumEffort: _userSimulation.minimumEffort ? false : true,
                },
              },
            })
          } catch (e) {
            console.error(e)
          }
          await userCardDataMutate()
        }

        const onClickViewResults = () => {
          if (_userSimulation.simulationType === SimulationType.Baseline)
            onClickBaselineViewResult(_userSimulation._id)
          else if (_userSimulation.simulationType === SimulationType.Followup)
            onClickFollowupViewResult(_userSimulation._id)
        }

        return (
          <TableBody>
            <TableRow>
              <TableCell className="usercard-body-cell">
                {simulation?.name}
              </TableCell>
              <TableCell className="usercard-body-cell">
                {usage.hours}:{usage.minutes}:{usage.seconds}
              </TableCell>
              <TableCell className="usercard-body-cell">
                {/* assigned at */}
                {_userSimulation.assignedAt
                  ? moment(_userSimulation.assignedAt).format(
                      'MM-DD-YYYY hh:mm:ss'
                    )
                  : null}
              </TableCell>
              <TableCell className="usercard-body-cell">
                {/* started at */}
                {_userSimulation.startedAt
                  ? moment(_userSimulation.startedAt).format(
                      'MM-DD-YYYY hh:mm:ss'
                    )
                  : null}
              </TableCell>
              <TableCell className="usercard-body-cell">
                {/* submitted at */}
                {_userSimulation.submittedAt
                  ? moment(_userSimulation.submittedAt).format(
                      'MM-DD-YYYY hh:mm:ss'
                    )
                  : null}
              </TableCell>
              <TableCell className="usercard-body-cell">
                {/* published at */}
                {_userSimulation.publishedAt
                  ? moment(_userSimulation.publishedAt).format(
                      'MM-DD-YYYY hh:mm:ss'
                    )
                  : null}
              </TableCell>
              <TableCell className="usercard-body-cell">
                {/* distributed */}
                {_userSimulation.distributedAt
                  ? moment(_userSimulation.distributedAt).format(
                      'MM-DD-YYYY hh:mm:ss'
                    )
                  : null}
              </TableCell>
              <TableCell className="usercard-body-cell">
                {/* actions */}
                {_userSimulation.publishedAt ? (
                  <Button onClick={onClickViewResults} variant="outlined">
                    View Results
                  </Button>
                ) : (
                  <></>
                )}
              </TableCell>
              <TableCell className="usercard-body-cell">
                {/* minimum effort */}
                <Checkbox
                  checked={_userSimulation.minimumEffort}
                  onClick={onClickSaveMinimumEffort}
                />
              </TableCell>
              <TableCell className="usercard-body-cell">
                {/* unusual behavior */}
                <Checkbox
                  checked={_userSimulation.unusualBehavior}
                  onClick={onClickSaveUnusualBehavior}
                />
              </TableCell>
            </TableRow>
          </TableBody>
        )
      })}
    </Table>
  )
})
