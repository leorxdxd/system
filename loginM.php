<?php
session_start();

$serverName = "ARIGATOU\SQLEXPRESS";
$database = "Midterms";
$username = "";
$password = "";

$connection = [
    "Database" => $database,
    "Uid" => $username,
    "PWD" => $password
];

$conn = sqlsrv_connect($serverName, $connection);
if (!$conn) {
    die(print_r(sqlsrv_errors(), true));
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $mode = $_POST['mode'];
    if ($mode == "login") {
        $inputUsername = $_POST['usernameL'];
        $inputPassword = $_POST['passwordL'];
        $sql = "SELECT FullName, ContactNumber, Birthdate, Gender, Department, DepartPosition, Status, Username, Password, Email, Role FROM Users WHERE Username = ? AND Password = ?";
        $params = array($inputUsername, $inputPassword);
        $stmt = sqlsrv_query($conn, $sql, $params);

        if ($stmt === false) {
            die(print_r(sqlsrv_errors(), true));
        }

        $user = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC);
        if ($user) {
            $_SESSION['fullName'] = $user['FullName'];
            $_SESSION['contactNumber'] = $user['ContactNumber'];
            $_SESSION['birthdate'] = $user['Birthdate']->format('Y-m-d'); 
            $_SESSION['gender'] = $user['Gender'];
            $_SESSION['department'] = $user['Department'];
            $_SESSION['departPosition'] = $user['DepartPosition'];
            $_SESSION['status'] = $user['Status'];
            $_SESSION['username'] = $user['Username'];
            $_SESSION['password'] = $user['Password'];
            $_SESSION['email'] = $user['Email'];
            $_SESSION['role'] = $user['Role'];

            // Redirect based on role
            if ($user['Role'] === 'User') {
                echo "<script>
                    alert('Login Successful');
                    window.location.href = 'UserDashboard.php';
                    </script>";
            } else {
                echo "<script>
                    alert('Login Successful');
                    window.location.href = 'Dashboard.php';
                    </script>";
            }
        } else {
            echo "<script>
                alert('Username or password is incorrect!');
                window.location.href = 'midtermsLogin.html';
                </script>";
        }
    }


    }elseif($mode == "signup"){
        $inputUsername = $_POST['usernameS'];
        $inputPassword = $_POST['passwordS'];
        $inputEmail = $_POST['emailS'];
        $inputCPassword = $_POST['cpasswordS'];

        if($inputPassword === $inputCPassword){
            $sql = "SELECT Username FROM Test WHERE Email = ?";
            $params = array($inputEmail);
            $stmt = sqlsrv_query($conn, $sql, $params);
            if ($stmt === false) {
                die(print_r(sqlsrv_errors(), true)); // Error handling for query failure
            } elseif (sqlsrv_has_rows($stmt)) {
                echo "<script>
                alert('Email already exists');
                window.location.href = 'midtermsLogin.html';
                </script>";
            } else {
                $sqlu = "SELECT Username FROM Test WHERE Username = ?";
                $paramsu = array($inputUsername);
                $stmtu = sqlsrv_query($conn, $sqlu, $paramsu);
                if ($stmtu === false) {
                    die(print_r(sqlsrv_errors(), true)); // Error handling for query failure
                } elseif (sqlsrv_has_rows($stmtu)) {
                    echo "<script>
                    alert('Username already exists');
                    window.location.href = 'midtermsLogin.html';
                    </script>";
                } else {
                    $sqlInsert = "INSERT INTO Test (Username, Password, Email) VALUES (?, ?, ?)";
                    $paramsInsert = array($inputUsername, $inputPassword, $inputEmail);
                    $stmtInsert = sqlsrv_query($conn, $sqlInsert, $paramsInsert);
        
                    if ($stmtInsert === false) {
                        die(print_r(sqlsrv_errors(), true));
                    }else{
                        echo "<script>
                        alert('Account created successfully');
                        window.location.href = 'midtermsLogin.html';
                        </script>";
                    }
                }
               
            }
            
        }else{
            echo "<script>
            alert('Password and Confirm Password do not match!');
            </script>";
        }
        
    }elseif($mode == "update"){
        $email = $_SESSION['Email'];
        $newPassword = $_POST['password']; 
        if($email){
            $sqlUpdate = "UPDATE Test SET Password = ? WHERE Email = ?";
            $paramsUpdate = array($newPassword, $email);
            $stmtUpdate = sqlsrv_query($conn, $sqlUpdate, $paramsUpdate);
        
            if ($stmtUpdate === false) {
                echo "<script>
                    alert('Error in updating the password!');
                    window.location.href = 'Dashboard.html';
                    </script>";
            } else {
                echo "<script>
                    alert('Password Updated!');
                    window.location.href = 'midtermsLogin.html';
                    </script>";
            }
        }else{
            echo "<script>
            alert('No Email');
            </script>";
        }
        
    }
    


sqlsrv_close($conn);
?>
