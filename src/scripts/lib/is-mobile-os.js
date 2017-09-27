const platform = require( 'platform' )
const MOBILE_OS_FAMILIES = [ 'Android', 'iOS', 'Windows Phone' ]

const IS_MOBILE_OS = platform.os && platform.os.family && MOBILE_OS_FAMILIES.indexOf( platform.os.family ) > -1

module.exports = IS_MOBILE_OS
