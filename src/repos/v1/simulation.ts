import ISimulation from 'src/models/simulation/simulation.interface'
import Repository from '../repository'
class SimulationRepository extends Repository<ISimulation> {
  constructor() {
    super('v1/simulations')
  }
}
export default SimulationRepository
