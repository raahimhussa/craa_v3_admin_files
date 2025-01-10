import React from 'react'
import { observer } from 'mobx-react'
import Folders from 'src/ui/core/components/tables/Folders/Folders'
import Instructions from 'src/ui/core/components/tables/Instructions/Instructions'
import Protocols from 'src/ui/core/components/tables/Protocols/Protocols'
import StudyDocuments from 'src/ui/core/components/tables/StudyDocuments/StudyDocuments'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
enum Kind {
  Protocol = 'protocol',
  Instruction = 'instruction',
  StudyDocument = 'studyDocument',
}

function FoldersView({ folders, docs }: any) {
  const [value, setValue] = React.useState(0)
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  const instructions = docs.filter((doc: any) => doc.kind === Kind.Instruction)
  const studyDocuments = docs.filter((doc: any) => doc.kind === Kind.StudyDocument)
  const protocols = docs.filter((doc: any) => doc.kind === Kind.Protocol)

  return (
    <>
      <Tabs
        variant="fullWidth"
        indicatorColor={'secondary'}
        textColor="secondary"
        sx={{ mb: 4, boxShadow: 2 }}
        onChange={handleChange}
        value={value}
        aria-label="Tabs where each tab needs to be selected manually"
      >
        <Tab label="Document Managment" sx={{ fontSize: 12, fontWeight: 600 }} />
        <Tab label="Protocol Managment" sx={{ fontSize: 12, fontWeight: 600 }} />
        <Tab label="Instruction Managment" sx={{ fontSize: 12, fontWeight: 600 }} />
        <Tab label="Study Documents Managment" sx={{ fontSize: 12, fontWeight: 600 }} />
      </Tabs>
      {value === 0 && <Folders folders={folders} />}
      {value === 1 && <Protocols protocols={protocols} />}
      {value === 2 && <Instructions instructions={instructions} />}
      {value === 3 && <StudyDocuments studyDocuments={studyDocuments} />}
    </>
  )
}
export default observer(FoldersView)
