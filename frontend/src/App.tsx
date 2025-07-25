import React, { useState, useEffect } from 'react'
import './styles.scss'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'
import * as ROUTES from './routes'
import { useTranslation } from 'react-i18next'
import Environment from 'components/Environment'
import Navigation from 'components/Navigation'
import { HEARTBEAT } from './api'
import BMICalculator from 'components/BMIcalculator'

const BackendConnectionTest = () => {
  const [response, setResponse] = useState(undefined as any)
  const [isFetching, setIsFetching] = useState(false)

  useEffect(() => {
    setIsFetching(true)
    fetch(HEARTBEAT).then(
      (response) => response.json()
    )
      .then(
        (response) => setResponse(response),
        (response) => setResponse(response),
      ).finally(() =>
        setIsFetching(false)
      )
  }, [])

  return (
    <>
      <h3>
        Backend connection test:
      </h3>
      <p>
        {isFetching ?
          <p>
            Trying to reach backend...
          </p>
          :
          <>
            <p>
              Backend responded with following message:
            </p>
            <b>
              <pre>
                <code>
                  {JSON.stringify(response, null, 2)}
                </code>
              </pre>
            </b>
          </>
        }
      </p>
    </>
  )
}

const App: React.FC = () => {
  // Depends of your implementation of authentication
  const isLoggedIn = false

  return (
    <Router>
      {!isLoggedIn &&
        <>
          <Navigation />
          <div className="main-content">
            <Switch>
              <Route exact path={ROUTES.ROOT}>
                <>
                  <Environment />
                  <hr className="dotted" />
                  <BackendConnectionTest />
                </>
              </Route>
              <Route path={ROUTES.BMI_CALCULATOR}>
                <BMICalculator />
              </Route>
              <Redirect from={'*'} to={ROUTES.ROOT} />
            </Switch>
          </div>
        </>
      }
      {isLoggedIn &&
        <div>
          {/* <AuthenticatedSwitch /> */}
        </div>
      }
    </Router>
  )
}

export default App