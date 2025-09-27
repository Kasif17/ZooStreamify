import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { UserIcon } from 'lucide-react'
import NoFriendFound from '../components/NoFriendFound'
import FriendCard from '../components/FriendCard'
import { getUserFriends } from '../lib/api'

const FriendsPage = () => {
  const [friends, setFriends] = useState([])
  const [loadingFriends, setLoadingFriends] = useState(true)

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        setLoadingFriends(true)
        const data = await getUserFriends()
        setFriends(data)
      } catch (error) {
        console.error('Failed to fetch friends', error)
      } finally {
        setLoadingFriends(false)
      }
    }

    fetchFriends()
  }, [])

  return (
    <div className="p-4 w-full sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-10">
        {/* Friends Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Your Friends
          </h2>
          <Link to="/notification" className="btn btn-outline btn-sm">
            <UserIcon className="mr-2 size-4" />
            Friends Requests
          </Link>
        </div>

        {/* Friends List */}
        {loadingFriends ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : friends.length === 0 ? (
          <NoFriendFound />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {friends.map((friend) => (
              <FriendCard key={friend._id} friend={friend} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default FriendsPage
