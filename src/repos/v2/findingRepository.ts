import IFinding from 'src/models/finding/finding.interface'
import Repository from '../repository'
class FindingRepository extends Repository<IFinding> {
  constructor() {
    super('v2/findings')
  }
}
export default FindingRepository
