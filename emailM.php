<?php
session_start();
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

$serverName = "ARIGATOU\SQLEXPRESS";
$database = "Test";
$username = ""; 
$password = "";

$connectionOptions = [
    "Database" => $database,
    "UID" => $username,
    "PWD" => $password,
    "CharacterSet" => "UTF-8"
];

$conn = sqlsrv_connect($serverName, $connectionOptions);

if (!$conn) {
    die("Connection failed: " . print_r(sqlsrv_errors(), true));
}

$vfCode = "";
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $operation = $_POST['Operation'] ?? '';
    $vfCode = $_POST['Code'] ?? '';
    
    if ($operation === 'resetpass') {
        echo "Processing password reset for $username.";
        $email = $_POST['Email'] ?? '';
        $username = $_POST['Username'] ?? '';
        if ($email && $username) {
        
            $sqlUpdateCode = "UPDATE Test SET Code = ? WHERE Username = ?";
            $params = [$verificationCode, $username];
            $stmt = sqlsrv_query($conn, $sqlUpdateCode, $params);
        
            if ($stmt === false) {
                die("Database error: " . print_r(sqlsrv_errors(), true));
            }
        
            if (sendVerificationEmail($email, $verificationCode)) {
                echo "Verification code sent to your email!";
            } else {
                echo "Failed to send verification email. Please check your email configuration.";
            }

        } else {
            echo "Missing email or username in the request.";
        }
    } elseif ($operation === 'forgotpass') {
        $email = $_POST['Email'] ?? '';
        
        if($vfCode){
            if($email){
                $sqlUpdateCode = "UPDATE Test SET Code = ? WHERE Email = ?";
                $params = [$vfCode, $email];
                $stmt = sqlsrv_query($conn, $sqlUpdateCode, $params);
            
                if ($stmt === false) {
                    die("Database error: " . print_r(sqlsrv_errors(), true));
                }
                if (sendVerificationEmail($email, $vfCode)) {
                    $_SESSION['Email'] = $email;
                    echo "Verification Code was sent to you email!";
                } else {
                    echo "Failed to send verification email. Please check your email configuration.";
                }
            }else{
                alert("No email");
            }
            
        }else{
            alert("No code have been stored!");
        }
            
    } else {
        echo "Invalid operation.";
    }
} else {
    echo "Invalid request method.";
}




function sendVerificationEmail($email, $vfCode)
{
    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'clynia315@gmail.com';
        $mail->Password = 'bddq wbsd fjbu uoec'; 
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        $mail->setFrom('clynia315@gmail.com', 'Your App Name');
        $mail->addAddress($email);

        $mail->isHTML(true);
        $mail->Subject = 'Your Verification Code';
        $mail->Body = "Your verification code is: <b>$vfCode</b>";

        $mail->send();
        return true;
    } catch (Exception $e) {
        echo "Mailer Error: " . $mail->ErrorInfo;
        return false;
    }
}
sqlsrv_close($conn);
?>
