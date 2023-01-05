import React from 'react'
import {createRoot} from 'react-dom/client'


import './style.css'
import Home from './components/home'

const App = () => {
  return (
    <div>
      <Home />
    </div>
  )
}
const root = createRoot(document.getElementById('app'))
root.render(<App />)
// ReactDOM.render(<App />, document.getElementById('app'))
