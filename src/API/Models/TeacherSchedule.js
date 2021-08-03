var sql = require("mssql");
const db = require("../db");


exports.TeacherSchedule = () => {
    var conn = new sql.ConnectionPool(db.dbConfig);
    let T_id = 2;
    conn.connect(

        function(err){
    
            if(err){
                
                console.log("not connected");
                throw err;
            }else{
                var req = new sql.Request(conn);
                req.query("select * from TeachersSchedule where T_id = " + T_id,
                 function(err, recordsets)
                 {
                    if(err){
                        throw err;
                    }else 
                    { 
                        console.log(recordsets);
                        conn.close(); }
                 }
                    );
            }  
    
        }
    
    );

}

//TeacherSchedule();