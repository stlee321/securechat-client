import {
  faCircleNotch,
  faLock,
  faLockOpen,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useState } from "react";

type ChatStatusProps = {
  enabled: boolean;
  checkSymKey: (symKey: string) => Promise<boolean>;
};
export default function ChatStatus({ enabled, checkSymKey }: ChatStatusProps) {
  const [symKey, setSymKey] = useState("");
  const [checking, setChecking] = useState(false);
  const isChecking = useRef(false);
  const _checkSymKey = async () => {
    setChecking(() => true);
    const valid = await checkSymKey(symKey);
    if (!valid) {
      alert("유효한 대칭키가 아닙니다.");
    }
    setSymKey("");
    setChecking(() => false);
  };

  if (enabled) {
    return (
      <div className="p-4 w-72 rounded-2xl bg-green-2 flex justify-center items-center">
        <div>
          <div className="text-green-3 font-bold text-xl">유효한 대칭키</div>
          <div className="text-white font-semibold text-lg">
            대화에 참여할 수 있습니다.
          </div>
        </div>
        <div className="ml-4 w-12 h-12 flex justify-center items-center text-green-3">
          <FontAwesomeIcon icon={faLockOpen} size={"2xl"} />
        </div>
      </div>
    );
  }
  return (
    <div className="p-4 w-72 rounded-2xl bg-red-1">
      <div className="flex justify-between items-start mb-4">
        <div className="text-white text-xl font-bold">
          <span className="text-red-3">대칭키</span>가 필요합니다
        </div>
        <div className="w-12 h-12 flex justify-center items-center text-red-3">
          <FontAwesomeIcon icon={faLock} size={"2xl"} />
        </div>
      </div>
      <div className="mb-2">
        <input
          className="w-full rounded-full px-4 py-2 focus:outline-none"
          type="text"
          value={symKey}
          onChange={(e) => {
            setSymKey(e.target.value);
          }}
          onKeyDown={(e) => {
            if (!isChecking.current && e.key === "Enter") {
              isChecking.current = true;
              _checkSymKey();
              setTimeout(() => {
                isChecking.current = false;
              }, 200);
            }
          }}
        />
      </div>
      <div>
        <div
          onClick={_checkSymKey}
          className="w-full rounded-full p-2 bg-red-3 text-white font-bold flex justify-center items-center hover:cursor-pointer"
        >
          {checking ? (
            <div className="w-6 h-6 animate-spin flex justify-center items-center">
              <FontAwesomeIcon icon={faCircleNotch} size={"lg"} />
            </div>
          ) : (
            "키 확인"
          )}
        </div>
      </div>
    </div>
  );
}
