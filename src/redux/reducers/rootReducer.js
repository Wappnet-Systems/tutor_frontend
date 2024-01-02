import { combineReducers } from "redux";
import {
  SignupReducer,
  UserDataReducer,
  categoryReducer,
  educationReducer,
  mediaReducer,
  subjectReducer
} from "./ signupReducer";

const rootReducer = combineReducers({
  signup: SignupReducer,
  userData: UserDataReducer,
  category: categoryReducer,
  educationData: educationReducer,
  subjectData: subjectReducer,
  mediaData: mediaReducer
});

export default rootReducer;
