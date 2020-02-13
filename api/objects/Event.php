 <?php
// 'event' object
class Event{

    //config
    private $distance_const = 111120; // m
    private $distance = 25000; // in m

    // database connection and table name
    private $conn;
    private $table = "events";
    private $table_creator = "creator";

    //user position
    public $user_lat;
    public $user_long;

    // event properties
    public $entireEvent;
    public $id;
    public $name;
    public $description;
    public $city;
    public $location;
    public $lat;
    public $long;
    public $date;
    public $time;
    public $created;

    public $creator;
    public $creator_id;

    public $multi_events;

    // constructor
    public function __construct($db){
        $this->conn = $db;
    }

    //create new event
    public function create(){

        // insert query
        $query = "INSERT INTO " . $this->table . "
                SET
                    name = :name,
                    description = :description,
                    city = :city,
                    location = :location,
                    latitude = :latitude,
                    longitude = :longitude,
                    date = :date,
                    time = :time,
                    creator = :creator";

        // prepare the query
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->name=htmlspecialchars(strip_tags($this->name));
        $this->description=htmlspecialchars(strip_tags($this->description));
        $this->city=htmlspecialchars(strip_tags($this->city));
        $this->location=htmlspecialchars(strip_tags($this->location));
        $this->lat=htmlspecialchars(strip_tags($this->lat));
        $this->long=htmlspecialchars(strip_tags($this->long));
        $this->date=htmlspecialchars(strip_tags($this->date));
        $this->time=htmlspecialchars(strip_tags($this->time));
        $this->creator_id=htmlspecialchars(strip_tags($this->creator_id));

        // bind the values
        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':description', $this->description);
        $stmt->bindParam(':city', $this->city);
        $stmt->bindParam(':location', $this->location);
        $stmt->bindParam(':latitude', $this->lat);
        $stmt->bindParam(':longitude', $this->long);
        $stmt->bindParam(':date', $this->date);
        $stmt->bindParam(':time', $this->time);
        $stmt->bindParam(':creator', $this->creator_id);

        // execute the query, also check if query was successful
        if($stmt->execute()){
            $this->id = $this->conn->lastInsertId();
            return true;
        }

        return false;
    }

    // CRUD -> Read

    // get events in a specific area
    public function getNearEvents(){

        $latitudeInMeter = $this->distance_const;
        $meterInLatitude = 1 / $latitudeInMeter;

        $longitudeInMeter = $latitudeInMeter * cos(deg2rad($this->user_lat));
        $meterInLongitude = 1 / $longitudeInMeter;

        $distanceInLatitude = $this->distance * $meterInLatitude;
        $distanceInLongitude = $this->distance * $meterInLongitude;

        // Create Query
        $query = '  SELECT
                        e.id, e.name, e.description, e.city, e.location, e.latitude, e.longitude, e.date, e.time, c.name as creator
                    FROM
                        ' . $this->table.' e, ' . $this->table_creator.' c
                    WHERE
                        latitude BETWEEN :min_lat AND :max_lat
                    AND
                        longitude BETWEEN :min_long AND :max_long
                    AND
                        e.creator = c.id
                    ORDER BY
                        e.date, e.time';

        // prepare the query
        $stmt = $this->conn->prepare($query);

        // bind the values
        $stmt->bindParam(':min_lat', round($this->user_lat - $distanceInLatitude, 6));
        $stmt->bindParam(':max_lat', round($this->user_lat + $distanceInLatitude, 6));
        $stmt->bindParam(':min_long', round($this->user_long - $distanceInLongitude, 6));
        $stmt->bindParam(':max_long', round($this->user_long + $distanceInLongitude, 6));

        // exit if execute failed
        if(!$stmt->execute()){
            return false;
        }

        // get record details / values
        $this->multi_events = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return true;
    }

    // get objects by city
    public function getByCity(){

        // Create Query
        $query = '  SELECT
                        e.id, e.name, e.description, e.city, e.location, e.latitude, e.longitude, e.date, e.time, c.name as creator
                    FROM
                        ' . $this->table.' e, ' . $this->table_creator.' c
                    WHERE
                        e.city = :city
                    AND
                        e.creator = c.id
                    ORDER BY
                        e.date, e.time';

        // prepare the query
        $stmt = $this->conn->prepare($query);

        // bind the values
        $stmt->bindParam(':city', $this->city);

        // exit if execute failed
        if(!$stmt->execute()){
            return false;
        }

        // get record details / values
        $this->multi_events = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return true;
    }

    // get details of event
    public function getDetails(){

        // Create Query
        $query = '  SELECT
                        e.id, e.name, e.description, e.city, e.location, e.latitude, e.longitude, e.date, e.time, c.name as creator
                    FROM
                        ' . $this->table.' e, ' . $this->table_creator.' c
                    WHERE
                        e.id = :event_id
                    AND
                        e.creator = c.id';

        // prepare the query
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->id=htmlspecialchars(strip_tags($this->id));

        // bind the values
        $stmt->bindParam(':event_id', $this->id);

        // exit if execute failed
        if(!$stmt->execute()){
            return false;
        }

        // get record details / values
        $this->entireEvent = $stmt->fetch(PDO::FETCH_ASSOC);

        return true;
    }

}