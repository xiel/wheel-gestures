/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import PropTypes from 'prop-types'
import React, { ReactNode } from 'react'

import { Content } from './Content'
import { Footer } from './Footer'
import Header from './Header/Header'
import { WheelEventNotice } from './WheelEventNotice'

const Skeleton = ({ children }: { children: ReactNode }) => {

  return (
    <>
      <div className="min-h-screen">
        <WheelEventNotice />
        <Header siteTitle={'wheel-gestures documentation'} />
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
