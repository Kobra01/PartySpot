<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// files needed to connect to database
include_once 'objects/Mailer.php';

// files and uses for sending email
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'libs/phpmailer/src/Exception.php';
require 'libs/phpmailer/src/PHPMailer.php';
require 'libs/phpmailer/src/SMTP.php';

// instantiate mail object
$phpmailer = new PHPMailer(true);                              // Passing `true` enables exceptions
include_once 'config/Mailer.php';

// instantiate other objects
$mailer = new Mailer($phpmailer);

// get posted data
$data = json_decode(file_get_contents("php://input"));

// check if data is set
if (!isset($data->content)) {

    // message if value missed
    http_response_code(400);
    echo json_encode(array("error" => TRUE, "message" => "No content."));
    die();
}

// Prepare sending Email
$mailer->content = $data->content;

if (!$mailer->sendSubmitMail()) {

    // message if unable to send email
    http_response_code(400);
    echo json_encode(array("error" => TRUE, "message" => "Unable to send submit."));
    die();
}

// set response code & answer
http_response_code(201);
echo json_encode(array("error" => FALSE, "message" => "Thanks for submitting."));

?>