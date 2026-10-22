import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'

type MetaTag = { name: string; content: string } | { property: string; content: string }

interface Props {
  title: string
  description?: string
  meta?: MetaTag[]
}

export default function SEO({
  title,
  description = 'Normalized wheel and trackpad gestures, with movement, velocity, and momentum detection.',
  meta = [],
}: Props) {
  const { pathname } = useRouter()
  const pageTitle = `${title} | wheel-gestures documentation`
  const canonicalUrl = `https://wheel-gestures.xiel.dev${pathname}`

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta name="description" content={description} key="description" />
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:title" content={pageTitle} key="og:title" />
      <meta property="og:description" content={description} key="og:description" />
      <meta property="og:type" content="website" key="og:type" />
      <meta property="og:url" content={canonicalUrl} key="og:url" />
      <meta name="twitter:card" content="summary" key="twitter:card" />
      <meta name="twitter:creator" content="@xiel" key="twitter:creator" />
      <meta name="twitter:title" content={pageTitle} key="twitter:title" />
      <meta name="twitter:description" content={description} key="twitter:description" />
      {meta.map((tag) => (
        <meta key={'name' in tag ? tag.name : tag.property} {...tag} />
      ))}
    </Head>
  )
}
