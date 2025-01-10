import { makeAutoObservable, toJS } from 'mobx'
import { IDocumentVariable } from 'src/models/documentVariable/types'
import { IStore } from '../types'
import { RootStore } from '../root'
import RouterStore from '../routerStore'
import DocumentVariable from 'src/models/documentVariable'
import DocumentVariableRepository from 'src/repos/v1/documentVariable'
import _, { cloneDeep } from 'lodash'
import axios from 'axios'

export default class DocumentVariableStore implements IStore {
  store: RootStore
  router: RouterStore
  documentVariables: DocumentVariable[] = []
  documentVariableRepository: DocumentVariableRepository
  form: IDocumentVariable = {
    key: '',
    value: '',
    groupId: '',
  }

  defaultForm: IDocumentVariable = _.cloneDeep(this.form)
  mutate: any
  constructor(
    store: RootStore,
    documentVariableRepository: DocumentVariableRepository
  ) {
    this.store = store
    this.router = store.routerStore
    this.documentVariableRepository = documentVariableRepository
    makeAutoObservable(this)
  }

  loadData(data: DocumentVariable[]) {
    this.documentVariables = data.map((data) => {
      const documentVariable = new DocumentVariable(this, data)
      documentVariable.load(data)
      return documentVariable
    })
  }

  async create() {
    try {
      return (await this.documentVariableRepository.create(toJS(this.form)))
        .data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error.response)
      }
    } finally {
      this.resetForm()
    }
  }

  async edit() {
    try {
      return this.update(this.form._id, {
        groupId: this.form.groupId,
        key: this.form.key,
        value: this.form.value,
      })
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error.response)
      }
    } finally {
      this.resetForm()
    }
  }

  *update(documentVariableId: string, update: any) {
    try {
      return this.documentVariableRepository.update({
        filter: { _id: documentVariableId },
        update,
      })
    } catch (error) {
      console.log({ error })
    }
    // this.mutate()
  }
  *delete(documentVariableId: string) {
    try {
      yield this.documentVariableRepository.update({
        filter: { _id: documentVariableId },
        update: { isDeleted: true },
      })
    } catch (error) {
      throw error
    }
    // this.mutate()
  }

  resetForm() {
    this.form = _.cloneDeep(this.defaultForm)
  }
}
