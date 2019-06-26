# IBM Watson Talent Services talent-match-app
This is a node server that demonstrates using the IBM Watson Talent Match API.


This application provides a straight forward user experience, and uses IBM's Carbon Design system for the style and design of the experience. 

### The basic flow for the experience

This simple application has three important sequences for the experience. 

**First** there is the default landing page, which guides the user to begin the experience. 

![Landing screen](https://github.com/watson-talent-services/talent-match-app/blob/master/documentation-images/TMA1.png)

Then an animated form is displayed, first requesting the text for a Job Description. 

![Job Description](https://github.com/watson-talent-services/talent-match-app/blob/master/documentation-images/TMA2.png)

Once the user enters the information, the Continue button is enabled and the user can proceed to the next part. 

![Filled in Job Description](https://github.com/watson-talent-services/talent-match-app/blob/master/documentation-images/TMA3.png)

The page animates and the second part of the form is shown, asking for the Person's resume to be added. 

![Person Resume](https://github.com/watson-talent-services/talent-match-app/blob/master/documentation-images/TMA4.png)

Once that is added, the submit button is enabled and the two items are submitted. 

![Filled in Person Resume](https://github.com/watson-talent-services/talent-match-app/blob/master/documentation-images/TMA5.png)

The Talent Match API is called and the result is returned. 

The main scoring elements are shown, **Required Skill Score**, **Match Score**, and **Foundational Skill Score**. 

![Main Result](https://github.com/watson-talent-services/talent-match-app/blob/master/documentation-images/TMA6.png)

Also there is a link shown which when clicked will show a hidden div element, that has the entire JSON body result. 

![Detailed Result](https://github.com/watson-talent-services/talent-match-app/blob/master/documentation-images/TMA7.png)

### How the code works

The node server here is pretty straight forward. The main item that handles the Talent Match API call sets up the POST call to the IBM Watson Talent services. 

```
jopbandperson.html

          <div id="job-info-area" style="width:60%;min-height:100%;margin-left:35px;">
          <h1 style="padding-top:25px">Section 1/2</h1>
          <h5 style="padding-top:5%;">Please add your job description.</h5>
            <p>Let's start with the complete job description, please paste or enter your information.</p>
            <div id='wts-frame' style='margin-top:50px;'>
                <div class="bx--form-item">
                  <textarea id='job-info' onkeypress="checkValid('job-info', 'next-button-1');" onpaste="checkPaste('next-button-1');" class="bx--text-area bx--text-area--v2" rows="12" cols="50" placeholder="Enter your job description"></textarea>
                </div>
            </div>
            <button type="button" class="bx--btn bx--btn--primary" onclick="showHide( 'person-info-area', 'job-info-area'); setJob();" disabled id="next-button-1" style="margin-top:40px;">Continue</button>
          </div>


This code serves as the form for input, it has two main divs, the first is for the job info. 
There is a function which checks for input and will enable the continue button. 
When selected, this scrolls to the second div, where we collect the resume information of the person.

Again we check for input to enable the submit button.
```

Once the information is submitted, the server will process it to pass to the Talent Match API.

```
in the file jserver.js you will see where we process for the result. 

You will need to add your secret and id here to make the call work. 

We create a formData object and set the rawJob to be the job description string, 
and the rawPerson to be the person resume string. 

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

```

The call itself is straight forward REST

```
we form the request, and extract the three main items for scores.

var req = request(options, function (error, response, body) {
        if (error) throw new Error(error);
        console.log( "status: " + response.statusCode);
        // look for the score data
        var matchResult = JSON.parse(body);

        var beautified = beautify(body, { indent_size: 2, space_in_empty_paren: true, eol: "<br>"});

        var requiredSkillScore = matchResult.match.scores.requiredSkillScore;
        var matchScore = matchResult.match.scores.matchScore;
        var foundationalSkillScore = matchResult.match.scores.foundationalSkillScore;

```

And for the detailed full result, we form the HTML response using a hidden div, connected to an anchor tag to toggle the show/hide

```
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

```

### What you need to do now

Please refer to the developer experience we have in GitHub - you can get started here - [IBM Watson Talent Services - Get Started](https://github.com/watson-talent-services/developer-documents/blob/master/get-started/get-started.md).

And you will need to start your free trial so you can get your credentials. You can follow this guide, [Talent Match Key Generation Steps(https://github.com/watson-talent-services/developer-documents/blob/master/developer-guide/v1-trial-reg-guide.md).

Enjoy!
