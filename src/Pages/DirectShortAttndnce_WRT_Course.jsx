import React from 'react';
import { MDBDataTable } from 'mdbreact';
import { Button, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';

class DirectShortAttndnce_WRT_Course extends React.Component {

  constructor(props) {
    /* In React we must have to call 'super()' function in our Child Class to execute the Constructor of Parent Class */
    super(props);

    this.state = {
      data: false,
      ShortAttendanceCriteria: false,
      showHide: false,
      Show_Short_Atndnc_WRT_Course_Modal_showHide: false,
      Total_No_Of_Classes: false,
      Total_Classes_Taken_By_Each_Stu: false
    }

  }

  ShowRowsForDataTable = () => {
    let RowsForDataTable = [];

    for (let i = 0; i < this.state.data.length; i++) {

      RowsForDataTable.push(
        {
          name: this.state.data[i].Course_Name,
          View_Btn: <button className="View_btns" id={this.state.data[i].id} onClick={this.ShowShortAttendanceWRT_Course} style={{ color: "white" }}>
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
    const apiUrl = 'http://localhost:4000/Director/WRT_Courses';

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

  ShowShortAttendanceWRT_Course = (e) => {
    // alert(e.target.id);

    fetch("http://localhost:4000/ShowShortAttendanceWRT_Course/" + e.target.id)
      .then((response) => response.json())
      .then((data) => {

        this.setState({
          Total_No_Of_Classes: data.Total_No_Of_Classes,
          Total_Classes_Taken_By_Each_Stu: data.Total_Classes_Taken_By_Each_Stu,
          Show_Short_Atndnc_WRT_Course_Modal_showHide: true
        });

      })
      .catch(() => {
        alert("No short attendance data found for this course.")
      });

  }


  PopulateShortAttendanceWRT_Course_Data = () => {

     /* console.log("T_Class", this.state.Total_No_Of_Classes);
     console.log("T_Class_By_each_Stu", this.state.Total_Classes_Taken_By_Each_Stu);
 return; */

     let Total_Disciplines = this.state.Total_No_Of_Classes.length;
     let Total_Stu = this.state.Total_Classes_Taken_By_Each_Stu.length;
     let Students_Atndnc_Details = [];
 
     for (let i = 0; i < Total_Disciplines; i++) {
 
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
         if( Students_Atndnc_Details[i].Total_Attendance_Percentage < this.state.ShortAttendanceCriteria )
       rows.push(
         <tr>
           <td> {Students_Atndnc_Details[i].Roll_No} </td>
           <td style={{color:"red"}}> {parseInt(  Students_Atndnc_Details[i].Total_Attendance_Percentage )}% </td>
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
      console.log("Updated Successfully");

      // Here we are Updating the value of this.State.ShortAttendanceCriteria
      this.setState({
        ShortAttendanceCriteria: ShortAttendanceCriteria
      });
    }
    else
      console.log("No response Yet.");

  }


  LockAll = () => {
    alert("Lock");
  }

  handleModalShowHide() {
    this.setState({ showHide: !this.state.showHide })
  }

  handle_Show_Short_Atndnc_WRT_Course_ModalShowHide() {
    this.setState({ Show_Short_Atndnc_WRT_Course_Modal_showHide: !this.state.Show_Short_Atndnc_WRT_Course_Modal_showHide })
  }

  render() {

    // const data = this.state.data;
    const ShortAttendanceCriteria = this.state.ShortAttendanceCriteria;

    return (

      <div className="container">

        {/* Show_Short_Atndnc_WRT_Teacher Modal */}
        <Modal show={this.state.Show_Short_Atndnc_WRT_Course_Modal_showHide}>

          <Modal.Header closeButton onClick={() => this.handle_Show_Short_Atndnc_WRT_Course_ModalShowHide()}>
            <Modal.Title> List of Short Attendance Students W.R.T Course </Modal.Title>
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
                  {this.PopulateShortAttendanceWRT_Course_Data()}
                </tbody>

              </table>
            </div>


          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => this.handle_Show_Short_Atndnc_WRT_Course_ModalShowHide()}>
              Close
            </Button>
          </Modal.Footer>

        </Modal>


        {/* Setings Modal */}
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

            {/*  <div>
              
              <DatePicker
                onChange={this.SetDate}
                value={this.state.dateValue}
                disabled={false}
                className="col-md-6"
              />

                <button className="btn DIR_Pg_Top_Btns col-md-6" type="button"  onClick={this.ChangeShortAttendance} >Lock All</button>
              
            </div> */}
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => this.handleModalShowHide()}>
              Close
            </Button>
          </Modal.Footer>

        </Modal>


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
                  <div class="btn-group">
                    <button type="button" className="btn btn-light" onClick={() => this.handleModalShowHide()}>Settings</button>
                    <Link className="btn btn-light" to="/Director/">Short Attendance W.R.T Teacher</Link>
                  </div>
                </th>

              </tr>

            </thead>

            {/* tbody starts */}
            {/* {ShowTeachersList()} */}
            {/* tbody ends */}

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


export default DirectShortAttndnce_WRT_Course;