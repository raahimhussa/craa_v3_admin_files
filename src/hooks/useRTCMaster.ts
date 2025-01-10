import { Role, SignalingClient } from 'amazon-kinesis-video-streams-webrtc'
import AWS from 'aws-sdk'
import { useLocalObservable } from 'mobx-react'
import { RefObject, useEffect } from 'react'

type KVSConfig = {
  channelName: string
  region: string
  accessKeyId: string
  secretAccessKey: string
  sessionToken?: string
  natTraversalDisabled: boolean
  forceTURN: boolean
  useTrickleICE: boolean
  openDataChannel?: boolean
}

type Master = {
  signalingClient: SignalingClient | null
  peerConnectionByClientId: any
  dataChannelByClientId: any
  stream: MediaStream | null
  remoteStreams: MediaStream[]
  peerConnectionStatsInterval: any
}

export const useRTCMaster = (
  stream: MediaStream | null = null,
  config: KVSConfig,
  videoRef: RefObject<HTMLVideoElement> | null,
  onStatsReport?: (value: RTCStatsReport) => any,
  onRemoteDataMessage?: RTCDataChannel['onmessage']
) => {
  const master: Master = {
    signalingClient: null,
    peerConnectionByClientId: {},
    dataChannelByClientId: {},
    stream: stream,
    remoteStreams: [],
    peerConnectionStatsInterval: true,
  }
  const state = useLocalObservable(() => ({
    isLoading: true,
    master: master
  }))

  const kinesisVideoClient = new AWS.KinesisVideo({
    region: config.region,
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
    correctClockSkew: true,
  })


  async function startMaster() {
    state.isLoading = true
    const describeSignalingChannelResponse: any = await kinesisVideoClient
      .describeSignalingChannel({ ChannelName: config.channelName })
      .promise()
    const channelARN = describeSignalingChannelResponse.ChannelInfo.ChannelARN

    const getSignalingChannelEndpointResponse: any = await kinesisVideoClient
      .getSignalingChannelEndpoint({
        ChannelARN: channelARN,
        SingleMasterChannelEndpointConfiguration: {
          Protocols: ['WSS', 'HTTPS'],
          Role: Role.MASTER,
        },
      })
      .promise()

    const endpointsByProtocol = getSignalingChannelEndpointResponse.ResourceEndpointList.reduce(
      (endpoints: any, endpoint: any) => {
        endpoints[endpoint.Protocol] = endpoint.ResourceEndpoint
        return endpoints
      },
      {}
    )

    state.master.signalingClient = new SignalingClient({
      channelARN,
      channelEndpoint: endpointsByProtocol.WSS,
      role: Role.MASTER,
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
        sessionToken: config.sessionToken,
      },
      systemClockOffset: kinesisVideoClient.config.systemClockOffset,
    })

    const kinesisVideoSignalingChannelsClient = new AWS.KinesisVideoSignalingChannels({
      region: config.region,
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
      endpoint: endpointsByProtocol.HTTPS,
      correctClockSkew: true,
    })

    const getIceServerConfigResponse: any = await kinesisVideoSignalingChannelsClient
      .getIceServerConfig({
        ChannelARN: channelARN,
      })
      .promise()

    const iceServers = []

    if (!config.natTraversalDisabled && !config.forceTURN) {
      iceServers.push({ urls: `stun:stun.kinesisvideo.${config.region}.amazonaws.com:443` })
    }

    if (!config.natTraversalDisabled) {
      getIceServerConfigResponse.IceServerList.forEach((iceServer: any) =>
        iceServers.push({
          urls: iceServer.Uris,
          username: iceServer.Username,
          credential: iceServer.Password,
        })
      )
    }

    const configuration: any = {
      iceServers,
      iceTransportPolicy: config.forceTURN ? 'relay' : 'all',
    }

    state.master.signalingClient.on('open', async () => {
      console.info('[MASTER] Connected to signaling service')
    })

    state.master.signalingClient.on('sdpOffer', async (offer: any, remoteClientId: any) => {
      console.info('[MASTER] Received SDP offer from client: ' + remoteClientId)

      // Create a new peer connection using the offer from the given client
      const peerConnection = new RTCPeerConnection(configuration)

      state.master.peerConnectionByClientId[remoteClientId] = peerConnection

      if (config.openDataChannel && onRemoteDataMessage) {
        state.master.dataChannelByClientId[remoteClientId] =
          peerConnection.createDataChannel('kvsDataChannel')
        peerConnection.ondatachannel = (event) => {
          event.channel.onmessage = onRemoteDataMessage
        }
      }

      // Poll for connection stats
      if (!state.master.peerConnectionStatsInterval) {
        state.master.peerConnectionStatsInterval = setInterval(
          () => peerConnection.getStats().then(onStatsReport),
          1000
        )
      }

      // Send any ICE candidates to the other peer
      peerConnection.addEventListener('icecandidate', ({ candidate }) => {
        if (candidate) {
          // console.info('[MASTER] Generated ICE candidate for client: ' + remoteClientId)

          // When trickle ICE is enabled, send the ICE candidates as they are generated.
          if (config.useTrickleICE) {
            // console.info('[MASTER] Sending ICE candidate to client: ' + remoteClientId)
            state.master.signalingClient!.sendIceCandidate(candidate, remoteClientId)
          }
        } else {
          // console.info(
          //   '[MASTER] All ICE candidates have been generated for client: ' + remoteClientId
          // )

          // When trickle ICE is disabled, send the answer now that all the ICE candidates have ben generated.
          if (!config.useTrickleICE) {
            // console.info('[MASTER] Sending SDP answer to client: ' + remoteClientId)
            state.master.signalingClient!.sendSdpAnswer(
              peerConnection.localDescription!,
              remoteClientId
            )
          }
        }
      })

      // As remote tracks are received, add them to the remote view
      peerConnection.addEventListener('track', (event) => {
        console.info('[MASTER] Received remote track from client: ' + remoteClientId)
        state.master.remoteStreams.push(event.streams[0])
        if (videoRef && videoRef.current) {
          videoRef.current.srcObject = event.streams[0]
        }
      })

      // If there's no video/audio, master.localStream will be null. So, we should skip adding the tracks from it.
      if (state.master.stream) {
        state.master.stream
          ?.getTracks()
          ?.forEach((track: any) => peerConnection.addTrack(track, state.master.stream as MediaStream))
      }
      await peerConnection.setRemoteDescription(offer)

      // Create an SDP answer to send back to the client
      // console.info('[MASTER] Creating SDP answer for client: ' + remoteClientId)
      await peerConnection.setLocalDescription(
        await peerConnection.createAnswer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: true,
        })
      )

      // When trickle ICE is enabled, send the answer now and then send ICE candidates as they are generated. Otherwise wait on the ICE candidates.
      if (config.useTrickleICE) {
        // console.info('[MASTER] Sending SDP answer to client: ' + remoteClientId)
        state.master.signalingClient!.sendSdpAnswer(peerConnection.localDescription!, remoteClientId)
      }
      // console.info('[MASTER] Generating ICE candidates for client: ' + remoteClientId)
    })

    state.master.signalingClient.on('iceCandidate', async (candidate: any, remoteClientId: any) => {
      // console.info('[MASTER] Received ICE candidate from client: ' + remoteClientId)

      // Add the ICE candidate received from the client to the peer connection
      const peerConnection = state.master.peerConnectionByClientId[remoteClientId]
      peerConnection.addIceCandidate(candidate)
    })

    state.master.signalingClient.on('close', () => {
      console.info('[MASTER] Disconnected from signaling channel')
    })

    state.master.signalingClient.on('error', () => {
      console.error('[MASTER] Signaling client error')
    })
    console.info('[MASTER] Starting state.master connection')
    state.master.signalingClient.open()
    state.isLoading = false
  }

  function stopMaster() {
    console.info('[MASTER] Stopping master connection')
    if (state.master.signalingClient) {
      state.master.signalingClient.close()
      state.master.signalingClient = null
    }

    Object.keys(state.master.peerConnectionByClientId).forEach((clientId) => {
      state.master.peerConnectionByClientId[clientId].close()
    })

    state.master.peerConnectionByClientId = []

    if (state.master.stream) {
      state.master.stream?.getTracks().forEach((track: any) => track.stop())
      state.master.stream = null
    }

    state.master.remoteStreams.forEach((remoteStream: { getTracks: () => any[] }) =>
      remoteStream.getTracks().forEach((track) => track.stop())
    )

    state.master.remoteStreams = []

    if (state.master.peerConnectionStatsInterval) {
      clearInterval(state.master.peerConnectionStatsInterval)
      state.master.peerConnectionStatsInterval = null
    }

    if (state.master.dataChannelByClientId) {
      master.dataChannelByClientId = {}
    }
  }

  useEffect(() => {
    startMaster()
  }, [])

  return {
    signalingClient: state.master.signalingClient,
    peerConnectionByClientId: state.master.peerConnectionByClientId,
    isLoading: state.isLoading
  }
}
