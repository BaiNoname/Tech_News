<?php

class Database
{
    private $host = "localhost";
    private $username = "root";
    private $password = "";
    private $database = "tech_news";

    // private $host = "sql110.infinityfree.com";
    // private $username = "if0_42198316";
    // private $password = "5eADOBLAcQ0";
    // private $database = "if0_42198316_tech_news";

    public $connection;

    public function __construct()
    {
        $this->connection = new mysqli(
            $this->host,
            $this->username,
            $this->password,
            $this->database
        );

        if ($this->connection->connect_error) {
            die("Connect failed: " . $this->connection->connect_error);
        }

        $this->connection->set_charset("utf8mb4");
    }
}