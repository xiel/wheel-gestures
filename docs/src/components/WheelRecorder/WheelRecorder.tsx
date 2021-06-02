import React, { useEffect, useRef, useState } from 'react'
import { debounce } from 'throttle-debounce'
import { WheelEventData } from 'wheel-gestures'

import useRefOfLatest from '../../hooks/useRefOfLatest'
import c from './WheelRecorder.module.scss'

interface Props {
  domTarget?: EventTarget | React.RefObject<EventTarget> | null
}

export default function WheelRecorder({ domTarget = globalThis.document?.body }: Props) {
  const [recording, setRecording] = useState(true)
  const recordedEvents = useRef<WheelEventData[]>([])
  const [downloadHref, setDownloadHref] = useState('')
  const [downloadName, setDownloadName] = useState('')
  const [autoStop, setAutoStop] = useState(true)

  const createDownloadHref = useRefOfLatest(() => {
    URL.revokeObjectURL && URL.revokeObjectURL(downloadHref)
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
      if (key === 'e' && metaKey) {
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
    if (!element) return
    recordedEvents.current = []
    const stopWhenDone = debounce(2000, () => setRecording(false))
    const handler = (e: WheelEvent) => {
      const { deltaMode, deltaX, deltaY, deltaZ, timeStamp, ctrlKey, metaKey } = e

      console.log({
        deltaMode,
        deltaX,
        deltaY,
        deltaZ,
        timeStamp,
        ctrlKey,
        metaKey,
      })

      recordedEvents.current.push({ deltaMode, deltaX, deltaY, deltaZ, ctrlKey, timeStamp })

      if (autoStop) {
        stopWhenDone()
      }
      e.preventDefault()
    }

    element.addEventListener('wheel', handler as EventListener, { passive: false })

    element.addEventListener(
      'gesturestart',
      (e) => {
        e.preventDefault()
        console.log('start', e)
      },
      { passive: false }
    )

    element.addEventListener(
      'gesturechange',
      (e) => {
        e.preventDefault()
        console.log('change', e, e.scale)
      },
      { passive: false }
    )

    return () => {
      element.removeEventListener('wheel', handler as EventListener)
    }
  }, [autoStop, createDownloadHref, recording, domTarget])

  const downloadFallbackName = new Date().toJSON()

  return (
    <div className={c.container}>
      <button className={c.recordButton + ' ' + (recording ? c.active : '')} onClick={() => setRecording(!recording)}>
        <span className={c.pauseButtonInner}>Rec</span>
      </button>
      <label>
        <input type="checkbox" onChange={() => setAutoStop(!autoStop)} checked={autoStop} /> auto-stop
      </label>
      {downloadHref && (
        <>
          <label>
            Download name:
            <input
              type="text"
              value={downloadName}
              onChange={(e) => setDownloadName(e.target.value)}
              placeholder={downloadFallbackName}
            />
          </label>
          <a href={downloadHref} download={`${downloadName || downloadFallbackName}.json`}>
            Download
          </a>
        </>
      )}
    </div>
  )
}
