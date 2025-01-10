import {
  Box,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material'
import { observer, useLocalObservable } from 'mobx-react'
import { useEffect, useState } from 'react'

import DocumentWithoutbuttons from '@components/tables/DocumentsWithoutButtons/DocumentsWithoutButtons'
import Documents from '@components/tables/Documents/Documents'
import Files from 'src/ui/core/components/tables/Files/Files'
import PaginationTable from 'src/ui/components/PaginationTable'
import SearchBar from './SearchBar/SearchBar'
import moment from 'moment'
import { useRootStore } from 'src/stores'

function SigninReviewView(props: any) {
  return (
    <>
      <Box
        sx={{
          backgroundColor: 'white',
          position: 'absolute',
          left: '16px',
          // transform: 'translate(-50%, 0%)',
          mt: 2,
          zIndex: 110,
        }}
      >
        <Table sx={{ width: '100vw' }}>
          <TableHead>
            <TableRow sx={{ height: 64 }}>
              <TableCell align="center">User</TableCell>
              <TableCell align="center">Role</TableCell>
              <TableCell align="center">OS</TableCell>
              <TableCell align="center">Browser</TableCell>
              <TableCell align="center">IP</TableCell>
              <TableCell align="center">Country</TableCell>
              <TableCell align="center">City</TableCell>
              <TableCell align="center">ISP</TableCell>
              <TableCell align="center">Signed-in Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props?.authLogs?.map((_authLogs: any) => {
              return (
                <>
                  {_authLogs.map((_authLog: any, index: number) => {
                    if (_authLogs.length === 1) {
                      return (
                        <TableRow sx={{ height: 32 }}>
                          <TableCell align="center">
                            {_authLog.userName}
                          </TableCell>
                          <TableCell align="center">{_authLog.role}</TableCell>
                          <TableCell align="center">{_authLog.os}</TableCell>
                          <TableCell align="center">
                            {_authLog.browser}
                          </TableCell>
                          <TableCell align="center">{_authLog.ip}</TableCell>
                          <TableCell align="center">
                            {_authLog.country}
                          </TableCell>
                          <TableCell align="center">{_authLog.city}</TableCell>
                          <TableCell align="center">{_authLog.isp}</TableCell>
                          <TableCell align="center">
                            {moment(_authLog.createdAt).format(
                              'DD-MMM-YYYY hh:mm:ss'
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    }
                    return (
                      <TableRow sx={{ height: 32 }}>
                        {index === 0 ? (
                          <TableCell rowSpan={2} align="center">
                            {_authLog.userName}
                          </TableCell>
                        ) : null}
                        {index === 0 ? (
                          <TableCell rowSpan={2} align="center">
                            {_authLog.role}
                          </TableCell>
                        ) : null}
                        <TableCell
                          align="center"
                          sx={{
                            backgroundColor:
                              index === 0
                                ? _authLogs[0]?.os !== _authLogs[1]?.os
                                  ? 'yellow'
                                  : undefined
                                : undefined,
                          }}
                        >
                          {_authLog.os}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            backgroundColor:
                              index === 0
                                ? _authLogs[0]?.browser !==
                                  _authLogs[1]?.browser
                                  ? 'yellow'
                                  : undefined
                                : undefined,
                          }}
                        >
                          {_authLog.browser}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            backgroundColor:
                              index === 0
                                ? _authLogs[0]?.ip !== _authLogs[1]?.ip
                                  ? 'yellow'
                                  : undefined
                                : undefined,
                          }}
                        >
                          {_authLog.ip}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            backgroundColor:
                              index === 0
                                ? _authLogs[0]?.country !==
                                  _authLogs[1]?.country
                                  ? 'yellow'
                                  : undefined
                                : undefined,
                          }}
                        >
                          {_authLog.country}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            backgroundColor:
                              index === 0
                                ? _authLogs[0]?.city !== _authLogs[1]?.city
                                  ? 'yellow'
                                  : undefined
                                : undefined,
                          }}
                        >
                          {_authLog.city}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            backgroundColor:
                              index === 0
                                ? _authLogs[0]?.isp !== _authLogs[1]?.isp
                                  ? 'yellow'
                                  : undefined
                                : undefined,
                          }}
                        >
                          {_authLog.isp}
                        </TableCell>
                        <TableCell align="center">
                          {moment(_authLog.createdAt).format(
                            'DD-MMM-YYYY hh:mm:ss'
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                  <TableRow sx={{ height: 16 }}>
                    <TableCell colSpan={9}>
                      <Divider />
                    </TableCell>
                  </TableRow>
                </>
              )
            })}
          </TableBody>
        </Table>
      </Box>
    </>
  )
}
export default observer(SigninReviewView)
