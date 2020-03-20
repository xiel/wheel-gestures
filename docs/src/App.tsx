import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import SimpleWheelDrag from './components/SimpleWheelDrag/SimpleWheelDrag'
import Header from './components/Header/Header'
import Gallery from './components/Gallery/Gallery'

const App: React.FC = () => {
  return (
    <Router>
      <Header />
      <Switch>
        <Route exact path="/" component={SimpleWheelDrag} />
        <Route exact path="/gallery" component={Gallery} />
      </Switch>
    </Router>
  )
}

export default App
