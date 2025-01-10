import { makeAutoObservable, toJS } from 'mobx'
import { IDocumentVariableGroup } from 'src/models/documentVariableGroup/types'
import { IStore } from '../types'
import { RootStore } from '../root'
import RouterStore from '../routerStore'
import DocumentVariableGroup from 'src/models/documentVariableGroup'
import DocumentVariableGroupRepository from 'src/repos/v1/documentVariableGroup'
import _, { cloneDeep } from 'lodash'
import axios from 'axios'

export default class DocumentVariableGroupStore implements IStore {
  store: RootStore
  router: RouterStore
  documentVariableGroups: DocumentVariableGroup[] = []
  documentVariableGroupRepository: DocumentVariableGroupRepository
  form: IDocumentVariableGroup = {
    name: '',
  }

  defaultForm: IDocumentVariableGroup = _.cloneDeep(this.form)
  mutate: any
  constructor(
    store: RootStore,
    documentVariableGroupRepository: DocumentVariableGroupRepository
  ) {
    this.store = store
    this.router = store.routerStore
    this.documentVariableGroupRepository = documentVariableGroupRepository
    makeAutoObservable(this)
  }

  loadData(data: DocumentVariableGroup[]) {
    this.documentVariableGroups = data.map((data) => {
      const documentVariableGroup = new DocumentVariableGroup(this, data)
      documentVariableGroup.load(data)
      return documentVariableGroup
    })
  }

  async create() {
    try {
      return (
        await this.documentVariableGroupRepository.create(toJS(this.form))
      ).data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error.response)
      }
    } finally {
      this.resetForm()
    }
  }

  async update(documentVariableGroupId: string, update: any) {
    try {
      return await this.documentVariableGroupRepository.update({
        filter: { _id: documentVariableGroupId },
        update,
      })
    } catch (error) {
      console.log({ error })
    }
    // this.mutate()
  }
  *delete(documentVariableGroupId: string) {
    try {
      yield this.documentVariableGroupRepository.update({
        filter: { _id: documentVariableGroupId },
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
