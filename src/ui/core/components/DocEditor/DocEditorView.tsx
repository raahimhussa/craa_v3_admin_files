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
import { Check, ContentCopy, Toc, ZoomIn, ZoomOut } from '@mui/icons-material'

function DocEditorView(props: any) {
  const { documentVariables } = props
  const [text, setText] = useState('')
  const [tags, setTags] = useState<any[] | undefined>(undefined)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { documentStore, documentVariableGroupStore, documentVariableStore } =
    useRootStore()
  const [searchString, setSearchString] = useState<string>('')
  const [zoom, setZoom] = useState<any>(100)
  const editorRef: any = useRef(null)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  function handleChange(value: any) {
    setText(value)
  }

  const onChange = () => {
    if (editorRef.current) {
      documentStore.pages[documentStore.selectedPage].content =
        editorRef.current.getContent()
      // documentStore.form.pages[documentStore.selectedPage]
    }
  }

  useEffect(() => {
    if (props.autoSaved) {
      setTimeout(() => {
        props.setAutoSaved(false)
      }, 2000)
    }
  }, [props.autoSaved])

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
      // const groups = await getGroups()
      // const variables = await getVariables()
      // groups?.map((group: DocumentVariableGroup) => {
      //   if (varArr.length !== 0) {
      //     groupArr.push({
      //       title: group.name,
      //       menu: varArr,
      //     })
      //     varArr = []
      //   }
      // })
      setTags(varArr)
    })()
  }, [])

  useEffect(() => {
    console.log(tags)
  }, [tags])

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
              zIndex: 10,
              right: 0,
              mt: 1,
              mr: 2,
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
            top: '43px',
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
            left: '1020px',
            display: 'flex',
            alignItems: 'center',
            height: '43px',
            py: '7.5px',
            ml: 0.5,
            top: '43px',
          }}
        >
          {/* <Divider
            orientation="vertical"
            sx={{
              mr: 1,
            }}
          /> */}
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
        <Box id={zoom} sx={{ height: '100%' }}>
          <Editor
            apiKey={'g9mjki2xqhqk7ao67f4z7ekr127usoqi8r69tq5qr60eegmw'}
            onInit={(evt: any, editor: any) => {
              setIsLoading(false)
              if (editorRef !== undefined) {
                editorRef.current = editor
              }
            }}
            onEditorChange={onChange}
            value={documentStore.pages[documentStore.selectedPage]?.content}
            init={{
              content_security_policy:
                "default-src 'self' 'unsafe-inline' 'img-src' 'style-src-elem'",
              resize: false,
              height: 'calc(100% - 60px)',
              plugins:
                'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount ',
              toolbar:
                'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough |  link image media table | spellcheckdialog a11ycheck typography | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
              // mergetags_list: [...tags],
            }}
          />
        </Box>
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
export default observer(DocEditorView)
