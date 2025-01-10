import {
  Analytics,
  CancelRounded,
  Clear,
  Save,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material'
import {
  Box,
  Button,
  Checkbox,
  Autocomplete as MobXAutoComplete,
  Select as MobXSelect,
  TextField,
} from 'src/ui/core/components'
import {
  Card,
  Chip,
  Divider,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  IconButton,
  Input,
  ListSubheader,
  TextField as LocalTextField,
  Checkbox as MUICheckbox,
  Paper,
  Stack,
  Switch,
  Tooltip,
  Typography,
  OutlinedInput,
  Select as MuiSelect,
  ListItemText,
  InputAdornment,
} from '@mui/material'
import { ResultsType, ResultsView } from 'src/utils/status'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { observer, useLocalObservable } from 'mobx-react'
import { reaction, toJS } from 'mobx'
import { useEffect, useMemo, useState } from 'react'

import AssignToUser from './AssignToUser/AssignToUser'
import { BusinessUnit } from 'src/models/clientUnit/clientUnit.interface'
import ClientUnit from 'src/models/clientUnit'
import { Authority, ClientUnitAuthority } from 'src/models/user/types'
import DeleteDialogue from '@components/DeleteDialogue/DeleteDialogue'
import DetailLayout from 'src/ui/layouts/DetailLayout/DetailLayout'
import { EmailVerificationButton } from './EmailVerificationButton'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import { Role } from 'src/models/role'
import SendEmailDialogue from '@components/SendEmailDialouge/SendEmailDialogue'
import Swal from 'sweetalert2'
import _ from 'lodash'
import axios from 'axios'
import { green } from '@mui/material/colors'
import palette from 'src/theme/palette'
import { useRootStore } from 'src/stores'
import { useSnackbar } from 'notistack'

type Props = {
  clientUnits: ClientUnit[]
  roles: Role[]
  countries: any[]
  businessUnits: BusinessUnit[]
  usersMutate: any
}

function EditUserView(props: Props) {
  const {
    userStore,
    uiState: { users },
  } = useRootStore()
  const rootStore = useRootStore()
  const [age, setAge] = useState('')
  const [password, setPassword] = useState<string>('')
  const { enqueueSnackbar } = useSnackbar()
  const { clientUnits, roles, countries, businessUnits, usersMutate } = props
  const [clients, setClients] = useState<any>(
    userStore.form?.authority?.whitelist?.map((list) => list.clientId)
  )
  const [country, setCountry] = useState<any>({})
  const [countriesByContinent, setCountriesByContinent] = useState<{
    [continentName: string]: any[]
  }>({})
  const [openDeleteDialogue, setOpenDeleteDialogue] = useState<boolean>(false)
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
  const [showPassword, setShowPassword] = useState(false)

  const handleClickShowPassword = () => setShowPassword((show) => !show)

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault()
  }

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

  useEffect(() => {
    userStore.form.password = undefined
    props.clientUnits.map((client) => {
      client.businessUnits.map((bu) => {
        bu.adminCountryIds.map(async (id) => {
          const params = {
            filter: {
              _id: id,
            },
          }
          const { data } = await axios.get('/v1/countries', { params })
          let obj = country
          obj[id] = data.name
          setCountry(obj)
        })
      })
    })
    setCountriesByContinent(
      _.groupBy(countries, (_country) => _country.continent)
    )
  }, [])

  type Datas = {
    _id: string
    title: string
    name: string
  }

  const clientsOptions = clientUnits
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

  const onChangeAuthority = (clientIds: any) => {
    state.authority.whitelist = []
    setClients(typeof clientIds === 'string' ? clientIds.split(',') : clientIds)
    state.clientUnitAuthority.clientId = clientIds[0]
    clientIds.forEach((clientId: any) => {
      state.clientUnitAuthority.clientId = clientId
      state.authority.whitelist.push(toJS(state.clientUnitAuthority))
    })
    userStore.form.authority = toJS(state.authority)
  }

  const checkVendorAdmin = (checked: boolean) => {
    userStore.form.authority.pfizerAdmin = checked
  }

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string)
  }
  const handleChangeCountry = (event: SelectChangeEvent) => {
    if (!userStore.form.profile) return
    userStore.form.profile.countryId = event.target.value
    // setAge(event.target.value as string)
  }

  const renderCountryMenu = () => {
    const countryList: any[] = []
    Object.keys(countriesByContinent).forEach((_continent) => {
      const _countries = countriesByContinent[_continent]
      {
        _countries.forEach((_country, index) => {
          if (index === 0) {
            countryList.push(
              <Typography sx={{ ml: 2, mt: 1, mb: 1 }}>{_continent}</Typography>
            )
          }
          countryList.push(
            <MenuItem value={_country._id} key={_country._id}>
              {_country.name}
            </MenuItem>
          )
          if (index === _countries.length - 1) {
            countryList.push(<Divider />)
          }
        })
      }
    })
    return countryList
  }

  if (!userStore.form) return null
  return (
    <DetailLayout store={userStore} mutate={usersMutate}>
      <Paper
        sx={{
          display: 'flex',
          flexDirection: 'row',
          backgroundColor: 'white',
          height: 'calc(100vh - 72px)',
          overflow: 'auto',
        }}
      >
        <Box sx={{ maxWidth: '500px', width: '30%' }}>
          <Card sx={{ p: 3, m: 3 }} className="paper-grid">
            <FormControl
              fullWidth
              sx={{
                '& .MuiTextField-root': { mt: 3 },
              }}
            >
              <InputLabel id="demo-simple-select-label">Role</InputLabel>
              <Select
                label="Role"
                value={userStore.form.roleId}
                onChange={(e) => {
                  userStore.form.roleId = e.target.value
                }}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
              >
                {roles.map(({ _id, title }) => (
                  <MenuItem value={_id} key={_id}>
                    {title}
                  </MenuItem>
                ))}
              </Select>
              <TextField
                disabled
                className="show"
                label="Username"
                variant="outlined"
                state={userStore}
                path="form.name"
              />
              <TextField
                className="show"
                label="Email"
                variant="outlined"
                state={userStore}
                path="form.email"
              />
              {/* <TextField
                disabled
                label="Password"
                variant="outlined"
                state={userStore}
                path="form.password"
              /> */}
              <TextField
                className="show"
                label="Region"
                variant="outlined"
                state={userStore}
                placeholder={'Region'}
                // path="form"
                disabled
              />
              <FormControl sx={{ mt: 2 }}>
                <InputLabel id="demo-simple-select-label">Title</InputLabel>
                <Select
                  label="Title"
                  value={userStore.form.profile?.title!}
                  onChange={(e) => {
                    if (userStore.form.profile !== null) {
                      userStore.form.profile.title = e.target.value
                    }
                  }}
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                >
                  {/* @ts-ignore */}
                  {userStore.form.client?.titles.map((title, index) => (
                    <MenuItem value={title} key={index}>
                      {title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                className="show"
                label="clinical Experience"
                variant="outlined"
                state={userStore}
                placeholder={'clinical Experience'}
                // path="form.name"
              />
              <TextField
                className="show"
                label="Internal Development"
                variant="outlined"
                state={userStore}
                placeholder={'Internal Development'}
                // path="form.name"
              />
              <TextField
                className="show"
                label="ID"
                variant="outlined"
                state={userStore}
                placeholder={'ID'}
                // path="form.name"
              />
              <TextField
                className="show"
                label="Type"
                variant="outlined"
                state={userStore}
                placeholder={'Type'}
                // path="form.name"
              />
              <TextField
                className="show"
                label="Degree"
                variant="outlined"
                state={userStore}
                placeholder={'Degree'}
                // path="form.name"
              />
              <TextField
                className="show"
                label="Certification"
                variant="outlined"
                state={userStore}
                placeholder={'Certification'}
                // path="form.name"
              />
              {/* <Button
                  size="medium"
                  variant="contained"
                  sx={{ mt: 3, width: '30%', mx: 'auto' }}
                >
                  Submit
                </Button> */}
            </FormControl>
          </Card>
          <Card sx={{ p: 3, m: 3 }} className="paper-grid">
            <InputLabel
              sx={{
                mb: 1,
              }}
            >
              Reset Password
            </InputLabel>
            <Box sx={{ display: 'flex' }}>
              <OutlinedInput
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              <Button
                size="small"
                sx={{
                  width: 80,
                  bgcolor: green[500],
                  py: '1.15rem !important',
                }}
                variant="contained"
                onClick={async () => {
                  try {
                    await axios.patch('v1/users/password', {
                      _id: toJS(userStore.form._id),
                      password,
                    })
                    enqueueSnackbar('password changed', {
                      variant: 'success',
                    })
                  } catch (e) {
                    console.error(e)
                    enqueueSnackbar('failed to change password', {
                      variant: 'error',
                    })
                  }
                }}
              >
                <Save />
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row' }}>
              <Box>
                <InputLabel
                  sx={{
                    mb: 1,
                    mt: 2,
                  }}
                >
                  Reset 2FA
                </InputLabel>
                <Switch
                  //@ts-ignore
                  checked={userStore.form.otpData?.otp_enabled}
                  //@ts-ignore
                  disabled={!userStore.form.otpData?.otp_enabled}
                  onChange={async () => {
                    try {
                      await axios.post('v1/users/otp/disable', {
                        user_id: toJS(userStore.form._id),
                      })
                      //@ts-ignore
                      userStore.form.otpData = {}
                      enqueueSnackbar('2FA Disabled.', {
                        variant: 'success',
                      })
                    } catch (e) {
                      console.error(e)
                      enqueueSnackbar('failed to disable 2FA', {
                        variant: 'error',
                      })
                    }
                  }}
                  sx={{
                    ml: -1,
                  }}
                />
              </Box>
              <Box sx={{ ml: 4 }}>
                <EmailVerificationButton
                  defaultEmail={toJS(userStore.form.email)}
                  user={toJS(userStore.form)}
                />
              </Box>
            </Box>
          </Card>
          <Card sx={{ p: 3, m: 3 }} className="paper-grid">
            <FormControl
              fullWidth
              sx={{
                '& .MuiTextField-root': { mt: 3 },
              }}
            >
              <TextField
                className="show"
                label="First name"
                variant="outlined"
                state={userStore}
                path={`form.profile.firstName`}
                placeholder={'First name'}
              />
              <TextField
                className="show"
                label="Last name"
                variant="outlined"
                state={userStore}
                path={`form.profile.lastName`}
                placeholder={'Last name'}
              />
              <TextField
                disabled
                className="show"
                label="Initial"
                variant="outlined"
                state={userStore}
                path={`form.profile.initial`}
                placeholder={'Initial'}
              />
              <FormControl fullWidth sx={{ mt: 3 }}>
                <InputLabel id="demo-simple-select-label">Country</InputLabel>
                <Select
                  label="Country"
                  value={userStore.form.profile?.countryId}
                  onChange={handleChangeCountry}
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                >
                  {renderCountryMenu()}
                  {/* {countries.map(({ _id, name }: Datas) => (
                    <MenuItem value={_id} key={_id}>
                      {name}
                    </MenuItem>
                  ))} */}
                </Select>
              </FormControl>
              <TextField
                className="show"
                label="Monitoring Experience"
                variant="outlined"
                state={userStore}
                path={`form.profile.monitoring`}
                placeholder={'Monitoring Experience'}
              />
            </FormControl>
          </Card>
          <Box sx={{ height: '12px' }}></Box>
        </Box>
        <Box sx={{ maxWidth: '600px', width: '40%' }}>
          {roles
            .map((role) => {
              if (
                role.title === 'ClientAdmin' ||
                role.title === 'ClientSubAdmin'
              ) {
                return role._id
              }
            })
            .includes(userStore.form.roleId) &&
            (userStore.form.roleId !== undefined ? (
              <Card sx={{ p: 3, m: 3, mx: 3 }} className="paper-grid">
                <Stack spacing={1}>
                  <InputLabel>Clients</InputLabel>
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
                          props?.clientUnits?.find(
                            (el: any) => el._id === client
                          )?.name!
                        )
                      })
                      return arr.join(', ')
                    }}
                  >
                    {clientsOptions.map((client) => (
                      <MenuItem key={client.value} value={client.value}>
                        <MUICheckbox
                          checked={clients.indexOf(client.value) > -1}
                        />
                        <ListItemText primary={client.text} />
                      </MenuItem>
                    ))}
                  </MuiSelect>
                  {userStore.form.authority !== undefined ? (
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <MUICheckbox
                            onChange={(e) => {
                              checkVendorAdmin(e.target.checked)
                            }}
                            checked={userStore.form.authority.pfizerAdmin}
                          />
                        }
                        label="Vendor Admin"
                      />
                    </FormGroup>
                  ) : (
                    <></>
                  )}
                </Stack>
              </Card>
            ) : (
              <></>
            ))}
          <Card sx={{ p: 3, m: 3, mx: 3 }} className="paper-grid">
            <AssignToUser userId={userStore.form._id} />
          </Card>
        </Box>
        {/* {roles
          .filter((_role) => _role.priority === 4 || _role.priority === 5)
          ?.map((role) =>
            role._id === userStore.form.roleId ? (
              <Box sx={{ maxWidth: '500px', width: '30%' }}>
                <Card sx={{ p: 3, m: 3, mx: 0 }} className="paper-grid">
                  <Box>
                    <InputLabel sx={{ mb: 2 }}>Authorization</InputLabel>
                    <Stack spacing={1}>
                      <InputLabel>Client</InputLabel>
                      <MobXSelect
                        options={clientsOptions}
                        path="clientUnitAuthority.clientId"
                        state={state}
                        sx={{
                          '&.MuiOutlinedInput-root': {
                            height: '39px !important',
                          },
                        }}
                      />
                      <FormGroup>
                        <InputLabel sx={{ mb: 1 }}>Business Unit</InputLabel>
                        {businessUnitOptions.map((bu) => (
                          <>
                            <FormControlLabel
                              control={
                                <MUICheckbox
                                  sx={{ py: 0 }}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      state.clientUnitAuthority.businessUnits.push(
                                        bu._id
                                      )
                                    } else {
                                      const index =
                                        state.clientUnitAuthority.businessUnits.indexOf(
                                          bu._id
                                        )
                                      state.clientUnitAuthority.businessUnits.splice(
                                        index,
                                        1
                                      )
                                    }
                                  }}
                                />
                              }
                              label={bu.name}
                            />
                            {state.clientUnitAuthority.businessUnits.includes(
                              bu._id
                            ) ? (
                              bu.adminCountryIds.map((countryId) => {
                                return (
                                  <FormControlLabel
                                    control={
                                      <MUICheckbox
                                        sx={{ py: 0, ml: 3.9 }}
                                        onChange={(e) => {
                                          if (
                                            state.clientUnitAuthority
                                              .countryPermissions[bu._id] ===
                                            undefined
                                          ) {
                                            state.clientUnitAuthority.countryPermissions[
                                              bu._id
                                            ] = []
                                          }
                                          if (e.target.checked) {
                                            state.clientUnitAuthority.countryPermissions[
                                              bu._id
                                            ]?.push(countryId)
                                          } else {
                                            const index =
                                              state.clientUnitAuthority.countryPermissions[
                                                bu._id
                                              ]?.indexOf(countryId)
                                            state.clientUnitAuthority.countryPermissions[
                                              bu._id
                                            ]?.splice(index, 1)
                                          }
                                        }}
                                      />
                                    }
                                    label={country[countryId]}
                                  />
                                )
                              })
                            ) : (
                              <></>
                            )}
                          </>
                        ))}
                        {VendorOptions.length !== 0 ? (
                          <InputLabel sx={{ mt: 2, mb: 1 }}>Vendors</InputLabel>
                        ) : (
                          <></>
                        )}
                        {VendorOptions.map((vendor) => (
                          <>
                            <FormControlLabel
                              control={
                                <MUICheckbox
                                  sx={{ py: 0.5 }}
                                  onChange={(e) => {
                                    setVendors({
                                      ...vendors,
                                      [vendor._id]: e.target.checked,
                                    })
                                  }}
                                />
                              }
                              label={vendor.name}
                            />
                            {vendor.businessUnits.map((bu) =>
                              vendors[vendor._id] ? (
                                <>
                                  <FormControlLabel
                                    control={
                                      <MUICheckbox
                                        onChange={(e) => {
                                          if (e.target.checked) {
                                            state.clientUnitAuthority.businessUnits.push(
                                              bu._id
                                            )
                                          } else {
                                            const index =
                                              state.clientUnitAuthority.businessUnits.indexOf(
                                                bu._id
                                              )
                                            state.clientUnitAuthority.businessUnits.splice(
                                              index,
                                              1
                                            )
                                          }
                                        }}
                                        sx={{ ml: 2, py: 0 }}
                                      />
                                    }
                                    label={bu.name}
                                  />
                                  {state.clientUnitAuthority.businessUnits.includes(
                                    bu._id
                                  ) ? (
                                    bu.adminCountryIds.map((countryId) => {
                                      return (
                                        <FormControlLabel
                                          control={
                                            <MUICheckbox
                                              sx={{ py: 0, ml: 3.9 }}
                                              onChange={(e) => {
                                                if (
                                                  state.clientUnitAuthority
                                                    .countryPermissions[
                                                    bu._id
                                                  ] === undefined
                                                ) {
                                                  state.clientUnitAuthority.countryPermissions[
                                                    bu._id
                                                  ] = []
                                                }
                                                if (e.target.checked) {
                                                  state.clientUnitAuthority.countryPermissions[
                                                    bu._id
                                                  ]?.push(countryId)
                                                } else {
                                                  const index =
                                                    state.clientUnitAuthority.countryPermissions[
                                                      bu._id
                                                    ]?.indexOf(countryId)
                                                  state.clientUnitAuthority.countryPermissions[
                                                    bu._id
                                                  ]?.splice(index, 1)
                                                }
                                              }}
                                            />
                                          }
                                          label={country[countryId]}
                                        />
                                      )
                                    })
                                  ) : (
                                    <></>
                                  )}
                                </>
                              ) : (
                                <></>
                              )
                            )}
                          </>
                        ))}
                      </FormGroup>
                    </Stack>
                    <Button
                      fullWidth
                      variant="contained"
                      sx={{ mt: 2, mb: 4 }}
                      onClick={onClickAddAuthority}
                      disabled={
                        !state.clientUnitAuthority.clientId ||
                        state.clientUnitAuthority.businessUnits.length === 0
                      }
                    >
                      Add
                    </Button>
                    <InputLabel sx={{ mb: 2 }}>Authorized List</InputLabel>
                    <Box sx={{ overflow: 'auto' }}>
                      {userStore.form?.authority?.whitelist.map(
                        (_whitelist) => {
                          const onClickRemove = () => {
                            userStore.form.authority.whitelist = toJS(
                              userStore.form.authority.whitelist
                            ).filter(
                              (_wl) => _wl.clientId !== _whitelist.clientId
                            )
                          }

                          const onClickRemoveBU = (businessUnitId: string) => {
                            const whitelist =
                              userStore.form.authority.whitelist.find(
                                (_wl) => _wl.clientId === _whitelist.clientId
                              )
                            if (!whitelist) {
                              return
                            }
                            whitelist.businessUnits = toJS(
                              whitelist.businessUnits
                            ).filter((_bu) => _bu !== businessUnitId)
                            delete whitelist.countryPermissions[businessUnitId]
                          }
                          return (
                            <Box
                              sx={{
                                border: '1px solid #f2f2f2',
                                borderRadius: '10px',
                                padding: '13px',
                                mb: 2,
                                boxShadow:
                                  'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
                                position: 'relative',
                                overflowX: 'hidden',
                              }}
                            >
                              <Button
                                onClick={() => {
                                  setOpenDeleteDialogue(true)
                                }}
                                sx={{
                                  position: 'absolute',
                                  right: '-9px',
                                  top: '-4px',
                                  minWidth: '10px',
                                  width: '40px',
                                }}
                              >
                                <CancelRounded
                                  sx={{ color: palette.light.button.red }}
                                />
                              </Button>
                              <DeleteDialogue
                                open={openDeleteDialogue}
                                handleClose={() => {
                                  setOpenDeleteDialogue(false)
                                }}
                                onDelete={onClickRemove}
                                title={`Are you sure you want to delete "${
                                  props.clientUnits.find(
                                    (_clientUnit) =>
                                      _clientUnit._id === _whitelist.clientId
                                  )?.name || 'Client'
                                }"? `}
                                text={
                                  "This item will be deleted permanently. You can't undo this action."
                                }
                                yesText={'Remove'}
                                noText={'Cancel'}
                              />
                              <Box></Box>
                              <Box>
                                <InputLabel sx={{ mb: 2 }}>
                                  {props.clientUnits.find(
                                    (_clientUnit) =>
                                      _clientUnit._id === _whitelist.clientId
                                  )?.name || 'not found'}
                                </InputLabel>
                                {props.clientUnits
                                  .find(
                                    (_clientUnit) =>
                                      _clientUnit._id === _whitelist.clientId
                                  )
                                  ?.businessUnits.filter((_bu) =>
                                    _whitelist.businessUnits.includes(_bu._id)
                                  )
                                  .map((_bu) => (
                                    <>
                                      {_whitelist.countryPermissions !==
                                        undefined &&
                                      _whitelist.countryPermissions[
                                        _bu?._id
                                      ] !== undefined ? (
                                        <Tooltip
                                          title={`${_whitelist.countryPermissions[
                                            _bu._id
                                          ].map(
                                            (country: any) => countries[country]
                                          )}`}
                                          arrow
                                        >
                                          <Chip
                                            label={_bu.name}
                                            onDelete={() => {
                                              setOpenDeleteDialogue2({
                                                open: true,
                                                id: _bu._id,
                                                name: _bu.name,
                                              })
                                            }}
                                            sx={{ mr: 0.5, mb: 0.5 }}
                                          />
                                        </Tooltip>
                                      ) : (
                                        <Chip
                                          label={_bu.name}
                                          onDelete={() => {
                                            setOpenDeleteDialogue2({
                                              open: true,
                                              id: _bu._id,
                                              name: _bu.name,
                                            })
                                          }}
                                          sx={{ mr: 0.5, mb: 0.5 }}
                                        />
                                      )}
                                      <DeleteDialogue
                                        open={openDeleteDialogue2['open']}
                                        handleClose={() => {
                                          setOpenDeleteDialogue2({
                                            open: false,
                                            id: '',
                                            name: '',
                                          })
                                        }}
                                        onDelete={() =>
                                          onClickRemoveBU(
                                            openDeleteDialogue2['id']
                                          )
                                        }
                                        title={`Are you sure you want to delete "${openDeleteDialogue2['name']}"? `}
                                        text={
                                          "This item will be deleted permanently. You can't undo this action."
                                        }
                                        yesText={'Remove'}
                                        noText={'Cancel'}
                                      />
                                    </>
                                  ))}
                                {props.clientUnits
                                  .filter(
                                    (_clientUnit) =>
                                      _clientUnit.vendor === _whitelist.clientId
                                  )
                                  ?.map((clientUnit) => (
                                    <>
                                      {clientUnit.businessUnits
                                        .filter((_bu) =>
                                          _whitelist.businessUnits.includes(
                                            _bu._id
                                          )
                                        )
                                        .map((_bu) => (
                                          <>
                                            {_whitelist.countryPermissions[
                                              _bu._id
                                            ] !== undefined ? (
                                              <Tooltip
                                                title={`${_whitelist.countryPermissions[
                                                  _bu._id
                                                ]?.map(
                                                  (country: any) =>
                                                    countries[country]
                                                )}`}
                                                arrow
                                              >
                                                <Chip
                                                  label={`${clientUnit.name} - ${_bu.name}`}
                                                  onDelete={() => {
                                                    setOpenDeleteDialogue3({
                                                      open: true,
                                                      id: _bu._id,
                                                      name: _bu.name,
                                                    })
                                                  }}
                                                  sx={{ mr: 0.5, mb: 0.5 }}
                                                />
                                              </Tooltip>
                                            ) : (
                                              <Chip
                                                label={`${clientUnit.name} - ${_bu.name}`}
                                                onDelete={() => {
                                                  setOpenDeleteDialogue3({
                                                    open: true,
                                                    id: _bu._id,
                                                    name: _bu.name,
                                                  })
                                                }}
                                                sx={{ mr: 0.5, mb: 0.5 }}
                                              />
                                            )}
                                            <DeleteDialogue
                                              open={openDeleteDialogue3['open']}
                                              handleClose={() => {
                                                setOpenDeleteDialogue3({
                                                  open: false,
                                                  id: '',
                                                  name: '',
                                                })
                                              }}
                                              onDelete={() =>
                                                onClickRemoveBU(
                                                  openDeleteDialogue3['id']
                                                )
                                              }
                                              title={`Are you sure you want to delete "${clientUnit.name} - ${openDeleteDialogue3['name']}"? `}
                                              text={
                                                "This item will be deleted permanently. You can't undo this action."
                                              }
                                              yesText={'Remove'}
                                              noText={'Cancel'}
                                            />
                                          </>
                                        ))}
                                    </>
                                  ))}
                              </Box>
                            </Box>
                          )
                        }
                      )}
                    </Box>
                  </Box>
                </Card>
              </Box>
            ) : (
              <></>
            )
          )} */}
      </Paper>
    </DetailLayout>
  )
}
export default observer(EditUserView)
