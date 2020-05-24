/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import { graphql, useStaticQuery } from 'gatsby'
import PropTypes from 'prop-types'
import React, { ReactNode } from 'react'

import { Content } from './Content'
import { Footer } from './Footer'
import Header from './Header/Header'

const Skeleton = ({ children }: { children: ReactNode }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <>
      <div className="min-h-screen">
        <Header siteTitle={data.site.siteMetadata.title} />
        <Content>
          <main>{children}</main>
        </Content>
      </div>
      <Footer />
    </>
  )
}

Skeleton.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Skeleton
