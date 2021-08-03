import React from 'react';
import { Button, Modal } from 'react-bootstrap';

class StudentAttendanceMarkingPage extends React.Component {

  constructor(props) {
    /* In React we must have to call 'super()' function in our Child Class to execute the Constructor of Parent Class */
    super(props);

    this.state = {
      data: false,
      AttendancePercentage_data: false,
      ShortAttendanceCriteria: false,
      ShortAttendanceStudentsData: [],
      StudentReport: false,
      showHide_StuReport: false,
      showHide_ClassReport: false,
      TotalAbsents: false,
      TotalPresents: false,
      InternetIsConnected: false,
      SelectedDateForUpdatingAtndnc: false
    };


  }

  componentDidMount = () => {

    const apiUrl = 'http://localhost:4000/StudentAttendanceMarkingPage/' + localStorage.getItem('StudentAttendanceMarkingPage_url');

    fetch(apiUrl,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }

      }).then(
        (response) => response.json()
      ).then(
        (data) => {
          // console.log('This is your data ', data)
          data.forEach(e => {
            e.status = 'Present'
          });

          //console.log("Here", data);
          this.setState({
            data: data
          })

        }
      );


    const apiUrl2 = 'http://localhost:4000/GetStudentAttendancePercentage/' + localStorage.getItem('StudentAttendanceMarkingPage_url');

    fetch(apiUrl2,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }

      }).then(
        (response) => response.json()
      ).then(
        (AttendancePercentage_data) => {
          this.setState({
            AttendancePercentage_data: AttendancePercentage_data
          })

        }
      );

    const GETShortAttendanceCriteria = 'http://localhost:4000/GETShortAttendanceCriteria/';

    fetch(GETShortAttendanceCriteria).then((response) => response.json()).then((data) => {

      this.setState({
        ShortAttendanceCriteria: data[0].Criteria
      })

    });

  }

  ChangePresentBtn = (e, index) => {
    let CatchData = this.state.data;
    let item = CatchData[index];

    if (e.currentTarget.value === 'Present') {
      e.currentTarget.style.backgroundColor = "red";
      e.currentTarget.value = "Absent";
      item.status = 'Absent';
    }
    else {
      e.currentTarget.style.backgroundColor = "#063";
      e.currentTarget.value = "Present";
      item.status = 'Present';
    }

    this.updated_Data = CatchData;

  }

  ChangePresentCard = (e, index) => {
    let CatchData = this.state.data;
    let item = CatchData[index];

    // rgb(0, 102, 51) == #063 (Green)
    if (e.currentTarget.style.backgroundColor === "rgb(0, 102, 51)") {
      e.currentTarget.style.backgroundColor = "red";
      item.status = "Absent";
    }
    else {
      e.currentTarget.style.backgroundColor = "rgb(0, 102, 51)";
      item.status = "Present";
    }

    this.updated_Data = CatchData;
    // console.log(this.updated_Data);

  }

  SaveOfflineStoredData = () => {

    fetch('//google.com', {
      mode: 'no-cors',
    })   //If INTERNET is RE-CONNECTED it will Auto Push Attendance Data into the Database
      .then(() => {

        this.setState({
          InternetIsConnected: true
        })
        console.log(this.state.InternetIsConnected);


        fetch('http://localhost:4000/SaveAttendance', this.requestOptions).then(
          (response) => response.json()
        ).then(
          (response_data) => {

            if (response_data.response === "records_inserted") {
              alert("Offline Attendance has been SAVED successfully")
              clearInterval(this.myInterval);
              window.location.reload();
            }
            else if (response_data.response === "records_not_inserted") {
              alert("Offline Attendance has not been SAVED")
              clearInterval(this.myInterval);
              window.location.reload();
            }
            else if (response_data.response === "records_updated") {
              alert("Offline Attendance has been UPDATED successfully")
              clearInterval(this.myInterval);
              window.location.reload();
            }
            else if (response_data.response === "records_not_updated") {
              alert("Offline Attendance has not been UPDATED")
              clearInterval(this.myInterval);
              window.location.reload();
            }

          }
        );


      })
      .catch(() => {

        this.setState({
          InternetIsConnected: false
        })
        console.log(this.state.InternetIsConnected);
        /*  alert("Still Offline")
          */
      });

  }

  // For Saving Attendance when Online
  SaveAttendance = () => {

    /* alert(localStorage.getItem("TeacherID"));
     return; */
    // POST request using fetch with async/await

    if( localStorage.getItem("SelectedDateForUpdatingAtndnc") ){
      // alert("Mojood Hai")
      // localStorage.removeItem("SelectedDateForUpdatingAtndnc");
      this.setState({
        SelectedDateForUpdatingAtndnc: localStorage.getItem("SelectedDateForUpdatingAtndnc")
      });
    }

    this.requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "updated_Data": this.updated_Data,
        "Data_length": this.updated_Data.length,
        "T_id": localStorage.getItem("TeacherID"),
        "SelectedDateForUpdatingAtndnc" : this.state.SelectedDateForUpdatingAtndnc
      })
    };

    fetch('//google.com', {
      mode: 'no-cors',
    })   //If you are Online this Code will Save Attendance Data
      .then(() => {
        this.setState({ InternetIsConnected: true })

        // If we are connected to the Internet we will Save Students Attendance into the Database
        fetch('http://localhost:4000/SaveAttendance', this.requestOptions).then(
          (response) => response.json()
        ).then(
          (response_data) => {

            if (response_data.response === "records_inserted") {
              alert("Attendance has been SAVED successfully")
              window.location.reload();
            }
            else if (response_data.response === "records_not_inserted") {
              alert("Attendance has not been SAVED")
              window.location.reload();
            }
            else if (response_data.response === "records_updated") {
              alert("Attendance has been UPDATED successfully")
              window.location.reload();
            }
            else if (response_data.response === "records_not_updated") {
              alert("Attendance has not been UPDATED")
              window.location.reload();
            }

          }
        );

      })
      .catch(() => {
        this.setState({
          InternetIsConnected: false
        });

        if (this.state.InternetIsConnected === false) {
          alert("You are offline, your data will be automatically saved when you come back online.")
          this.myInterval = setInterval(this.SaveOfflineStoredData, 2000);
        }


      });



  }

  GenerateReport = (Roll_No, Course_Name) => {

    const GenerateReport = 'http://localhost:4000/GenerateReport/' + Roll_No + "/" + Course_Name;

    fetch(GenerateReport).then((response) => response.json()).then((data) => {

      let CountTotalAbsents = 0
      let CountTotalPresents = 0;

      for (let i = 0; i < data.length; i++) {
        if (data[i].Status === "Absent")
          CountTotalAbsents++;
        else
          CountTotalPresents++;
      }

      this.setState({
        StudentReport: data,
        TotalAbsents: CountTotalAbsents,
        TotalPresents: CountTotalPresents
      })

      console.log("TotalPresents:", this.state.TotalPresents)
    });

    this.handleModalShowHide();

  }


  Show_List_View = () => {

    document.getElementById('StudentsImageList').style.display = "none";
    document.getElementById('StudentsGrid').style.display = "none";
    document.getElementById('StudentsList').style.display = "block";

  }


  Show_Grid_View = () => {

    document.getElementById('StudentsList').style.display = "none";
    document.getElementById('StudentsImageList').style.display = "none";
    document.getElementById('StudentsGrid').style.display = "block";

  }


  Show_ImageList_View = () => {

    document.getElementById('StudentsList').style.display = "none";
    document.getElementById('StudentsGrid').style.display = "none";
    document.getElementById('StudentsImageList').style.display = "block";

  }

  SendMail = () => {
  
   
     // POST request using fetch with async/await
     const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "ShortAttendanceStudentsData": this.ShortAttendanceStudentsData
      })
    };

    fetch('http://localhost:4000/SendShortAttendanceMessage' , requestOptions )
    .then((response) => response.json())
    .then((data) => {
      
      alert( data.response ); 

    })
    .catch((error) => {
      alert("Sorry we can't send the Email right now.");
      console.log("This is the error which caused Mail prevention: " , error);
    });

  }

  handleModalShowHide() {
    /* this.setState({ showHide: !this.state.showHide }) */
    this.setState({ showHide_StuReport: !this.state.showHide_StuReport });
  }

  handleModalShowHide_For_ClassGenerateReport() {
    /* this.setState({ showHide: !this.state.showHide }) */
    this.setState({ showHide_ClassReport: !this.state.showHide_ClassReport });
  }

  render() {

    //***************Displaying the API Fetched Data
    if (this.state.data) {
      console.log("State Data is here:", this.state.data);
    }
    const data = this.state.data;
    //Default Value of this.updated_Data
    this.updated_Data = this.state.data;

    const AttendancePercentage_data = this.state.AttendancePercentage_data;
    const ShortAttendanceCriteria = this.state.ShortAttendanceCriteria;
    const StudentReport = this.state.StudentReport;

    // To save the Total % of each student's attendance in a Subject
    var Total_Attendance_Percentage = [];
    // To save the total No of 'Present' classes of a Student
    var count = 0;
    // To save the total No of classes taken for a specific subject
    var Total_Classes = [];
    // To save attendance Dates so that they can be counted uniquely in the program later
    var Save_Attendance_Dates = [];

    // Algo to save all dates on which attendance has been taken
    for (let i = 0; i < AttendancePercentage_data.length; i++) {
      Save_Attendance_Dates.push(AttendancePercentage_data[i].Date);
    }

    // Set() is a biult-in method through which we can save only Distinct Date's in Total_Classes & Hence it will help us in counting the Total number of Classes of a specific subject 
    Total_Classes = [...new Set(Save_Attendance_Dates)];
    // console.log( Total_Classes.length  );


    //This loop will run upto number of Students of a Specific Class
    for (let x = 0; x < data.length; x++) {
      //This loop will run upto Total number of classes of a specific subject
      for (let i = 0; i < AttendancePercentage_data.length; i++) {
        //This 'if' condition selects Distinct Roll_No from each Attendance Record 
        if (data[x].Roll_No === AttendancePercentage_data[i].Roll_No) {

          //This 'if' condition checks either this Distinct Roll_No was 'present' in that Distinct class or not 
          if (AttendancePercentage_data[i].Status === "Present") {
            count++;
          }
        }
      }

      Total_Attendance_Percentage[x] = (count * 100) / Total_Classes.length;
      count = 0;
      // console.log(data[x].Roll_No , " " , Total_Attendance_Percentage[x], "%");
    }

    //***************/Displaying the API Fetched Data
    const ShowStudentsList = () => {

      if (data.length > 0) {
        //Declaring a infinite Array
        let rows = [];
        for (let i = 0; i < data.length; i++) {
          rows.push(
            <tr>
              <td> {data[i].Roll_No} </td>
              <td> {data[i].Name} </td>
              <td>
                <input
                  type="button"
                  className="View_btns"
                  value="Present"
                  onClick={(e) => this.ChangePresentBtn(e, i)}>
                </input>
              </td>
              <td> {
                parseInt(Total_Attendance_Percentage[i]) <= ShortAttendanceCriteria ?
                  <span style={{ color: "red" }}>  {parseInt(Total_Attendance_Percentage[i])}% </span>
                  :
                  <span>  {parseInt(Total_Attendance_Percentage[i])}% </span>
              }
              </td>
              <td>
                <input
                  type="button"
                  className="View_btns"
                  value="View Attendance Record"
                  onClick={(e) => this.GenerateReport(data[i].Roll_No, data[i].Course_Name)}>
                </input>
              </td>
            </tr>
          );
        }
        return rows;
      }
      else {
        return "No Data is available for this Class yet."
      }

    }

    const ShowStudentsImageList = () => {

      if (data.length > 0) {
        //Declaring a infinite Array
        let rows = [];

        for (let i = 0; i < data.length; i++) {
          rows.push(
            <tr>
              <td> {data[i].Roll_No} </td>
              <td>
                <div className="SAMP_Stu_ImgList_Img">
                  <img src={require("../Students_Images/" + data[i].Image)} alt="StudentsImages" width="100%" />
                </div>
              </td>
              <td> {data[i].Name} </td>
              <td>
                <input
                  type="button"
                  className="View_btns"
                  value="Present"
                  onClick={(e) => this.ChangePresentBtn(e, i)}>
                </input>
              </td>
              <td> {
                parseInt(Total_Attendance_Percentage[i]) <= ShortAttendanceCriteria ?
                  <span style={{ color: "red" }}>  {parseInt(Total_Attendance_Percentage[i])}% </span>
                  :
                  <span>  {parseInt(Total_Attendance_Percentage[i])}% </span>
              }
              </td>
              <td>
                <input
                  type="button"
                  className="View_btns"
                  value="View Attendance Record"
                  onClick={(e) => this.GenerateReport(data[i].Roll_No, data[i].Course_Name)}>
                </input>
              </td>
            </tr>
          );
        }
        return rows;
      }
      else {
        return "No Data is available for this Class yet."
      }

    }

    const ShowStudentsGrid = () => {

      if (data.length > 0) {
        //Declaring a infinite Array
        let rows = [];
        for (let i = 0; i < data.length; i++) {
          rows.push(
            <div className="card col-md-4" style={{ backgroundColor: "#063" }} onClick={(e) => this.ChangePresentCard(e, i)}>
              <div className="SAMP_Stu_Grid_Img_Div">
                <img src={require("../Students_Images/" + data[i].Image)} alt="StudentsImages" width="100%" />
              </div>
              <div className="card-body">
                <h4 className="card-title" style={{ color: "white" }}> {data[i].Name}  </h4>
                <p className="card-text" style={{ color: "white" }}> {data[i].Roll_No} </p>
                <p className="card-text" style={{ color: "white" }}> Attendance: {
                  parseInt(Total_Attendance_Percentage[i]) <= ShortAttendanceCriteria ?
                    <span>  {parseInt(Total_Attendance_Percentage[i])}% (Short) </span>
                    :
                    <span>  {parseInt(Total_Attendance_Percentage[i])}% </span>
                }
                </p>

                <input
                  type="button"
                  className="btn btn-light"
                  value="View Attendance Record"
                  onClick={(e) => this.GenerateReport(data[i].Roll_No, data[i].Course_Name)}>
                </input>

              </div>
            </div>
          );
        }
        return rows;
      }
      else {
        return "No Data is available for this Class yet."
      }

    }

    const ShowStudentReport = () => {

      if (StudentReport.length > 0) {
        //Declaring a infinite Array
        let rows = [];
        for (let i = 0; i < StudentReport.length; i++) {
          rows.push(
            <tr>
              <td className="text-center"> {StudentReport[i].Status} </td>
              <td className="text-center" colSpan="2"> {StudentReport[i].Date} </td>
            </tr>
          );
        }
        return rows;
      }
      else {
        return "No Data is available for this Student yet."
      }


    }


    const ShowOnlyShortAttendanceStudents = () => {

      if (data.length > 0) {
        //Declaring a infinite Array
        let rows = [];
        this.ShortAttendanceStudentsData = [];

        for (let i = 0; i < data.length; i++) {
          if (parseInt(Total_Attendance_Percentage[i]) <= ShortAttendanceCriteria) {
            rows.push(
              <tr>
                <td> {data[i].Roll_No} </td>
                <td> {data[i].Name} </td>
                <td>
                  {<span style={{ color: "red" }}>  {parseInt(Total_Attendance_Percentage[i])}% </span>}
                </td>
              </tr>
            );

            this.ShortAttendanceStudentsData.push( data[i] );

          }
        }

        console.log("Data of short attendance students: " , this.ShortAttendanceStudentsData);

        return rows;
      }
      else {
        return "No Data is available for this Class yet.";
      }


    }


    return (

      <div className="container">

        {/* 'View Attendance Record' for Student Modal */}
        <Modal show={this.state.showHide_StuReport}>

          <Modal.Header closeButton onClick={() => this.handleModalShowHide()}>
            <Modal.Title>Student Report</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <table className="table table-hover table-light table_bordered_custom">

              <thead className="thead-dark">
                <tr>
                  <th>
                    Total Classes: {Total_Classes.length}
                  </th>
                  <th>
                    Total Presents: {this.state.TotalPresents}
                  </th>
                  <th>
                    Total Absents: {this.state.TotalAbsents}
                  </th>
                </tr>
                <tr>
                  <th className="text-center">Status</th>
                  <th className="text-center" colSpan="2">Date</th>
                </tr>
              </thead>

              <tbody>
                {ShowStudentReport()}
              </tbody>

            </table>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => this.handleModalShowHide()}>
              Close
            </Button>
          </Modal.Footer>

        </Modal>


        {/* View Attendance Record for Student Modal */}
        <Modal show={this.state.showHide_ClassReport}>

          <Modal.Header closeButton onClick={() => this.handleModalShowHide_For_ClassGenerateReport()}>
            <Modal.Title>Class Report</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <table className="table table-hover table-light table_bordered_custom">

              <thead className="thead-dark">
                <tr>
                  <th className="text-center" colSpan="3">
                    <button className="btn btn-light col-md-12" onClick={() => this.SendMail()}> Send Short Attendance Message </button>
                  </th>
                </tr>
                <tr>
                  <th className="text-center">Arid No</th>
                  <th className="text-center">Name</th>
                  <th className="text-center">Total Attendance</th>
                </tr>
              </thead>

              <tbody>
                {ShowOnlyShortAttendanceStudents()}
              </tbody>

            </table>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => this.handleModalShowHide_For_ClassGenerateReport()}>
              Close
            </Button>
          </Modal.Footer>

        </Modal>

        <div className="SAMP_Top_Grid_Container">

          <div className="SAMP_MainHeading_Div">
            <h1 className="text-dark heading_biit">
              {this.props.match.params.Degree}-{this.props.match.params.Semester}-{this.props.match.params.Shift}
            &nbsp; Student's Attendance
            </h1>
          </div>

          <div className="SAMP_ListGrid_Btns_Div">
            <div className="btn-group">
              <button className="btn btn-dark" onClick={this.Show_List_View}> List </button>
              <button className="btn btn-dark" onClick={this.Show_ImageList_View}> Image List </button>
              <button className="btn btn-dark" onClick={this.Show_Grid_View}> Grid </button>
            </div>
          </div>

        </div>


        <div className="table-responsive" id="StudentsList">
          <table className="table table-hover table-light table_bordered_custom">

            <thead className="thead-dark">
              <tr>
                <th colSpan="4" className="text-center">{this.props.match.params.Course} </th>
                <th className="text-center">
                  <div className="btn-group">
                    <button className="btn btn-light" onClick={this.SaveAttendance}> Save </button>
                    <button className="btn btn-light" onClick={() => this.handleModalShowHide_For_ClassGenerateReport()}> Generate Report </button>
                  </div>
                </th>
              </tr>

              <tr>
                <th>Arid No</th>
                <th>Name</th>
                <th> {this.props.match.params.Day} </th>
                <th>Total Attendance</th>
                <th>Generate Report</th>
              </tr>
            </thead>

            <tbody>
              {ShowStudentsList()}
            </tbody>

          </table>
        </div>


        <div className="table-responsive" id="StudentsImageList" style={{ display: "none" }}>
          <table className="table table-hover table-light table_bordered_custom">

            <thead className="thead-dark">
              <tr>
                <th colSpan="5" className="text-center">{this.props.match.params.Course} </th>
                <th className="text-center">
                  <div className="btn-group">
                    <button className="btn btn-light" onClick={this.SaveAttendance}> Save </button>
                    <button className="btn btn-light" onClick={() => this.handleModalShowHide_For_ClassGenerateReport()}> Generate Report </button>
                  </div>
                </th>
              </tr>

              <tr>
                <th>Arid No</th>
                <th>Image</th>
                <th>Name</th>
                <th> {this.props.match.params.Day} </th>
                <th>Total Attendance</th>
                <th>Generate Report</th>
              </tr>
            </thead>

            <tbody>
              {ShowStudentsImageList()}
            </tbody>

          </table>
        </div>

        <div id="StudentsGrid" style={{ display: "none" }}>



          <table className="table table-hover table-light table_bordered_custom">

            <thead className="thead-dark">
              <tr>
                <th className="text-center">{this.props.match.params.Course} </th>
                <th> {this.props.match.params.Day} </th>
                <th className="text-center">
                  <div className="btn-group">
                    <div class="btn-group">
                      <button className="btn btn-light" onClick={this.SaveAttendance}> Save </button>
                      <button className="btn btn-light" onClick={() => this.handleModalShowHide_For_ClassGenerateReport()}> Generate Report </button>
                    </div>
                  </div>
                </th>
              </tr>
            </thead>

          </table>

          {ShowStudentsGrid()}
        </div>

      </div>

    );

  }

}

export default StudentAttendanceMarkingPage;