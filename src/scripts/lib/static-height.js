const IS_MOBILE_OS = require( './is-mobile-os' )

/** @function getFullScreenHeight
  * Returns the "real" browser screen height. Useful for full-height elements on mobile.
  *
  * @return Integer | Px value of the browser screen height.
 **/

export const getFullScreenHeight = () => {
  // If it's not mobile, just return the innerHeight value.
  if ( !IS_MOBILE_OS ) return window.innerHeight

  // Manually set this hero height so it doesn't jump up and down on scroll.
  const addressBarHeight = window.screen.availHeight - window.innerHeight
  const mobileScreenHeight = window.screen.availHeight - addressBarHeight

  return mobileScreenHeight
}

/** @function setStaticHeight
  * Gives an element a static height, either of the fullscreen height or its computed height.
  *
  * @param $el | DOMElement - The element you'd like to modify.
  * @param [isFullScreen] | Boolean - If true, use the calculated screen height. If false, use computed.
 **/
export const setStaticHeight = ( $el, isFullScreen = false ) => {
  // If it's not a mobile OS, then undo any previous static height.
  if ( !IS_MOBILE_OS ) return $el.style.removeProperty( 'height' )

  // If we already did this, don't resize. That's the whole point!
  if ( $el.style.height ) return

  const adjustedHeroHeight = isFullScreen ? getFullScreenHeight() : $el.clientHeight

  $el.style.height = adjustedHeroHeight + 'px'
}
