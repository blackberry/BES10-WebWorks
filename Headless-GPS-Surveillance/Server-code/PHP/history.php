<?php
require("config.php");
//
//
//  THIS FILE FINDS ALL THE CLOSEST DEVICES AND THEIR DISTANCES (MILES AWAY) IN SORTED ORDER TO A SPECIFIED LOCATION (LATITUDE, LONGITUDE) AND RADIUS
//  TO USE, PROVIDE lat, lng, and radius via GET Parameter
//  For example: http://www.domain.com/history.php?pin=3F3BAC
//
// Get parameters from URL
if(isset($_GET['pin'])){
	
	$pin = strtolower($_GET["pin"]);
	
	// Opens a connection to a mySQL server
	$connection=mysql_connect(MY_DB_HOST, MY_DB_USER, MY_DB_PASS);
	if (!$connection) {
	  die("DB not connected : " . mysql_error());
	}
	
	// Set the active mySQL database
	$db_selected = mysql_select_db(MY_DB_NAME, $connection);
	if (!$db_selected) {
	  die ("Can\'t use db : " . mysql_error());
	}
	
	$unixTimeToDate = "FROM_UNIXTIME(timestamp,'%Y-%c-%d')";
	
	if(isset($_GET['showdaterange']) && $_GET['showdaterange']="true"){
	
		$query = sprintf("SELECT DISTINCT(%s) AS dateOf FROM UserLocation WHERE pin = '%s' ORDER BY dateOf DESC",
		  $unixTimeToDate,
		  mysql_real_escape_string($pin)
		  );	

		$result = mysql_query($query);
	
		if (!$result) {
		  die("{\"success\":false, \"message\": \"sql error\"");
		}
		$rows = array();
		$rowCount = 0;
		while($r = mysql_fetch_assoc($result)) {
	    	$rows[] = $r;
	    	$rowCount++;
		}
		
		$jsonArray = json_encode($rows);
		$ts = time();
		$json = "{\"success\":true, \"records\":$jsonArray, \"total\": $rowCount, \"timestamp\": $ts}";
		
		  
		  
	}
	else{
		if(isset($_GET['timestamp'])){
			$timestamp=$_GET['timestamp'];
		}
		else{
			$timestamp=0;
		}
		if(isset($_GET['date'])){
			$query = sprintf("SELECT pin, timestamp, latitude, longitude, %s AS dateOf FROM UserLocation WHERE pin = '%s' AND %s = '%s' ORDER BY timestamp DESC",
			  $unixTimeToDate,
			  mysql_real_escape_string($pin),
			  $unixTimeToDate,
			  mysql_real_escape_string($_GET['date'])
			);
			//-----------------
			$sqlcountQuery = sprintf("SELECT count(pin) FROM UserLocation WHERE pin = '%s' AND %s = '%s'", 
									mysql_real_escape_string($pin), 
									$unixTimeToDate,
									mysql_real_escape_string($_GET['date'])
									);
			
			$retvalCount = mysql_query( $sqlcountQuery);
			if(! $retvalCount )
			{
			  die('Could not get data: ' . mysql_error());
			}
			$rowCountArray = mysql_fetch_array($retvalCount, MYSQL_NUM );
			$rowCount = $rowCountArray[0];
			
		}
		else{
			// Search the rows in the markers table
			$query = sprintf("SELECT pin, timestamp, latitude, longitude, %s AS dateOf FROM UserLocation WHERE pin = '%s' AND timestamp > %u ORDER BY timestamp DESC",
			  $unixTimeToDate,
			  mysql_real_escape_string($pin),
			  $timestamp
			  );
	
			//-----------------
			$sqlcountQuery = sprintf("SELECT count(pin) FROM UserLocation WHERE pin = '%s' AND timestamp > %u", 
									mysql_real_escape_string($pin), $timestamp);
			
			$retvalCount = mysql_query( $sqlcountQuery);
			if(! $retvalCount )
			{
			  die('Could not get data: ' . mysql_error());
			}
			$rowCountArray = mysql_fetch_array($retvalCount, MYSQL_NUM );
			$rowCount = $rowCountArray[0];
		}
		//-----------------
		$result = mysql_query($query);
	
		if (!$result) {
			$err = mysql_error();
			die("{\"success\":false, \"message\":\"$err\", \"sql\":\"$query\"}");
		}
		$rows = array();
		while($r = mysql_fetch_assoc($result)) {
	    	$rows[] = $r;
		}
		
		$jsonArray = json_encode($rows);
		$ts = time();
		$json = "{\"success\":true, \"records\":$jsonArray, \"total\": $rowCount, \"timestamp\": $ts}";
	

	}
	
	
	// PRINT VALUE	
	header('Content-Type: Application/json; charset=utf-8');
	
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
	echo "{\"success\":false, \"error\":\"Recheck params provided. Params required are pin\"}";
}
?>