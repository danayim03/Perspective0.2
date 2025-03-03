import { useState, useEffect } from "react";
import { Role } from "@/types";
import { Card } from "@/components/ui/card";
import { bubbleColorOptions } from "./constants";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { ChatHeader } from "./ChatHeader";
import { RematchDialog } from "./RematchDialog";
import { useChatConnection } from "@/hooks/useChatConnection";
import { useChatView } from "@/hooks/useChatView";

interface ChatRoomProps {
  userRole: Role;
  onGoBack: () => void;
  onRematch: () => void;
  ws: WebSocket | null;
}

export const ChatRoom = ({ userRole, onGoBack, onRematch, ws }: ChatRoomProps) => {
  const [newMessage, setNewMessage] = useState("");
  
  const { 
    messages, 
    isConnected, 
    isTyping, 
    chatEnded, 
    isRematching, 
    showRematchDialog, 
    setShowRematchDialog, 
    handleTyping, 
    sendMessage, 
    endChat, 
    handleRematch, 
    closeConnection 
  } = useChatConnection(ws, { onEndChat: onGoBack, onRematch });
  
  const {
    viewportHeight,
    selectedBubbleColor,
    setSelectedBubbleColor,
    messagesEndRef,
    chatContainerRef,
    inputRef,
    scrollToBottom,
    handleInputFocus,
    focusInputWithoutDismissingKeyboard
  } = useChatView(chatEnded);

  useEffect(() => {
    if (messages.length > 0) {
      const scrollTimer = setTimeout(() => {
        scrollToBottom(false);
      }, 100);
      
      return () => clearTimeout(scrollTimer);
    }
  }, [messages]);

  useEffect(() => {
    if (newMessage.trim() && isConnected && !chatEnded) {
      handleTyping();
    }
  }, [newMessage, isConnected, chatEnded]);

  const handleSend = () => {
    if (sendMessage(newMessage, selectedBubbleColor.value)) {
      setNewMessage("");
      
      const currentScrollPos = window.scrollY;
      
      setTimeout(() => {
        focusInputWithoutDismissingKeyboard();
        window.scrollTo(0, currentScrollPos);
        setTimeout(() => {
          scrollToBottom(false);
          focusInputWithoutDismissingKeyboard();
        }, 50);
      }, 10);
    }
  };

  const handleColorChange = (color: typeof bubbleColorOptions[0]) => {
    setSelectedBubbleColor(color);
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    if (!chatEnded) {
      e.stopPropagation();
    }
  };

  return (
    <>
      <div 
        className="flex flex-col h-[100dvh] pt-14 md:pt-16 bg-gradient-to-br from-perspective-100 to-perspective-200 p-1 sm:p-2 md:p-4 font-mono"
        onClick={handleContainerClick}
        style={{ 
          minHeight: '300px', 
          maxHeight: '100dvh',
          position: 'fixed',
          width: '100%',
          left: 0,
          top: 0,
          overflowY: 'hidden'
        }}
      >
        <Card 
          className="flex-1 flex flex-col w-full mx-auto backdrop-blur-lg bg-white/90 rounded-lg sm:rounded-xl md:rounded-2xl shadow-xl overflow-hidden chat-container"
          ref={chatContainerRef}
          style={{ 
            maxHeight: `${viewportHeight - 60}px`,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <ChatHeader 
            onEndChat={chatEnded ? closeConnection : endChat}
            chatEnded={chatEnded}
            onColorChange={handleColorChange}
          />

          <MessageList 
            messages={messages}
            isTyping={isTyping}
            chatEnded={chatEnded}
            isRematching={isRematching}
            isConnected={isConnected}
            selectedBubbleColor={selectedBubbleColor}
            messagesEndRef={messagesEndRef}
          />

          <ChatInput 
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            handleSend={handleSend}
            isConnected={isConnected}
            chatEnded={chatEnded}
            isRematching={isRematching}
            inputRef={inputRef}
            onFocus={handleInputFocus}
          />
        </Card>
      </div>
      
      <RematchDialog 
        open={showRematchDialog}
        onOpenChange={setShowRematchDialog}
        onConfirm={handleRematch}
      />
    </>
  );
};
