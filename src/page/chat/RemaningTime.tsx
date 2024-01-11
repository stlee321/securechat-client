import { useEffect, useState } from "react";

type RemainingTimeProps = {
  expiration: number;
};
type TimeValue = {
  hour: number;
  minute: number;
  second: number;
};
export default function RemainingTime({ expiration }: RemainingTimeProps) {
  const [times, setTimes] = useState<TimeValue>({
    hour: 0,
    minute: 0,
    second: 0,
  });
  useEffect(() => {
    const timer = setInterval(() => {
      let remaining = expiration - Date.now();
      if (remaining <= 0) {
        clearInterval(timer);
        location.reload();
      }
      const _hour = Math.floor(remaining / (60 * 60 * 1000));
      remaining -= _hour * 60 * 60 * 1000;
      const _minute = Math.floor(remaining / (60 * 1000));
      remaining -= _minute * 60 * 1000;
      const _second = Math.floor(remaining / 1000);
      setTimes({
        hour: _hour,
        minute: _minute,
        second: _second,
      });
    }, 300);
    return () => {
      clearInterval(timer);
    };
  });
  return (
    <div>
      <div className="text-white text-xl font-semibold mb-2">
        채팅룸 만료까지 남은 시간
      </div>
      <div className="text-white text-2xl font-bold py-2">
        {times.hour}
        <span className="text-gray-2 ml-2 mr-4">시간</span>
        {times.minute}
        <span className="text-gray-2 ml-2 mr-4">분</span>
        {times.second}
        <span className="text-gray-2 ml-2">초</span>
      </div>
    </div>
  );
}
