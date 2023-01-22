import dayjs from 'dayjs/esm';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useEffect, useState } from 'react';

dayjs.extend(relativeTime);
dayjs.extend(duration);

function App() {
  const event = dayjs('2023-12-25 00:00');
  const now = dayjs();

  const [countdown, setCountdown] = useState(
    dayjs.duration(event.diff(now, 'ms')),
  );

  useEffect(() => {
    const durationInterval = setInterval(() => {
      const timeToEventMs = event.diff(now, 'ms');
      setCountdown(dayjs.duration(timeToEventMs));
    }, 1000);
    return () => clearInterval(durationInterval);
  }, [event, now]);

  const [nowString, setNowString] = useState(
    dayjs().format('MMMM D YYYY HH:mm:ss'),
  );
  useEffect(() => {
    const intervalId = setInterval(
      () => setNowString(dayjs().format('MMMM D YYYY HH:mm:ss')),
      1000,
    );
    return () => clearInterval(intervalId);
  }, [now]);

  // format units
  const seconds = countdown.format('s');
  const minutes = countdown.format('m');
  const hours = countdown.format('H');
  const days = countdown.asDays().toFixed();
  return (
    <div>
      <h1>Countdown timer</h1>
      <span>Current time: </span>
      <span>{nowString}</span>
      <br />
      <span>Event: </span>
      <span>{event.format('MMMM D YYYY HH:mm:ss')}</span>
      <br />
      <br />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          fontSize: '2rem',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span>{days}</span>
          <span>days</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span>{hours}</span>
          <span>hours</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span>{minutes}</span>
          <span>minutes</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span>{seconds}</span>
          <span>seconds</span>
        </div>
      </div>
    </div>
  );
}

export default App;
