import {
  Box,
  Button,
  Divider,
  Grid,
  MenuItem,
  TextField,
  Typography,
  Select,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
  Skeleton,
} from '@mui/material'
import { observer, useLocalObservable } from 'mobx-react'
import { Fragment, useEffect, useState } from 'react'
import { DndProvider, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import DocEditor from '@components/DocEditor/DocEditor'
import DocumentPage from 'src/models/documentPage'
import Page from './Page'
import PostAddIcon from '@mui/icons-material/PostAdd'
import { useRootStore } from 'src/stores'
import InfoIcon from '@mui/icons-material/Info'
import moment from 'moment'
import { Save } from '@mui/icons-material'
import palette from 'src/theme/palette'
import { useSnackbar } from 'notistack'
import DocEditorSync from '@components/DocEditorSync/DocEditorSync'

function DocumentBuilderView(props: any) {
  const { folders, mutate, documentVariableGroups, type } = props
  console.log(documentVariableGroups)
  const {
    uiState: { modal, documents },
    documentPageStore,
    documentStore,
    userStore,
  } = useRootStore()
  const [selectedPage, setSelectedPage] = useState(documentStore.selectedPage)
  const [pages, setPages] = useState(documentStore.pages)
  const [versions, setVersions] = useState<any[]>([])
  const [autoSaved, setAutoSaved] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)
  const [selectedVersion, setSelectedVersion] = useState(
    documentStore.form.versions.length - 1
  )
  const { enqueueSnackbar } = useSnackbar()

  async function autoSave() {
    const saved = await documentStore.autoSave()
    if (saved) {
      setAutoSaved(true)
    }
    setTimeout(autoSave, 60000)
  }

  useEffect(() => {
    setPages(documentStore.pages)
  }, [documentStore.pages])

  useEffect(() => {
    setSelectedPage(documentStore.selectedPage)
  }, [documentStore.selectedPage])

  useEffect(() => {
    if (documentStore.form._id) {
      documentStore.selectedPage = 0
      documentStore.pages = []
      documentStore.form.versions[selectedVersion][
        documentStore.form.versions[selectedVersion].length - 1
      ]?.pages.map((page: any) => {
        documentStore.pages.push(page)
      })
    }
  }, [selectedVersion])

  const moveCard = (item: any, dragIndex: number) => {
    const index = documentStore.pages.indexOf(item.page)
    let newOrder = [...documentStore.pages]
    newOrder.splice(index, 1)
    newOrder.splice(dragIndex, 0, item.page)
    newOrder.map((page: any, i: any) => {
      page.order = i
    })
    documentStore.pages = newOrder
    setPages(newOrder)
  }

  const updateOrders = () => {
    // pages.map((page: any, index: any) => {
    //   updateOrder(page, index);
    // });
  }

  useEffect(() => {
    let arr: any = []
    documentStore.form.versions.map(async (version: any) => {
      console.log(version)
      const user = await userStore.repository.findOne({
        filter: {
          _id: version[0].userId,
        },
      })
      arr.push({
        user: user.data.name,
        date: version[0].date,
      })
      setVersions([...versions, ...arr].sort((a, b) => b.date - a.date))
    })
    setTimeout(() => {
      autoSave()
    }, 60000)
  }, [])

  return (
    <Box sx={{ bgcolor: 'white', height: '100vh', width: '100vw' }}>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          py: 1,
          px: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
          }}
        >
          <Typography variant="h5">Document Builder</Typography>
          <Button
            sx={{
              minWidth: '10px',
            }}
            onClick={async () => {
              const saved = await documentStore.byUserSave(
                selectedVersion,
                documentStore.form
              )
              if (saved) {
                enqueueSnackbar('Document saved.', {
                  variant: 'success',
                })
              } else {
                enqueueSnackbar('Please try again later.', {
                  variant: 'error',
                })
              }
            }}
          >
            <Save
              sx={{
                color: palette.light.button.green,
              }}
            />
          </Button>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Button
            sx={{
              mr: 1,
            }}
            onClick={() => {
              setOpen(true)
            }}
          >
            Cancel
          </Button>
          <Dialog
            open={open}
            onClose={() => {
              setOpen(false)
            }}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{'Are you sure?'}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                You might lose your work. Please save your changes.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  setOpen(false)
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (
                    documentStore.form.versions.length === 1 &&
                    documentStore.form.versions[0].length === 1
                  ) {
                    documentStore.delete(documentStore.form._id)
                  }
                  documentStore.resetForm()
                  documentStore.pages = []
                  modal.close()
                }}
                autoFocus
                sx={{ color: 'red' }}
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>
          <Button
            variant="contained"
            onClick={async () => {
              // await documentStore.edit(documentStore.form)
              if (documentStore.form._id !== undefined) {
                await documentStore.edit(documentStore.form)
              } else {
                await documentStore.save()
              }
              // location.reload()
              modal.close()
            }}
          >
            Save
          </Button>
        </Box>
      </Box>
      <Divider />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          mt: 1,
          height: 'calc(100vh - 46px)',
        }}
      >
        <Box
          sx={{
            width: '80%',
            p: '1rem',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mb: 1,
            }}
          >
            <Box
              sx={{
                width:
                  documentStore.form.versions.length !== 1 ? '83.5%' : '100%',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <TextField
                className="title"
                value={documentStore.form.title}
                onChange={(e) => {
                  documentStore.form.title = e.target.value
                }}
                label="Title"
                sx={{
                  width: '80%',
                }}
              />
              <Box
                sx={{
                  position: 'relative',
                  width: '19%',
                }}
              >
                <Typography
                  sx={{
                    position: 'absolute',
                    marginTop: '-9px',
                    bgcolor: 'white',
                    zIndex: 2,
                    marginLeft: '10px',
                    fontSize: '0.8rem',
                  }}
                >
                  Group
                </Typography>
                <Select
                  value={documentStore.form.groupId}
                  className="select"
                  fullWidth
                  onChange={(e) => {
                    documentStore.form.groupId = e.target.value
                  }}
                >
                  {documentVariableGroups.map((group: any) => (
                    <MenuItem value={group._id}>{group.name}</MenuItem>
                  ))}
                </Select>
              </Box>
            </Box>
            {documentStore.form.versions.length !== 1 ? (
              <Box
                sx={{
                  width: '15.5%',
                  position: 'relative',
                }}
              >
                <Typography
                  sx={{
                    position: 'absolute',
                    zIndex: 5,
                    left: '10px',
                    top: -8,
                    fontSize: 11.3,
                    fontWeight: 500,
                    bgcolor: 'white',
                    px: 0.3,
                  }}
                >
                  Version
                </Typography>
                <Select
                  label="Version"
                  sx={{
                    height: '45px',
                    width: '100%',
                  }}
                  className="versionSelect"
                  value={selectedVersion}
                  onChange={(e) => {
                    setSelectedVersion(Number(e.target.value))
                  }}
                >
                  {versions.reverse().map((version, index) => {
                    if (index !== versions.length - 1) {
                      return (
                        <MenuItem value={versions.length - index - 1}>
                          <Box
                            sx={{
                              width: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                            }}
                          >
                            <Typography>
                              v_{versions.length - index - 1}
                            </Typography>
                            <Tooltip
                              title={
                                <Fragment>
                                  <Box
                                    sx={{
                                      p: 1.5,
                                    }}
                                  >
                                    <Typography
                                      sx={{
                                        fontSize: '0.8rem',
                                      }}
                                    >
                                      User : {version.user}
                                    </Typography>
                                    <Typography
                                      sx={{
                                        fontSize: '0.8rem',
                                      }}
                                    >
                                      Date :{' '}
                                      {moment(version.date).format(
                                        'DD-MMM-YYYY'
                                      )}
                                    </Typography>
                                  </Box>
                                </Fragment>
                              }
                              arrow
                            >
                              <InfoIcon
                                sx={{
                                  fontSize: '1rem',
                                  color: '#a6a6a6',
                                }}
                              />
                            </Tooltip>
                          </Box>
                        </MenuItem>
                      )
                    }
                  })}
                </Select>
              </Box>
            ) : (
              <></>
            )}
          </Box>
          {/* @ts-ignore */}
          {documentStore.form.groupId !== '' ? (
            type === 'tinymce' ? (
              <DocEditor
                // @ts-ignore
                autoSaved={autoSaved}
                setAutoSaved={setAutoSaved}
                groupId={documentStore.form.groupId}
              />
            ) : (
              <DocEditorSync
                // @ts-ignore
                autoSaved={autoSaved}
                setAutoSaved={setAutoSaved}
                groupId={documentStore.form.groupId}
              />
            )
          ) : (
            <Box
              sx={{
                width: '100%',
                height: 'calc(100% - 120px)',
              }}
            >
              <Alert severity="warning">Please select a group.</Alert>
              <Skeleton
                variant="rectangular"
                width={'100%'}
                height={'100%'}
                sx={{
                  mt: 1,
                }}
              />
            </Box>
          )}
        </Box>
        <Box
          sx={{
            width: '20%',
          }}
        >
          <Box
            sx={{
              py: '0.5rem',
              pr: '0.5rem',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant="h6">Pages</Typography>
              <Button
                onClick={() => {
                  const page = new DocumentPage(documentPageStore, {
                    // _id: '',
                    order: documentStore.pages.length,
                    content: '',
                  })
                  documentStore.pages.push(page)
                  documentStore.selectedPage = page.order
                }}
              >
                <PostAddIcon />
              </Button>
            </Box>
          </Box>
          <Divider />
          <DndProvider backend={HTML5Backend}>
            <Box
              sx={{
                overflowY: 'scroll',
                height: 'calc(100% - 60px)',
              }}
            >
              <Box
                sx={{
                  mt: '1.5rem',
                  mx: '1.5rem',
                }}
              >
                {pages.map((page: any, index: any) => {
                  return (
                    <Page
                      page={page}
                      setSelectedPage={setSelectedPage}
                      selectedPage={selectedPage}
                      moveCard={moveCard}
                      updateOrders={updateOrders}
                      index={index}
                    />
                  )
                })}
              </Box>
            </Box>
          </DndProvider>
        </Box>
      </Box>
    </Box>
  )
}
export default observer(DocumentBuilderView)
