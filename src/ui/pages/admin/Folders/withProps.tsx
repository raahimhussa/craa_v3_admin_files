import _ from 'lodash'
import { observer } from 'mobx-react'
const withProps = (WrappedComponent: any) =>
  observer((props: any) => {
    // // folder tree structuring logic
    // const { folders, leafFolders } = props
    // const _folders = _.cloneDeep(folders)
    // _folders.forEach((folder: any) => {
    //   const filteredLeafFolders = leafFolders?.filter(
    //     (leafFolder: any) => leafFolder.folderId === folder._id
    //   )
    //   filteredLeafFolders?.forEach((f: any) => {
    //     const lastLeafFolders = leafFolders?.filter(
    //       (leafFolder: any) => leafFolder.folderId === f._id
    //     )
    //     f.subRows = [...lastLeafFolders]
    //     // @ts-ignore
    //     f.docs.forEach((doc) => (doc.kind = 'file'))
    //     if (f.docs) {
    //       f.subRows = [...f.subRows, ...f.docs]
    //     }
    //   })
    //   // @ts-ignore
    //   folder.docs?.forEach((doc) => (doc.kind = 'file'))
    //   folder.subRows = [...filteredLeafFolders].concat(folder.docs || [])
    // })

    return <WrappedComponent {...props} />
  })

export default withProps
