/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import Head from 'next/head'
import PropTypes from 'prop-types'
import React from 'react'
import { Helmet } from 'react-helmet'

type MetaTag = { name: string; content: string } | { property: string; content: string }

function SEO({
  description,
  lang = `en`,
  meta = [],
  title,
}: {
  description: string
  lang: string
  meta: MetaTag | MetaTag[]
  title: string
}) {
  const site = {
    siteMetadata: {
      title: 'wheel-gestures documentation',
      description: 'wheel interactions made easy',
      author: 'xiel',
    },
  }

  const metaDescription: string = description || site.siteMetadata.description
  const metaProp: MetaTag[] = [
    {
      name: `description`,
      content: metaDescription,
    },
    {
      property: `og:title`,
      content: title,
    },
    {
      property: `og:description`,
      content: metaDescription,
    },
    {
      property: `og:type`,
      content: `website`,
    },
    {
      name: `twitter:card`,
      content: `summary`,
    },
    {
      name: `twitter:creator`,
      content: site.siteMetadata.author,
    },
    {
      name: `twitter:title`,
      content: title,
    },
    {
      name: `twitter:description`,
      content: metaDescription,
    },
  ].concat(meta)

  const links: JSX.IntrinsicElements['link'][] = []

  if (typeof window !== 'undefined' && window.location) {
    const loc = window.location
    if (loc.origin !== 'https://wheel-gestures.xiel.dev') {
      links.push({
        rel: 'canoncial',
        href: loc.href.replace(loc.origin, 'https://wheel-gestures.xiel.dev'),
      })
    }
  }

  return (
    <>
      <Head>
        <title>{`${title} | ${site.siteMetadata.title}`}</title>
      </Head>
      <Helmet
        htmlAttributes={{
          lang,
        }}
        title={title}
        titleTemplate={`%s | ${site.siteMetadata.title}`}
        meta={metaProp}
        link={links}
      />
    </>
  )
}

SEO.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string.isRequired,
}

export default SEO
