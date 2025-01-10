import { observer, useLocalObservable } from 'mobx-react'

import { Box } from '@mui/material'
import _ from 'lodash'
import { grey } from '@mui/material/colors'
import uniqid from 'uniqid'
// import { Document, Page } from 'react-pdf';
import { useRootStore } from 'src/stores'
function PDFView({
  onClickPDF = () => null,
  vertical = false,
  url = '',
  totalPage = 0,
  currentPage = 0,
  scale = 1,
  onSuccess = (pdf: any): null => null,
}: {
  onClickPDF?: any
  vertical?: boolean
  url?: string
  totalPage?: number
  currentPage?: number
  scale?: number
  onSuccess?: Function
}) {
  const { uiState } = useRootStore()
  const onLoadSuccess = async (pdf: any) => {
    localState.totalPage = pdf._pdfInfo.numPages
    onSuccess(pdf)
  }

  const localState = useLocalObservable(() => ({
    totalPage: totalPage,
  }))

  const defaultPageProps = {
    width: uiState.windowDimensions.width,
    height: uiState.windowDimensions.height,
    scale: scale,
  }

  return (
    <Box
      onClick={onClickPDF}
      sx={{
        borderColor: grey[500],
        overflow: 'scroll',
        width: uiState.windowDimensions.width,
        height: uiState.windowDimensions.height,
        paddingBottom: 30,
        bgcolor: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: grey[700],
      }}
    >
      {/* <Document
        file={url}
        onLoadError={(error: { message: any; }) => {
          alert(error.message);
        }}
        onLoadSuccess={onLoadSuccess}
      >
        {page}
      </Document> */}
    </Box>
  )
}
export default observer(PDFView)
