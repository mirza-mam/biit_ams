import React from 'react';

class StudentsList extends React.Component {
   
    /* constructor(props) {
        //  In React we must have to call 'super()' function in our Child Class to execute the Constructor of Parent Class
       super(props);
    
    }
 */
render(){

    return(
     
        <div className="container">
        
        <h1 className="text-dark heading_biit"> {this.props.match.params.className}  Students List </h1>
        
           <div className="table-responsive"> 
               <table className="table table-hover table-light table_bordered_custom">
        
               <thead className="thead-dark">
                   
                 <tr>
                   <th colSpan="3" class="text-center"> 
                   Attendance Status in {this.props.match.params.Subject} </th>
                 </tr>

                 <tr>
                   <th>Arid Number</th>
                   <th>Name</th>
                   <th>Status</th>
                 </tr>
        
               </thead>
        
               <tbody>
                 <tr>
                   <td>19-aird-0155</td>
                   <td>Ali</td>
                   <td> 
                      90%
                   </td>
                 </tr>

                 <tr>
                 <td>18-aird-0255</td>
                   <td>Ahmed</td>
                   <td> 
                      75%
                   </td>
                 </tr>

                 <tr>
                 <td>17-aird-0265</td>
                   <td>Alina</td>
                   <td> 
                      65%
                   </td>
                 </tr>

                 <tr>
                    <td>20-aird-0111</td>
                    <td>Mujtaba</td>
                    <td> 
                        55%
                    </td>
                 </tr>

                 <tr>
                    <td>17-aird-0245</td>
                    <td>Abbas</td>
                    <td> 
                        75%
                    </td>
                 </tr>
               </tbody>
        
             </table>
    
           </div>
           
           </div>
           );
}
  
};


export default StudentsList;