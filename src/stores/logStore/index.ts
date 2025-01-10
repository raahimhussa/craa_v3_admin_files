import _ from 'lodash'
import { makeAutoObservable, makeObservable, observable } from 'mobx'
import Identifiable from 'src/commons/interfaces/identifiable.interface'
import Log from 'src/models/log'
import ILog, { LogScreen, Severity, SimEvent } from 'src/models/log/types'
import LogRepository from 'src/repos/v2/log'
import { RootStore } from '../root'
import Store from '../store'
export default class LogStore extends Store<ILog> {
  form: ILog & Identifiable = {
    _id: '',
    screen: LogScreen.Baseline,
    event: SimEvent.OnClickAddNote,
    severity: Severity.Success,
    duration: 0,
    message: '',
    userId: undefined,
    recordId: '',
  }
  defaultForm: ILog & Identifiable = _.cloneDeep(this.form)
  constructor(rootStore: RootStore, respository: LogRepository) {
    super(rootStore, respository)
    makeObservable(this, { form: observable })
  }
}
