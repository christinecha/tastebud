import React from 'react'
import { Route } from 'react-router-dom'

const renderMergedProps = (component, ...props) => {
  const finalProps = Object.assign({}, ...props)
  return React.createElement(component, finalProps)
}

const PropsRoute = ({ component, ...props }) => {
  return (
    <Route {...props} component={routeProps => renderMergedProps(component, routeProps, props)} />
  )
}

export default PropsRoute
