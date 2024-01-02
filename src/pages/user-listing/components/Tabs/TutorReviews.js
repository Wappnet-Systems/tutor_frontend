import React, { useEffect, useState } from "react";
import { getUserReviewData } from "../../service/UserListingService";
import { useParams } from "react-router-dom";
import avatarImage from "../../../../assets/banner/avatar_image.webp";

const TutorReviews = () => {
  const { id } = useParams();
  const [reviewData, setReviewData] = useState([]);
  const [reviewToShow, setReviewToShow] = useState(5);

  const getReviewById = () => {
    getUserReviewData(id, 10, "ASC", 1).then((response) => {
      setReviewData(response?.data?.data?.data);
    });
  };

  useEffect(() => {
    getReviewById();
  }, []);

  const getTimeAgo = (createdAt) => {
    const createdTime = new Date(createdAt);
    const currentTime = new Date();
    const timeDifference = currentTime - createdTime;

    if (timeDifference < 60000) {
      return `${Math.floor(timeDifference / 1000)} sec ago`;
    } else if (timeDifference < 3600000) {
      return `${Math.floor(timeDifference / 60000)} min ago`;
    } else if (timeDifference < 86400000) {
      return `${Math.floor(timeDifference / 3600000)} hour ago`;
    } else if (timeDifference < 2592000000) {
      return `${Math.floor(timeDifference / 86400000)} day ago`;
    } else if (timeDifference < 946080000000) {
      return `${Math.floor(timeDifference / 2592000000)} month ago`;
    } else {
      return createdTime.toLocaleString(); // Fall back to showing the full date and time
    }
  };

  return (
    <>
      <div className="tu-tabswrapper">
        <div className="tu-boxtitle">
          {reviewData?.length > 0 ? (
            <h4>Reviews ({reviewData?.length})</h4>
          ) : (
            <h4>Reviews (0)</h4>
          )}
        </div>

        {reviewData?.length > 0 ? (
          <div className="tu-commentarea">
            {reviewData?.map((review) => {
              return (
                <div className="tu-commentlist">
                  <figure>
                    <img
                      src={review?.student?.image || avatarImage}
                      alt="images"
                    />
                  </figure>
                  <div className="tu-coomentareaauth">
                    <div className="tu-commentright">
                      <div className="tu-commentauthor">
                        <h6>
                          <span>
                            {review?.student?.first_name}
                            &nbsp;
                            {review?.student?.last_name}
                          </span>
                          {/* {getTimeAgo(review?.created_at)}
                           */}
                          {getTimeAgo(review?.created_at)}
                        </h6>
                        <div className="tu-listing-location tu-ratingstars">
                          <span>{review?.rating}.0</span>
                          {/* <span className="tu-stars tu-sm-stars">
                            <span></span>
                          </span> */}
                          <span
                            className={`tu-stars ${
                              review.rating === 4
                                ? "tu-fourstar"
                                : review.rating === 3
                                ? "tu-threestar"
                                : review.rating === 2
                                ? "tu-twostar"
                                : review.rating === 1
                                ? "tu-onestar"
                                : ""
                            } mt-1`}
                          >
                            <span></span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="tu-description">
                      <p>{review?.remarks}</p>
                    </div>
                  </div>
                </div>
              );
            })}

            {reviewData?.length > 5 && (
              <div className="show-more">
                <div className="show-more">
                  {reviewToShow === 5 ? (
                    <button
                      className="tu-readmorebtn tu-show_more"
                      onClick={() => setReviewToShow(reviewData.length)}
                    >
                      Show all
                    </button>
                  ) : (
                    <button
                      className="tu-readmorebtn tu-show_more"
                      onClick={() => setReviewToShow(5)}
                    >
                      Show less
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="tu-freelanceremptylist">
            <div className="tu-freelanemptytitle">
              <h4>Oops! No review for this user</h4>
              <p>
                We're sorry but there are no reviews available for this user.
              </p>
            </div>
          </div>
        )}
      </div>
      {/* <AddTutorReview /> */}
    </>
  );
};

export default TutorReviews;
