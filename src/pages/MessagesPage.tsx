import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, Send, Image } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';

const MessagesPage = () => {
  const { user } = useAuth();
  const { 
    conversations, 
    activeConversation,
    messages,
    isLoading,
    setActiveConversation,
    sendMessage
  } = useChat();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const conversationId = searchParams.get('conversation');
    if (conversationId) {
      const conversation = conversations.find(c => c.id === conversationId);
      if (conversation) {
        setActiveConversation(conversation);
      }
    } else if (conversations.length > 0) {
      setActiveConversation(conversations[0]);
    }
  }, [conversations, searchParams]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    await sendMessage(messageInput);
    setMessageInput('');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        </div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/profile" className="text-teal-600 hover:text-teal-800 flex items-center">
            <ChevronLeft size={18} /> Назад в профиль
          </Link>
        </div>
        <div className="text-center py-12">
          <h2 className="text-xl font-medium text-gray-800 mb-2">У вас пока нет сообщений</h2>
          <p className="text-gray-600 mb-6">Начните общение с продавцами, чтобы обсудить товары</p>
          <Link
            to="/products"
            className="inline-flex items-center px-6 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
          >
            Перейти к товарам
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/profile" className="text-teal-600 hover:text-teal-800 flex items-center">
          <ChevronLeft size={18} /> Назад в профиль
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="grid grid-cols-12 h-[calc(100vh-12rem)]">
          {/* Conversations list */}
          <div className="col-span-4 border-r border-gray-200">
            <div className="h-full flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Сообщения</h2>
              </div>
              <div className="flex-1 overflow-y-auto">
                {conversations.map(conversation => {
                  const isActive = activeConversation?.id === conversation.id;
                  const otherUser = user?.id === conversation.buyer_id 
                    ? conversation.seller 
                    : conversation.buyer;

                  return (
                    <button
                      key={conversation.id}
                      onClick={() => {
                        setActiveConversation(conversation);
                        navigate(`/messages?conversation=${conversation.id}`);
                      }}
                      className={`w-full p-4 border-b border-gray-200 flex items-start hover:bg-gray-50 transition-colors ${
                        isActive ? 'bg-gray-50' : ''
                      }`}
                    >
                      <img
                        src={otherUser.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${otherUser.name}`}
                        alt={otherUser.name}
                        className="w-12 h-12 rounded-full object-cover mr-4"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-medium text-gray-900 truncate">
                            {otherUser.name || 'Пользователь'}
                          </h3>
                          {conversation.last_message && (
                            <span className="text-xs text-gray-500">
                              {new Date(conversation.last_message.created_at).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 truncate">
                          {conversation.last_message?.content || 'Нет сообщений'}
                        </p>
                        <div className="mt-1 flex items-center">
                          <img
                            src={conversation.product.images[0]}
                            alt={conversation.product.title}
                            className="w-8 h-8 rounded object-cover mr-2"
                          />
                          <span className="text-xs text-gray-500 truncate">
                            {conversation.product.title}
                          </span>
                        </div>
                      </div>
                      {conversation.unread_count > 0 && (
                        <span className="ml-2 bg-teal-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                          {conversation.unread_count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="col-span-8">
            {activeConversation ? (
              <div className="h-full flex flex-col">
                {/* Chat header */}
                <div className="p-4 border-b border-gray-200 flex items-center">
                  <img
                    src={activeConversation.product.images[0]}
                    alt={activeConversation.product.title}
                    className="w-12 h-12 rounded object-cover mr-4"
                  />
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {activeConversation.product.title}
                    </h3>
                    <Link
                      to={`/product/${activeConversation.product.id}`}
                      className="text-sm text-teal-600 hover:text-teal-800"
                    >
                      Перейти к товару
                    </Link>
                  </div>
                </div>

                {/* Messages list */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map(message => {
                    const isOwnMessage = message.sender_id === user?.id;

                    return (
                      <div
                        key={message.id}
                        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg px-4 py-2 ${
                            isOwnMessage
                              ? 'bg-teal-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <span className="text-xs opacity-75 mt-1 block">
                            {new Date(message.created_at).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <Image size={20} />
                    </button>
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="Введите сообщение..."
                      className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <button
                      type="submit"
                      disabled={!messageInput.trim()}
                      className="p-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500">Выберите диалог слева</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;