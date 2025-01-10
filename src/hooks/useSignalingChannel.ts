import AWS from 'aws-sdk'
import { useEffect, useState } from 'react'
// NOT USE
type Config = {
  region: string
  accessKeyId: string
  secretAccessKey: string
  channelName: string
}

const useSignalingChannel = (config: Config) => {
  let [isLoading, setIsLoading] = useState(false)
  let [error, setError] = useState(null)
  const kinesisVideoClient = new AWS.KinesisVideo({
    region: config.region,
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
  })

  useEffect(() => {
    async function createSignalingChannel() {
      setIsLoading(true)
      try {
        await kinesisVideoClient
          .createSignalingChannel({
            ChannelName: config.channelName,
          })
          .promise()

        const describeSignalingChannelResponse: any = await kinesisVideoClient
          .describeSignalingChannel({
            ChannelName: config.channelName,
          })
          .promise()

        const channelARN = describeSignalingChannelResponse.ChannelInfo.ChannelARN

      } catch (error: any) {
        console.error(error)

        setError(error)
      } finally {
        setIsLoading(false)
      }
    }

    createSignalingChannel()
  }, [])

  return [isLoading, error]
}

export default useSignalingChannel
