export const deepEqual = ( obj1, obj2 ) => {
  if ( !obj1 || !obj2 ) return
  if ( typeof obj1 !== 'object' || typeof obj2 !== 'object' ) return
  if ( Object.keys( obj1 ).length !== Object.keys( obj2 ).length ) return false

  let equal = true

  for ( let i in obj1 ) {
    if ( obj1[ i ] !== obj2[ i ]) equal = false
  }

  return equal
}
