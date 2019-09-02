import React, { useEffect, useState } from 'react'
import { WheelAnalyzer, WheelPhase } from 'wheel-analyzer'
import c from './Graph.module.scss'

interface Props {}

export default function Graph(props: Props) {
  const [element, setElement] = useState<HTMLDivElement | null>(null)
  const [wheelAnalyzer] = useState(() => new WheelAnalyzer())
  const [phase, setPhase] = useState<WheelPhase>(WheelPhase.IDLE)

  useEffect(() => (element ? wheelAnalyzer.observe(element) : undefined), [element, wheelAnalyzer])

  useEffect(() => {
    if (!wheelAnalyzer) {
      return
    }
    const unsubscribe = wheelAnalyzer.subscribe((type, data) => {
      setPhase(type)
      console.log(type, data)
    })

    return () => unsubscribe()
  }, [wheelAnalyzer])

  return (
    <div className={c.container} data-phase={phase} ref={setElement}>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolor fugit quos totam. Consequuntur distinctio eius
        et exercitationem expedita facere fugiat hic impedit ipsam, necessitatibus, nobis, perferendis quidem
        reprehenderit repudiandae sapiente!
      </p>
    </div>
  )
}
