import {
  addDoc, collection, doc, getDoc, onSnapshot, serverTimestamp, setDoc, updateDoc,
} from 'firebase/firestore'
import { db } from './firebase'

// Signaling rides on Firestore so no extra backend is needed:
//   calls/{callId}                          -> call metadata + SDP offer/answer
//   calls/{callId}/callerCandidates         -> ICE candidates from the caller
//   calls/{callId}/calleeCandidates         -> ICE candidates from the callee

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

// Candidates can arrive before the remote description is set (trickle ICE),
// so buffer them and flush once the description lands.
function queueOrAddIceCandidate(pc, candidate) {
  if (!pc || pc.signalingState === 'closed') return
  if (!candidate) return
  if (pc.remoteDescription) {
    pc.addIceCandidate(candidate).catch(() => {})
  } else {
    pendingIceCandidates.push(candidate)
  }
}

function flushIceCandidates(pc) {
  pendingIceCandidates.forEach((candidate) => {
    pc.addIceCandidate(candidate).catch(() => {})
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

  const callId = `${callerId}_${calleeId}_${Date.now()}`
  const callRef = doc(db, 'calls', callId)
  const callerCandidatesRef = collection(callRef, 'callerCandidates')
  const calleeCandidatesRef = collection(callRef, 'calleeCandidates')

  pc.onicecandidate = (event) => {
    if (event.candidate) {
      addDoc(callerCandidatesRef, event.candidate.toJSON()).catch(() => {})
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

  const unsubCall = onSnapshot(callRef, (snap) => {
    const data = snap.data()
    if (!data) return
    if (data.status === 'active' && data.answer) {
      if (pc.remoteDescription?.sdp !== data.answer.sdp) {
        pc.setRemoteDescription(data.answer)
          .then(() => flushIceCandidates(pc))
          .catch(() => {})
      }
      onStatusChange?.('active')
    } else if (['ended', 'declined', 'missed'].includes(data.status)) {
      onStatusChange?.(data.status)
    }
  })
  activeUnsubscribes.push(unsubCall)

  const unsubCandidates = onSnapshot(calleeCandidatesRef, (snap) => {
    snap.docChanges().forEach((change) => {
      if (change.type === 'added') {
        queueOrAddIceCandidate(pc, change.doc.data())
      }
    })
  })
  activeUnsubscribes.push(unsubCandidates)

  await setDoc(callRef, {
    callerId,
    calleeId,
    chatId,
    type,
    status: 'ringing',
    offer: null,
    createdAt: serverTimestamp(),
  })

  const offer = await pc.createOffer()
  await pc.setLocalDescription(offer)
  await updateDoc(callRef, { offer: pc.localDescription })

  onStatusChange?.('ringing')
  return callId
}

export async function answerCall({
  callId, type,
  onLocalStream, onRemoteStream, onStatusChange, onError,
}) {
  cleanupPeerConnection()

  const callRef = doc(db, 'calls', callId)

  let callData
  try {
    const snap = await getDoc(callRef)
    if (!snap.exists()) throw new Error('Call not found')
    callData = snap.data()
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

  const callerCandidatesRef = collection(callRef, 'callerCandidates')
  const calleeCandidatesRef = collection(callRef, 'calleeCandidates')

  pc.onicecandidate = (event) => {
    if (event.candidate) {
      addDoc(calleeCandidatesRef, event.candidate.toJSON()).catch(() => {})
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

  await pc.setRemoteDescription(callData.offer)

  const unsubCandidates = onSnapshot(callerCandidatesRef, (snap) => {
    snap.docChanges().forEach((change) => {
      if (change.type === 'added') {
        queueOrAddIceCandidate(pc, change.doc.data())
      }
    })
  })
  activeUnsubscribes.push(unsubCandidates)

  const unsubCall = onSnapshot(callRef, (snap) => {
    const data = snap.data()
    if (!data) return
    if (['ended', 'declined', 'missed'].includes(data.status)) {
      onStatusChange?.(data.status)
    }
  })
  activeUnsubscribes.push(unsubCall)

  const answer = await pc.createAnswer()
  await pc.setLocalDescription(answer)
  await updateDoc(callRef, {
    status: 'active',
    answer: pc.localDescription,
    answeredAt: serverTimestamp(),
  })

  onStatusChange?.('active')
  return callId
}

export async function endCall(callId) {
  if (callId) {
    try {
      await updateDoc(doc(db, 'calls', callId), {
        status: 'ended',
        endedAt: serverTimestamp(),
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
      await updateDoc(doc(db, 'calls', callId), {
        status: 'declined',
        endedAt: serverTimestamp(),
      })
    } catch {
      // ignore
    }
  }
  cleanupPeerConnection()
}
