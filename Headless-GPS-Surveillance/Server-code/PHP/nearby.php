<?php
require("config.php");

//
//
//  THIS FILE FINDS ALL THE CLOSEST DEVICES AND THEIR DISTANCES (MILES AWAY) IN SORTED ORDER TO A SPECIFIED LOCATION (LATITUDE, LONGITUDE) AND RADIUS
//  TO USE, PROVIDE lat, lng, and radius via GET Parameter
//  For example: http://www.domain.com/nearby.php?lat=55.998&lng=-178.88&radius=150
//
// Get parameters from URL
if(isset($_GET['lat']) && isset($_GET['lng']) && isset($_GET['radius'])){
	
	$center_lat = $_GET["lat"];
	$center_lng = $_GET["lng"];
	$radius = $_GET["radius"];
	
	// Opens a connection to a mySQL server
	$connection=mysql_connect(MY_DB_HOST, MY_DB_USER, MY_DB_PASS);
	if (!$connection) {
	  die("Not connected : " . mysql_error());
	}
	
	// Set the active mySQL database
	$db_selected = mysql_select_db(MY_DB_NAME, $connection);
	if (!$db_selected) {
	  die ("Can\'t use db : " . mysql_error());
	}
	
	// Search the rows in the markers table
	/*
	$query = sprintf("SELECT pin, max(timestamp) AS unixtime, latitude, longitude, round(( 3959 * acos( cos( radians('%s') ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians('%s') ) + sin( radians('%s') ) * sin( radians( latitude ) ) ) ),3) AS distance FROM UserLocation GROUP BY PIN HAVING distance < '%s' ORDER BY distance ",
	  mysql_real_escape_string($center_lat),
	  mysql_real_escape_string($center_lng),
	  mysql_real_escape_string($center_lat),
	  mysql_real_escape_string($radius));
	*/
	$query = sprintf(" SELECT pin, timestamp AS unixtime, latitude, longitude, round(( 3959 * acos( cos( radians('%s') ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians('%s') ) + sin( radians('%s') ) * sin( radians( latitude ) ) ) ),3) AS distance FROM UserLocation WHERE (pin, timestamp) IN ( SELECT pin, max(timestamp) FROM UserLocation GROUP BY pin) HAVING distance < %s",
	  mysql_real_escape_string($center_lat),
	  mysql_real_escape_string($center_lng),
	  mysql_real_escape_string($center_lat),
	  mysql_real_escape_string($radius)

	);

	
	$result = mysql_query($query);
	
	if (!$result) {
	  die("Invalid query: " . mysql_error());
	}
	$rows = array();
	while($r = mysql_fetch_assoc($result)) {
    	$rows[] = $r;
	}
	
	$json = json_encode($rows);
	
	header('content-type: application/json; charset=utf-8');
	
	// Iterate through the rows, adding XML nodes for each
	if( ! isset($_GET['callback'])){
	    exit($json);
	}
	# JSONP if valid callback
	else{
	    exit("{$_GET['callback']}($json)");
	}
	
}
else{
	echo "{\"success\":false, \"error\":\"Recheck params provided. Params required are lat, lng, and radius\"}";
}
?>
