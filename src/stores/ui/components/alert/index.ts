import { makeAutoObservable } from 'mobx'
import Swal from 'sweetalert2'
import UiState from '../..'

export default class Alert {
  uiState: UiState
  constructor(uiState: UiState) {
    this.uiState = uiState
    makeAutoObservable(this, {
      uiState: false,
    })
  }

  success() {
    Swal.fire({
      heightAuto: false,
      title: 'Success',
      icon: 'success',
    })
  }

  error(text?: string) {
    Swal.fire({
      heightAuto: false,
      title: 'Error',
      text: text,
      icon: 'error',
    })
  }
}
