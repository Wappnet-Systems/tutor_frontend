import React, { useEffect, useMemo, useState } from "react";
import moment from "moment";

export const CalendarView = ({
  getBookingData,
  id,
  selectedSlots,
  onSelectedSlotsChange,
  selectedDays,
  selectedStartTime,
  selectedEndTime,
  startDate,
  endDate
}) => {
  const [slots, setSlots] = useState([]);
  const [days, setDays] = useState([]);
  const [currentWeek, setCurrentWeek] = useState({ start: null, end: null });
  const [hasClickedNext, setHasClickedNext] = useState(false);

  const daysData = [selectedDays[6], ...selectedDays.slice(0, 6)];
  const selectedStartTimeData = moment(selectedStartTime).format("HH:mm");
  const selectedEndTimeData = moment(selectedEndTime).format("HH:mm");

  const transformedData = getBookingData?.result.map((item) => ({
    ...item,
    slots: item.slots.map((slot) => ({
      id: slot.id,
      from_time: moment(slot.from_time).format("HH:mm"),
      to_time: moment(slot.to_time).format("HH:mm")
    }))
  }));

  const calculateCurrentWeek = () => {
    const currentDate = moment();
    const startDate = currentDate.clone().startOf("week");
    const endDate = currentDate.clone().endOf("week");
    setCurrentWeek({ start: startDate, end: endDate });
  };

  const handleNextWeek = () => {
    setHasClickedNext(true);
    setCurrentWeek((prevWeek) => ({
      start: prevWeek.start.clone().add(1, "week"),
      end: prevWeek.end.clone().add(1, "week")
    }));
  };

  const handlePreviousWeek = () => {
    if (
      !hasClickedNext ||
      currentWeek.start.isSame(moment().startOf("week"), "day")
    ) {
      return;
    }

    setCurrentWeek((prevWeek) => ({
      start: prevWeek.start.clone().subtract(1, "week"),
      end: prevWeek.end.clone().subtract(1, "week")
    }));
  };

  useEffect(() => {
    setSlots(transformedData);
    setDays(daysData);
    calculateCurrentWeek();
  }, [getBookingData]);

  const formattedStart = useMemo(
    () => (currentWeek.start ? currentWeek.start.format("MMM Do") : ""),
    [currentWeek.start]
  );
  const formattedEnd = useMemo(
    () => (currentWeek.end ? currentWeek.end.format("MMM Do") : ""),
    [currentWeek.end]
  );

  const isSelectedSlot = (date, slot) => {
    const selectedSlotIds = selectedSlots.slots;
    return selectedSlotIds.includes(slot);
  };

  const handleSlotClick = (date, slot) => {
    const booking = slots.find((booking) =>
      moment(booking.date).isSame(date, "day")
    );
    if (booking) {
      const clickedSlot = booking.slots.find(
        (bookingSlot) => bookingSlot.from_time === slot
      );
      if (clickedSlot) {
        onSelectedSlotsChange((prevSelectedSlots) => {
          const selectedSlotIds = prevSelectedSlots.slots.slice();
          const slotId = clickedSlot.id;

          const index = selectedSlotIds.indexOf(slotId);
          if (index !== -1) {
            selectedSlotIds.splice(index, 1);
          } else {
            selectedSlotIds.push(slotId);
          }

          return {
            slots: selectedSlotIds,
            tutor_id: id
          };
        });
      }
    }
  };

  const generateDaysForCurrentWeek = () => {
    const days = [];
    if (currentWeek.start) {
      const currentDate = currentWeek.start.clone();
      for (let i = 0; i < 7; i++) {
        days.push(currentDate.format("DD-MM-YY"));
        currentDate.add(1, "day");
      }
    }
    return days;
  };

  const daysForCurrentWeek = generateDaysForCurrentWeek();

  const filteredDaysForCurrentWeek = daysForCurrentWeek.filter(
    (date, index) => {
      const dayOfWeek = moment(date, "DD-MM-YY").format("ddd");
      return days.includes(dayOfWeek);
    }
  );

  const startTime = moment(selectedStartTimeData, "HH:mm");
  const endTime = moment(selectedEndTimeData, "HH:mm");

  const filteredSlots = useMemo(() => {
    if (!startTime.isValid() || !endTime.isValid()) {
      return slots;
    }

    return slots.map((booking) => {
      const filteredBooking = { ...booking };
      filteredBooking.slots = booking.slots.filter((slot) => {
        const slotStartTime = moment(slot.from_time, "HH:mm");
        const slotEndTime = moment(slot.to_time, "HH:mm");

        return (
          (slotStartTime.isSameOrAfter(startTime) &&
            slotStartTime.isSameOrBefore(endTime)) ||
          (slotEndTime.isSameOrAfter(startTime) &&
            slotEndTime.isSameOrBefore(endTime)) ||
          (slotStartTime.isBefore(startTime) && slotEndTime.isAfter(endTime))
        );
      });
      return filteredBooking;
    });
  }, [slots, startTime, endTime]);
  return (
    <>
      <div className="tu-boxwrapper w-100">
        <div className="tu-boxarea">
          <div className="tu-box" style={{ overflow: "hidden" }}>
            <div className="calendar-title">
              <div>
                <i
                  className={`icon icon-arrow-left ${
                    hasClickedNext ? "" : "disabled"
                  }`}
                  onClick={handlePreviousWeek}
                ></i>
              </div>
              <div>
                {formattedStart && `${formattedStart} - ${formattedEnd}`}
              </div>
              <div>
                <i
                  className="icon icon-arrow-right"
                  onClick={handleNextWeek}
                ></i>
              </div>
            </div>
            <div className="calendar" style={{ overflow: "auto" }}>
              <div className="calendar-header Booking-header">
                {filteredDaysForCurrentWeek.map((day, index) => (
                  <div className="p-0" key={day}>
                    {day}
                    <br />
                    {moment(day, "DD-MM-YY").format("ddd")}
                  </div>
                ))}
              </div>
              <div className="calendar-body">
                {daysForCurrentWeek.map((day, dayIndex) => {
                  const dayOfWeek = moment(day, "DD-MM-YY").format("ddd");

                  if (days.includes(dayOfWeek)) {
                    return (
                      <div className="day-column" key={dayIndex}>
                        {filteredSlots.map((booking) => {
                          const bookingDate = moment(booking.date);
                          const dayDate = currentWeek.start
                            .clone()
                            .add(dayIndex, "days");
                          const formattedBookingDate =
                            bookingDate.format("YYYY-MM-DD");

                          if (bookingDate.isSame(dayDate, "day")) {
                            return booking.slots.map((slot, slotIndex) => {
                              return (
                                <div
                                  className={`slotData ${
                                    isSelectedSlot(
                                      formattedBookingDate,
                                      slot.id
                                    )
                                      ? "selected secondary-color"
                                      : ""
                                  }`}
                                  style={{ cursor: "pointer" }}
                                  key={slotIndex}
                                  onClick={() =>
                                    handleSlotClick(
                                      formattedBookingDate,
                                      slot.from_time
                                    )
                                  }
                                >
                                  {slot.from_time}
                                </div>
                              );
                            });
                          }

                          return null;
                        })}
                      </div>
                    );
                  }

                  return null;
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
