#!/usr/bin/env node
// Pretty slick way to install pre-requisite plugins
console.log('Updating plugins...');
var pluginlist = [
  'com.blackberry.app',
  'com.blackberry.identity',
  'com.blackberry.invoke',
  'com.blackberry.invoke.card',
  'com.blackberry.invoked',
  'com.blackberry.notification',
  'com.blackberry.push',
  'com.blackberry.system',
  'com.blackberry.ui.contextmenu',
  'com.blackberry.utils'
];
var fs = require('fs');
var path = require('path');
var sys = require('sys')
var exec = require('child_process').exec;

function puts(error, stdout, stderr) { 
	if(error==null) 
		console.log('\tUpdated plugin')
	else 
		sys.puts(stdout);
}

pluginlist.forEach(function(plug) {
    exec("webworks plugin add " + plug, puts);
});

