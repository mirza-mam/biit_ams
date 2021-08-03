import React from 'react';

class DirectClassesDetails extends React.Component {

  constructor(props) {
    /* In React we must have to call 'super()' function in our Child Class to execute the Constructor of Parent Class */
    super(props);

    this.state = {
      data: false
    }

  }

  componentDidMount = () => {
    const apiUrl = 'http://localhost:4000/DirectClassesDetails/' + localStorage.getItem('TeacherID');

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
    //alert(e.target.id);
    localStorage.setItem('StudentsClassForDirector_URL', e.target.id);
    window.location.replace("http://localhost:3000/StudentsClassForDirector/" + localStorage.getItem('StudentsClassForDirector_URL'));    
  }

  render() {


    const data = this.state.data;
    var DistinctCourse = []; 

    for(let i = 0; i < data.length; i++ )
    DistinctCourse[i] = data[i].Course;

    // Set() is a biult-in method through which we can save only Distinct values from an Array[]
    DistinctCourse = [...new Set(DistinctCourse)];

    const ShowClassesList = () => {

      if( data.length > 0 )
      {
         // Declaring a Infinite Array
      const rows = [];
      for (var i = 0; i < DistinctCourse.length; i++) {
        rows.push(
          <tbody>
            {data ?
              <tr>
               
                <th> {DistinctCourse[i]} </th>
                <td>
                  <button className="View_btns" 
                  id={data[i].Discipline + "/" +  data[i].Semester + "/" +  data[i].Shift + "/" +  data[i].Course} 
                  onClick={this.GotoStudentsClassForDirectorPage} 
                  style={{ color: "white" }}>
                    View
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
      /* for (var i = 0; i < data.length; i++) {
        rows.push(
          <tbody>
            {data ?
              <tr>
                <th> {data[i].Discipline}-{data[i].Semester}-{data[i].Shift} </th>
                <th> {data[i].Course} </th>
                <td>
                  <button className="View_btns" 
                  id={data[i].Discipline + "/" +  data[i].Semester + "/" +  data[i].Shift + "/" +  data[i].Course} 
                  onClick={this.GotoStudentsClassForDirectorPage} 
                  style={{ color: "white" }}>
                    View
                  </button>
                </td>
              </tr>
              :
              <tr>
                <td>Wait For Data...</td>
              </tr>}
          </tbody>
        );

      } */
      return rows;
      }
      else{
      return "There's no Schedule data for this Teacher yet.";
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
                <th>Course</th>
                <th>Option</th>
              </tr>

            </thead>

             {/* tbody starts */}
             {ShowClassesList()}
            {/* tbody ends */}

            </table>

        </div>
      </div>


    );
  };

}


export default DirectClassesDetails;