import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Feature from "./Feature";
import {
  faArrowRightArrowLeft,
  faKey,
  faLock,
} from "@fortawesome/free-solid-svg-icons";

export default function E2EE() {
  return (
    <Feature>
      <div className="flex-2 flex flex-col justify-center items-center">
        <div className="flex w-full justify-between items-center flex-1 px-12">
          <div className="text-green-3 text-3xl">
            <FontAwesomeIcon icon={faLock} />
          </div>
          <div className=" text-green-1 text-3xl">
            <FontAwesomeIcon icon={faArrowRightArrowLeft} />
          </div>
          <div className="text-green-3 text-3xl">
            <FontAwesomeIcon icon={faLock} />
          </div>
        </div>
        <div className="flex w-full justify-between items-center flex-1 px-12">
          <div className="text-red-2 text-3xl">
            <FontAwesomeIcon icon={faKey} />
          </div>
          <div className="text-red-2 text-3xl">
            <FontAwesomeIcon icon={faKey} />
          </div>
        </div>
      </div>
      <div className="text-white font-semibold text-xl flex flex-col justify-center items-center flex-1">
        <div>종단간 암호화</div>
        <div className="text-sm mt-2 text-gray-3">
          대칭키를 공유하여 암호화 합니다.
        </div>
      </div>
    </Feature>
  );
}
