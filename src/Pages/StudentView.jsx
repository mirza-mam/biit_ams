import React from 'react';
import {Link} from 'react-router-dom';

class StudentView extends React.Component {
   
    constructor(props) {
        /* In React we must have to call 'super()' function in our Child Class to execute the Constructor of Parent Class */
       super(props);

       this.state = {
        Total_Classes_Taken_In_Each_Course: false,
        Total_No_Of_Classes: false
       }
    
    var rows = [];
    for (var i = 1; i <= 3; i++) {
        rows.push(
            <tr>
                <td>BS()</td>
                <td>08:30 - 10:00AM</td>
                <td><Link to="/StudentAttendanceMarkingPage/BS(CS)-1-Mor"> BS(CS)-1-Mor </Link></td>
                <td>PF</td>
                <td>LT-1</td>
            </tr>
        );
    }
       
    }

    componentDidMount = () => {

      // alert( localStorage.getItem("Email") )
      const apiUrl = 'http://localhost:4000/GetDataForStudentView/' + localStorage.getItem("Email");
  
      fetch(apiUrl).then(
        (response) => response.json()
      ).then(
        (data) => {
          console.log('This is your data ', data)
          this.setState({
            Total_Classes_Taken_In_Each_Course: data.Total_Classes_Taken_In_Each_Course,
            Total_No_Of_Classes: data.Total_No_Of_Classes
          })
        }
      )
      .catch((error) => {
        console.log("This is the error due to which we can't fetch this Student's Data: " , error)
      });
  
    }


  

render(){

    return(
     
        <div className="container">
        
        <h1 className="text-dark heading_biit"> {this.props.match.params.StudentName} Welcome to BIIT AMS  </h1>
        
           <div className="table-responsive"> 
               <table className="table table-hover table-light table_bordered_custom">
        
               <thead className="thead-dark">
                   
                 <tr>
                   <th colSpan="3" class="text-center"> 
                   Your Attendance Status </th>
                 </tr>

                 <tr>
                   <th>Course</th>
                   <th>Total Attendance</th>
                   <th>Status</th>
                 </tr>
        
               </thead>
        
               <tbody>

                 <tr>
                   <td>PF</td>
                   <td>77%</td>
                   <td> 
                   <input 
                        type="button"  
                        className="View_btns" 
                        value="Allowed" 
                        >
                   </input>
                   </td>
                 </tr>

               </tbody>
        
             </table>
    
           </div>
           
           </div>
           );
}
  
};


export default StudentView;