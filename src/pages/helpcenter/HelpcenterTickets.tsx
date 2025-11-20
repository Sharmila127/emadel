/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import { BsThreeDotsVertical } from "react-icons/bs";
import { Send, Paperclip, X } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { getHelpcenterTicketData } from '@/features/Profile/helpcenter-ticket/reducers/Thunks'
import { helpcenterTicketSelect } from '@/features/Profile/helpcenter-ticket/reducers/Selector'
import { GetImageUrl } from '@/utils/helper'
import socket from '@/utils/socket'

interface Ticket {
  _id: string
  uuid: string
  user: {
    _id: string
    first_name: string
    last_name: string
    image?: string
    email?: string
    phone_number?: string
    role?: {
      identity: string
    }
  }
  query: string
  date: string
  status: string
  priority: 'Low' | 'Medium' | 'High'
  messages: Message[]
}

interface Message {
  _id: string
  sender: string
  senderType: 'Users' | 'Support'
  content: string
  createdAt: string
}

interface UserProfile {
  name: string
  email: string
  phone: string
  location: string
  locationTime: string
  language: string
  role?: string
}

// const userProfiles: Record<string, UserProfile> = {
//   'Chandran': {
//     name: 'Chandran R',
//     email: 'chandran.r@example.com',
//     phone: '+91 98765 45678',
//     location: 'New York, USA',
//     locationTime: 'Mon - Fri 9 AM - 5 PM',
//     language: 'English',
//   }
// }

// Skeleton Loader Components
const TicketItemSkeleton = () => (
  <div className="p-3 my-2 bg-white rounded-xl border border-gray-100 shadow-[0_0_5px_rgba(0,0,0,0.1)] animate-pulse">
    <div className="flex items-start space-x-3">
      <div className="w-10 h-10 rounded-full bg-gray-200"></div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        </div>
        <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
        <div className="flex items-center mt-8 ml-22 space-x-2">
          <div className="h-6 bg-gray-200 rounded w-16"></div>
          <div className="h-6 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
    </div>
  </div>
)

const ChatHeaderSkeleton = () => (
  <div className="shrink-0 bg-white mb-1 border-b rounded-xl border-gray-400 px-6 py-4 shadow-[0_0_5px_rgba(0,0,0,0.1)] animate-pulse">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-gray-200"></div>
        <div>
          <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
      <div className="w-5 h-5 bg-gray-200 rounded"></div>
    </div>
  </div>
)

const MessageSkeleton = ({ isUser }: { isUser: boolean }) => (
  <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-pulse`}>
    <div className="flex items-end space-x-2 max-w-xs lg:max-w-md">
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gray-200 mb-1"></div>
      )}
      <div className="space-y-1">
        <div className={`px-4 py-3 rounded-xl w-48 h-12 ${isUser ? 'bg-gray-300' : 'bg-gray-200'
          }`}></div>
        <div className={`h-2 bg-gray-200 rounded w-16 ${isUser ? 'ml-auto' : ''
          }`}></div>
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gray-200 mb-1"></div>
      )}
    </div>
  </div>
)

const ProfileModalSkeleton = () => (
  <div className="max-w-md mt-50 ml-70 bg-white rounded-2xl shadow-2xl border-0 p-0 overflow-hidden animate-pulse">
    <div className="p-6 pb-4">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-gray-200"></div>
        <div>
          <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-24"></div>
        </div>
      </div>

      <div className="mb-6">
        <div className="h-5 bg-gray-200 rounded w-24 mb-4"></div>
        <div className="grid grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i}>
              <div className="h-3 bg-gray-200 rounded w-16 mb-1"></div>
              <div className="h-9 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
)

const HelpcenterTickets = () => {
  const dispatch = useDispatch<any>();
  const ticketData = useSelector(helpcenterTicketSelect)?.data?.data as Ticket[]
  const [ticketMessages, setTicketMessages] = useState<Record<string, Message[]>>({})
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [messageInput, setMessageInput] = useState<string>('')
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [selectedUserProfile, setSelectedUserProfile] = useState<UserProfile | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  const filteredTickets = ticketData?.filter((ticket) => {
    const fullName = `${ticket.user.first_name} ${ticket.user.last_name}`.toLowerCase();
    const queryText = ticket.query.toLowerCase();
    return (
      fullName.includes(searchQuery.toLowerCase()) ||
      queryText.includes(searchQuery.toLowerCase())
    );
  });

  // Initialize with first ticket when data loads
  useEffect(() => {
    if (ticketData && ticketData.length > 0) {
      const messagesMap: Record<string, Message[]> = {};
      ticketData.forEach(ticket => {
        messagesMap[ticket._id] = ticket.messages;
      });
      setTicketMessages(messagesMap);

      // Set first ticket as default selected
      if (!selectedTicket) {
        setSelectedTicket(ticketData[0]);
      }
      setIsLoading(false)
    }
  }, [selectedTicket, ticketData]);

  // Load ticket data on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        await dispatch(getHelpcenterTicketData({}))
      } catch (error) {
        console.error("Failed to load ticket data:", error)
      } finally {
        // We'll set loading to false in the other useEffect when data is processed
      }
    }

    loadData()
  }, [dispatch])

  const handleSendMessage = () => {
    if (messageInput.trim() && selectedTicket) {
      const timestamp = new Date().toISOString(); // ISO format
      const userId = "66152b8fe43cda58126a2356"; // Ideally dynamic
      const ticketId = selectedTicket.uuid;

      // Construct message to send to server
      const outgoingMessage = {
        senderType: "Users",
        text: messageInput,
        ticket_id: ticketId,
        timestamp,
        user: userId
      };

      // Emit to server via socket
      socket.emit("sendTicketMessage", outgoingMessage);
      console.log("Message sent via socket:", outgoingMessage);

      // Construct local UI message in expected format
      const localMessage: Message = {
        _id: `${ticketId}-${Date.now()}`,  // Temporary/fake ID
        sender: userId,
        senderType: "Users",
        content: messageInput,
        createdAt: timestamp
      };

      // Optimistically add message to local state
      setTicketMessages(prev => ({
        ...prev,
        [selectedTicket._id]: [...(prev[selectedTicket._id] || []), localMessage]
      }));

      // Clear input
      setMessageInput('');
    }
  };

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      if (selectedTicket?.uuid) {
        socket.emit("joinTicket", selectedTicket.uuid);
      }
    });

    const handleMessage = (message: Message) => {
      console.log("Received message:", message);

      // Append to local UI
      if (selectedTicket?.uuid) {
        setTicketMessages(prev => ({
          ...prev,
          [selectedTicket.uuid]: [...(prev[selectedTicket.uuid] || []), message]
        }));
      }
    };

    socket.on("receiveMessage", handleMessage);

    return () => {
      socket.off("receiveMessage", handleMessage);
    };
  }, [selectedTicket]);

  const handleAvatarClick = (user: Ticket['user']) => {
    const profile: UserProfile = {
      name: `${user.first_name} ${user.last_name}`,
      email: user.email || 'N/A',
      phone: user.phone_number || 'N/A',
      location: 'India', // or dynamically from user object if available
      locationTime: 'Mon - Fri 9 AM - 5 PM', // placeholder or remove
      language: 'English', // placeholder or remove
      role: user.role?.identity || 'N/A'
    }

    setSelectedUserProfile(profile)
    setIsProfileModalOpen(true)
  }

  // const groupMessagesByDate = (messages: Message[]) => {
  //   return messages.reduce((acc: Record<string, Message[]>, message) => {
  //     const date = new Date(message.createdAt).toDateString(); // e.g. "Sat Aug 09 2025"
  //     if (!acc[date]) acc[date] = [];
  //     acc[date].push(message);
  //     return acc;
  //   }, {});
  // };

  // const getReadableDate = (dateStr: string) => {
  //   const today = new Date();
  //   const targetDate = new Date(dateStr);
  //   const yesterday = new Date();
  //   yesterday.setDate(today.getDate() - 1);

  //   const todayStr = today.toDateString();
  //   const yesterdayStr = yesterday.toDateString();

  //   if (dateStr === todayStr) return 'Today';
  //   if (dateStr === yesterdayStr) return 'Yesterday';

  //   return targetDate.toLocaleDateString(undefined, {
  //     day: 'numeric',
  //     month: 'short',
  //     year: 'numeric',
  //   }); // e.g. 9 Aug 2025
  // };

  const formatRelativeTime = (isoString: string) => {
    const now = new Date()
    const date = new Date(isoString)
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    const minute = 60
    const hour = minute * 60
    const day = hour * 24
    const week = day * 7
    const month = day * 30
    const year = day * 365

    if (diffInSeconds < minute) {
      return 'just now'
    } else if (diffInSeconds < hour) {
      const minutes = Math.floor(diffInSeconds / minute)
      return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
    } else if (diffInSeconds < day) {
      const hours = Math.floor(diffInSeconds / hour)
      return `${hours} hour${hours === 1 ? '' : 's'} ago`
    } else if (diffInSeconds < week) {
      const days = Math.floor(diffInSeconds / day)
      return `${days} day${days === 1 ? '' : 's'} ago`
    } else if (diffInSeconds < month) {
      const weeks = Math.floor(diffInSeconds / week)
      return `${weeks} week${weeks === 1 ? '' : 's'} ago`
    } else if (diffInSeconds < year) {
      const months = Math.floor(diffInSeconds / month)
      return `${months} month${months === 1 ? '' : 's'} ago`
    } else {
      const years = Math.floor(diffInSeconds / year)
      return `${years} year${years === 1 ? '' : 's'} ago`
    }
  }

  const formatMessageTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="flex gap-2 h-[100%] p-3">
      {/* Left Sidebar */}
      <div className="bg-white border border-gray-100 transition-shadow duration-200 shadow-[0_0_6px_rgba(0,0,0,0.1)]">
        {/* Search Bar */}
        <div className="p-3 border-gray-200">
          <Input
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg bg-gray-50 border-[#999999]"
          />
        </div>

        {/* Tickets List */}
        <ScrollArea className="flex-1 p-3 scrollbar-hide bg-white h-[90%]">
          <div className="p-1 bg-white">
            {isLoading ? (
              // Skeleton for loading state
              <>
                {[...Array(5)].map((_, index) => (
                  <TicketItemSkeleton key={index} />
                ))}
              </>
            ) : filteredTickets && filteredTickets.length > 0 ? (
              // Actual tickets when loaded
              filteredTickets.map((ticket) => (
                <div
                  key={ticket._id}
                  className={`p-3 cursor-pointer my-2 bg-white rounded-xl border border-gray-100 transition-shadow duration-200 shadow-[0_0_5px_rgba(0,0,0,0.1)] hover:shadow-[0_0_20px_rgba(0,0,0,0.15)] border-l-4 ${selectedTicket?._id === ticket._id
                    ? 'bg-gray-50 border-l-[#68b39f]'
                    : 'hover:bg-gray-50 border-l-transparent'
                    }`}
                  onClick={() => setSelectedTicket(ticket)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <Avatar
                        className="w-10 h-10 cursor-pointer hover:ring-2 hover:ring-[#68b39f] transition-all"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleAvatarClick(ticket.user)
                        }}
                      >
                        <AvatarImage src={GetImageUrl(ticket.user.image ?? "") ?? undefined} alt={ticket.user.first_name} />
                        <AvatarFallback className="bg-orange-400 text-white">
                          {ticket.user.first_name[0]}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-sm text-gray-900">
                          {ticket.user.first_name} {ticket.user.last_name}
                        </h3>
                        <span className="text-xs text-gray-400">
                          {formatRelativeTime(ticket.date)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {ticket.query}
                      </p>
                      <div className="flex items-center mt-8 ml-22 space-x-2">
                        {/* Status Badge */}
                        <Badge className="px-4 py-1 text-white bg-[#68b39f] text-sm font-medium h-auto rounded-tl-xl rounded-br-xl rounded-tr-none rounded-bl-none">
                          {ticket.status}
                        </Badge>

                        {/* Priority Badge */}
                        <Badge
                          variant="outline"
                          className={`px-4 py-1 text-sm font-medium h-auto rounded-tl-xl rounded-br-xl rounded-tr-none rounded-bl-none ${ticket.priority === 'Low'
                            ? 'border-[#68b39f] text-[#68b39f] bg-white'
                            : ticket.priority === 'Medium'
                              ? 'border-[#68b39f] text-[#68b39f] bg-white'
                              : 'border-red-300 text-red-600 bg-red-50'
                            }`}
                        >
                          {ticket.priority}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // No tickets found
              <div className="text-center text-gray-500 py-8">
                No tickets found
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      {isLoading ? (
        // Skeleton for chat area when loading
        <div className="flex-1 flex flex-col bg-white">
          <ChatHeaderSkeleton />
          <div className="flex-1 overflow-y-auto border rounded-2xl mb-2 no-scrollbar px-6 py-4 bg-ticket">
            <div className="space-y-4">
              <MessageSkeleton isUser={false} />
              <MessageSkeleton isUser={true} />
              <MessageSkeleton isUser={false} />
              <MessageSkeleton isUser={true} />
            </div>
          </div>
          <div className="shrink-0 bg-white border rounded-2xl border-gray-200 px-6 py-4 animate-pulse">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gray-200"></div>
              <div className="flex-1 h-10 bg-gray-200 rounded-full"></div>
              <div className="w-10 h-10 rounded-full bg-gray-300"></div>
            </div>
          </div>
        </div>
      ) : selectedTicket ? (
        // Actual chat area when loaded
        <div className="flex-1 flex flex-col bg-white">
          {/* Chat Header */}
          <div className="shrink-0 bg-white mb-1 border-b rounded-xl border-gray-400 px-6 py-4 transition-shadow duration-200 shadow-[0_0_5px_rgba(0,0,0,0.1)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar
                  className="w-10 h-10 cursor-pointer hover:ring-2 hover:ring-[#68b39f] transition-all"
                  onClick={() => handleAvatarClick(selectedTicket.user)}
                >
                  <AvatarImage src={GetImageUrl(selectedTicket.user.image ?? "") ?? undefined} alt={selectedTicket.user.first_name} />
                  <AvatarFallback className="bg-orange-400 text-white">
                    {selectedTicket.user.first_name[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold text-gray-900">
                    {selectedTicket.user.first_name} {selectedTicket.user.last_name}
                  </h2>
                  <p className="text-sm text-gray-500">{selectedTicket.user?.role?.identity}</p>
                </div>
              </div>
              <div>
                <BsThreeDotsVertical />
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto border rounded-2xl mb-2 no-scrollbar px-6 py-4 bg-ticket">
            <div className="space-y-4">
              {ticketMessages[selectedTicket._id] && ticketMessages[selectedTicket._id].length > 0 ? (
                ticketMessages[selectedTicket._id]?.map((message) => (
                  <div
                    key={message._id}
                    className={`flex ${message.senderType === 'Users' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className="flex items-end space-x-2 max-w-xs lg:max-w-md">
                      {message.senderType !== 'Users' && (
                        <Avatar className="w-8 h-8 mb-1">
                          <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Support" />
                          <AvatarFallback className="bg-blue-500 text-white text-xs">S</AvatarFallback>
                        </Avatar>
                      )}
                      <div className="space-y-1">
                        <div
                          className={`px-4 py-3 rounded-xl bg-white border border-gray-100 transition-shadow duration-200 shadow-[0_0_10px_rgba(0,0,0,0.1)] ${message.senderType === 'Users'
                            ? 'bg-[#68b39f] text-white rounded-br-md'
                            : 'bg-white text-gray-900 rounded-bl-md'
                            }`}
                        >
                          <p className="text-sm leading-relaxed">{message.content}</p>
                        </div>
                        <p className={`text-xs px-2 ${message.senderType === 'Users' ? 'text-right text-gray-500' : 'text-left text-gray-500'
                          }`}>
                          {formatMessageTime(message.createdAt)}
                        </p>
                      </div>
                      {message.senderType === 'Users' && (
                        <Avatar
                          className="w-8 h-8 mb-1 cursor-pointer transition-all" >
                          <AvatarImage src={GetImageUrl(selectedTicket?.user?.image ?? "") ?? undefined} alt={selectedTicket.user.first_name} />
                          <AvatarFallback className="bg-orange-400 text-white">
                            {selectedTicket.user.first_name[0]}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-400 text-sm mt-10">
                  Message not yet started
                </div>
              )}
            </div>
          </div>

          {/* Message Input */}
          <div className="shrink-0 bg-white border rounded-2xl border-gray-200 px-6 py-4">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" className="text-gray-400 relative hover:text-gray-600">
                <Paperclip className="w-5 h-5" />
              </Button>
              <Input
                placeholder="Type a message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 rounded-full bg-gray-50 border-gray-200 px-4"
              />
              <Button
                onClick={handleSendMessage}
                className="bg-[#68b39f] hover:bg-teal-600 rounded-full p-3"
                size="sm"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-white">
          <p className="text-gray-500">Select a ticket to view messages</p>
        </div>
      )}

      {/* Profile Modal */}
      <Dialog open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen}>
        <DialogContent className="max-w-md mt-50 ml-70 bg-white rounded-2xl shadow-2xl border-0 p-0 overflow-hidden">
          {isLoading ? (
            <ProfileModalSkeleton />
          ) : (
            <div className="relative">
              {/* Close Button */}
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-4 right-4 z-10 rounded-full bg-gray-100 hover:bg-gray-200 w-8 h-8 p-0"
                onClick={() => setIsProfileModalOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>

              {/* Header */}
              <div className="p-6 pb-4">
                <div className="flex items-center space-x-3 mb-6">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src="/placeholder.svg?height=48&width=48" alt={selectedUserProfile?.name} />
                    <AvatarFallback className="bg-orange-400 text-white text-lg">
                      {selectedUserProfile?.name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg text-[#242731]">{selectedUserProfile?.name}</h3>
                    <p className="text-sm text-[#999999]">{selectedUserProfile?.role}</p>
                  </div>
                </div>

                {/* Basic Details */}
                <div className="mb-6">
                  <h4 className="font-semibold text-[#242731] mb-4">Basic Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-[#242731] mb-1 block">Name</label>
                      <Input
                        value={selectedUserProfile?.name || ''}
                        readOnly
                        className="bg-white border-[#999999] text-sm text-[#999999]"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">Email</label>
                      <Input
                        value={selectedUserProfile?.email || ''}
                        readOnly
                        className="bg-white border-[#999999] text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">Phone</label>
                      <Input
                        value={selectedUserProfile?.phone || ''}
                        readOnly
                        className="bg-white border-[#999999] text-sm text-[#999999]"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">Location</label>
                      <Input
                        value={selectedUserProfile?.location || ''}
                        readOnly
                        className="bg-white border-[#999999] text-sm text-[#999999]"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">Location Time</label>
                      <Input
                        value={selectedUserProfile?.locationTime || ''}
                        readOnly
                        className="bg-white border-[#999999] text-sm text-[#999999]"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">Language</label>
                      <Input
                        value={selectedUserProfile?.language || ''}
                        readOnly
                        className="bg-white border-[#999999] text-sm text-[#999999]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default HelpcenterTickets