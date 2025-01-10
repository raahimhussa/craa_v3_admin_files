import { Box, Button, Divider, LinearProgress, Typography } from '@mui/material'
import { Document, Page, pdfjs } from 'react-pdf'

import { Rnd } from 'react-rnd'
import { String } from '@stitches/react/types/util'
import _ from 'lodash'
import { observer } from 'mobx-react'
import { useState } from 'react'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`

type Props = {
  title: String
  fileUrl: String
  onClose: () => void
}

const options = {
  cMapUrl: 'cmaps/',
  cMapPacked: true,
  standardFontDataUrl: 'standard_fonts/',
}

function PDFViewer({ title, fileUrl, onClose }: Props) {
  const [numPages, setNumPages] = useState<number>(0)
  // const [ref, { width, height }] = useMeasure()
  const [{ width, height }, setSize] = useState<{
    width: number
    height: number
  }>({
    width: 720,
    height: 480,
  })
  const [minimized, setMinimized] = useState<boolean>(false)
  const [loading, setLoading] = useState<{ loaded: number; total: number }>({
    loaded: 0,
    total: 1,
  })

  const onClickMinimize = (e: any) => {
    setMinimized(true)
  }

  const onClickNormalize = (e: any) => {
    setMinimized(false)
  }

  return (
    <Box
      sx={{
        position: 'static',
        zIndex: 100,
        overflow: 'auto',
      }}
    >
      <Rnd
        style={{
          zIndex: 101,
          backgroundColor: 'white',
        }}
        size={{
          width: minimized ? 480 : width,
          height: minimized ? 34 : height,
        }}
        minWidth={324}
        minHeight={32}
        onResize={(e, direction, ref, delta, position) => {
          setSize({
            width: ref.offsetWidth,
            height: ref.offsetHeight,
          })
        }}
        enableResizing={minimized ? false : true}
        bounds="window"
      >
        <Box
          sx={{
            width,
            height: '32px',
            backgroundColor: 'gray',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Box
            sx={{
              overflow: 'hidden',
              padding: '4px 8px 4px 8px',
            }}
          >
            <Typography>{title}</Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {minimized ? (
              <button
                onClick={onClickNormalize}
                style={{ width: '64px', cursor: 'pointer' }}
              >
                -
              </button>
            ) : (
              <button
                onClick={onClickMinimize}
                style={{ width: '64px', cursor: 'pointer' }}
              >
                _
              </button>
            )}
            <button
              onClick={onClose}
              style={{ width: '64px', cursor: 'pointer' }}
            >
              X
            </button>
          </Box>
        </Box>
        <Box
          sx={{
            width,
            height: minimized ? 0 : height - 32,
            border: '2px solid grey',
            display: 'flex',
            justifyContent: 'center',
            overflow: 'auto',
          }}
          onContextMenu={(e: any) => {
            e.target.matches('canvas') && e.preventDefault()
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
      </Rnd>
    </Box>
  )
  // return <Box />
}
export default observer(PDFViewer)
