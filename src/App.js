
import React from 'react';
import { BrowserRouter as Router, Route, Redirect, NavLink, Link } from 'react-router-dom';

/* Importing AMS Web App Components */
import LoginFormAPI from './AMS_Components/LoginFormAPI';
import TeacherSchedule from './Pages/TeacherSchedule';
import Director from './Pages/Director';
import StudentsList from './Pages/StudentsList';
import StudentView from './Pages/StudentView';
import DirectClassesDetails from './Pages/DirectClassesDetails';
import StudentAttendanceMarkingPage from './Pages/StudentAttendanceMarkingPage';
import StudentsClassForDirector from './Pages/StudentsClassForDirector';
import DirectShortAttndnce_WRT_Course from './Pages/DirectShortAttndnce_WRT_Course';
import TeacherScheduleUpdateAtndnc from './Pages/TeacherScheduleUpdateAtndnc';
/* //Importing AMS Web App Components */

import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/jquery/src/jquery.js';
import '../node_modules/popper.js/dist/popper.js';
import '../node_modules/bootstrap/dist/js/bootstrap.min.js';

//const nav = new NavigationBar();

class App extends React.Component {

  state = {
    LoggedIn: false
  };

  LoginHandler = () => {

    this.setState(
      prevState => ({ LoggedIn: !prevState.LoggedIn })

    )

  }

  render() {
    //console.log(nav);
    return (

      <Router>

        {/* ------------------------Body Div----------------------------- */}
        <div className="App">

          <nav className="navbar navbar-expand-lg navbar-dark bg_biit">
            {/* In React 'a' is used to Link an External Page(Which is outside from our App) with our App */}
            <Link className="navbar-brand" to="/biit">BIIT </Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item active">
                  {/* In React 'Link' is used instead of 'a' to link a different URL with-in our App 
<Link className="nav-link" to={"../Pages/home"}>Home <span className="sr-only">(current)</span></Link>
*/}
                  <NavLink className="nav-link" to="/" exact activeClassName="styleForNavLinks"> Home
<span className="sr-only">(current)</span></NavLink>
                </li>

              </ul>
            </div>

          </nav>

          {/* <NavigationBar></NavigationBar> */}

          {/*  <Route exact strict path="/" render={ ()=>{ return( <LoginForm btn_name="LOGIN"></LoginForm> ); }} />
*/}
          <Route exact strict path="/" render={() => { return (<LoginFormAPI btn_name="LOGIN"></LoginFormAPI>); }} />

          <Route exact strict path="/biit" render={() => {

            if (this.state.LoggedIn === true) {
              return (<h1> Welcome Home Logged in Successfully </h1>);
            }
            else {
              return (<Redirect to="/" />);
            }

          }} >
          </Route>

          <Route exact strict path="/Director/" component={Director}></Route>

          <Route exact strict path="/TeacherSchedule/" component={TeacherSchedule} />

          <Route exact strict path="/TeacherScheduleUpdateAtndnc/" component={TeacherScheduleUpdateAtndnc} />

          <Route exact strict path="/StudentAttendanceMarkingPage/:Degree/:Semester/:Shift/:Course/:Day"
            component={StudentAttendanceMarkingPage} >
          </Route>

          <Route exact strict path="/StudentsList/:className/:Subject"
            component={StudentsList}>
          </Route>

          <Route exact strict path="/StudentView/" component={StudentView}>
          </Route>

          <Route exact strict path="/DirectClassesDetails/:TeacherID"
            component={DirectClassesDetails}>
          </Route>

          <Route exact strict path="/StudentsClassForDirector/:Degree/:Semester/:Shift/:Course" component={StudentsClassForDirector}>
          </Route>

          <Route exact strict path="/DirectShortAttndnce_WRT_Course/" component={DirectShortAttndnce_WRT_Course}>
          </Route>
        </div>
        {/* ------------------------//Body Div----------------------------- */}

      </Router>
    );

  }

}

export default App;

