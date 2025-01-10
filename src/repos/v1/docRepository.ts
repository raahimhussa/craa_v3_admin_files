import IDoc from 'src/models/doc/doc.interface'
import Repository from '../repository'
class DocRepository extends Repository<IDoc> {
  constructor() {
    super('v1/docs')
  }
}
export default DocRepository
