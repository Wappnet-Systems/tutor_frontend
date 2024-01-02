import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const StudentCalendar = () => {
  const events = [
    {
      title: "Event 1",
      start: new Date(2023, 8, 15, 10, 0), // Year, Month (0-indexed), Day, Hour, Minute
      end: new Date(2023, 8, 15, 12, 0),
    },
    {
      title: "Event 2",
      start: new Date(2023, 8, 16, 14, 0),
      end: new Date(2023, 8, 16, 16, 0),
    },
    // Add more events as needed
  ];

  return (
    <div>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
      />
    </div>
  );
};

export default StudentCalendar;
