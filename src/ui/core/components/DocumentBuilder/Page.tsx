import { Box, Button } from '@mui/material'
import CancelIcon from '@mui/icons-material/Cancel'
import { useRootStore } from 'src/stores'
import { useEffect, useState, useRef } from 'react'
import { observer } from 'mobx-react'
import { useDrag, useDrop } from 'react-dnd'
import type { Identifier, XYCoord } from 'dnd-core'

function Page(props: any) {
  const { page, index, selectedPage, setSelectedPage, moveCard, updateOrders } =
    props
  const { documentStore } = useRootStore()
  const [content, setContent] = useState(documentStore.pages[0]?.content)
  // console.log(page.order)
  useEffect(() => {
    console.log(documentStore.pages[page.order]?.content)
    setContent(documentStore.pages[page.order]?.content)
  }, [documentStore.pages[page.order]?.content])

  interface DragItem {
    index: number
    id: string
    type: string
  }
  const ref = useRef<HTMLDivElement>(null)
  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: 'page',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    canDrop: () => false,
    hover(item: DragItem) {
      moveCard(item, index)
    },
  })

  const [{ isDragging }, drag] = useDrag({
    type: 'page',
    item: () => {
      return { page, index }
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
    end() {
      updateOrders()
    },
  })

  const opacity = isDragging ? 0 : 1
  drag(drop(ref))

  return (
    <Box
      ref={ref}
      sx={{
        opacity: isDragging ? '0.3' : '1',
        boxShadow:
          ' rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px',
        width: '100%',
        // height: '250px',
        // pt: '120%',
        aspectRatio: '1/1.4',
        mb: 2,
        position: 'relative',
        border: selectedPage === page.order ? '1px solid #808080' : 'none',
        cursor: 'pointer',
      }}
      onClick={() => {
        documentStore.selectedPage = page.order
      }}
    >
      <Button
        sx={{
          bgcolor: 'white',
          position: 'absolute',
          right: 0,
          top: 0,
          minWidth: 0,
          p: '0 !important',
          mt: -1.5,
          mr: -1.5,
          display: documentStore.pages.length === 1 ? 'none' : 'block',
        }}
        onClick={() => {
          documentStore.pages.splice(page.order, 1)
          documentStore.pages.map((page, index) => {
            documentStore.pages[index].order = index
          })
          documentStore.selectedPage = page.order === 0 ? 0 : page.order - 1
          setSelectedPage(page.order === 0 ? 0 : page.order - 1)
        }}
      >
        <CancelIcon />
      </Button>
      <Box
        sx={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          padding: '1rem 0.7rem',
          // fontSize: '10%',
        }}
        className="docPage"
      >
        <div
          dangerouslySetInnerHTML={{
            __html: content,
          }}
        />
      </Box>
    </Box>
  )
}

export default observer(Page)
