import { Authority, ClientUnitAuthority } from 'src/models/user/types'
import { Autocomplete, Select, TextField } from 'src/ui/core/components'
import {
  Button,
  ButtonBase,
  ButtonGroup,
  Checkbox,
  Chip,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  InputLabel,
  ListItem,
  MenuItem,
  Select as MuiSelect,
  Paper,
  Radio,
  RadioGroup,
  Tooltip,
  Typography,
  ListItemText,
  OutlinedInput,
} from '@mui/material'
import {
  CancelRounded,
  Clear,
  CloseRounded,
  Delete,
  FlagCircle,
  SettingsRounded,
} from '@mui/icons-material'
import { ResultsType, ResultsView } from 'src/utils/status'
import { green, red } from '@mui/material/colors'
import { observer, useLocalObservable } from 'mobx-react'
import { reaction, toJS } from 'mobx'
import { useEffect, useState } from 'react'

import Box from '@mui/material/Box'
import DeleteDialogue from '@components/DeleteDialogue/DeleteDialogue'
import { IClientUnit } from 'src/models/clientUnit/clientUnit.interface'
import IRole from 'src/models/role/role.interface'
import Stack from '@mui/material/Stack'
import User from 'src/models/user'
import axios from 'axios'
import palette from 'src/theme/palette'
import { useAsync } from 'react-async'
import { useRootStore } from 'src/stores'
import { useSnackbar } from 'notistack'

function UserView(props: {
  roles: IRole[]
  clientUnits: IClientUnit[]
  countries: any[]
}) {
  const {
    userStore,
    uiState: { users, alert, modal },
  } = useRootStore()

  useEffect(() => {
    userStore.users = []
    userStore.addUser()
  }, [])

  const onClickCancel = async () => {
    modal.close()
  }
  const onClickSave = async () => {
    modal.close()
    try {
      await Promise.all(userStore.users.map((user) => user.save()))
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return alert.error(error.response?.data.errors[0]?.detail)
      }
    }
    userStore.users = []
    alert.success()
    users.mutate && users.mutate()
  }
  return (
    <Box sx={{ bgcolor: 'white' }}>
      <Box
        sx={{
          p: 1,
          color: 'white',
          display: 'flex',
          bgcolor: 'linear-gradient(135deg, #2c5c68, #0a304d) ',
        }}
      >
        <Typography lineHeight={2} variant="h5">
          New User
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
            onClick={onClickCancel}
          >
            {/* <Close /> */}
            Cancel
          </Button>
          <Button
            size="small"
            sx={{ width: 80 }}
            variant="contained"
            color="primary"
            onClick={onClickSave}
          >
            {/* <Save /> */}
            Save
          </Button>
        </ButtonGroup>
      </Box>
      {/* <Box
        sx={{
          p: 2,
          height: 48,
          // background: (theme) => theme.craa?.palette.mainGradiant,
          display: 'flex',
          justifyContent: 'space-between',
          flex: 1,
          alignItems: 'center',
        }}
      >
        <Box sx={{ fontWeight: 600, fontSize: 20, color: 'white' }}>
          New User
        </Box>
      </Box> */}
      <Stack spacing={2} sx={{ p: 4, pb: 2, bgcolor: 'rgb(242, 243, 243)' }}>
        {/* <Button onClick={() => userStore.addUser()} variant="outlined">
          New User
        </Button> */}
        <Users {...props} />
      </Stack>
    </Box>
  )
}

const Users = observer(
  (props: { roles: IRole[]; clientUnits: IClientUnit[]; countries: any[] }) => {
    const { userStore } = useRootStore()
    const [vendors, setVendors] = useState<any>({})
    const [countries, setCountries] = useState<any>({})
    const [clients, setClients] = useState<any>([])
    const [selectedBU, setSelectedBU] = useState<any>(null)
    const [selectedBUForSim, setSelectedBUForSim] = useState<any>(null)
    const [openDeleteDialogue, setOpenDeleteDialogue] = useState<any>({
      open: false,
      id: '',
    })
    const [openDeleteDialogue2, setOpenDeleteDialogue2] = useState<any>({
      open: false,
      id: '',
      name: '',
    })
    const [openDeleteDialogue3, setOpenDeleteDialogue3] = useState<any>({
      open: false,
      id: '',
      name: '',
    })

    const { enqueueSnackbar } = useSnackbar()

    const state = useLocalObservable<{
      authority: Authority
      clientUnitAuthority: ClientUnitAuthority
    }>(() => ({
      authority: {
        authorizedAll: false,
        whitelist: [],

        pfizerAdmin: false,
      },
      clientUnitAuthority: {
        clientId: '',
        businessUnits: [],
        countryPermissions: {},
        simPermissions: {},
        resultsView: ResultsView.Always,
        resultsType: ResultsType.Full,
        publishNotification: false,
        distributionNotification: false,
      },
    }))

    // reaction(
    //   () => state.clientUnitAuthority.clientId,
    //   () => {}
    // )

    useEffect(() => {
      props.clientUnits.map((client) => {
        client.businessUnits.map((bu) => {
          bu.adminCountryIds.map(async (id) => {
            const params = {
              filter: {
                _id: id,
              },
            }
            const { data } = await axios.get('/v1/countries', { params })
            let obj = countries
            obj[id] = data.name
            setCountries(obj)
          })
        })
      })
    }, [])

    const roleOptions = props.roles
      .map((role) => ({
        text: role.title,
        value: role._id,
      }))
      .filter((_role) => _role.text !== 'SuperAdmin')

    const clientsOptions = props.clientUnits
      .sort(function (a, b) {
        var nameA = a.name.toUpperCase() // ignore upper and lowercase
        var nameB = b.name.toUpperCase() // ignore upper and lowercase
        if (nameA < nameB) {
          return -1
        }
        if (nameA > nameB) {
          return 1
        }

        return 0
      })
      .filter((client) => client.name !== 'Pfizer')
      .map((clientUnit) => ({
        text: clientUnit.name,
        value: clientUnit._id,
      }))
    const countryOptions = props.countries.map((c: any) => ({
      text: c.name,
      value: c._id,
    }))

    const renderUser = (user: User) => {
      // const businessUnitOptions =
      //   props.clientUnits
      //     .find(
      //       (clientUnit) =>
      //         clientUnit._id === toJS(state.clientUnitAuthority.clientId)
      //     )
      //     ?.businessUnits.map((businessUnit) => businessUnit) || []
      // const VendorOptions =
      //   props.clientUnits
      //     .filter(
      //       (clientUnit) =>
      //         clientUnit.vendor !== '' &&
      //         clientUnit.vendor === toJS(state.clientUnitAuthority.clientId)
      //     )
      //     ?.map((vendor) => vendor) || []

      const onClickAddAuthority = () => {
        if (
          !state.clientUnitAuthority.clientId ||
          state.clientUnitAuthority.businessUnits.length === 0
        ) {
          return
        }
        const whitelist = state.authority.whitelist
        if (
          whitelist.find(
            (_whitelistItem) =>
              _whitelistItem.clientId === state.clientUnitAuthority.clientId
          )
        ) {
          whitelist.forEach((_whitelistItem) => {
            if (
              _whitelistItem.clientId === state.clientUnitAuthority.clientId
            ) {
              //   state.clientUnitAuthority.businessUnits
              state.clientUnitAuthority.businessUnits.forEach((bu) => {
                if (!_whitelistItem.businessUnits.includes(bu)) {
                  _whitelistItem.businessUnits.push(bu)
                }
              })
              Object.keys(state.clientUnitAuthority.countryPermissions).map(
                (bu) => {
                  if (_whitelistItem.countryPermissions[bu] === undefined) {
                    _whitelistItem.countryPermissions[bu] = []
                  }
                  state.clientUnitAuthority.countryPermissions[bu]?.map(
                    (country: any) => {
                      if (
                        !_whitelistItem.countryPermissions[bu]?.includes(
                          country
                        )
                      ) {
                        _whitelistItem.countryPermissions[bu]?.push(country)
                      }
                    }
                  )
                }
              )
            }
            // _whitelistItem.businessUnits =
          })
        } else {
          whitelist.push(toJS(state.clientUnitAuthority))
        }
        user.authority = toJS(state.authority)
        setVendors({})
        state.clientUnitAuthority.businessUnits = []
        state.clientUnitAuthority.clientId = ''
        state.clientUnitAuthority.countryPermissions = {}
      }
      const onChangeAuthority = (clientIds: any) => {
        state.authority.whitelist = []
        setClients(
          typeof clientIds === 'string' ? clientIds.split(',') : clientIds
        )
        state.clientUnitAuthority.clientId = clientIds[0]
        clientIds.forEach((clientId: any) => {
          state.clientUnitAuthority.clientId = clientId
          state.authority.whitelist.push(toJS(state.clientUnitAuthority))
        })
        user.authority = toJS(state.authority)
      }

      const checkVendorAdmin = (checked: boolean) => {
        user.authority.pfizerAdmin = checked
      }

      return (
        <Grid container sx={{ alignItems: 'flex-start' }}>
          {/* <Paper sx={{ p: 1 }}> */}
          {/* <Grid item container xs={12}> */}
          <Grid item xs={2.8} sx={{ mr: 2.5 }} className="paper-grid">
            <InputLabel sx={{ mb: 2 }}>User Information</InputLabel>
            <Stack spacing={1}>
              <InputLabel>User Name</InputLabel>
              <TextField
                disabled={true}
                state={user}
                path="name"
                variant="outlined"
                size="small"
              />
              <InputLabel>Email</InputLabel>
              <TextField
                state={user}
                path="email"
                variant="outlined"
                size="small"
                placeholder="Email"
              />
              <InputLabel>Password</InputLabel>
              <TextField
                state={user}
                path="password"
                variant="outlined"
                size="small"
                placeholder="Password"
              />
              <InputLabel>First Name</InputLabel>
              <TextField
                state={user}
                path="profile.firstName"
                variant="outlined"
                size="small"
                placeholder="First Name"
              />
              <InputLabel>Last Name</InputLabel>
              <TextField
                state={user}
                path="profile.lastName"
                variant="outlined"
                size="small"
                placeholder="Last Name"
              />
              <InputLabel>Role</InputLabel>
              <Select options={roleOptions} path="roleId" state={user} />
              <InputLabel>Country</InputLabel>
              <Select
                options={countryOptions}
                path="profile.countryId"
                state={user}
              />
            </Stack>
          </Grid>
          {/* <InputLabel sx={{ mb: 2 }}>Authorization</InputLabel> */}
          {props.roles
            .map((role) => {
              if (
                role.title === 'ClientAdmin' ||
                role.title === 'ClientSubAdmin'
              ) {
                return role._id
              }
            })
            .includes(user.roleId) && user.roleId !== undefined ? (
            <Grid item xs={2.9} sx={{ mr: 2.5 }} className="paper-grid">
              <Stack spacing={1}>
                <InputLabel>Clients</InputLabel>
                {/* <Select
                // label="Client"
                options={clientsOptions}
                path="authority.whitelist[0].clientId"
                state={user}
                sx={{
                  '&.MuiOutlinedInput-root': {
                    height: '39px !important',
                  },
                }}
              /> */}
                <MuiSelect
                  id="demo-multiple-checkbox"
                  multiple
                  value={clients}
                  onChange={(e) => {
                    onChangeAuthority(e.target.value as string)
                  }}
                  input={<OutlinedInput />}
                  renderValue={(selected) => {
                    let arr: any = []
                    selected.map((client: any) => {
                      arr.push(
                        //@ts-ignore
                        props?.clientUnits?.find((el: any) => el._id === client)
                          .name!
                      )
                    })
                    return arr.join(', ')
                  }}
                >
                  {clientsOptions.map((client) => (
                    <MenuItem key={client.value} value={client.value}>
                      <Checkbox checked={clients.indexOf(client.value) > -1} />
                      <ListItemText primary={client.text} />
                    </MenuItem>
                  ))}
                </MuiSelect>
                {user.authority !== undefined ? (
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={(e) => {
                            checkVendorAdmin(e.target.checked)
                          }}
                        />
                      }
                      label="Vendor Admin"
                    />
                  </FormGroup>
                ) : (
                  <></>
                )}
                {/* <MuiSelect
                onChange={(e) => {
                  onChangeAuthority(e.target.value as string)
                }}
              >
                {clientsOptions.map((client) => (
                  <MenuItem value={client.value}>{client.text}</MenuItem>
                ))}
              </MuiSelect> */}
              </Stack>
            </Grid>
          ) : (
            <></>
          )}
        </Grid>
      )
    }

    return (
      <Grid container spacing={2}>
        {userStore.users.map(renderUser)}
      </Grid>
    )
  }
)

export default observer(UserView)
