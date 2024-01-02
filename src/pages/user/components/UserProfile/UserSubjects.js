/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import UserReviewForSubmit from "../UserProfile/UserReviewForSubmit";
import SubjectModal from "../Modal/SubjectModal";
import { userService } from "../../service/userService";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import UserMessageBanner from "../Banner/UserMessageBanner";
import { useDispatch, useSelector } from "react-redux";
import { setSubjectsData } from "../../../../redux/actions/action";

const UserSubjects = () => {
  let userData = useSelector((state) => state.userData?.userData);
  const [showModal, setShowModal] = useState(false);
  const [allSubjectData, setAllSubjectData] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [getIdSubjectData, setGetIdSubjectData] = useState(null);
  const dispatch = useDispatch();

  const handleCloseModal = () => {
    setSelectedCategoryId(0);
    setGetIdSubjectData(null);
    setShowModal(false);
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCategoryClick = (categoryId, data) => {
    setSelectedCategoryId(categoryId);
    setGetIdSubjectData(data);
    handleShowModal();
  };

  const handleDelete = (deleteId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      // icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        const data = {
          category_id: Number(deleteId),
          subject_ids: ""
        };
        userService.addSubjects(data).then((res) => {
          toast.success("Subject is successfully deleted");
          getSubjects();
        });
      }
    });
  };

  const getSubjects = () => {
    userService.getSubjects().then((subjects) => {
      setAllSubjectData(subjects?.data?.data);
      dispatch(setSubjectsData(subjects?.data?.data));
    });
  };

  useEffect(() => {
    getSubjects();
  }, []);

  return (
    <>
      <div className="tu-boxwrapper">
        <UserMessageBanner />
        <div className="tu-boxarea">
          <div className="tu-boxsm">
            <div className="tu-boxsmtitle">
              <h4>I can teach</h4>
              <a
                onClick={handleShowModal}
                style={{ cursor: "pointer", color: "#1DA1F2" }}
              >
                Add new
              </a>
            </div>
          </div>
          {allSubjectData?.length > 0 &&
            allSubjectData?.map((item) => {
              return (
                <div className="tu-box" key={item?.category_id}>
                  <ul className="tu-icanteach">
                    <li>
                      <div className="tu-tech-title">
                        <h6>{item?.category_name}</h6>
                        <div className="tu-icon-holder">
                          <a
                            data-bs-toggle="modal"
                            data-bs-target="#popup-2"
                            onClick={() =>
                              handleCategoryClick(
                                item?.category_id,
                                item?.subject
                              )
                            }
                            style={{ cursor: "pointer" }}
                          >
                            <i className="icon icon-edit-3 tu-editclr"></i>
                          </a>
                          <a
                            onClick={() => handleDelete(item?.category_id)}
                            style={{ cursor: "pointer" }}
                          >
                            <i className="icon icon-trash-2 tu-deleteclr"></i>
                          </a>
                        </div>
                      </div>
                      <ul className="tu-serviceslist">
                        {item?.subject.map((ele) => {
                          return (
                            <li key={ele?.id}>
                              <a className="">{ele?.subject_name}</a>
                            </li>
                          );
                        })}
                      </ul>
                    </li>
                  </ul>
                </div>
              );
            })}
          {allSubjectData?.length == 0 && (
            <div className="tu-box">
              <h6 className="bold opacity-50">No Subjects</h6>
            </div>
          )}
          <div className="tu-btnarea-two pb-4 pe-4">
            {userData?.user_type === 2 && <UserReviewForSubmit />}
          </div>
        </div>
      </div>

      <SubjectModal
        showModal={showModal}
        handleCloseModal={handleCloseModal}
        setAllSubjectData={setAllSubjectData}
        selectedCategoryId={selectedCategoryId}
        getIdSubjectData={getIdSubjectData}
        setGetIdSubjectData={setGetIdSubjectData}
        setSelectedCategoryId={setSelectedCategoryId}
      />
    </>
  );
};

export default UserSubjects;
