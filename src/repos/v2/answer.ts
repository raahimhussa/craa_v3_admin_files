import IAnswer from 'src/models/answer/answer.interface'
import Repository from '../repository'

class AnswerRepository extends Repository<IAnswer> {
  constructor() {
    super('v2/answers')
  }
}
export default AnswerRepository
