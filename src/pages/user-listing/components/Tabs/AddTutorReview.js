import React from "react";

const AddTutorReview = () => {
  return (
    <div>
      <div className="tu-tabswrapper">
        <div className="tu-boxtitle">
          <h4>Add your review</h4>
        </div>
        <form className="tu-themeform" id="tu-reviews-form">
          <fieldset>
            <div className="tu-themeform__wrap">
              <div className="form-group-wrap">
                <div className="form-group">
                  <div className="tu-reviews">
                    <label className="tu-label">
                      Give rating to your review
                    </label>
                    <div className="tu-my-ratingholder">
                      <h6>Good experience</h6>
                      <div id="tu-addreview" className="tu-addreview"></div>
                    </div>
                  </div>
                </div>
                <div className="form-group tu-message-text">
                  <label className="tu-label">Review details</label>
                  <div className="tu-placeholderholder">
                    <textarea
                      className="form-control tu-textarea"
                      id="tu-reviews-content"
                      name="reviews_content"
                      required=""
                      placeholder="Enter description"
                      maxlength="500"
                    ></textarea>
                    <div className="tu-placeholder">
                      <span>Enter description</span>
                    </div>
                  </div>
                  <div className="tu-input-counter">
                    <span>Characters left:</span>
                    <b className="tu_current_comment">500</b>/{" "}
                    <em className="tu_maximum_comment"> 500</em>
                  </div>
                </div>

                <div className="form-group tu-formspacebtw">
                  <div className="tu-check">
                    <input type="hidden" name="termsconditions" value="" />
                    <input
                      type="checkbox"
                      id="termsconditions"
                      name="termsconditions"
                    />
                    <label for="termsconditions">
                      <span>
                        I have read and agree to all{" "}
                        <a href="javascript:void(0);">Terms &amp; conditions</a>
                      </span>
                    </label>
                  </div>
                  <a
                    href="tutor-detail.html"
                    className="tu-primbtn-lg tu-submit-reviews"
                    data-profile_id=""
                  >
                    <span>Submit</span>
                    <i className="icon icon-chevron-right"></i>
                  </a>
                  <input type="hidden" name="profile_id" value="584" />
                  <input type="hidden" name="user_id" value="691" />
                </div>
              </div>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  );
};

export default AddTutorReview;
