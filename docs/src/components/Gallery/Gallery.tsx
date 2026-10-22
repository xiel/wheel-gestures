import useEmblaCarousel from 'embla-carousel-react'
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures'
import React, { useEffect, useState } from 'react'

import { WheelIndicator } from '../WheelIndicator/WheelIndicator'
import c from './Gallery.module.scss'

const pages = [
  'https://images.pexels.com/photos/414171/pexels-photo-414171.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
  'https://images.pexels.com/photos/747964/pexels-photo-747964.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
  'https://images.pexels.com/photos/346529/pexels-photo-346529.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
  'https://images.pexels.com/photos/462162/pexels-photo-462162.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
]

export default function Gallery() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, skipSnaps: true }, [WheelGesturesPlugin()])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)
  const [indicatorVisible, setIndicatorVisible] = useState(false)
  const [indicatorFlipped, setIndicatorFlipped] = useState(false)

  useEffect(() => {
    if (!emblaApi) return

    let indicatorTimeout: ReturnType<typeof setTimeout>
    const onScroll = () => {
      setIndicatorVisible(false)
      clearTimeout(indicatorTimeout)
      indicatorTimeout = setTimeout(() => setIndicatorVisible(true), 2000)
    }
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap())
      setCanScrollPrev(emblaApi.canScrollPrev())
      setCanScrollNext(emblaApi.canScrollNext())
      if (!emblaApi.canScrollPrev()) setIndicatorFlipped(false)
      else if (!emblaApi.canScrollNext()) setIndicatorFlipped(true)
    }

    onSelect()
    onScroll()
    emblaApi
      .on('select', onSelect)
      .on('reInit', onSelect)
      .on('scroll', onScroll)
    return () => {
      clearTimeout(indicatorTimeout)
      emblaApi
        .off('select', onSelect)
        .off('reInit', onSelect)
        .off('scroll', onScroll)
    }
  }, [emblaApi])

  return (
    <section className={c.outer} aria-label="Photo gallery" aria-roledescription="carousel">
      <div className={c.galleryWrapper}>
        <div ref={emblaRef} className={c.gallery}>
          <div className={c.container}>
            {pages.map((url, i) => (
              <div
                key={url}
                className={c.slide}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${pages.length}`}
              >
                <img src={url} alt={`Landscape ${i + 1}`} loading={i === 0 ? 'eager' : 'lazy'} draggable={false} />
              </div>
            ))}
          </div>
        </div>
        <WheelIndicator visible={indicatorVisible} flipped={indicatorFlipped} />
      </div>
      <div className={c.controls}>
        <button type="button" onClick={() => emblaApi?.scrollPrev()} disabled={!canScrollPrev}>
          Previous
        </button>
        <span aria-live="polite" aria-atomic="true">
          {selectedIndex + 1} / {pages.length}
        </span>
        <button type="button" onClick={() => emblaApi?.scrollNext()} disabled={!canScrollNext}>
          Next
        </button>
      </div>
      <p className={c.caption}>
        Built with <a href="https://www.embla-carousel.com/">Embla Carousel</a> and{' '}
        <a href="https://github.com/xiel/embla-carousel-wheel-gestures">embla-carousel-wheel-gestures</a>.
      </p>
    </section>
  )
}
