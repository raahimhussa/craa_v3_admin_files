import { FormMode, IStore } from '../types'
import RouterStore, { IRoute } from '../routerStore'

import IPolicy from 'src/models/policy/policy.interface'
import Policy from 'src/models/policy'
import PolicyRepository from 'src/repos/v2/policyRepository'
import { RootStore } from '../root'
import Swal from 'sweetalert2'
import axios from 'axios'
import { makeAutoObservable } from 'mobx'

export default class PolicyStore implements IStore {
  store: RootStore
  router: RouterStore
  repository: PolicyRepository
  policies: Policy[] = []
  form: IPolicy = {
    label: '',
    allowedPages: [],
    allowedActions: [],
  }
  delete: any
  routes: IRoute[] = []
  mode: FormMode = FormMode.New
  mutate: any

  constructor(store: RootStore, repository: PolicyRepository) {
    this.store = store
    this.router = store.routerStore
    this.repository = repository
    makeAutoObservable(this)
  }

  loadData(data: any) {
    this.policies = data.map((policy: IPolicy) => new Policy(this, policy))
  }

  *create() {
    try {
      yield this.repository.create(this.form)
    } catch (error) {
      if (axios.isAxiosError(error)) return console.log(error.response)
    }

    Swal.fire({
      title: 'success',
      icon: 'success',
    })
  }

  setRoutes(routePaths: any) {
    this.routes = Object.values(routePaths).map((path: any) => ({
      path: path,
      checked: false,
    }))
  }

  openModal(policy: IPolicy) {
    this.store.modalStore.policy.isVisible = true
    this.mode = FormMode.Edit
    this.form = policy
  }

  closeModal() {
    this.store.modalStore.policy.isVisible = false
  }
}
