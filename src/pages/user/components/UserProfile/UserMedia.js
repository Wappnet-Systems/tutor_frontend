import React, { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import "@splidejs/react-splide/css";
import Swal from "sweetalert2";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import { userService } from "../../service/userService";
import { Modal } from "react-bootstrap";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import UserReviewForSubmit from "./UserReviewForSubmit";
import UserMessageBanner from "../Banner/UserMessageBanner";
import { useDispatch, useSelector } from "react-redux";
import { setMediaData } from "../../../../redux/actions/action";

const UserMedia = () => {
  const dispatch = useDispatch();
  let userData = useSelector((state) => state.userData?.userData);
  const mainSplideRef = useRef(null);
  const thumbnailSplideRef = useRef(null);
  const [mediaItems, setMediaItems] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

  const validationSchema = Yup.object().shape({
    image: Yup.string().required("Image is required")
  });

  const formik = useFormik({
    initialValues: {
      image: ""
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append("image", values.image);

      userService?.addUserMedia(formData).then((response) => {
        toast.success(response?.data?.message?.[0]);
        getUsersMedia();
        setSelectedMedia(null);
        handleClose();
      });
    }
  });

  const handleShow = () => setShow(true);

  const handleClose = () => {
    setShow(false);
    formik.resetForm();
  };

  const getUsersMedia = () => {
    userService.getUserMedia().then((response) => {
      setMediaItems(response?.data?.data);
      dispatch(setMediaData(response?.data?.data));
    });
  };

  useEffect(() => {
    getUsersMedia();
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file && file.size > MAX_IMAGE_SIZE) {
      toast.error("Image size should not exceed 5MB.");
      return;
    }

    formik.setFieldValue("image", file);

    setSelectedMedia({
      type: file.type.includes("image") ? "image" : "video",
      url: URL.createObjectURL(file)
    });
  };

  const handleRemoveSelectedImage = () => {
    if (selectedMedia) {
      URL.revokeObjectURL(selectedMedia.url);
      setSelectedMedia(null);
    }
    formik.setFieldValue("image", null);
  };

  const handleDeleteMedia = (mediaId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        userService?.deleteUserMedia(mediaId).then((response) => {
          toast.success(response?.data?.message?.[0]);
          getUsersMedia();
        });
      }
    });
  };

  return (
    <>
      <div className="tu-boxwrapper tu-media-gallery">
        <UserMessageBanner />
        <div className="tu-boxarea">
          <div className="tu-boxsm">
            <div className="tu-boxsmtitle">
              <h4>Media gallery </h4>
              <a
                className=""
                style={{ cursor: "pointer" }}
                onClick={handleShow}
              >
                Add/Edit
              </a>
            </div>
          </div>

          <div className="tu-box">
            <div className="tu-slider-holder">
              {mediaItems.length > 0 ? (
                <>
                  <div id="tu_splide" className="tu-sync splide">
                    <Splide
                      options={{
                        rewind: true,
                        width: "100%",
                        height: "100%",
                        gap: "1rem",
                        breakpoints: {
                          991: { arrows: false },
                          767: {
                            // perPage: 1
                          }
                        }
                      }}
                      onMoved={(splide) => {
                        thumbnailSplideRef.current.go(splide.index);
                      }}
                      ref={mainSplideRef}
                    >
                      {mediaItems.map((item, index) => (
                        <>
                          <SplideSlide key={index}>
                            <figure className="tu-sync__content tu_splide_item">
                              {item?.media_type === "video" ? (
                                <>
                                  <video
                                    controls
                                    style={{
                                      width: "100%",
                                      maxHeight: "400px"
                                    }}
                                  >
                                    <source
                                      src={item?.media}
                                      type="video/mp4"
                                    />
                                    Your browser does not support the video tag.
                                  </video>
                                </>
                              ) : (
                                <img
                                  src={item?.media}
                                  style={{
                                    maxHeight: "400px"
                                  }}
                                  alt="image"
                                />
                              )}
                            </figure>
                          </SplideSlide>
                        </>
                      ))}
                    </Splide>
                  </div>

                  <div
                    id="tu_splidev2"
                    className={`tu-syncthumbnail splide ${
                      mediaItems.length <= 4 ? "hide-arrows" : ""
                    }`}
                  >
                    <Splide
                      options={{
                        rewind: true,
                        fixedWidth:
                          mediaItems.length === 1
                            ? "100%"
                            : mediaItems.length === 2
                            ? "50%"
                            : mediaItems.length === 3
                            ? "33.33%"
                            : "25%",
                        height: "100%",
                        gap: "0.5rem",
                        isNavigation: true,
                        pagination: false
                      }}
                      onMoved={(splide) => {
                        mainSplideRef.current.go(splide.index);
                      }}
                      ref={thumbnailSplideRef}
                    >
                      {mediaItems.map((item, index) => (
                        <>
                          <SplideSlide key={index}>
                            <figure className="tu-syncthumbnail__content">
                              {item?.media_type === "video" ? (
                                <>
                                  <video
                                    width="100%"
                                    height="100px"
                                    style={{ objectFit: "cover" }}
                                  >
                                    <source
                                      src={item?.media}
                                      type="video/mp4"
                                    />
                                    Your browser does not support the video tag.
                                  </video>
                                  <span className="tu-servicesvideo"></span>
                                </>
                              ) : (
                                <img
                                  src={item?.media}
                                  alt="image"
                                  style={{
                                    height: "100px",
                                    objectFit: "cover"
                                  }}
                                />
                              )}
                            </figure>
                          </SplideSlide>
                        </>
                      ))}
                    </Splide>
                  </div>
                </>
              ) : (
                <h6 className="bold opacity-50">No images</h6>
              )}
            </div>
          </div>
          <div className="tu-btnarea-two  pb-4 pe-4">
            {userData?.user_type === 2 && <UserReviewForSubmit />}
          </div>
        </div>
      </div>

      {/* modal */}
      <Modal show={show} onHide={handleClose} className="mdl">
        <Modal.Header>
          <h5>Add/edit media gallery</h5>
          <a
            onClick={handleClose}
            className="tu-close"
            style={{ cursor: "pointer" }}
          >
            <i className="icon icon-x"></i>
          </a>
        </Modal.Header>
        <Modal.Body>
          <form className="tu-themeform" onSubmit={formik.handleSubmit}>
            <fieldset>
              <div className="tu-themeform__wrap">
                <div className="form-group">
                  <label className="tu-label">Upload gallery</label>
                  <div className="tu-uploadphoto position-relative">
                    {selectedMedia ? (
                      <div className="selected-media ">
                        {selectedMedia.type === "image" ? (
                          <img src={selectedMedia.url} alt="Selected" />
                        ) : (
                          <video controls>
                            <source src={selectedMedia.url} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        )}
                        <button
                          className="handle-remove-btn"
                          title="Remove File"
                          onClick={handleRemoveSelectedImage}
                        >
                          <i className="icon icon-x"></i>
                        </button>
                      </div>
                    ) : (
                      <>
                        <i className="icon icon-grid"></i>
                        <h5>
                          Drag or{" "}
                          <input
                            type="file"
                            id="file3"
                            onChange={handleImageChange}
                          />
                          <label htmlFor="file3">click here</label> to upload
                          photo
                        </h5>
                        <p>Your file size does not exceed 5MB.</p>
                        <svg>
                          <rect width="100%" height="100%"></rect>
                        </svg>
                      </>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <ul
                    id="st_sortableh"
                    className="tu-thumbnails tu-syncthumbnail p-0"
                  >
                    {mediaItems.map((item, index) => (
                      <li key={index}>
                        <div className="tu-thumbnails_content">
                          <figure className="tu-syncthumbnail__content">
                            {item?.media_type === "video" ? (
                              <>
                                <video
                                  width="100px"
                                  height="100px"
                                  style={{ objectFit: "cover" }}
                                >
                                  <source src={item?.media} type="video/mp4" />
                                  Your browser does not support the video tag.
                                </video>
                                <span className="tu-servicesvideo"></span>
                              </>
                            ) : (
                              <img
                                src={item?.media}
                                alt="image"
                                style={{ height: "100px", objectFit: "cover" }}
                              />
                            )}
                          </figure>
                          <div className="tu-thumbnails_action">
                            <span onClick={() => handleDeleteMedia(item?.id)}>
                              <i className="icon icon-trash-2"></i>
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="form-group tu-formbtn">
                  <button
                    type="submit"
                    disabled={!selectedMedia}
                    className="tu-primbtn-lg"
                  >
                    Save & update changes
                  </button>
                </div>
              </div>
            </fieldset>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default UserMedia;
