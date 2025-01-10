import {
  Box,
  Button,
  Dialog,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'

import File from 'src/models/file'
import FileSelect from '@components/FileSelect/FileSelect'
import PDFViewer from './PDFViewer/PDFViewer'
import SimDoc from 'src/models/simDoc'
import _ from 'lodash'
import compose from '@shopify/react-compose'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'
import { withFind } from '@hocs'
import withFindOne from 'src/hocs/withFindOne'
import Documents from 'src/ui/pages/admin/Documents/Documents'
import Document from 'src/models/document'
import { RemoveRedEye } from '@mui/icons-material'
import Preview from '@components/DocumentBuilder/Preivew'
import palette from 'src/theme/palette'

type Props = {
  simDocId: string
  simDoc: SimDoc[]
  simDocMutate: any
  files: File[]
  documents: Document[]
}

function SelectedHtmlView({
  simDocId,
  simDoc,
  simDocMutate,
  files,
}: // documents,
Props) {
  const {
    uiState: { modal },
    findingStore,
    simDocStore,
    documentStore,
  } = useRootStore()
  const [open, setOpen] = useState<boolean>(false)
  const [search, setSearch] = useState<string>('')
  const [doc, setDoc] = useState<any>(null)
  const [documents, setDocuments] = useState<any>([])
  useEffect(() => {
    if (simDoc[0]?.documentId !== null) {
      getDoc(simDoc[0]?.documentId)
    }
  }, [simDoc])

  useEffect(() => {
    ;(async () => {
      const docs = await documentStore.documentRepository.find({
        filter: {
          isDeleted: false,
          isActivated: true,
        },
      })
      setDocuments(docs.data)
    })()
  }, [])

  //@ts-ignore
  // const doc = simDoc?.[0]?.document !== undefined ? simDoc?.[0]?.document : null

  const getDoc = async (docId: string) => {
    const { data } = await documentStore.documentRepository.findOne({
      filter: {
        _id: docId,
      },
    })

    //@ts-ignore
    setDoc(data[0])
  }

  const highlightedText = (text: any, query: any) => {
    if (query !== '' && text?.toString()?.toLowerCase()?.includes(query)) {
      const parts =
        text?.toString()?.split(new RegExp(`(${query})`, 'gi')) || []

      return (
        <>
          {parts.map((part: any, index: any) =>
            part.toLowerCase() === query.toLowerCase() ? (
              <mark key={index}>{part}</mark>
            ) : (
              part
            )
          )}
        </>
      )
    }

    return text
  }

  const onClickSelectFile = async (docId: string) => {
    const data = await simDocStore.update(simDocId, {
      documentId: docId,
    })
    getDoc(docId)
    findingStore.selectedSimDocMutate = simDocMutate
    setOpen(false)
  }

  const onClickSelect = () => {
    findingStore.selectedSimDocMutate = simDocMutate
    setOpen(true)
  }

  const onCloseDialogue = () => {
    findingStore.selectedSimDocMutate = null
    setOpen(false)
  }

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          height: '64px',
        }}
      >
        <Box />
        <Box>
          <Button
            sx={{ marginRight: '12px' }}
            disabled={!doc}
            onClick={() => {
              //@ts-ignore
              modal.open('Preview', <Preview document={doc} />)
            }}
            variant="contained"
          >
            View File
          </Button>
          <Button onClick={onClickSelect} variant="contained">
            Select File
          </Button>
        </Box>
      </Box>
      <Box>
        <Box>
          <Typography sx={{ fontSize: '11px', color: 'gray' }}>Name</Typography>
          <Typography>{doc?.title ? doc?.title : '-'}</Typography>
          <Divider />
        </Box>
        <Box>
          <Typography sx={{ fontSize: '11px', color: 'gray' }}>Type</Typography>
          <Typography>HTML Document</Typography>
          <Divider />
        </Box>
      </Box>
      <Dialog
        open={open}
        onClose={onCloseDialogue}
        fullWidth={true}
        maxWidth={'md'}
      >
        <Box
          sx={{
            p: 2,
            position: 'relative',
          }}
        >
          <Button
            variant="contained"
            sx={{
              position: 'absolute',
              right: 0,
              mr: 2,
              bgcolor: palette.light.button.red,
            }}
            onClick={onCloseDialogue}
          >
            Close
          </Button>
          <TextField
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
            }}
            size="small"
            sx={{ width: 350, mb: 1 }}
            placeholder={'Search'}
          />
          <Table className="docSelectTable">
            <TableHead>
              <TableCell>Title</TableCell>
              <TableCell>Pages</TableCell>
              <TableCell>Created Date</TableCell>
              <TableCell>Updated Date</TableCell>
              <TableCell>Preview</TableCell>
              <TableCell>Select</TableCell>
            </TableHead>
            <TableBody>
              {documents
                .filter((_variable: any) => {
                  if (
                    _variable.title
                      ?.toLowerCase()
                      .includes(search.toLowerCase())
                  )
                    return true
                  return false
                })
                .map((doc: any) => {
                  return (
                    <TableRow>
                      <TableCell>
                        {highlightedText(doc.title, search || '')}
                      </TableCell>
                      <TableCell>
                        {
                          doc.versions[doc.versions.length - 1][
                            doc.versions[doc.versions.length - 1].length - 1
                          ].pages.length
                        }
                      </TableCell>
                      <TableCell>{doc.createdAt}</TableCell>
                      <TableCell>{doc.updatedAt}</TableCell>
                      <TableCell>
                        <Button
                          onClick={() => {
                            //@ts-ignore
                            modal.open('Preview', <Preview document={doc} />)
                          }}
                        >
                          <RemoveRedEye />
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          onClick={() => {
                            onClickSelectFile(doc._id)
                          }}
                        >
                          Select
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
            </TableBody>
          </Table>
        </Box>
      </Dialog>
    </Box>
  )
}
export default compose<any>(
  withFind({
    collectionName: 'documents',
    getFilter: (props: any) => {
      if (props.simDoc.length > 0) {
        const file =
          props.simDoc?.[0]?.files?.length > 0 ? props.simDoc[0].files[0] : null
        return {
          _id: file?._id,
          isDeleted: false,
        }
      }
      return {
        _id: null,
        isDeleted: false,
      }
    },
  })
)(observer(SelectedHtmlView))
