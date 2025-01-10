import { withFind } from '@hocs'
import { Box, Button, Typography } from '@mui/material'
import compose from '@shopify/react-compose'
import axios from 'axios'
import { observer } from 'mobx-react'
import { useEffect, useState } from 'react'
import DocumentPage from 'src/models/documentPage'
import { useRootStore } from 'src/stores'

function Preview(props: any) {
  const { document, documentVariables } = props
  const {
    uiState: { modal },
  } = useRootStore()
  const [pages, setPages] = useState<DocumentPage[]>([])
  useEffect(() => {
    let arr: any[] = []
    document.versions[document.versions.length - 1][
      document.versions[document.versions.length - 1].length - 1
    ].pages.map((page: any) => {
      documentVariables?.map((variable: any) => {
        page.content = page.content.replaceAll(
          `{{${variable.key}}}`,
          variable.value
        )
      })
      arr.push(page)
      setPages([...arr])
    })
    // setDatas(arr)
  }, [])

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          overflow: 'auto',
        }}
      >
        <Box
          sx={{
            width: '100%',
            height: '28px',
            backgroundColor: '#396d82',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Typography
            sx={{
              color: 'white',
              fontWeight: 500,
              ml: 1,
            }}
          >
            {document.title}
          </Typography>
          <Button
            onClick={() => modal.close()}
            variant="contained"
            sx={{ minWidth: '10px' }}
          >
            CLOSE
          </Button>
        </Box>
        <Box
          sx={{
            width: '700px',
            height: 'calc(100vh - 48px)',
            overflow: 'auto',
            bgcolor: 'grey',
            pb: 3,
          }}
        >
          {pages
            .sort((a: any, b: any) => a.order - b.order)
            .map((page: DocumentPage, index: any) => {
              return (
                <Box
                  sx={{
                    boxShadow:
                      ' rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px',
                    width: '90%',
                    // height: '250px',
                    // height: '95%',
                    aspectRatio: '1/1.4',
                    mb: 2,
                    position: 'relative',
                    bgcolor: 'white',
                    m: '0 auto',
                    my: 2,
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      position: 'absolute',
                      top: 0,
                      padding: '1rem',
                      // fontSize: '10%',
                    }}
                    className="docPreview"
                    dangerouslySetInnerHTML={{
                      __html: page.content,
                    }}
                  />
                </Box>
              )
            })}
        </Box>
      </Box>
    </Box>
  )
}

// export default observer(Preview)

export default compose(
  withFind({
    collectionName: 'documentVariables',
    getFilter: (props: any) => {
      console.log(props.document)
      return {
        groupId: props.document.groupId,
        isDeleted: false,
      }
    },
  })
)(Preview)
