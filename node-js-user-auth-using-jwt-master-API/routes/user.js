/**
* Module dependencies.
*/

var jwt = require('jsonwebtoken');
var atob = require('atob');
var nodemailer = require('nodemailer');
//var Cryptr = require('cryptr'),
//cryptr = new Cryptr('myTotalySecretKey');

//------------------------------------------check user if already exist---------------------------------------------------

exports.check_user = function (req, res) {
	var user_name = req.body.check_user;
	var sql_username = "SELECT id FROM `login` WHERE `email`= '" + user_name + "'";
	var query = db.query(sql_username, function (err, result) {
		if (result == "") {
			res.json({
				"results":
					{ "status": "true" }
			});
			res.end();
		}
		else {
			res.json({
				"results":
					{ "status": "false" }
			});
			res.end();
		}
	});
};

//---------------------------------------signup services---------------------------------------------------------

exports.signup = function (req, res) {
	var fname = req.body.first_name;
	var lname = req.body.last_name;
	var pass = req.body.password;
	var email = req.body.email;
	var dec_pass = atob(pass);
	//var encrypted_pass = cryptr.encrypt(dec_pass);
	var sql = "INSERT INTO `login`(`id`,`first_name`,`last_name`,`email`,`password`) VALUES ('','" + fname + "','" + lname + "','" + email + "','" + encrypted_pass + "')";

	var query = db.query(sql, function (err, result) {
		res.end(JSON.stringify(result));
	});
};
//---------------------------------------login services----------------------------------------------------------
exports.signin = function (req, res) {
	var Email = req.body.email;
	var Pass = req.body.password;
	//var encrypted_pass = cryptr.encrypt(dec_pass);

	var sql = "SELECT id, Name, Email, Pass, Roll_id FROM Users WHERE Email='" + Email + "' and Pass = '" + Pass + "'";

	//console.log( "Query: = " + sql );
	db.query(sql, function (err, results) {
		if (results != "") {
			var data = JSON.stringify(results);
			var secret = 'TOPSECRETTTTT';
			var now = Math.floor(Date.now() / 1000),
				iat = (now - 10),
				expiresIn = 3600,
				expr = (now + expiresIn),
				notBefore = (now - 10),
				jwtId = Math.random().toString(36).substring(7);
			var payload = {
				iat: iat,
				jwtid: jwtId,
				audience: 'TEST',
				data: data
			};

			jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn: expiresIn }, function (err, token) {
				if (err) {
					res.json({
						"results":
						{
							"status": false,
							"msg": 'Error occurred while generating token'
						}
					});
				} else {
					if (token != false) {
						res.header();
						res.json({
							"results": {
								"status": true,
								"token": token,
								"userData": results.recordset,
							}
						});
						res.end();
					}
					else {
						res.json({
							"results":
								{ "status": false, "msg": 'Could not create token' },
						});
						res.end();
					}

				}
			});
		}
		else if (results == "") {
			res.json({
				"results":
					{ "status": false, "msg": 'User Not found!' }
			});
			res.end();
		}
	});

};


//---------------------------------------SaveStudentsData services----------------------------------------------------------
exports.SaveAttendance = function (req, res) {

	var updated_Data = req.body.updated_Data;
	var Data_length = req.body.Data_length;
	var T_id = req.body.T_id;
	var SelectedDateForUpdatingAtndnc = req.body.SelectedDateForUpdatingAtndnc;

	var Roll_No = updated_Data[0].Roll_No;
	var Degree = updated_Data[0].Degree;
	var Shift = updated_Data[0].Shift;
	var Semester = updated_Data[0].Semester;
	var Course_Name = updated_Data[0].Course_Name;
	var status = updated_Data[0].status;

	let date_ob = new Date();

	let CurrentDay = date_ob.getDate();
	let CurrentMonth = date_ob.getMonth() + 1;
	let CurrentYear = date_ob.getFullYear();

	console.log(SelectedDateForUpdatingAtndnc);
	if( SelectedDateForUpdatingAtndnc === false )
	{
		console.log(false);
	}
	else{
		console.log(SelectedDateForUpdatingAtndnc);
	}

	// To embed '0' on the left side of the CurrentDay
	if (CurrentDay < 10)
		CurrentDay = "0" + CurrentDay;

	// To embed '0' on the left side of the CurrentMonth
	if (CurrentMonth < 10)
		CurrentMonth = "0" + CurrentMonth;

	let FullCurrentDate = CurrentYear + "-" + CurrentMonth + "-" + CurrentDay;

	// console.log( FullCurrentDate );

	var sql = "SELECT * FROM AttendanceTbl WHERE Course = '" + Course_Name + "' AND Degree = '" + Degree + "' AND Shift = '" + Shift + "' AND Semester = '" + Semester + "' AND Date = '" + FullCurrentDate + "' ";

	db.query(sql, function (err, results) {

		if (results.recordsets != "") {

			for (let i = 0; i < Data_length; i++) {

				Roll_No = updated_Data[i].Roll_No;
				Degree = updated_Data[i].Degree;
				Shift = updated_Data[i].Shift;
				Semester = updated_Data[i].Semester;
				Course_Name = updated_Data[i].Course_Name;
				status = updated_Data[i].status;

				sql = "UPDATE AttendanceTbl SET Status = '" + status + "' WHERE id = " + results.recordset[i].id + " ";

				db.query(sql, function (err, results) {

					if (results) {
						//console.log(results);
						console.log("records updated")
					}
					else if (err) {
						console.log(err);
					}

				})

			}

			if (sql) {
				res.json({
					"response": "records_updated"
				});
				res.end();
			}
			else {
				res.json({
					"response": "records_not_updated"
				});
				res.end();
			}

		}
		else if (err) {
			console.log("There is a error in select query.")
		}
		else {
			//console.log("There is No Data")

			for (let i = 0; i < Data_length; i++) {
				Roll_No = updated_Data[i].Roll_No;
				Degree = updated_Data[i].Degree;
				Shift = updated_Data[i].Shift;
				Semester = updated_Data[i].Semester;
				Course_Name = updated_Data[i].Course_Name;
				status = updated_Data[i].status;

				sql = "INSERT INTO AttendanceTbl (Roll_No, Status, Course, Degree, Shift, Semester ,Date, T_id) VALUES ( '" + Roll_No + "', '" + status + "', '" + Course_Name + "' , '" + Degree + "' , '" + Shift + "' , '" + Semester + "' , '" + FullCurrentDate + "' , '" + T_id + "' )";

				db.query(sql, function (err, results) {

					if (results) {
						// console.log(results);
						console.log("records inserted")
					}
					else if (err) {
						console.log(err);
					}

				})

			}

			if (sql) {
				res.json({
					"response": "records_inserted"
				});
				res.end();
			}
			else {
				res.json({
					"response": "records_not_inserted"
				});
				res.end();
			}

		}


	});


}


//---------------------------------------SaveShortAttendanceCriteria services----------------------------------------------------------
exports.SaveShortAttendanceCriteria = function (req, res) {

	var ShortAttendanceCriteria = req.body.ShortAttendanceCriteria;

	var sql = "select * from Short_Attendance_Criteria";
	//  sql = "INSERT INTO Short_Attendance_Criteria (id, Criteria) VALUES (1, '" + ShortAttendanceCriteria + "' ) ";

	db.query(sql, function (err, results) {

		// If Short Attendance Criteria is already Set then we will update that Criteria with the new one 
		if (results.recordsets !== "") {

			sql = "UPDATE Short_Attendance_Criteria SET Criteria = '" + ShortAttendanceCriteria + "' WHERE id = 1 ";

			db.query(sql, function (err, results) {

				if (err) {
					console.log(err);
				}
				else {
					res.json({
						"response": "criteria_updated"
					});
					res.end();
				}

			});

		}


	})

}



//---------------------------------------SendShortAttendanceEmailing services----------------------------------------------------------
exports.SendShortAttendanceMessage = function (req, res) {

	let ShortAttendanceStudentsData = req.body.ShortAttendanceStudentsData;

	let Parents_id = false;
	/* let Parents_id_Data_Length = 0; */
	var sql = false;

	sql = "select P_id, Roll_No from enrolledStudents where Roll_No = '" + ShortAttendanceStudentsData[0].Roll_No + "' ";

	db.query(sql, function (err, results) {

		Parents_id = results.recordset;

		sql = "select * from Users where id = " + Parents_id[0].P_id;

		db.query(sql, function (err, results) {

			// console.log(results.recordset);		

			let transporter = nodemailer.createTransport({
				service: 'gmail',
				auth: {
					user: 'mirzaabdullahizhar@gmail.com',
					pass: 'difficult#@PASSWORD'
				}
			});

			let mailOptions = {
				from: 'mirzaabdullahizhar@gmail.com',
				to: results.recordset[0].Email,
				subject: 'BIIT - Short Attendance Notification',
				text: 'Kindly inform your kid that his/her attendance is short.'
			};

			transporter.sendMail(mailOptions, function (error, info) {
				if (error) {
					console.log(error);
				} else {
					console.log('Email sent: ' + info.response);
				}

			});

			res.json({
				"response": "Mail Sent Successfully!"
			});
			res.end();
		});

	});


	/* for (let i = 0; i < ShortAttendanceStudentsData.length; i++) {
		sql = "select P_id, Roll_No from enrolledStudents where Roll_No = '" + ShortAttendanceStudentsData[i].Roll_No + "' ";

		db.query(sql, function (err, results) {

			// console.log( results.recordset );
			Parents_id.push( results.recordset[i].P_id );

		});

	}//for loop ends */

}



//---------------------------------------SendShortAttendanceEmailing services----------------------------------------------------------
exports.SaveLockDays = function (req, res) {

	let No_of_days_for_locking = req.body.No_of_days_for_locking;
	let From_Date = req.body.From_Date;
	let To_Date = req.body.To_Date;

	var sql = "INSERT INTO Lock (Day, From_Date, To_Date) Values ( " + No_of_days_for_locking + "  , '" + From_Date + "', '" + To_Date + "' )";

	db.query(sql, function (err, results) {

		if (err === null) {
			res.json({
				"response": "Lock Days Set For Teachers!"
			});
			res.end();
		}
		else{
			res.json({
				"response": "Sorry, there is some issue in inserting the No# of Lock Days!"
			});
			res.end();
			console.log(err);
		}


	});

}


