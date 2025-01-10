import { observer } from 'mobx-react'
import _ from 'lodash'
import axios from 'axios'
import { action } from 'mobx'
import { FileData, FileItem } from './types'
const withHandler = (WrappedComponent: any) =>
  observer(({ localState, ...rest }: any) => {
    const postFile = async (fileItem: FileItem) => {
      let result = null
      delete fileItem.signedUrl
      try {
        const res = await axios.post('v1/files', fileItem)
        result = res.data
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error(error.response)
        }
      }

      return result
    }

    const putObjectToS3 = async (fileItem: FileItem) => {
      const fileList: FileList = { ...localState.fileList }

      const { signedUrl, index }: FileItem = fileItem

      let result: FileItem | null = fileItem

      if (!signedUrl) return console.log('not found signedUrl')

      try {
        await axios.put(signedUrl, fileList[index])
      } catch (error) {
        console.error(error)
      }

      return result
    }

    const S3Signin = async (fileItem: FileItem) => {
      let result: FileItem | null = null
      try {
        const res = await axios.post('v1/files/sign', fileItem)
        result = res.data
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error(error.response)
        }
      }
      return result
    }

    const onClickUpload = async () => {
      let results: FileData | any = []

      const fileList: FileList = localState.fileList
      const fileData: FileData = []

      for (let i = 0; i < fileList.length; i++) {
        const fileItem: FileItem = {
          name: fileList[i].name,
          mimeType: fileList[i].type,
          size: fileList[i].size,
          index: i,
        }
        fileData.push(fileItem)
      }

      try {
        results = await Promise.all(
          fileData.map(async (fileItem: FileItem) => await S3Signin(fileItem))
        )
      } catch (error) {
        console.error(error)
      }
      return results
    }

    const handlers = {
      onClickUpload: action(onClickUpload),
      postFile: action(postFile),
      S3Signin: action(S3Signin),
      putObjectToS3: putObjectToS3,
    }
    return <WrappedComponent {...rest} {...handlers} localState={localState} />
  })

export default withHandler
