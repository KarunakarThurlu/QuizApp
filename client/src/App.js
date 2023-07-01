import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "../src/HomeComponent/Home";
import Login from "../src/LoginComponent/Login";
import Register from "../src/RegisterComponent/Register";
import QuestionsTable from "./SubmitQuestionComponent/QuestionsTable";
import PageNotFoud from "./Utils/Custom404Page";
import AddQuestion from "./SubmitQuestionComponent/AddQuestion";
import PubliRoute from "./Router/PublicRoute"
import PrivateRoute from "./Router/PrivateRoute";
import QuestionsDashBoard from './DashboardComponent/QuestionsDashBoard';
import DashBoard from './DashboardComponent/DashBoard';
import WriteExam from './WriteExamComponent/WriteExam';
import UserState from "./Context/UserContext/UserState";
import QuestionState from "./Context/QuestionsContext/QuestionsState";
import ManageUsers from './ManageUsers/ManageUsers';
import StartExam from './WriteExamComponent/StartExam';
import TopicTable from './TopicComponent/TopicTable';
import TopicState from "./Context/TopicContext/TopicState";
import ExamsTable from './WriteExamComponent/ExamsTable';
import ForgotPassword from "./RegisterComponent/ForgotPassword";

function App() {
  return (
    <BrowserRouter>
      <UserState>
        <QuestionState>
          <TopicState>
            <Routes>
              <Route element={<Login />} path="/" />
              <Route element={<Login />} path="/signin" />
              <Route element={<Register />} path="/signup" />
              <Route element={<ForgotPassword />} path="/forgotpassword" />

              <Route element={< PrivateRoute component={Home} />} path="/home" />
              <Route element={< PrivateRoute component={QuestionsDashBoard} />} path="/questionsdashboard" />
              <Route element={< PrivateRoute component={DashBoard} />} path="/usersdashboard" />
              <Route element={< PrivateRoute component={WriteExam} />} path="/writeexam" />
              <Route element={< PrivateRoute component={QuestionsTable} />} path="/submitquestion" />
              <Route element={< PrivateRoute component={ManageUsers} />} path="/manageusers" />
              <Route element={< PrivateRoute component={AddQuestion} />} path="/addquestion" />
              <Route element={< PrivateRoute component={TopicTable} />} path="/topic" />
              <Route element={< PrivateRoute component={ExamsTable} />} path="/examsdetails" />
              <Route element={< PrivateRoute component={StartExam} />} path="/startexam" />

              {/* <Route element={<PageNotFoud />} /> */}
            </Routes>
          </TopicState>
        </QuestionState>
      </UserState>
      <ToastContainer
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        transition={Slide}
        style={{
          fontFamily: "Poppins, sans-serif",
          fontSize: "14px",
          fontWeight: "bold",
          color: "white",
        }}
      />
    </BrowserRouter>
  );
}
export default App;
