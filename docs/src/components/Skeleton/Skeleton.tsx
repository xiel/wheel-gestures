import PropTypes from 'prop-types'
import React, { ReactNode } from 'react'

import { Content } from './Content'
import { Footer } from './Footer'
import Header from './Header/Header'

const Skeleton = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <div className="min-h-screen">
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
