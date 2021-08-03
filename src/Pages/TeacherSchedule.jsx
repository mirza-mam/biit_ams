import React from 'react';
import { Link } from 'react-router-dom';
import DatePicker from 'react-date-picker';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import moment from 'moment';
import addDays from 'date-fns/addDays';
import subDays from 'date-fns/subDays';

class TeacherSchedule extends React.Component {

  constructor(props) {
    /* In React we must have to call 'super()' function in our Child Class to execute the Constructor of Parent Class */
    super(props);

    this.state = {
      data: false,
      dateValue: new Date(),
      From_Date: false,
      To_Date: false
    }

  }

  componentDidMount = () => {

    const apiUrl = 'http://localhost:4000/TeacherSchedule/' + localStorage.getItem('id');
    //alert( localStorage.getItem('id') )
    fetch(apiUrl).then(
      (response) => response.json()
    ).then(
      (data) => {
        this.setState({
          data: data
        })
      }
    );

    const GetLockDate = 'http://localhost:4000/GetLockDate/';

    fetch(GetLockDate).then(
      (response) => response.json()
    ).then(
      (data) => {

        console.log( "Datesssss " , data );
        this.setState({
          From_Date: data[0].From_Date,
          To_Date:  data[0].To_Date
        })
      }
    );

  }

  GotoAttendanceMarkingPage = (e) => {
    // alert(e.target.id);

    localStorage.setItem('StudentAttendanceMarkingPage_url', e.target.id);

    window.location.replace("http://localhost:3000/StudentAttendanceMarkingPage/" + e.target.id);
  }

  //This function would be called when ever User performs OnChange event on DatePicker
  SetDate = (dateValue) => {

    this.setState({ dateValue: dateValue })

  }

  UpdatePrevAtndnc = () => {

    // alert(SelectedDateForUpdatingAtndnc);

    // let d = new Date('2020-09-30');
    // alert( d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() );
    // let CompDate = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();

    // console.log( "State Date: " , moment( this.state.From_Date ).toISOString(true)  );

let SelectedDateForUpdatingAtndnc = this.state.dateValue.getFullYear() + "-" + (this.state.dateValue.getMonth() + 1) + "-" + this.state.dateValue.getDate();

    if (moment(SelectedDateForUpdatingAtndnc).isBetween(this.state.To_Date, this.state.From_Date , 'dates')) {
      alert( "Sorry you are Locked in the Selected Dates please select another Date." );
    }
    else {

      localStorage.setItem( "SelectedDateForUpdatingAtndnc" , SelectedDateForUpdatingAtndnc );
      window.location.replace("http://localhost:3000/TeacherScheduleUpdateAtndnc/");

    }


  }

  render() {

    //***************Displaying the API Fetched Data
    if (this.state.data) {
      console.log("State Data is here:", this.state.data.length);
    }
    const data = this.state.data;
    console.log("const Data is here", data);
    //***************/Displaying the API Fetched Data

    let today = new Date();

    let DateToday = today.getDate();
    let Day = today.getDay();
    let Month = today.getMonth() + 1;
    let Year = today.getFullYear();

    //alert( Month )
    const ShowSchedule = () => {

      if (Day === 1) {
        const monday = [];
        for (var i = 0; i < data.length; i++) {
          if (data[i].Day === 'Monday') {
            monday.push(
              <tbody>
                {data ?
                  <tr>
                    <td> {data[i].Slot} </td>
                    <td> {data[i].Discipline + "-" + data[i].Semester + "-" + data[i].Shift} </td>
                    <td> {data[i].Course} </td>
                    <td key="d"> {data[i].Venue} </td>
                    <td>
                      <button className="View_btns" id={1}>
                        <Link id={data[i].Discipline + "/" + data[i].Semester + "/" + data[i].Shift + "/" + data[i].Course + "/" + data[i].Day} onClick={this.GotoAttendanceMarkingPage} style={{ color: "white" }}> View </Link>
                      </button>
                    </td>
                  </tr>

                  :
                  <tr>
                    <td>Wait For Data...</td>
                  </tr>}
              </tbody>
            );
          }

        }

        return [monday, "Monday"];

      } else if (today.getDay() === 2) {
        const tuesday = [];
        for (i = 0; i < data.length; i++) {
          if (data[i].Day === 'Tuesday') {
            tuesday.push(
              <tbody>
                {data ?
                  <tr>
                    <td> {data[i].Slot} </td>
                    <td> {data[i].Discipline + "-" + data[i].Semester + "-" + data[i].Shift} </td>
                    <td> {data[i].Course} </td>
                    <td> {data[i].Venue} </td>
                    <td>
                      <button className="View_btns" id={1}>
                        <Link id={data[i].Discipline + "/" + data[i].Semester + "/" + data[i].Shift + "/" + data[i].Course + "/" + data[i].Day} onClick={this.GotoAttendanceMarkingPage} style={{ color: "white" }}> View </Link>
                      </button>
                    </td>
                  </tr>

                  :
                  <tr>
                    <td>Wait For Data...</td>
                  </tr>}
              </tbody>
            );
          }

        }
        return [tuesday, "Tuesday"];

      } else if (today.getDay() === 3) {
        const wednesday = [];
        for (i = 0; i < data.length; i++) {
          if (data[i].Day === 'Wednesday') {
            wednesday.push(
              <tbody>
                {data ?
                  <tr>
                    <td> {data[i].Slot} </td>
                    <td> {data[i].Discipline + "-" + data[i].Semester + "-" + data[i].Shift} </td>
                    <td> {data[i].Course} </td>
                    <td> {data[i].Venue} </td>
                    <td>
                      <button className="View_btns" id={1}>
                        <Link id={data[i].Discipline + "/" + data[i].Semester + "/" + data[i].Shift + "/" + data[i].Course + "/" + data[i].Day} onClick={this.GotoAttendanceMarkingPage} style={{ color: "white" }}> View </Link>
                      </button>
                    </td>
                  </tr>

                  :
                  <tr>
                    <td>Wait For Data...</td>
                  </tr>}
              </tbody>
            );
          }

        }
        return [wednesday, "Wednesday"];

      } else if (today.getDay() === 4) {
        const thursday = [];
        for (i = 0; i < data.length; i++) {
          if (data[i].Day === 'Thursday') {
            thursday.push(
              <tbody>
                {data ?
                  <tr>
                    <td> {data[i].Slot} </td>
                    <td> {data[i].Discipline + "-" + data[i].Semester + "-" + data[i].Shift} </td>
                    <td> {data[i].Course} </td>
                    <td> {data[i].Venue} </td>
                    <td>
                      <button className="View_btns" id={1}>
                        <Link id={data[i].Discipline + "/" + data[i].Semester + "/" + data[i].Shift + "/" + data[i].Course + "/" + data[i].Day} onClick={this.GotoAttendanceMarkingPage} style={{ color: "white" }}> View </Link>
                      </button>
                    </td>
                  </tr>

                  :
                  <tr>
                    <td>Wait For Data...</td>
                  </tr>}
              </tbody>
            );
          }

        }
        return [thursday, "Thursday"];

      } else if (today.getDay() === 5) {
        const friday = [];
        for (i = 0; i < data.length; i++) {
          if (data[i].Day === 'Friday') {
            friday.push(
              <tbody>
                {data ?
                  <tr>
                    <td> {data[i].Slot} </td>
                    <td> {data[i].Discipline + "-" + data[i].Semester + "-" + data[i].Shift} </td>
                    <td> {data[i].Course} </td>
                    <td> {data[i].Venue} </td>
                    <td>
                      <button className="View_btns" id={1}>
                        <Link id={data[i].Discipline + "/" + data[i].Semester + "/" + data[i].Shift + "/" + data[i].Course + "/" + data[i].Day} onClick={this.GotoAttendanceMarkingPage} style={{ color: "white" }}> View </Link>
                      </button>
                    </td>
                  </tr>

                  :
                  <tr>
                    <td>Wait For Data...</td>
                  </tr>}
              </tbody>
            );
          }

        }
        return [friday, "Friday"];

      } else {
        return ["There's no Schedule for Today", "Its Week End"];
      }


    }
    //ShowSchedule Arrow Function Ends

    var ShowSchedule_Arr = ShowSchedule();
    const selectionRange = {
      startDate: new Date() - 10,
      endDate: new Date(),
      key: 'selection',
    }
    //console.log( ShowSchedule_Arr[0] );
    return (

      <div className="container">
        {/*   {this.props.match.params.teacherID}   */}
        <h1 className="text-dark heading_biit"> Welcome! {localStorage.getItem('Name')} To Your Classes Schedule </h1>


        <div class="input-group mb-3">
          <DatePicker
            selected={this.state.dateValue}
            onChange={this.SetDate}
            value={this.state.dateValue}
            disabled={false}
          // isValidDate={new Date()}
          /*  minDate={new Date()}
           // maxDate={subDays(new Date(), 10)}
           maxDate={ new Date('9/13/2020')}
           showDisabledMonthNavigation */
          />
          <div class="input-group-append">
            <button class="btn btn-dark" type="button" onClick={() => this.UpdatePrevAtndnc()}>Select</button>
          </div>
        </div>

        <div className="table-responsive">

          {/* Default Table for all Schedules */}
          <table className="table table-hover table-light table_bordered_custom">

            <thead className="thead-dark">
              <tr>  {/* ShowSchedule_Arr[1] will show Current Day */}
                <th colSpan="4" className="text-center"> {ShowSchedule_Arr[1]}  </th>
                <th> {"Date: " + Month + "-" + DateToday + "-" + Year} </th>
              </tr>

              <tr>

                <th>Slot</th>
                <th>Discipline</th>
                <th>Course</th>
                <th>Venue</th>
                <th> </th>
              </tr>

            </thead>

            {/* tbody */}
            {ShowSchedule_Arr[0]}
            {/* tbody */}

          </table>

        </div>

      </div>
    );
  };

}


export default TeacherSchedule;