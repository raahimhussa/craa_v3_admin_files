import IAgreement from 'src/models/agreement/agreement.interface'
import Repository from '../repository'
class AgreementRepository extends Repository<IAgreement> {
  constructor() {
    super('v1/agreements')
  }
}
export default AgreementRepository
