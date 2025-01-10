import { makeObservable, observable } from 'mobx'

import DomainRepository from 'src/repos/v2/domainRepository'
import IDomain from 'src/models/domain/domain.interface'
import Identifiable from 'src/commons/interfaces/identifiable.interface'
import { RootStore } from '../root'
import Store from '../store'
import _ from 'lodash'

export default class DomainStore extends Store<IDomain> {
  form: IDomain & Identifiable = {
    _id: '',
    seq: 0,
    parentId: '',
    name: '',
    depth: 0,
  }
  defaultForm: IDomain & Identifiable = _.cloneDeep(this.form)

  constructor(rootStore: RootStore, repository: DomainRepository) {
    super(rootStore, repository)
    makeObservable(this, {
      form: observable,
    })
  }
}
