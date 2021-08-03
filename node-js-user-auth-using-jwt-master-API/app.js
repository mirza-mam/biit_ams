/**
* Module dependencies.
*/

var express = require('express')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');
var cors = require('cors');
var app = express();
var bodyParser = require("body-parser");
var jwt = require('jsonwebtoken');
var sql = require("mssql");
var db = require("./db");

require('dotenv').config();

/**
* creating mysql connection.
*/
var connection = new sql.ConnectionPool(db.dbConfig);

/* var connection = mysql.createConnection({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASS,
                database : process.env.DB_NAME
}); */

connection.connect(function (err) {
  if (err)
    console.log(err);
});

global.db = connection;

/**
* all environments.
*/
app.set('port', 4000);
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/**
* routes.
*/

//POST Routes
app.post('/signup', user.signup);
app.post('/login', user.signin);
app.post('/check_user', user.check_user);
app.post('/SaveAttendance', user.SaveAttendance);
app.post('/SaveShortAttendanceCriteria', user.SaveShortAttendanceCriteria);
app.post('/SendShortAttendanceMessage', user.SendShortAttendanceMessage);
app.post('/SaveLockDays', user.SaveLockDays);



//GET Routes
/* ************************For Student View*************************** */
app.get('/GetDataForStudentView/:Roll_No', function(req, res){


  let Roll_No = req.params.Roll_No;

  // For storing total No of classes of each Course in the following Code
  let Total_No_Of_Classes = [];
  // For storing Total_Classes_Taken_By_Each_Stu in a Specific Course of a Teacher
  let Total_Classes_Taken_In_Each_Course = [];
  // For storing the length of the given Teacher's Data
  let Stu_Data_Length = 0;
  // For storing the length of the given Teacher's Data
  // var Teacher_Distinct_Stu_Data_Length = 0;

  function setValue(Obj, ObjName) {


    if (ObjName === "Total_No_Of_Classes") {
      Total_No_Of_Classes = Obj;
      // console.log(Total_No_Of_Classes);
    }
    else if (ObjName === "Total_Classes_Taken_In_Each_Course") {
      Total_Classes_Taken_In_Each_Course = Obj;
    }

  }

  var sql = "select enrolledStudents.*, StudentsCourses.Course_Name from enrolledStudents, StudentsCourses where Roll_No = '" + Roll_No + "' AND  StudentsCourses.Stu_Roll_No = enrolledStudents.Roll_No";

  connection.query(sql, function (err, results) {

    try {

      if (results.recordset !== null) {

        Stu_Data_Length = results.recordset.length;

        for (let i = 0; i < Stu_Data_Length; i++) {
          
          /* For total classes */
          sql = "select COUNT(Roll_No) as [Total_Classes], Roll_No ,Course, Degree, Shift, Semester from AttendanceTbl where Roll_No = '" + results.recordset[i].Roll_No + "' AND Course = '" + results.recordset[i].Course_Name + "' AND Degree = '" + results.recordset[i].Degree + "' AND Shift = '" + results.recordset[i].Shift + "' AND Semester = '" + results.recordset[i].Semester + "' group by Roll_No, Course,  Degree, Shift, Semester";

          connection.query(sql, function (err, results) {

          try {
            
              Total_No_Of_Classes.push({
                Total_Classes: results.recordset[i].Total_Classes,
                Course: results.recordset[i].Course,
                Degree: results.recordset[i].Degree,
                Shift: results.recordset[i].Shift,
                Semester: results.recordset[i].Semester
              });
  
              // This Logic is used to Save Data only when 'Total_No_Of_Classes' Object is completely filled
              if (i === (Stu_Data_Length - 1)) {
                setValue(Total_No_Of_Classes, "Total_No_Of_Classes");
              }
  
          } catch (error) {

            console.log("error in fetching StudentView Data Properly");

            Total_No_Of_Classes.push({
              Total_Classes: "",
              Course: "",
              Degree: "",
              Shift: "",
              Semester: ""
            });

            // This Logic is used to Save Data only when 'Total_No_Of_Classes' Object is completely filled
            if (i === (Stu_Data_Length - 1)) {
              setValue(Total_No_Of_Classes, "Total_No_Of_Classes");
            }
            
          }

        });
        
        }// for loop END's

      
        sql = "select enrolledStudents.*, StudentsCourses.Course_Name from enrolledStudents, StudentsCourses where Roll_No = '" + Roll_No + "' AND  StudentsCourses.Stu_Roll_No = enrolledStudents.Roll_No";


        connection.query(sql, function (err, results) {

          if (results.recordset !== null) {

            Stu_Data_Length = results.recordset.length;

            for (let i = 0; i < Stu_Data_Length; i++) {

              /* For selecting total number of Classes taken by a Student of the given Teacher in a Specific Subject*/
              sql = "Select COUNT(Roll_No) as [Total_Classes_Taken_In_Each_Course], Roll_No, Course, Degree, Shift, Semester from AttendanceTbl where Roll_No = '" + results.recordset[i].Roll_No  + "' AND Status = 'Present' AND Course = '" + results.recordset[i].Course_Name + "' AND Degree = '" + results.recordset[i].Degree + "' AND Shift = '" + results.recordset[i].Shift + "' AND Semester = '" + results.recordset[i].Semester + "' group by Roll_No, Course, Degree, Shift, Semester ";

              connection.query(sql, function (err, results) {

                try {
                  // Ye variables testing k liye bnay thy agr results.recordset k array se direct values bhi dali jain to koi frq nahi pare ga
                  let T_Classes_Taken_In_Each_Course = results.recordset[i].Total_Classes_Taken_In_Each_Course;
                  let Course = results.recordset[i].Course;
                  let Degree = results.recordset[i].Degree;
                  let Shift = results.recordset[i].Shift;
                  let Semester = results.recordset[i].Semester;
                  let Roll_No = results.recordset[i].Roll_No;

                  Total_Classes_Taken_In_Each_Course.push({
                    Total_Classes_Taken_In_Each_Course: T_Classes_Taken_In_Each_Course,
                    Course: Course,
                    Degree: Degree,
                    Shift: Shift,
                    Semester: Semester,
                    Roll_No: Roll_No
                  });

                  // This Logic is used to Save Data only when 'Total_Classes_Taken_By_Each_Stu' Object is completely filled
                  if (i === (Stu_Data_Length - 1)) {
                    setValue(Total_Classes_Taken_In_Each_Course, "Total_Classes_Taken_In_Each_Course");


                    let DataForResponse = {
                      Total_No_Of_Classes: Total_No_Of_Classes,
                      Total_Classes_Taken_In_Each_Course: Total_Classes_Taken_In_Each_Course,
                    }


                    res.json(DataForResponse);
                    res.end();

                  }

                } catch (error) {

                  Total_Classes_Taken_In_Each_Course.push({
                    Total_Classes_Taken_In_Each_Course: "",
                    Course: "",
                    Degree: "",
                    Shift: "",
                    Semester: "",
                    Roll_No: ""
                  });

                  // This Logic is used to Save Data only when 'Total_Classes_Taken_By_Each_Stu' Object is completely filled
                  if (i === (Stu_Data_Length - 1)) {
                    setValue(Total_Classes_Taken_In_Each_Course, "Total_Classes_Taken_In_Each_Course");

                    let DataForResponse = {
                      Total_No_Of_Classes: Total_No_Of_Classes,
                      Total_Classes_Taken_In_Each_Course: Total_Classes_Taken_In_Each_Course,
                    }
                    
                    res.json(DataForResponse);
                    res.end();
                  }

                  console.log("error");

                }

              });

            }// for loop END's

          }

        });

      }

    } catch (error) {
      console.log("No data found against given teacher ID.");
    }



  });

});

/* * ***************For Teacher View***************** * */
app.get('/TeacherSchedule/:id', function (req, res) {

  let id = req.params.id;

  var sql = "SELECT * from TeachersSchedule where T_id = " + id;

  connection.query(sql, function (err, results) {

    res.json(results.recordset);
    res.end();
  });

});


app.get('/StudentAttendanceMarkingPage/:Degree/:Semester/:Shift/:Course/:Day', function (req, res) {
  let Degree = req.params.Degree;
  let Shift = req.params.Shift;
  let Semester = req.params.Semester;
  let Course = req.params.Course;

  var sql = "SELECT enrolledStudents.Roll_No, enrolledStudents.Name,  enrolledStudents.Degree, enrolledStudents.Shift, enrolledStudents.Semester, enrolledStudents.Image, StudentsCourses.Course_Name FROM enrolledStudents, StudentsCourses WHERE enrolledStudents.Roll_No = StudentsCourses.Stu_Roll_No AND enrolledStudents.Degree = '" + Degree + "' AND enrolledStudents.Shift = '" + Shift + "' AND enrolledStudents.Semester = '" + Semester + "' AND StudentsCourses.Course_name = '" + Course + "' ";

  connection.query(sql, function (err, results) {

    res.json(results.recordset);
    res.end();

  });
});

app.get('/GetStudentAttendancePercentage/:Degree/:Semester/:Shift/:Course/:Day', function (req, res) {

  let Degree = req.params.Degree;
  let Shift = req.params.Shift;
  let Semester = req.params.Semester;
  let Course = req.params.Course;

  var sql = "SELECT * FROM AttendanceTbl WHERE Course = '" + Course + "' AND Degree = '" + Degree + "' AND Shift = '" + Shift + "' AND Semester = '" + Semester + "' ";

  connection.query(sql, function (err, results) {

    res.json(results.recordset);
    res.end();
  });

});

app.get('/GenerateReport/:Roll_No/:Course_Name', function (req, res) {

  let Roll_No = req.params.Roll_No;
  let Course_Name = req.params.Course_Name;

  // Fetch the attendance Data of the given Roll_No in a specific subject
  var sql = "SELECT * FROM AttendanceTbl WHERE Roll_No = '" + Roll_No + "' AND Course = '" + Course_Name + "' ";

  connection.query(sql, function (err, results) {

    res.json(results.recordset);
    res.end();
  });

});

/* * ***************For Director View***************** * */
app.get('/Director/', function (req, res) {

  // This query will fetch the list of all teachers
  var sql = "SELECT * from Users where Roll_id = 2";

  connection.query(sql, function (err, results) {

    res.json(results.recordset);
    res.end();

  });
});

app.get('/Director/WRT_Courses', function (req, res) {

  let sql = "select * from Courses";

  connection.query(sql, function (err, results) {

    res.json(results.recordset);
    res.end();

  });

});


app.get('/GETShortAttendanceCriteria/', function (req, res) {

  // This query will fetch the Short Attendance Criteria
  var sql = "SELECT * from Short_Attendance_Criteria";

  connection.query(sql, function (err, results) {

    res.json(results.recordset);
    res.end();

  });
});


app.get('/ShowShortAttendanceWRT_Teacher/:TeacherID', function (req, res) {

  let t_id = req.params.TeacherID;
  // For storing total No of classes of each Course in the following Code
  var Total_No_Of_Classes = [];
  // For storing Total_Classes_Taken_By_Each_Stu in a Specific Course of a Teacher
  var Total_Classes_Taken_By_Each_Stu = [];
  // For storing the length of the given Teacher's Data
  var Teacher_Data_Length = 0;
  // For storing the length of the given Teacher's Data
  var Teacher_Distinct_Stu_Data_Length = 0;

  function setValue(Obj, ObjName) {


    if (ObjName === "Total_No_Of_Classes") {
      Total_No_Of_Classes = Obj;
      // console.log(Total_No_Of_Classes);
    }
    else if (ObjName === "Total_Classes_Taken_By_Each_Stu") {
      Total_Classes_Taken_By_Each_Stu = Obj;
    }

  }

  /* For selecting DISTINCT Data of a Teacher */
  var sql = "Select DISTINCT Course, Degree , Shift , Semester ,T_id from AttendanceTbl where T_id =" + t_id + "";

  connection.query(sql, function (err, results) {

    try {

      if (results.recordset !== null) {

        Teacher_Data_Length = results.recordset.length;

        for (let i = 0; i < Teacher_Data_Length; i++) {

          /* For total classes */
          sql = "select COUNT(Roll_No) as [Total_Classes], Roll_No ,Course, Degree, Shift, Semester from AttendanceTbl where T_id =  '" + t_id + "' AND Course = '" + results.recordset[i].Course + "' AND Degree = '" + results.recordset[i].Degree + "' AND Shift = '" + results.recordset[i].Shift + "' AND Semester = '" + results.recordset[i].Semester + "' group by Roll_No, Course,  Degree, Shift, Semester";

          connection.query(sql, function (err, results) {

            Total_No_Of_Classes.push({
              Total_Classes: results.recordset[i].Total_Classes,
              Course: results.recordset[i].Course,
              Degree: results.recordset[i].Degree,
              Shift: results.recordset[i].Shift,
              Semester: results.recordset[i].Semester
            });

            // This Logic is used to Save Data only when 'Total_No_Of_Classes' Object is completely filled
            if (i === (Teacher_Data_Length - 1)) {
              setValue(Total_No_Of_Classes, "Total_No_Of_Classes");
            }


          });


        }// for loop END's

        /* For selecting DISTINCT Students of a Teacher */
        var sql = "Select DISTINCT Roll_No, Course, Degree , Shift , Semester from AttendanceTbl where T_id =" + t_id + "";

        connection.query(sql, function (err, results) {

          if (results.recordset !== null) {

            Teacher_Distinct_Stu_Data_Length = results.recordset.length;

            for (let i = 0; i < Teacher_Distinct_Stu_Data_Length; i++) {

              /* For selecting total number of Classes taken by a Student of the given Teacher in a Specific Subject*/
              sql = "Select COUNT(Roll_No) as [Total_Classes_Taken_By_Each_Stu], Roll_No, Course, Degree, Shift, Semester from AttendanceTbl where T_id = '" + t_id + "' AND Roll_No = '" + results.recordset[i].Roll_No + "' AND Status = 'Present' AND Course = '" + results.recordset[i].Course + "' AND Degree = '" + results.recordset[i].Degree + "' AND Shift = '" + results.recordset[i].Shift + "' AND Semester = '" + results.recordset[i].Semester + "' group by Roll_No, Course, Degree, Shift, Semester ";

              connection.query(sql, function (err, results) {

                try {
                  // Ye variables testing k liye bnay thy agr results.recordset k array se direct values bhi dali jain to koi frq nahi pare ga
                  let Total_Classes_By_Each_Stu = results.recordset[0].Total_Classes_Taken_By_Each_Stu;
                  let Course = results.recordset[0].Course;
                  let Degree = results.recordset[0].Degree;
                  let Shift = results.recordset[0].Shift;
                  let Semester = results.recordset[0].Semester;
                  let Roll_No = results.recordset[0].Roll_No;

                  Total_Classes_Taken_By_Each_Stu.push({
                    "Total_Classes_Taken_By_Each_Stu": Total_Classes_By_Each_Stu,
                    "Course": Course,
                    "Degree": Degree,
                    "Shift": Shift,
                    "Semester": Semester,
                    "Roll_No": Roll_No
                  });

                  // This Logic is used to Save Data only when 'Total_Classes_Taken_By_Each_Stu' Object is completely filled
                  if (i === (Teacher_Distinct_Stu_Data_Length - 1)) {
                    setValue(Total_Classes_Taken_By_Each_Stu, "Total_Classes_Taken_By_Each_Stu");

                    let DataForResponse = {
                      Total_No_Of_Classes: Total_No_Of_Classes,
                      Total_Classes_Taken_By_Each_Stu: Total_Classes_Taken_By_Each_Stu,
                    }


                    res.json(DataForResponse);
                    res.end();

                  }


                } catch (error) {

                  Total_Classes_Taken_By_Each_Stu.push({
                    "Total_Classes_Taken_By_Each_Stu": "",
                    "Course": "",
                    "Degree": "",
                    "Shift": "",
                    "Semester": "",
                    "Roll_No": ""
                  });

                  // This Logic is used to Save Data only when 'Total_Classes_Taken_By_Each_Stu' Object is completely filled
                  if (i === (Teacher_Distinct_Stu_Data_Length - 1)) {
                    setValue(Total_Classes_Taken_By_Each_Stu, "Total_Classes_Taken_By_Each_Stu");

                    let DataForResponse = {
                      Total_No_Of_Classes: Total_No_Of_Classes,
                      Total_Classes_Taken_By_Each_Stu: Total_Classes_Taken_By_Each_Stu,
                    }


                    res.json(DataForResponse);
                    res.end();
                  }

                  console.log("error");

                }

              });

            }// for loop END's

          }

        });

      }

    } catch (error) {
      console.log("No data found against given teacher ID.");
    }



  });

});


app.get('/ShowShortAttendanceWRT_Course/:CourseID', function (req, res) {

  let c_id = req.params.CourseID;
  // For storing total No of classes of each Discipline in the following Code
  var Total_No_Of_Classes = [];
  // For storing Total_Classes_Taken_By_Each_Stu in the given Course
  var Total_Classes_Taken_By_Each_Stu = [];
  // For storing the length of the given Course's Data
  var Course_Data_Length = 0;
  // For storing the length of Distinct Students studying the given course
  var Course_Distinct_Stu_Data_Length = 0;

  function setValue(Obj, ObjName) {


    if (ObjName === "Total_No_Of_Classes") {
      Total_No_Of_Classes = Obj;
      // console.log(Total_No_Of_Classes);
    }
    else if (ObjName === "Total_Classes_Taken_By_Each_Stu") {
      Total_Classes_Taken_By_Each_Stu = Obj;
    }

  }

  var sql = "select * from Courses where id =" + c_id + "";

  connection.query(sql, function (err, results) {

    try {

      var Given_Course_Name = results.recordset[0].Course_Name;

      /*   console.log(results.recordset[0].Course_Name);
        return; */
      /* For selecting DISTINCT Data of a Course */
      sql = "Select DISTINCT Degree , Shift , Semester, Course from AttendanceTbl where Course = '" + Given_Course_Name + "' ";

      connection.query(sql, function (err, results) {


        try {

          if (results.recordset !== null) {

            Course_Data_Length = results.recordset.length;

            for (let i = 0; i < Course_Data_Length; i++) {

              /* For total classes */
              sql = "select COUNT(Roll_No) as [Total_Classes], Roll_No ,Course, Degree, Shift, Semester from AttendanceTbl where Course = '" + results.recordset[i].Course + "' AND Degree = '" + results.recordset[i].Degree + "' AND Shift = '" + results.recordset[i].Shift + "' AND Semester = '" + results.recordset[i].Semester + "' group by Roll_No, Course,  Degree, Shift, Semester";

              connection.query(sql, function (err, results) {

                Total_No_Of_Classes.push({
                  Total_Classes: results.recordset[i].Total_Classes,
                  Course: results.recordset[i].Course,
                  Degree: results.recordset[i].Degree,
                  Shift: results.recordset[i].Shift,
                  Semester: results.recordset[i].Semester
                });

                // This Logic is used to Save Data only when 'Total_No_Of_Classes' Object is completely filled
                if (i === (Course_Data_Length - 1)) {
                  setValue(Total_No_Of_Classes, "Total_No_Of_Classes");
                }


              });


            }// for loop END's


            /* For selecting DISTINCT Students of a Course */
            var sql = "Select DISTINCT Roll_No, Course, Degree , Shift , Semester from AttendanceTbl where Course = '" + Given_Course_Name + "' ";

            connection.query(sql, function (err, results) {

              if (results.recordset !== null) {

                Course_Distinct_Stu_Data_Length = results.recordset.length;

                for (let i = 0; i < Course_Distinct_Stu_Data_Length; i++) {

                  /* For selecting total number of Classes taken by a Student of the given Course in a Specific Discipline*/
                  sql = "Select COUNT(Roll_No) as [Total_Classes_Taken_By_Each_Stu], Roll_No, Course, Degree, Shift, Semester from AttendanceTbl where Roll_No = '" + results.recordset[i].Roll_No + "' AND Status = 'Present' AND Course = '" + results.recordset[i].Course + "' AND Degree = '" + results.recordset[i].Degree + "' AND Shift = '" + results.recordset[i].Shift + "' AND Semester = '" + results.recordset[i].Semester + "' group by Roll_No, Course, Degree, Shift, Semester ";

                  connection.query(sql, function (err, results) {

                    try {
                      // Ye variables testing k liye bnay thy agr results.recordset k array se direct values bhi dali jain to koi frq nahi pare ga
                      let Total_Classes_By_Each_Stu = results.recordset[0].Total_Classes_Taken_By_Each_Stu;
                      let Course = results.recordset[0].Course;
                      let Degree = results.recordset[0].Degree;
                      let Shift = results.recordset[0].Shift;
                      let Semester = results.recordset[0].Semester;
                      let Roll_No = results.recordset[0].Roll_No;


                      Total_Classes_Taken_By_Each_Stu.push({
                        "Total_Classes_Taken_By_Each_Stu": Total_Classes_By_Each_Stu,
                        "Course": Course,
                        "Degree": Degree,
                        "Shift": Shift,
                        "Semester": Semester,
                        "Roll_No": Roll_No
                      });

                      // This Logic is used to Save Data only when 'Total_Classes_Taken_By_Each_Stu' Object is completely filled
                      if (i === (Course_Distinct_Stu_Data_Length - 1)) {
                        setValue(Total_Classes_Taken_By_Each_Stu, "Total_Classes_Taken_By_Each_Stu");

                        let DataForResponse = {
                          Total_No_Of_Classes: Total_No_Of_Classes,
                          Total_Classes_Taken_By_Each_Stu: Total_Classes_Taken_By_Each_Stu,
                        }


                        res.json(DataForResponse);
                        res.end();

                      }


                    } catch (error) {

                      Total_Classes_Taken_By_Each_Stu.push({
                        "Total_Classes_Taken_By_Each_Stu": "",
                        "Course": "",
                        "Degree": "",
                        "Shift": "",
                        "Semester": "",
                        "Roll_No": ""
                      });

                      // This Logic is used to Save Data only when 'Total_Classes_Taken_By_Each_Stu' Object is completely filled
                      if (i === (Course_Distinct_Stu_Data_Length - 1)) {
                        setValue(Total_Classes_Taken_By_Each_Stu, "Total_Classes_Taken_By_Each_Stu");

                        let DataForResponse = {
                          Total_No_Of_Classes: Total_No_Of_Classes,
                          Total_Classes_Taken_By_Each_Stu: Total_Classes_Taken_By_Each_Stu,
                        }


                        res.json(DataForResponse);
                        res.end();
                      }

                      console.log("error");

                    }

                  });

                }// for loop END's

              }

            });

          }

        } catch (error) {
          console.log("No data found against given Course ID.");
        }



      });


    } catch (error) {

      console.log("No data found for this course.");
      console.log(error);

    }

  });


});



app.get('/StudentsClassForDirector/:Degree/:Semester/:Shift/:Course', function (req, res) {

  let Degree = req.params.Degree;
  let Semester = req.params.Semester;
  let Shift = req.params.Shift;
  let Course = req.params.Course;

  var sql = "SELECT enrolledStudents.Roll_No, enrolledStudents.Name,  enrolledStudents.Degree, enrolledStudents.Shift, enrolledStudents.Semester, StudentsCourses.Course_Name FROM enrolledStudents, StudentsCourses WHERE enrolledStudents.Roll_No = StudentsCourses.Stu_Roll_No AND enrolledStudents.Degree = '" + Degree + "' AND enrolledStudents.Shift = '" + Shift + "' AND enrolledStudents.Semester = '" + Semester + "' AND StudentsCourses.Course_name = '" + Course + "' ";


  connection.query(sql, function (err, results) {

    res.json(results.recordset);
    res.end();
  });
});



app.get('/GetCustomThreshHoldDetails/:SelectedClassForThreshhHold/', function (req, res) {


  let SelectedClassForThreshhHold = req.params.SelectedClassForThreshhHold;

  // For storing total No of classes of each Course in the following Code
  var Total_No_Of_Classes = [];
  // For storing Total_Classes_Taken_By_Each_Stu in a Specific Course of a Teacher
  var Total_Classes_Taken_By_Each_Stu = [];
  // For storing the length of the given Teacher's Data
  var Teacher_Data_Length = 0;
  // For storing the length of the given Teacher's Data
  var Teacher_Distinct_Stu_Data_Length = 0;

  function setValue(Obj, ObjName) {


    if (ObjName === "Total_No_Of_Classes") {
      Total_No_Of_Classes = Obj;
      // console.log(Total_No_Of_Classes);
    }
    else if (ObjName === "Total_Classes_Taken_By_Each_Stu") {
      Total_Classes_Taken_By_Each_Stu = Obj;
    }

  }

  /* For selecting DISTINCT Data of the given Class */
  var sql = "Select DISTINCT Course, Degree , Shift , Semester from AttendanceTbl where Degree = '" + SelectedClassForThreshhHold + "' ";

  connection.query(sql, function (err, results) {

    try {


      if (results.recordset !== null) {

        Class_Data_Length = results.recordset.length;

        for (let i = 0; i < Class_Data_Length; i++) {

          /* For total classes */
          sql = "select COUNT(Roll_No) as [Total_Classes], Roll_No ,Course, Degree, Shift, Semester from AttendanceTbl where Course = '" + results.recordset[i].Course + "' AND Degree = '" + results.recordset[i].Degree + "' AND Shift = '" + results.recordset[i].Shift + "' AND Semester = '" + results.recordset[i].Semester + "' group by Roll_No, Course,  Degree, Shift, Semester";

          connection.query(sql, function (err, results) {


            Total_No_Of_Classes.push({
              Total_Classes: results.recordset[i].Total_Classes,
              Course: results.recordset[i].Course,
              Degree: results.recordset[i].Degree,
              Shift: results.recordset[i].Shift,
              Semester: results.recordset[i].Semester
            });

            // This Logic is used to Save Data only when 'Total_No_Of_Classes' Object is completely filled
            if (i === (Class_Data_Length - 1)) {
              setValue(Total_No_Of_Classes, "Total_No_Of_Classes");
            }


          });


        }// for loop END's

        /* For selecting DISTINCT Students of a Teacher */
        var sql = "Select DISTINCT Roll_No, Course, Degree , Shift , Semester from AttendanceTbl where Degree = '" + SelectedClassForThreshhHold + "' ";

        connection.query(sql, function (err, results) {

          if (results.recordset !== null) {

            Class_Distinct_Stu_Data_Length = results.recordset.length;

            for (let i = 0; i < Class_Distinct_Stu_Data_Length; i++) {

              /* For selecting total number of Classes taken by a Student of the given Teacher in a Specific Subject*/
              sql = "Select COUNT(Roll_No) as [Total_Classes_Taken_By_Each_Stu], Roll_No, Course, Degree, Shift, Semester from AttendanceTbl where Roll_No = '" + results.recordset[i].Roll_No + "' AND Status = 'Present' AND Course = '" + results.recordset[i].Course + "' AND Degree = '" + results.recordset[i].Degree + "' AND Shift = '" + results.recordset[i].Shift + "' AND Semester = '" + results.recordset[i].Semester + "' group by Roll_No, Course, Degree, Shift, Semester ";

              connection.query(sql, function (err, results) {

                try {
                  // Ye variables testing k liye bnay thy agr results.recordset k array se direct values bhi dali jain to koi frq nahi pare ga
                  let Total_Classes_By_Each_Stu = results.recordset[0].Total_Classes_Taken_By_Each_Stu;
                  let Course = results.recordset[0].Course;
                  let Degree = results.recordset[0].Degree;
                  let Shift = results.recordset[0].Shift;
                  let Semester = results.recordset[0].Semester;
                  let Roll_No = results.recordset[0].Roll_No;

                  Total_Classes_Taken_By_Each_Stu.push({
                    "Total_Classes_Taken_By_Each_Stu": Total_Classes_By_Each_Stu,
                    "Course": Course,
                    "Degree": Degree,
                    "Shift": Shift,
                    "Semester": Semester,
                    "Roll_No": Roll_No
                  });

                  // This Logic is used to Save Data only when 'Total_Classes_Taken_By_Each_Stu' Object is completely filled
                  if (i === (Class_Distinct_Stu_Data_Length - 1)) {
                    setValue(Total_Classes_Taken_By_Each_Stu, "Total_Classes_Taken_By_Each_Stu");

                    let DataForResponse = {
                      Total_No_Of_Classes: Total_No_Of_Classes,
                      Total_Classes_Taken_By_Each_Stu: Total_Classes_Taken_By_Each_Stu,
                    }

                    res.json(DataForResponse);
                    res.end();

                  }


                } catch (error) {

                  Total_Classes_Taken_By_Each_Stu.push({
                    "Total_Classes_Taken_By_Each_Stu": "",
                    "Course": "",
                    "Degree": "",
                    "Shift": "",
                    "Semester": "",
                    "Roll_No": ""
                  });

                  // This Logic is used to Save Data only when 'Total_Classes_Taken_By_Each_Stu' Object is completely filled
                  if (i === (Class_Distinct_Stu_Data_Length - 1)) {
                    setValue(Total_Classes_Taken_By_Each_Stu, "Total_Classes_Taken_By_Each_Stu");

                    let DataForResponse = {
                      Total_No_Of_Classes: Total_No_Of_Classes,
                      Total_Classes_Taken_By_Each_Stu: Total_Classes_Taken_By_Each_Stu,
                    }


                    res.json(DataForResponse);
                    res.end();
                  }

                  console.log("error");

                }

              });

            }// for loop END's

          }

        });

      }

    } catch (error) {
      console.log("No data found against given teacher ID.");
    }



  });

});



app.get('/GetLockDate/', function (req, res) {

  var sql = "SELECT TOP 1 * FROM Lock ORDER BY id DESC";

  connection.query(sql, function (err, results) {
    res.json(results.recordset);
    res.end();
  });

});
/* app.get('/SendShortAttendanceMessage/:ShortAttendanceStudentsData', function (req, res) {

  

}); */




/* * creating server * */
http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
