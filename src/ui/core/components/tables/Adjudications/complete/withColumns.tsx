import {
  AdminColumn,
  CellType,
  Type,
} from 'src/ui/core/components/DataGrid/DataGrid'
import { AssessmentStatus, ScorerStatus } from 'src/utils/status'
import { Box, Button, ButtonGroup } from '@mui/material'

import Assessment from 'src/models/assessment'
import { CellProps } from 'react-table'
import User from 'src/models/user'
import { WrappingFunction } from '@shopify/react-compose'
import _ from 'lodash'
import { observer } from 'mobx-react'
import palette from 'src/theme/palette'
import { useRootStore } from 'src/stores'

const withColumns: WrappingFunction = (WrappedComponent) =>
  observer((props) => {
    const { assessmentStore, routerStore } = useRootStore()
    const columns: Array<AdminColumn> = [
      {
        Header: 'simUser',
        accessor: 'userSimulation.user.name',
        type: Type.String,
        Cell: ({ row }: CellProps<any>) => {
          const user = row.original.userSimulation?.user as User
          return `${user?.profile.firstName} ${user?.profile.lastName}`
        },
      },
      {
        Header: 'Initial',
        accessor: 'userSimulation.user.profile.initial',
        type: Type.String,
      },
      {
        Header: 'Simulation',
        accessor: 'userSimulation.simulation.name',
        type: Type.String,
      },
      {
        Header: 'Actions',
        Cell: (props: { row: any }) => {
          const assessment = props.row.original as Assessment
          const isFinishedScoring =
            assessment.firstScorer.status === ScorerStatus.Complete &&
            assessment.secondScorer.status === ScorerStatus.Complete
          const isFinishAdjudicating =
            assessment.adjudicator.status === ScorerStatus.Complete
          const onClickAdjudicate = (disabled?: boolean) => {
            routerStore.router &&
              routerStore.router(
                `/admin/scoring/adjudicate/userSimulations/${assessment.userSimulationId}`,
                {
                  state: {
                    disabled,
                  },
                }
              )
          }
          return (
            <ButtonGroup sx={{ mr: 3 }}>
              <Button
                disabled={!isFinishedScoring || isFinishAdjudicating}
                variant="contained"
                sx={{ width: '105px', bgcolor: palette.light.button.green }}
              >
                {isFinishedScoring
                  ? isFinishAdjudicating
                    ? 'Complete'
                    : 'Adjudicate'
                  : 'Pending'}
              </Button>
              <Button
                sx={{
                  color: 'rgb(0, 115, 187) !important',
                  borderColor: 'rgb(0, 115, 187) !important',
                }}
                onClick={() => onClickAdjudicate(true)}
              >
                Review
              </Button>

              <Button
                sx={{
                  color: 'rgb(236, 114, 17) !important',
                  borderColor: 'rgb(236, 114, 17) !important',
                }}
              >
                Roadmap
              </Button>
            </ButtonGroup>
          )
        },
      },
      {
        Header: 'Status',
        accessor: 'userSimulation.status',
        type: Type.String,
      },
    ]

    const meta = {
      columns,
    }

    return <WrappedComponent {...props} {...meta} />
  })

export default withColumns
