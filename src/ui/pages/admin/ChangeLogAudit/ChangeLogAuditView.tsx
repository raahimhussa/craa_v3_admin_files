import { observer } from 'mobx-react'

import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'

import { useEffect, useState } from 'react'
import DocumentChangeLog from '../DocumentChangeLog/DocumentChangeLog'
import SimResourceChangeLog from '../SimResourceChangeLog/SimResourceChangeLog'

function ChangeLogAuditView(props: any) {

  const [value, setValue] = useState(0)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }  

  return (
    <Box>
      <Tabs
        variant="fullWidth"
        indicatorColor={'primary'}
        textColor="primary"
        sx={{ mb: 2, boxShadow: 2 }}
        onChange={handleChange}
        value={value}
        aria-label="Tabs where each tab needs to be selected manually"
      >
        <Tab
          label="Simulation Change Log Audit"
          sx={{ fontSize: 12, fontWeight: 600 }}
        />
        <Tab
          label="Document Change Log Audit"
          sx={{ fontSize: 12, fontWeight: 600 }}
        />        
        {/* <Tab label="Risk Management" sx={{ fontSize: 12, fontWeight: 600 }} /> */}
      </Tabs>
      {value === 0 && (
        <Box>
          <SimResourceChangeLog adminUsers={props.users} />
        </Box>
      )}
      {value === 1 && (
        <Box>
          <DocumentChangeLog adminUsers={props.users} />
        </Box>
      )}
    </Box>
  )
}
export default observer(ChangeLogAuditView)
