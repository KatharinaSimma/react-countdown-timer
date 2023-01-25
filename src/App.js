/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';
import dayjs from 'dayjs/esm';
import duration from 'dayjs/plugin/duration';
import isToday from 'dayjs/plugin/isToday';
import relativeTime from 'dayjs/plugin/relativeTime';
import tz from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { useEffect, useState } from 'react';
import events from './events.json';
import timezones from './timezonesTZ.json';

dayjs.extend(relativeTime);
dayjs.extend(duration);
dayjs.extend(isToday);
dayjs.extend(utc);
dayjs.extend(tz);

const containerStyles = css`
  color: #122932;
  width: 76vw;
  text-align: center;
  margin: 3rem auto;
`;

function App() {
  const now = dayjs.utc();
  const [timezone, setTimezone] = useState();
  const [eventId, setEventId] = useState(0);
  const [eventDate, setEventDate] = useState(dayjs(events[0].date));
  const [countdown, setCountdown] = useState(
    dayjs.duration(eventDate.diff(now, 'ms')),
  );

  function handleEventSelect(e) {
    setEventId(e.target.value);
    const newDate = dayjs(events[e.target.value].date);
    setEventDate(newDate);
  }

  useEffect(() => {
    if (!eventDate.isToday()) {
      const durationInterval = setInterval(() => {
        const timeToEventMs = eventDate.diff(now, 'ms');
        setCountdown(dayjs.duration(timeToEventMs));
      }, 1000);
      return () => clearInterval(durationInterval);
    }
  }, [eventDate, now]);

  // format units for render
  const seconds = countdown.format('s');
  const minutes = countdown.format('m');
  const hours = countdown.format('H');
  const days = Math.floor(countdown.asDays());
  return (
    <>
      <div
        style={{
          height: '30vh',
          width: '100%',
          background: events[eventId].flag,
          transition: 'background-color 2s',
        }}
      />
      <div css={containerStyles}>
        <h1>{events[eventId].name}</h1>
        <p>{eventDate.format('MMMM D YYYY')}</p>
        <br />
        {eventDate.isToday() ? (
          <div>It's Today</div>
        ) : (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-center',
              gap: '10px',
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
        <br />
        <select
          value={timezone}
          onChange={(e) => {
            setTimezone(e.currentTarget.value);
            setEventDate(
              dayjs(events[eventId].date).tz(e.currentTarget.value, true),
            );
          }}
        >
          {timezones.map((timeZ) => {
            return (
              <option value={timeZ.value} key={timeZ.value + timeZ.name}>
                {timeZ.name}
              </option>
            );
          })}
        </select>
      </div>
      <div
        style={{
          height: '30vh',
          width: '100%',
          background: events[eventId].flag,
          transition: 'background-color 2s',
        }}
      />
    </>
  );
}

export default App;
