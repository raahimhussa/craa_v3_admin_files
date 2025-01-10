import { Editor } from '@toast-ui/react-editor'
import { observer, useLocalObservable } from 'mobx-react'
import '@toast-ui/editor/dist/toastui-editor.css'
import { MobxUtil } from '@utils'
import { reaction } from 'mobx'
import { useRef } from 'react'

function EditorView(props: any) {
  const { state = {}, path = '' } = props

  const localState = useLocalObservable(() => ({
    value: MobxUtil._get(state, path) || '',
  }))
  const editorRef = useRef<Editor>()

  reaction(
    () => localState.value,
    () => MobxUtil._set(state, path, localState.value)
  )

  reaction(
    () => MobxUtil._get(state, path),
    () => {
      localState.value = MobxUtil._get(state, path)
    }
  )

  const onChange = (editorType: string) => {
    if (editorType === 'markdown') {
      alert('markdown not supported')
    } else {
      localState.value = editorRef.current?.getInstance().getHTML()
    }
  }
  return (
    <Editor
      {...props}
      ref={editorRef}
      onChange={onChange}
      initialValue={localState.value}
      previewStyle="vertical"
      height="600px"
      initialEditType="wysiwyg"
      useCommandShortcut={true}
    />
  )
}
export default observer(EditorView)
