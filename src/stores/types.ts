import { RootStore } from './root'

export type K = keyof RootStore
export type RootStoreKeys = K

export interface IStore {
  loadData?(data: any): void
  mode?: FormMode
  mutate?: any
}

export enum FormMode {
  New = 'new',
  Edit = 'edit',
}
