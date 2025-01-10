import { Box, Typography } from 'src/ui/core/components'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import { MobxUtil } from '@utils'
import { action, reaction } from 'mobx'
import { observer, useLocalObservable } from 'mobx-react'
import React from 'react'
function TabsView({
  tabs = [
    {
      label: 'item one',
      value: 0,
      renderTabPanel: () => <div>item one</div>,
    },
    {
      label: 'item two',
      value: 1,
      renderTabPanel: () => <div>item two</div>,
    },
    {
      label: 'item three',
      value: 2,
      renderTabPanel: () => <div>item three</div>,
    },
  ],
  state = {},
  path = '',
  defaultValue = 0,
  ...rest
}: any) {
  const localState = useLocalObservable(() => ({
    value: MobxUtil._get(state, path) || defaultValue,
  }))

  reaction(
    () => localState.value,
    () => MobxUtil._set(state, path, localState.value)
  )

  reaction(
    () => MobxUtil._get(state, path),
    () => (localState.value = MobxUtil._get(state, path))
  )

  const onChange = action((event: React.SyntheticEvent, newValue: number) => {
    localState.value = newValue
  })

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    }
  }
  return (
    <React.Fragment>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={localState.value} onChange={onChange}>
          {tabs.map((tab: any, index: number) => (
            <Tab value={tab.value} label={tab.label} {...a11yProps(index)} />
          ))}
        </Tabs>
      </Box>
      {tabs.map((tab: any, index: any) => (
        <TabPanel value={localState.value} index={index}>
          {tab.renderTabPanel()}
        </TabPanel>
      ))}
    </React.Fragment>
  )
}
interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}
export default observer(TabsView)
