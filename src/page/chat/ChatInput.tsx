import {
  faImage,
  faLock,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Client } from "@stomp/stompjs";
import { ChangeEventHandler, useRef, useState } from "react";
import { useChatRoom } from "../../state/chatRoomState";
import { encryptMessage } from "../../utils/secUtils";
import { ChatMessage } from "../../types/chat";

const MESSAGE_MAX_LENGTH = 2000;

type ChatInputProps = {
  enabled: boolean;
  client: Client | null;
};
export default function ChatInput({ enabled, client }: ChatInputProps) {
  const chatRoomState = useChatRoom();
  const [message, setMessage] = useState("");
  const sendMessage = async (msg?: string) => {
    if (client === null) return;
    if (chatRoomState.symKey === null) return;
    const chatMessage: ChatMessage = {
      timestamp: Date.now(),
      sender: chatRoomState.sender,
      message: msg || message,
      type: msg ? "image" : "text",
    };
    const encrypted = await encryptMessage(
      JSON.stringify(chatMessage),
      chatRoomState.symKey
    );
    client.publish({
      destination: "/app/" + chatRoomState.id,
      body: JSON.stringify({
        chatRoomId: chatRoomState.id,
        timestamp: chatMessage.timestamp,
        content: encrypted,
      }),
    });
    setMessage("");
  };
  const isSending = useRef(false);

  const onImageSet: ChangeEventHandler<HTMLInputElement> = async (e) => {
    if (e.target && e.target.files) {
      const file = e.target.files[0];
      const fileReader = new FileReader();
      fileReader.onload = async (fre) => {
        if (isSending.current === null) return;
        if (isSending.current === true) return;
        isSending.current = true;
        if (chatRoomState.symKey === null) return;
        if (!fre.target) return;
        if (!fre.target.result) return;
        if (fre.target.result instanceof ArrayBuffer) return;
        console.log(fre.target.result.length);
        const imageDataUrlEncrypted = await encryptMessage(
          fre.target.result,
          chatRoomState.symKey
        );
        const formData = new FormData();
        formData.append(
          "image",
          new Blob([imageDataUrlEncrypted], { type: "text/plain" })
        );
        const res = await fetch(`/api/image/${chatRoomState.id}`, {
          method: "POST",
          body: formData,
        });
        if (res.status === 200) {
          const imageId = await res.text();
          sendMessage(imageId);
        } else {
          alert("이미지 전송에 실패했습니다. 다시 시도해 주세요.");
        }
        setTimeout(() => {
          isSending.current = false;
        }, 500);
      };
      fileReader.readAsDataURL(file);
    }
  };

  if (enabled) {
    return (
      <div className="w-full fixed bottom-0 left-0 p-4 lg:p-0 bg-green-1 lg:relative">
        <div className="w-full lg:w-[600px] flex justify-between items-center">
          <input
            type="text"
            value={message}
            onChange={(e) => {
              if (e.target.value.length > MESSAGE_MAX_LENGTH) {
                alert(
                  `메세지는 최대 ${MESSAGE_MAX_LENGTH}자까지 전송 가능합니다.`
                );
                return;
              }
              setMessage(e.target.value);
            }}
            onKeyDown={(e) => {
              if (!isSending.current && e.key === "Enter") {
                isSending.current = true;
                sendMessage();
                setTimeout(() => {
                  isSending.current = false;
                }, 200);
              }
            }}
            className="w-full h-12 rounded-full bg-gray-3 text-gray1 flex justify-center items-center p-4 focus:outline-none"
          />
          <label htmlFor={"image-input"} className="ml-2">
            <div className="bg-green-2 w-12 h-12 rounded-full text-white p-2 flex justify-center items-center hover:cursor-pointer">
              <FontAwesomeIcon icon={faImage} size={"xl"} />
              <input
                id={"image-input"}
                type="file"
                accept="image/*"
                hidden
                onChange={onImageSet}
              />
            </div>
          </label>
          <div
            onClick={() => sendMessage()}
            className="bg-green-2 ml-2 w-12 h-12 rounded-full text-white p-2 flex justify-center items-center hover:cursor-pointer"
          >
            <FontAwesomeIcon icon={faPaperPlane} size={"xl"} />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="w-full lg:w-[600px] bg-green-1 p-4 lg:p-0 fixed bottom-0 left-0 lg:relative">
      <div className="w-full rounded-xl bg-red-1 text-red-3 flex justify-center items-center p-4">
        <FontAwesomeIcon icon={faLock} size={"xl"} />
      </div>
    </div>
  );
}
