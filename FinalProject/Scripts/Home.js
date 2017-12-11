var Home = {}
var currentUser;  //stores username for current user

////////////////////////////////////////////
///////////////////////////////////////////
Home.CreateAccountButtonClick = function ()
{
    $(".usernameErrorCreate").hide();
    $(".passwordErrorCreate").hide();
    $(".emailError").hide();
    $(".repeatEmailError").hide();

    $.ajax
    ({
        url: "Home/CreateAccount",
        data:
        {
            Username : $(".createUserNameInput").val(),
            Password : $(".createPasswordInput").val(),
            EmailAdd : $(".createEmailInput").val(),
            EmailCon : $(".repeatEmailInput").val()
        },
        success: function (raw) {
            var object = JSON.parse(raw);

            //error handling for account creation
            if (object.Message != "Success") {
                if (object.Username != "Good") {
                    $(".usernameErrorCreate").show();
                    if (object.Username == "Invalid")
                        $(".usernameErrorCreate").html(object.Username + ":  Must be at least 6 characters");
                    if (object.Username == "Exists")
                        $(".usernameErrorCreate").html("Username is already taken");
                }
                if (object.Password != "Good") {
                    $(".passwordErrorCreate").show();
                    $(".passwordErrorCreate").html(object.Password + ":  Must be at least 6 characters");
                }
                if (object.EmailAdd != "Good") {
                    $(".emailError").show();
                    $(".emailError").html(object.EmailAdd + ":  Must have a value and contain @");
                }
                if (object.EmailCon != "Good") {
                    $(".repeatEmailError").show();
                    if(object.EmailCon == "Invalid")
                        $(".repeatEmailError").html(object.EmailCon + ":  Must have a value");
                    if(object.EmailCon == "Mismatch")
                        $(".repeatEmailError").html(object.EmailCon + ":  Must match Email Address");
                }
            }
            //successful account creation
            else if (object.Message == "Success") {
                currentUser = $(".createUserNameInput").val();
                $(".loginPage").hide();
                $(".infoPage").show();

                //get the account info
                Home.GetAccountInfo(currentUser);
            }//end successful login

        }//end success function
    });
}//end create account function


////////////////////////////////////
///////////////////////////////////
Home.LoginButtonClick = function ()
{
    $(".usernameErrorLogin").hide();
    $(".passwordErrorLogin").hide();

    $.ajax
    ({
        url: "Home/Login",
        data:
        {
            Username: $(".loginUserNameInput").val(),
            Password: $(".loginPasswordInput").val()
        },
        success: function (raw) {
            var object = JSON.parse(raw);

            //error handling for login
            if (object.Message != "Success") {
                if (object.Username == "Invalid") {
                    $(".usernameErrorLogin").show();
                    $(".usernameErrorLogin").html(object.Username + ":  Must be an existing account username");
                }
                if (object.Password == "Wrong") {
                    $(".passwordErrorLogin").show();
                    $(".passwordErrorLogin").html("Wrong password for existing account");
                }
            }
            //successful login
            else if(object.Message == "Success")
            {
                currentUser = $(".loginUserNameInput").val();
                $(".loginPage").hide();
                $(".infoPage").show();

                //get the account info
                Home.GetAccountInfo(currentUser);
            }//end successful login
        }//end success function
    });
}//end login function


/////////////////////////////////////////
////////////////////////////////////////
Home.AddElementButtonClick = function ()
{
    $(".addNameError").hide();
    $(".addValueError").hide();

    //error messages if no input when button clicked
    if ($(".ElementNameInput").val() == "") {
        $(".addNameError").show();
        $(".addNameError").html("Must Enter A Name");
    }
    if ($(".ElementValueInput").val() == "") {
        $(".addValueError").show();
        $(".addValueError").html("Must Enter A Value");
    }
    else {
        $.ajax
        ({
            url: "Home/AddOrUpdateElement",
            data:
            {
                Username: currentUser,
                ElementName: $(".ElementNameInput").val(),
                ElementValue: $(".ElementValueInput").val()
            },
            success: function (raw) {
                var object = JSON.parse(raw);

                //error handling for add button
                if (object.Error == "Cannot Change Username") {
                    $(".addNameError").show();
                    $(".addNameError").html(object.Error);
                }
                if (object.Error == "Cannot Have Spaces In Element Name") {
                    $(".addNameError").show();
                    $(".addNameError").html(object.Error);
                }
                //successful add
                else
                    Home.GetAccountInfo(currentUser);
            }
        });
    }
}//end add element function


/////////////////////////////////////////
////////////////////////////////////////
Home.UpdateInfoButtonClick = function ()
{
    alert("update");
}


/////////////////////////////////////
////////////////////////////////////
Home.GetAccountInfo = function(user)
{
    $(".infoPageTop").empty();
    $.ajax
    ({

        url: "Home/GetAccountInformation",
        data:
        {
            Username: user
        },
        success: function (rawInfo) {
            var accountData = JSON.parse(rawInfo);
            var accountInfo = accountData.Payload;
            var Info = JSON.parse(accountInfo);
            var info = Info.account;

            var z = Object.keys(info);
            for (var j = 0; j < z.length; j++) {
                if (z[j] != "password")//do not display password
                {

                    if (j == 0) {
                        //display username
                        var newDiv = document.createElement("div");
                        newDiv.innerHTML = z[j];
                        newDiv.id = "label" + j;
                        newDiv.className = "displayLabel";
                        $(".infoPageTop").append(newDiv);
                        var newDiv = document.createElement("div");
                        newDiv.innerHTML = info[z[j]];
                        newDiv.id = "textField" + j;
                        newDiv.className = "displayField";
                        $(".infoPageTop").append(newDiv);
                        $(".infoPageTop").append("<br/>");
                    }
                    else {
                        //display the rest of the info
                        //display element name
                        var newDiv = document.createElement("div");
                        newDiv.innerHTML = z[j];
                        newDiv.id = "label" + j;
                        newDiv.className = "displayLabel";
                        $(".infoPageTop").append(newDiv);
                        //display element value
                        var newInput = document.createElement("input");
                        newInput.type = "text";
                        newInput.value = info[z[j]];
                        newInput.id = "textField" + j;
                        newInput.className = "displayField";
                        $(".infoPageTop").append(newInput);
                        //display update button
                        var newButton = document.createElement("input");
                        newButton.type = "button";
                        newButton.value = "update";
                        newButton.id = "button" + j;
                        newButton.className = "updateButton";
                        newButton.onclick = Home.UpdateInfoButtonClick;
                        $(".infoPageTop").append(newButton);
                        $(".infoPageTop").append("<br/>");
                    }
                }
            }
        }
    });
}//end get account info function


//////////////////////////////
/////////////////////////////
$(document).ready(function ()
{
    //hide error messages
    $(".usernameErrorLogin").hide();
    $(".passwordErrorLogin").hide();
    $(".usernameErrorCreate").hide();
    $(".passwordErrorCreate").hide();
    $(".emailError").hide();
    $(".repeatEmailError").hide();
    $(".addNameError").hide();
    $(".addValueError").hide();
    //hide second page
    $(".infoPage").hide();
    //add click events to the buttons
    $(".CreateAccountButton").click(Home.CreateAccountButtonClick);
    $(".LoginButton").click(Home.LoginButtonClick);
    $(".addInfoButton").click(Home.AddElementButtonClick);
    $(".updateButton").click(Home.UpdateInfoButtonClick);
});

