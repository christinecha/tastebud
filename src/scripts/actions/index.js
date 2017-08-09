export const updateCurrentUser = (user) => {
  return {
    type: 'UPDATE_CURRENT_USER',
    currentUser: user
  }
}
