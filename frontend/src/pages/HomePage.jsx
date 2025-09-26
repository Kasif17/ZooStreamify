import { useQuery, useQueryClient } from '@tanstack/react-query'
import React from 'react'

const HomePage = () => {
  const queryClient = useQueryClient();
  const [outgoingRequestsIds,setOngoingRequestsIds] = useQuery([]);

  const {data:friends=[],isLoading:loadingFriends} = useQuery({
    queryKey:["friends"],
    queryFn: getUserFriends
  })

  const {data:recommendedUsers=[],isLoading:loadingUsers} = useQuery({
    queryKey:["users"],
    queryFn: getRecommededUsers
  })

  return (
    <div>
      HOME
    </div>
  )
}

export default HomePage
