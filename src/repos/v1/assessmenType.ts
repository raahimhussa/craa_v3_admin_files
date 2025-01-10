import IAssessmentType from 'src/models/assessmentType/assessmentType.interface'
import Repository from '../repository'
class AssessmentTypeRepository extends Repository<IAssessmentType> {
  constructor() {
    super('v1/assessmentTypes')
  }
}
export default AssessmentTypeRepository
