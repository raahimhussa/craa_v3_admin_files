import axios, { AxiosError } from 'axios'

import Alert from './alert'
import MobxUtil from './MobxUtil'
import uniqid from 'uniqid'

class Utils {
  static axiosErrorHandler(
    error: unknown,
    callback: (error: AxiosError) => void
  ) {
    if (axios.isAxiosError(error)) callback(error)
    else console.error(error)
  }
  static errorLog(error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('request', error.request)
      console.error('response', error.response)
    } else {
      console.error(error)
    }
  }
  static loremIpsumLong() {
    return "orem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum"
  }

  static loremIpsumShort() {
    return 'orem Ipsum is simply dummy text of the printing and typesetting industry. '
  }

  static getVarName(obj: any) {
    return Object.keys(obj)[0]
  }
  static bytesToMegaBytes(bytes: number) {
    return bytes / 1024 ** 2
  }
  static bytesToKiloBytes(bytes: number) {
    return bytes / 1024
  }

  static randomBoolean() {
    var random_boolean = Math.random() < 0.1
    return random_boolean
  }

  static matchMutate(
    cache: any,
    mutate: (arg0: any) => any,
    key: string | RegExp
  ) {
    const regex = new RegExp(key)
    if (!(cache instanceof Map)) {
      throw new Error(
        'matchMutate requires the cache provider to be a Map instance'
      )
    }

    const keys = []

    for (const key of cache.keys()) {
      // @ts-ignore
      if (regex.test(key)) {
        keys.push(key)
      }
    }
    const mutations = keys.map((key) => mutate(key))

    return Promise.all(mutations)
  }

  static makeId(length: number) {
    var result = ''
    var characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    var charactersLength = characters.length
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
  }
  static generateRandom(maxLimit = 100) {
    let rand = Math.random() * maxLimit

    rand = Math.floor(rand) // 99

    return rand
  }
  static async allProgress(
    proms: Promise<any>[],
    progress_cb: (progress: number) => void
  ): Promise<any> {
    let d = 0
    progress_cb(0)
    proms.forEach((p) => {
      p.then((res) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            d++
            progress_cb((d * 100) / proms.length)
            resolve(res)
          }, 4000)
        })
      })
    })
    return await Promise.all(proms)
  }

  static getYears(duration: number, yearInSeconds: number) {
    const rest = duration % yearInSeconds
    const durationInSeconds = duration - rest
    const years = durationInSeconds / yearInSeconds

    return {
      years,
      rest,
    }
  }

  static convert(duration: number, format: string) {
    const yearInSecondsAstr = 31557600 // 31,557,600 seconds (365.25 days)
    const yearInSecondsCal = 31536000 // 31,536,000 seconds (365 days)

    const obj = {
      years: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    }

    // if duration > 1 year : calculate years before the rest
    if (format === 'astr' && duration >= yearInSecondsAstr) {
      const res = this.getYears(duration, yearInSecondsAstr)
      obj.years = res.years // Get years
      duration = res.rest // Get rest
    } else if (format === 'cal' && duration >= yearInSecondsCal) {
      const res = this.getYears(duration, yearInSecondsCal)
      obj.years = res.years
      duration = res.rest
    }

    /// SECONDS
    if (duration < 60) {
      obj.seconds = duration
    } else if (duration === 60) {
      obj.minutes = 1
      obj.seconds = 0
    } else {
      /// MINUTES
      const restSeconds = duration % 60 // Rest in secondes
      const durationSeconds = duration - restSeconds // Duration - rest
      const minutes = durationSeconds / 60 // Total number of minutes

      if (minutes < 60) {
        obj.minutes = minutes
        obj.seconds = restSeconds
      } else if (minutes === 60) {
        obj.hours = 1
        obj.minutes = 0
        obj.seconds = restSeconds
      } else {
        /// HOURS
        const restMinutes = minutes % 60
        const durationMinutes = minutes - restMinutes
        const hours = durationMinutes / 60

        if (hours < 24) {
          obj.hours = hours
          obj.minutes = restMinutes
          obj.seconds = restSeconds
        } else if (hours === 24) {
          obj.days = 1
          obj.hours = 0
          obj.seconds = restSeconds
        } else {
          /// DAYS
          const restHours = hours % 24
          const durationHours = hours - restHours
          const days = durationHours / 24

          obj.days = days
          obj.hours = restHours
          obj.minutes = restMinutes
          obj.seconds = restSeconds
        }
      }
    }

    return obj
  }
}

export { Utils, MobxUtil, Alert }

const range = (len: number) => {
  const arr = []
  for (let i = 0; i < len; i++) {
    arr.push(i)
  }
  return arr
}

const newPerson = () => {
  const statusChance = Math.random()
  return {
    _id: uniqid(),
    firstName: 1,
    lastName: 2,
    age: {
      korea: Math.floor(Math.random() * 30),
      japan: Math.floor(Math.random() * 30),
    },
    visits: Math.floor(Math.random() * 100),
    progress: Math.floor(Math.random() * 100),
    status:
      statusChance > 0.66
        ? 'relationship'
        : statusChance > 0.33
        ? 'complicated'
        : 'single',
  }
}

export function makeData(...lens: any[]) {
  function makeDataLevel(depth = 0): any {
    const len = lens[depth]
    return range(len).map((d) => {
      return {
        ...newPerson(),
        subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
      }
    })
  }

  return makeDataLevel()
}
export function getErrMsg(error: unknown) {
  let result = 'Internel Server Error'

  if (axios.isAxiosError(error)) {
    const { message } = error.response?.data
    result = message
  } else {
    const _error = error as Error
    const message = _error.message
    console.error(message)
  }

  return result
}
