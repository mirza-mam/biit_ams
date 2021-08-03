import React from 'react';
import { MDBDataTable } from 'mdbreact';
import { Button, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';

class Director extends React.Component {

  constructor(props) {
    /* In React we must have to call 'super()' function in our Child Class to execute the Constructor of Parent Class */
    super(props);

    this.state = {
      data: false,
      ShortAttendanceCriteria: false,
      showHide: false,
      Show_Short_Atndnc_WRT_Teacher_Modal_showHide: false,
      Show_Short_Atndnc_WRT_threshHold_Modal_showHide: false,
      Total_No_Of_Classes: false,
      Total_Classes_Taken_By_Each_Stu: false,
      thresh_HoldModalShowHide: false
    }

  }

  ShowRowsForDataTable = () => {
    let RowsForDataTable = [];

    for (let i = 0; i < this.state.data.length; i++) {

      RowsForDataTable.push(
        {
          name: this.state.data[i].Name,
          View_Btn: <button className="View_btns" id={this.state.data[i].id} onClick={this.ShowShortAttendanceWRT_Teacher} style={{ color: "white" }}>
            View
         </button>
        }
      )
    }

    return RowsForDataTable;
  }

  DatatablePage = () => {
    const data = {
      columns: [
        {
          label: '',
          field: 'name',
          sort: 'asc',
          width: 150
        },
        {
          label: '',
          field: 'View_Btn',
          sort: 'asc',
          width: 270
        }],

      rows: this.ShowRowsForDataTable()
    }

    return data;
  }

  componentDidMount = () => {
    const apiUrl = 'http://localhost:4000/Director/';

    fetch(apiUrl).then(
      (response) => response.json()
    ).then(
      (data) => {
        console.log('This is your data ', data)
        this.setState({
          data: data
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

  ShowShortAttendanceWRT_Teacher = (e) => {
    // alert(e.target.id);

    fetch("http://localhost:4000/ShowShortAttendanceWRT_Teacher/" + e.target.id)
      .then((response) => response.json())
      .then((data) => {


        this.setState({
          Total_No_Of_Classes: data.Total_No_Of_Classes,
          Total_Classes_Taken_By_Each_Stu: data.Total_Classes_Taken_By_Each_Stu,
          Show_Short_Atndnc_WRT_Teacher_Modal_showHide: true
        });


      });

  }

  PopulateShortAttendanceWRT_Teacher_Data = () => {

    /*  console.log("T_Class", this.state.Total_No_Of_Classes);
     console.log("T_Class_By_each_Stu", this.state.Total_Classes_Taken_By_Each_Stu);
  */
    let Total_Subjects = this.state.Total_No_Of_Classes.length;
    let Total_Stu = this.state.Total_Classes_Taken_By_Each_Stu.length;
    let Students_Atndnc_Details = [];

    for (let i = 0; i < Total_Subjects; i++) {

      for (let x = 0; x < Total_Stu; x++) {
        if (
          this.state.Total_No_Of_Classes[i].Course === this.state.Total_Classes_Taken_By_Each_Stu[x].Course &&
          this.state.Total_No_Of_Classes[i].Degree === this.state.Total_Classes_Taken_By_Each_Stu[x].Degree &&
          this.state.Total_No_Of_Classes[i].Semester === this.state.Total_Classes_Taken_By_Each_Stu[x].Semester &&
          this.state.Total_No_Of_Classes[i].Shift === this.state.Total_Classes_Taken_By_Each_Stu[x].Shift
        ) {

          Students_Atndnc_Details.push({
            Course: this.state.Total_Classes_Taken_By_Each_Stu[x].Course,
            Degree: this.state.Total_Classes_Taken_By_Each_Stu[x].Degree,
            Roll_No: this.state.Total_Classes_Taken_By_Each_Stu[x].Roll_No,
            Semester: this.state.Total_Classes_Taken_By_Each_Stu[x].Semester,
            Shift: this.state.Total_Classes_Taken_By_Each_Stu[x].Shift,
            Total_Attendance_Percentage: (this.state.Total_Classes_Taken_By_Each_Stu[x].Total_Classes_Taken_By_Each_Stu * 100) / this.state.Total_No_Of_Classes[i].Total_Classes
          });

        }// 'if' statement ends 


      }//Inner loop ends

    }//Outer loop ends


    let rows = [];
    for (let i = 0; i < Students_Atndnc_Details.length; i++) {
      if (Students_Atndnc_Details[i].Total_Attendance_Percentage < this.state.ShortAttendanceCriteria)
        rows.push(
          <tr>
            <td> {Students_Atndnc_Details[i].Roll_No} </td>
            <td style={{ color: "red" }}> {parseInt(Students_Atndnc_Details[i].Total_Attendance_Percentage)}% </td>
            {/*  <td> {
            parseInt(Total_Attendance_Percentage[i]) <= ShortAttendanceCriteria ?
              <span style={{ color: "red" }}>  {parseInt(Total_Attendance_Percentage[i])}% </span>
              :
              <span>  {parseInt(Total_Attendance_Percentage[i])}% </span>
          }
          </td> */}
          </tr>
        );

    }//for loop ends

    return rows;
  }


  PopulateShortAttendanceWRT_threshHold_and_Class = () => {

    let Total_Subjects = this.state.Total_No_Of_Classes.length;
    let Total_Stu = this.state.Total_Classes_Taken_By_Each_Stu.length;
    let Students_Atndnc_Details = [];

    for (let i = 0; i < Total_Subjects; i++) {

      for (let x = 0; x < Total_Stu; x++) {
        if (
          this.state.Total_No_Of_Classes[i].Course === this.state.Total_Classes_Taken_By_Each_Stu[x].Course &&
          this.state.Total_No_Of_Classes[i].Degree === this.state.Total_Classes_Taken_By_Each_Stu[x].Degree &&
          this.state.Total_No_Of_Classes[i].Semester === this.state.Total_Classes_Taken_By_Each_Stu[x].Semester &&
          this.state.Total_No_Of_Classes[i].Shift === this.state.Total_Classes_Taken_By_Each_Stu[x].Shift
        ) {

          Students_Atndnc_Details.push({
            Course: this.state.Total_Classes_Taken_By_Each_Stu[x].Course,
            Degree: this.state.Total_Classes_Taken_By_Each_Stu[x].Degree,
            Roll_No: this.state.Total_Classes_Taken_By_Each_Stu[x].Roll_No,
            Semester: this.state.Total_Classes_Taken_By_Each_Stu[x].Semester,
            Shift: this.state.Total_Classes_Taken_By_Each_Stu[x].Shift,
            Total_Attendance_Percentage: (this.state.Total_Classes_Taken_By_Each_Stu[x].Total_Classes_Taken_By_Each_Stu * 100) / this.state.Total_No_Of_Classes[i].Total_Classes
          });

        }// 'if' statement ends 


      }//Inner loop ends

    }//Outer loop ends


    let rows = [];
    for (let i = 0; i < Students_Atndnc_Details.length; i++) {
      if (Students_Atndnc_Details[i].Total_Attendance_Percentage < this.state.ShortAttendanceCriteria)
        rows.push(
          <tr>
            <td> {Students_Atndnc_Details[i].Roll_No} </td>
            <td> {Students_Atndnc_Details[i].Degree + "-" + Students_Atndnc_Details[i].Semester + "-" + Students_Atndnc_Details[i].Shift} </td>
            <td style={{ color: "red" }}> {parseInt(Students_Atndnc_Details[i].Total_Attendance_Percentage)}% </td>
          </tr>
        );

    }//for loop ends

    return rows;

  }

  ChangeShortAttendance = async () => {

    let ShortAttendanceCriteria = document.getElementById('ShortAttendanceCriteria').value;

    // POST request using fetch with async/await
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "ShortAttendanceCriteria": ShortAttendanceCriteria
      })
    };
    const response = await fetch('http://localhost:4000/SaveShortAttendanceCriteria', requestOptions);
    const response_data = await response.json();

    if (response_data.response === "criteria_updated") {
      alert("Updated Successfully");

      // Here we are Updating the value of this.State.ShortAttendanceCriteria
      this.setState({
        ShortAttendanceCriteria: ShortAttendanceCriteria
      });
    }
    else
      console.log("No response Yet.");

  }


  LockAll = () => {

    let No_of_days_for_locking = document.getElementById('No_of_days_for_locking').value;

    // To GET the Date upto which this lock will be applied
    let dt = new Date();
    dt.setDate(dt.getDate() - No_of_days_for_locking);
    let To_Date = dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();


    // To GET the Date from which this lock is applied
    dt = new Date();
    let From_Date = dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();

    console.log("From_Date:", From_Date);
    console.log("To_Date:", To_Date);

    // POST request
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "No_of_days_for_locking": No_of_days_for_locking,
        "From_Date": From_Date,
        "To_Date": To_Date
      })
    };

    fetch('http://localhost:4000/SaveLockDays', requestOptions)
      .then((response) => response.json())
      .then((data) => {
        alert(data.response);
      })
      .catch((error) => {
        console.log("This is the error which Caused Lock Days insertion failer:", error);
      });

  }

  GetCustomthreshHoldDetails = () => {

    let SelectedClassForthreshHold = document.getElementById('SelectedClassForthreshHold').value;
    let CustomthreshHold = 0;

    if( document.getElementById('CustomthreshHold').value !== "" )
    {
       CustomthreshHold = document.getElementById('CustomthreshHold').value;
    }
    else{
      CustomthreshHold = 75;
    }
    

    // POST request
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "ShortAttendanceCriteria": CustomthreshHold
      })
    };

    fetch('http://localhost:4000/SaveShortAttendanceCriteria', requestOptions)
      .then((response) => response.json())
      .then((response_data) => {

        if (response_data.response === "criteria_updated") {
          // Here we are Updating the value of this.State.ShortAttendanceCriteria
          this.setState({
            ShortAttendanceCriteria: CustomthreshHold
          });
        }
        else
          console.log("No response Yet.");

      });



    fetch('http://localhost:4000/GetCustomthreshHoldDetails/' + SelectedClassForthreshHold)
      .then((response) => response.json())
      .then((data) => {
       
        if( data )
        {
          this.setState({
            Total_No_Of_Classes: data.Total_No_Of_Classes,
            Total_Classes_Taken_By_Each_Stu: data.Total_Classes_Taken_By_Each_Stu,
          });
        }

      })
      .catch((error) => {
        alert( "No Short Attendance Data Found For This Class." );
      });

  }

  handleModalShowHide() {
    this.setState({ showHide: !this.state.showHide })
  }

  handlethresh_HoldModalShowHide() {
    this.setState({ thresh_HoldModalShowHide: !this.state.thresh_HoldModalShowHide })
  }

  handle_Show_Short_Atndnc_WRT_threshHold_Modal_showHide() {
    this.setState({ Show_Short_Atndnc_WRT_threshHold_Modal_showHide: !this.state.Show_Short_Atndnc_WRT_threshHold_Modal_showHide })
  }

  handle_Show_Short_Atndnc_WRT_Teacher_ModalShowHide() {
    this.setState({ Show_Short_Atndnc_WRT_Teacher_Modal_showHide: !this.state.Show_Short_Atndnc_WRT_Teacher_Modal_showHide })
  }

  //This function would be called when ever User performs OnChange event on DatePicker
  SetDate = (dateValue) => {

    this.setState({ dateValue: dateValue })

  }



  render() {

    // const data = this.state.data;
    const ShortAttendanceCriteria = this.state.ShortAttendanceCriteria;

    /*  const ShowTeachersList = () => {
       // Declaring a Infinite Array
       const rows = [];
       for (var i = 0; i < data.length; i++) {
         rows.push(
           <tbody id="TeachersList_tbody">
             {data ?
               <tr>
                 <td> {data[i].Name} </td>
                 <td>
                   <button className="View_btns" id={data[i].id} onClick={this.GotoTeacherSchedulePage} style={{ color: "white" }}>
                     View
                   </button>
                 </td>
                  <td>
                   <button className="View_btns" type="button" onClick={() => this.handleModalShowHide()}>
                     Lock
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
       return rows;
     }
  */

    return (

      <div className="container">

        {/* Director Settings Modal */}
        <Modal show={this.state.showHide}>

          <Modal.Header closeButton onClick={() => this.handleModalShowHide()}>
            <Modal.Title> Settings </Modal.Title>
          </Modal.Header>

          <Modal.Body>

            <div className="input-group mb-3">
              <input type="number" className="form-control" placeholder="Change Short Attendance Criteria" aria-label="Recipient's username" aria-describedby="Change Short Attendance Criteria" id="ShortAttendanceCriteria" />
              <div className="input-group-append">
                <button className="btn DIR_Pg_Top_Btns" type="button" onClick={this.ChangeShortAttendance}>Chnage</button>
              </div>
            </div>

            <div className="input-group mb-3">
              <input type="number" className="form-control" placeholder="Enter No Of Days" aria-label="No_of_days_for_locking" aria-describedby="No_of_days_for_locking" id="No_of_days_for_locking" />
              <div className="input-group-append">
                <button className="btn DIR_Pg_Top_Btns" type="button" onClick={this.LockAll}>Lock</button>
              </div>
            </div>

          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => this.handleModalShowHide()}>
              Close
            </Button>
          </Modal.Footer>

        </Modal>

        {/* Show_Short_Atndnc_WRT_Teacher Modal */}
        <Modal show={this.state.Show_Short_Atndnc_WRT_Teacher_Modal_showHide}>

          <Modal.Header closeButton onClick={() => this.handle_Show_Short_Atndnc_WRT_Teacher_ModalShowHide()}>
            <Modal.Title> List of Short Attendance Students W.R.T Teacher </Modal.Title>
          </Modal.Header>

          <Modal.Body>

            <div className="table-responsive" id="StudentsList">
              <table className="table table-hover table-light table_bordered_custom">

                <thead className="thead-dark">
                  {/* <tr>
                <th colSpan="4" className="text-center">{this.props.match.params.Course} </th>
                <th className="text-center">
                  <div className="btn-group">
                    <button className="btn btn-light" onClick={this.SaveAttendance}> Save </button>
                    <button className="btn btn-light"  onClick={() => this.handleModalShowHide_For_ClassGenerateReport()}> Generate Report </button>
                  </div>
                </th>
              </tr> */}

                  <tr>
                    <th>Arid No</th>
                    <th>Total Attendance</th>
                  </tr>
                </thead>

                <tbody>
                  {this.PopulateShortAttendanceWRT_Teacher_Data()}
                </tbody>

              </table>
            </div>


          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => this.handle_Show_Short_Atndnc_WRT_Teacher_ModalShowHide()}>
              Close
            </Button>
          </Modal.Footer>

        </Modal>

        {/* Director thresh Hold Modal */}
        <Modal show={this.state.thresh_HoldModalShowHide}>

          <Modal.Header closeButton onClick={() => this.handlethresh_HoldModalShowHide()}>
            <Modal.Title> Set Custom Thresh Hold </Modal.Title>
          </Modal.Header>

          <Modal.Body>

            <div className="input-group mb-3">
              <select className="form-control col-md-4" id="SelectedClassForthreshHold">
                <option value="BS(CS)"> BS(CS) </option>
                <option value="BS(IT)"> BS(IT) </option>
                <option value="MCS"> MCS </option>
                <option value="MIT"> MIT </option>
              </select>
              <input type="number" className="form-control col-md-8" placeholder="Set Custom thresh Hold" aria-label="CustomthreshHold" aria-describedby="CustomthreshHold" id="CustomthreshHold" required/>
              <div className="input-group-append">
                <button className="btn DIR_Pg_Top_Btns" type="button" onClick={this.GetCustomthreshHoldDetails}>View</button>
              </div>
            </div>

            <div className="table-responsive" id="StudentsList">
              <table className="table table-hover table-light table_bordered_custom">

                <thead className="thead-dark">
                  <tr>
                    <th>Arid No</th>
                    <th>Class</th>
                    <th>Total Attendance</th>
                  </tr>
                </thead>

                <tbody>
                  {this.PopulateShortAttendanceWRT_threshHold_and_Class()}
                </tbody>

              </table>
            </div>

          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => this.handlethresh_HoldModalShowHide()}>
              Close
          </Button>
          </Modal.Footer>

        </Modal>

        {/* Show_Short_Atndnc_WRT_Teacher Modal */}
       {/*  <Modal show={this.state.Show_Short_Atndnc_WRT_threshHold_Modal_showHide}>

          <Modal.Header closeButton onClick={() => this.handle_Show_Short_Atndnc_WRT_threshHold_Modal_showHide()}>
            <Modal.Title> List of Short Attendance Students W.R.T thresh Hold & Class </Modal.Title>
          </Modal.Header>

          <Modal.Body>

            <div className="table-responsive" id="StudentsList">
              <table className="table table-hover table-light table_bordered_custom">

                <thead className="thead-dark">
                  <tr>
                    <th>Arid No</th>
                    <th>Total Attendance</th>
                  </tr>
                </thead>

                <tbody>
        
                </tbody>

              </table>
            </div>


          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => this.handle_Show_Short_Atndnc_WRT_threshHold_Modal_showHide()}>
              Close
          </Button>
          </Modal.Footer>

        </Modal>

 */}


        <h1 className="text-dark heading_biit"> Director's Page </h1>

        {/* <p> Current Short Attendance Criteria: {ShortAttendanceCriteria}% </p> */}

        {/*  --------------Teachers List---------------  */}
        <div className="table-responsive">

          <table className="table table-hover table-light table_bordered_custom">

            <thead className="thead-dark">

              <tr>
                <th className="text-center"> List of Teachers </th>
                <th>
                  Current Short Attendance Criteria: {ShortAttendanceCriteria}%
                </th>
                <th>
                  <div className="btn-group">
                    <button type="button" className="btn btn-light" onClick={() => this.handleModalShowHide()}>Settings</button>
                    <Link className="btn btn-light" to="/DirectShortAttndnce_WRT_Course/">Short Attendance W.R.T Course</Link>
                    <button type="button" className="btn btn-light" onClick={() => this.handlethresh_HoldModalShowHide()}>Custom Thresh Hold</button>
                  </div>
                </th>

              </tr>

            </thead>

          </table>

        </div>

        <MDBDataTable
          striped
          bordered
          small
          searching={true}
          paginationLabel={false}
          paging={false}
          data={this.DatatablePage()}
        />


      </div>

    );
  }

};


export default Director;