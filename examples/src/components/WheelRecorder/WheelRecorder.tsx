import React, { useEffect, useRef, useState } from 'react'
import c from './WheelRecorder.module.scss'
import { WheelEventData } from '../../../../src/wheel-analyzer'
import useRefOfLatest from '../../hooks/useRefOfLatest'
import { debounce } from 'throttle-debounce'

interface Props {
  domTarget?: EventTarget | React.RefObject<EventTarget> | null
}

export default function WheelRecorder({ domTarget = document.body }: Props) {
  const [recording, setRecording] = useState(false)
  const recordedEvents = useRef<WheelEventData[]>([])
  const [downloadHref, setDownloadHref] = useState('')
  const [downloadName, setDownloadName] = useState('')
  const [autoStop, setAutoStop] = useState(true)
  const createDownloadHref = useRefOfLatest(() => {
    URL.revokeObjectURL(downloadHref)
    if (recordedEvents.current.length) {
      const wheelEvents = recordedEvents.current
      const userAgent = navigator.userAgent
      const blob = new Blob(
        [
          JSON.stringify(
            {
              userAgent,
              wheelEvents,
            },
            null,
            2
          ),
        ],
        { type: 'application/json' }
      )
      setDownloadHref(() => URL.createObjectURL(blob))
    } else {
      setDownloadHref(() => '')
    }
  })

  useEffect(() => {
    const handleKey = ({ key, metaKey }: KeyboardEvent) => {
      console.info('KEYPRESS', key, metaKey)
      if(key === 'e' && metaKey) {
        setRecording(!recording)
      }
    }
    document.documentElement.addEventListener('keydown', handleKey)
    return () => document.documentElement.removeEventListener('keydown', handleKey)
  }, [recording])

  useEffect(() => {
    const element = domTarget && 'current' in domTarget ? domTarget.current : domTarget
    if (!recording) {
      createDownloadHref.current()
      return
    }
    if(!element) return
    recordedEvents.current = []
    const stopWhenDone = debounce(2000, () => setRecording(false))
    const handler = (e: WheelEvent) => {
      const { deltaMode, deltaX, deltaY, timeStamp } = e
      recordedEvents.current.push({ deltaMode, deltaX, deltaY, timeStamp })
      if (autoStop) {
        stopWhenDone()
      }
      e.preventDefault()
    }
    element.addEventListener('wheel', handler as EventListener, { passive: false })
    return () => element.removeEventListener('wheel', handler as EventListener)
  }, [autoStop, createDownloadHref, recording, domTarget])

  const downloadFallbackName = new Date().toJSON()

  return (
    <div className={c.container}>
      <button className={c.recordButton + ' ' + (recording ? c.active : '')} onClick={() => setRecording(!recording)}>
        <span className={c.pauseButtonInner}>Rec</span>
      </button>
      <label>
        <input type="checkbox" onChange={() => setAutoStop(!autoStop)} checked={autoStop} />
        auto-stop
      </label>
      {downloadHref && (
        <>
          <label>
            Download name:
            <input type="text" value={downloadName} onChange={(e) => setDownloadName(e.target.value)} placeholder={downloadFallbackName} />
          </label>
          <a href={downloadHref} download={`${downloadName || downloadFallbackName}.json`}>
            Download
          </a>
        </>
      )}
    </div>
  )
}
