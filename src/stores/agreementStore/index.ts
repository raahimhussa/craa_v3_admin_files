import _ from 'lodash'
import { makeObservable, observable } from 'mobx'
import identifiableInterface from 'src/commons/interfaces/identifiable.interface'
import IAgreement, {
  AgreementKind,
} from 'src/models/agreement/agreement.interface'
import AgreementRepository from 'src/repos/v1/agreementRepository'
import { RootStore } from '../root'
import Store from '../store'
export default class AgreementStore extends Store<IAgreement> {
  form: IAgreement = {
    _id: null,
    kind: AgreementKind.PrivacyPolicy,
    key: '',
    label: '',
    htmlContent: '',
    isRequired: false,
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  defaultForm: IAgreement & identifiableInterface = _.cloneDeep(this.form)

  constructor(store: RootStore, repository: AgreementRepository) {
    super(store, repository)
    makeObservable(this, {
      form: observable,
    })
  }
}
