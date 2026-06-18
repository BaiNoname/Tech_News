<?php

error_reporting(0);
ini_set("display_errors", "0");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
// error_reporting(E_ERROR | E_PARSE);
// ini_set("display_errors", "0");

require_once __DIR__ . '/routes/api.php';