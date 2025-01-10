import IKeyConcept from 'src/models/keyConcept/keyconcept.interface'
import Repository from '../repository'
class KeyConceptRepository extends Repository<IKeyConcept> {
  constructor() {
    super('v2/keyConcepts')
  }
}
export default KeyConceptRepository
