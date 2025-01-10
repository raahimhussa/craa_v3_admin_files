import { makeObservable } from 'mobx'
import TemplateStore from 'src/stores/templateStore'
import Model from '../model'
import ITemplate from './template.interface'

export class Template extends Model<ITemplate, TemplateStore> implements ITemplate {
  key!: string
  htmlContent!: string
  title!: string
  isDeleted!: boolean
  createdAt!: Date
  updatedAt!: Date
  constructor(store: TemplateStore, data: ITemplate) {
    super(store, data)
    makeObservable(this, {})
  }
}
