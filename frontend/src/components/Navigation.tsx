import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import * as ROUTES from '../routes'

const Navigation: React.FC = () => {
  const location = useLocation()

  return (
    <nav className="main-navigation">
      <div className="nav-container">
        <h1 className="nav-title">PERN Stack App</h1>
        <ul className="nav-links">
          <li>
            <Link 
              to={ROUTES.ROOT} 
              className={location.pathname === ROUTES.ROOT ? 'active' : ''}
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              to={ROUTES.BMI_CALCULATOR} 
              className={location.pathname === ROUTES.BMI_CALCULATOR ? 'active' : ''}
            >
              BMI Calculator
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navigation