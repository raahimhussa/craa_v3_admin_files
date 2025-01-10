import axios from 'axios'

export const fetcher = async (url: string, params: any) => {
  let res = null
  try {
    res = await axios.get(url, { params })
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(error.request)
      console.error(error.response)
      console.error(error.config)
    }
  }

  return res?.data
}

export const fetcherWithToken = (url: string, token: string) =>
  axios
    .get(url, {
      headers: {
        authorization: ('Bearer ' + token) as string,
      },
      withCredentials: true,
    })
    .then((res) => res.data)
    .catch((err) => console.log(err.response))
