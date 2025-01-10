import IUser from 'src/models/user/user.interface'
import Repository from '../repository'
class UserRepository extends Repository<IUser> {
  constructor() {
    super('v1/users')
  }
}
export default UserRepository
