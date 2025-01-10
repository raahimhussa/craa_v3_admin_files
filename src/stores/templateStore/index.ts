import _ from 'lodash'
import { makeObservable, observable } from 'mobx'
import Identifiable from 'src/commons/interfaces/identifiable.interface'
import ITemplate from 'src/models/template/template.interface'
import TemplateRepository from 'src/repos/v2/templateRepository'
import { RootStore } from '../root'
import Store from '../store'
export default class TemplateStore extends Store<ITemplate> {
  form: ITemplate & Identifiable = {
    _id: null,
    key: '',
    htmlContent: '',
    title: '',
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  defaultForm: ITemplate & Identifiable = _.cloneDeep(this.form)

  constructor(store: RootStore, repository: TemplateRepository) {
    super(store, repository)
    makeObservable(this, {
      form: observable,
    })
  }
}
