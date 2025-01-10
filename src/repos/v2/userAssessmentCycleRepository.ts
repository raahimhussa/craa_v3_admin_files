import UserAssessmentCycle from 'src/models/userAssessmentCycle'
import Repository from '../repository'
class UserAssessmentCycleRepository extends Repository<UserAssessmentCycle> {
  constructor() {
    super('v1/userAssessmentCycles')
  }
}
export default UserAssessmentCycleRepository
