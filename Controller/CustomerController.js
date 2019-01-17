var express = require('express');  
var router = express.Router();  
var sql = require("mssql");  
var conn = require("../connection/Connect")();  
var commonFun = require("../Common/commonFun"); 
var logger = require('morgan');
var app = express();
var jwt = require('jsonwebtoken');
app.use(logger('dev'));
app.set('superSecret', "demo");

router.use(function(req, res, next) {
    var token = req.body.token || req.query.token || req.headers['authorization'];
    commonFun.tokenGen(token,req, res, next);
});

var routes = function(){


    router.route('/MasterListAll/:id')
    .get(function(req,res){
        var _tempcustomerid = req.params.id;  
        conn.connect().then(function ()   
        { 
            var request = new sql.Request(conn);
            request.input("ptempcustomerid", sql.Int, _tempcustomerid)    
            request.execute('tempcustomermaster_listall').then(function (recordset)   
                {  
                    res.json(recordset.recordset);  
                    conn.close();  
                }) 
                .catch(function (err) {  
                    conn.close();  
                    commonFun.errorLog(err);
                    var errortxt=err.originalError.info.message;
                    if(errortxt.indexOf("10")>=0){
                        errortxt=""+err.originalError.info.message;
                    }else{
                         errortxt="400 - Bad Request."
                    }
                    res.status(400).json({
                        success: false,
                        message: errortxt
                    });    
                });  
        })
        .catch(function (err) {  
            conn.close();  
            commonFun.errorLog(err);
            res.status(500).json({
                success: false,
                message: '500 - Server error.'
            });  
        });  
    });

    router.route('/DetailsListAll/:id')
    .get(function(req,res){
        var _tempcustomerid = req.params.id;  
        conn.connect().then(function ()   
        { 
            var request = new sql.Request(conn);
            request.input("ptempcustomerid", sql.Int, _tempcustomerid)    
            request.execute('tempcustomerdetail_listall').then(function (recordset)   
                {  
                    res.json(recordset.recordset);  
                    conn.close();  
                }) 
                .catch(function (err) {  
                    conn.close();  
                    commonFun.errorLog(err);
                    var errortxt=err.originalError.info.message;
                    if(errortxt.indexOf("10")>=0){
                        errortxt=""+err.originalError.info.message;
                    }else{
                         errortxt="400 - Bad Request."
                    }
                    res.status(400).json({
                        success: false,
                        message: errortxt
                    });    
                });  
        })
        .catch(function (err) {  
            conn.close();  
            commonFun.errorLog(err);
            res.status(500).json({
                success: false,
                message: '500 - Server error.'
            });  
        });  
    });

    router.route('/MasterAdd/')  
    .post(function (req, res) {  
        conn.connect().then(function () {  
            var transaction = new sql.Transaction(conn);  
            transaction.begin().then(function () {  
                var request = new sql.Request(transaction); 
                request.output("tempcustomerid", sql.Int);
                request.input("pname", sql.VarChar, req.body.name);
                request.input("pcustomertypeid", sql.Int, req.body.customertypeid);
                request.input("pcompanytypeid", sql.Int, req.body.companytypeid);
                request.input("pothercompanytype", sql.VarChar, req.body.othercompanytype == null ? "":req.body.othercompanytype);
                request.input("plicno", sql.VarChar, req.body.licno == null ? "":req.body.licno);
                request.input("plicexpdate", sql.DateTime, new Date(req.body.licexpdate));
                request.input("plicauth", sql.VarChar, req.body.licauth);
                request.input("pinccountryid", sql.Int, req.body.inccountryid);
                request.input("pincdate", sql.DateTime, new Date(req.body.incdate));
                request.input("pbusactivity", sql.VarChar, req.body.busactivity == null ? "":req.body.busactivity);
                request.input("ptelno", sql.VarChar, req.body.telno);
                request.input("pwebsite", sql.VarChar, req.body.website == null ? "":req.body.website);
                request.input("pcurrencyid", sql.Int, req.body.currencyid == null ? 0:req.body.currencyid);
                request.input("pannturnover", sql.Decimal, req.body.annturnover == null ? 0:req.body.annturnover);
                request.input("pnoofemp", sql.VarChar, req.body.noofemp == null ? "":req.body.noofemp);
                request.input("pfirstname", sql.VarChar, req.body.firstname);
                request.input("plastname", sql.VarChar, req.body.lastname);
                request.input("pmobileno", sql.VarChar, req.body.mobileno);
                request.input("pdesignationid", sql.Int, req.body.designationid);
                request.input("potherdesignation", sql.VarChar, req.body.otherdesignation == null ? "":req.body.otherdesignation);
                request.input("pemailid", sql.VarChar, req.body.emailid);
                request.input("pcreateip", sql.VarChar, req.connection.remoteAddress);

                request.execute("tempcustomermaster_add").then(function (recordset) {  
                    transaction.commit().then(function (err) {
                        conn.close();  
                           //res.json(recordset.output);
                           var Id =recordset.output.tempcustomerid;
                         res.status(200).json( {
                            success: true,
                             message: 'successful',
                             Id
                         });
                    }).catch(function (err) {  
                        conn.close();  
                        commonFun.errorLog(err);
                        res.status(404).json( {
                            success: false,
                            message: '404 - Not Found.'
                        });  
                    });  
                }).catch(function (err) {  
                    conn.close();  
                    commonFun.errorLog(err);
                    var errortxt=err.originalError.info.message;
                    if(errortxt.indexOf("10")>=0){
                        errortxt=""+err.originalError.info.message;
                    }else{
                         errortxt="400 - Bad Request."
                    }
                    res.status(400).json({
                        success: false,
                        message: errortxt
                    });        
                });  
            }).catch(function (err) {  
                conn.close();  
                commonFun.errorLog(err);
                res.status(404).json( {
                    success: false,
                    message: '404 - Not Found.'
                });      
            });  
        }).catch(function (err) {  
            conn.close();  
            commonFun.errorLog(err);
            res.status(500).json({
                success: false,
                message: '500 - Server error.'
            });        
        });  
    }); 

    router.route('/DetailsAdd/')  
    .post(function (req, res) {  
        conn.connect().then(function () {  
            var transaction = new sql.Transaction(conn);  
            transaction.begin().then(function () {  
                var request = new sql.Request(transaction);  
               
                request.output("ptempcustomerdetid", sql.Int);
                request.input("ptempcustomerid", sql.Int, req.body.tempcustomerid);
                request.input("pname", sql.VarChar, req.body.name);
                request.input("pcountryid", sql.Int, req.body.countryid);
                request.input("pwebsite", sql.VarChar, req.body.website == null ? "":req.body.website);
                request.input("pindustryid", sql.Int, req.body.industryid == null ? 0:req.body.industryid);
                request.input("potherindustry", sql.VarChar, req.body.otherindustry == null ? "":req.body.otherindustry);
                request.input("pproject", sql.VarChar, req.body.project == null ? "":req.body.project);
                request.input("pcurrencyid", sql.Int, req.body.currencyid == null ? 0:req.body.currencyid);
                request.input("pannsales", sql.Decimal, req.body.annsales == null ? 0:req.body.annsales);
                request.input("pcommterms", sql.VarChar, req.body.commterms);
                request.input("pothercommterms", sql.VarChar, req.body.othercommterms == null ? "":req.body.othercommterms);
                request.input("pfirstname", sql.VarChar, req.body.firstname);
                request.input("plastname", sql.VarChar, req.body.lastname);
                request.input("pdesignationid", sql.Int, req.body.designationid);
                request.input("potherdesignation", sql.VarChar, req.body.otherdesignation == null ? "":req.body.otherdesignation);
                request.input("pmobileno", sql.VarChar, req.body.mobileno);
                request.input("pemailid", sql.VarChar, req.body.emailid);
                request.input("pcreateip", sql.VarChar, req.connection.remoteAddress);

                request.execute("tempcustomerdetail_add").then(function (recordset) {  
                    transaction.commit().then(function (err) {
                        conn.close();  
                        //res.json(recordSet.recordset);
                        var Id =recordset.output.ptempcustomerdetid;
                        res.status(200).json( {
                            success: true,
                            message: 'successful',
                            Id
                        });
                    }).catch(function (err) {  
                        conn.close();  
                        commonFun.errorLog(err);
                        res.status(404).json( {
                            success: false,
                            message: '404 - Not Found.'
                        });  
                    });  
                }).catch(function (err) {  
                    conn.close();  
                    commonFun.errorLog(err);
                    var errortxt=err.originalError.info.message;
                    if(errortxt.indexOf("10")>=0){
                        errortxt=""+err.originalError.info.message;
                    }else{
                         errortxt="400 - Bad Request."
                    }
                    res.status(400).json({
                        success: false,
                        message: errortxt
                    });        
                });  
            }).catch(function (err) {  
                conn.close();  
                commonFun.errorLog(err);
                res.status(404).json( {
                    success: false,
                    message: '404 - Not Found.'
                });      
            });  
        }).catch(function (err) {  
            conn.close();  
            commonFun.errorLog(err);
            res.status(500).json({
                success: false,
                message: '500 - Server error.'
            });        
        });  
    }); 


    router.route('/CustomerDocAdd/')  
    .post(function (req, res) {  
        conn.connect().then(function () {  
            var transaction = new sql.Transaction(conn);  
            transaction.begin().then(function () {  
                var request = new sql.Request(transaction);  
                request.input("ptempcustomerid", sql.Int, req.body.tempcustomerid);
                request.input("pdocupload", sql.VarBinary, req.body.docupload);

                request.execute("tempcustomerdocs_add").then(function () {  
                    transaction.commit().then(function (err, recordSet) {
                        conn.close();  
                        //res.json(recordSet.recordset);
                        res.status(200).json( {
                            success: true,
                            message: 'successful'
                        });
                    }).catch(function (err) {  
                        conn.close();  
                        commonFun.errorLog(err);
                        res.status(404).json( {
                            success: false,
                            message: '404 - Not Found.'
                        });  
                    });  
                }).catch(function (err) {  
                    conn.close();  
                    commonFun.errorLog(err);
                    var errortxt=err.originalError.info.message;
                    if(errortxt.indexOf("10")>=0){
                        errortxt=""+err.originalError.info.message;
                    }else{
                         errortxt="400 - Bad Request."
                    }
                    res.status(400).json({
                        success: false,
                        message: errortxt
                    });        
                });  
            }).catch(function (err) {  
                conn.close();  
                commonFun.errorLog(err);
                res.status(404).json( {
                    success: false,
                    message: '404 - Not Found.'
                });      
            });  
        }).catch(function (err) {  
            conn.close();  
            commonFun.errorLog(err);
            res.status(500).json({
                success: false,
                message: '500 - Server error.'
            });        
        });  
    });

    return router;

};
module.exports=routes;