import { makeObservable, override } from 'mobx'
import IKeyConcept from 'src/models/keyConcept/keyconcept.interface'
import KeyConceptStore from 'src/stores/keyConceptStore/KeyConceptStore'
import Model from '../model'

export default class KeyConcept extends Model<IKeyConcept, KeyConceptStore> implements IKeyConcept {
  _id?: string | null = null
  domainId: string = ''
  description: string = ''
  isDeleted: boolean = false
  createdAt: Date | null = null
  updatedAt: Date | null = null

  constructor(store: KeyConceptStore, data: IKeyConcept) {
    super(store, data)
    makeObservable(this, {
      description: override,
    })
  }
}
