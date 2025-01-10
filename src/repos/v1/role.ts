import IRole from 'src/models/role/role.interface'
import Repository from '../repository'
class RoleRepository extends Repository<IRole> {
  constructor() {
    super('v1/roles')
  }
}
export default RoleRepository
