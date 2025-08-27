import { MessageSquare } from "lucide-react";

interface NoChatSelectedProps {
  isConnecting?: boolean;
}

const NoChatSelected = ({ isConnecting = false }: NoChatSelectedProps) => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center relative">      
      {/* Content */}
      <div className="relative z-10 max-w-md text-center space-y-6">
        {/* Icon Display */}
        <div className="flex justify-center gap-4 mb-4">
          <div className="relative">
            <div
              className={`w-16 h-16 rounded-2xl bg-primary/10 flex items-center
             justify-center ${isConnecting ? 'animate-pulse' : 'animate-bounce'}`}
            >
              <MessageSquare className="w-8 h-8 text-primary " />
            </div>
          </div>
        </div>

        {/* Welcome Text */}
        <h2 className="text-2xl font-bold">
          {isConnecting ? 'Connecting...' : 'Start Chatting!'}
        </h2>
        <p className="text-base-content/60">
          {isConnecting 
            ? 'Establishing connection to chat server...'
            : 'Select a conversation from the sidebar to begin messaging with your friends'
          }
        </p>
      </div>
    </div>
  );
};

export default NoChatSelected;