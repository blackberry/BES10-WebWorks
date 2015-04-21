<?php

include_once('config.php'); 

if(isset($_GET['p']) && isset($_GET['t']) && isset($_GET['lat']) && isset($_GET['lng'])){
	if(isset($_GET['p']))
	$pin = $_GET['p'];
	
	if(isset($_GET['t']))
	$timestamp = $_GET['t'];
	
	if(isset($_GET['lat']))
	$latitude = $_GET['lat'];
	
	if(isset($_GET['lng']))
	$longitude = $_GET['lng'];
	

$db = new mysqli(MY_DB_HOST, MY_DB_USER, MY_DB_PASS, MY_DB_NAME);

/* check connection */
if (mysqli_connect_errno()) {
    printf("Connect failed: %s\n", mysqli_connect_error());
    exit();
}
	
	// escape input from dangerous charachters
	$pin = $db->real_escape_string($pin);
	$pin = strtoupper($pin);
	$timestamp = $db->real_escape_string($timestamp); // saved in epoch format (unix time)
	$latitude = $db->real_escape_string($latitude);
	$longitude = $db->real_escape_string($longitude);
	
	
	$db->query("INSERT INTO UserLocation(pin, timestamp, latitude, longitude) VALUES('$pin', '$timestamp', '$latitude', '$longitude')");
	
/* logic below deletes stale data for privacy reasons */

	$daysToKeep = 365; // CHANGE ME according to policy

	
	$oneDay = 86400; // one day in seconds	
	$delbefore = time() - ($daysToKeep * $oneDay);	
	$db->query("DELETE FROM UserLocation WHERE timestamp < '$delbefore'");
	$db->close();
	
	echo "{\"success\":true}"; 
	
/* logic above deletes stale data for privacy reasons */
	
}
else{
	die("{\"success\":false, \"error\":\"Params missing. Recheck your param names. \"}");
}
?>
