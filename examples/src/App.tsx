import React from 'react'
import Graph from './components/Graph/Graph'
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom'
import SimpleWheelDrag from './components/SimpleWheelDrag/SimpleWheelDrag'

const App: React.FC = () => {
  return (
    <Router>
      <h1>wheelAnalyzer</h1>
      <nav style={{ display: 'inline-grid', gridAutoFlow: 'column', gridGap: '1em', margin: '1em 0' }}>
        <Link to="/">Home</Link>
        <Link to="/graph">Graph</Link>
        <Link to="/simple-wheel-drag">SimpleWheelDrag</Link>
      </nav>

      <Switch>
        <Route exact path="/" component={SimpleWheelDrag} />
        <Route path="/graph" component={Graph} />
        <Route path="/simple-wheel-drag" component={SimpleWheelDrag} />
      </Switch>
    </Router>
  )
}

export default App
