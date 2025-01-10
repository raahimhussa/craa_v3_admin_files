import { makeAutoObservable, toJS } from 'mobx'

import { DocumentType } from 'src/utils/status'
import { IDocument } from 'src/models/document/types'
import { IStore } from '../types'
import { RootStore } from '../root'
import RouterStore from '../routerStore'
import Document from 'src/models/document'
import DocumentRepository from 'src/repos/v1/document'
import _, { cloneDeep, truncate } from 'lodash'
import axios from 'axios'
import DocumentPage from 'src/models/documentPage'
import { useSnackbar } from 'notistack'

export default class DocumentStore implements IStore {
  store: RootStore
  router: RouterStore
  documents: Document[] = []
  documentRepository: DocumentRepository
  form: IDocument = {
    title: 'Untitled',
    versions: [],
    // versions: {},
    groupId: '',
  }
  selectedPage: number = 0
  pages: { content: string; order: number }[] = []
  doUpdate: boolean = false
  defaultForm: IDocument = _.cloneDeep(this.form)
  mutate: any
  constructor(store: RootStore, documentRepository: DocumentRepository) {
    this.store = store
    this.router = store.routerStore
    this.documentRepository = documentRepository
    makeAutoObservable(this)
  }

  loadData(data: any) {
    this.documents = data.map((data: any) => {
      const document = new Document(this, data)
      document.load(data)
      return document
    })
  }

  async save() {
    let arr: any = []
    // Promise.all(
    //   this.pages.map(async (page) => {
    //     const createdPage = await this.store.documentPageStore.create({
    //       content: page.content,
    //       order: page.order,
    //     })
    //     arr.push(createdPage?._id)
    //   })
    // ).then(() => {
    //   this.form.versions = arr
    //   return this.create()
    // })
    this.pages.map(async (page) => {
      arr.push({
        content: page.content,
        order: page.order,
      })
    })
    this.form.versions = arr
    return this.create()
  }

  async byUserSave(version: any, form: any) {
    try {
      let arr: any = []
      this.pages.map((page) => {
        arr.push({
          content: page.content,
          order: page.order,
        })
        // }
      })
      form.versions[version].push({
        pages: arr,
        date: new Date(),
        userId: this.store.authStore.user._id,
      })
      this.update(form._id, {
        $push: {
          ['versions.' + version]:
            form.versions[version][form.versions[version].length - 1],
        },
        title: form.title,
        groupId: form.groupId,
        updatedAt: new Date(),
      })
      return true
    } catch (error) {
      console.log(error)
      return false
    }
    // } finally {
    //   this.resetForm()
    // }
  }

  async autoSave() {
    try {
      let arr: any = []
      this.pages.map((page) => {
        arr.push(page)
      })
      await this.update(this.form._id, {
        draft: arr,
      })
      return true
    } catch (error) {
      console.log(error)
      return false
    }
  }

  async copy(doc: any) {
    try {
      this.resetForm()
      this.form.title = doc.title + ' copy'
      let arr: any = []
      doc.versions[doc.versions.length - 1].pages.map(async (page: any) => {
        // const params = {
        //   filter: {
        //     _id: page,
        //   },
        // }
        // const pageInfo: any = await axios.get('/v1/documentPages', { params })
        // const createdPage = await this.store.documentPageStore.create({
        //   content: pageInfo.data[0].content,
        //   order: pageInfo.data[0].order,
        // })
        arr.push({
          content: page.content,
          order: page.order,
        })
        this.form.versions = arr
        if (doc.versions[doc.versions.length - 1].pages.length === arr.length) {
          this.create()
        }
      })
      return true
    } catch (error) {
      console.log(error)
      return false
    }
  }

  async edit(form: any) {
    // console.log('edit')
    try {
      let arr: any = []
      this.pages.map((page) => {
        arr.push({
          content: page.content,
          order: page.order,
        })
        // }
      })
      form.versions = [
        {
          pages: arr,
          date: new Date(),
          userId: this.store.authStore.user._id,
        },
      ]
      await this.update(form._id, {
        $push: { versions: form.versions },
        title: form.title,
        groupId: form.groupId,
        updatedAt: new Date(),
        // isDeleted: false,
      })
      this.doUpdate = !this.doUpdate
    } catch (error) {
      console.log(error)
    } finally {
      this.resetForm()
    }

    //     Promise.all(
    //       this.pages.map(async (page) => {
    //         // if (page._id !== '') {
    //         //   await this.store.documentPageStore.update(page._id, {
    //         //     content: page.content,
    //         //     order: page.order,
    //         //   })
    //         //   arr.push(page._id)
    //         // } else {
    //         const createdPage = await this.store.documentPageStore.create({
    //           content: page.content,
    //           order: page.order,
    //         })
    //         arr.push(createdPage?._id)
    //         // }
    //       })
    //     ).then(() => {
    //       form.versions = {
    //         pages: arr,
    //         date: new Date(),
    //         userId: this.store.authStore.user._id,
    //       }
    //       return this.update(form._id, {
    //         $push: { versions: form.versions },
    //         title: form.title,
    //         updatedAt: new Date(),
    //       })
    //     })
    //   } catch (error) {
    //     console.log(error)
    //   } finally {
    //     this.resetForm()
    //   }
    //   // this.mutate()
  }

  async create() {
    // this.resetForm()
    this.form.versions = [
      [
        {
          pages: this.form.versions,
          date: new Date(),
          userId: this.store.authStore.user._id,
        },
      ],
    ]
    try {
      return (await this.documentRepository.create(toJS(this.form))).data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error.response)
      }
    }
  }
  *update(documentId: string, update: any) {
    try {
      yield this.documentRepository.update({
        filter: { _id: documentId },
        update,
      })
    } catch (error) {
      console.log({ error })
    }
    // this.mutate()
  }
  *delete(documentId: string) {
    try {
      yield this.documentRepository.update({
        filter: { _id: documentId },
        update: { isDeleted: true },
      })
      this.doUpdate = !this.doUpdate
    } catch (error) {
      throw error
    }
    // this.mutate()
  }

  resetForm() {
    this.form = _.cloneDeep(this.defaultForm)
  }
}
