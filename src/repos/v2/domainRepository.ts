import IDomain from 'src/models/domain/domain.interface'
import Repository from '../repository'
class DomainRepository extends Repository<IDomain> {
  constructor() {
    super('v2/domains')
  }
}
export default DomainRepository
