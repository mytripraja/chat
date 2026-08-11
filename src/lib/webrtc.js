import { ID } from 'appwrite';
import { client, databases, DATABASE_ID } from './appwrite';

const CALLS_COLLECTION = 'calls';

const RTC_CONFIG = {
  iceServers: [{ urls: 'stun:stun1.l.google.com:19302' }],
}

let activePc = null
let activeLocalStream = null
let activeUnsubscribes = []
let pendingIceCandidates = []

export function getLocalStream() {
  return activeLocalStream
}

export function getPeerConnection() {
  return activePc
}

function cleanupPeerConnection() {
  activeUnsubscribes.forEach((unsub) => unsub())
  activeUnsubscribes = []
  pendingIceCandidates = []
  if (activePc) {
    activePc.onicecandidate = null
    activePc.ontrack = null
    activePc.onconnectionstatechange = null
    activePc.close()
    activePc = null
  }
  if (activeLocalStream) {
    activeLocalStream.getTracks().forEach((track) => track.stop())
    activeLocalStream = null
  }
}

function queueOrAddIceCandidate(pc, candidate) {
  if (!pc || pc.signalingState === 'closed') return
  if (!candidate) return
  if (pc.remoteDescription) {
    pc.addIceCandidate(new RTCIceCandidate(candidate)).catch(() => {})
  } else {
    pendingIceCandidates.push(candidate)
  }
}

function flushIceCandidates(pc) {
  pendingIceCandidates.forEach((candidate) => {
    pc.addIceCandidate(new RTCIceCandidate(candidate)).catch(() => {})
  })
  pendingIceCandidates = []
}

export async function startCall({
  callerId, calleeId, chatId, type,
  onLocalStream, onRemoteStream, onStatusChange, onError,
}) {
  cleanupPeerConnection()

  let stream
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: type === 'video',
    })
    activeLocalStream = stream
    onLocalStream?.(stream)
  } catch (error) {
    onError?.(new Error('Could not access camera/microphone. Check permissions.'))
    return null
  }

  const pc = new RTCPeerConnection(RTC_CONFIG)
  activePc = pc
  stream.getTracks().forEach((track) => pc.addTrack(track, stream))

  const callId = ID.unique()
  
  // Initialize the call document in Appwrite
  await databases.createDocument(DATABASE_ID, CALLS_COLLECTION, callId, {
    callerId,
    calleeId,
    chatId,
    type,
    status: 'ringing',
    callerCandidates: [],
    calleeCandidates: [],
  })

  let localCandidates = []
  pc.onicecandidate = (event) => {
    if (event.candidate) {
      localCandidates.push(JSON.stringify(event.candidate.toJSON()))
      databases.updateDocument(DATABASE_ID, CALLS_COLLECTION, callId, {
        callerCandidates: localCandidates
      }).catch(() => {})
    }
  }

  pc.ontrack = (event) => {
    onRemoteStream?.(event.streams[0])
  }

  pc.onconnectionstatechange = () => {
    if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
      onStatusChange?.('ended')
    }
  }

  // Listen to the call document for answers and remote ICE candidates
  const channel = `databases.${DATABASE_ID}.collections.${CALLS_COLLECTION}.documents.${callId}`;
  let processedCandidates = new Set();

  const unsubCall = client.subscribe(channel, (snap) => {
    const data = snap.payload
    if (!data) return

    // 1. Handle Answer
    if (data.status === 'active' && data.answer) {
      const remoteDesc = JSON.parse(data.answer)
      if (pc.remoteDescription?.sdp !== remoteDesc.sdp) {
        pc.setRemoteDescription(new RTCSessionDescription(remoteDesc))
          .then(() => flushIceCandidates(pc))
          .catch(() => {})
      }
      onStatusChange?.('active')
    } else if (['ended', 'declined', 'missed'].includes(data.status)) {
      onStatusChange?.(data.status)
    }

    // 2. Handle Callee Candidates
    if (data.calleeCandidates && data.calleeCandidates.length > 0) {
      data.calleeCandidates.forEach(candStr => {
        if (!processedCandidates.has(candStr)) {
          processedCandidates.add(candStr)
          queueOrAddIceCandidate(pc, JSON.parse(candStr))
        }
      })
    }
  })
  activeUnsubscribes.push(unsubCall)

  const offer = await pc.createOffer()
  await pc.setLocalDescription(offer)
  await databases.updateDocument(DATABASE_ID, CALLS_COLLECTION, callId, { 
    offer: JSON.stringify(pc.localDescription) 
  })

  onStatusChange?.('ringing')
  return callId
}

export async function answerCall({
  callId, type,
  onLocalStream, onRemoteStream, onStatusChange, onError,
}) {
  cleanupPeerConnection()

  let callData
  try {
    callData = await databases.getDocument(DATABASE_ID, CALLS_COLLECTION, callId)
    if (!callData.offer) throw new Error('Call offer is not ready yet')
  } catch (error) {
    onError?.(error)
    return
  }

  let stream
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: type === 'video',
    })
    activeLocalStream = stream
    onLocalStream?.(stream)
  } catch (error) {
    onError?.(new Error('Could not access camera/microphone. Check permissions.'))
    return
  }

  const pc = new RTCPeerConnection(RTC_CONFIG)
  activePc = pc
  stream.getTracks().forEach((track) => pc.addTrack(track, stream))

  let localCandidates = []
  pc.onicecandidate = (event) => {
    if (event.candidate) {
      localCandidates.push(JSON.stringify(event.candidate.toJSON()))
      databases.updateDocument(DATABASE_ID, CALLS_COLLECTION, callId, {
        calleeCandidates: localCandidates
      }).catch(() => {})
    }
  }

  pc.ontrack = (event) => {
    onRemoteStream?.(event.streams[0])
  }

  pc.onconnectionstatechange = () => {
    if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
      onStatusChange?.('ended')
    }
  }

  const remoteOffer = JSON.parse(callData.offer)
  await pc.setRemoteDescription(new RTCSessionDescription(remoteOffer))

  const channel = `databases.${DATABASE_ID}.collections.${CALLS_COLLECTION}.documents.${callId}`;
  let processedCandidates = new Set();

  const unsubCall = client.subscribe(channel, (snap) => {
    const data = snap.payload
    if (!data) return

    if (['ended', 'declined', 'missed'].includes(data.status)) {
      onStatusChange?.(data.status)
    }

    if (data.callerCandidates && data.callerCandidates.length > 0) {
      data.callerCandidates.forEach(candStr => {
        if (!processedCandidates.has(candStr)) {
          processedCandidates.add(candStr)
          queueOrAddIceCandidate(pc, JSON.parse(candStr))
        }
      })
    }
  })
  activeUnsubscribes.push(unsubCall)

  // Process any candidates that existed before we subscribed
  if (callData.callerCandidates && callData.callerCandidates.length > 0) {
    callData.callerCandidates.forEach(candStr => {
      processedCandidates.add(candStr)
      queueOrAddIceCandidate(pc, JSON.parse(candStr))
    })
  }

  const answer = await pc.createAnswer()
  await pc.setLocalDescription(answer)
  
  await databases.updateDocument(DATABASE_ID, CALLS_COLLECTION, callId, {
    status: 'active',
    answer: JSON.stringify(pc.localDescription),
  })

  onStatusChange?.('active')
  return callId
}

export async function endCall(callId) {
  if (callId) {
    try {
      await databases.updateDocument(DATABASE_ID, CALLS_COLLECTION, callId, {
        status: 'ended',
      })
    } catch {
      // call may already be gone — ignore
    }
  }
  cleanupPeerConnection()
}

export async function declineCall(callId) {
  if (callId) {
    try {
      await databases.updateDocument(DATABASE_ID, CALLS_COLLECTION, callId, {
        status: 'declined',
      })
    } catch {
      // ignore
    }
  }
  cleanupPeerConnection()
}