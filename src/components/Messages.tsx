import { type Message as TMessage } from "ai/react";
import { Message } from "./Message";
import { MessageSquare } from "lucide-react";
import { useEffect, useRef } from "react";

interface MessagesProps {
  messages: TMessage[];
}

export const Messages = ({ messages }: MessagesProps) => {
  const msgEnd = useRef<HTMLDivElement | null>(null);
  useEffect(()=>{
    msgEnd.current?.scrollIntoView();
  },[messages])
  return (
    <div className="flex max-h-[calc(100vh-3.5rem-7rem)] flex-1 flex-col overflow-y-auto">
      {messages.length ? (
        messages.map((message, i) => (
          <>
            <Message
              key={i}
              content={message.content}
              isUserMessage={message.role === "user"}
            />
            <div ref={msgEnd} />
          </>
        ))
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-2">
          <MessageSquare className="size-8 text-blue-500" />
          <h3 className="font-semibold text-xl text-white">
            You&apos;re all set!
          </h3>
          <p className="text-zinc-500 text-sm">
            Ask your first question to get started.
          </p>
        </div>
      )}
    </div>
  );
};