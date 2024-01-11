import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Feature from "./Feature";
import { faClock } from "@fortawesome/free-solid-svg-icons";

export default function Max24Hours() {
  return (
    <Feature>
      <div className="flex justify-center items-center flex-2">
        <div className="text-green-3 text-5xl">
          <FontAwesomeIcon icon={faClock} />
        </div>
      </div>
      <div className="text-white font-semibold text-xl flex flex-col justify-center items-center flex-1">
        <div>최대 24시간 유지</div>
        <div className="text-sm mt-2 text-gray-3">
          만료후 모든 대화 내용이 삭제됩니다.
        </div>
      </div>
    </Feature>
  );
}
