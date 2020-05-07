/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React, { ReactNode } from 'react'
import PropTypes from 'prop-types'
import { useStaticQuery, graphql } from 'gatsby'

import Header from '../Header/Header'
import '../../styles/global.scss'
import { Content } from './Layout'

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
      <Header siteTitle={data.site.siteMetadata.title} />
      <Content>
        <main>{children}</main>
        <footer>Felix Leupold © {new Date().getFullYear()}, made in Berlin 🐻</footer>
      </Content>
    </>
  )
}

Skeleton.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Skeleton
