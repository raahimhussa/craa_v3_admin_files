import Repository from '../repository'
class UserTrainingRepository extends Repository<any> {
  constructor() {
    super('v2/userTrainings')
  }
}
export default UserTrainingRepository
