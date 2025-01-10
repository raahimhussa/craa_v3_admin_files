import {
  Box,
  ButtonGroup,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import { Button, Select, TextField } from 'src/ui/core/components'
import { observer, useLocalObservable } from 'mobx-react'

import CommonDAO from 'src/commons/interfaces/commonDAO.interface'
import DetailLayout from 'src/ui/layouts/DetailLayout/DetailLayout'
import IDomain from 'src/models/domain/domain.interface'
import IRole from 'src/models/role/role.interface'
import ISetting from 'src/models/setting/setting.interface'
import IUser from 'src/models/user/user.interface'
import Identifiable from 'src/commons/interfaces/identifiable.interface'
import { KeyedMutator } from 'swr'
import Swal from 'sweetalert2'
import _ from 'lodash'
import palette from 'src/theme/palette'
import { useRootStore } from 'src/stores'

function ScorerView(props: {
  users: IUser[]
  domains: IDomain[]
  roles: IRole[]
  settingMutate: KeyedMutator<any>
  setting: ISetting &
    Identifiable &
    CommonDAO & {
      firstScorerId: string
      secondScorerId: string
      adjudicatorId: string
      domains: never[]
    }
}) {
  const state = useLocalObservable(() => ({
    setting: props.setting,
  }))

  const {
    settingStore,
    uiState: {
      modal,
      windowDimensions: { height },
    },
  } = useRootStore()

  const userOptions = props.users?.map((user) => {
    const role = props.roles.find((role) => role._id === user.roleId)
    return {
      text:
        (user.profile?.firstName || '') +
        (user.profile?.lastName || '') +
        '-' +
        role?.title,
      value: user._id,
    }
  })

  const regex = new RegExp('admin', 'i')

  const adminUserOptions = userOptions.filter((user) => regex.test(user.text))
  return (
    <Paper sx={{ overflow: 'scroll', height, bgcolor: 'rgb(242, 243, 243)' }}>
      <Box
        sx={{
          p: 1,
          color: 'white',
          display: 'flex',
          background: palette.light.background.header,
        }}
      >
        <Typography lineHeight={2} variant="h5">
          Scoring Setting
        </Typography>
        <ButtonGroup
          sx={{
            display: 'flex',
            flex: 1,
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <Button
            color="error"
            size="small"
            sx={{
              width: 80,
              bgcolor: 'transparent',
              '&:hover': {
                bgcolor: 'rgb(255,255,255,0.1) !important',
              },
            }}
            variant="contained"
            onClick={() => modal.close()}
          >
            {/* <Close /> */}
            Cancel
          </Button>
          <Button
            size="small"
            sx={{ width: 80 }}
            variant="contained"
            color="primary"
            onClick={async () => {
              const setting = _.cloneDeep(state.setting)
              const settingId = setting._id
              // @ts-ignore
              delete setting._id
              try {
                await settingStore.repository.update({
                  filter: {
                    kind: 'ScorerSetting',
                    _id: settingId,
                  },
                  update: setting,
                })
              } catch (error) {
                return console.log(error)
              }

              props.settingMutate()

              Swal.fire({
                title: 'Save',
                icon: 'success',
              })

              modal.close()
            }}
          >
            {/* <Save /> */}
            Save
          </Button>
        </ButtonGroup>
      </Box>
      <Grid container xs={12} sx={{ p: 2 }}>
        <Grid xs={12} sm={12} md={8} lg={6}>
          {/* <Stack spacing={2}> */}
          <Card sx={{ p: 0.5, mr: 2 }} className="paper-grid">
            <CardHeader title="Default Scorer" />
            <CardContent>
              <Grid item xs={12} sm={6} md={7} lg={6}>
                <Stack spacing={2}>
                  <Select
                    options={userOptions}
                    label="Scorer-1"
                    state={state}
                    path="setting.firstScorerId"
                    className="select"
                  />
                  <Select
                    options={userOptions}
                    label="Scorer-2"
                    state={state}
                    path="setting.secondScorerId"
                    className="select"
                  />
                  <Select
                    options={adminUserOptions}
                    label="Adjudicator"
                    state={state}
                    path="setting.adjudicatorId"
                    className="select"
                  />
                </Stack>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} sm={12} md={8} lg={6}>
          <Card sx={{ p: 0.5 }} className="paper-grid">
            <CardHeader title="Default Domain MinScore" />
            <CardContent>
              <Stack spacing={2}>
                {state.setting.domains.map((domain) => {
                  return (
                    <Card
                      sx={{
                        p: 1,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderRadius: '2px',
                        boxShadow: 'none',
                      }}
                    >
                      <Typography variant="body2">{domain.label}</Typography>
                      <TextField
                        fullWidth={false}
                        label="Min Score"
                        state={domain}
                        path="minScore"
                      />
                    </Card>
                    // <Card>
                    //   <Box
                    //     sx={{
                    //       display: 'flex',
                    //       justifyContent: 'space-between',
                    //       px: 3,
                    //       py: 1,
                    //     }}
                    //   >
                    //     <Typography>{domain.label}</Typography>
                    //     <TextField
                    //       number
                    //       type="number"
                    //       sx={{ width: 200 }}
                    //       label="Min Score"
                    //       state={domain}
                    //       path="minScore"
                    //     />
                    //   </Box>
                    // </Card>
                  )
                })}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      {/* </Stack> */}
    </Paper>
  )
}

export default observer(ScorerView)
