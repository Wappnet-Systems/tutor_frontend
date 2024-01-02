import React, { useEffect, useState } from "react";
import UserMessageBanner from "../Banner/UserMessageBanner";
import { notificationService } from "../../service/notificationService";
import ReactPaginate from "react-paginate";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const TutorNotification = () => {
  const [allNotification, setAllNotification] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 10;
  const sort = "DESC";

  const navigate = useNavigate();
  const pageCount = Math.max(Math.ceil(totalCount / limit), 1);

  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage?.selected + 1);
    getAllNotificationData(selectedPage?.selected + 1);
  };

  const handleDeleteNotification = (notificationId) => {
    notificationService.deleteNotification(notificationId).then((response) => {
      getAllNotificationData();
    });
  };

  const handleDeleteAllNotifications = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to clear all notifications?",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, clear it!"
    }).then((result) => {
      if (result.isConfirmed) {
        notificationService.deleteAllNotifications().then((response) => {
          toast.success("Notifications Cancelled Successfully");
          getAllNotificationData();
        });
      }
    });
  };

  const handleReadNotification = (notificationId) => {
    notificationService.readNotification(notificationId).then((response) => {
      getAllNotificationData();
    });
  };

  const handleReadAllNotifications = () => {
    notificationService.readAllNotifications().then((response) => {
      getAllNotificationData();
    });
  };

  const getAllNotificationData = () => {
    notificationService
      .getAllNotification(limit, sort, currentPage)
      .then((response) => {
        setAllNotification(response?.data?.data?.data);
        setTotalCount(response?.data?.data?.totalItem);
      });
  };

  useEffect(() => {
    getAllNotificationData(currentPage);

    const interval = setInterval(() => {
      getAllNotificationData(currentPage);
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [currentPage]);

  const formatTimeAgo = (timestamp) => {
    const now = moment();
    const updatedTime = moment(timestamp, "YYYY-MM-DDTHH:mm:ss.SSSZ");
    const diffMinutes = now.diff(updatedTime, "minutes");

    if (diffMinutes === 0) {
      return "Just now";
    } else if (diffMinutes < 60) {
      return `${diffMinutes} min ago`;
    } else if (diffMinutes < 1440) {
      const diffHours = Math.floor(diffMinutes / 60);
      return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;
    } else {
      const diffDays = Math.floor(diffMinutes / 1440);
      return `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`;
    }
  };

  const getDestinationURL = (notificationType) => {
    if (notificationType <= 8) {
      return "/user/bookings";
    } else if (notificationType >= 9 && notificationType <= 10) {
      return "/user/assignment";
    } else if (notificationType >= 13 && notificationType <= 14) {
      return "/user";
    } else if (notificationType == 15) {
      return "/chat";
    } else {
      return "";
    }
  };

  return (
    <>
      <div className="tu-boxwrapper booking-box notification-wrapper">
        <UserMessageBanner />
        <div className="tu-boxarea">
          <div className="tu-boxsm">
            <div className="tu-boxsmtitle">
              <h4>My Nofications</h4>
              <div className="d-flex gap-2">
                <button
                  type="button"
                  title="Read All Notification"
                  className={`btn btn-success fw-bold me-2 px-6 d-flex gap-2 align-item-center p-2`}
                  style={{ background: "#6A307D" }}
                  onClick={handleReadAllNotifications}
                >
                  <i className="fa-regular fa-envelope mt-1"></i>
                  Mark as Read
                </button>
                <button
                  className="btn btn-danger fw-bold me-2 px-6 d-flex gap-2 align-item-center p-2"
                  style={{ background: "#f97316" }}
                  onClick={handleDeleteAllNotifications}
                  title="Delete All Notification"
                >
                  <i className="fa-solid fa-trash-can mt-1"></i>
                  Clear all
                </button>
              </div>
            </div>
          </div>
          <div className="tu-box gap-3 ">
            {allNotification?.length === 0 ? (
              <div className="tu-bookingwrapper" style={{ padding: "66px" }}>
                <div className="tu-freelanceremptylist w-100">
                  <div className="tu-freelanemptytitle">
                    <h4>Oops! No Notifications for this user</h4>
                    <p>
                      We're sorry but there are no Notifications available for
                      this user.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              allNotification?.map((item) => {
                const backgroundColor = item?.is_unread ? "aliceblue" : "white";
                const notificationType = item?.type;

                return (
                  <div
                    className="tu-savedwrapper w-100"
                    style={{
                      padding: "5px 20px",
                      backgroundColor
                    }}
                    key={item?.id}
                  >
                    <div className="tu-savedinfo">
                      <div
                        className="tu-savedtites"
                        onClick={() => {
                          const destinationURL =
                            getDestinationURL(notificationType);
                          if (destinationURL) {
                            navigate(destinationURL);
                          }
                          handleReadNotification(item?.id);
                        }}
                        style={{
                          cursor: getDestinationURL(notificationType)
                            ? "pointer"
                            : "default"
                        }}
                      >
                        <h4>{item?.title}</h4>
                        <p>{item?.description}</p>
                      </div>
                    </div>
                    <div className="tu-savedtites">
                      {formatTimeAgo(moment(item?.updated_at))}
                    </div>
                    <div className="tu-savebtns" style={{ flex: "0 0 10%" }}>
                      {item?.is_unread === true ? (
                        <button
                          className="remove-bookmark-icon"
                          title="Read Notification"
                          onClick={() => handleReadNotification(item?.id)}
                        >
                          <i
                            className="fa-solid fa-envelope-circle-check"
                            style={{
                              color: "#6A307D",
                              lineHeight: "48px",
                              fontSize: "23px"
                            }}
                          ></i>
                        </button>
                      ) : (
                        ""
                      )}

                      <button
                        className="remove-bookmark-icon"
                        title="Delete Notification"
                        onClick={() => handleDeleteNotification(item?.id)}
                      >
                        <i
                          className="fa-solid fa-trash-can fs-4"
                          style={{ color: "#f97316", lineHeight: "48px" }}
                        ></i>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
        {allNotification?.length >= 1 && (
          <nav className="tu-pagination">
            <ReactPaginate
              pageCount={pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageClick}
              containerClassName="pagination"
              activeClassName="active"
              previousLabel={<i className="icon icon-chevron-left"></i>}
              nextLabel={<i className="icon icon-chevron-right"></i>}
            />
          </nav>
        )}
      </div>
    </>
  );
};

export default TutorNotification;
