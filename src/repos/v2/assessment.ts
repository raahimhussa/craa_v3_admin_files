import { IAssessment } from 'src/models/assessment/assessment.interface'
import Repository from '../repository'

class AssessmentRepository extends Repository<IAssessment> {
  constructor() {
    super('v2/assessments')
  }
}
export default AssessmentRepository
