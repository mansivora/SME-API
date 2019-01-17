var sql = require("mssql");  
var connect = function()  
{  
    var conn = new sql.ConnectionPool({ 
        user: 'sa',  
        password: 'xxxxxxx',  
        server: 'xxxxxxxx',
        database: 'AMLTHA',
        options: {           
            encrypt: false
        }
      
    });  
  
    return conn;  
};  
  
module.exports = connect; 