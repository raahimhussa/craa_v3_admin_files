import { makeAutoObservable } from 'mobx'
import CommonDAO from 'src/commons/interfaces/commonDAO.interface'
import Identifiable from 'src/commons/interfaces/identifiable.interface'
import { SettingStore } from 'src/stores/settingStore'
import ISetting, { ScorerSettingDomain } from './setting.interface'
export default class Setting implements ISetting, Identifiable, CommonDAO {
  store: SettingStore
  _id: string | null = null
  isDeleted: boolean = false
  createdAt: Date = new Date()
  updatedAt: Date = new Date()
  form: any = {}
  kind: string = 'Scorer'
  domains: ScorerSettingDomain[] = []

  constructor(store: SettingStore, data: ISetting) {
    this.store = store
    makeAutoObservable(this, {
      store: false,
    })
    Object.assign(this, data)
  }
}
