import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import { getOngoingFriendsReqs, getRecommendedUsers, getUserFriends, sendFriendRequest } from '../lib/api';
import { Link } from 'react-router-dom';
import { CheckCircleIcon, MapPinIcon, MessageCircle, UserIcon, UserPlusIcon } from 'lucide-react';
import FriendCard, { getLanguageFlag } from '../components/FriendCard';
import NoFriendFound from '../components/NoFriendFound';
import NoRecommendedUserFound from '../components/NoRecommendedUserFound';
import { capitalize } from '../lib/utlis';

const HomePage = () => {
  const queryClient = useQueryClient();
  const [outgoingRequestsIds,setOngoingRequestsIds] = useState(new Set());

  const {data:friends=[],isLoading:loadingFriends} = useQuery({
    queryKey:["friends"],
    queryFn: getUserFriends
  })

  const {data:recommendedUsers=[],isLoading:loadingUsers} = useQuery({
    queryKey:["users"],
    queryFn: getRecommendedUsers
  })

  const {data:outgoingFriendsReqs} = useQuery({
    queryKey:["outgoingFriendsReqs"],
    queryFn:getOngoingFriendsReqs,
  })

  const {mutate:sendRequestMutation, isPending} = useMutation({
   mutationFn:sendFriendRequest,
   onSuccess:()=> queryClient.invalidateQueries({queryKey:["outgoingFriendsReqs"]
  })
  })

  useEffect(()=>{
    const outgoingIds = new Set()
    if(outgoingFriendsReqs && outgoingFriendsReqs.length > 0){
      outgoingFriendsReqs.forEach((req)=>{
        outgoingIds.add(req.recipient._id)
      })
      setOngoingRequestsIds(outgoingIds)
    }
  },[outgoingFriendsReqs])

  return (
  <div className="min-h-screen w-full bg-base-100 p-4 sm:p-6 lg:p-8">
    <div className="container mx-auto space-y-10">
      
      {/* ✅ Friends Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Your Friends</h2>
        <Link to="/notification" className="btn btn-outline btn-sm">
          <UserIcon className="mr-2 size-4" />
          Friends Requests
        </Link>
      </div>

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

      {/* ✅ Recommended Users Section */}
      <section className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Meet New Learners</h2>
            <p className="opacity-70">
              Discover perfect language exchange partners based on your profile
            </p>
          </div>
        </div>

        {loadingUsers ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : recommendedUsers.length === 0 ? (
          <NoRecommendedUserFound />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-3">
            {recommendedUsers.map((user) => {
              const hasRequestBeenSent = outgoingRequestsIds.has(user._id);
              return (
                <div
                  key={user._id}
                  className="card bg-base-200 hover:shadow-lg transition-all duration-300"
                >
                  <div className="card-body p-5 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="avatar size-16 rounded-full">
                        <img src={user.profilePic} alt={user.fullName} />
                      </div>

                      <div>
                        <h3 className="font-semibold text-lg">{user.fullName}</h3>
                        {user.location && (
                          <div className="flex items-center text-xs opacity-70 mt-1">
                            <MapPinIcon className="size-3 mr-1" />
                            {user.location}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-3">
                      <span className="badge badge-secondary text-xs">
                        {getLanguageFlag(user.nativeLanguage)}
                        Native: {capitalize(user.nativeLanguage)}
                      </span>
                      <span className="badge badge-outline text-xs">
                        {getLanguageFlag(user.learningLanguage)}
                        Learning: {capitalize(user.learningLanguage)}
                      </span>
                    </div>

                    {user.bio && (
                      <p className="text-sm opacity-70">{user.bio}</p>
                    )}

                    <button
                      className={`btn w-full mt-2 ${
                        hasRequestBeenSent ? "btn-disabled" : "btn-primary"
                      }`}
                      onClick={() => sendRequestMutation(user._id)}
                      disabled={hasRequestBeenSent || isPending}
                    >
                      {hasRequestBeenSent ? (
                        <>
                          <CheckCircleIcon className="size-4 mr-2" />
                          Request Sent
                        </>
                      ) : (
                        <>
                          <UserPlusIcon className="size-4 mr-2" />
                          Send Friend Request
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  </div>
);

}

export default HomePage;









//  <section className="mb-6 sm:mb-8">
//   <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//     <div>
//       <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
//         Meet New Learners
//       </h2>
//       <p className="opacity-70">
//         Discover perfect language exchange partners based on your profile
//       </p>
//     </div>
//   </div>

//   {loadingUsers ? (
//     <div className="flex justify-center py-12">
//       <span className="loading loading-spinner loading-lg"></span>
//     </div>
//   ) : recommendedUsers && recommendedUsers.length === 0 ? (
//     <NoRecommendedUserFound />
//   ) : (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//       {recommendedUsers.map((user) => {
//         const hasRequestBeenSent = outgoingRequestsIds.has(user._id);

//         return (
//           <div
//             key={user._id}
//             className="card bg-base-200 hover:shadow-lg transition-all duration-300"
//           >
//             <div className="card-body p-5 space-y-4">
//               <div className="flex items-center gap-3">
//                 <div className="avatar w-16 h-16 rounded-full">
//                   <img src={user.profilePic} alt={user.fullName} />
//                 </div>

//                 <div>
//                   <h3 className="font-semibold text-lg">{user.fullName}</h3>
//                   {user.location && (
//                     <div className="flex items-center text-xs opacity-70 mt-1">
//                       <MapPinIcon className="w-3 h-3 mr-1" />
//                       {user.location}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div className="flex flex-wrap gap-1.5 mb-3">
//                 {user.nativeLanguage && (
//                   <span className="badge badge-secondary text-xs">
//                     {getLanguageFlag(user.nativeLanguage)}
//                     Native: {capitalize(user.nativeLanguage)}
//                   </span>
//                 )}
//                 {user.learningLanguage && (
//                   <span className="badge badge-outline text-xs">
//                     {getLanguageFlag(user.learningLanguage)}
//                     Learning: {capitalize(user.learningLanguage)}
//                   </span>
//                 )}
//               </div>

//               {user.bio && <p className="text-sm opacity-70">{user.bio}</p>}

//               <button
//                 className={`btn w-full mt-2 ${
//                   hasRequestBeenSent ? "btn-disabled" : "btn-primary"
//                 }`}
//                 onClick={() => sendRequestMutation(user._id)}
//                 disabled={hasRequestBeenSent || isPending}
//               >
//                 {hasRequestBeenSent ? (
//                   <>
//                     <CheckCircleIcon className="w-4 h-4 mr-2" />
//                     Request Sent
//                   </>
//                 ) : (
//                   <>
//                     <UserPlusIcon className="w-4 h-4 mr-2" />
//                     Send Friend Request
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   )}
// </section>


