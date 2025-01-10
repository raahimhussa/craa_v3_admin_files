import { AdminColumn, Type } from 'src/ui/core/components/DataGrid/DataGrid'
import {
  AppBar,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControlLabel,
  ListItemText,
  MenuItem,
  Modal,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
  Toolbar,
  Typography,
} from '@mui/material'
import { ResultsType, ResultsView } from 'src/utils/status'
import compose, { WrappingFunction } from '@shopify/react-compose'
import { observer, useLocalObservable } from 'mobx-react'
import { useEffect, useState } from 'react'

import CellButtons from '@components/cells/CellButtons/CellButtons'
import CellDetailButton from '@components/cells/CellDetailButton/CellDetailButton'
import { CellProps } from 'react-table'
import EditUser from '@components/forms/EditUser/EditUser'
import List from 'src/theme/overrides/List'
import Reporting from 'src/ui/pages/admin/Reporting/Reporting'
import Swal from 'sweetalert2'
import User from 'src/models/user'
import axios from 'axios'
import moment from 'moment'
import { useRootStore } from 'src/stores'
import { useSnackbar } from 'notistack'
import { withFind } from '@hocs'

const withColumns: WrappingFunction = (WrappedComponent) =>
  observer((props) => {
    const [clients, setClients] = useState<any>([])
    const [countries, setCountries] = useState<any>([])
    const [datas, setDatas] = useState<any>(props.data)
    const [open, setOpen] = useState<any>(false)
    const [doFunction, setDoFunction] = useState<any>()
    const { enqueueSnackbar } = useSnackbar()
    useEffect(() => {
      const params = {
        filter: {
          isDeleted: false,
        },
        options: {
          multi: true,
        },
      }
      // axios.get('/v1/clientUnits', { params }).then((res) => {
      //   setClients(res.data)
      // })
      axios.get('/v1/countries', { params }).then((res) => {
        setCountries(res.data)
      })
    }, [])

    const checkVendor = async (user: any, vendor: any, isCheck: any) => {
      try {
        // const params = {
        //   filter: {
        //     _id: user._id,
        //   },
        // }
        // const { data } = await axios.get('/v1/users', { params })
        let whitelist = user.whitelist.map((el: any) => el?.permission)
        let _datas = datas
        if (isCheck) {
          let countryPermissions: any = {}
          let businessUnits: any = []
          let simPermissions: any = {}
          vendor.businessUnits.map((bu: any) => {
            businessUnits.push(bu._id)
            countryPermissions[bu._id] = []
            simPermissions[bu._id] = {
              prehire: true,
              baseline: true,
              followup1: true,
              followup2: true,
              followup3: true,
              followup4: true,
              followup5: true,
            }
          })
          whitelist.push({
            clientId: vendor._id,
            businessUnits: businessUnits,
            countryPermissions: countryPermissions,
            simPermissions: simPermissions,
            resultsView: ResultsView.Always,
            resultsType: ResultsType.Full,
          })
        } else {
          const index = user.whitelist.findIndex(
            (el: any) => el.clientUnits?._id === vendor._id
          )
          whitelist.splice(index, 1)
        }
        const i = _datas.findIndex((el: any) => el._id === user._id)

        for (let index = 0; index < _datas[i]?.whitelist?.length; index++) {
          _datas[i].whitelist[index].permission = whitelist[index]
        }
        setDatas([..._datas])
        axios
          .patch('/v1/users', {
            filter: {
              _id: user._id,
            },
            update: {
              'authority.whitelist': whitelist,
            },
          })
          .then((res) => {
            // enqueueSnackbar('Permission changed.', {
            //   variant: 'success',
            // })
            Swal.fire({
              html: 'Permission changed.',
              showConfirmButton: false,
            })
          })
      } catch (error) {
        console.log(error)
        enqueueSnackbar('Please try again later.', {
          variant: 'error',
        })
      }
    }
    const checkBU = async (
      user: any,
      clientId: any,
      buId: any,
      isCheck: any
    ) => {
      try {
        // const params = {
        //   filter: {
        //     _id: user._id,
        //   },
        // }
        let _datas = datas
        // const { data } = await axios.get('/v1/users', { params })
        let whitelist = user?.whitelist?.map((el: any) => el.permission)
        whitelist.forEach((list: any) => {
          if (list.clientId === clientId) {
            if (isCheck) {
              if (!list.businessUnits.includes(buId)) {
                list.businessUnits.push(buId)
              }
              if (list.simPermissions === undefined) {
                list.simPermissions = {}
              }
              if (list.countryPermissions === undefined) {
                list.countryPermissions = {}
              }
              list.countryPermissions[buId] = []
              list.simPermissions[buId] = {
                prehire: true,
                baseline: true,
                followup1: true,
                followup2: true,
                followup3: true,
                followup4: true,
                followup5: true,
              }
            } else {
              const index = list.businessUnits.indexOf(buId)
              list.businessUnits.splice(index, 1)
              delete list.countryPermissions[buId]
              if (list.simPermissions !== undefined) {
                delete list.simPermissions[buId]
              }
            }
            return false
          }
        })
        const i = _datas.findIndex((el: any) => el._id === user._id)

        for (let index = 0; index < _datas[i]?.whitelist?.length; index++) {
          _datas[i].whitelist[index].permission = whitelist[index]
        }
        setDatas([..._datas])
        axios
          .patch('/v1/users', {
            filter: {
              _id: user._id,
            },
            update: {
              'authority.whitelist': whitelist,
            },
          })
          .then((res) => {
            // enqueueSnackbar('Permission changed.', {
            //   variant: 'success',
            // })
            Swal.fire({
              html: 'Permission changed.',
              showConfirmButton: false,
            })
          })
      } catch (error) {
        console.log(error)
        enqueueSnackbar('Please try again later.', {
          variant: 'error',
        })
      }
    }
    const checkCountry = async (
      user: any,
      clientId: any,
      buId: any,
      countryIds: any
    ) => {
      try {
        // const params = {
        //   filter: {
        //     _id: user._id,
        //   },
        // }
        let _datas = datas
        // const { data } = await axios.get('/v1/users', { params })
        let whitelist = user?.whitelist?.map((el: any) => el.permission)
        whitelist.forEach((list: any) => {
          if (list.clientId === clientId) {
            list.countryPermissions[buId] = countryIds
            return false
          }
        })
        const i = _datas.findIndex((el: any) => el._id === user._id)

        for (let index = 0; index < _datas[i]?.whitelist?.length; index++) {
          _datas[i].whitelist[index].permission = whitelist[index]
        }
        setDatas([..._datas])
        axios
          .patch('/v1/users', {
            filter: {
              _id: user._id,
            },
            update: {
              'authority.whitelist': whitelist,
            },
          })
          .then((res) => {
            // enqueueSnackbar('Permission changed.', {
            //   variant: 'success',
            // })
            Swal.fire({
              html: 'Permission changed.',
              showConfirmButton: false,
            })
          })
      } catch (error) {
        console.log(error)
        enqueueSnackbar('Please try again later.', {
          variant: 'error',
        })
      }
    }
    const checkSim = async (
      user: any,
      clientId: any,
      buId: any,
      sim: any,
      isCheck: any
    ) => {
      try {
        // const params = {
        //   filter: {
        //     _id: user._id,
        //   },
        // }
        let _datas = datas
        // const { data } = await axios.get('/v1/users', { params })
        let whitelist = user?.whitelist?.map((el: any) => el.permission)
        whitelist.forEach((list: any) => {
          if (list.clientId === clientId) {
            if (isCheck) {
              if (list.simPermissions === undefined) {
                list.simPermissions = {}
              }
              list.simPermissions[buId][sim] = true
            } else {
              if (list.simPermissions !== undefined) {
                list.simPermissions[buId][sim] = false
              }
            }
            return false
          }
        })
        const i = _datas.findIndex((el: any) => el._id === user._id)

        for (let index = 0; index < _datas[i]?.whitelist?.length; index++) {
          _datas[i].whitelist[index].permission = whitelist[index]
        }
        setDatas([..._datas])
        axios
          .patch('/v1/users', {
            filter: {
              _id: user._id,
            },
            update: {
              'authority.whitelist': whitelist,
            },
          })
          .then((res) => {
            // enqueueSnackbar('Permission changed.', {
            //   variant: 'success',
            // })
            Swal.fire({
              html: 'Permission changed.',
              showConfirmButton: false,
            })
          })
      } catch (error) {
        console.log(error)
        enqueueSnackbar('Please try again later.', {
          variant: 'error',
        })
      }
    }
    const checkResultView = async (user: any, clientId: any, value: any) => {
      try {
        // const params = {
        //   filter: {
        //     _id: user._id,
        //   },
        // }
        // let _datas = datas
        // const { data } = await axios.get('/v1/users', { params })
        let whitelist = user?.whitelist?.map((el: any) => el?.permission)
        whitelist.forEach((list: any) => {
          if (list.clientId === clientId) {
            list.resultsView = value
            return false
          }
        })
        // _datas[
        //   _datas.findIndex((el: any) => el._id === user._id)
        // ].authority.whitelist = whitelist
        // setDatas([..._datas])
        axios
          .patch('/v1/users', {
            filter: {
              _id: user._id,
            },
            update: {
              'authority.whitelist': whitelist,
            },
          })
          .then((res) => {
            // enqueueSnackbar('Permission changed.', {
            //   variant: 'success',
            // })
            Swal.fire({
              html: 'Permission changed.',
              showConfirmButton: false,
            })
          })
      } catch (error) {
        enqueueSnackbar('Please try again later.', {
          variant: 'error',
        })
      }
    }
    const checkResultType = async (user: any, clientId: any, value: any) => {
      try {
        // const params = {
        //   filter: {
        //     _id: user._id,
        //   },
        // }
        // let _datas = datas
        // const { data } = await axios.get('/v1/users', { params })
        let whitelist = user?.whitelist?.map((el: any) => el.permission)
        whitelist.forEach((list: any) => {
          if (list.clientId === clientId) {
            list.resultsType = value
            return false
          }
        })
        // _datas[
        //   _datas.findIndex((el: any) => el._id === user._id)
        // ].authority.whitelist = whitelist
        // setDatas([..._datas])
        axios
          .patch('/v1/users', {
            filter: {
              _id: user._id,
            },
            update: {
              'authority.whitelist': whitelist,
            },
          })
          .then((res) => {
            // enqueueSnackbar('Permission changed.', {
            //   variant: 'success',
            // })
            Swal.fire({
              html: 'Permission changed.',
              showConfirmButton: false,
            })
          })
      } catch (error) {
        enqueueSnackbar('Please try again later.', {
          variant: 'error',
        })
      }
    }
    const checkNotification = async (
      user: any,
      clientId: any,
      value: any,
      type: string
    ) => {
      try {
        // const params = {
        //   filter: {
        //     _id: user._id,
        //   },
        // }
        // let _datas = datas
        // const { data } = await axios.get('/v1/users', { params })
        let whitelist = user?.whitelist?.map((el: any) => el.permission)
        whitelist.forEach((list: any) => {
          if (list.clientId === clientId) {
            if (type === 'publish') {
              list.publishNotification = value
            } else {
              list.distributionNotification = value
            }
            return false
          }
        })
        // _datas[
        //   _datas.findIndex((el: any) => el._id === user._id)
        // ].authority.whitelist = whitelist
        // setDatas([..._datas])
        axios
          .patch('/v1/users', {
            filter: {
              _id: user._id,
            },
            update: {
              'authority.whitelist': whitelist,
            },
          })
          .then((res) => {
            // enqueueSnackbar('Permission changed.', {
            //   variant: 'success',
            // })
            Swal.fire({
              html: 'Permission changed.',
              showConfirmButton: false,
            })
          })
      } catch (error) {
        enqueueSnackbar('Please try again later.', {
          variant: 'error',
        })
      }
    }

    const highlightedText = (text: any, query: any) => {
      if (query !== '' && text?.toString()?.toLowerCase()?.includes(query)) {
        const parts =
          text?.toString()?.split(new RegExp(`(${query})`, 'gi')) || []

        return (
          <>
            {parts.map((part: any, index: any) =>
              part.toLowerCase() === query.toLowerCase() ? (
                <mark key={index}>{part}</mark>
              ) : (
                part
              )
            )}
          </>
        )
      }

      return text
    }

    const columns: Array<AdminColumn> = [
      {
        Header: 'Role',
        accessor: 'role.title',
        type: Type.String,
        width: 550,
        Cell: (cellProps: any) => {
          return cellProps.value !== undefined
            ? highlightedText(
                cellProps.value,
                props?.params?.options?.fields?.searchString || ''
              )
            : ''
        },
      },
      {
        Header: 'First Name',
        accessor: 'profile.firstName',
        type: Type.String,
        width: 550,
        Cell: (cellProps: any) => {
          return cellProps.value !== undefined
            ? highlightedText(
                cellProps.value,
                props?.params?.options?.fields?.searchString || ''
              )
            : ''
        },
      },
      {
        Header: 'Last Name',
        accessor: 'profile.lastName',
        type: Type.String,
        width: 550,
        Cell: (cellProps: any) => {
          return cellProps.value !== undefined
            ? highlightedText(
                cellProps.value,
                props?.params?.options?.fields?.searchString || ''
              )
            : ''
        },
      },
      {
        Header: `Pfizer Vendor Admin`,
        accessor: 'pfizerAdmin',
        type: Type.String,
        width: 10,
        Cell: observer((cellProps: CellProps<User>) => {
          return (
            <FormControlLabel
              className="small-check"
              control={
                <Checkbox
                  sx={{ py: 0.2 }}
                  defaultChecked={cellProps.row.original.authority?.pfizerAdmin}
                  onChange={(e) => {
                    try {
                      axios
                        .patch('/v1/users', {
                          filter: {
                            _id: cellProps.row.original._id,
                          },
                          update: {
                            'authority.pfizerAdmin': e.target.checked,
                          },
                        })
                        .then((res) => {
                          // enqueueSnackbar('Permission changed.', {
                          //   variant: 'success',
                          // })
                          Swal.fire({
                            html: 'Permission changed.',
                            showConfirmButton: false,
                          })
                        })
                    } catch (error) {
                      enqueueSnackbar('Please try again later.', {
                        variant: 'error',
                      })
                    }
                  }}
                />
              }
              label={''}
            />
          )
        }),
      },
      {
        Header: 'Clients',
        accessor: 'Vendors',
        type: Type.String,
        width: 550,
        Cell: observer((cellProps: CellProps<User>) => {
          return (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                py: 1,
              }}
            >
              {cellProps.row.original.whitelist?.map((list: any, i: any) => {
                const client = list.clientUnits
                // const data = datas.find(
                //   (user: any) => user._id === cellProps.row.original._id
                // )?.authority?.whitelist
                return (
                  <>
                    {client !== undefined ? (
                      <FormControlLabel
                        className="small-check"
                        control={
                          // <Checkbox
                          //   sx={{ py: 0.2 }}
                          //   defaultChecked={
                          //     cellProps.row.original.whitelist?.findIndex(
                          //       (el: any) => el.clientUnits?._id === client?._id
                          //     ) !== -1 &&
                          //     cellProps.row.original.whitelist?.findIndex(
                          //       (el: any) => el.clientUnits?._id === client?._id
                          //     ) !== undefined
                          //   }
                          //   onChange={(e) => {
                          //     const check = e.target.checked
                          //     Swal.fire({
                          //       html: 'Changing the permission..',
                          //       html: 'Please wait.',
                          //       timerProgressBar: true,
                          //       showConfirmButton: false,
                          //       didOpen: () => {
                          //         Swal.showLoading()
                          //       },
                          //     })
                          //     setTimeout(() => {
                          //       checkVendor(
                          //         cellProps.row.original,
                          //         client,
                          //         check
                          //       )
                          //     }, 1000)
                          //   }}
                          // />
                          <></>
                        }
                        label={client?.name}
                      />
                    ) : (
                      <CircularProgress
                        sx={{
                          width: '15px !important',
                          height: '15px !important',
                        }}
                      />
                    )}
                    {client?.businessUnits?.map((el: any, index: any) => (
                      <FormControlLabel
                        sx={{
                          visibility: 'hidden',
                          display: index === 0 ? 'none' : 'block',
                        }}
                        className="small-check"
                        control={
                          <Checkbox sx={{ py: 0.2 }} onChange={(e) => {}} />
                        }
                        label={el.name}
                      />
                    ))}
                    {i !==
                    clients.filter(
                      (_client: any) =>
                        _client._id !== undefined && _client._id === client?._id
                    )?.length -
                      1 ? (
                      <Divider sx={{ my: 0.3 }} />
                    ) : (
                      <></>
                    )}
                  </>
                )
              })}
            </Box>
          )
        }),
      },
      {
        Header: `Publish Notification`,
        accessor: 'role',
        type: Type.String,
        width: 10,
        Cell: observer((cellProps: CellProps<User>) => {
          const state = useLocalObservable(() => ({
            isOpen: false,
          }))

          return (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                py: 1,
              }}
            >
              {cellProps.row.original.whitelist?.map((list: any, i: any) => {
                const client = list.clientUnits
                const data = cellProps.row.original?.whitelist
                return (
                  <>
                    {client !== undefined ? (
                      <FormControlLabel
                        className="small-check"
                        control={
                          <Checkbox
                            sx={{ py: 0.2 }}
                            defaultChecked={
                              data?.find(
                                (el: any) => el.clientUnits?._id === client?._id
                              )?.permission?.publishNotification
                            }
                            onChange={(e) => {
                              Swal.fire({
                                title: 'Changing the permission..',
                                html: 'Please wait.',
                                timerProgressBar: true,
                                showConfirmButton: false,
                                didOpen: () => {
                                  Swal.showLoading()
                                },
                                allowOutsideClick: false,
                              })
                              checkNotification(
                                cellProps.row.original,
                                client._id,
                                e.target.checked,
                                'publish'
                              )
                            }}
                          />
                        }
                        label={''}
                      />
                    ) : (
                      <CircularProgress
                        sx={{
                          width: '15px !important',
                          height: '15px !important',
                        }}
                      />
                    )}
                    {client?.businessUnits?.map((el: any, index: any) => (
                      <FormControlLabel
                        sx={{
                          visibility: 'hidden',
                          display: index === 0 ? 'none' : 'block',
                        }}
                        className="small-check"
                        control={
                          <Checkbox sx={{ py: 0.2 }} onChange={(e) => {}} />
                        }
                        label={el.name}
                      />
                    ))}
                    {i !==
                    clients.filter(
                      (_client: any) =>
                        _client.vendor !== '' && _client.vendor === client?._id
                    )?.length -
                      1 ? (
                      <Divider sx={{ my: 0.3 }} />
                    ) : (
                      <></>
                    )}
                  </>
                )
              })}
            </Box>
          )
        }),
      },
      {
        Header: 'Distribution Notification',
        accessor: 'roleId',
        type: Type.String,
        width: 10,
        Cell: observer((cellProps: CellProps<User>) => {
          const {
            uiState: { modal },
          } = useRootStore()
          const state = useLocalObservable(() => ({
            isOpen: false,
          }))

          return (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                py: 1,
              }}
            >
              {cellProps.row.original.whitelist?.map((list: any, i: any) => {
                const client = list.clientUnits
                const data = cellProps.row.original?.whitelist
                return (
                  <>
                    {client !== undefined ? (
                      <FormControlLabel
                        className="small-check"
                        control={
                          <Checkbox
                            sx={{ py: 0.2 }}
                            defaultChecked={
                              data?.find(
                                (el: any) => el.clientUnits?._id === client?._id
                              )?.clientUnits?.distributionNotification
                            }
                            onChange={(e) => {
                              Swal.fire({
                                title: 'Changing the permission..',
                                html: 'Please wait.',
                                timerProgressBar: true,
                                showConfirmButton: false,
                                didOpen: () => {
                                  Swal.showLoading()
                                },
                                allowOutsideClick: false,
                              })
                              checkNotification(
                                cellProps.row.original,
                                client._id,
                                e.target.checked,
                                'distribution'
                              )
                            }}
                          />
                        }
                        label={''}
                      />
                    ) : (
                      <CircularProgress
                        sx={{
                          width: '15px !important',
                          height: '15px !important',
                        }}
                      />
                    )}
                    {client?.businessUnits?.map((el: any, index: any) => (
                      <FormControlLabel
                        sx={{
                          visibility: 'hidden',
                          display: index === 0 ? 'none' : 'block',
                        }}
                        className="small-check"
                        control={
                          <Checkbox sx={{ py: 0.2 }} onChange={(e) => {}} />
                        }
                        label={el.name}
                      />
                    ))}
                    {i !==
                    clients.filter(
                      (_client: any) =>
                        _client.vendor !== '' && _client.vendor === client?._id
                    )?.length -
                      1 ? (
                      <Divider sx={{ my: 0.3 }} />
                    ) : (
                      <></>
                    )}
                  </>
                )
              })}
            </Box>
          )
        }),
      },

      {
        Header: 'Results View',
        accessor: 'Results',
        type: Type.String,
        width: 550,
        Cell: observer((cellProps: CellProps<User>) => {
          return (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                py: 1,
              }}
            >
              {cellProps.row.original.whitelist?.map((list: any, i: any) => {
                const client = list.clientUnits
                // const data = datas.find(
                //   (user: any) => user._id === cellProps.row.original._id
                // )?.authority?.whitelist
                return (
                  <>
                    <RadioGroup
                      aria-labelledby="demo-radio-buttons-group-label"
                      name="radio-buttons-group"
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'unset',
                      }}
                      defaultValue={
                        cellProps.row.original.whitelist?.find(
                          (el: any) => el.clientUnits?._id === client?._id
                        )?.permission?.resultsView
                      }
                      // value={
                      //   cellProps.row.original.whitelist?.find((el: any) => el.clientUnits?._id === client?._id)
                      //     ?.resultsView
                      // }
                      onChange={(e) => {
                        Swal.fire({
                          title: 'Changing the permission..',
                          html: 'Please wait.',
                          timerProgressBar: true,
                          showConfirmButton: false,
                          didOpen: () => {
                            Swal.showLoading()
                          },
                          allowOutsideClick: false,
                        })
                        checkResultView(
                          cellProps.row.original,
                          client._id,
                          e.target.value
                        )
                      }}
                    >
                      <FormControlLabel
                        className="small-check"
                        value={ResultsView.Always}
                        control={<Radio sx={{ py: 0 }} />}
                        label="Always"
                        disabled={
                          cellProps.row.original.whitelist?.findIndex(
                            (el: any) => el.clientUnits?._id === client?._id
                          ) === -1 ||
                          cellProps.row.original.whitelist?.findIndex(
                            (el: any) => el.clientUnits?._id === client?._id
                          ) === undefined
                        }
                      />
                      <FormControlLabel
                        className="small-check"
                        value={ResultsView.AfterDistribution}
                        control={<Radio sx={{ py: 0 }} />}
                        label="After Distribution"
                        disabled={
                          cellProps.row.original.whitelist?.findIndex(
                            (el: any) => el.clientUnits?._id === client?._id
                          ) === -1 ||
                          cellProps.row.original.whitelist?.findIndex(
                            (el: any) => el.clientUnits?._id === client?._id
                          ) === undefined
                        }
                      />
                    </RadioGroup>
                    {client?.businessUnits?.map((el: any, index: any) => (
                      <FormControlLabel
                        sx={{
                          visibility: 'hidden',
                          display: index === 0 ? 'none' : 'block',
                        }}
                        className="small-check"
                        control={
                          <Checkbox sx={{ py: 0.2 }} onChange={(e) => {}} />
                        }
                        label={el.name}
                      />
                    ))}
                    {i !==
                    clients.filter(
                      (_client: any) =>
                        _client.vendor !== '' && _client.vendor === client._id
                    )?.length -
                      1 ? (
                      <Divider sx={{ my: 0.3 }} />
                    ) : (
                      <></>
                    )}
                  </>
                )
              })}
            </Box>
          )
        }),
      },
      {
        Header: 'Results Type',
        accessor: 'Results Type',
        type: Type.String,
        width: 550,
        Cell: observer((cellProps: CellProps<User>) => {
          return (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                py: 1,
              }}
            >
              {cellProps.row.original.whitelist?.map((list: any, i: any) => {
                const client = list.clientUnits
                const data = cellProps.row.original?.whitelist
                return (
                  <>
                    <RadioGroup
                      aria-labelledby="demo-radio-buttons-group-label"
                      name="radio-buttons-group"
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'unset',
                      }}
                      defaultValue={
                        cellProps.row.original.whitelist?.find(
                          (el: any) => el.clientUnits?._id === client?._id
                        )?.permission?.resultsType
                      }
                      onChange={(e) => {
                        Swal.fire({
                          title: 'Changing the permission..',
                          html: 'Please wait.',
                          timerProgressBar: true,
                          showConfirmButton: false,
                          didOpen: () => {
                            Swal.showLoading()
                          },
                          allowOutsideClick: false,
                        })
                        checkResultType(
                          cellProps.row.original,
                          client._id,
                          e.target.value
                        )
                      }}
                    >
                      <FormControlLabel
                        className="small-check"
                        value={ResultsType.Full}
                        control={<Radio sx={{ py: 0 }} />}
                        label="Full"
                        disabled={
                          data?.findIndex(
                            (el: any) => el.clientUnits?._id === client?._id
                          ) === -1 ||
                          data?.findIndex(
                            (el: any) => el.clientUnits?._id === client?._id
                          ) === undefined
                        }
                      />
                      <FormControlLabel
                        className="small-check"
                        value={ResultsType.Annotated}
                        control={<Radio sx={{ py: 0 }} />}
                        label="Annotated"
                        disabled={
                          data?.findIndex(
                            (el: any) => el.clientUnits?._id === client?._id
                          ) === -1 ||
                          data?.findIndex(
                            (el: any) => el.clientUnits?._id === client?._id
                          ) === undefined
                        }
                      />
                    </RadioGroup>
                    {client?.businessUnits?.map((el: any, index: any) => (
                      <FormControlLabel
                        sx={{
                          visibility: 'hidden',
                          display: index === 0 ? 'none' : 'block',
                        }}
                        className="small-check"
                        control={
                          <Checkbox sx={{ py: 0.2 }} onChange={(e) => {}} />
                        }
                        label={el.name}
                      />
                    ))}
                    {i !==
                    clients.filter(
                      (_client: any) =>
                        _client.vendor !== '' && _client.vendor === client?._id
                    )?.length -
                      1 ? (
                      <Divider sx={{ my: 0.3 }} />
                    ) : (
                      <></>
                    )}
                  </>
                )
              })}
            </Box>
          )
        }),
      },
      {
        Header: 'BU',
        accessor: 'roled',
        type: Type.String,
        width: 550,
        Cell: observer((cellProps: CellProps<User>) => {
          return (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                py: 1,
              }}
            >
              {cellProps.row.original.whitelist?.map((list: any, i: any) => {
                const client = list.clientUnits
                if (client !== undefined) {
                  return (
                    <>
                      {client?.businessUnits?.length === 0 ? (
                        <>
                          <FormControlLabel
                            className="small-check"
                            control={
                              <Checkbox
                                sx={{ py: 0.2, visibility: 'hidden' }}
                              />
                            }
                            label={''}
                          />
                          <Divider sx={{ my: 0.3 }} />
                        </>
                      ) : (
                        client?.businessUnits?.map((el: any, index: any) => {
                          const data = cellProps.row.original?.whitelist
                          return (
                            <>
                              <FormControlLabel
                                className="small-check"
                                control={
                                  <Checkbox
                                    sx={{ py: 0.2 }}
                                    checked={data
                                      ?.find(
                                        (el: any) =>
                                          el.clientUnits?._id === client?._id
                                      )
                                      ?.permission?.businessUnits?.includes(
                                        el._id
                                      )}
                                    disabled={
                                      data?.findIndex(
                                        (el: any) =>
                                          el.clientUnits?._id === client?._id
                                      ) === -1 ||
                                      data?.findIndex(
                                        (el: any) =>
                                          el.clientUnits?._id === client?._id
                                      ) === undefined
                                    }
                                    onChange={(e) => {
                                      const check = e.target.checked
                                      Swal.fire({
                                        title: 'Changing the permission..',
                                        html: 'Please wait.',
                                        timerProgressBar: true,
                                        showConfirmButton: false,
                                        didOpen: () => {
                                          Swal.showLoading()
                                        },
                                        allowOutsideClick: false,
                                      })
                                      setTimeout(() => {
                                        checkBU(
                                          cellProps.row.original,
                                          client?._id,
                                          el._id,
                                          check
                                        )
                                      }, 1000)
                                    }}
                                  />
                                }
                                label={el.name}
                              />

                              {index === client?.businessUnits.length - 1 &&
                              i !==
                                clients.filter(
                                  (_client: any) =>
                                    _client._id !== undefined &&
                                    _client._id === client?._id
                                )?.length -
                                  1 ? (
                                <Divider sx={{ my: 0.3 }} />
                              ) : (
                                <></>
                              )}
                            </>
                          )
                        })
                      )}
                    </>
                  )
                } else {
                  return (
                    <CircularProgress
                      sx={{
                        width: '15px !important',
                        height: '15px !important',
                      }}
                    />
                  )
                }
              })}
            </Box>
          )
        }),
      },
      {
        Header: 'P',
        accessor: 'p',
        type: Type.String,
        width: 1,
        Cell: observer((cellProps: CellProps<User>) => {
          const state = useLocalObservable(() => ({
            isOpen: false,
          }))

          return (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                py: 1,
              }}
            >
              {cellProps.row.original.whitelist?.map((list: any, i: any) => {
                const client = list.clientUnits
                return (
                  <>
                    {client !== undefined ? (
                      <>
                        {client?.businessUnits?.length === 0 ? (
                          <>
                            <FormControlLabel
                              className="small-check"
                              control={
                                <Checkbox
                                  sx={{ py: 0.2, visibility: 'hidden' }}
                                />
                              }
                              label={''}
                            />
                            <Divider sx={{ my: 0.3 }} />
                          </>
                        ) : (
                          client?.businessUnits?.map((el: any, index: any) => {
                            // const data =
                            //   cellProps.row.original?.whitelist?.find(
                            //     (el: any) => el.clientUnits._id === client?._id
                            //   )?.permission
                            const data = datas
                              .find(
                                (user: any) =>
                                  user._id === cellProps.row.original._id
                              )
                              ?.whitelist?.find(
                                (el: any) => el.clientUnits._id === client?._id
                              ).permission
                            return (
                              <>
                                <FormControlLabel
                                  className="small-check"
                                  control={
                                    <Checkbox
                                      sx={{ py: 0.2 }}
                                      checked={
                                        data?.simPermissions !== undefined &&
                                        data?.simPermissions[el._id] &&
                                        data?.simPermissions[el._id]['prehire']
                                      }
                                      disabled={
                                        data?.simPermissions == undefined ||
                                        data?.simPermissions[el._id] ===
                                          undefined
                                      }
                                      onChange={(e) => {
                                        const check = e.target.checked
                                        Swal.fire({
                                          title: 'Changing the permission..',
                                          html: 'Please wait.',
                                          timerProgressBar: true,
                                          showConfirmButton: false,
                                          didOpen: () => {
                                            Swal.showLoading()
                                          },
                                          allowOutsideClick: false,
                                        })
                                        setTimeout(() => {
                                          checkSim(
                                            cellProps.row.original,
                                            client?._id,
                                            el._id,
                                            'prehire',
                                            check
                                          )
                                        }, 1000)
                                      }}
                                    />
                                  }
                                  label={''}
                                />
                                {index === client?.businessUnits.length - 1 &&
                                i !==
                                  clients.filter(
                                    (_client: any) =>
                                      _client._id !== undefined &&
                                      _client._id === list?.clientId
                                  )?.length -
                                    1 ? (
                                  <Divider sx={{ my: 0.3 }} />
                                ) : (
                                  <></>
                                )}
                              </>
                            )
                          })
                        )}
                      </>
                    ) : (
                      <CircularProgress
                        sx={{
                          width: '15px !important',
                          height: '15px !important',
                        }}
                      />
                    )}
                  </>
                )
              })}
            </Box>
          )
        }),
      },
      {
        Header: 'B',
        accessor: 'r',
        type: Type.String,
        width: 1,
        Cell: observer((cellProps: CellProps<User>) => {
          const state = useLocalObservable(() => ({
            isOpen: false,
          }))

          return (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                py: 1,
              }}
            >
              {cellProps.row.original.whitelist?.map((list: any, i: any) => {
                const client = list.clientUnits
                return (
                  <>
                    {client !== undefined ? (
                      <>
                        {client?.businessUnits?.length === 0 ? (
                          <>
                            <FormControlLabel
                              className="small-check"
                              control={
                                <Checkbox
                                  sx={{ py: 0.2, visibility: 'hidden' }}
                                />
                              }
                              label={''}
                            />
                            <Divider sx={{ my: 0.3 }} />
                          </>
                        ) : (
                          client?.businessUnits?.map((el: any, index: any) => {
                            const data = datas
                              .find(
                                (user: any) =>
                                  user._id === cellProps.row.original._id
                              )
                              ?.whitelist?.find(
                                (el: any) => el.clientUnits._id === client?._id
                              ).permission
                            return (
                              <>
                                <FormControlLabel
                                  className="small-check"
                                  control={
                                    <Checkbox
                                      sx={{ py: 0.2 }}
                                      checked={
                                        data?.simPermissions !== undefined &&
                                        data?.simPermissions[el._id] &&
                                        data?.simPermissions[el._id]['baseline']
                                      }
                                      disabled={
                                        data?.simPermissions == undefined ||
                                        data?.simPermissions[el._id] ===
                                          undefined
                                      }
                                      onChange={(e) => {
                                        const check = e.target.checked
                                        Swal.fire({
                                          title: 'Changing the permission..',
                                          html: 'Please wait.',
                                          timerProgressBar: true,
                                          showConfirmButton: false,
                                          didOpen: () => {
                                            Swal.showLoading()
                                          },
                                          allowOutsideClick: false,
                                        })
                                        setTimeout(() => {
                                          checkSim(
                                            cellProps.row.original,
                                            client?._id,
                                            el._id,
                                            'baseline',
                                            check
                                          )
                                        }, 1000)
                                      }}
                                    />
                                  }
                                  label={''}
                                />
                                {index === client?.businessUnits.length - 1 &&
                                i !==
                                  clients.filter(
                                    (_client: any) =>
                                      _client._id !== undefined &&
                                      _client._id === list?.clientId
                                  )?.length -
                                    1 ? (
                                  <Divider sx={{ my: 0.3 }} />
                                ) : (
                                  <></>
                                )}
                              </>
                            )
                          })
                        )}
                      </>
                    ) : (
                      <CircularProgress
                        sx={{
                          width: '15px !important',
                          height: '15px !important',
                        }}
                      />
                    )}
                  </>
                )
              })}
            </Box>
          )
        }),
      },
      {
        Header: 'F1',
        accessor: 'f1',
        type: Type.String,
        width: 1,
        Cell: observer((cellProps: CellProps<User>) => {
          const {
            uiState: { modal },
          } = useRootStore()
          const state = useLocalObservable(() => ({
            isOpen: false,
          }))

          return (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                py: 1,
              }}
            >
              {cellProps.row.original.whitelist?.map((list: any, i: any) => {
                const client = list.clientUnits
                return (
                  <>
                    {client !== undefined ? (
                      <>
                        {client?.businessUnits?.length === 0 ? (
                          <>
                            <FormControlLabel
                              className="small-check"
                              control={
                                <Checkbox
                                  sx={{ py: 0.2, visibility: 'hidden' }}
                                />
                              }
                              label={''}
                            />
                            <Divider sx={{ my: 0.3 }} />
                          </>
                        ) : (
                          client?.businessUnits?.map((el: any, index: any) => {
                            const data = datas
                              .find(
                                (user: any) =>
                                  user._id === cellProps.row.original._id
                              )
                              ?.whitelist?.find(
                                (el: any) => el.clientUnits._id === client?._id
                              ).permission
                            return (
                              <>
                                <FormControlLabel
                                  className="small-check"
                                  control={
                                    <Checkbox
                                      sx={{ py: 0.2 }}
                                      checked={
                                        data?.simPermissions !== undefined &&
                                        data?.simPermissions[el._id] &&
                                        data?.simPermissions[el._id][
                                          'followup1'
                                        ]
                                      }
                                      disabled={
                                        data?.simPermissions == undefined ||
                                        data?.simPermissions[el._id] ===
                                          undefined
                                      }
                                      onChange={(e) => {
                                        const check = e.target.checked
                                        Swal.fire({
                                          title: 'Changing the permission..',
                                          html: 'Please wait.',
                                          timerProgressBar: true,
                                          showConfirmButton: false,
                                          didOpen: () => {
                                            Swal.showLoading()
                                          },
                                          allowOutsideClick: false,
                                        })
                                        setTimeout(() => {
                                          checkSim(
                                            cellProps.row.original,
                                            client?._id,
                                            el._id,
                                            'followup1',
                                            check
                                          )
                                        }, 1000)
                                      }}
                                    />
                                  }
                                  label={''}
                                />
                                {index === client?.businessUnits.length - 1 &&
                                i !==
                                  clients.filter(
                                    (_client: any) =>
                                      _client._id !== undefined &&
                                      _client._id === list?.clientId
                                  )?.length -
                                    1 ? (
                                  <Divider sx={{ my: 0.3 }} />
                                ) : (
                                  <></>
                                )}
                              </>
                            )
                          })
                        )}
                      </>
                    ) : (
                      <CircularProgress
                        sx={{
                          width: '15px !important',
                          height: '15px !important',
                        }}
                      />
                    )}
                  </>
                )
              })}
            </Box>
          )
        }),
      },
      {
        Header: 'F2',
        accessor: 'f2',
        type: Type.String,
        width: 1,
        Cell: observer((cellProps: CellProps<User>) => {
          const {
            uiState: { modal },
          } = useRootStore()
          const state = useLocalObservable(() => ({
            isOpen: false,
          }))

          return (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                py: 1,
              }}
            >
              {cellProps.row.original.whitelist?.map((list: any, i: any) => {
                const client = list.clientUnits
                return (
                  <>
                    {client !== undefined ? (
                      <>
                        {client?.businessUnits?.length === 0 ? (
                          <>
                            <FormControlLabel
                              className="small-check"
                              control={
                                <Checkbox
                                  sx={{ py: 0.2, visibility: 'hidden' }}
                                />
                              }
                              label={''}
                            />
                            <Divider sx={{ my: 0.3 }} />
                          </>
                        ) : (
                          client?.businessUnits?.map((el: any, index: any) => {
                            const data = datas
                              .find(
                                (user: any) =>
                                  user._id === cellProps.row.original._id
                              )
                              ?.whitelist?.find(
                                (el: any) => el.clientUnits._id === client?._id
                              ).permission
                            return (
                              <>
                                <FormControlLabel
                                  className="small-check"
                                  control={
                                    <Checkbox
                                      sx={{ py: 0.2 }}
                                      checked={
                                        data?.simPermissions !== undefined &&
                                        data?.simPermissions[el._id] &&
                                        data?.simPermissions[el._id][
                                          'followup2'
                                        ]
                                      }
                                      disabled={
                                        data?.simPermissions == undefined ||
                                        data?.simPermissions[el._id] ===
                                          undefined
                                      }
                                      onChange={(e) => {
                                        const check = e.target.checked
                                        Swal.fire({
                                          title: 'Changing the permission..',
                                          html: 'Please wait.',
                                          timerProgressBar: true,
                                          showConfirmButton: false,
                                          didOpen: () => {
                                            Swal.showLoading()
                                          },
                                          allowOutsideClick: false,
                                        })
                                        setTimeout(() => {
                                          checkSim(
                                            cellProps.row.original,
                                            client?._id,
                                            el._id,
                                            'followup2',
                                            check
                                          )
                                        }, 1000)
                                      }}
                                    />
                                  }
                                  label={''}
                                />
                                {index === client?.businessUnits.length - 1 &&
                                i !==
                                  clients.filter(
                                    (_client: any) =>
                                      _client._id !== undefined &&
                                      _client._id === list?.clientId
                                  )?.length -
                                    1 ? (
                                  <Divider sx={{ my: 0.3 }} />
                                ) : (
                                  <></>
                                )}
                              </>
                            )
                          })
                        )}
                      </>
                    ) : (
                      <CircularProgress
                        sx={{
                          width: '15px !important',
                          height: '15px !important',
                        }}
                      />
                    )}
                  </>
                )
              })}
            </Box>
          )
        }),
      },
      {
        Header: 'F3',
        accessor: 'f3',
        type: Type.String,
        width: 1,
        Cell: observer((cellProps: CellProps<User>) => {
          const {
            uiState: { modal },
          } = useRootStore()
          const state = useLocalObservable(() => ({
            isOpen: false,
          }))

          return (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                py: 1,
              }}
            >
              {cellProps.row.original.whitelist?.map((list: any, i: any) => {
                const client = list.clientUnits
                return (
                  <>
                    {client !== undefined ? (
                      <>
                        {client?.businessUnits?.length === 0 ? (
                          <>
                            <FormControlLabel
                              className="small-check"
                              control={
                                <Checkbox
                                  sx={{ py: 0.2, visibility: 'hidden' }}
                                />
                              }
                              label={''}
                            />
                            <Divider sx={{ my: 0.3 }} />
                          </>
                        ) : (
                          client?.businessUnits?.map((el: any, index: any) => {
                            const data = datas
                              .find(
                                (user: any) =>
                                  user._id === cellProps.row.original._id
                              )
                              ?.whitelist?.find(
                                (el: any) => el.clientUnits._id === client?._id
                              ).permission
                            return (
                              <>
                                <FormControlLabel
                                  className="small-check"
                                  control={
                                    <Checkbox
                                      sx={{ py: 0.2 }}
                                      checked={
                                        data?.simPermissions !== undefined &&
                                        data?.simPermissions[el._id] &&
                                        data?.simPermissions[el._id][
                                          'followup3'
                                        ]
                                      }
                                      disabled={
                                        data?.simPermissions == undefined ||
                                        data?.simPermissions[el._id] ===
                                          undefined
                                      }
                                      onChange={(e) => {
                                        const check = e.target.checked
                                        Swal.fire({
                                          title: 'Changing the permission..',
                                          html: 'Please wait.',
                                          timerProgressBar: true,
                                          showConfirmButton: false,
                                          didOpen: () => {
                                            Swal.showLoading()
                                          },
                                          allowOutsideClick: false,
                                        })
                                        setTimeout(() => {
                                          checkSim(
                                            cellProps.row.original,
                                            client?._id,
                                            el._id,
                                            'followup3',
                                            check
                                          )
                                        }, 1000)
                                      }}
                                    />
                                  }
                                  label={''}
                                />
                                {index === client?.businessUnits.length - 1 &&
                                i !==
                                  clients.filter(
                                    (_client: any) =>
                                      _client._id !== undefined &&
                                      _client._id === list?.clientId
                                  )?.length -
                                    1 ? (
                                  <Divider sx={{ my: 0.3 }} />
                                ) : (
                                  <></>
                                )}
                              </>
                            )
                          })
                        )}
                      </>
                    ) : (
                      <CircularProgress
                        sx={{
                          width: '15px !important',
                          height: '15px !important',
                        }}
                      />
                    )}
                  </>
                )
              })}
            </Box>
          )
        }),
      },
      {
        Header: 'F4',
        accessor: 'f4',
        type: Type.String,
        width: 1,
        Cell: observer((cellProps: CellProps<User>) => {
          const {
            uiState: { modal },
          } = useRootStore()
          const state = useLocalObservable(() => ({
            isOpen: false,
          }))

          return (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                py: 1,
              }}
            >
              {cellProps.row.original.whitelist?.map((list: any, i: any) => {
                const client = list.clientUnits
                return (
                  <>
                    {client !== undefined ? (
                      <>
                        {client?.businessUnits?.length === 0 ? (
                          <>
                            <FormControlLabel
                              className="small-check"
                              control={
                                <Checkbox
                                  sx={{ py: 0.2, visibility: 'hidden' }}
                                />
                              }
                              label={''}
                            />
                            <Divider sx={{ my: 0.3 }} />
                          </>
                        ) : (
                          client?.businessUnits?.map((el: any, index: any) => {
                            const data = datas
                              .find(
                                (user: any) =>
                                  user._id === cellProps.row.original._id
                              )
                              ?.whitelist?.find(
                                (el: any) => el.clientUnits._id === client?._id
                              ).permission
                            return (
                              <>
                                <FormControlLabel
                                  className="small-check"
                                  control={
                                    <Checkbox
                                      sx={{ py: 0.2 }}
                                      checked={
                                        data?.simPermissions !== undefined &&
                                        data?.simPermissions[el._id] &&
                                        data?.simPermissions[el._id][
                                          'followup4'
                                        ]
                                      }
                                      disabled={
                                        data?.simPermissions == undefined ||
                                        data?.simPermissions[el._id] ===
                                          undefined
                                      }
                                      onChange={(e) => {
                                        const check = e.target.checked
                                        Swal.fire({
                                          title: 'Changing the permission..',
                                          html: 'Please wait.',
                                          timerProgressBar: true,
                                          showConfirmButton: false,
                                          didOpen: () => {
                                            Swal.showLoading()
                                          },
                                          allowOutsideClick: false,
                                        })
                                        setTimeout(() => {
                                          checkSim(
                                            cellProps.row.original,
                                            client?._id,
                                            el._id,
                                            'followup4',
                                            check
                                          )
                                        }, 1000)
                                      }}
                                    />
                                  }
                                  label={''}
                                />
                                {index === client?.businessUnits.length - 1 &&
                                i !==
                                  clients.filter(
                                    (_client: any) =>
                                      _client._id !== undefined &&
                                      _client._id === list?.clientId
                                  )?.length -
                                    1 ? (
                                  <Divider sx={{ my: 0.3 }} />
                                ) : (
                                  <></>
                                )}
                              </>
                            )
                          })
                        )}
                      </>
                    ) : (
                      <CircularProgress
                        sx={{
                          width: '15px !important',
                          height: '15px !important',
                        }}
                      />
                    )}
                  </>
                )
              })}
            </Box>
          )
        }),
      },
      {
        Header: 'F5',
        accessor: 'f5',
        type: Type.String,
        width: 1,
        Cell: observer((cellProps: CellProps<User>) => {
          const state = useLocalObservable(() => ({
            isOpen: false,
          }))

          return (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                py: 1,
              }}
            >
              {cellProps.row.original.whitelist?.map((list: any, i: any) => {
                const client = list.clientUnits
                return (
                  <>
                    {client !== undefined ? (
                      <>
                        {client?.businessUnits?.length === 0 ? (
                          <>
                            <FormControlLabel
                              className="small-check"
                              control={
                                <Checkbox
                                  sx={{ py: 0.2, visibility: 'hidden' }}
                                />
                              }
                              label={''}
                            />
                            <Divider sx={{ my: 0.3 }} />
                          </>
                        ) : (
                          client?.businessUnits?.map((el: any, index: any) => {
                            const data = datas
                              .find(
                                (user: any) =>
                                  user._id === cellProps.row.original._id
                              )
                              ?.whitelist?.find(
                                (el: any) => el.clientUnits._id === client?._id
                              ).permission
                            return (
                              <>
                                <FormControlLabel
                                  className="small-check"
                                  control={
                                    <Checkbox
                                      sx={{ py: 0.2 }}
                                      checked={
                                        data?.simPermissions !== undefined &&
                                        data?.simPermissions[el._id] &&
                                        data?.simPermissions[el._id][
                                          'followup5'
                                        ]
                                      }
                                      disabled={
                                        data?.simPermissions == undefined ||
                                        data?.simPermissions[el._id] ===
                                          undefined
                                      }
                                      onChange={(e) => {
                                        const check = e.target.checked
                                        Swal.fire({
                                          title: 'Changing the permission..',
                                          html: 'Please wait.',
                                          timerProgressBar: true,
                                          showConfirmButton: false,
                                          didOpen: () => {
                                            Swal.showLoading()
                                          },
                                          allowOutsideClick: false,
                                        })
                                        setTimeout(() => {
                                          checkSim(
                                            cellProps.row.original,
                                            client?._id,
                                            el._id,
                                            'followup5',
                                            check
                                          )
                                        }, 1000)
                                      }}
                                    />
                                  }
                                  label={''}
                                />
                                {index === client?.businessUnits.length - 1 &&
                                i !==
                                  clients.filter(
                                    (_client: any) =>
                                      _client._id !== undefined &&
                                      _client._id === list?.clientId
                                  )?.length -
                                    1 ? (
                                  <Divider sx={{ my: 0.3 }} />
                                ) : (
                                  <></>
                                )}
                              </>
                            )
                          })
                        )}
                      </>
                    ) : (
                      <CircularProgress
                        sx={{
                          width: '15px !important',
                          height: '15px !important',
                        }}
                      />
                    )}
                  </>
                )
              })}
            </Box>
          )
        }),
      },
      {
        Header: 'Country Permissions',
        accessor: 'Country Permissions',
        type: Type.String,
        width: 1,
        Cell: observer((cellProps: CellProps<User>) => {
          const state = useLocalObservable(() => ({
            isOpen: false,
          }))

          return (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                py: 1,
              }}
            >
              {cellProps.row.original.whitelist?.map((list: any, i: any) => {
                const client = list.clientUnits
                return (
                  <>
                    {client?.businessUnits?.length === 0 ? (
                      <>
                        <Select
                          className="small-select"
                          sx={{ width: '150px', visibility: 'hidden' }}
                        ></Select>
                        <Divider sx={{ my: 0.3 }} />
                      </>
                    ) : (
                      client?.businessUnits?.map((el: any, index: any) => {
                        const data = datas
                          .find(
                            (user: any) =>
                              user._id === cellProps.row.original._id
                          )
                          ?.whitelist?.find(
                            (el: any) => el.clientUnits?._id === client?._id
                          )
                        return (
                          <>
                            <Select
                              className="small-select"
                              multiple
                              onChange={(e) => {
                                checkCountry(
                                  cellProps.row.original,
                                  client._id,
                                  el._id,
                                  e.target.value
                                )
                              }}
                              defaultValue=""
                              sx={{ width: '150px' }}
                              renderValue={(selected: any) => {
                                return (
                                  <Box sx={{ display: 'flex' }}>
                                    <Box
                                      sx={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: 0.5,
                                        height: '20px',
                                        overflow: 'hidden',
                                      }}
                                    >
                                      <Chip
                                        label={
                                          countries.find(
                                            (cr: any) => cr._id === selected[0]
                                          )?.name
                                        }
                                        sx={{
                                          height: '18px',
                                          mt: '1.5px',
                                        }}
                                      />
                                    </Box>
                                    {selected.length > 1 ? (
                                      <Typography
                                        sx={{
                                          fontSize: '0.8rem',
                                          fontWeight: 700,
                                        }}
                                      >
                                        +{selected.length - 1}
                                      </Typography>
                                    ) : (
                                      <></>
                                    )}
                                  </Box>
                                )
                              }}
                              value={
                                data?.permission?.countryPermissions !==
                                undefined
                                  ? data?.permission?.countryPermissions[
                                      el._id
                                    ] || []
                                  : []
                              }
                              disabled={
                                data?.permission?.countryPermissions ===
                                  undefined ||
                                data?.permission?.countryPermissions[el._id] ===
                                  undefined
                              }
                            >
                              <MenuItem
                                disabled
                                value=""
                                sx={{
                                  display: 'none',
                                }}
                              >
                                <em>-</em>
                              </MenuItem>
                              {el.adminCountryIds.map((countryId: any) => {
                                const _country = countries.find(
                                  (cr: any) => cr._id === countryId
                                )
                                return (
                                  <MenuItem value={_country?._id}>
                                    <Checkbox
                                      checked={
                                        data?.permission?.countryPermissions !==
                                        undefined
                                          ? data?.permission?.countryPermissions[
                                              el._id
                                            ]?.includes(countryId)
                                          : false
                                      }
                                    />
                                    <ListItemText primary={_country?.name} />
                                  </MenuItem>
                                )
                              })}
                            </Select>
                            {index === client?.businessUnits.length - 1 &&
                            i !==
                              clients.filter(
                                (_client: any) =>
                                  _client._id !== undefined &&
                                  _client._id === list?.clientId
                              )?.length -
                                1 ? (
                              <Divider sx={{ my: 0.3 }} />
                            ) : (
                              <></>
                            )}
                          </>
                        )
                      })
                    )}
                  </>
                )
              })}
            </Box>
          )
        }),
      },
    ]

    const meta = {
      columns,
    }

    return (
      <>
        <WrappedComponent {...props} {...meta} />
        <Dialog open={open}>
          <DialogTitle>Optional sizes</DialogTitle>
          <DialogContent>
            <DialogContentText>
              You can set my maximum width and whether to adapt or not.
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </>
    )
  })

export default withColumns
