import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import {
  deleteBookMark,
  getBookmarkedData
} from "../../../user-listing/service/UserListingService";
import avatarImage from "../../../../assets/banner/avatar_image.webp";

const UserBookmarks = () => {
  const [userBookmarkList, setUserBookmarkList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 10;
  const sort = "ASC";
  const pageCount = Math.max(Math.ceil(totalCount / limit), 1);

  const getBookmarkList = () => {
    getBookmarkedData(limit, sort, currentPage).then((response) => {
      setUserBookmarkList(response?.data?.data?.bookmarkDetail?.data);
      setTotalCount(response?.data?.data?.bookmarkDetail?.totalItem);
    });
  };

  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage.selected + 1);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  useEffect(() => {
    getBookmarkList();
  }, [currentPage]);

  const handleDeleteBookmark = (bookmarkId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        deleteBookMark(bookmarkId).then((response) => {
          toast.success(response?.data?.message?.[0]);
          getBookmarkList();
        });
      }
    });
  };

  return (
    <>
      <div className="tu-boxwrapper">
        <div className="tu-boxarea">
          <div className="tu-boxsm">
            <div className="tu-boxsmtitle">
              <h4>My Bookmarks</h4>
            </div>
          </div>
          {userBookmarkList?.length > 0 ? (
            <>
              <div className="tu-box gap-3">
                {userBookmarkList?.map((item) => {
                  return (
                    <>
                      <div className="tu-savedwrapper w-100">
                        <div className="tu-savedinfo">
                          <figure>
                            <img
                              src={item?.tutor?.image || avatarImage}
                              alt={`img ${item?.tutor?.first_name}`}
                            />
                          </figure>
                          <div className="tu-savedtites">
                            <h4>
                              {item?.tutor?.first_name +
                                " " +
                                item?.tutor?.last_name}
                            </h4>
                            <p>{item?.tutor?.tag_line}</p>
                          </div>
                        </div>
                        <div className="tu-savebtns">
                          <button
                            className="remove-bookmark-icon"
                            title="Delete Bookmark"
                            onClick={() => handleDeleteBookmark(item?.id)}
                          >
                            <i
                              className="icon icon-trash-2 tu-deleteclr fs-4"
                              style={{ color: "#FF595A", lineHeight: "48px" }}
                            ></i>
                          </button>
                          <Link
                            className="tu-primbtn-lg"
                            to={`/search-listing-view/${item?.tutor?.id}`}
                            onClick={() => scrollToTop()}
                          >
                            View profile
                          </Link>
                        </div>
                      </div>
                    </>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="text-secondary fw-bold text-center p-3 w-100">
              No Record Found
            </div>
          )}
        </div>
        {userBookmarkList?.length >= 1 && (
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

export default UserBookmarks;
