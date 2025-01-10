import * as xlsx from 'xlsx'

import { Add, Clear, Filter, FilterAlt } from '@mui/icons-material'
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from '@mui/material'

import { BusinessCyclesFilter } from './BusinessCyclesFilter'
import { BusinessUnitsFilter } from './BusinessUnitsFilter'
import ClientUnit from 'src/models/clientUnit'
import { ClientUnitsFilter } from './ClientUnitsFilter'
import PaginationTable from 'src/ui/components/PaginationTable'
import { ResultStageFilter } from './ResultStageFilter'
import { Rnd } from 'react-rnd'
import SearchBar from '../SearchBar/SearchBar'
import SimManagementTable from '@components/tables/SimManagement/SimManagement'
import { SimStatusFilter } from './SimStatusFilter'
import Simulation from 'src/models/simulation'
import { SimulationsFilter } from './SimulationsFilter'
import { VendorsFilter } from './VendorsFilter'
import _ from 'lodash'
import axios from 'axios'
import moment from 'moment'
import { observer } from 'mobx-react'
import { useState } from 'react'

type Prop = {
  clientUnits: ClientUnit[]
  clientUnitsMutate: any
  simulations: Simulation[]
  handleFilter: (filter: any, options: any) => void
  searchString: string
  onChangeSearchString: (e: any) => void
  appliedFilter: { filter: any; options: any }
}

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}

function SimManagementFilterView(props: Prop) {
  const { clientUnits, simulations, handleFilter, appliedFilter } = props
  const [clientUnitIds, setClientUnitIds] = useState<string[]>([])
  const [vendors, setVendors] = useState<ClientUnit[]>([])
  const [vendorIds, setVendorIds] = useState<string[]>([])
  const [businessUnitIds, setBusinessUnitIds] = useState<string[]>([])
  const [businessCycleIds, setBusinessCycleIds] = useState<string[]>([])
  const [simulationIds, setSimulationIds] = useState<string[]>([])
  const [simStatuses, setSimStatuses] = useState<string[]>([])
  const [resultStages, setResultStages] = useState<string[]>([])
  const [open, setOpen] = useState<boolean>(false)

  const handleChangeClientUnit = (event: any) => {
    const {
      target: { value },
    } = event
    setClientUnitIds(value)
  }

  const handleChangeVendor = (event: any) => {
    const {
      target: { value },
    } = event
    setVendorIds(value)
  }

  const handleChangeBusinessUnit = (event: any) => {
    const {
      target: { value },
    } = event
    setBusinessUnitIds(value)
  }

  const handleChangeAssessmentCycle = (event: any) => {
    const {
      target: { value },
    } = event
    setBusinessCycleIds(value)
  }

  const handleChangeSimulation = (event: any) => {
    const {
      target: { value },
    } = event
    setSimulationIds(value)
  }

  const handleChangeSimStatus = (event: any) => {
    const {
      target: { name, checked },
    } = event
    setSimStatuses((prev) => {
      if (checked) return [...prev, name]
      return [...prev].filter((_name) => _name !== name)
    })
  }

  const handleChangeResultStage = (event: any) => {
    const {
      target: { name, checked },
    } = event
    setResultStages((prev) => {
      if (checked) return [...prev, name]
      return [...prev].filter((_name) => _name !== name)
    })
  }

  const getFilter = () => {
    const filter = {
      isDeleted: false,
    } as any
    const options = {
      fields: {},
    } as any
    if (clientUnitIds.length > 0) {
      if (vendorIds.length > 0) {
        filter.clientUnitId = { $in: vendorIds }
      } else {
        filter.clientUnitId = { $in: clientUnitIds }
      }
    }
    if (businessUnitIds.length > 0) {
      filter.businessUnitId = { $in: businessUnitIds }
    }
    if (businessCycleIds.length > 0) {
      filter.businessCycleId = { $in: businessCycleIds }
    }
    if (simulationIds.length > 0) {
      options.fields.simulationIds = simulationIds
    }
    if (simStatuses.length > 0) {
      options.fields.simStatuses = simStatuses
    }
    if (resultStages.length > 0) {
      options.fields.resultStages = resultStages
    }
    return { filter, options }
  }

  const onClickApply = () => {
    const { filter, options } = getFilter()
    handleFilter(filter, options)
    // setOpen(false)
  }

  const onClickExport = async () => {
    const { filter, options } = appliedFilter
    const { data } = await axios.get('v3/simManagement/excel', {
      params: { filter, options },
    })
    const wb = xlsx.read(data, {
      type: 'binary',
    })
    xlsx.writeFile(
      wb,
      `simManagement-${moment(new Date()).format('DD-MMM-YYYY')}.xlsx`
    )
    // const url = window.URL.createObjectURL(new Blob([data]))
    // const link = document.createElement('a')
    // link.href = url
    // link.setAttribute('download', 'fileName.xlsx')
    // document.body.appendChild(link)
    // link.click()
  }

  return (
    <>
      <Box sx={{ position: 'relative' }}>
        <Box sx={{ position: 'absolute', left: 10, top: 20 }}>
          <SearchBar
            onChange={props.onChangeSearchString}
            value={props.searchString}
          />
        </Box>
        <Box sx={{ position: 'absolute', right: 10, top: 20 }}>
          <Button variant="contained" onClick={onClickExport}>
            Export
          </Button>
          <Button
            variant="contained"
            onClick={() => setOpen(true)}
            sx={{ ml: 1 }}
          >
            <FilterAlt />
          </Button>
        </Box>
        <Rnd
          default={{
            x: window.innerWidth / 2 - 250,
            y: 0,
            width: 396,
            height: 546,
          }}
          style={{
            zIndex: 100,
            border: '1px solid black',
            backgroundColor: 'white',
            display: open ? 'block' : 'none',
          }}
          enableResizing={false}
          bounds="window"
        >
          <Box
            sx={{
              display: 'flex',
              backgroundColor: 'ButtonFace',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ ml: 2 }}>Filter</Box>
            <Button onClick={() => setOpen(false)}>Hide</Button>
          </Box>
          <Box
            sx={{
              display: 'flex',
              padding: '12px',
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <ClientUnitsFilter
                clientUnits={clientUnits}
                clientUnitIds={clientUnitIds}
                handleChange={handleChangeClientUnit}
              />
              <VendorsFilter
                vendors={vendors}
                setVendors={setVendors}
                clientUnitIds={clientUnitIds}
                handleChange={handleChangeVendor}
                vendorIds={vendorIds}
              />
              <BusinessUnitsFilter
                clientUnits={vendors.length > 0 ? vendors : clientUnits}
                clientUnitIds={vendors.length > 0 ? vendorIds : clientUnitIds}
                businessUnitIds={businessUnitIds}
                handleChange={handleChangeBusinessUnit}
              />
              <BusinessCyclesFilter
                clientUnits={vendors.length > 0 ? vendors : clientUnits}
                clientUnitIds={vendors.length > 0 ? vendorIds : clientUnitIds}
                businessCycleIds={businessCycleIds}
                handleChange={handleChangeAssessmentCycle}
              />
              <SimulationsFilter
                simulations={simulations}
                simulationIds={simulationIds}
                handleChange={handleChangeSimulation}
              />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', ml: 4 }}>
              <SimStatusFilter
                simStatuses={simStatuses}
                handleChange={handleChangeSimStatus}
              />
              <Box sx={{ mt: 3 }} />
              <ResultStageFilter
                resultStages={resultStages}
                handleChange={handleChangeResultStage}
              />
            </Box>
          </Box>
          <Box sx={{ ml: 2, mr: 2 }} onClick={onClickApply}>
            <Button variant="contained" fullWidth>
              Apply
            </Button>
          </Box>
        </Rnd>
      </Box>
    </>
  )
}
export default observer(SimManagementFilterView)
