import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { CustomToolbar } from "./CustomToolbar";
import { calendarService } from "../../service/calendar.service";
import ShowAllBookings from "./Modal/ShowAllBookings";
import ShowOneBooking from "./Modal/ShowOneBooking";
import UserMessageBanner from "../Banner/UserMessageBanner";
import { BookingStatusType } from "../Bookings/CommonEnum";

const localizer = momentLocalizer(moment);

const formats = {
  timeGutterFormat: "HH:mm",
  agendaTimeRangeFormat: ({ start, end }, culture, localizer) => {
    const startTime = localizer.format(start, "HH:mm", culture);
    const endTime = localizer.format(end, "HH:mm", culture);
    return `${startTime} - ${endTime}`;
  }
};

const TutorCalendar = () => {
  const [show, setShow] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const [currentView, setCurrentView] = useState("month");
  const [currentDate, setCurrentDate] = useState(moment());
  const [calendarData, setCalendarData] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState([]);

  useEffect(() => {
    calendarService.getCalendarData().then((response) => {
      setCalendarData(response?.data?.data?.bookingDetail);
    });
  }, []);

  const events = calendarData
    ?.filter(
      (booking) =>
        booking.status === BookingStatusType?.PAYMENT_COMPLETED ||
        booking.status === BookingStatusType?.ONGOING
    )
    ?.map((booking) => {
      const sortedSlots = booking?.slots.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );

      const eventArray = sortedSlots.map((item) => {
        return {
          title:
            booking?.student?.first_name + " " + booking?.student?.last_name,
          start: new Date(item.from_time),
          end: new Date(item.to_time),
          created_at: new Date(booking?.created_at),
          slot: item,
          image: booking?.student?.image,
          email: booking?.student?.email,
          status: booking?.status,
          studentId: booking?.student?.id,
          bookingId: booking?.id,
          totalAmount: booking?.total_amount,
          bookingUser: booking?.bookingUsers,
          mode: booking?.mode,
          address: booking?.address,
          bookingSubject: booking?.bookingSubjects,
          specialComment: booking?.special_comments,
          review: booking?.reviews,
          rejectionReason: booking?.rejection_reason
        };
      });

      return eventArray;
    })
    .flat(); // Flatten the array of events into a single array

  const viewMapping = {
    month: "month",
    week: "week",
    day: "day",
    agenda: "agenda"
  };

  const handleNextButtonClick = () => {
    if (currentView === "month") {
      const nextMonth = moment(currentDate).add(1, "month");
      setCurrentDate(nextMonth);
    } else if (currentView === "week") {
      const nextWeek = moment(currentDate).add(1, "week");
      setCurrentDate(nextWeek);
    } else if (currentView === "day") {
      const nextDay = moment(currentDate).add(1, "day");
      setCurrentDate(nextDay);
    } else if (currentView === "agenda") {
      const nextAppoinment = moment(currentDate).add(1, "month");
      setCurrentDate(nextAppoinment);
    }
  };
  const handlePervButtonClick = () => {
    if (currentView === "month") {
      const pervMonth = moment(currentDate).add(-1, "month");
      setCurrentDate(pervMonth);
    } else if (currentView === "week") {
      const pervWeek = moment(currentDate).add(-1, "week");
      setCurrentDate(pervWeek);
    } else if (currentView === "day") {
      const pervDay = moment(currentDate).add(-1, "day");
      setCurrentDate(pervDay);
    } else if (currentView === "agenda") {
      const pervAppoinment = moment(currentDate).add(-1, "month");
      setCurrentDate(pervAppoinment);
    }
  };
  const handleTodayButtonClick = () => {
    if (currentView === "month") {
      setCurrentDate(moment());
    } else if (currentView === "week") {
      setCurrentDate(moment());
    } else if (currentView === "day") {
      setCurrentDate(moment());
    } else if (currentView === "agenda") {
      setCurrentDate(moment());
    }
  };
  const handleViewChange = (view) => {
    if (view === "NEXT_MONTH") {
      handleNextButtonClick();
    } else if (view === "PREV") {
      handlePervButtonClick();
    } else if (view === "TODAY") {
      handleTodayButtonClick();
    } else {
      setCurrentView(view);
    }
  };

  const [showEventDetails, setShowEventDetails] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const openMoreEvents = (event) => {
    setSelectedDay(event);
    setShowMore(true);
    setShowEventDetails(false);
  };

  const handleShowMore = (event) => {
    setShow(false);
    setShowAll(true);
    setSelectedDay(event);
    openMoreEvents(event);
  };
  const handleClose = () => {
    setShowMore(false);
  };

  const closeEventDetails = () => {
    setShowEventDetails(false);
  };
  const openEventDetails = (event) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };

  const handleEventClick = (event) => {
    setShowAll(false);
    setShow(true);
    setSelectedEvent(event);
    openEventDetails(event);
  };

  // Add CSS rule to hide elements
  //   const hideElementsStyle = `
  //    .rbc-time-header,
  //    .rbc-overflowing {
  //      display: none !important;
  //    }
  //  `;

  //   // Use a <style> element to apply the CSS rule
  //   const styleElement = document.createElement("style");
  //   styleElement.type = "text/css";
  //   styleElement.appendChild(document.createTextNode(hideElementsStyle));
  //   document.head.appendChild(styleElement);

  return (
    <>
      <div className="tu-boxwrapper user-calendar">
        <UserMessageBanner />
        <div className="tu-boxarea">
          <div className="tu-boxsm ">
            <h4>My Calendar</h4>
          </div>
          <div className="tu-box">
            <Calendar
              components={{
                toolbar: (props) => (
                  <CustomToolbar {...props} onViewChange={handleViewChange} />
                )
              }}
              style={{ height: 1000 }}
              className="text-gray-800 fw-bold"
              view={viewMapping[currentView]}
              date={currentDate.toDate()}
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              onShowMore={handleShowMore}
              onSelectEvent={handleEventClick}
              formats={formats}
            />
          </div>
        </div>
      </div>
      {showMore && (
        <ShowAllBookings
          selectedDay={selectedDay}
          onClose={handleClose}
          showAll={showAll}
          calendarData={calendarData}
          handleEventClick={handleEventClick}
        />
      )}
      {showEventDetails && selectedEvent && (
        <ShowOneBooking
          calendarData={calendarData}
          show={show}
          setShow={setShow}
          handleEventClick={handleEventClick}
          event={selectedEvent}
          onClose={closeEventDetails}
        />
      )}
    </>
  );
};

export default TutorCalendar;
