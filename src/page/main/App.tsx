import { useState } from "react";
import CreateChatButton from "./CreateChatButton";
import E2EE from "./features/E2EE";
import Max24Hours from "./features/Max24Hours";
import TextImageAvailable from "./features/TextImageAvailable";

function App() {
  const [time, setTime] = useState("1");
  return (
    <div className="px-8 pt-8 pb-8 lg:px-64 lg:pt-16 lg:pb-0">
      <div className="text-white text-3xl font-bold mb-8">SECURE CHAT</div>
      <div className="flex justify-start items-center mb-16">
        <div className="text-white text-xl font-semibold pr-6">
          채팅룸 생성하기
        </div>
        <div className="pr-6">
          <select
            className="p-2 rounded-lg"
            value={time}
            onChange={(e) => {
              setTime(e.target.value);
            }}
          >
            {[...Array(24).keys()].map((n) => {
              return (
                <option key={n} value={(n + 1).toString()}>
                  {n + 1}
                </option>
              );
            })}
          </select>
          <span className="text-white font-semibold pl-2">시간</span>
        </div>
        <CreateChatButton duration={parseInt(time)} />
      </div>
      <div className="text-white text-2xl font-semibold mb-4">Features</div>
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 lg:gap-0">
        <E2EE />
        <Max24Hours />
        <TextImageAvailable />
      </div>
    </div>
  );
}

export default App;
