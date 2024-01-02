import axiosInstance from "../../../AxiosInterceptor";

const BOOKED_STUDENT_URL = "/booking/students";
const ADD_ASSIGNMENT = "/assignment";
const GET_ASSIGNMENT_URL = "/assignment";
const DELETE_ASSIGNMENT_URL = "/assignment";
const UPDATE_ASSIGNMENT_URL = "/assignment";
const ADD_SUBMISSION_URL = "/assignment/submission";
const DELETE_SUBMISSION_URL = "/assignment/submission";
const ASSIGNMENT_COMPLETION_URL = "/assignment/complete";

const getBookedStudent = () => {
  return axiosInstance.get(`${BOOKED_STUDENT_URL}`);
};

const getBookedStudentById = (id) => {
  return axiosInstance.get(`${BOOKED_STUDENT_URL}/${id}`);
};

const addStudentAssignment = (assignment) => {
  return axiosInstance.post(`${ADD_ASSIGNMENT}`, assignment);
};

const getTutorAssignmentData = (limit, sort, page) => {
  const url = `${GET_ASSIGNMENT_URL}?limit=${limit}&sort=${sort}&page=${page}`;
  return axiosInstance.get(url);
};

const assignmentCompletion = (id, data) => {
  return axiosInstance.put(`${ASSIGNMENT_COMPLETION_URL}/${id}`, data);
};

const getAssignmentById = (id) => {
  return axiosInstance.get(`${GET_ASSIGNMENT_URL}/${id}`);
};

const deleteUserAssignment = (id) => {
  return axiosInstance.delete(`${DELETE_ASSIGNMENT_URL}/${id}`);
};
const updateUserAssignment = (id, data) => {
  return axiosInstance.put(`${UPDATE_ASSIGNMENT_URL}/${id}`, data);
};

const addSubmission = (id, data) => {
  return axiosInstance.post(`${ADD_SUBMISSION_URL}/${id}`, data);
};

const deleteSubmissionById = (id) => {
  return axiosInstance.delete(`${DELETE_SUBMISSION_URL}/${id}`);
};

export const assignmentService = {
  getTutorAssignmentData,
  assignmentCompletion,
  getAssignmentById,
  deleteUserAssignment,
  updateUserAssignment,
  addSubmission,
  deleteSubmissionById,
  getBookedStudent,
  getBookedStudentById,
  addStudentAssignment
};
