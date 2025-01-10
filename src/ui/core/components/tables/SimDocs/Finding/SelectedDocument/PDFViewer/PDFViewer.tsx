import { Box, Button, Divider, LinearProgress, Typography } from '@mui/material'
import { Document, Page, pdfjs } from 'react-pdf'

import { Download } from '@mui/icons-material'
import { String } from '@stitches/react/types/util'
import _ from 'lodash'
import { grey } from '@mui/material/colors'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'
import { useState } from 'react'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`

type Props = {
  fileUrl: String
}

const options = {
  cMapUrl: 'cmaps/',
  cMapPacked: true,
  standardFontDataUrl: 'standard_fonts/',
}

function PDFViewer({ fileUrl }: Props) {
  // const [pageIndex, setPageIndex] = useState<number>(0)
  const {
    uiState: { modal },
  } = useRootStore()
  const [numPages, setNumPages] = useState<number>(0)
  const [loading, setLoading] = useState<{ loaded: number; total: number }>({
    loaded: 0,
    total: 1,
  })

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
      }}
      onContextMenu={(e: any) => {
        e.target.matches('canvas') && e.preventDefault()
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
            backgroundColor: 'gray',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <a href={fileUrl} target="_blank" style={{ marginRight: '11px' }}>
            <Button
              onClick={() => modal.close()}
              variant="contained"
              sx={{ width: '72px' }}
            >
              <Download />
            </Button>
          </a>
          <Button
            onClick={() => modal.close()}
            variant="contained"
            sx={{ width: '72px' }}
          >
            X
          </Button>
        </Box>
        <Box
          sx={{
            width: '70vw',
            height: 'calc(100vh - 48px)',
            display: 'flex',
            justifyContent: 'center',
            overflow: 'auto',
          }}
        >
          <Document
            file={fileUrl}
            options={options}
            onLoadError={(error) => {
              alert(error.message)
            }}
            onLoadProgress={({ loaded, total }) => {
              setLoading({ loaded, total })
            }}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          >
            <LinearProgress
              variant="determinate"
              value={(loading.loaded / loading.total) * 100}
            />
            {loading.loaded / loading.total !== 1 ? (
              <Box>Loading...</Box>
            ) : (
              <>
                {Array(numPages)
                  .fill(0)
                  .map((_, index) => (
                    <>
                      <Page pageIndex={index} width={2048} key={index} />
                      <Divider />
                    </>
                  ))}
              </>
            )}
          </Document>
        </Box>
      </Box>
    </Box>
  )
  // return <Box />
}
export default observer(PDFViewer)
