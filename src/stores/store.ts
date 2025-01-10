import { flow, makeObservable, toJS } from 'mobx'

import Identifiable from 'src/commons/interfaces/identifiable.interface'
import Repository from 'src/repos/repository'
import { RootStore } from './root'
import _ from 'lodash'
import axios from 'axios'

export default class Store<D> {
  rootStore: RootStore
  repository: Repository<D>
  form!: D & Identifiable
  defaultForm!: D & Identifiable

  constructor(rootStore: RootStore, repository: Repository<D>) {
    this.rootStore = rootStore
    this.repository = repository
    makeObservable(this, {
      create: flow,
      update: flow,
      delete: flow,
    })
  }

  *create(): any {
    console.info('create', toJS(this.form))
    try {
      yield this.repository.create(this.form)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error.response)
      }
      throw error
    } finally {
      this.resetForm()
    }
  }

  *update(): any {
    console.info('store.ts update', toJS(this.form))
    try {
      yield this.repository.update({
        filter: { _id: this.form._id },
        update: this.form,
      })
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error.response)
      }
    } finally {
      this.resetForm()
    }
  }

  *delete(isUser: boolean): any {
    console.info('delete', this.form._id)
    try {
      if (isUser) {
        yield this.repository.delete({
          filter: { _id: this.form._id },
        })
      } else {
        yield this.repository.update({
          filter: { _id: this.form._id },
          update: { isDeleted: true },
        })
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response)
      }
    }
  }

  resetForm() {
    this.form = _.cloneDeep(this.defaultForm)
  }
}
