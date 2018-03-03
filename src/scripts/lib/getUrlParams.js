const getUrlParams = ( string = location.href ) => {
  const params = {}
  const paramString = string.split( '?' )[ 1 ]

  if ( !paramString ) return params

  const parts = paramString.split( '&' )
  parts.forEach(( part ) => {
    const [ key, value ] = part.split( '=' )
    params[ key ] = value
  })

  return params
}

export default getUrlParams
