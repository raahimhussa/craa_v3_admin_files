import { KeyedMutator } from 'swr'
export default interface Mutatable {
  _mutate: KeyedMutator<any> | null
  get mutate(): KeyedMutator<any> | null
  set mutate(value: KeyedMutator<any> | null)
}
