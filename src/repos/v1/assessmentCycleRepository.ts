import IAssessmentCycle from 'src/models/assessmentCycle/assessmentCycle.interface'
import Repository from '../repository'
class AssessmentCycleRepository extends Repository<IAssessmentCycle> {
  constructor() {
    super('v1/assessmentCycles')
  }
}
export default AssessmentCycleRepository
