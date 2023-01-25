import dayjs from 'dayjs/esm';
import duration from 'dayjs/plugin/duration';
import isToday from 'dayjs/plugin/isToday';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useEffect, useState } from 'react';
import events from './events.json';

dayjs.extend(relativeTime);
dayjs.extend(duration);
dayjs.extend(isToday);

function App() {
  const now = dayjs();
  const [eventId, setEventId] = useState(0);
  const [eventDate, setEventDate] = useState(dayjs(events[eventId].date));
  const [countdown, setCountdown] = useState(
    dayjs.duration(eventDate.diff(now, 'ms')),
  );

  useEffect(() => {
    if (!eventDate.isToday()) {
      const durationInterval = setInterval(() => {
        const timeToEventMs = eventDate.diff(now, 'ms');
        setCountdown(dayjs.duration(timeToEventMs));
      }, 1000);

      return () => clearInterval(durationInterval);
    }
  }, [eventDate, now]);

  function handleEventSelect(e) {
    setEventId(e.target.value);
    setEventDate(dayjs(events[e.target.value].date));
  }

  // format units
  const seconds = countdown.format('s');
  const minutes = countdown.format('m');
  const hours = countdown.format('H');
  const days = Math.floor(countdown.asDays());
  return (
    <>
      <div style={{ minHeight: 'calc(100vh - 200px)' }}>
        <h1>Countdown timer</h1>
        <h2>{events[eventId].name}</h2>
        <p>{eventDate.format('MMMM D YYYY')}</p>
        <br />
        {eventDate.isToday() ? (
          <div>It's Today</div>
        ) : (
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
        )}

        <br />
        <div
          style={{
            height: '30vh',
            width: '100vw',
            background: events[eventId].flag,
          }}
        />
        <a href={events[eventId].link}>
          <p>More info on Wikipedia</p>
        </a>
        <br />
        <select value={eventId} onChange={handleEventSelect}>
          {events.map((ev, index) => {
            return (
              <option value={index} key={'event-id-' + ev.name}>
                {ev.name}
              </option>
            );
          })}
        </select>
      </div>
      <footer
        style={{
          height: 'fit-content',
          position: 'sticky',
          left: 0,
          bottom: 0,
        }}
      >
        <img src="/crowd-1295674.svg" alt="crowd of protestors" />
      </footer>
    </>
  );
}

export default App;
