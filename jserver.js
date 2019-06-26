var http = require("http");
var express = require('express');
var app = express();
var request = require('request');
var bodyParser = require('body-parser');
var fs = require('fs');
var beautify = require('js-beautify').js;

var urlencodedParser = bodyParser.urlencoded({ extended: true });

app.use(express.static(__dirname + '/images/'));


// Running Server Details.
var server = app.listen(8080, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at %s:%s Port", host, port)
});

app.get('/jobandperson.html', function (req, res) {
  fs.readFile("jobandperson.html",function (err, data){
        res.writeHead(200, {'Content-Type': 'text/html','Content-Length': data.length});
        res.write(data);
        res.end();
    });
});

app.get('/', function (req, res) {
  fs.readFile("main.html",function (err, data){
        res.writeHead(200, {'Content-Type': 'text/html','Content-Length': data.length});
        res.write(data);
        res.end();
    });
});

app.post('/result', urlencodedParser, function (req, res){
  var theJob = req.body.job;
  var thePerson = req.body.person;

  var options = { method: 'POST',
    url: 'https://dev.api.ibm.com/watsontalent/development/match?version=1',
    headers:
     { 'Accept': 'application/json',
       'Content-type': 'multipart/form-data',
       'x-ibm-client-secret': ADD YOUR IBM CLIENT SECRET HERE,
       'x-ibm-client-id': ADD YOUR IBM CLIENT SECRET HERE },
       formData:
        {
          rawJob: theJob.toString(),
          rawPerson: thePerson.toString() }
      };


    var req = request(options, function (error, response, body) {
        if (error) throw new Error(error);
        console.log( "status: " + response.statusCode);
        // look for the score data
        var matchResult = JSON.parse(body);

        var beautified = beautify(body, { indent_size: 2, space_in_empty_paren: true, eol: "<br>"});

        var requiredSkillScore = matchResult.match.scores.requiredSkillScore;
        var matchScore = matchResult.match.scores.matchScore;
        var foundationalSkillScore = matchResult.match.scores.foundationalSkillScore;

        fs.readFile("thank.html",function (err, htmlData){

        var data = htmlData;
        data += '<script>function toggleView( ){ if (document.getElementById(\'complete-response\').style.display == \'none\') document.getElementById(\'complete-response\').style.display = \'block\'; else document.getElementById(\'complete-response\').style.display = \'none\';}</script>';
        data += '<h7>Required Skill Score: ' + requiredSkillScore + '</h7><br>';
        data += '<div style="height:10px"></div>';
        data += '<h7>Match Score: ' + matchScore + '</h7><br>';
        data += '<div style="height:10px"></div>';
        data += '<h7>Foundational Skill Score: ' + foundationalSkillScore + '</h7><br>';
        data += '<div style="height:20px"></div>';
        data += '<p>For the complete set: <a href="#" onclick="toggleView();">Click here</a>';
        data += '<div id="complete-response" style="display:none;">Response: ' + beautified + '</div></p>';
        data += '</div></body></html>';

        res.writeHead(200, {'Content-Type': 'text/html','Content-Length': data.length});
        res.write(data);
        res.end();
        });
      });
 });
