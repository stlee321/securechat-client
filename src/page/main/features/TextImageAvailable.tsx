import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Feature from "./Feature";
import { faComment, faImages } from "@fortawesome/free-solid-svg-icons";

export default function TextImageAvailable() {
  return (
    <Feature>
      <div className="flex justify-evenly items-center flex-2">
        <div className="text-green-3 text-3xl">
          <FontAwesomeIcon icon={faComment} />
        </div>
        <div className="text-green-3 text-3xl">
          <FontAwesomeIcon icon={faImages} />
        </div>
      </div>
      <div className="text-white font-semibold text-xl flex flex-col justify-center items-center flex-1">
        <div>텍스트, 이미지 전송 가능</div>
        <div className="text-sm mt-2 text-gray-3">
          텍스트 최대 2000자, 이미지 최대 1GB
        </div>
      </div>
    </Feature>
  );
}
