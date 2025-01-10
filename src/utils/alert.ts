import axios from 'axios'
import { SweetAlertIcon, SweetAlertOptions } from 'sweetalert2'
import Swal from 'sweetalert2/dist/sweetalert2.all.js'

class Alert {
  static fire(options: SweetAlertOptions, type: SweetAlertIcon = 'error') {
    const defaultOptions: SweetAlertOptions = {
      text: '',
      icon: type,
    }

    if (type === 'error') defaultOptions.title = 'Error'
    else if (type === 'success') defaultOptions.title = 'Success'
    else if (type === 'info') defaultOptions.title = 'Info'
    else if (type === 'warning') defaultOptions.title = 'Warning'

    const _options = { ...defaultOptions, ...options }
    Swal.fire(_options)
  }

  static handle(error: unknown): void {
    if (axios.isAxiosError(error)) {
      // axios error handle
      const errorMsg = error.response?.data.errors
        .map((error: { title?: string; detail: string }) => error.detail)
        .join('|')
      console.error('errorMsg', errorMsg)
      this.fire({ text: errorMsg })
    } else {
      // stock error handle
      console.error(error)
      this.fire({ text: JSON.stringify(error) })
    }
  }

  static confirm(options: SweetAlertOptions, onConfirm: null, onCancel?: null) {
    const defaultOptions: SweetAlertOptions = {
      title: 'Info',
      text: '',
      icon: 'info',
    }
    if (typeof onConfirm === 'function') defaultOptions.confirmButtonText = 'Confirm'
    if (typeof onCancel === 'function') defaultOptions.cancelButtonText = 'Confirm'

    const _options = { ...defaultOptions, ...options }

    Swal.fire(_options)
  }
}

export default Alert
