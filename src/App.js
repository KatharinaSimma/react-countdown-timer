/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';
import styled from '@emotion/styled';
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

const ImageDiv = styled.div((props) => ({
  height: '30vh',
  width: '100%',
  background: props.flag,
  transition: 'background-color 2s',
}));

const counterContainer = css`
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  gap: 1.3rem;
  font-size: 2rem;
`;

const counterItem = css`
  display: flex;
  flex-direction: column;
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
      <ImageDiv flag={events[eventId].flag} />
      <div css={containerStyles}>
        <h1>{events[eventId].name}</h1>
        <p>{eventDate.format('MMMM D YYYY')}</p>
        <br />
        {eventDate.isToday() ? (
          <div>It's Today</div>
        ) : (
          <div css={counterContainer}>
            {days ? (
              <div css={counterItem}>
                <span>{days}</span>
                <span>days</span>
              </div>
            ) : null}
            {hours ? (
              <div css={counterItem}>
                <span>{hours}</span>
                <span>hours</span>
              </div>
            ) : null}

            {minutes ? (
              <div css={counterItem}>
                <span>{minutes}</span>
                <span>minutes</span>
              </div>
            ) : null}
            {seconds ? (
              <div css={counterItem}>
                <span>{seconds}</span>
                <span>seconds</span>
              </div>
            ) : null}
          </div>
        )}

        <br />
        <a href={events[eventId].link}>
          <p>More info on Wikipedia</p>
        </a>
        <br />
        <label htmlFor="eventDropdown">Choose an Event: </label>
        <select value={eventId} onChange={handleEventSelect} id="eventDropdown">
          {events.map((ev, index) => {
            return (
              <option value={index} key={'event-id-' + ev.name}>
                {ev.name}
              </option>
            );
          })}
        </select>
        <br />
        <br />
        <label htmlFor="timeZoneDropdown">Choose a time zone: </label>
        <select
          id="timeZoneDropdown"
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
      <ImageDiv flag={events[eventId].flag} />
    </>
  );
}

export default App;
