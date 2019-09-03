import React, { useEffect, useRef, useState } from 'react'
import c from './WheelRecorder.module.scss'
import { WheelEventData } from '../../../../src/wheel-analyzer'
import useRefOfLatest from '../../hooks/useRefOfLatest'

interface Props {
  target?: Element
}

export default function WheelRecorder({ target = document.body }: Props) {
  const [recording, setRecording] = useState(false)
  const recordedEvents = useRef<WheelEventData[]>([])
  const [downloadHref, setDownloadHref] = useState('')
  const createDownloadHref = useRefOfLatest(() => {
    URL.revokeObjectURL(downloadHref)
    if(recordedEvents.current.length) {
      const wheelEvents = recordedEvents.current
      const userAgent = navigator.userAgent
      const blob = new Blob([JSON.stringify({
        userAgent,
        wheelEvents,
      }, null, 2)], { type: 'application/json' })
      setDownloadHref(() => URL.createObjectURL(blob))
    } else {
      setDownloadHref(() => '')
    }
  })

  useEffect(() => {
    if (!recording) {
      createDownloadHref.current()
      return
    }
    recordedEvents.current = []
    const handler = (e: WheelEvent) => {
      const { deltaMode, deltaX, deltaY, timeStamp } = e
      recordedEvents.current.push({ deltaMode, deltaX, deltaY, timeStamp })
      e.preventDefault && e.preventDefault()
    }
    target.addEventListener('wheel', handler as EventListener, { passive: false })
    return () => target.removeEventListener('wheel', handler as EventListener)
  }, [createDownloadHref, recording, target])

  return (
    <div>
      <button className={c.recordButton + ' ' + (recording ? c.active : '')} onClick={() => setRecording(!recording)}>
        <span className={c.pauseButtonInner}>Rec</span>
      </button>
      {downloadHref && (
        <a href={downloadHref} download={new Date().toJSON() + '.json'}>
          Download
        </a>
      )}
    </div>
  )
}
