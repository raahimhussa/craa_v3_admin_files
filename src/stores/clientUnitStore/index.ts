import {
  AdminLogManager,
  AdminLogTargetType,
} from 'src/classes/adminLogManager'
import { AdminLogScreen, GradeType } from 'src/utils/status'
import {
  BusinessCycle,
  BusinessUnit,
  IClientUnit,
  SettingsByDomainId,
} from 'src/models/clientUnit/clientUnit.interface'
import { action, makeObservable, observable, toJS } from 'mobx'

import ClientUnitRepository from 'src/repos/v1/clientUnit'
import { RootStore } from '../root'
import { ScorerSettingDomain } from 'src/models/setting/setting.interface'
import Store from '../store'
import _ from 'lodash'
import axios from 'axios'
import { uuid } from 'uuidv4'

export enum UpdateType {
  ClientUnit = 'ClientUnit',
  BusinessUnit = 'BusinessUnit',
  BusinessCycle = 'BusinessCycle',
}

export default class ClientUnitStore extends Store<IClientUnit> {
  form: IClientUnit = {
    _id: null,
    vendor: '',
    name: '',
    authCode: '',
    isScreenRecordingOn: false,
    whitelist: [],
    businessUnits: [],
    titles: [],
  }
  businessUnitForm: BusinessUnit = {
    _id: '',
    name: '',
    countryIds: [],
    adminCountryIds: [],
    businessCycles: [],
  }
  businessCycleForm: BusinessCycle = {
    _id: '',
    assessmentCycleId: '',
    settingsByDomainIds: [],
    isScreenRecordingOn: false,
    gradeType: GradeType.Basic,
  }
  defaultForm: IClientUnit = _.cloneDeep(this.form)
  updateType: UpdateType = UpdateType.ClientUnit
  mutate: any = null
  constructor(store: RootStore, repository: ClientUnitRepository) {
    super(store, repository)
    makeObservable(this, {
      form: observable,
      businessUnitForm: observable,
      businessCycleForm: observable,
      updateType: observable,
    })
  }

  resetBusinessUnitForm() {
    this.businessUnitForm = {
      _id: '',
      name: '',
      countryIds: [],
      adminCountryIds: [],
      businessCycles: [],
    }
  }

  resetBusinessCycleForm() {
    this.businessCycleForm = {
      _id: '',
      assessmentCycleId: '',
      settingsByDomainIds: [],
      isScreenRecordingOn: false,
      gradeType: GradeType.Basic,
    }
  }

  addBusinessUnit() {
    const newBusinessUnit: BusinessUnit = this.businessUnitForm
    this.form.businessUnits.push(newBusinessUnit)
  }

  removeBusinessUnit(index: number) {
    this.form.businessUnits.splice(index, 1)
  }

  addBusinessCycle(scorerSettingDomain: ScorerSettingDomain[]) {
    const settingsByDomainIds: SettingsByDomainId[] = scorerSettingDomain.map(
      (_scorerSettingDomain) => ({
        domainId: _scorerSettingDomain._id,
        minScore: _scorerSettingDomain.minScore,
      })
    )
    const newBusinessCycle: BusinessCycle = {
      _id: '',
      assessmentCycleId: '',
      settingsByDomainIds,
      isScreenRecordingOn: false,
      gradeType: GradeType.Basic,
    }
    this.businessUnitForm.businessCycles.push(newBusinessCycle)
  }

  removeBusinessCycle(index: number) {
    this.businessUnitForm.businessCycles.splice(index, 1)
  }

  *update() {
    const adminLogManager = AdminLogManager.getInstance()
    if (!this.form._id) return
    switch (this.updateType) {
      case UpdateType.ClientUnit: {
        yield axios.patch(`/v1/clientUnits/${this.form._id}`, this.form)
        yield adminLogManager?.createEditLog({
          screen: AdminLogScreen.Clients,
          target: {
            type: AdminLogTargetType.ClientUnit,
            _id: this.form._id,
            message: 'client unit',
          },
          resource: {
            ...this.form,
          },
        })
        break
      }
      case UpdateType.BusinessUnit: {
        if (this.businessUnitForm._id) {
          yield axios.patch(
            `/v1/clientUnits/${this.form._id}/${this.businessUnitForm._id}`,
            this.businessUnitForm
          )
          yield adminLogManager?.createEditLog({
            screen: AdminLogScreen.Clients,
            target: {
              type: AdminLogTargetType.ClientUnit,
              _id: this.form._id,
              message: 'business unit',
            },
            resource: {
              ...this.form,
            },
          })
        } else {
          yield axios.post(
            `/v1/clientUnits/${this.form._id}/${this.businessUnitForm._id}`,
            this.businessUnitForm
          )
          yield adminLogManager?.createAddLog({
            screen: AdminLogScreen.Clients,
            target: {
              type: AdminLogTargetType.ClientUnit,
              _id: this.form._id,
              message: 'business unit',
            },
            resource: {
              ...this.form,
            },
          })
        }
        break
      }
      case UpdateType.BusinessCycle: {
        yield axios.patch(
          `/v1/clientUnits/${this.form._id}/${this.businessUnitForm._id}/${this.businessCycleForm._id}`,
          this.businessCycleForm
        )
        yield adminLogManager?.createEditLog({
          screen: AdminLogScreen.Clients,
          target: {
            type: AdminLogTargetType.ClientUnit,
            _id: this.form._id,
            message: 'business cycle',
          },
          resource: {
            ...this.form,
          },
        })
        break
      }
      default: {
        break
      }
    }
    this.resetForm()
    this.resetBusinessUnitForm()
    this.resetBusinessCycleForm()
    this.mutate && this.mutate()
  }

  async updateScreenRecordingOption(clientUnitId: string, toggle: boolean) {
    try {
      await axios.patch(
        `/v1/clientUnits/${clientUnitId}/screenRecording/${toggle}`
      )
    } catch (e) {
      throw e
    }
  }

  *delete() {
    const adminLogManager = AdminLogManager.getInstance()
    if (!this.form._id) return
    yield axios.delete(`/v1/clientUnits/${this.form._id}`)
    yield adminLogManager?.createDeleteLog({
      screen: AdminLogScreen.Clients,
      target: {
        type: AdminLogTargetType.ClientUnit,
        _id: this.form._id,
        message: 'client unit',
      },
    })
    this.resetForm()
    this.resetBusinessUnitForm()
    this.resetBusinessCycleForm()
    this.mutate && this.mutate()
  }
}
