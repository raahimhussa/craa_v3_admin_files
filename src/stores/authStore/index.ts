import {
  IReactionDisposer,
  makeAutoObservable,
  reaction,
  runInAction,
  toJS,
} from 'mobx'
import axios, { AxiosResponse } from 'axios'
import { getCookie, removeCookies, setCookies } from 'cookies-next'

import { ISignInUser } from './types'
import { IStore } from '../types'
import { RoleTitle } from '../roleStore'
import { RootStore } from '../root'
import RouterStore from '../routerStore'
import Swal from 'sweetalert2'
import UserRepository from 'src/repos/v1/user'
import _ from 'lodash'

const mode = import.meta.env.MODE

export default class AuthStore implements IStore {
  rootStore: RootStore
  router: RouterStore
  loggingIn: boolean = false
  loggingOut: boolean = false
  isLoading = false
  // user: any = null
  user: any = {
    _id: '',
    email: '',
    name: '',
    password: '',
    roleId: '',
    profile: {},
    status: {},
    otpData: {
      otp_enabled: false,
      otp_verified: false,
    },
  }
  signInUser: ISignInUser = {
    usernameOrEmail: '',
    password: '',
  }
  form: any
  delete: any

  signUpUser = {
    email: '',
    name: '',
    password: '',
    passwordConfirm: '',
    profile: {
      authCode: '',
      clientId: '',
      businessUnitId: '',
      title: '',
      monitoring: 0,
      lastName: '',
      firstName: '',
      countryId: '',
    },
  }
  verifiedAuthCode: {
    clientId: string
  } | null = null
  repository: UserRepository

  authHandler: IReactionDisposer

  constructor(rootStore: RootStore, repository: UserRepository) {
    this.rootStore = rootStore
    this.repository = repository
    this.router = rootStore.routerStore
    makeAutoObservable(this, {
      rootStore: false,
    })

    this.authHandler = reaction(
      () => this.user,
      (user) => {
        if (user && this.rootStore.routerStore) {
          switch (user.role.title) {
            case RoleTitle.SimScorer:
              this.rootStore.routerStore.go('scorer:scorings')
              break
            // case RoleTitle.Admin:
            //   this.rootStore.routerStore.navigate('/admin/users')
            //   break
            // case RoleTitle.SuperAdmin:
            //   this.rootStore.routerStore.navigate('/admin/users')
            //   break
            default:
              break
          }
        }
      }
    )
  }
  mutate: any

  loadData(data: any): void {}

  *signin() {
    axios.defaults.withCredentials = true

    this.loggingIn = true

    let res: AxiosResponse | null = null
    try {
      res = yield axios.post('v1/auth/signin', toJS(this.signInUser))
      const mode = process.env.NODE_ENV

      const { accessToken, refreshToken, role, user_id } = res!.data
      console.log('res>>>', res)

      if (mode === 'production') {
        setCookies('accessToken', accessToken, { domain: '.hoansoft.com' })
        setCookies('refreshToken', refreshToken, { domain: '.hoansoft.com' })
        setCookies('role', role, { domain: '.hoansoft.com' })
      } else {
        setCookies('accessToken', accessToken)
        setCookies('refreshToken', refreshToken)
        setCookies('role', role)
      }

      this.loggingIn = false

      axios.defaults.withCredentials = false
      if (role === 'SimUser') {
        window.location.href =
          mode === 'production'
            ? 'https://craa-app-dev-3.hoansoft.com/home'
            : 'http://localhost:3000/home'
      } else if (
        role === 'SuperAdmin' ||
        role === 'Admin' ||
        role === 'SimScorer'
      ) {
        // window.location.href = 'https://craa-admin-dev-3.hoansoft.com/';
        window.location.href =
          mode === 'production'
            ? 'https://craa-admin-dev-3.hoansoft.com/'
            : 'http://localhost:3001/'
      } else if (role === 'ClientSubAdmin' || role === 'ClientAdmin') {
        window.location.href =
          mode === 'production'
            ? 'https://craa-client-dev-3.hoansoft.com/'
            : 'http://localhost:3002/'
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        error.response?.data.errors.map((error: any) => {
          if (error.detail === 'Passwords do not match.') {
            Swal.fire({
              title: 'Passwords do not match.',
              icon: 'error',
              heightAuto: false,
            })
          } else if (
            error.detail === 'The user does not exist and email is not verified'
          ) {
            Swal.fire({
              title: 'The user does not exist and email is not verified',
              icon: 'error',
              heightAuto: false,
            })
          }
        })

        return null
      }
    }
  }

  async realSignIn(res: any) {
    try {
      const mode = process.env.NODE_ENV

      const { accessToken, refreshToken, role, user_id } = res!.data

      if (mode === 'production') {
        setCookies('accessToken', accessToken, { domain: '.hoansoft.com' })
        setCookies('refreshToken', refreshToken, { domain: '.hoansoft.com' })
        setCookies('role', role, { domain: '.hoansoft.com' })
      } else {
        setCookies('accessToken', accessToken)
        setCookies('refreshToken', refreshToken)
        setCookies('role', role)
      }

      this.loggingIn = false

      axios.defaults.withCredentials = false
      if (role === 'SimUser') {
        this.router.go('/home')
      } else if (
        role === 'SuperAdmin' ||
        role === 'Admin' ||
        role === 'SimScorer'
      ) {
        // window.location.href = 'https://craa-admin-dev-3.hoansoft.com/';
        window.location.href =
          mode === 'production'
            ? 'https://craa-admin-dev-3.hoansoft.com/'
            : 'http://localhost:3001/'
      } else if (role === 'ClientSubAdmin' || role === 'ClientAdmin') {
        window.location.href = 'production'
          ? 'https://craa-client-dev-3.hoansoft.com/'
          : 'http://localhost:3002/'
      }
    } catch (error) {
      console.log(error)
    }
  }

  *verfiyEmail() {
    const signupUser = _.cloneDeep(this.signUpUser)
    const authCode = signupUser.profile.authCode

    if (!signupUser.email) {
      Swal.fire({
        title: 'Enter your email',
        icon: 'error',
        heightAuto: false,
      })
    } else if (!signupUser.name)
      try {
        const { data } = yield axios.get(
          `v1/authCodes/verifyAuthCode/${authCode}`
        )
        this.verifiedAuthCode = data
      } catch (error) {
        if (axios.isAxiosError(error)) {
          Swal.fire({
            title: 'Error!',
            text: 'Invalid AuthCode!',
            icon: 'error',
            heightAuto: false,
          })
          return null
        }
      }

    signupUser.profile.clientId = this.verifiedAuthCode?.clientId!

    try {
      yield axios.post('v1/auth/verifyEmail', signupUser)
    } catch (error) {
      Swal.fire({
        title: 'Email Sending Error!',
        icon: 'error',
        heightAuto: false,
      })
      return null
    }

    Swal.fire({
      title: 'Check your Email',
      icon: 'success',
      heightAuto: false,
    })
  }

  *signup(signUpUser: any) {
    delete signUpUser.passwordConfirm
    yield axios.post('v1/auth/signup', signUpUser)
  }

  done() {
    // this.rootStore.routerStore.go('/auth/signin')
    const mode = import.meta.env.MODE
    if (mode === 'production') {
      window.location.replace('https://craa-app-dev-3.hoansoft.com/auth/signin')
    } else {
      window.location.replace('http://localhost:3000/auth/signin')
    }
  }

  *logout() {
    this.isLoading = true

    const token = getCookie('accessToken')

    const params = {
      headers: { authorization: ('Bearer ' + token) as string },
      withCredentials: true,
    }

    try {
      yield axios.delete(`v1/auth/logout/${token}`, params)
    } catch (error) {
      return Swal.fire({
        title: 'Internal Server Error',
        icon: 'error',
      })
    }
    this.isLoading = false

    // this.rootStore.routerStore.router &&
    //   this.rootStore.routerStore.router('/auth/signin')
    if (mode === 'production') {
      window.location.replace('https://craa-app-dev-3.hoansoft.com/auth/signin')
    } else {
      window.location.replace('http://localhost:3000/auth/signin')
    }

    this.rootStore.authStore.user = null

    removeCookies('accessToken')
    removeCookies('refreshToken')
  }
}
