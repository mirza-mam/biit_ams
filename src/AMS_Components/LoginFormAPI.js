import React from 'react';
import AridLogo from '../logo.png';

class LoginForm extends React.Component{
 
  constructor(){
    super();

    this.state = {
    user_mail_or_rollNo_loginFrm: '',
    user_password_loginFrm: '',
    redirectToReferrer: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    /* this.login = this.login.bind(this);
    this.onChange = this.onChange.bind(this); */
    }

    handleChange = event => {
      //alert(event.target.value);
      //this.setState({ [event.target.name]: event.target.value })
     //alert(event.target.id);
     if( event.target.id === 'user_mail_or_rollNo_loginFrm' )
        this.setState({ user_mail_or_rollNo_loginFrm: event.target.value })
    else
        this.setState({ user_password_loginFrm: event.target.value })

  }


  handleSubmit = async (e) =>
    {
      e.preventDefault();

      //document.getElementById('')
      const data = { 
        email: this.state.user_mail_or_rollNo_loginFrm, 
        password: this.state.user_password_loginFrm
      };

        
      let headers =
      {
          "Content-Type": "application/json",
          //"Authentication": "Bearer " + localStorage.getItem('token')
      }
  
       await fetch('http://localhost:4000/login', 
        { method: 'POST', 
          body: JSON.stringify(data), 
          headers: headers })
          .then((response) => response.json())
          .then(
            (data) => {
              // console.log('This is your data ', data.results.userData);

              //alert( data.results.userData[0].Name );
              if(data.results.status === true)
          {
            localStorage.setItem('token', data.results.token);
            localStorage.setItem('id', data.results.userData[0].id);
            localStorage.setItem('Name', data.results.userData[0].Name);
            localStorage.setItem('Email', data.results.userData[0].Email);
            localStorage.setItem('Roll_id', data.results.userData[0].Roll_id);

            if( data.results.userData[0].Roll_id === 1 )
            {
              window.location.replace("http://localhost:3000/Director/"); 
            }
            else if( data.results.userData[0].Roll_id === 2 )
            {
              window.location.replace("http://localhost:3000/TeacherSchedule/"); 
            }
            else if( data.results.userData[0].Roll_id === 3 )
            {
              window.location.replace("http://localhost:3000/StudentView/"); 
            }
            else if( data.results.userData[0].Roll_id === 4 )
            {
              window.location.replace("http://localhost:3000/StudentView/"); 
            }
            
          }
          else
          {
            console.log("something went wrong..")
          }  
              //alert( localStorage.getItem('token') );
            }
            );
        
    }

    render(){
      console.log(  "Your state Data is" , this.state );
      return(
        
<div className="LoginForm_Background">

<div className="AMS_login_Pg_Logo"> 
<img src={AridLogo} width="100%"></img>
</div>

<h1 className="AMS_login_Pg_heading"> BIIT Attendance Management System </h1>

<div className="login_Form_Container">

    <form onSubmit={this.handleSubmit} >
    
      <h3 className="login_Frm_Heading"> Login Form </h3>
    
      <div className="form-group">
       <input type="text" className="form-control" onChange={this.handleChange} id="user_mail_or_rollNo_loginFrm" aria-describedby="user_mail_or_rollNo_loginFrm" placeholder="Enter email/roll no" />
      </div>
    
      <div className="form-group">
        <input type="password" className="form-control" onChange={this.handleChange} id="user_password_loginFrm" aria-describedby="user_password_loginFrm" placeholder="Enter password" />
      </div>
      
      <div className="form-check">
        <input type="checkbox" className="form-check-input" id="user_rememberMe_loginFrm" />
        <label className="form-check-label" htmlFor="user_rememberMe_loginFrm">remember me</label>
      </div>
    
<button type="submit" className="login_Frm_Btn" >{this.props.btn_name}</button>

    </form>
     
    </div>

</div>
   
    

      );

    }

}

export default LoginForm;
