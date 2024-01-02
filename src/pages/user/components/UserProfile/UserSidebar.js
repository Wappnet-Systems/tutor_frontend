import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import ProfileImg from "../../../../assets/profile/img-01.jpg";
import { userService } from "../../service/userService";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../../../../redux/actions/action";
import { toast } from "react-toastify";

const UserSidebar = () => {
  const userData = useSelector((state) => state.userData?.userData);
  const dispatch = useDispatch();
  const location = useLocation();
  const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file && file.size > MAX_IMAGE_SIZE) {
      toast.error("Image size should not exceed 5MB.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    userService?.updateProfileImage(formData).then((response) => {
      const updatedUserData = { ...userData, image: response?.data?.data };
      dispatch(setUserData(updatedUserData));
    });
  };

  const getUser = () => {
    userService.getUser().then((response) => {
      dispatch(setUserData(response?.data?.user));
    });
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <aside className="tu-asider-holder">
      <div className="tu-asidebox">
        <figure>
          <img
            src={userData?.image ? userData?.image : ProfileImg}
            alt="user avatar"
          />
          <figcaption className="tu-uploadimage">
            <input
              type="file"
              id="dropbox"
              name="dropbox"
              accept=".png, .jpg, .jpeg"
              onChange={handleImageChange}
            />
            <label htmlFor="dropbox">
              <i className="icon icon-camera"></i>
            </label>
          </figcaption>
        </figure>
        <div className="tu-uploadinfo text-center">
          <h6>
            Your photo should not exceed 5MB. Allowed file types: png, jpg,
            jpeg.
          </h6>
          <div className="tu-uploadimgbtn">
            <input
              type="file"
              name="file"
              className="tu-primbtn"
              id="uploadimg"
              accept=".png, .jpg, .jpeg"
              onChange={handleImageChange}
            />
            <label htmlFor="uploadimg" className="tu-primbtn">
              Upload photo
            </label>
          </div>
        </div>
      </div>
      <ul className="tu-side-tabs">
        <li className="nav-item">
          <Link
            to="/user"
            className={`nav-link ${
              location.pathname === "/user" ? "active" : ""
            }`}
          >
            <i className="icon icon-user"></i>
            <span>Personal details</span>
          </Link>
        </li>

        <li className="nav-item">
          <Link
            to="/user/contact-details"
            className={`nav-link ${
              location.pathname === "/user/contact-details" ? "active" : ""
            }`}
          >
            <i className="icon icon-phone"></i>
            <span>Contact details</span>
          </Link>
        </li>
        {userData?.user_type !== 2 && (
          <>
            <li className="nav-item">
              <Link
                to="/user/bookmarks"
                className={`nav-link ${
                  location.pathname === "/user/bookmarks" ? "active" : ""
                }`}
              >
                <i className="icon icon-heart"></i>
                <span>Bookmarks</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/user/bookings"
                className={`nav-link ${
                  location.pathname === "/user/bookings" ? "active" : ""
                }`}
              >
                <i className="fa-solid fa-address-book"></i>
                <span>Bookings</span>
              </Link>
            </li>
          </>
        )}

        {userData?.user_type === 2 && (
          <>
            <li className="nav-item">
              <Link
                to="/user/education"
                className={`nav-link ${
                  location.pathname === "/user/education" ? "active" : ""
                }`}
              >
                <i className="icon icon-book"></i>
                <span>Education</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/user/subjects"
                className={`nav-link ${
                  location.pathname === "/user/subjects" ? "active" : ""
                }`}
              >
                <i className="icon icon-book-open"></i>
                <span>Subjects I can teach</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/user/media"
                className={`nav-link ${
                  location.pathname === "/user/media" ? "active" : ""
                }`}
              >
                <i className="icon icon-image"></i>
                <span>Media gallery</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/user/calendar"
                className={`nav-link ${
                  location.pathname === "/user/calendar" ? "active" : ""
                }`}
              >
                <i className="icon icon-calendar"></i>
                <span>My Calendar</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/user/schedules"
                className={`nav-link ${
                  location.pathname === "/user/schedules" ? "active" : ""
                }`}
              >
                <i className="fa-regular fa-clock"></i>
                <span>My Schedule</span>
              </Link>
            </li>

            <li className="nav-item">
              <Link
                to="/user/bookings"
                className={`nav-link ${
                  location.pathname === "/user/bookings" ? "active" : ""
                }`}
              >
                <i className="fa-solid fa-address-book"></i>
                <span>Bookings</span>
              </Link>
            </li>

            <li className="nav-item">
              <Link
                to="/user/transaction-earnings"
                className={`nav-link ${
                  location.pathname === "/user/transaction-earnings"
                    ? "active"
                    : ""
                }`}
              >
                <i className="fa-solid fa-wallet"></i>
                <span>Transaction & earnings</span>
              </Link>
            </li>
          </>
        )}
        <li className="nav-item">
          <Link
            to="/user/assignment"
            className={`nav-link ${
              location.pathname === "/user/assignment" ? "active" : ""
            }`}
          >
            <i className="icon icon-book-open"></i>
            <span>Assignment</span>
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default UserSidebar;
