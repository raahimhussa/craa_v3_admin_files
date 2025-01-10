import '@nosferatu500/react-sortable-tree/style.css'

import {
  Add,
  BookRounded,
  CloseFullscreen,
  FolderRounded,
  Fullscreen,
  Remove,
  Tonality,
  UnfoldLess,
  UnfoldMore,
  VerticalAlignBottom,
  VerticalAlignTop,
  Visibility,
  VisibilityOff,
  LabelOutlined,
} from '@mui/icons-material'
import { Box, Paper } from '@mui/material'
import _, { stubTrue } from 'lodash'
import { blue, green, grey, orange, red, yellow } from '@mui/material/colors'
import { useEffect, useState } from 'react'

import Button from '@mui/material/Button'
import { DocumentType } from 'src/utils/status'
import Filters from './Filters/Filters'
import Finding from './Finding/Finding'
import Findings from './Findings/Findings'
import Folder from 'src/models/folder'
import FolderStore from 'src/stores/folderStore'
import { GenerateNodePropsParams } from 'src/ui/core/components/SortableTree/types'
import IDomain from 'src/models/domain/domain.interface'
import IFolder from 'src/models/folder/folder.interface'
import { ISimDoc } from 'src/models/simDoc/types'
import Search from './Search/Search'
import SimDoc from 'src/models/simDoc'
import SimDocStore from 'src/stores/simDocStore'
import Simulation from 'src/models/simulation'
import SimulationSelect from './SimulationSelect/SimulationSelect'
import SortableTree from 'src/ui/core/components/SortableTree/SortableTree'
import Swal from 'sweetalert2'
import TreeButtons from './TreeButtons/TreeButtons'
import { TreeInput } from './TreeInput/TreeInput'
import axios from 'axios'
import download from 'js-file-download'
import moment from 'moment'
import { observer } from 'mobx-react'
import { toJS } from 'mobx'
import { useRootStore } from 'src/stores'
import { useSnackbar } from 'notistack'
import { LabelInput } from './TreeInput/LabelInput'
// import Simulations from 'src/ui/pages/admin/Simulations/Simulations'
import Simulations from './Simulations/Simulations'

import { useUser } from '@hooks'

function SimDocsView(props: {
  simulations: Simulation[]
  simulationsMutate: any
  simDocs: ISimDoc[]
  simDocsMutate: any
  foldersMutate: any
  folders: IFolder[]
  onClickNewFolder: any
  domains: IDomain[]
  selectedSimulationId: string
  setSelectedSimulationId: any
  selectedSimulation: any,
  // setSelectedSimulation: any,   
  dataBySimulation: any
}) {
  const {
    simulations,
    simulationsMutate,
    folders,
    simDocs,
    onClickNewFolder,
    foldersMutate,
    simDocsMutate,
    domains,
    selectedSimulationId,
    setSelectedSimulationId,
    selectedSimulation,
    // setSelectedSimulation,    
    dataBySimulation
  } = props

  const { data: user, isLoading } = useUser()

  const { folderStore, simDocStore, findingStore, uiState } = useRootStore()

  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  const [hideInactivate, setHideInactivate] = useState<boolean>(false)

  // 0: none, 1,2: name, 3,4: date created
  const [selectedOption, setSelectedOption] = useState<number>(0)
  const [searchString, setSearchString] = useState<string>('')
  const [recentlyAddedNodeId, setRecentlyAddedNodeId] = useState<string>('')

  // const [selectedSimulation, setSelectedSimulation] = useState<any>('')
  // console.log("SimDocsView1::selectedSim: ", selectedSimulation)

  const handleChangeSelectedOption = (e: any) => {
    setSelectedOption(e.target.value)
  }
  const handleChangeSearchString = (e: any) => {
    setSearchString(e.target.value)
  }
  const { enqueueSnackbar } = useSnackbar()

  // type: 0 = all ,1 = folder, 2 = document
  const sortBy = (type: number) => (a: any, b: any) => {
    if (type === 0) {
      switch (selectedOption) {
        case 0: {
          if (a.seq === b.seq) return a.createdAt > b.createdAt ? 1 : -1
          return a.seq > b.seq ? 1 : -1
        }
        default: {
          if (a.seq === b.seq) return a.createdAt > b.createdAt ? 1 : -1
          return a.seq > b.seq ? 1 : -1
        }
      }
    } else if (type === 1) {
      switch (selectedOption) {
        case 0: {
          return 1
        }
        case 1: {
          return a.name > b.name ? -1 : 1
        }
        case 2: {
          return a.name > b.name ? 1 : -1
        }
        case 3: {
          return a.createdAt > b.createdAt ? 1 : -1
        }
        case 4: {
          return a.createdAt > b.createdAt ? -1 : 1
        }
        default: {
          if (a.seq === b.seq) return a.createdAt > b.createdAt ? 1 : -1
          return a.seq > b.seq ? 1 : -1
        }
      }
    } else if (type === 2) {
      switch (selectedOption) {
        case 0: {
          if (a.seq === b.seq) return a.createdAt > b.createdAt ? 1 : -1
          return a.seq > b.seq ? 1 : -1
        }
        case 1: {
          return a.title > b.title ? -1 : 1
        }
        case 2: {
          return a.title > b.title ? 1 : -1
        }
        case 3: {
          return a.createdAt > b.createdAt ? 1 : -1
        }
        case 4: {
          return a.createdAt > b.createdAt ? -1 : 1
        }
        default: {
          if (a.seq === b.seq) return a.createdAt > b.createdAt ? 1 : -1
          return a.seq > b.seq ? 1 : -1
        }
      }
    }
    return 1
  }

  const filterNodes = (node: any): boolean => {
    const isFolder = node instanceof Folder
    if (!node) return false
    // If the node's title includes the search term, return true
    if (isFolder) {
      if (node.name.toLowerCase().includes(searchString.toLowerCase())) {
        return true
      }

      // If the node has children, recursively filter its children
      if (node.children && node.children.length > 0) {
        const filteredChildren = node.children.filter(filterNodes)

        // If any of the children match the search term, return true
        if (filteredChildren.length > 0) {
          return true
        }
      }

      // If the node and its children don't match the search term, return false
      return false
    } else {
      if (node.title.toLowerCase().includes(searchString.toLowerCase())) {
        return true
      }

      // If the node has children, recursively filter its children
      if (node.children && node.children.length > 0) {
        const filteredChildren = node.children.filter(filterNodes)

        // If any of the children match the search term, return true
        if (filteredChildren.length > 0) {
          return false
        }
      }

      // If the node and its children don't match the search term, return false
      return false
    }
  }

  const getTreeData = () => {
    const rawFolders = {
      0: selectedSimulationId
        ? simulations
            .find((_simulation) => _simulation._id === selectedSimulationId)
            ?.folderIds?.map((_folderId) =>
              folders.find((_folder) => _folder._id === _folderId)
            )
            .filter(
              (folder) =>
                folder &&
                folder.depth === 0 &&
                (hideInactivate ? folder.isActivated : true)
            )
            .map((folder) => new Folder(folderStore, folder as IFolder))
            .sort(sortBy(1))
        : folders
            .filter(
              (folder) =>
                folder.depth === 0 &&
                (hideInactivate ? folder.isActivated : true)
            )
            .map((folder) => new Folder(folderStore, folder))
            .sort(sortBy(1)),
      1: folders
        .filter(
          (folder) =>
            folder.depth === 1 && (hideInactivate ? folder.isActivated : true)
        )
        .map((folder) => new Folder(folderStore, folder))
        .sort(sortBy(0)),
      2: folders
        .filter(
          (folder) =>
            folder.depth === 2 && (hideInactivate ? folder.isActivated : true)
        )
        .map((folder) => new Folder(folderStore, folder))
        .sort(sortBy(0)),
    }

    rawFolders[1].forEach((folder_1) => {
      folder_1.children = rawFolders[2].filter(
        (folder) =>
          folder.folderId === folder_1._id &&
          (hideInactivate ? folder.isActivated : true)
      )
      folder_1.children = folder_1.children.concat(
        simDocs
          .filter(
            (simDoc) =>
              simDoc.folderId === folder_1._id &&
              (hideInactivate ? simDoc.isActivated : true)
          )
          .map((simDoc) => new SimDoc(simDocStore, simDoc))
          .sort(sortBy(0))
      )
      // .sort(sortBy(0))
    })

    rawFolders[0]?.forEach((folder_0) => {
      folder_0.children = rawFolders[1].filter(
        (folder) =>
          folder.folderId === folder_0._id &&
          (hideInactivate ? folder.isActivated : true)
      )
      folder_0.children = folder_0.children.concat(
        simDocs
          .filter(
            (simDoc) =>
              simDoc.folderId === folder_0._id &&
              (hideInactivate ? simDoc.isActivated : true)
          )
          .map((simDoc) => new SimDoc(simDocStore, simDoc))
          .sort(sortBy(0))
      )
      // .sort(sortBy(0))
    })
    const _treeData = rawFolders[0]

    if (!_treeData) return []
    return _treeData?.filter((_folder: IFolder) => {
      if (!selectedSimulationId) return true
      const simulation = simulations.find(
        (_simulation) => _simulation._id === selectedSimulationId
      )
      return simulation?.folderIds?.includes(_folder._id)
    })
  }

  useEffect(() => {
    folderStore.mutate = foldersMutate
    simDocStore.mutate = simDocsMutate

    return () => {
      // console.log("FolderStore: ", folderStore);
      // folderStore.selectedFolder = null
      findingStore.selectedSimDoc = null
    }
  }, [])

  const onClickExport = async () => {
    const { data } = await axios.get('v1/simDocs/excel', {
      responseType: 'blob',
    })
    download(data, `simDocs-${moment(new Date()).format('DD-MMM-YYYY')}.xlsx`)
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Box
        sx={{
          width: '570px',
          height: 'calc(100vh - 150px)',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ p: 1 }} />
        <Box sx={{ display: 'flex', ml: 1 }}>
          <Button
            variant="contained"
            onClick={async () => {
              const folderId = await onClickNewFolder(selectedSimulationId)
              setRecentlyAddedNodeId(folderId)
            }}
          >
            New Folder
          </Button>
          <Button sx={{ ml: 1 }} variant="contained" onClick={onClickExport}>
            Export
          </Button>
        </Box>
        <Box sx={{ display: 'flex', mt: 2 }}>
          <Box sx={{ ml: 1 }}>
            <SimulationSelect
              selectedSimulationId={selectedSimulationId}
              setSelectedSimulationId={setSelectedSimulationId}                         
            />
          </Box>
          <button
            onClick={() => {
              setHideInactivate((prev) => !prev)
            }}
            style={{
              backgroundColor: 'white',
              border: '1px solid grey',
              marginLeft: '16px',
              cursor: 'pointer',
            }}
          >
            {hideInactivate ? <VisibilityOff /> : <Visibility />}
          </button>
          <button
            onClick={async () => {
              isExpanded
                ? await folderStore.updateAll({}, { expanded: false })
                : await folderStore.updateAll({}, { expanded: true })
              await setIsExpanded((prev) => !prev)
            }}
            style={{
              backgroundColor: 'white',
              border: '1px solid grey',
              marginLeft: '8px',
              marginRight: '8px',
              cursor: 'pointer',
            }}
          >
            {isExpanded ? <Remove /> : <Add />}
          </button>
        </Box>
        <Box sx={{ ml: 1, mt: 1, display: 'flex' }}>
          <Search
            searchString={searchString}
            handleChangeSearchString={handleChangeSearchString}
          />
          <Filters
            selectedOption={selectedOption}
            handleChangeSelectedOption={handleChangeSelectedOption}
          />
        </Box>
        <SortableTree
          style={{ height: 'calc(100vh - 300px)' }}
          generateNodeProps={(params) => {
            const isFolder = params.node.store instanceof FolderStore
            const fontSize = 'small'
            const isDocumentEmpty =
              params.node.files?.length === 0 && params.node.documentId === null

            let icon = null             
            const label_icon = <LabelOutlined fontSize={fontSize} htmlColor={orange[500]} />
            
            if (isFolder) {
              icon = (
                <FolderRounded fontSize={fontSize} htmlColor={orange[500]} />
              )
            } else if (
              params.node.kind === DocumentType.Document ||
              params.node.kind === DocumentType.Html
            ) {
              icon = (
                <BookRounded
                  fontSize={fontSize}
                  htmlColor={isDocumentEmpty ? grey[500] : blue[500]}
                />
              )
            } else if (params.node.kind === DocumentType.StudyMedication) {
              icon = <Tonality fontSize={fontSize} htmlColor={green[500]} />
            } else if (params.node.kind === DocumentType.RescueMedication) {
              icon = <Tonality fontSize={fontSize} htmlColor={red[700]} />
            }

            return {
              title: (
                <>
                <TreeInput
                  icon={icon}
                  //@ts-ignore
                  params={params}
                  isFolder={isFolder}
                  recentlyAddedNodeId={recentlyAddedNodeId}
                  selectedSimulationId={selectedSimulationId}
                  selectedSimulation={selectedSimulation}                  
                />
                <LabelInput
                  icon={label_icon}
                  //@ts-ignore
                  params={params}
                  isFolder={isFolder}
                  recentlyAddedNodeId={recentlyAddedNodeId}
                />
                </>                
              ),
              buttons: [
                <TreeButtons
                  {...params}
                  simDocsMutate={simDocsMutate}
                  foldersMutate={foldersMutate}
                  simulationsMutate={simulationsMutate}
                  setRecentlyAddedNodeId={setRecentlyAddedNodeId}
                  simDocs={simDocs}
                  folders={folders}
                  selectedSimulationId={selectedSimulationId}
                  selectedSimulation={selectedSimulation}
                  dataBySimulation={dataBySimulation}
                  // updateTree={() => setTreeData(getTreeData())}
                />,
              ],
              style: {
                minHeight: '100%',
                backgroundColor:
                  params.node._id === findingStore.selectedSimDoc?._id
                    ? 'rgba(255,255,0,0.5)'
                    : 'white',
                opacity: params.node.isActivated ? 1 : 0.4,
              },
            }
          }}
          onVisibilityToggle={async (props) => {
            if (props.node.store instanceof FolderStore) {
              await folderStore.update(props.node._id, {
                expanded: !props.node.expanded,
              })
            }
          }}
          maxDepth={3}
          canDrag={(canDropParams) => (selectedSimulationId ? true : false)}
          treeData={getTreeData().filter((node) => filterNodes(node))}
          onMoveNode={async (params) => {
            const { node, nextParentNode } = params
            if (node.store instanceof FolderStore) {
              if (nextParentNode) {
                await folderStore.update(node._id, {
                  $set: {
                    folderId: nextParentNode._id,
                    depth: nextParentNode.depth + 1,
                  },
                })
              } else {
                await folderStore.update(node._id, {
                  $set: {
                    folderId: null,
                    depth: 0,
                  },
                })
              }
              await foldersMutate()
            } else if (node.store instanceof SimDocStore) {
              await simDocStore.update(node._id, {
                $set: {
                  folderId: nextParentNode._id,
                },
              })
              await simDocsMutate()
            }
            if (nextParentNode && selectedSimulationId) {
              const siblings = params.nextParentNode.children
              const resolver = siblings.map(
                async (sibling: any, index: number) => {
                  if (sibling.store instanceof FolderStore) {
                    await axios.patch('/v2/folders', {
                      filter: {
                        _id: sibling._id,
                      },
                      update: {
                        $set: {
                          seq: index,
                        },
                      },
                    })
                  }
                  if (sibling.store instanceof SimDocStore) {
                    await axios.patch('/v1/simDocs', {
                      filter: {
                        _id: sibling._id,
                      },
                      update: {
                        $set: {
                          seq: index,
                        },
                      },
                    })
                  }
                }
              )
              await Promise.all(resolver)
              await foldersMutate()
              await simDocsMutate()
            }
            // await setTreeData(getTreeData())
          }}
          canNodeHaveChildren={(node) => {
            if (node.store instanceof FolderStore) return true
            return false
          }}
          onChange={async (changedTreeData) => {
            if (selectedSimulationId) {
              await axios.patch('/v1/simulations', {
                filter: {
                  _id: selectedSimulationId,
                },
                update: {
                  $set: {
                    folderIds: changedTreeData.map((ctd: any) => ctd._id),
                  },
                },
              })
              await simulationsMutate()
            }
            // setTreeData(changedTreeData)
          }}
        />
      </Box>
      <Box sx={{ height: 'calc(100vh - 150px)', overflow: 'scroll', flex: 1 }}>
        {folderStore.selectedFolder?._id ?        
        <Simulations />        
        : null}
        {findingStore.selectedSimDoc?._id ? 
        <Finding
          simDocs={simDocs}
          domains={domains}
          simulationId={selectedSimulationId}
          simulationVisibleId={
            simulations.find(
              (_simulation) => _simulation._id === selectedSimulationId
            )?.visibleId || 0
          }
        />
        : null }
        {/* {findingStore.selectedSimDoc && <Findings buttons={false} simDoc={findingStore.selectedSimDoc} />} */}
      </Box>
    </Box>
  )
}
export default observer(SimDocsView)
