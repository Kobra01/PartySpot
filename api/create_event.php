<?php

// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");


// files needed to connect to database
include_once 'config/Database.php';
include_once 'objects/Event.php';
include_once 'objects/Creator.php';

// get database connection
$database = new Database();
$db = $database->getConnection();

// instantiate other objects
$event = new Event($db);
$creator = new Creator($db);

// get posted data
$data = json_decode(file_get_contents("php://input"));

// check if data is set
if (!isset($data->name) or
        !isset($data->description) or
            !isset($data->city) or
                !isset($data->location) or
                    !isset($data->lat) or
                        !isset($data->long) or
                            !isset($data->date) or
                                !isset($data->time) or
                                    !isset($data->code)) {
    
    // message if value missed
    http_response_code(400);
    echo json_encode(array("error" => TRUE, "message" => "Values are missing."));
    die();
}

// set product property values
$event->name = $data->name;
$event->description = $data->description;
$event->city = $data->city;
$event->location = $data->location;
$event->lat = $data->lat;
$event->long = $data->long;
$event->date = $data->date;
$event->time = $data->time;
$creator->code = $data->code;

// check if creator code is correct
if (!$creator->checkCreator()) {

    // message if user exist
    http_response_code(401);
    echo json_encode(array("error" => TRUE, "message" => "Creator Code is wrong."));
    die();
}

$event->creator_id = $creator->id;

// create the event
if(!$event->create()){

    // message if unable to create user
    http_response_code(400);
    echo json_encode(array("error" => TRUE, "message" => "Unable to create event."));
    die();
}

// set response code & answer
http_response_code(201);
echo json_encode(array("error" => FALSE, "message" => "Event was created."));

?>