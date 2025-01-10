import { Autocomplete, Box, TextField } from '@mui/material'
import { action, reaction, toJS } from 'mobx'
import { observer, useLocalObservable } from 'mobx-react'
import { useEffect, useState } from 'react'

import IFolder from 'src/models/folder/folder.interface'
import { ISimDoc } from 'src/models/simDoc/types'
import ISimulation from 'src/models/simulation/simulation.interface'
import { MobxUtil } from '@utils'
import { useRootStore } from 'src/stores'
import { useSnackbar } from 'notistack'

function FindingAutocompleteView(props: any) {
  const {
    state = {},
    path = '',
    onChange: _onChange,
    label = '',
    limitTags = 1,
    max = -1,
    maxErrorMessage = '',
    simDocs,
    simulationMappers,
    simulations,
    folders,
  } = props
  const [simDocOptions, setSimDocOptions] = useState<
    {
      simulationName: string
      simulationVisibleId: number
      text: string
      simDocId: string
      value: string
    }[]
  >([])
  const { findingStore } = useRootStore()
  const { enqueueSnackbar } = useSnackbar()

  const localState = useLocalObservable<any>(() => ({
    value: MobxUtil._get(state, path) || [],
    simulationMappers,
  }))

  reaction(
    () => localState.value,
    () => {
      MobxUtil._set(state, path, localState.value)
    }
  )

  reaction(
    () => MobxUtil._get(state, path),
    () => (localState.value = MobxUtil._get(state, path))
  )

  useEffect(() => {
    const simDocId = toJS(state.form.simDocId)
    const currentSimDoc = simDocs.find(
      (_simDoc: any) => _simDoc._id === simDocId
    )

    const totalSimDocsBySimulation: { [key: string]: ISimDoc[] } = {}
    const _simDocOptions: {
      simulationName: string
      simulationVisibleId: number
      text: string
      simDocId: string
      value: string
    }[] = []
    simulations.forEach((_simulation: ISimulation) => {
      const parentFolders = folders.filter((_folder: IFolder) =>
        _simulation.folderIds.includes(_folder._id)
      )
      const childrenFolders = folders.filter(
        (_folder: IFolder) =>
          parentFolders.filter((_pf: IFolder) => _pf._id === _folder.folderId)
            .length > 0
      )
      const totalFolders = Array.from(
        new Set([...parentFolders, ...childrenFolders])
      )
      const totalSimDocs = simDocs.filter((_simDoc: any) =>
        totalFolders.find((_folder) => _folder._id === _simDoc.folderId)
      )
      if (_simulation._id) {
        totalSimDocsBySimulation[_simulation._id as string] = totalSimDocs
      }
    })

    let possibleCompareSimDocs: string[] = []
    Object.keys(totalSimDocsBySimulation).forEach((_simulationId) => {
      const totalSimDocs = totalSimDocsBySimulation[_simulationId]
      totalSimDocs.forEach((_simDoc: ISimDoc) => {
        possibleCompareSimDocs.push(_simDoc._id)
      })
      const localSimulationMappers = [
        ...simulationMappers,
        ...(toJS(findingStore.form.addedSimulationMappers) || []),
      ].filter((_sm) => {
        return (
          _sm.simulationId ===
            simulations.find((_s: any) => _s._id === _simulationId).visibleId &&
          !findingStore.form.removedSimulationMappers?.find((_rsm) => {
            return (
              _rsm.findingId === _sm.findingId &&
              _rsm.simulationId === _sm.simulationId &&
              _rsm._id === _sm._id
            )
          })
        )
      })
      if (localSimulationMappers.length > 0) {
        findingStore.form.possibleCompareSimDocs = Array.from(
          new Set([
            ...(toJS(findingStore.form.possibleCompareSimDocs) || []),
            ...possibleCompareSimDocs,
          ])
        )
      }
      possibleCompareSimDocs = []
      const currentSimulation = simulations.find(
        (_simulation: ISimulation) => _simulation._id === _simulationId
      )
      totalSimDocs.forEach((_simDoc: ISimDoc) => {
        _simDocOptions.push({
          simulationName: currentSimulation?.name || '',
          simulationVisibleId: currentSimulation?.visibleId || -1,
          text: `${_simDoc.title}`,
          simDocId: _simDoc._id,
          value: `${currentSimulation?.name || ''}-${
            currentSimulation?.visibleId || -1
          }`,
        })
      })
    })

    setSimDocOptions(
      _simDocOptions.sort((a, b) => {
        if (a.simulationName > b.simulationName) {
          return 1
        }
        if (a.simulationName < b.simulationName) {
          return -1
        }
        if (a.text > b.text) {
          return 1
        }
        if (a.text < b.text) {
          return -1
        }
        return 1
      })
    )
  }, [])

  const value = simDocOptions.filter((option) => {
    const selectedSimulationMapper = localState.simulationMappers.find(
      (_simulationMapper: any) =>
        state.form.visibleId === _simulationMapper.findingId &&
        option.simulationVisibleId === _simulationMapper.simulationId
    )
    const selectedSimDoc: ISimDoc = simDocs?.find(
      (_simDoc: any) => _simDoc._id === state.form.simDocId
    )
    if (!selectedSimulationMapper || !selectedSimDoc) return false

    if (
      option.simulationVisibleId === selectedSimulationMapper.simulationId &&
      option.simDocId === selectedSimDoc._id
    ) {
      return true
    }
    return false
  })

  const getOptionLabel = (option: any) => {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 36,
        }}
      >
        <Box
          sx={{
            pl: 1,
            pr: 1,
            // pt: 0.1,
            // pb: 0.1,
            mr: 1,
            fontSize: 11,
            borderRadius: 1,
            backgroundColor: '#eeeeee',
          }}
        >
          {option.simulationName}
        </Box>
        <Box>{option.text}</Box>
      </Box>
    )
  }
  const onChange = (
    event: any,
    selectedOptions: any,
    reason: any,
    details: any
  ) => {
    if (max > 0 && selectedOptions.length > max) {
      return enqueueSnackbar(maxErrorMessage || 'too many tags', {
        variant: 'error',
      })
    }
    const selectedOption = {
      simulationId: details.option.simulationVisibleId,
      findingId: state.form.visibleId,
      simDocId: details.option.simDocId,
      value: details.option.text,
      modify: true,
    }
    // localState.simulationMappers = []
    // findingStore.form.addedSimulationMappers = []
    // findingStore.form.removedSimulationMappers = [...simulationMappers]
    if (state.form.simDocId !== selectedOption.simDocId) {
      localState.simulationMappers = []
      findingStore.form.addedSimulationMappers = []
      findingStore.form.removedSimulationMappers = [...simulationMappers]
    }
    const selectedValues = selectedOptions.map((option: any) => ({
      simulationId: option.simulationVisibleId,
      findingId: state.form.visibleId,
      simDocId: option.simDocId,
      value: option.text,
      modify: true,
    }))
    if (
      selectedValues.find(
        (_selectedValue: any) =>
          _selectedValue.findingId === selectedOption.findingId &&
          _selectedValue.simulationId === selectedOption.simulationId
      )
    ) {
      localState.simulationMappers = [
        ...localState.simulationMappers,
        selectedOption,
      ]

      // 추가 목록에 추가
      findingStore.form.addedSimulationMappers = [
        ...(findingStore.form.addedSimulationMappers || []),
        selectedOption,
      ]
    } else {
      localState.simulationMappers = localState.simulationMappers.filter(
        (_simulationMapper: any) => {
          return !(
            _simulationMapper.simulationId === selectedOption.simulationId &&
            _simulationMapper.findingId === selectedOption.findingId
          )
        }
      )
      // 제거 목록에 추가
      findingStore.form.removedSimulationMappers = [
        ...(findingStore.form.removedSimulationMappers || []),
        selectedOption,
      ]
    }
    localState.value = selectedOption.simDocId

    if (_onChange) {
      _onChange(event, selectedOptions)
    }

    const totalSimDocsBySimulation: { [key: string]: ISimDoc[] } = {}
    simulations.forEach((_simulation: ISimulation) => {
      const parentFolders = folders.filter((_folder: IFolder) =>
        _simulation.folderIds.includes(_folder._id)
      )
      const childrenFolders = folders.filter(
        (_folder: IFolder) =>
          parentFolders.filter((_pf: IFolder) => _pf._id === _folder.folderId)
            .length > 0
      )
      const totalFolders = Array.from(
        new Set([...parentFolders, ...childrenFolders])
      )
      const totalSimDocs = simDocs.filter((_simDoc: any) =>
        totalFolders.find((_folder) => _folder._id === _simDoc.folderId)
      )
      if (_simulation._id) {
        totalSimDocsBySimulation[_simulation._id as string] = totalSimDocs
      }
    })
    let possibleCompareSimDocs: string[] = []
    findingStore.form.possibleCompareSimDocs = []
    Object.keys(totalSimDocsBySimulation).forEach((_simulationId) => {
      const totalSimDocs = totalSimDocsBySimulation[_simulationId]
      totalSimDocs.forEach((_simDoc: ISimDoc) => {
        possibleCompareSimDocs.push(_simDoc._id)
      })
      const localSimulationMappers = [
        ...simulationMappers,
        ...(toJS(findingStore.form.addedSimulationMappers) || []),
      ].filter((_sm) => {
        return (
          _sm.simulationId ===
            simulations.find((_s: any) => _s._id === _simulationId).visibleId &&
          !findingStore.form.removedSimulationMappers?.find((_rsm) => {
            return (
              _rsm.findingId === _sm.findingId &&
              _rsm.simulationId === _sm.simulationId &&
              _rsm._id === _sm._id
            )
          })
        )
      })
      if (localSimulationMappers.length > 0) {
        findingStore.form.possibleCompareSimDocs = Array.from(
          new Set([
            ...(toJS(findingStore.form.possibleCompareSimDocs) || []),
            ...possibleCompareSimDocs,
          ])
        )
      }
      possibleCompareSimDocs = []
    })
  }

  return (
    <Autocomplete
      // className="buAutocomplete"
      {...props}
      ChipProps={{
        sx: {
          backgroundColor: 'white',
          border: '1px solid grey',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          borderRadius: 0,
        },
      }}
      multiple
      onChange={onChange}
      options={simDocOptions}
      renderOption={(
        renderOptionProps: any,
        {
          simulationName,
          simulationVisibleId,
          text,
        }: {
          simulationName: string
          simulationVisibleId: number
          text: string
          simDocId: string
        }
      ) => {
        return (
          <Box {...renderOptionProps} sx={{ height: 36 }}>
            <Box
              sx={{
                pl: 1,
                pr: 1,
                pt: 0.5,
                pb: 0.5,
                mr: 1,
                fontSize: 11,
                borderRadius: 1,
                backgroundColor: '#eeeeee',
              }}
            >
              {simulationName}
            </Box>
            <Box>{text}</Box>
          </Box>
        )
      }}
      filterOptions={(options, state) => {
        const { inputValue } = state
        return options.filter(
          (_option) =>
            (_option as any).simulationName
              .toLowerCase()
              .includes(inputValue.toLowerCase()) ||
            (_option as any).text
              .toLowerCase()
              .includes(inputValue.toLowerCase())
        )
      }}
      getOptionLabel={getOptionLabel}
      value={value}
      renderInput={(params) => (
        <TextField
          {...params}
          size="small"
          // variant={'outlined'}
          label={label}
          // sx={{ height: '72px !important' }}
          InputProps={{
            ...params.InputProps,
            sx: {
              '&.MuiInputBase-root': {
                minHeight: 37.13,
                height: '100%',
              },
            },
          }}
        />
      )}
    />
  )
}
export default observer(FindingAutocompleteView)
