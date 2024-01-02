/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useMemo, useState } from "react";
import moment from "moment-timezone";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import { tutorScheduleService } from "../../service/tutorScheduleService";
import AddBookingSchedule from "./Modal/AddBookingSchedule";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const TutorBookingSchedule = () => {
  const [hasClickedNext, setHasClickedNext] = useState(false);
  const [currentWeek, setCurrentWeek] = useState({ start: null, end: null });
  const [allSchedule, setAllSchedule] = useState([]);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [selectedDay, setSelectedDay] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(true);
  };
  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handlePreviousWeek = () => {
    if (
      !hasClickedNext ||
      currentWeek.start.isSame(moment().startOf("week"), "day")
    ) {
      return;
    }

    setCurrentWeek((prevWeek) => ({
      start: prevWeek.start?.clone().subtract(1, "week"),
      end: prevWeek.end?.clone().subtract(1, "week")
    }));
  };

  const calculateCurrentWeek = () => {
    const currentDate = moment();
    const startDate = currentDate?.clone().startOf("week");
    const endDate = currentDate?.clone().endOf("week");

    setFromDate(startDate.toDate());
    setToDate(endDate.toDate());

    setCurrentWeek({ start: startDate, end: endDate });
  };

  useEffect(() => {
    const updateDateRange = () => {
      if (currentWeek.start && currentWeek.end) {
        setFromDate(currentWeek.start.toDate());
        setToDate(currentWeek.end.toDate());
      }
    };

    updateDateRange();
  }, [currentWeek]);

  const handleNextWeek = () => {
    setHasClickedNext(true);
    setCurrentWeek((prevWeek) => ({
      start: prevWeek.start?.clone().add(1, "week"),
      end: prevWeek.end?.clone().add(1, "week")
    }));
  };

  const formattedStart = useMemo(
    () => (currentWeek.start ? currentWeek.start?.format("MMM Do yyyy") : ""),
    [currentWeek.start]
  );
  const formattedEnd = useMemo(
    () => (currentWeek.end ? currentWeek.end?.format("MMM Do yyyy") : ""),
    [currentWeek.end]
  );

  useEffect(() => {
    calculateCurrentWeek();
  }, []);

  const getAllScheduleData = () => {
    if (fromDate && toDate) {
      tutorScheduleService
        .getTutorSchedule(fromDate, toDate)
        .then((response) => {
          const result = response?.data?.data?.scheduleDetail.reduce(
            (result, slot) => {
              const existingEntry = result.find(
                (entry) => entry.date === slot.date
              );

              if (existingEntry) {
                existingEntry.slots.push({
                  id: slot.id,
                  from_time: slot.from_time,
                  to_time: slot.to_time,
                  status: slot.status
                });
              } else {
                result.push({
                  date: slot.date,
                  slots: [
                    {
                      id: slot.id,
                      from_time: slot.from_time,
                      to_time: slot.to_time,
                      status: slot.status
                    }
                  ]
                });
              }

              return result;
            },
            []
          );

          const groupedData = result?.reduce((acc, item) => {
            const date = moment(item?.date).format("dddd");
            acc[date] = item?.slots;
            return acc;
          }, {});

          setAllSchedule(groupedData);
        });
    }
  };

  useEffect(() => {
    getAllScheduleData();
  }, [fromDate, toDate]);

  const isDataAvailable = (day) => {
    return allSchedule[day] && allSchedule[day]?.length > 0;
  };

  const accordionItems = [
    { id: "monday", label: "Monday", dayOfWeek: 1 },
    { id: "tuesday", label: "Tuesday", dayOfWeek: 2 },
    { id: "wednesday", label: "Wednesday", dayOfWeek: 3 },
    { id: "thursday", label: "Thursday", dayOfWeek: 4 },
    { id: "friday", label: "Friday", dayOfWeek: 5 },
    { id: "saturday", label: "Saturday", dayOfWeek: 6 },
    { id: "sunday", label: "Sunday", dayOfWeek: 7 }
  ];

  const handleAccordionItemClick = (dayOfWeek) => {
    setSelectedDay(dayOfWeek);
  };

  const handleDeleteSlot = (slotId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        tutorScheduleService?.deleleTutorSlot(slotId).then((response) => {
          toast.success(response?.data?.message?.[0]);
          getAllScheduleData();
        });
      }
    });
  };

  return (
    <>
      <div className="tu-profilewrapper tutor-schedule">
        <div className="tu-boxwrapper">
          <div className="tu-boxarea">
            <div className="tu-boxsm">
              <div className="tu-boxsmtitle">
                <h4>My Schedule</h4>
              </div>
            </div>
            <div className="tu-box">
              <div className="calendar-title">
                <div>
                  <i
                    className={`icon icon-arrow-left ${
                      hasClickedNext ? "" : "disabled"
                    }`}
                    onClick={handlePreviousWeek}
                  ></i>
                </div>
                <div>{`${formattedStart} - ${formattedEnd}`}</div>
                <div>
                  <i
                    className="icon icon-arrow-right"
                    onClick={handleNextWeek}
                  ></i>
                </div>
              </div>
              <div className="w-100">
                <Accordion>
                  {accordionItems.map((item) => (
                    <Accordion.Item
                      eventKey={item.id}
                      className="mb-4"
                      key={item.id}
                    >
                      <Card>
                        <Accordion.Header variant="link" id={item?.id}>
                          <div className="d-flex justify-content-between me-3 w-100 ">
                            <span
                              className="word-break-format"
                              style={{ flex: "0 0 90%" }}
                            >
                              {item?.label}
                            </span>
                            <div
                              className="tu-icon-holder justify-content-end"
                              style={{ flex: "0 0 10%" }}
                            >
                              <a
                                onClick={() => {
                                  toggleModal();
                                  handleAccordionItemClick(item?.dayOfWeek);
                                }}
                              >
                                <i className="icon icon-edit-3 tu-editclr"></i>
                              </a>
                            </div>
                          </div>
                        </Accordion.Header>
                        <Accordion.Body>
                          <Card.Body>
                            {isDataAvailable(item?.label) ? (
                              <ul className="tu-formarea_list tu-formarea_listvtwo">
                                {allSchedule[item?.label].map((slot) => (
                                  <li
                                    key={slot.id}
                                    className="position-relative"
                                  >
                                    <a
                                      href="javascript:void(0)"
                                      className={`${
                                        slot?.status === 1
                                          ? "myschedule-slot-active"
                                          : "myschedule-slot"
                                      } `}
                                    >
                                      <h6>
                                        {moment(slot.from_time).format("HH:mm")}{" "}
                                        - {moment(slot.to_time).format("HH:mm")}
                                      </h6>
                                      <div className="delete_slot">
                                        <span
                                          onClick={() =>
                                            handleDeleteSlot(slot?.id)
                                          }
                                        >
                                          <i className="icon icon-trash-2"></i>
                                        </span>
                                      </div>
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <div className="tu-bookingwrapper">
                                <div className="tu-freelanceremptylist w-100">
                                  <div className="tu-freelanemptytitle">
                                    <h4>Slots are not available</h4>
                                    <p>
                                      Sorry, there are no slots available for
                                      this day.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Card.Body>
                        </Accordion.Body>
                      </Card>
                    </Accordion.Item>
                  ))}
                </Accordion>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <AddBookingSchedule
          onClose={handleClose}
          show={isModalOpen}
          selectedDay={selectedDay}
          getAllScheduleData={getAllScheduleData}
        />
      )}
    </>
  );
};

export default TutorBookingSchedule;
