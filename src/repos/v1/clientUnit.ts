import { IClientUnit } from 'src/models/clientUnit/clientUnit.interface'
import Repository from '../repository'
class ClientUnitRepository extends Repository<IClientUnit> {
  constructor() {
    super('v1/clientUnits')
  }
}
export default ClientUnitRepository
