function setMessage (message, error) {
	document.getElementById("message").innerHTML = '<p>' + message + '</p>';
	
	if (error)
		document.getElementById("message").className = "error";
	else
		document.getElementById("message").className = "";
}

function parseCSVLine (line)
{
	line = line.split("\t");
	
	// check for splits performed inside quoted strings and correct if needed
	for (var i = 0; i < line.length; i++)
	{
		var chunk = line[i].replace(/^[\s]*|[\s]*$/g, "");
		var quote = "";
		if (chunk.charAt(0) == '"' || chunk.charAt(0) == "'") quote = chunk.charAt(0);
		if (quote != "" && chunk.charAt(chunk.length - 1) == quote) quote = "";
		
		if (quote != "")
		{
			var j = i + 1;
			
			if (j < line.length) chunk = line[j].replace(/^[\s]*|[\s]*$/g, "");
			
			while (j < line.length && chunk.charAt(chunk.length - 1) != quote)
			{
				line[i] += ',' + line[j];
				line.splice(j, 1);
				chunk = line[j].replace(/[\s]*$/g, "");
			}
			
			if (j < line.length)
			{
				line[i] += ',' + line[j];
				line.splice(j, 1);
			}
		}
	}
	
	for (var i = 0; i < line.length; i++)
	{
		// remove leading/trailing whitespace
		line[i] = line[i].replace(/^[\s]*|[\s]*$/g, "");
		
		// remove leading/trailing quotes
		if (line[i].charAt(0) == '"') line[i] = line[i].replace(/^"|"$/g, "");
		else if (line[i].charAt(0) == "'") line[i] = line[i].replace(/^'|'$/g, "");
	}
	
	return line;
}

function xlsToJson ()
{
	var message = "";
	var error = false;
	var f = document.forms["convertForm"];
	var csvText = f.elements["csv"].value;
	var jsonText = "";
	
	//setMessage(message, error);
	
	if (csvText == "") { error = true; message = "Enter CSV text below."; }
	
	if (!error)
	{
		benchmarkStart = new Date();
		csvRows = csvText.split(/[\r\n]/g); // split into rows
		
		// get rid of empty rows
		for (var i = 0; i < csvRows.length; i++)
		{
			if (csvRows[i].replace(/^[\s]*|[\s]*$/g, '') == "")
			{
				csvRows.splice(i, 1);
				i--;
			}
		}
		
		if (csvRows.length < 2) { error = true; message = "The CSV text MUST have a header row!"; }
		else
		{
			objArr = [];
			
			for (var i = 0; i < csvRows.length; i++)
			{
				csvRows[i] = parseCSVLine(csvRows[i]);
			}
			
			benchmarkParseEnd = new Date();

			myJSON = '[';
			last = csvRows.length;
			first = true;
			for (var i = 1; i < last; i++) {
				// If the 5 other columns are blank, then treat as a title row
				if (csvRows[i][1] == "" && csvRows[i][2]=="" && 
					csvRows[i][3]=="" && csvRows[i][4]=="" && csvRows[i][5]=="") {
					// Creating a new title row...
					if (i > 1) { 
						// delete last comma from name list...
						if (myJSON.charAt(myJSON.length-1)==',') myJSON = myJSON.substring(0, myJSON.length - 1);

						myJSON += "\t]\n\t}";
						if (i < last) myJSON += ",";
					} 
					myJSON += "\n\t {\"title\" : \"" + csvRows[i][0] + "\", \n\t\"list\" : [";
					first = true;
				} else if (csvRows[i].length > 2) {
					if(!first) { myJSON += ',' }
					first = false;
					myJSON += "\n\t{";
					for (var j = 0; j < csvRows[i].length; j++) {
						myJSON += '"'+csvRows[0][j]+'" : "' + csvRows[i][j] + '"';
						if (j < (csvRows[i].length-1)) { myJSON += ', '; }
					}
					myJSON += "\n\t}";
					//if (i<last) myJSON += ',';
				}       
			}
			myJSON += "\t]}\n]";
			
			//benchmarkObjEnd = new Date();
			//jsonText = myJSON; 
			//JSON.stringify(objArr, null, "\t");
			//benchmarkJsonEnd = new Date();
			document.getElementById("content").value = myJSON;
			//benchmarkPopulateEnd = new Date();
			//message = getBenchmarkResults();
		}
	}
	//setMessage(message, error);
}

function getBenchmarkResults ()
{
	var message = "";
	var totalTime = benchmarkPopulateEnd.getTime() - benchmarkStart.getTime();
	
	var timeDiff = (benchmarkParseEnd.getTime() - benchmarkStart.getTime()); var mostTime = "parsing CSV text";
	if ((benchmarkObjEnd.getTime() - benchmarkParseEnd.getTime()) > timeDiff) { timeDiff = (benchmarkObjEnd.getTime() - benchmarkParseEnd.getTime()); mostTime = "converting to objects"; }
	if ((benchmarkJsonEnd.getTime() - benchmarkObjEnd.getTime()) > timeDiff) { timeDiff = (benchmarkJsonEnd.getTime() - benchmarkObjEnd.getTime()); mostTime = "building JSON text"; }
	if ((benchmarkPopulateEnd.getTime() - benchmarkJsonEnd.getTime()) > timeDiff) { timeDiff = (benchmarkPopulateEnd.getTime() - benchmarkJsonEnd.getTime()); mostTime = "populating JSON text"; }
	
	message += csvRows.length + " CSV line" + (csvRows.length > 1 ? 's' : "") + " converted into " + objArr.length + " object" + (objArr.length > 1 ? 's' : "") + " in " + (totalTime / 1000) + " seconds, with an average of " + ((totalTime / 1000) / csvRows.length) + " seconds per object. Most of the time was spent on " + mostTime + ", which took " + (timeDiff / 1000) + " seconds.";
	
	return message;
}