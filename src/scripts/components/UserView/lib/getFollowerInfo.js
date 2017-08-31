import React from 'react'
import { Link } from 'react-router-dom'
import { getUser } from '../../../db/user'

const renderLinkToUser = (user) => {
  return <Link to={`/users/${user.uid}`}>{user.username}</Link>
}

export const getFollowerInfo = (place, user) => {
  return new Promise((resolve, reject) => {
    const usersOfPlace = place.users || []
    const following = user.following || []

    if (!usersOfPlace.length === 0) return resolve('')

    let followedUsers = []
    let remaining = usersOfPlace.length

    usersOfPlace.forEach(user => {
      if (following.indexOf(user) > -1) followedUsers.push(user)
    })

    if (followedUsers.length === 0) {
      return resolve(`${remaining} others`)
    }

    getUser(followedUsers[0])
    .then(snapshot => {
      const user1 = snapshot.val()
      remaining -= 1

      if (followedUsers.length === 1) {
        if (remaining === 0) return resolve(<span>{renderLinkToUser(user1)}</span>)
        if (remaining === 1) return resolve(<span>{renderLinkToUser(user1)} and 1 other</span>)
        return resolve(<span>{renderLinkToUser(user1)} and {remaining} others</span>)
      }

      getUser(followedUsers[1])
      .then(snapshot => {
        const user2 = snapshot.val()
        remaining -= 1

        if (remaining === 0) return resolve(<span>{renderLinkToUser(user1)} and {renderLinkToUser(user2)}</span>)
        if (remaining === 1) return resolve(<span>{renderLinkToUser(user1)}, {renderLinkToUser(user2)}, and 1 other</span>)
        return resolve(<span>{renderLinkToUser(user1)}, {renderLinkToUser(user2)}, and {remaining} other</span>)
      })
    })
  })
}