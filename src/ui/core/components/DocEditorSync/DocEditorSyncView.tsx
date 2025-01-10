import { observer, useLocalObservable } from 'mobx-react'
import '@toast-ui/editor/dist/toastui-editor.css'
import { MobxUtil } from '@utils'
import { reaction } from 'mobx'
import { useEffect, useRef, useState, useLayoutEffect } from 'react'
import { Editor } from '@tinymce/tinymce-react'
import { useRootStore } from 'src/stores'
import {
  Box,
  Button,
  Menu,
  MenuItem,
  Select,
  Skeleton,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  Table as MuiTable,
  TextField,
  Divider,
} from '@mui/material'
import DocumentVariableGroup from 'src/models/documentVariableGroup'
import DocumentVariable from 'src/models/documentVariable'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import palette from 'src/theme/palette'
import {
  HtmlEditor,
  Image,
  Inject,
  Link,
  QuickToolbar,
  RichTextEditorComponent,
  Toolbar,
  Table,
} from '@syncfusion/ej2-react-richtexteditor'
import { registerLicense } from '@syncfusion/ej2-base'
import { Check, ContentCopy, Toc, ZoomIn, ZoomOut } from '@mui/icons-material'

function DocEditorSyncView(props: any) {
  registerLicense(
    'Mgo+DSMBaFt+QHJqVk1hXk5Hd0BLVGpAblJ3T2ZQdVt5ZDU7a15RRnVfR11nSXxQdEBrX3dccg==;Mgo+DSMBPh8sVXJ1S0R+X1pFdEBBXHxAd1p/VWJYdVt5flBPcDwsT3RfQF5jTH5XdkdgW3pWdn1SRA==;ORg4AjUWIQA/Gnt2VFhiQlJPd11dXmJWd1p/THNYflR1fV9DaUwxOX1dQl9gSXtTckVhWn1beHNURmI=;MTkxNjI3OUAzMjMxMmUzMjJlMzNOcm8wM0lDejJGcVFaMXNja3htNmpweVpFcGtMUGZNdGVIcWRVQ05LbmtZPQ==;MTkxNjI4MEAzMjMxMmUzMjJlMzNZaWRSTHgvQ2U1WjVTNkRTQ3hkdEZ5dzQ4R2xTVmVNZXJZclNxL3J3S3BBPQ==;NRAiBiAaIQQuGjN/V0d+Xk9HfV5AQmBIYVp/TGpJfl96cVxMZVVBJAtUQF1hSn5WdkFjW3xcdXxSQWZe;MTkxNjI4MkAzMjMxMmUzMjJlMzNNVHg5VWZQNGZFSFJtRWg4Nm9nYm1YcjZsSm82QXNHVmpjbzFwalliT1hNPQ==;MTkxNjI4M0AzMjMxMmUzMjJlMzNvNHBtWnJTY3Y5M3dCSStWcUFSSkRMMmZZeUUyZ2puTWkxZlVCRFMwVnF3PQ==;Mgo+DSMBMAY9C3t2VFhiQlJPd11dXmJWd1p/THNYflR1fV9DaUwxOX1dQl9gSXtTckVhWn1beHxRRGc=;MTkxNjI4NUAzMjMxMmUzMjJlMzNPazlZWGQyNnREOE5rRGRLZExUWEl6VUgvRm9TSTFwS1U5Z3k0dEM1MnFZPQ==;MTkxNjI4NkAzMjMxMmUzMjJlMzNoU0pjZkVQVmR3QjhoNS8yRW04RmRMRHlmK081MG5nWGQyS2U1dC9hOVBvPQ==;MTkxNjI4N0AzMjMxMmUzMjJlMzNNVHg5VWZQNGZFSFJtRWg4Nm9nYm1YcjZsSm82QXNHVmpjbzFwalliT1hNPQ=='
  )
  const { documentVariables } = props
  const [text, setText] = useState('')
  const [tags, setTags] = useState<any[] | undefined>(undefined)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [searchString, setSearchString] = useState<string>('')
  const [zoom, setZoom] = useState<any>(100)
  const { documentStore, documentVariableGroupStore, documentVariableStore } =
    useRootStore()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const toolbarSettings: any = {
    items: [
      'Bold',
      'Italic',
      'Underline',
      'StrikeThrough',
      'FontName',
      'FontSize',
      'FontColor',
      'BackgroundColor',
      'LowerCase',
      'UpperCase',
      '|',
      'Formats',
      'Alignments',
      'OrderedList',
      'UnorderedList',
      'Outdent',
      'Indent',
      '|',
      'CreateLink',
      'Image',
      'createTable',
      '|',

      'Undo',
      'Redo',
    ],
    type: 'Expand',
  }
  const quickToolbarSettings: any = {
    table: [
      'TableHeader',
      'TableRows',
      'TableColumns',
      'TableCell',
      '-',
      'BackgroundColor',
      'TableRemove',
      'TableCellVerticalAlign',
      'Styles',
    ],
  }

  function handleChange(value: any) {
    setText(value)
  }

  const editorRef: any = useRef(null)

  const onChange = (e: any) => {
    // if (editorRef.current) {
    //   documentStore.pages[documentStore.selectedPage].content =
    //     editorRef.current.getContent()
    //   // documentStore.form.pages[documentStore.selectedPage]
    // }
    documentStore.pages[documentStore.selectedPage].content = e.value
  }

  useEffect(() => {
    if (props.autoSaved) {
      setTimeout(() => {
        props.setAutoSaved(false)
      }, 2000)
    }
  }, [props.autoSaved])
  console.log(documentVariables)

  useLayoutEffect(() => {
    ;(async () => {
      let groupArr: any = []
      let varArr: any = []
      documentVariables?.map((variable: DocumentVariable) => {
        varArr.push({
          title: `${variable.key}-${variable.value}`,
          value: variable.key,
        })
      })
      setTags(varArr)
    })()
  }, [])

  return (
    <Box sx={{ position: 'relative', height: '100%' }}>
      <Box
        sx={{
          height: '100%',
          position: 'relative',
        }}
      >
        {props.autoSaved ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              position: 'absolute',
              right: 0,
              mt: 1.5,
              mr: 2,
              bgcolor: 'white !important',
              zIndex: 110,
            }}
          >
            <CheckCircleOutlineIcon
              sx={{
                color: palette.light.button.green,
                fontSize: 15,
                mr: 0.3,
              }}
            />
            <Typography
              sx={{
                color: palette.light.button.green,
                fontSize: 13,
              }}
            >
              {' '}
              Auto saved
            </Typography>
          </Box>
        ) : (
          <></>
        )}
        <Button
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          sx={{
            position: 'absolute',
            right: 0,
            zIndex: 100,
            minWidth: '20px',
            m: 1,
            mt: 1.2,
          }}
        >
          <Toc
            sx={{
              fontSize: 25,
            }}
          />
        </Button>
        <Menu
          id="variable-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
          // anchorOrigin={{
          //   vertical: 'bottom',
          //   horizontal: 'left',
          // }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <TextField
            placeholder="search"
            size="small"
            sx={{
              px: 1,
            }}
            onChange={(e) => {
              setSearchString(e.target.value)
            }}
          />
          <MuiTable
            className="smallTable"
            sx={{
              p: 2,
            }}
          >
            <TableBody>
              {documentVariables
                .filter(
                  (el: any) =>
                    el.key.includes(searchString) ||
                    el.value.includes(searchString)
                )
                .map((variable: any) => (
                  <TableRow>
                    <TableCell>{`{{${variable.key}}}`}</TableCell>
                    <TableCell>{variable.value}</TableCell>
                    <TableCell
                      sx={{
                        pr: '8px !important',
                      }}
                      onClick={() => {
                        navigator.clipboard.writeText(`{{${variable.key}}}`)
                        handleClose()
                      }}
                    >
                      <ContentCopy
                        sx={{
                          fontSize: 18,
                          mt: 1.5,
                          cursor: 'pointer',
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </MuiTable>
        </Menu>
        <Box
          sx={{
            position: 'absolute',
            zIndex: 100,
            left: '1002px',
            display: 'flex',
            alignItems: 'center',
            height: '43px',
            py: '7.5px',
            ml: 0.5,
          }}
        >
          <Divider
            orientation="vertical"
            sx={{
              mr: 1,
            }}
          />
          <ZoomIn
            sx={{
              cursor: 'pointer',
              mr: 1,
              borderRadius: '5px',
              '&:hover': {
                bgcolor: '#d9d9d9',
              },
            }}
            onClick={() => {
              if (zoom < 100) {
                let num = Number(zoom) + 25
                setZoom(num)
              }
            }}
          />
          <Box
            sx={{
              border: '1px solid #d9d9d9',
              borderRadius: '3px',
              py: 0.3,
              px: 0.5,
              mr: 1,
              width: '45px',
              textAlign: 'center',
            }}
          >
            <Typography
              sx={{
                fontSize: 13,
              }}
            >
              {zoom}%
            </Typography>
          </Box>
          <ZoomOut
            sx={{
              cursor: 'pointer',
              borderRadius: '5px',
              '&:hover': {
                bgcolor: '#d9d9d9',
              },
            }}
            onClick={() => {
              if (zoom > 25) {
                let num = Number(zoom) - 25
                setZoom(num)
              }
            }}
          />
        </Box>
        <RichTextEditorComponent
          toolbarSettings={toolbarSettings}
          height="calc(100% - 60px)"
          change={onChange}
          // actionComplete={onChange}
          ref={editorRef}
          saveInterval={10}
          tableSettings={{
            resize: true,
          }}
          quickToolbarSettings={quickToolbarSettings}
          value={documentStore.pages[documentStore.selectedPage]?.content || ''}
          id={zoom}
          // inlineMode={{
          //   inlineMode: {
          //     enable: true,
          //     onSelection: true,
          //   },
          // }}
        >
          <Inject
            services={[Toolbar, Image, Link, HtmlEditor, QuickToolbar, Table]}
          />
        </RichTextEditorComponent>
        {/* ) : (
          <Skeleton
            variant="rectangular"
            width={'100%'}
            height={'calc(100% - 60px)'}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
            }}
          />
        )} */}
      </Box>
    </Box>
  )
}
export default observer(DocEditorSyncView)
