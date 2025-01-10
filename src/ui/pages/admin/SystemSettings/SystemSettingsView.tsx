import Templates from 'src/ui/core/components/tables/Templates/Templates'
import { observer } from 'mobx-react'
import {
  Button,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import Dialog from './Dialog'
import axios from 'axios'
function SystemSettingsView() {
  const [tutorialType, setTutorialType] = useState('')
  return (
    <Grid container sx={{ px: 2, py: 4 }}>
      <Grid item xs={4}>
        <Card sx={{ width: '100%' }}>
          <CardContent>
            <Typography
              sx={{ fontSize: 18, fontWeight: 600, mb: 1.5 }}
              color="text.secondary"
              gutterBottom
            >
              Universal Simulation Settings
            </Typography>
            <Table className="logtable">
              <TableHead>
                <TableRow>
                  <TableCell>Field</TableCell>
                  <TableCell sx={{ width: '100px' }}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Simulation Tutorial</TableCell>
                  <TableCell>
                    {' '}
                    <Button
                      variant="contained"
                      onClick={() => {
                        setTutorialType('simulation')
                      }}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Training Tutorial</TableCell>
                  <TableCell>
                    {' '}
                    <Button
                      variant="contained"
                      onClick={() => {
                        setTutorialType('training')
                      }}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Grid>
      {tutorialType !== '' ? (
        <Dialog setTutorialType={setTutorialType} tutorialType={tutorialType} />
      ) : (
        <></>
      )}
    </Grid>
  )
}
export default observer(SystemSettingsView)
