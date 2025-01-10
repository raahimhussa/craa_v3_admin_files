import ITemplate from 'src/models/template/template.interface'
import Repository from '../repository'
class TemplateRepository extends Repository<ITemplate> {
  constructor() {
    super('v1/templates')
  }
}
export default TemplateRepository
