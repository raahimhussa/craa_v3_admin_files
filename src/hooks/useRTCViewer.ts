import { Role, SignalingClient } from 'amazon-kinesis-video-streams-webrtc'
import AWS from 'aws-sdk'
import { RefObject, useEffect } from 'react'
function getRandomClientId() {
  return Math.random().toString(36).substring(2).toUpperCase()
}

type KVSConfig = {
  channelName: string
  region: string
  accessKeyId: string
  secretAccessKey: string
}

type Viewer = any

export const useRTCViewer = (
  config: KVSConfig,
  videoRef: RefObject<HTMLVideoElement>,
): Viewer => {
  const viewer: Viewer = {
    signalingClient: null,
    remoteStreams: [],
  }

  const kinesisVideoClient = new AWS.KinesisVideo({
    region: config.region,
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
    correctClockSkew: true,
  })

  useEffect(() => {
    async function startViewer() {
      const describeSignalingChannelResponse: any = await kinesisVideoClient
        .describeSignalingChannel({
          ChannelName: config.channelName,
        })
        .promise()
      const channelARN = describeSignalingChannelResponse.ChannelInfo.ChannelARN
      console.info('[VIEWER] Channel ARN: ', channelARN)

      // Get signaling channel endpoints
      const getSignalingChannelEndpointResponse: any = await kinesisVideoClient
        .getSignalingChannelEndpoint({
          ChannelARN: channelARN,
          SingleMasterChannelEndpointConfiguration: {
            Protocols: ['WSS', 'HTTPS'],
            Role: Role.VIEWER,
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

      console.info('[VIEWER] Endpoints: ', endpointsByProtocol)

      const kinesisVideoSignalingChannelsClient = new AWS.KinesisVideoSignalingChannels({
        region: config.region,
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
        endpoint: endpointsByProtocol.HTTPS,
        correctClockSkew: true,
      })

      // Get ICE server configuration
      const getIceServerConfigResponse: any = await kinesisVideoSignalingChannelsClient
        .getIceServerConfig({
          ChannelARN: channelARN,
        })
        .promise()
      const iceServers = []

      iceServers.push({ urls: `stun:stun.kinesisvideo.${config.region}.amazonaws.com:443` })

      getIceServerConfigResponse.IceServerList.forEach((iceServer: any) =>
        iceServers.push({
          urls: iceServer.Uris,
          username: iceServer.Username,
          credential: iceServer.Password,
        })
      )

      const clientId = getRandomClientId()

      console.info('[VIEWER] ICE servers: ', iceServers)
      console.info('[VIEWER] clienId: ', clientId)

      // Create Signaling Client
      viewer.signalingClient = new SignalingClient({
        channelARN,
        channelEndpoint: endpointsByProtocol.WSS,
        clientId: clientId,
        role: Role.VIEWER,
        region: config.region,
        credentials: {
          accessKeyId: config.accessKeyId,
          secretAccessKey: config.secretAccessKey,
        },
        systemClockOffset: kinesisVideoClient.config.systemClockOffset,
      })

      const configuration: any = {
        iceServers,
        iceTransportPolicy: 'all',
      }

      viewer.peerConnection = new RTCPeerConnection(configuration)

      viewer.signalingClient.on('open', async () => {
        console.info('[VIEWER] Connected to signaling service')

        // Create an SDP offer to send to the master
        console.info('[VIEWER] Creating SDP offer')
        await viewer.peerConnection.setLocalDescription(
          await viewer.peerConnection.createOffer({
            offerToReceiveAudio: true,
            offerToReceiveVideo: true,
          })
        )
      })

      viewer.signalingClient.on('sdpAnswer', async (answer: any) => {
        // Add the SDP answer to the peer connection
        console.info('[VIEWER] Received SDP answer')
        await viewer.peerConnection.setRemoteDescription(answer)
      })

      viewer.signalingClient.on('iceCandidate', (candidate: any) => {
        // Add the ICE candidate received from the MASTER to the peer connection
        console.info('[VIEWER] Received ICE candidate')
        viewer.peerConnection.addIceCandidate(candidate)
      })

      viewer.signalingClient.on('close', () => {
        console.info('[VIEWER] Disconnected from signaling channel')
      })

      viewer.signalingClient.on('error', (error: any) => {
        console.error('[VIEWER] Signaling client error: ', error)
      })

      // Send any ICE candidates to the other peer
      viewer.peerConnection.addEventListener('icecandidate', ({ candidate }: any) => {
        if (candidate) {
          console.info('[VIEWER] Generated ICE candidate')
          console.info('[VIEWER] Sending ICE candidate')

          viewer.signalingClient.sendIceCandidate(candidate)
        } else {
          console.info('[VIEWER] All ICE candidates have been generated')

          viewer.signalingClient.sendSdpOffer(viewer.peerConnection.localDescription)
        }
      })

      // As remote tracks are received, add them to the remote view
      viewer.peerConnection.addEventListener('track', (event: { streams: any[] }) => {
        console.info('[VIEWER] Received remote track')
        viewer.remoteStreams.push(event.streams[0])

        if (videoRef.current) {
          videoRef.current.srcObject = event.streams[0]
        }
      })

      console.info('[VIEWER] Starting viewer connection')
      viewer.signalingClient.open()
    }

    function stopViewer() {
      console.info('[VIEWER] Stopping viewer connection')
      if (viewer.signalingClient) {
        viewer.signalingClient.close()
        viewer.signalingClient = null
      }

      if (viewer.peerConnection) {
        viewer.peerConnection.close()
        viewer.peerConnection = null
      }

      if (viewer.remoteStreams) {
        viewer.remoteStreams.getTracks().forEach((track: { stop: () => any }) => track.stop())
        viewer.remoteStreams = null
      }

      if (viewer.peerConnectionStatsInterval) {
        clearInterval(viewer.peerConnectionStatsInterval)
        viewer.peerConnectionStatsInterval = null
      }

      if (viewer.dataChannel) {
        viewer.dataChannel = null
      }
    }

    startViewer()

    return () => stopViewer()
  }, [])

  return viewer
}
