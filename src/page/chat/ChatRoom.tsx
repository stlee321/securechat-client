import {Navigate, useParams} from "react-router-dom";
import RemainingTime from "./RemaningTime";
import {useDeferredValue, useEffect, useRef, useState} from "react";
import {Chat} from "../../types/chat";
import ChatList from "./ChatList";
import ChatInput from "./ChatInput";
import ChatStatus from "./ChatStatus";
import {ChatRoomInfo, useChatRoom} from "../../state/chatRoomState";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars, faCircleNotch} from "@fortawesome/free-solid-svg-icons";
import {Client} from "@stomp/stompjs";
import {useChats} from "../../hooks/useChats";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";

type ChatRoomInitState = {
  loading: boolean;
  valid: boolean;
};

export default function ChatRoom() {
  const [initState, setInitState] = useState<ChatRoomInitState>({
    loading: true,
    valid: true,
  });
  const chatRoomState = useChatRoom();
  const {chatId} = useParams();
  const {
    data: chatHistory,
    isSuccess,
    fetchPreviousPage,
  } = useChats(chatRoomState.id, Date.now(), chatRoomState.id !== "");
  const [history, setHistory] = useState<Chat[]>([]);
  const deferedHistory = useDeferredValue(history);
  const [chats, setChats] = useState<Chat[]>([]);
  const deferedChats = useDeferredValue(chats);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const client = useRef<Client | null>(null);
  // const domain = import.meta.env.VITE_DOMAIN as string;
  const domain = window.location.hostname;
  useEffect(() => {
    const controller = new AbortController();
    const _getChatRoomInfo = async () => {
      if (!chatId || chatId === "/") return;
      const res = await fetch("/api/chat/" + chatId, {
        signal: controller.signal,
      });
      if (res.status === 200) {
        const info = (await res.json()) as ChatRoomInfo;
        chatRoomState.setChatRoomState(info);
        setInitState({loading: false, valid: true});
      } else {
        setInitState(() => ({loading: false, valid: false}));
      }
    };
    _getChatRoomInfo();
    return () => {
      controller.abort();
    };
  }, []);
  useEffect(() => {
    if (!isSuccess) {
      return;
    }
    const history = chatHistory.pages
      .flatMap((p) => p?.chats || [])
      .map((c) => ({
        id: c.timestamp.toString(),
        content: c.content,
      }));
    if (history.length > 0) {
      setHistory(history);
    }
  }, [chatHistory, isSuccess]);
  useEffect(() => {
    client.current = new Client({
      brokerURL: `wss://${domain}/api/ws`,
      onConnect: () => {
        const subId = "sub";
        client.current?.subscribe(
          "/topic/" + chatId,
          (message) => {
            setChats((chats) => [
              ...chats,
              {
                id: window.crypto.randomUUID().toString(),
                content: message.body,
              },
            ]);
          },
          {
            id: subId,
          }
        );
      },
    });
    client.current?.activate();
    return () => {
      client.current?.deactivate();
    };
  }, []);
  if (!chatId || chatId === "/") {
    return <Navigate to={"/"} replace={true} />;
  }
  if (initState.loading) {
    return (
      <div className="h-screen p-8 lg:p-16">
        <div className="text-white text-3xl font-bold">SECURE CHAT</div>
        <div className="h-full text-white text-xl font-bold flex justify-center items-center">
          <div className="w-12 h-12 animate-spin flex justify-center items-center">
            <FontAwesomeIcon icon={faCircleNotch} size={"2xl"} />
          </div>
        </div>
      </div>
    );
  }
  if (!initState.valid) {
    return (
      <div className="h-screen p-8 lg:p-16">
        <div className="text-white text-3xl font-bold">SECURE CHAT</div>
        <div className="h-full text-white text-xl font-bold flex justify-center items-center">
          존재하지 않는 채팅룸 입니다.
        </div>
      </div>
    );
  }
  if (Date.now() > chatRoomState.expiration) {
    return (
      <div className="h-screen p-8 lg:p-16">
        <div className="text-white text-3xl font-bold">SECURE CHAT</div>
        <div className="h-full text-white text-xl font-bold flex justify-center items-center">
          이미 만료된 채팅룸입니다.
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="w-screen h-screen relative flex flex-col lg:flex-row justify-between items-start p-8 lg:p-16">
        <div className="h-full lg:flex flex-col justify-between items-start hidden">
          <div>
            <div className="text-white text-3xl font-bold mb-2">
              SECURE CHAT
            </div>
            <div className="text-white mb-24">{chatRoomState.id}</div>
            <ChatStatus
              enabled={chatRoomState.enabled}
              checkSymKey={async (symKey) => {
                return chatRoomState.verify(symKey);
              }}
            />
          </div>
          <RemainingTime expiration={chatRoomState.expiration} />
        </div>
        <div className="lg:hidden fixed w-screen top-0 left-0 p-8 bg-green-1">
          <div className="flex justify-start items-center mb-2">
            <div
              onClick={() => setIsDrawerOpen(true)}
              className="text-white hover:cursor-pointer"
            >
              <FontAwesomeIcon icon={faBars} size={"xl"} />
            </div>
            <div className="text-white text-xl font-bold ml-4">SECURE CHAT</div>
          </div>
          <div>
            <div className="text-white text-sm">{chatRoomState.id}</div>
          </div>
          <Drawer
            open={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            direction="left"
            size={350}
            style={{
              backgroundColor: "#2a342c",
            }}
          >
            <div className="h-full flex flex-col justify-evenly items-center">
              <ChatStatus
                enabled={chatRoomState.enabled}
                checkSymKey={async (symKey) => {
                  return chatRoomState.verify(symKey);
                }}
              />
              <RemainingTime expiration={chatRoomState.expiration} />
            </div>
          </Drawer>
        </div>
        <div className="w-full lg:w-fit h-full flex flex-col justify-between items-end">
          <ChatList
            fetchPrevious={() => {
              fetchPreviousPage();
            }}
            history={deferedHistory}
            chats={deferedChats}
            enabled={chatRoomState.enabled}
          />
          <ChatInput client={client.current} enabled={chatRoomState.enabled} />
        </div>
      </div>
    </>
  );
}
