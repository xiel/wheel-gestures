import React, { useEffect, useState } from 'react'
import c from './Graph.module.css'
import WheelAnalyzer from 'wheel-analyzer'

interface Props {}

export default function Graph(props: Props) {
  const [wheelAnalyzer, setWA] = useState<WheelAnalyzer | undefined>(() => new WheelAnalyzer())

  useEffect(() => {
    if(!wheelAnalyzer) {
      return
    }

    const unsubscribe = wheelAnalyzer.subscribe((type, data) => {
      console.log('subscribe', type, data)
    })

    return () => unsubscribe()
  }, [wheelAnalyzer])

  // @ts-ignore
  return (
    <div className={c.container} onWheel={wheelAnalyzer && wheelAnalyzer.feedWheel} onClick={() => setWA(undefined)}>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolor fugit
        quos totam. Consequuntur distinctio eius et exercitationem expedita
        facere fugiat hic impedit ipsam, necessitatibus, nobis, perferendis
        quidem reprehenderit repudiandae sapiente!
      </p>
    </div>
  )
}
