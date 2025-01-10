import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from '@mui/material'
import { useState } from 'react'
import Draggable from 'react-draggable'
import Loadmap from '../../../Loadmap/Loadmap'
import CloseIcon from '@mui/icons-material/Close'

function RoadmapView(props: any) {
  const { userSimulation, user, setIsRoadmap, setSelectedNote, selectedNote } =
    props
  const [isFolder, setIsFolder] = useState(true)
  const [isTimeline, setIsTimeline] = useState(true)
  const [isScreenrecord, setIsScreenrecord] = useState(false)
  return (
    <Draggable
      handle=".handle"
      //   bounds="parent"
      defaultPosition={{ x: 100, y: 100 }}
    >
      <Box
        sx={{
          position: 'absolute',
          zIndex: 1004,
          borderRadius: '10px',
        }}
      >
        <Box
          className="handle"
          sx={{
            width: '100%',
            minWidth: '1000px',
            bgcolor: 'rgb(57, 109, 130)',
            height: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          <Button
            sx={{
              color: 'white',
              right: 0,
              minWidth: '10px',
            }}
            onClick={() => {
              setIsRoadmap(false)
            }}
          >
            <CloseIcon />
          </Button>
        </Box>
        <Box
          sx={{
            bgcolor: 'white',
            p: 1,
            boxShadow:
              'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px',
            // maxHeight: '750px',
            overflowY: 'hiddnen',
          }}
        >
          <FormGroup
            sx={{
              display: 'flex',
              width: '100%',
              flexDirection: 'row',
              px: 2,
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={isFolder}
                  onChange={(e) => {
                    setIsFolder(e.target.checked)
                  }}
                />
              }
              label="Folders"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={isTimeline}
                  onChange={(e) => {
                    setIsTimeline(e.target.checked)
                  }}
                />
              }
              label="timeline"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={isScreenrecord}
                  onChange={(e) => {
                    setIsScreenrecord(e.target.checked)
                  }}
                />
              }
              label="Screenrecords"
            />
          </FormGroup>
          <Box>
            <Loadmap
              userSimulation={userSimulation}
              user={user}
              isModal={true}
              isFolder={isFolder}
              isTimeline={isTimeline}
              isScreenrecord={isScreenrecord}
              selectedNote={selectedNote}
              setSelectedNote={setSelectedNote}
            />
          </Box>
        </Box>
      </Box>
      {/* <Box
        className="viewport2"
        sx={{
          position: 'absolute',
          zIndex: 1004,
          display: 'none',
        }}
      >
        <Box
          sx={{
            height: '30px',
            bgcolor: '#3d4042',
          }}
          className="handle"
        ></Box> */}
      {/* </Box> */}
    </Draggable>
  )
}

export default RoadmapView
