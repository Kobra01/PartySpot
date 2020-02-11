<?php
// 'event' object
class Creator{

    // database connection and table name
    private $conn;
    private $table = "creator";

    // creator properties
    public $id;
    public $name;
    public $real_name;
    public $code;
    public $created;

    public $creator;

    public $multi_creators;

    // constructor
    public function __construct($db){
        $this->conn = $db;
    }

    // check creator
    public function checkCreator(){

        // Create Query
        $query = '  SELECT
                        *
                    FROM
                        ' . $this->table . '
                    WHERE
                        code = :code';

        // prepare the query
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->code=htmlspecialchars(strip_tags($this->code));

        // bind the values
        $stmt->bindParam(':code', $this->code);

        // exit if execute failed
        if(!$stmt->execute()){
            return false;
        }

        if ($stmt->rowCount() > 0) {

            // get record details / values
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            // assign values to object properties
            $this->id = $row['id'];

            return true;
        }

        return false;
    }

}