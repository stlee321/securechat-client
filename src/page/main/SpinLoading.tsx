import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function SpinLoading() {
  return (
    <div>
      <div className="animate-spin text-white w-8 h-8 flex justify-center items-center">
        <FontAwesomeIcon icon={faCircleNotch} />
      </div>
    </div>
  );
}
