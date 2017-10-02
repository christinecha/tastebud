export const toCamelCase = ( str ) => {
  const parts = str.toLowerCase().split( ' ' )

  let camelCase = ''

  parts.forEach(( part ) => {
    part = Array.from( part )
    const firstLetter = part[ 0 ]
    const remaining = part.splice( 1 )

    camelCase += firstLetter
    camelCase += remaining.join( '' )
  })

  return camelCase
}
