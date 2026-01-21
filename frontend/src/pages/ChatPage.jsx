// import React, { useEffect, useState } from 'react'
// import { useParams } from 'react-router-dom'
// import useAuthUser from '../hooks/useAuthUser';
// import { useQuery } from '@tanstack/react-query';
// import { getStreamToken } from '../lib/api';
// import {Chat, Channel, ChannelHeader, MessageInput, MessageList, Thread, Window } from 'stream-chat-react';
// import { StreamChat } from 'stream-chat';
// import toast from 'react-hot-toast';
// import ChatLoader from '../components/ChatLoader';
// import CallButton from '../components/CallButton';

// const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

// const ChatPage = () => {
//   const {id:targetUserId} = useParams();
  
//   const [chatClient, setChatClient] = useState(null);
//   const [channel , setChannel] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const {authUser} = useAuthUser();

//   const {data:TokenData} = useQuery({
//     queryKey : ["streamToken"],
//     queryFn: getStreamToken,
//     enabled : !!authUser 
//   })
  
//   useEffect(()=>{
//     const initChat = async ()=>{
//     if(!TokenData?.token || !authUser) return;
//     try {
//       console.log("Initializing stream chat client...");
//       const client = StreamChat.getInstance(STREAM_API_KEY)
//       await client.connectUser({
//         id: authUser._id,
//         name: authUser.fullName,
//         image: authUser.profilePic,
//       },TokenData.token)

//       const channelId = [authUser._id , targetUserId].sort().join("-");

//       const currChannel = client.channel("messaging",channelId,{
//         members:[authUser._id, targetUserId],
//       })
//       await currChannel.watch();

//       setChatClient(client);
//       setChannel(currChannel);
      

//     } catch (error) {
//       console.log("Error initializing chat:", error);
//       toast.error("Could not connect to chat. Please try again")
//     } finally{
//       setLoading(false)
//     }
//     }
//     initChat()
//   },[TokenData, authUser, targetUserId])

//   const handleVideoCall = ()=>{
//       if(channel){
//         const callUrl = `${window.location.origin}/call/${channel.id}`;

//         channel.sendMessage({
//           text : `I've started a video call. Join me here: ${callUrl}`
//         }),
//         toast.success("Video call link send successfully!")
//       }
//   }

//   if(loading || !chatClient || !channel) return <ChatLoader/>

  
//   return <div className='h-[93vh] w-full'>
//        <Chat client={chatClient}>
//           <Channel channel={channel}>
//              <div className='w-full relative'>
//               <CallButton handleVideoCall = {handleVideoCall}/>
//                <Window>
//                 <ChannelHeader/>
//                 <MessageList/>
//                 <MessageInput focus />
//                </Window>
//              </div>
//              <Thread/>
//           </Channel>
//        </Chat>
//     </div>
  
// }

// export default ChatPage

import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import useAuthUser from '../hooks/useAuthUser'
import { useQuery } from '@tanstack/react-query'
import { getStreamToken } from '../lib/api'
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from 'stream-chat-react'
import { StreamChat } from 'stream-chat'
import toast from 'react-hot-toast'
import ChatLoader from '../components/ChatLoader'
import CallButton from '../components/CallButton'

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY

const ChatPage = () => {
  const { id: targetUserId } = useParams()

  const [chatClient, setChatClient] = useState(null)
  const [channel, setChannel] = useState(null)
  const [loading, setLoading] = useState(true)

  const { authUser } = useAuthUser()

  const { data: TokenData } = useQuery({
    queryKey: ['streamToken'],
    queryFn: getStreamToken,
    enabled: !!authUser,
  })

  useEffect(() => {
    let client // store client reference to disconnect later

    const initChat = async () => {
      if (!TokenData?.token || !authUser) return

      try {
        console.log('Initializing stream chat client...')
        client = StreamChat.getInstance(STREAM_API_KEY)

        // Always disconnect previous user before reconnecting
        if (client.userID) {
          console.log('Disconnecting existing user before reconnecting...')
          await client.disconnectUser()
        }

        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profilePic,
          },
          TokenData.token
        )

        const channelId = [authUser._id, targetUserId].sort().join('-')
        const currChannel = client.channel('messaging', channelId, {
          members: [authUser._id, targetUserId],
        })

        await currChannel.watch()

        setChatClient(client)
        setChannel(currChannel)
      } catch (error) {
        console.log('Error initializing chat:', error)
        toast.error('Could not connect to chat. Please try again')
      } finally {
        setLoading(false)
      }
    }

    initChat()

    return () => {
      // Cleanup on unmount or dependency change
      if (client) {
        console.log('Cleaning up chat connection...')
        client.disconnectUser()
        setChatClient(null)
        setChannel(null)
      }
    }
  }, [TokenData, authUser, targetUserId])

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`

      channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
      })

      toast.success('Video call link sent successfully!')
    }
  }

  if (loading || !chatClient || !channel) return <ChatLoader />

  return (
    <div className="h-[93vh] w-full">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className="w-full relative">
            <CallButton handleVideoCall={handleVideoCall} />
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus />
            </Window>
          </div>
          <Thread />
        </Channel>
      </Chat>
    </div>
  )
}

export default ChatPage

