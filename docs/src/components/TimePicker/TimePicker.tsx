/*
MIT License

Copyright (c) David Jerleke.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import type { EmblaCarouselType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures'
import React, { KeyboardEvent, useEffect, useId, useState } from 'react'

import c from './TimePicker.module.scss'

// The 3D wheel presentation is inspired by Embla's MIT-licensed iOS picker:
// https://www.embla-carousel.com/docs/examples/predefined#ios-style-picker-loop
const ITEM_HEIGHT = 40
const ITEM_ANGLE = 20
const RADIUS = ITEM_HEIGHT / 2 / Math.tan((ITEM_ANGLE * Math.PI) / 360)
const formatValue = (value: number) => String(value).padStart(2, '0')

type ColumnProps = {
  label: string
  count: number
  initialValue: number
  onChange: (value: number) => void
}

function PickerColumn({ label, count, initialValue, onChange }: ColumnProps) {
  const [scene, setScene] = useState<HTMLDivElement | null>(null)
  const [selected, setSelected] = useState(initialValue)
  const [reducedMotion, setReducedMotion] = useState(false)
  const labelId = useId()
  const hintId = useId()
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      axis: 'y',
      loop: true,
      skipSnaps: true,
      containScroll: false,
      watchSlides: false,
      watchFocus: false,
      startIndex: initialValue,
      duration: reducedMotion ? 0 : 25,
    },
    [WheelGesturesPlugin({ target: scene ?? undefined })]
  )

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(preference.matches)
    update()
    preference.addEventListener('change', update)
    return () => preference.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!emblaApi) return

    const renderWheel = (api: EmblaCarouselType) => {
      const position = api.scrollProgress() * count
      api.slideNodes().forEach((slide, index) => {
        // Use the nearest copy of each item, including across the loop boundary.
        const distance = ((((index - position + count / 2) % count) + count) % count) - count / 2
        slide.style.opacity = Math.abs(distance) < 4.5 ? '1' : '0'
        slide.style.transform = reducedMotion
          ? `translateY(calc(${-index * 100}% + ${distance * ITEM_HEIGHT}px))`
          : `translateY(${-index * 100}%) rotateX(${-distance * ITEM_ANGLE}deg) translateZ(${RADIUS}px)`
      })
    }
    const select = (api: EmblaCarouselType) => setSelected(api.selectedScrollSnap())
    const settle = (api: EmblaCarouselType) => onChange(api.selectedScrollSnap())
    const initialize = (api: EmblaCarouselType) => {
      // Embla owns input, physics and snapping; we replace only its flat transforms.
      const { translate, slideLooper } = api.internalEngine()
      translate.clear()
      translate.toggleActive(false)
      slideLooper.loopPoints.forEach(({ translate: slideTranslate }) => {
        slideTranslate.clear()
        slideTranslate.toggleActive(false)
      })
      api.containerNode().style.transform = reducedMotion ? 'none' : `translateZ(${-RADIUS}px)`
      renderWheel(api)
      select(api)
      settle(api)
    }

    initialize(emblaApi)
    emblaApi.on('scroll', renderWheel).on('select', select).on('settle', settle).on('reInit', initialize)
    return () => {
      emblaApi.off('scroll', renderWheel).off('select', select).off('settle', settle).off('reInit', initialize)
    }
  }, [emblaApi, count, onChange, reducedMotion])

  const changeBy = (step: number) => {
    if (!emblaApi) return
    emblaApi.scrollTo((emblaApi.selectedScrollSnap() + step + count) % count, reducedMotion)
    onChange(emblaApi.selectedScrollSnap())
  }

  const handleKey = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!emblaApi) return
    switch (event.key) {
      case 'ArrowUp':
        changeBy(1)
        break
      case 'ArrowDown':
        changeBy(-1)
        break
      case 'PageUp':
        changeBy(5)
        break
      case 'PageDown':
        changeBy(-5)
        break
      case 'Home':
        emblaApi.scrollTo(0, reducedMotion)
        onChange(0)
        break
      case 'End':
        emblaApi.scrollTo(count - 1, reducedMotion)
        onChange(count - 1)
        break
      default:
        return
    }
    event.preventDefault()
  }

  return (
    <div className={c.column}>
      <span id={labelId} className={c.label}>
        {label}
      </span>
      <button
        type="button"
        className={c.step}
        aria-label={`Increase ${label.toLowerCase()}`}
        onClick={() => changeBy(1)}
      >
        <span aria-hidden="true">+</span>
      </button>
      <div
        ref={setScene}
        className={c.scene}
        role="spinbutton"
        tabIndex={0}
        aria-labelledby={labelId}
        aria-describedby={hintId}
        aria-valuemin={0}
        aria-valuemax={count - 1}
        aria-valuenow={selected}
        aria-valuetext={`${formatValue(selected)} ${label.toLowerCase()}`}
        onKeyDown={handleKey}
      >
        <div ref={emblaRef} className={c.viewport}>
          <div className={c.container} aria-hidden="true">
            {Array.from({ length: count }, (_, value) => (
              <div key={value} className={c.slide} data-selected={value === selected}>
                {formatValue(value)}
              </div>
            ))}
          </div>
        </div>
        <span className={c.selection} aria-hidden="true" />
      </div>
      <button
        type="button"
        className={c.step}
        aria-label={`Decrease ${label.toLowerCase()}`}
        onClick={() => changeBy(-1)}
      >
        <span aria-hidden="true">−</span>
      </button>
      <span id={hintId} className={c.srOnly}>
        Scroll or drag to select. Up and Down change by one, Page Up and Page Down by five. Home selects the first
        value, End the last. Values loop.
      </span>
    </div>
  )
}

export default function TimePicker() {
  const [hours, setHours] = useState(9)
  const [minutes, setMinutes] = useState(41)

  return (
    <div className={c.demo}>
      <div className={c.picker} role="group" aria-label="Choose a time">
        <PickerColumn label="Hours" count={24} initialValue={9} onChange={setHours} />
        <span className={c.separator} aria-hidden="true">
          :
        </span>
        <PickerColumn label="Minutes" count={60} initialValue={41} onChange={setMinutes} />
      </div>
      <p className={c.result}>
        Selected time{' '}
        <output aria-live="off">
          {formatValue(hours)}:{formatValue(minutes)}
        </output>
      </p>
      <p className={c.hint}>Scroll or drag either column. Use ↑ / ↓ when a column is focused.</p>
    </div>
  )
}
