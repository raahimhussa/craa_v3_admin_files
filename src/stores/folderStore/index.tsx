import FileSelect from 'src/ui/core/components/FileSelect/FileSelect'
import { FindingSeverity } from 'src/models/finding/finding.interface'
import Folder from 'src/models/folder'
import FolderRepository from 'src/repos/v2/folderRepository'
import { GenerateNodePropsParams } from 'src/ui/core/components/SortableTree/types'
import IFolder from 'src/models/folder/folder.interface'
import { IStore } from '../types'
import { RootStore } from '../root'
import axios from 'axios'
import { makeAutoObservable } from 'mobx'

import _ from 'lodash'
import identifiableInterface from 'src/commons/interfaces/identifiable.interface'

import {
  AdminLogManager,
  AdminLogTargetType,
} from 'src/classes/adminLogManager'
import { AdminLogScreen } from 'src/utils/status'
import ISimulation from 'src/models/simulation/simulation.interface'

export interface IFinding {
  readonly _id: any
  text: string
  severity: number
  seq: number
  cfr: string
  ich_gcp: string
  simDocId: string
  domainId: string
  simDocIds: string[]
  status: string
  isDeleted: boolean
  createdAt: Date
  updatedAt: Date
}

export default class FolderStore implements IStore {
  rootStore: RootStore
  folderRepository: FolderRepository
  folders: any = {}
  mutate: any
  form: IFolder = {
    _id: null,
    name: '',
    depth: 0,
    folderId: null,
    expanded: true,
    isActivated: false,
    label: ''
  }

  defaultForm: IFolder & identifiableInterface = _.cloneDeep(this.form)
  selectedFolder: IFolder | null = null
  // selectedSimulation: ISimulation | null = null

  menuItems = (
    isActivated: boolean,
    simDocsMutate: any,
    foldersMutate: any,
    simulationsMutate: any,
    simDocs: any,
    folders: any,
    // selectedSimulation: any
  ): Array<{
    name: string
    onClick: (props: GenerateNodePropsParams) => void
    type: string
    isCreate?: boolean
  }> => [   
    {
      name: 'New Folder',
      onClick: async (props) => {
        if (props.node.depth + 1 > 1) return console.error('maximum depth')
        const folder = await this.create(props.node._id, props.node.depth + 1)

        await simDocsMutate()

        await foldersMutate()

        return (folder as any)._id
      },
      type: 'folder',
      isCreate: true,
    },
    {
      name: 'Resources',
      onClick: async (props) => {
        this.rootStore.findingStore.resetForm()
        this.rootStore.findingStore.selectedSimDoc = props.node
        this.rootStore.folderStore.selectedFolder = null;
      },
      type: 'document',
    },
    {
      name: 'New Document',
      onClick: async (props) => {
        console.log("New Document: ", props)
        try {
          const simDocId = await this.rootStore.simDocStore.create(
            props.node._id
          )

          // if(simDocId) {
          //   const logObj = {
          //     screen: AdminLogScreen.SimResources,
          //     target: {
          //       type: AdminLogTargetType.SimResources,   
          //       _type: 'doc',       
          //       _id: props.node._id || null,
          //       sid: props.selectedSimulationId,
          //       sname: props.selectedSimulation.name,
          //       origin: props.node.title || props.node.name,                
          //       message: 'doc added',
          //       _key: 'doc_add'
          //     },
          //   }

          //   const adminLogManager = AdminLogManager.getInstance();
          //   adminLogManager?.createAddLog(logObj) 
          // }

          await simDocsMutate()

          await foldersMutate()

          return (simDocId as any)._id
        } catch (error) {
          if (axios.isAxiosError(error)) return error.response
        }
      },
      type: 'folder',
      isCreate: true,
    },
    {
      name: 'Divider',
      onClick: () => {},
      type: 'all',
    },
    {
      name: 'Copy To',
      onClick: async (props) => {
        // console.log("CopyTo: ", props);
        // if (props.node.depth > 0) {
          
        // }
        // this.rootStore.folderStore.resetForm()
        // this.rootStore.folderStore.selectedFolder = props.node;        
        // this.rootStore.findingStore.selectedSimDoc = null;       
      },
      type: 'folder',
    }, 
    {
      name: 'Divider',
      onClick: () => {},
      type: 'all',      
    },        
    {
      name: isActivated ? 'Deactivate' : 'Activate',
      onClick: async (props) => {
        try {
          await this.rootStore.simDocStore.update(props.node._id, {
            $set: {
              isActivated: !isActivated,
            },
          })

          // console.log(props.dataBySimulation, props.simulation, props.simulations)
          console.log("folderStore index::props: ", props, props.selectedSimulation)
          const eventMsg = isActivated ? 'deactivated' : 'activated';

          const logObj = {
            screen: AdminLogScreen.SimResources,
            target: {
              type: AdminLogTargetType.SimResources,   
              _type: 'doc',       
              _id: props.node._id || null,
              sid: props.selectedSimulationId,
              sname: props.selectedSimulation.name,
              origin: props.node.title || '',                
              message: 'doc ' + eventMsg,
              _key: 'doc_actv',
              fname: props.parentNode?.name,
              fid: props.parentNode?._id
            },
          }

          const adminLogManager = AdminLogManager.getInstance();          
          if(isActivated) {
            adminLogManager?.createDeactivateLog(logObj)
          } else {
            adminLogManager?.createActivateLog(logObj)
          }

        } catch (error) {
          if (axios.isAxiosError(error)) return error.response
        }

        await simDocsMutate()

        await foldersMutate()
      },
      type: 'document',
    },
    {
      name: isActivated ? 'Deactivate' : 'Activate',
      onClick: async (props) => {
        try {
          // console.log("Activate from FolderStore: ", props);
          // const { enqueueSnackbar } = useSnackbar()
          // enqueueSnackbar(
          //   'All documents must be activated before activating this folder',
          //   { variant: 'error' }
          // )
          // if (
          //   props.simDocs.find(
          //     (doc: any) => doc.folderId === props.node._id
          //   ) === undefined &&
          //   props.folders.find(
          //     (folder: any) => folder.folderId === props.node._id
          //   ) === undefined
          // ) {
          //   enqueueSnackbar(
          //     'All documents must be activated before activating this folder',
          //     { variant: 'error' }
          //   )
          //   return
          // } else {
          //   const docs = props.simDocs.filter(
          //     (doc: any) => doc.folderId === props.node._id
          //   )
          //   if (
          //     docs !== undefined &&
          //     docs.find((doc: any) => doc.isActivated === true) === undefined
          //   ) {
          //     enqueueSnackbar(
          //       'All documents must be activated before activating this folder',
          //       { variant: 'error' }
          //     )
          //     return
          //   }
          //   const folders = props.folders.filter(
          //     (folder: any) => folder.folderId === props.node._id
          //   )
          //   if (
          //     folders !== undefined &&
          //     folders.find((folder: any) => folder.isActivated === true) ===
          //       undefined
          //   ) {
          //     enqueueSnackbar(
          //       'All documents must be activated before activating this folder',
          //       { variant: 'error' }
          //     )
          //     return
          //   }
          // }
          this.update(props.node._id, {
            $set: {
              isActivated: !isActivated,
            },
          })

          const eventMsg = isActivated ? 'deactivated' : 'activated';

          const logObj = {
            screen: AdminLogScreen.SimResources,
            target: {
              type: AdminLogTargetType.SimResources,   
              _type: 'folder',       
              _id: props.node._id || null,
              sid: props.selectedSimulationId,
              sname: props.selectedSimulation.name,
              origin: props.node.name || '',                
              message: 'folder ' + eventMsg,
              _key: 'folder_actv'
            },
          }

          const adminLogManager = AdminLogManager.getInstance();
          if(!isActivated) {
            adminLogManager?.createActivateLog(logObj)
          } else {
            adminLogManager?.createDeactivateLog(logObj)
          }          
        } catch (error) {
          if (axios.isAxiosError(error)) return error.response
        }

        await simDocsMutate()

        await foldersMutate()
      },
      type: 'folder',
    },
    {
      name: 'Delete',
      onClick: async (props: any) => {    
                                  
        const _kind = props.node.kind === 'Document' ? 'doc' : 'folder'
        
        let logObj: any = {
          screen: AdminLogScreen.SimResources,
          target: {
            type: AdminLogTargetType.SimResources,   
            _type: _kind,       
            _id: props.node._id || null,
            sid: props.selectedSimulationId,
            sname: props.selectedSimulation.name,
            origin: props.node.title || props.node.name,                
            message: _kind + ' deleted',
            _key: _kind + '_del'
          },
        }  
        
        if(_kind === 'doc') {
          logObj['target']['fname'] = props.parentNode?.name;
          logObj['target']['fid'] = props.parentNode?._id;
        }

        if (props.node instanceof Folder) {
          props.selectedSimulationId &&
            props.path.length === 1 &&
            (await axios.patch('v1/simulations', {
              filter: {
                _id: props.selectedSimulationId,
              },
              update: {
                $pull: { folderIds: props.path[props.path.length - 1] },
              },
            }))
          props.selectedSimulationId &&
            props.path.length === 1 &&
            (await simulationsMutate())
          await this.update(props.node._id, { folderId: '' })

          // logObj['_type'] = 'folder';          
          // logObj['message'] = 'Folder deleted';          
          // logObj['_key'] = 'folder_del';          
        } else {
          await this.rootStore.simDocStore.update(props.node._id, {          
            folderId: '',
          })
        }
        // console.log(props.node);

        const adminLogManager = AdminLogManager.getInstance();
        adminLogManager?.createDeleteLog(logObj)

        await simDocsMutate()
        await foldersMutate()
      },
      type: 'all',
    },
  ]

  constructor(rootStore: RootStore, folderRepository: FolderRepository) {
    this.rootStore = rootStore
    this.folderRepository = folderRepository
    makeAutoObservable(this)
  }

  loadData(data: any) {
    this.folders = data.map((folder: IFolder) => new Folder(this, folder))
  }

  *delete(folderId: string) {
    try {
      yield this.folderRepository.update({
        filter: { _id: folderId },
        update: { isDeleted: true },
      })
    } catch (error) {
      throw error
    }
    this.mutate()
  }

  *update(folderId: string, update: any) {    
    try {
      yield this.folderRepository.update({
        filter: { _id: folderId },
        update,
      })
    } catch (error) {
      throw error
    }
    this.mutate()
  }

  *updateAll(filter: any, update: any) {
    try {
      yield this.folderRepository.update({
        filter,
        update,
      })
    } catch (error) {
      throw error
    }
    this.mutate()
  }

  *create(folderId = null, depth = 0) {
    this.form.folderId = folderId
    this.form.depth = depth
    // this.form.name = "Untitled"
    this.form.label = "Unlabeled"
    let newFolder: IFolder | null = null
    try {
      newFolder = yield this.folderRepository.create(this.form)
      // console.log("folderStore::create newFolder: ", newFolder)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error.response)
      }
    }
    return newFolder
  }

  resetForm() {
    this.form = _.cloneDeep(this.defaultForm)
  }  
}
