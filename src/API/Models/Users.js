var sql = require("mssql");
const db = require("../db");
const { response } = require("express");
const { render } = require("@testing-library/react");

//exports.Users 
Users = () => {
    var conn = new sql.ConnectionPool(db.dbConfig);
    let T_id = 2;
    conn.connect(

        function(err){
    
            if(err){
                
                console.log("not connected");
                throw err;
            }else{
                var req = new sql.Request(conn);
                req.query("select * from Users",function(err, recordsets)
                 {
                    if(err){
                        throw err;
                    }else 
                    { 
                        //render(recordsets);
                        console.log(recordsets);
                        
                        conn.close(); }
                 }
                    );
            }  
    
        }
    
    );

}

Users();