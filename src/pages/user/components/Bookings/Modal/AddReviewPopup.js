import React, { useState } from "react";
import { toast } from "react-toastify";
import { reviewService } from "../../../service/review.service";

const AddReviewPopup = ({ onClose, booking_id }) => {
  const [rating, setRating] = useState(0);
  const [reviewContent, setReviewContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const reviewData = {
      rating: rating,
      remarks: reviewContent,
      booking_id: Number(booking_id),
    };

    // Call the API function to add reviews
    reviewService.addReviews(reviewData).then((response) => {
      toast.success("Your feedback has been submitted successfully");
      handleClose();
    });
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <>
      <div
        className="modal fade  d-block  tuturn-profilepopup review-popup tu-uploadprofile tuturn-popup show"
        tabindex={-1}
        role="dialog"
        id="tuturn-modal-popup"
        // aria-modal="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="tuturn-modalcontent modal-content">
            <div id="tuturn-model-body">
              <div className="modal-header">
                <h5>Complete appointment</h5>
                <a
                  href="javascript:void(0);"
                  className="tu-close "
                  type="button"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={handleClose}
                >
                  <i className="icon icon-x"></i>
                </a>
              </div>
              <div className="modal-body">
                <div className="tu-alertpopup">
                  <span className="bg-lightgreen">
                    <i className="icon icon-bell"></i>
                  </span>
                  <h3>Double check before you do</h3>
                  <p>Are you sure you want to complete appointment?</p>
                  <div className="tu-boxtitle">
                    <h4>Add your review</h4>
                  </div>
                  <form
                    className="tu-themeform"
                    id="tu-reviews-form"
                    onSubmit={handleSubmit}
                  >
                    <fieldset>
                      <div className="tu-themeform__wrap">
                        <div className="form-group-wrap">
                          <div className="form-group">
                            <div className="tu-reviews">
                              <label className="tu-label">
                                Give rating to your review
                              </label>
                              <div className="tu-my-ratingholder">
                                <ul
                                  id="tu_stars"
                                  className="tu-rating-stars tu_stars"
                                >
                                  {[1, 2, 3, 4, 5].map((value) => (
                                    <li
                                      className={`tu-star ${
                                        value <= rating ? "text-warning" : ""
                                      }`}
                                      data-value={value}
                                      key={value}
                                      onClick={() => setRating(value)}
                                    >
                                      <i className="icon icon-star"></i>
                                    </li>
                                  ))}
                                </ul>

                                <input
                                  type="hidden"
                                  id="tu_rating"
                                  name="rating"
                                  value={rating}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="form-group tu-message-text">
                            <label className="tu-label">Description</label>
                            <div className="tu-placeholderholder">
                              <textarea
                                className="form-control tu-textarea"
                                id="tu-reviews-content"
                                name="reviews_content"
                                required=""
                                placeholder="Enter description"
                                maxLength={500}
                                value={reviewContent}
                                onChange={(e) =>
                                  setReviewContent(e.target.value)
                                }
                              ></textarea>
                            </div>
                            {/* <div className="tu-input-counter">
                              <span>Characters left:</span>
                              <b className="tu_current_comment">500</b>/{" "}
                              <em className="tu_maximum_comment"> 500</em>
                            </div> */}
                          </div>
                          <div className="form-group tu-formspacebtw ">
                            {/* <div className="tu-check">
                              <input
                                type="hidden"
                                name="termsconditions"
                                value=""
                              />
                              <input
                                type="checkbox"
                                id="termsconditions"
                                name="termsconditions"
                              />
                              <label for="termsconditions">
                                <span>I have read and agree to all</span>
                                <a href="https://demos.wp-guppy.com/tuturn/privacy-policy/">
                                  Terms &amp; conditions
                                </a>
                              </label>
                            </div> */}
                            <button
                              type="submit"
                              className="tu-primbtn-lg tu-submit-reviews"
                              data-profile_id="305"
                            >
                              <span>Submit</span>
                              <i className="icon icon-chevron-right"></i>
                            </button>

                            <input
                              type="hidden"
                              name="profile_id"
                              value="305"
                            />
                            <input type="hidden" name="user_id" value="6" />
                            <input
                              type="hidden"
                              name="postId"
                              id="booking_order_id"
                              value="874"
                            />
                            <input
                              type="hidden"
                              name="action_type"
                              id="booking_action_type"
                              value="complete"
                            />
                          </div>
                        </div>
                      </div>
                    </fieldset>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export default AddReviewPopup;
