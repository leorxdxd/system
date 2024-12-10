window.onload = function() {
};
function clearInputs(){
    const loginUsername = document.getElementById('loginU');
    const loginPassword = document.getElementById('loginP');
    loginUsername.value = "";
    loginPassword.value = "";
    const signupUsername = document.getElementById('signupU');
    const signupPassword = document.getElementById('pass');
    const signupCPassword = document.getElementById('cpass');
    const signupemail = document.getElementById('signupE');
    signupUsername.value = "";
    signupPassword.value = "";
    signupCPassword.value = "";
    signupemail.value = "";
    document.getElementById("cpass").style.display = "none";
}
var valueholder = "A";
var getcode = 0;
var email = "";
function checkemail(){
    if(valueholder=="A"){
        var email = document.getElementById("emailtext").value
        const storeemail = localStorage.getItem('email');
        if(email){
            if(email == storeemail ){
                document.getElementById("vcodetitle").textContent = "Enter your verification code";
                document.getElementById("send").textContent = "Confirm Verification Code";
                document.getElementById("emailtext").disabled = true;
                document.getElementById("vcodetext").type = "text";
                valueholder = "B";
                const operation = "resetpass";
                const email = localStorage.getItem('email');  
                const username = localStorage.getItem('username');  

            if (email && username) {
                fetch('emailM.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({
                        'Email': email,
                        'Username': username,
                        'Operation': operation
                    })
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Network response was not OK: ${response.status} - ${response.statusText}`);
                    }
                    return response.text();
                })
                .then(data => {
                    console.log("PHP Response:", data);
                    alert(data); 
                })
                .catch(error => {
                    console.error('Error verifying PHPMailer:', error);
                    alert('Error verifying PHPMailer: ' + error.message);
                });
            } else {
                alert('Email or username not found in local storage.');
            }
            }else{
                alert("The email you entered is not the linked email in your account.");
                document.getElementById("emailtext").value = "";
            }
            
        }else{
            alert('Input a valid value!');
        }
    }else if(valueholder == "B"){
        alert("Confirming Verification Code");
        const vCode = document.getElementById("vcodetext").value;
        if (vCode) {
            
            if (getcode == vCode) { 
                alert("Verification Code is Correct");
                document.querySelector(".Vcodecontainer").style.display = 'none';
                document.querySelector(".updatepass").style.display = 'flex';
            } else {
                alert("Verification Code is incorrect!");
                document.getElementById("vcodetext").value = "";
            }
    
        } else {
            alert("Please input a valid value!");
        }
    
    }else if(valueholder =="C"){
        const operation = "forgotpass";
        email = document.getElementById("emailtext").value;
        localStorage.setItem('Email',email);
        document.getElementById("vcodetitle").textContent = "Enter your verification code";
        document.getElementById("send").textContent = "Confirm Verification Code";
        document.getElementById("emailtext").disabled = true;
        document.getElementById("vcodetext").type = "text";
        valueholder = "B";
        if(email){
            fetch('emailM.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    'Email': email,
                    'Operation': operation,
                    'Code': getcode
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not OK: ${response.status} - ${response.statusText}`);
                }
                return response.text();
            })
            .then(data => {
                console.log("PHP Response:", data);
                alert(data);  
            })
            .catch(error => {
                console.error('Error verifying PHPMailer:', error);
                alert('Error verifying PHPMailer: ' + error.message);
            });
        }else{
            alert('Input a valid value!');
        }
    }

}
function generateVerificationCode(length = 6) {
    const characters = "0123456789";
    getcode = "";
    for (let i = 0; i < length; i++) {
        getcode += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return getcode;
}
function forgotbtn(){
   valueholder = "C";
   generateVerificationCode();
   showupdate();
}
function showupdate(){
    document.querySelector(".Vcodecontainer").style.display = "flex";
    document.querySelector(".login").style.display = "none";
    document.querySelector(".signup").style.display = "none";
}
var check = "";

function checkPasswordConditions() {
    var password;
    var confirmPasswordLabel;
    var confirmPasswordInput;
    if(check == "A"){
        password = document.getElementById("password").value;
        confirmPasswordLabel = document.getElementById("confirmPasswordLabel");
        confirmPasswordInput = document.getElementById("confirmPassword");
    }else if(check == "B"){
        password = document.getElementById("pass").value;
        confirmPasswordInput = document.getElementById("cpass");
    }
    
    const conditions = {
        minLength: /.{8,}/.test(password),  
        number: /\d/.test(password),  
        specialChar: /[@$!%*?&.]/.test(password),  
        caseCombination: /[a-z]/.test(password) && /[A-Z]/.test(password)  
    };
    // Check each condition and hide the respective list item when condition is met
    document.getElementById("minLength").style.display = conditions.minLength ? 'none' : 'list-item';
    document.getElementById("number").style.display = conditions.number ? 'none' : 'list-item';
    document.getElementById("specialChar").style.display = conditions.specialChar ? 'none' : 'list-item';
    document.getElementById("caseCombination").style.display = conditions.caseCombination ? 'none' : 'list-item';
    // Show Confirm Password field only if all conditions are met
    const allConditionsMet = Object.values(conditions).every(Boolean); 
    if (allConditionsMet) {
        if(check == "A"){
            confirmPasswordInput.style.display = 'block';
        }else if (check == "B"){
            confirmPasswordInput.style.display = 'block';
            document.getElementById("notifpass").style.display = 'none';
        }
    } else {
        if(check == "A"){
            confirmPasswordLabel.style.display = 'none';
            confirmPasswordInput.style.display = 'none';
        }else if (check == "B"){
            confirmPasswordInput.style.display = 'none';
            document.getElementById("notifpass").style.display = 'block';
        }
       
    }
}
function checkinputA(){
    check= "A";
    checkPasswordConditions();
}
function checkinputB(){
    check= "B";
    checkPasswordConditions();
}
document.getElementById("password").addEventListener("input", checkinputA);
function validateForm() {
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const passwordError = document.getElementById("passwordError");
    const oldpassword = localStorage.getItem('password');
    const confirmPasswordError = document.getElementById("confirmPasswordError");

    // Final validation check before submission
    if (document.querySelectorAll('.password-conditions li[style="display: none;"]').length !== 4) { 
        passwordError.textContent = "Your password is not safe. Please meet all conditions.";
        return false; // Prevent form submission
    } else {
        passwordError.textContent = ""; 
    }

    // Check if password and confirmPassword match
    if (password !== confirmPassword ) {
        alert("Passwords do not match!");
        document.getElementById("confirmPassword").value = "";
        return false; 
    } else if (password == oldpassword) {
        alert("You haven't made any changes!");
        document.getElementById("password").value = "";
        document.getElementById("confirmPassword").value = "";
        return false; 
    }else{
        const SEmail = localStorage.getItem('Email');  
        fetch('loginM.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                'mode': "update",
                'Email': SEmail
            })
        })
        .then(response => response.text())
        .then(data => {
            console.log("PHP Response:", data); 
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    return true; 
}

document.getElementById('switch').addEventListener('change', clearInputs);
document.getElementById("pass").addEventListener("input", checkinputB);
document.getElementById("send").addEventListener("click", checkemail);
document.getElementById("fp").addEventListener("click", forgotbtn);
document.getElementById("updatebtn").addEventListener("submit", validateForm);