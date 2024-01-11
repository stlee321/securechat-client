import {faCopy} from "@fortawesome/free-regular-svg-icons";
import {faArrowUpRightFromSquare} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useState} from "react";

type ChatRoomInfoProps = {
  id: string;
  symKey: string;
};

export default function ChatRoomInfo({id, symKey}: ChatRoomInfoProps) {
  // const domain = import.meta.env.VITE_DOMAIN as string;
  const domain = window.location.hostname;
  const url = `https://${domain}/chat/${id}`;
  const key = symKey;
  const [keyCopied, setKeyCopied] = useState(false);
  const qrCodeUrl = "/api/qrcode?id=" + id;
  return (
    <div className="w-full bg-green-2 rounded-xl p-8">
      <div className="my-4">
        <div className="text-green-3 text-2xl font-bold mb-2">URL 주소</div>
        <div className="text-gray-3 font-semibold">
          <a href={url} target="_blank" title="채팅룸으로 이동">
            {url}
            <span className="ml-2">
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
            </span>
          </a>
        </div>
      </div>
      <div className="mb-4">
        <div className="text-green-3 text-2xl font-bold mb-2">
          대칭키
          <span className="text-gray-3 text-sm font-semibold ml-2">
            대화에 참여하기 위해 반드시 필요합니다. 복사해 두세요.
          </span>
          {keyCopied ? (
            <span className="text-xs text-red-2 ml-2">복사 되었습니다.</span>
          ) : null}
        </div>
        <div className="lg:w-fit p-4 bg-white text-gray-2 rounded-xl font-bold">
          <span className="break-words">{key}</span>
          <span
            title="대칭키 복사"
            className="text-gray-2 ml-4 hover:cursor-pointer"
            onClick={() => {
              navigator.clipboard.writeText(key);
              setKeyCopied(true);
            }}
          >
            <FontAwesomeIcon icon={faCopy} size={"xl"} />
          </span>
        </div>
      </div>
      <div>
        <div className="text-green-3 text-2xl font-bold mb-2">QR 코드</div>
        <div className="w-fit h-fit p-4 rounded-xl bg-white">
          <img src={qrCodeUrl} />
        </div>
      </div>
    </div>
  );
}
