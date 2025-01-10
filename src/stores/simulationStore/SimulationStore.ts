import { makeObservable, observable, override } from 'mobx'

import { AxiosResponse } from 'axios'
import ISimulation from 'src/models/simulation/simulation.interface'
import { RootStore } from '../root'
import SimulationRepository from 'src/repos/v1/simulation'
import Store from '../store'
import { TemplateStatus } from 'src/utils/status'
import _ from 'lodash'
import identifiableInterface from 'src/commons/interfaces/identifiable.interface'

export default class SimulationStore extends Store<ISimulation> {
  form: ISimulation = {
    _id: null,
    visibleId: -1,
    name: '',
    label: '',
    folderIds: [],
    agreement: {
      title: '',
      htmlContent: '',
      published: false,
    },
    onSubmission: {
      title: '',
      htmlContent: '',
      published: false,
    },
  }
  defaultForm: ISimulation & identifiableInterface = _.cloneDeep(this.form)
  mutate: any

  constructor(store: RootStore, simulationRepository: SimulationRepository) {
    super(store, simulationRepository)
    makeObservable(this, {
      form: observable,
    })
  }
}
