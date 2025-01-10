import React, { useState, useEffect } from 'react';
import PaginationTable from 'src/ui/components/PaginationTable'
import Simulations from './table/Simulations'
import { observer, useLocalObservable } from 'mobx-react'
import { toJS } from 'mobx'
// import { SortingProvider, useSortingContext } from 'src/contexts/SortingContext'
import { DataGridProvider, useDataGridContext } from 'src/contexts/DataGridContext';

import SearchBar from './SearchBar/SearchBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ConfirmDialog from '@components/ConfirmDialog/ConfirmDialog';
import axios from 'axios';
import { useRootStore } from 'src/stores'
import { useSnackbar } from 'notistack'

// @ts-ignore
const SimulationsView = observer((props) => {

  console.log("SimulationsView props: ", props);

  // const localState = useLocalObservable(() => ({
  //   selectedRowIds: [],
  // }))

  // console.log("SimulationsView 0: ", localState.selectedRowIds)
  // const { state, clientsMutate, clients } = props

  // Inner component to utilize context within the provider
  const InnerSimulationsView = (props: any) => {

    // const localState = useLocalObservable(() => ({
    //   selectedRowIds: [],
    // }))

    const { state, mutate } = props

    const { sortBy, _selectedRows } = useDataGridContext();
    
    const [searchString, setSearchString] = useState<string>('')
    const { folderStore, findingStore } = useRootStore()

    const { enqueueSnackbar } = useSnackbar();

    // const [selectedFlatRows, setSelectedRows] = useState()

    // const { selectedRows } = useDataGridStore();

    // const _obj = { keyA: selectedRows, keyB: 'b' }
    // useEffect(() => {
    //   console.log(_obj.keyA)
    //   // if(selectedRows.length > 0) {
    //   // const selectedRowsData = selectedRows.map(d => d.original);
    //   // console.log("SimulationsView: ", selectedRowsData)      
    //   // }
    // }, [_obj.keyA]);  

    useEffect(() => {
      // console.log("SimulationsView sortBy: ", sortBy)
      console.log("SimulationsView selectedRows: ", _selectedRows)
      // console.log("SimulationsView state2: ", state)
      // console.log("SimulationsView: ", localState.selectedRowIds)
      // console.log("SimulationsView searchString: ", searchString)
    }, [searchString, state, _selectedRows, sortBy])
    
    const searchStringFilter = {
      $or: [
        { 'name': { $regex: searchString, $options: 'i' } },
      ],
    }

    const [openDialog, setOpenDialog] = useState(false);

    const handleOpenDialog = () => {
      setOpenDialog(true);
    };
  
    const handleCloseDialog = () => {
      setOpenDialog(false);
    };
  
    const handleConfirm = async () => {      
      console.log('Confirmed copy! Selected Rows:', _selectedRows);
      console.log('Confirmed copy! Selected folder:', folderStore.selectedFolder && folderStore.selectedFolder._id);
      try {

        const simulationId =  _selectedRows[0]?._id;
        const folderIds =  _selectedRows[0]?.folderIds || [];
        const folderId = folderStore?.selectedFolder?._id;

        if(simulationId && folderId) {
          
          if(!folderIds.includes(folderId)) {
            folderIds.push(folderId);
          }

          console.log(folderIds);

          await axios.patch('v1/simulations', {
            filter: {
              _id: simulationId
            },
            update: {
              $set: {
                folderIds: folderIds
              }
            }
          });

          mutate && (await mutate())
          enqueueSnackbar('Folder(s) have been copied successfully', { variant: 'success' })
          folderStore.selectedFolder = null;          
        }

      } catch(e) {

      }
      setOpenDialog(false);
    };

    /* examples to send requests to api

    1)
    const onClickSave = async () => {
      try {
        await axios.patch('v1/simulations', {
          filter: {
            _id: toJS(state.form._id),
          },
          update: {
            $set: {
              onSubmission: toJS(state.form.agreement),
            },
          },
        })
        mutate && (await mutate())
        enqueueSnackbar('onSubmission saved successfully', { variant: 'success' })
      } catch (e) {
        console.error(e)
        enqueueSnackbar('onSubmission saved failed', { variant: 'error' })
      }
    }    

    2)
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
    */

    return (
      <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between', // Adjusts children alignment
          backgroundColor: 'transparent',
          position: 'absolute',
          // transform: 'translate(-50%, 0%)',
          mt: 2,
          zIndex: 1000,   
          width: '30vw',
        }}
      >
      <SearchBar
        searchString={searchString}
        onChange={(e: any) => setSearchString(e.target.value)}
      />
      <Button 
        variant="outlined" 
        onClick={handleOpenDialog}
        // sx={{ marginLeft: 'auto' }}
        >Copy</Button>    
      </Box>       
      <ConfirmDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onConfirm={handleConfirm}
        title="Confirm Copy"
        message="Are you sure to copy the folder to the simulation?"
      />        
      <PaginationTable
        collectionName="simulations"
        version={1}
        params={{
          filter: { isDeleted: false, ...searchStringFilter, },
          options: { multi: true },
          sortBy, // sortBy from context          
        }}
        height={'calc(100vh - 210px)'}
        Table={Simulations}
        // state={state}
      />
      </>
    );
  };
  
  return (
    // <SortingProvider>
    <DataGridProvider>
    
      <InnerSimulationsView />
    
    </DataGridProvider>
    // </SortingProvider>  
  );
});

export default SimulationsView;
