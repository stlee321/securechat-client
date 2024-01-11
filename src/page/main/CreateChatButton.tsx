import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import SpinLoading from "./SpinLoading";
import ChatRoomInfo from "./ChatRoomInfo";
import { ab2pem, encryptMessage } from "../../utils/secUtils";
import { ChatRoom } from "../../types/chatroom";

type CreateChatButtonProps = {
  duration: number;
};

export default function CreateChatButton({ duration }: CreateChatButtonProps) {
  const [loading, setLoading] = useState(false);
  const [modalOn, setModalOn] = useState(false);
  const [chatId, setChatId] = useState("");
  const [symKey, setSymKey] = useState("");
  async function requestChatRoomCreation() {
    setLoading(true);
    const newKey = await window.crypto.subtle.generateKey(
      {
        name: "AES-GCM",
        length: 256,
      },
      true,
      ["encrypt", "decrypt"]
    );
    const keyExported = await window.crypto.subtle
      .exportKey("raw", newKey)
      .then((ab) => ab2pem(ab));
    const keyEncrypted = await encryptMessage(keyExported, newKey);
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        verification: keyEncrypted,
        duration: duration,
      }),
    });
    if (res.status === 200) {
      const _chatRoom = (await res.json()) as ChatRoom;
      setChatId(_chatRoom.id);
      setSymKey(keyExported);
      setModalOn(true);
    } else {
      alert("채팅룸 생성중 오류. 다시 시도해 주세요");
    }
    setLoading(false);
  }
  return (
    <>
      {modalOn ? (
        <div className="fixed top-0 left-0 w-screen h-screen bg-gray-1/70 px-8 lg:px-64 pt-8 lg:pt-32">
          <div
            onClick={() => {
              setModalOn(false);
            }}
            className="text-white w-12 h-12 font-bold absolute top-2 right-2 flex justify-center items-center hover:cursor-pointer"
          >
            <FontAwesomeIcon icon={faXmark} size={"2xl"} />
          </div>
          <ChatRoomInfo id={chatId} symKey={symKey} />
        </div>
      ) : null}
      <div
        onClick={() => {
          requestChatRoomCreation();
        }}
        className="bg-green-3 w-12 h-12 rounded-xl text-white text-xl font-bold flex justify-center items-center transition delay-75 hover:bg-green-5 hover:cursor-pointer"
      >
        {loading ? <SpinLoading /> : <FontAwesomeIcon icon={faPlus} />}
      </div>
    </>
  );
}
