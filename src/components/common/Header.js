import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import avatarImage from "../../assets/banner/avatar_image.webp";
import { useDispatch, useSelector } from "react-redux";
import { setUserData, setSignupEmail } from "../../redux/actions/action";
import { notificationService } from "../../pages/user/service/notificationService";
import { chatService } from "../../pages/chat/service/chat.service";
import { useWebSocket } from "../../webSocketContext";
import Sitelogo from "../../assets/login/logo_black.png";

const Header = () => {
  const socket = useWebSocket();
  const userData = useSelector((state) => state.userData?.userData);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [notificationCount, setNotificationCount] = useState(null);
  const [unreadMessageCount, setUnreadMessageCount] = useState(null);
  const [isMenuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (userData?.id) {
      getUnreadMessages();
      socket.emit("add-notifier", {
        user_id: userData.id
      });
    }
    socket.on("check-notification", () => {
      getUnreadMessages();
    });
  }, [userData]);

  function responsive() {
    var width = document.body.clientWidth;
    if (width > 1200) {
      const menuItems = document.querySelectorAll(
        ".menu-item-has-children, .sub-menu .menu-item-has-children"
      );
      menuItems.forEach((item) => {
        item.addEventListener("mouseenter", function () {
          this.children[1].style.display = "block";
        });
        item.addEventListener("mouseleave", function () {
          this.children[1].style.display = "none";
        });
      });
    }
  }

  function collapseMenu() {
    const menuItems = document.querySelectorAll(
      ".menu-item-has-children > a, .menu-item-has-children strong"
    );

    menuItems.forEach((item) => {
      item.addEventListener("click", function () {
        const parentLi = this.parentNode;
        parentLi.classList.toggle("tu-open-menu");

        const submenu = this.nextElementSibling;
        if (submenu.style.display === "none" || submenu.style.display === "") {
          submenu.style.display = "block";
        } else {
          submenu.style.display = "none";
        }
      });
    });
  }

  const getUnreadNotification = () => {
    notificationService.getUnreadNotification(userData?.id).then((res) => {
      setNotificationCount(res?.data?.data);
    });
  };

  const getUnreadMessages = () => {
    chatService.getUnreadMessages().then((res) => {
      setUnreadMessageCount(
        parseInt(res?.data?.data == 0 ? null : res?.data?.data)
      );
    });
  };

  useEffect(() => {
    responsive();
    collapseMenu();

    if (userData?.user_type !== undefined) {
      if (notificationCount && notificationCount.is_active === false) {
        logout();
      }
      const interval = setInterval(() => {
        getUnreadNotification();
      }, 5000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [notificationCount]);

  const logout = () => {
    localStorage.clear();
    dispatch(setUserData({}));
    dispatch(setSignupEmail(null));
    navigate("/login");
  };

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <header className="tu-header">
        <nav className="navbar navbar-expand-xl tu-navbar">
          <div className="container-fluid py-3 py-xl-0">
            <Link to="/">
              <img
                src={Sitelogo}
                alt="Site logo"
                style={{ maxWidth: "180px" }}
              />
            </Link>
            <button
              className="tu-menu"
              type="button"
              aria-label="Main Menu"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded={isMenuOpen ? "true" : "false"}
              onClick={toggleMenu}
            >
              <i className="icon icon-menu"></i>
            </button>
            <div
              className={`collapse navbar-collapse tu-themenav ${
                isMenuOpen ? "show" : ""
              }`}
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link" to="/about-us">
                    About us
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/faq">
                    FAQ
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/search-listing">
                    Find A Tutor
                  </Link>
                </li>
              </ul>
              {!userData?.first_name ? (
                <div className="tu-headerbtn">
                  <Link className="nav-link tu-primbtn" to="/login">
                    <span>Get Started</span>
                  </Link>
                </div>
              ) : (
                <ul className="nav-item tu-afterlogin">
                  <li>
                    <Link className="nav-link" to="/chat">
                      <span className="icon icon-message-square">
                        <i className="tu-messagenoti">
                          {unreadMessageCount > 0 && unreadMessageCount}
                        </i>
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link className="nav-link" to="/user/notifications">
                      <span className="icon icon-bell">
                        <i className="tu-messagenoti">
                          {notificationCount &&
                            notificationCount?.unread_count > 0 &&
                            notificationCount?.unread_count}
                        </i>
                      </span>
                    </Link>
                  </li>
                  <li className="menu-item-has-children">
                    <strong>
                      <Link className="nav-link">
                        <img
                          src={userData?.image ? userData?.image : avatarImage}
                          alt="image-description"
                          className="profile-icon"
                        />
                      </Link>
                    </strong>
                    <ul className="sub-menu">
                      <li>
                        <Link to="/user">
                          <i className="icon icon-user"></i>Personal details
                        </Link>
                      </li>
                      <li>
                        <Link to="/user/bookings">
                          <i className="fa-solid fa-address-book"></i>
                          Bookings
                        </Link>
                      </li>
                      {userData?.user_type == 2 && (
                        <>
                          <li>
                            <Link to="/user/transaction-earnings">
                              <i className="fa-solid fa-wallet"></i>Transaction
                              & earnings
                            </Link>
                          </li>
                        </>
                      )}
                      {userData?.user_type !== 2 && (
                        <>
                          <li>
                            <Link to="/user/bookmarks">
                              <i className="icon icon-heart"></i>Bookmarks
                            </Link>
                          </li>
                        </>
                      )}

                      <li>
                        <Link to="/user/change-password">
                          <i className="fa-solid fa-key"></i>Change Password
                        </Link>
                      </li>
                      <li>
                        <a onClick={logout}>
                          <i className="icon icon-log-out"></i>Logout
                        </a>
                      </li>
                    </ul>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Header;
