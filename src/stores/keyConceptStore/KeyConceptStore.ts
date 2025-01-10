import { makeObservable, observable, override } from 'mobx'
import IKeyConcept from 'src/models/keyConcept/keyconcept.interface'
import KeyConcept from 'src/models/keyConcept'
import KeyConceptRepository from 'src/repos/v2/keyConceptRepository'
import Store from '../store'
import { RootStore } from '../root'
import Identifiable from 'src/commons/interfaces/identifiable.interface'
import _ from 'lodash'

export default class KeyConceptStore extends Store<IKeyConcept> {
  keyConcepts: KeyConcept[] = []
  form: IKeyConcept & Identifiable = {
    _id: null,
    domainId: '',
    description: '',
    isDeleted: false,
    createdAt: null,
    updatedAt: null,
  }

  defaultForm: IKeyConcept & Identifiable = _.cloneDeep(this.form)

  constructor(rootStore: RootStore, repository: KeyConceptRepository) {
    super(rootStore, repository)
    makeObservable(this, {
      form: observable,
      create: override,
      update: override,
      delete: override,
    })
  }
}
