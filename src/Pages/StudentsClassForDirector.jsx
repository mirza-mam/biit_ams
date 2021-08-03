import React from 'react';

class StudentsClassForDirector extends React.Component {

  constructor(props) {
    /* In React we must have to call 'super()' function in our Child Class to execute the Constructor of Parent Class */
    super(props);

    this.state = {
      data: false
    }

  }

  componentDidMount = () => {
    const apiUrl = 'http://localhost:4000/StudentsClassForDirector/' + localStorage.getItem('StudentsClassForDirector_URL');

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


  }

  GotoStudentsClassForDirectorPage = (e) => {
    //localStorage.setItem('TeacherID', e.target.id);
    alert(e.target.id);

    //window.location.replace("http://localhost:3000/StudentsClassForDirector/" + e.target.id);    
  }

  render() {


    const data = this.state.data;

    const ShowStudentsList = () => {

        if( data.length > 0 )
        {
        //Declaring a infinite Array
        let rows = [];
        for(let i = 0; i < data.length; i++)
        {
          rows.push(
            <tr>
                <td> {data[i].Roll_No} </td>
                <td> {data[i].Name} </td>
                <td> 77% </td>
            </tr>
          );
        }
        return rows;
        }
        else{
          return "No Data is available for this Class yet."
        }
      }

    return (

      <div className="container">

        <h1 className="text-dark heading_biit"> Director's Page </h1>

        {/*  --------------Classes List---------------  */}
        <div className="table-responsive">

          <table className="table table-hover table-light table_bordered_custom">

            <thead className="thead-dark">

              <tr>
                <th colSpan="3" className="text-center"> Classes Details </th>
              </tr>

              <tr>
                <th>Discipline</th>
                <th>Course</th>
                <th>Attendance</th>
              </tr>

            </thead>

             {/* tbody starts */}
             {ShowStudentsList()}
            {/* tbody ends */}

            </table>

        </div>
      </div>


    );
  };

}


export default StudentsClassForDirector;