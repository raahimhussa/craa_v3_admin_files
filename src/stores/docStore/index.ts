import { makeObservable, observable } from 'mobx'
import Identifiable from 'src/commons/interfaces/identifiable.interface'
import { RootStore } from '../root'
import Store from '../store'
import IDoc, { DocKind } from 'src/models/doc/doc.interface'
import DocRepository from 'src/repos/v1/docRepository'
import _ from 'lodash'
export default class DocStore extends Store<IDoc> {
  form: IDoc & Identifiable = {
    _id: null,
    kind: DocKind.Instruction,
    title: '',
    htmlContent: '',
    file: null,
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  defaultForm: IDoc & Identifiable = _.cloneDeep(this.form)

  constructor(store: RootStore, repository: DocRepository) {
    super(store, repository)
    makeObservable(this, {
      form: observable,
    })
  }
}
