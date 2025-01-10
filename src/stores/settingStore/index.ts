import { makeObservable, observable } from 'mobx'
import CommonDAO from 'src/commons/interfaces/commonDAO.interface'
import Identifiable from 'src/commons/interfaces/identifiable.interface'
import ISetting from 'src/models/setting/setting.interface'
import SettingRepository from 'src/repos/v2/setting'
import { RootStore } from '../root'
import Store from '../store'

const getScorerForm = () => ({
  firstScorerId: '',
  secondScorerId: '',
  adjudicatorId: '',
  domains: [],
})

type ScorerForm = ReturnType<typeof getScorerForm>
export class SettingStore extends Store<ISetting> {
  form: ISetting & CommonDAO & Identifiable & ScorerForm = {
    _id: null,
    kind: 'ScorerSetting',
    // firstScorerId: '',
    // secondScorerId: '',
    // adjudicatorId: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted: false,
    ...getScorerForm(),
  }
  constructor(rootStore: RootStore, repository: SettingRepository) {
    super(rootStore, repository)
    makeObservable(this, {
      form: observable,
    })
  }
}
