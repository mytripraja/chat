import { useEffect, useRef, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { startCall, answerCall, endCall } from '../lib/webrtc'

function formatDuration(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

function Avatar({ name, size }) {
  const cls =
    size === 'lg'
      ? 'w-24 h-24 text-4xl'
      : 'w-16 h-16 text-xl'
  return (
    <div
      className={`${cls} rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold`}
    >
      {(name || '?').charAt(0).toUpperCase()}
    </div>
  )
}

const IconPhone = ({ className = 'w-6 h-6' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)

const IconVideo = ({ className = 'w-6 h-6' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="23 7 16 12 23 17 23 7" />
    <rect x="1" y="5" width="15" height="14" rx="2" />
  </svg>
)

const IconMic = ({ className = 'w-6 h-6' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
  </svg>
)

const IconMicOff = ({ className = 'w-6 h-6' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="1" y1="1" x2="23" y2="23" />
    <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
    <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
  </svg>
)

const IconVideoOff = ({ className = 'w-6 h-6' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
)

const IconPhoneOff = ({ className = 'w-6 h-6' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
)

const IconSpinner = ({ className = 'w-8 h-8' }) => (
  <svg className={`${className} animate-spin text-white`} viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
  </svg>
)

const TERMINAL_STATUSES = ['ended', 'declined', 'missed']

export default function CallModal({
  mode,
  type,
  chatId,
  call,
  peerUser,
  currentUserUid,
  onClose,
}) {
  const isIncoming = mode === 'incoming'
  const initialCallId = call?.id || null

  const [callId, setCallId] = useState(initialCallId)
  const [status, setStatus] = useState(isIncoming ? 'ringing' : 'connecting')
  const [localStream, setLocalStream] = useState(null)
  const [remoteStream, setRemoteStream] = useState(null)
  const [muted, setMuted] = useState(false)
  const [videoOff, setVideoOff] = useState(false)
  const [duration, setDuration] = useState(0)

  const callIdRef = useRef(initialCallId)
  const timerRef = useRef(null)
  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)
  const remoteAudioRef = useRef(null)

  const peerName = peerUser?.displayName || 'Unknown'

  // Start the call when mounted as the caller.
  useEffect(() => {
    if (isIncoming) return
    let cancelled = false
    startCall({
      callerId: currentUserUid,
      calleeId: peerUser?.uid,
      chatId,
      type,
      onLocalStream: (s) => { if (!cancelled) setLocalStream(s) },
      onRemoteStream: (s) => { if (!cancelled) setRemoteStream(s) },
      onStatusChange: (s) => { if (!cancelled) setStatus(s) },
      onError: () => { if (!cancelled) setStatus('error') },
    }).then((id) => {
      if (cancelled) return
      if (id) {
        callIdRef.current = id
        setCallId(id)
        setStatus('ringing')
      }
    })
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Keep the modal in sync with the call document (caller hangs up, answer, etc.).
  useEffect(() => {
    if (!callId) return
    const callRef = doc(db, 'calls', callId)
    const unsub = onSnapshot(callRef, (snap) => {
      const data = snap.data()
      if (!data) return
      if (data.status === 'active') setStatus('active')
      else if (TERMINAL_STATUSES.includes(data.status)) setStatus(data.status)
    })
    return unsub
  }, [callId])

  // Attach media streams to the DOM elements.
  useEffect(() => {
    if (localVideoRef.current && localStream) localVideoRef.current.srcObject = localStream
  }, [localStream])
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) remoteVideoRef.current.srcObject = remoteStream
  }, [remoteStream])
  useEffect(() => {
    if (remoteAudioRef.current && remoteStream) remoteAudioRef.current.srcObject = remoteStream
  }, [remoteStream])

  // Call timer.
  useEffect(() => {
    if (status !== 'active') return
    if (timerRef.current) return
    setDuration(0)
    const start = Date.now()
    timerRef.current = setInterval(() => {
      setDuration(Math.floor((Date.now() - start) / 1000))
    }, 1000)
    return () => {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [status])

  // Auto-close shortly after the call reaches a terminal state.
  useEffect(() => {
    if (!TERMINAL_STATUSES.includes(status)) return
    const id = setTimeout(() => {
      endCall(callIdRef.current).catch(() => {})
      onClose()
    }, 1800)
    return () => clearTimeout(id)
  }, [status, onClose])

  // Clean up WebRTC resources on unmount.
  useEffect(() => () => {
    endCall(callIdRef.current).catch(() => {})
  }, [])

  async function handleAccept() {
    if (!callId) return
    setStatus('connecting')
    try {
      await answerCall({
        callId,
        type,
        onLocalStream: setLocalStream,
        onRemoteStream: setRemoteStream,
        onStatusChange: setStatus,
        onError: () => setStatus('error'),
      })
    } catch {
      setStatus('error')
    }
  }

  function handleDecline() {
    endCall(callIdRef.current).catch(() => {})
    onClose()
  }

  function handleEnd() {
    endCall(callIdRef.current).catch(() => {})
    onClose()
  }

  function toggleMute() {
    if (!localStream) return
    const next = !muted
    localStream.getAudioTracks().forEach((t) => { t.enabled = !next })
    setMuted(next)
  }

  function toggleVideo() {
    if (!localStream) return
    const next = !videoOff
    localStream.getVideoTracks().forEach((t) => { t.enabled = !next })
    setVideoOff(next)
  }

  const isVideo = type === 'video'
  const isRingingIncoming = isIncoming && status === 'ringing'
  const isRingingOutgoing = !isIncoming && (status === 'ringing' || status === 'connecting')

  return (
    <div className="fixed inset-0 z-50 bg-gray-950 text-white flex flex-col">
      {/* ACTIVE CALL */}
      {status === 'active' && (
        <>
          {isVideo ? (
            <div className="relative flex-1 bg-black">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="h-full w-full object-cover"
              />
              {!remoteStream && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <IconSpinner />
                  <p className="text-sm text-white/70">Waiting for {peerName}…</p>
                </div>
              )}

              <div className="absolute top-4 inset-x-0 flex justify-center">
                <span className="bg-black/50 rounded-full px-3 py-1 text-xs">
                  {formatDuration(duration)}
                </span>
              </div>

              {videoOff ? (
                <div className="absolute bottom-24 right-4 w-32 h-44 rounded-xl bg-gray-800 border border-white/20 flex items-center justify-center text-white/60 text-xs">
                  Video off
                </div>
              ) : (
                <video
                  ref={localVideoRef}
                  muted
                  autoPlay
                  playsInline
                  className="absolute bottom-24 right-4 w-32 h-44 rounded-xl object-cover bg-gray-800 border border-white/20"
                />
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
              <Avatar name={peerName} size="lg" />
              <div className="text-center">
                <p className="text-2xl font-semibold">{peerName}</p>
                <p className="mt-1 text-gray-400">{formatDuration(duration)}</p>
              </div>
              <audio ref={remoteAudioRef} autoPlay playsInline className="hidden" />
            </div>
          )}

          <div className="flex items-center justify-center gap-6 py-6">
            <button
              type="button"
              onClick={toggleMute}
              aria-label={muted ? 'Unmute' : 'Mute'}
              className={`w-14 h-14 rounded-full flex items-center justify-center ${
                muted ? 'bg-white text-gray-900' : 'bg-white/15 hover:bg-white/25'
              }`}
            >
              {muted ? <IconMicOff /> : <IconMic />}
            </button>

            {isVideo && (
              <button
                type="button"
                onClick={toggleVideo}
                aria-label={videoOff ? 'Turn on video' : 'Turn off video'}
                className={`w-14 h-14 rounded-full flex items-center justify-center ${
                  videoOff ? 'bg-white text-gray-900' : 'bg-white/15 hover:bg-white/25'
                }`}
              >
                {videoOff ? <IconVideoOff /> : <IconVideo />}
              </button>
            )}

            <button
              type="button"
              onClick={handleEnd}
              aria-label="End call"
              className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center"
            >
              <IconPhoneOff />
            </button>
          </div>
        </>
      )}

      {/* RINGING / CONNECTING */}
      {isRingingOutgoing && (
        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          {isVideo && localStream ? (
            <div className="relative w-64 h-96 rounded-2xl overflow-hidden bg-gray-800">
              <video
                ref={localVideoRef}
                muted
                autoPlay
                playsInline
                className="h-full w-full object-cover"
              />
              <span className="absolute bottom-2 inset-x-0 text-center text-xs text-white/70">
                {isVideo ? 'Video' : 'Voice'} call
              </span>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute -inset-4 rounded-full bg-blue-600/20 animate-ping" />
              <Avatar name={peerName} size="lg" />
            </div>
          )}
          <div className="text-center">
            <p className="text-2xl font-semibold">{peerName}</p>
            <p className="mt-1 text-gray-400">
              {status === 'connecting' ? 'Connecting…' : `Calling…`}
            </p>
          </div>
          <button
            type="button"
            onClick={handleEnd}
            aria-label="Cancel call"
            className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center"
          >
            <IconPhoneOff />
          </button>
        </div>
      )}

      {/* INCOMING CALL */}
      {isRingingIncoming && (
        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          <div className="relative">
            <div className="absolute -inset-4 rounded-full bg-green-600/20 animate-ping" />
            <Avatar name={peerName} size="lg" />
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold">{peerName}</p>
            <p className="mt-1 text-gray-400">
              Incoming {isVideo ? 'video' : 'voice'} call…
            </p>
          </div>
          <div className="flex items-center justify-center gap-8">
            <button
              type="button"
              onClick={handleDecline}
              aria-label="Decline call"
              className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center"
            >
              <IconPhoneOff className="w-7 h-7" />
            </button>
            <button
              type="button"
              onClick={handleAccept}
              aria-label="Accept call"
              className="w-16 h-16 rounded-full bg-green-600 hover:bg-green-500 flex items-center justify-center"
            >
              <IconPhone className="w-7 h-7" />
            </button>
          </div>
        </div>
      )}

      {/* TERMINAL / ERROR */}
      {(TERMINAL_STATUSES.includes(status) || status === 'error') && (
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <IconPhoneOff className="w-10 h-10 text-gray-500" />
          <p className="text-lg">
            {status === 'declined'
              ? 'Call declined'
              : status === 'missed'
                ? 'Missed call'
                : status === 'error'
                  ? "Couldn't start the call"
                  : 'Call ended'}
          </p>
          {status === 'error' && (
            <button
              type="button"
              onClick={onClose}
              className="mt-2 px-5 py-2 rounded-full bg-white/15 hover:bg-white/25 text-sm"
            >
              Close
            </button>
          )}
        </div>
      )}
    </div>
  )
}
