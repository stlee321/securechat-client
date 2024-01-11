import { useEffect, useRef, useState } from "react";
import { decryptMessage } from "../../utils/secUtils";
import { ChatMessage } from "../../types/chat";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { useChatRoom } from "../../state/chatRoomState";

type ChatBoxProps = {
  content: string;
  symKey: CryptoKey | null;
  enabled: boolean;
};
export default function ChatBox({ content, symKey, enabled }: ChatBoxProps) {
  const chatRoomState = useChatRoom();
  const [message, setMessage] = useState<ChatMessage>({
    timestamp: 0,
    sender: "",
    message: content,
    type: "text",
  });
  const [decrypted, setDecrypted] = useState(false);
  const [imgPrepared, setImgPrepared] = useState(false);
  const [imageDataUrl, setImageDataUrl] = useState("");
  const date = new Date(message.timestamp);
  const imageElem = useRef<HTMLImageElement | null>(null);
  useEffect(() => {
    if (enabled && symKey) {
      const _decryptMessage = async () => {
        const decrypted = await decryptMessage(content, symKey);
        const chatMessage = JSON.parse(decrypted) as ChatMessage;
        if (chatMessage.type === "image") {
          setImgPrepared(true);
          const res = await fetch(
            `/api/image/${chatRoomState.id}/${chatMessage.message}`
          )
            .then((res) => res.text())
            .then((url) => {
              return fetch(url);
            });
          if (res.status === 200) {
            const _imageDataUrl = await res.text();
            const _imageDataUrlDecrypted = await decryptMessage(
              _imageDataUrl,
              symKey
            );
            setImageDataUrl(_imageDataUrlDecrypted);
          } else {
            console.log("getting image failed");
          }
        }
        setMessage(chatMessage);
      };
      _decryptMessage().then(() => setDecrypted(true));
    }
  }, [content, symKey, enabled, chatRoomState]);
  useEffect(() => {
    if (imageDataUrl === "") return;
    if (imageElem.current) {
      imageElem.current.src = imageDataUrl;
    } else {
      console.log("image ref is null");
    }
    setImageDataUrl("");
  }, [imageDataUrl, imgPrepared]);
  if (enabled) {
    return (
      <div className="break-words whitespace-normal w-full lg:w-[600px] bg-green-4 text-gray-1 rounded-xl p-4 my-2">
        {decrypted ? (
          <>
            <div>
              <span className="text-gray-1 font-bold">{message.sender}</span>
              <span className="text-sm text-gray-2 font-semibold ml-2">
                {`${date.getFullYear()}-${
                  date.getMonth() + 1
                }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`}
              </span>
            </div>
            {imgPrepared ? (
              <div>
                <img
                  ref={imageElem}
                  alt={"이미지"}
                  className="lg:max-w-[300px]"
                />
              </div>
            ) : (
              <div>{message.message}</div>
            )}
          </>
        ) : (
          <div className="w-full flex justify-center items-center">
            <div className="w-12 h-12 animate-spin flex justify-center items-center text-white">
              <FontAwesomeIcon icon={faCircleNotch} size={"xl"} />
            </div>
          </div>
        )}
      </div>
    );
  }
  return (
    <div className="break-words w-full lg:w-[600px] bg-red-2 text-gray-1 rounded-xl p-4 my-2 whitespace-normal">
      {message.message}
    </div>
  );
}
