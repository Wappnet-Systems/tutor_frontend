/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import Select from "react-select";
import { userService } from "../../service/userService";
import makeAnimated from "react-select/animated";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setSubjectsData } from "../../../../redux/actions/action";

// Helper function to map data to nodes
function mapDataToNodes(data, keyName) {
  return data?.map((item) => ({
    value: item[keyName],
    label: item[keyName],
    id: item.id
  }));
}

const SubjectModal = ({
  showModal,
  handleCloseModal,
  setAllSubjectData,
  selectedCategoryId,
  getIdSubjectData,
  setGetIdSubjectData,
  setSelectedCategoryId
}) => {
  const [categoryData, setCategoryData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [subjectData, setSubjectData] = useState([]);
  const [subectIdData, setSubjectIdData] = useState(null);
  const animatedComponents = makeAnimated();
  const dispatch = useDispatch();

  const initialValues = {
    category_id: selectedCategoryId ? selectedCategoryId : null,
    subject_ids: getIdSubjectData
      ? getIdSubjectData?.map((item) => item?.id)
      : null
  };

  let subjectSchema;
  if (selectedCategoryId) {
  } else {
    subjectSchema = Yup.object().shape({
      category_id: Yup.string().required("Category is required"),
      subject_ids: Yup.array()
        .min(1, "Please select at least one subject")
        .required("At least one subject is required")
    });
  }

  const fetchCatgoryData = async () => {
    const allCategoryData = await userService?.getUserCategories();
    setCategoryData(allCategoryData?.data?.data);
  };

  useEffect(() => {
    fetchCatgoryData();
  }, []);

  const fetchSubjectData = async () => {
    if (selectedCategory) {
      const allSubjectData = await userService?.getUserSubjects(
        Number(selectedCategory)
      );
      if (allSubjectData) {
        setSubjectData(allSubjectData?.data?.data);
      }
    } else {
    }
  };

  useEffect(() => {
    fetchSubjectData();
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedCategoryId !== null) {
      userService.getSubjectsById(selectedCategoryId).then((res) => {
        setSubjectIdData(res?.data?.data);
        setSelectedCategory(selectedCategoryId);
      });
    }
  }, [selectedCategoryId]);

  const formik = useFormik({
    initialValues,
    validationSchema: subjectSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      values.category_id =
        Number(values.category_id) || Number(selectedCategoryId);
      values.subject_ids = values.subject_ids.join(",");
      try {
        const res = await userService.addSubjects(values);
        toast.success(res?.data?.message[0]);
        const allSubjectRes = await userService.getSubjects();
        setAllSubjectData(allSubjectRes?.data?.data);
        dispatch(setSubjectsData(allSubjectRes?.data?.data));
        setSubmitting(false);
        formik.resetForm();
        setSelectedCategory(null);
        handleCloseModal();
      } catch (error) {
        console.error(error);
        setSubmitting(false);
      }
    }
  });

  const categoryOptions = mapDataToNodes(categoryData, "category_name");
  const subjectOptions = mapDataToNodes(subjectData, "subject_name");
  let data = mapDataToNodes(getIdSubjectData, "subject_name") || [];

  const disable = categoryOptions.filter(
    (item) => item.id === selectedCategoryId
  );

  return (
    <Modal show={showModal} className="mdl">
      <Modal.Header>
        <h5>{selectedCategoryId ? "Edit category" : "Add category"}</h5>
        <a
          onClick={handleCloseModal}
          style={{ cursor: "pointer" }}
          className="tu-close"
        >
          <i className="icon icon-x"></i>
        </a>
      </Modal.Header>
      <Modal.Body>
        <form
          className="tu-themeform"
          onSubmit={formik.handleSubmit}
          noValidate
        >
          <fieldset>
            <div className="tu-themeform__wrap">
              <div className="form-group subjectData">
                <label className="tu-label">
                  Please select what you can teach
                </label>
                <Select
                  name="category"
                  id="selectedCategory"
                  onChange={(selectedCategory) => {
                    formik.setFieldValue("category_id", selectedCategory?.id);
                    setSelectedCategory(selectedCategory?.id);
                  }}
                  options={categoryOptions}
                  value={categoryOptions.find(
                    (option) => option.id === selectedCategoryId
                  )}
                  isDisabled={selectedCategoryId ? disable : ""}
                  placeholder="Select category from list"
                />
                {formik.errors.category_id && formik.touched.category_id && (
                  <div className="tu-error-message">
                    {formik.errors.category_id}
                  </div>
                )}
              </div>
              {selectedCategory ? (
                <div className="form-group">
                  <Select
                    isMulti
                    name="subject_ids"
                    options={subjectOptions}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    placeholder="Select subject from list"
                    components={animatedComponents}
                    value={[
                      ...subjectOptions.filter((option) =>
                        formik.values.subject_ids?.includes(option.id)
                      ),
                      ...data
                    ]}
                    onChange={(selectedOptions) => {
                      setGetIdSubjectData(null);
                      const selectedSubjectIds = selectedOptions.map(
                        (option) => option.id
                      );
                      formik.setFieldValue("subject_ids", selectedSubjectIds);
                    }}
                  />
                  {formik.errors.subject_ids && formik.touched.subject_ids && (
                    <div className="tu-error-message">
                      {formik.errors.subject_ids}
                    </div>
                  )}
                </div>
              ) : (
                ""
              )}
            </div>
            <div className="form-group tu-formbtn">
              <button className="tu-primbtn-lg">Save & update changes</button>
            </div>
          </fieldset>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default SubjectModal;
