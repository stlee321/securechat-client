import { useEffect, useRef, useState } from "react";
import ChatBox from "./ChatBox";
import { useChatRoom } from "../../state/chatRoomState";
import { Chat } from "../../types/chat";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";

type ChatListProps = {
  enabled: boolean;
  history: Chat[];
  chats: Chat[];
  fetchPrevious: () => void;
};
export default function ChatList({
  history,
  chats,
  enabled,
  fetchPrevious,
}: ChatListProps) {
  const empty = chats.length === 0 && history.length === 0;
  const chatRoomState = useChatRoom();
  const chatArea = useRef<HTMLDivElement>(null);
  const [showLoadMore, setShowLoadMore] = useState(false);
  const prevScrollHeight = useRef(0);
  useEffect(() => {
    if (chatArea.current) {
      if (chatArea.current.clientHeight < chatArea.current.scrollHeight) {
        setShowLoadMore(() => true);
      }
      chatArea.current.scrollTop +=
        chatArea.current.scrollHeight - prevScrollHeight.current;
      prevScrollHeight.current = chatArea.current.scrollHeight;
    }
  }, [history]);
  useEffect(() => {
    if (chatArea.current) {
      if (chatArea.current.clientHeight < chatArea.current.scrollHeight) {
        setShowLoadMore(() => true);
      }
      const diff = Math.abs(
        chatArea.current.scrollTop +
          chatArea.current.clientHeight -
          chatArea.current.scrollHeight
      );
      if (diff < 200) {
        chatArea.current.scrollTop = chatArea.current.scrollHeight;
      }
      prevScrollHeight.current = chatArea.current.scrollHeight;
    }
  }, [chats]);
  return (
    <div
      ref={chatArea}
      className="w-full h-full overflow-y-auto my-24 lg:my-0 lg:mb-4 flex flex-col justify-start items-center"
    >
      {empty ? (
        <span className="text-gray-2 text-xl font-semibold">
          대화가 없습니다.
        </span>
      ) : (
        <>
          {showLoadMore ? (
            <div className="flex justify-center items-center">
              <div
                onClick={fetchPrevious}
                className="w-12 h-12 rounded-full bg-green-2 flex justify-center items-center text-white hover:cursor-pointer"
              >
                <FontAwesomeIcon icon={faArrowUp} />
              </div>
            </div>
          ) : null}
          {history.map((chat) => {
            return (
              <ChatBox
                key={chat.id}
                content={chat.content}
                symKey={chatRoomState.symKey}
                enabled={enabled}
              />
            );
          })}
          {chats.map((chat) => {
            return (
              <ChatBox
                key={chat.id}
                content={chat.content}
                symKey={chatRoomState.symKey}
                enabled={enabled}
              />
            );
          })}
        </>
      )}
    </div>
  );
}
