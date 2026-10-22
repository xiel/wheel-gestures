import type { GetStaticProps, InferGetStaticPropsType } from 'next'
import Link from 'next/link'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import React from 'react'

import CodeArea from '../../components/CodeArea/CodeArea'
import { emblaExample, emblaInstall, momentumExample } from '../../components/Docs/docs-codes'
import ExampleSection from '../../components/ExampleSection/ExampleSection'
import Gallery from '../../components/Gallery/Gallery'
import SEO from '../../components/seo'
import SimpleWheelDrag from '../../components/SimpleWheelDrag/SimpleWheelDrag'
import Skeleton from '../../components/Skeleton/Skeleton'
import TimePicker from '../../components/TimePicker/TimePicker'

type Props = { pickerCode: string; pickerStyles: string }

export const getStaticProps: GetStaticProps<Props> = async () => {
  const directory = path.join(process.cwd(), 'src/components/TimePicker')
  const [pickerCode, pickerStyles] = await Promise.all([
    readFile(path.join(directory, 'TimePicker.tsx'), 'utf8'),
    readFile(path.join(directory, 'TimePicker.module.scss'), 'utf8'),
  ])
  return { props: { pickerCode, pickerStyles } }
}

export default function Examples({ pickerCode, pickerStyles }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Skeleton>
      <SEO
        title="Examples"
        description="Try wheel and trackpad gestures in a looping time picker, photo carousel, and momentum visualizer. Copy the code for your own project."
      />
      <div className="px-6">
        <h2 className="text-3xl font-bold mt-8">Try it with a scroll</h2>
        <p className="mt-4 max-w-2xl leading-relaxed">
          Explore wheel and trackpad input, from a ready-made Embla integration to the gesture data behind it. Every
          demo includes code to get started.
        </p>
        <nav aria-label="Examples" className="flex flex-wrap gap-6 mt-6 underline">
          <a href="#time-picker">Time picker</a>
          <a href="#gallery">Photo carousel</a>
          <a href="#momentum">Momentum detection</a>
        </nav>
        <ExampleSection
          id="time-picker"
          title="Looping time picker"
          description="An iOS-style picker with two independent wheels. Scroll or drag to choose a time; the hours and minutes wrap around in both directions and snap into place."
          code={
            <>
              <p>
                Install the Embla integration in a React project. It includes wheel-gestures as a dependency; there is
                no need to install the core library separately for this example.
              </p>
              <CodeArea language="shell">{emblaInstall}</CodeArea>
              <p>
                Save these two files together, then render &lt;TimePicker /&gt;. CSS Modules with Sass support are
                required.
              </p>
              <CodeArea language="shell">npm install --save-dev sass</CodeArea>
              <h3 className="font-semibold">TimePicker.tsx</h3>
              <CodeArea>{pickerCode}</CodeArea>
              <h3 className="font-semibold">TimePicker.module.scss</h3>
              <CodeArea language="css">{pickerStyles}</CodeArea>
              <p>
                Inspired by{' '}
                <a href="https://www.embla-carousel.com/docs/examples/predefined#ios-style-picker-loop">
                  Embla’s iOS picker
                </a>
                , by David Jerleke (MIT). The wheel presentation uses Embla v8 internals; keep these versions together.
              </p>
            </>
          }
        >
          <TimePicker />
        </ExampleSection>
        <ExampleSection
          id="gallery"
          title="Photo carousel"
          description="Swipe horizontally on a trackpad, drag a photo, or use the buttons. Embla handles sliding and snapping; the wheel-gestures plugin adds wheel input."
          code={
            <>
              <p>Use this minimal carousel in a React project. Replace the numbered slides with your own content.</p>
              <CodeArea language="shell">{emblaInstall}</CodeArea>
              <CodeArea>{emblaExample}</CodeArea>
            </>
          }
        >
          <Gallery />
        </ExampleSection>
        <ExampleSection
          id="momentum"
          title="See momentum detection"
          description="Scroll inside the panel, then lift your fingers from the trackpad. The solid box follows active input; the translucent box also follows the momentum that continues after release. A mouse wheel may produce little or no momentum."
          code={
            <>
              <p>This uses the core library directly. It works without React or Embla.</p>
              <CodeArea language="shell">npm install wheel-gestures</CodeArea>
              <CodeArea language="javascript">{momentumExample}</CodeArea>
              <p>
                See the <Link href="/docs/on-wheel">event reference</Link> for movement, velocity, and gesture lifecycle
                fields.
              </p>
            </>
          }
        >
          <SimpleWheelDrag />
        </ExampleSection>
      </div>
    </Skeleton>
  )
}
