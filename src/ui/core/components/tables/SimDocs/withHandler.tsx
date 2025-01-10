import IFolder from 'src/models/folder/folder.interface'
import { KeyboardEventHandler } from 'react'
import { WrappingFunction } from '@shopify/react-compose'
import axios from 'axios'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'
const withLeftButtons: WrappingFunction = (WrappedComponent: any) =>
  observer((props) => {
    const { folderStore } = useRootStore()
    const { foldersMutate, simulationsMutate } = props
    const onClickNewFolder = async (simulationId?: string) => {
      const newFolder = await folderStore.create()
      const folderId = (newFolder as unknown as IFolder)._id
      if (simulationId) {
        await axios.patch('/v1/simulations', {
          filter: {
            _id: simulationId,
          },
          update: {
            $push: {
              folderIds: folderId,
            },
          },
        })
      }
      await foldersMutate()
      await simulationsMutate()
      return folderId
    }

    const onKeyPressEnter: KeyboardEventHandler<HTMLInputElement> = async (
      e
    ) => {
      if (e.key === 'Enter') {
      }
    }
    const handlers = {
      onClickNewFolder,
      onKeyPressEnter,
    }
    return <WrappedComponent {...props} {...handlers} />
  })

export default withLeftButtons
