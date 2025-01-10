import { ExpandLess, ExpandMore } from '@mui/icons-material'
import Box from '@mui/material/Box'
import { observer } from 'mobx-react'
import { CellProps } from 'react-table'
import DocImg from './img/doc.png'
import FolderImg from './img/folder.png'
function CellSubFolderExpanderView(props: CellProps<any>) {
  const row = props.row

  const defaultHideIcon = (
    <Box sx={{ display: 'flex' }}>
      {/* {row.original.kind === 'DocFolder' ? ( */}
      {true ? (
        <img src={FolderImg} width={22} height={18} />
      ) : (
        <img src={DocImg} width={17} height={22} />
      )}
      {row.original.kind === 'DocFolder' ? <ExpandLess sx={{ pl: 1 }} htmlColor="#666666" /> : null}
    </Box>
  )
  const defaultShowIcon = (
    <Box sx={{ display: 'flex' }}>
      {/* {row.original.kind === 'DocFolder' ? ( */}
      {true ? (
        <img src={FolderImg} width={22} height={18} />
      ) : (
        <img src={DocImg} width={17} height={22} />
      )}
      {row.original.kind === 'DocFolder' ? <ExpandMore sx={{ pl: 1 }} htmlColor="#666666" /> : null}
    </Box>
  )

  const _style: React.CSSProperties = {
    paddingLeft: `${row.original?.depth * 2}rem`,
    display: 'inline-flex',
    verticalAlign: 'middle',
  }
  if (row.original.kind === 'DocFolder') {
  }

  return (
    <span
      {...row.getToggleRowExpandedProps({
        style: _style,
      })}
    >
      {row.isExpanded ? defaultShowIcon : defaultHideIcon}
    </span>
  )
}
export default observer(CellSubFolderExpanderView)

// ({ row }: any) => {
//   const kind = row.original.kind
//   const icon = row.isExpanded ? (
//     <>
//       {kind != 'file' ? <img src={folderImg} /> : <img src={docImg} />}
//       {kind != 'file' && <ExpandLess htmlColor="#666666" />}
//     </>
//   ) : (
//     <>
//       {kind != 'file' ? <img src={folderImg} /> : <img src={docImg} />}
//       {kind != 'file' && <ExpandMore htmlColor="#666666" />}
//     </>
//   )

//   return (
//     <>
//       <span
//         {...row.getToggleRowExpandedProps({
//           style: {
//             paddingLeft: `${row.depth * 2}rem`,
//           },
//         })}
//       >
//         {icon}
//       </span>
//     </>
//   )
// },
