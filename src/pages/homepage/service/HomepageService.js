import api from "../../../AxiosInterceptor";

const HOMEPAGE_EDUCATION_CATEGORY = "/tutor/category";
const HOMEPAGE_RATINGS_LIST = "tutor/top_rated";
const HOMEPAGE_COUNT_LIST = "tutor/counts";

const getHomepageCategoryList = () => {
  return api.get(HOMEPAGE_EDUCATION_CATEGORY);
};

const getHomepageRatingList = () => {
  return api.get(HOMEPAGE_RATINGS_LIST);
};

const getHomepageCountsList = () => {
  return api.get(HOMEPAGE_COUNT_LIST);
};
export {
  getHomepageCategoryList,
  getHomepageRatingList,
  getHomepageCountsList,
};
