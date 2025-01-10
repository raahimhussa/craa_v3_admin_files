import { Box, Paper, Table, TableCell, TableRow, Card } from '@mui/material'

import Assessment from 'src/models/assessment'
import User from 'src/models/user'
import UserSimulation from 'src/models/userSimulation'
import compose from '@shopify/react-compose'
import { observer } from 'mobx-react'
import withFindOne from 'src/hocs/withFindOne'
import { Typography } from '@components'
import { useEffect } from 'react'
import moment from 'moment'
import { Utils } from '@utils'

const UserInfoView = ({
  user,
  countries,
  setUserInfo,
  userSimulation,
  userInfo,
  setUser,
  simulations,
}: {
  user: User
  countries: any[]
  setUserInfo: any
  userSimulation: UserSimulation
  userInfo: any
  setUser: any
  simulations: any
}) => {
  const usage = Utils.convert(userSimulation.usageTime, 'astr')

  useEffect(() => {
    let arr = []
    let info = {
      name: user.name,
      simId: userSimulation._id,
    }
    arr.push('Name'.concat(' : ', user.name))
    arr.push(
      'Country'.concat(
        ' : ',
        countries.find((_country) => _country._id === user.profile?.countryId)
          ?.name
      )
    )
    arr.push('Simulation'.concat(' : ', userSimulation.simulationType))
    //@ts-ignore
    arr.push(
      'Date Complete'.concat(
        ' : ',
        //@ts-ignore
        userSimulation.submittedAt == null ? '' : userSimulation.submittedAt
      )
    )
    arr.push(
      'Time to Complete'.concat(
        ' : ',
        `${moment.utc(userSimulation.usageTime * 1000).format('HH:mm:ss')}`
      )
    )
    setUserInfo({ data: arr })
    setUser(info)    
  }, [])
  return (
    <Box>
      <Typography sx={{ fontWeight: 700, mb: 0.5 }}>User info</Typography>
      <Card className="preview_card" sx={{ width: '40%' }}>
        <Table className="preview_table">
          <TableRow>
            <TableCell className="title">Name</TableCell>
            <TableCell>{user.profile.firstName} {user.profile.lastName}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="title">Country</TableCell>
            <TableCell>
              {
                countries.find(
                  (_country) => _country._id === user.profile?.countryId
                )?.name
              }
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="title">Simulation</TableCell>
            <TableCell>
              {/* {userSimulationId && 'baseline'}
            {userSimulationId && 'followup'} */}
              {
                simulations.find((s: any) => s._id === userSimulation.simulationId).name
              }
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="title">Date Complete</TableCell>
            <TableCell>
              {userSimulation.submittedAt
                  ? moment(userSimulation.submittedAt).format(
                      'MM-DD-YYYY hh:mm:ss'
                    )
                  : null}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="title">Time to Complete</TableCell>
            <TableCell>              
              {usage.hours}:{usage.minutes}:{usage.seconds}              
            </TableCell>
          </TableRow>
        </Table>
      </Card>
    </Box>
  )
}
export default compose<any>(
  withFindOne({
    collectionName: 'users',
    getFilter: ({ userId }: { userId: string }) => ({
      _id: userId,
    }),
  }),
  // withFindOne({
  //   collectionName: 'userSimulations',
  //   getFilter: ({ userSimulationId }: { userSimulationId: string }) => ({
  //     _id: userSimulationId,
  //   }),
  // }),
  // withFindOne({
  //   collectionName: 'simulations',
  //   getFilter: ({ userSimulation }: { userSimulation: any }) => ({
  //     _id: userSimulation.simulationId,
  //   }),
  // })
)(observer(UserInfoView))
