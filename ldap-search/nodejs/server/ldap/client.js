/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// client.js 
// the LDAP client code
// 8 March 2014 Dennis Reumer - BlackBerry

// Constants to setup your LDAP server details and search parameters
const ldap_url = 'ldap://192.168.33.10'; // Your Active Directory LDAP server
const binduser = 'cn=a-NLREUD,cn=Users,dc=arche-it,dc=test'; // Your Active Directory Bind users (e.g. generic search account)
const bindpw = 'H31s3nb3rg'; // Active Directory Bind password 
const ldap_basedn = 'CN=Users,DC=arche-it,DC=test';
const ldap_attributes = ['cn','givenName','sn','name','mobile','homePhone','mail']; // We onyl want these attributes to be found
const ldap_class = '(objectClass=person)'; // set the search class to persons

// Require the ldapjs module (provides the actual ldap client) -> documentation here : http://ldapjs.org/
var ldap = require('ldapjs'); //
var client = ldap.createClient({
  url:  ldap_url  
});

// A bind is in most cases required as most LDAP servers require authentication before performing an actual search.
function bind() {
  client.bind( binduser, bindpw, function(err) { 
  });
}

// This is the search function. The response object allows us to return the info to the requestorm the parameters is the search string
function ldapsearch(response, parameters) {
  // First perform a bind, otherwise the LDAP directory doesn't accept teh search
  bind();

  // Set the search options, we allow a full wildcard search start and end. *parameter*
  if (parameters != '') {
    parameters = '*'+parameters + '*';
  } else {
    parameters = '*';
  }
  var opts = {
    filter: '(&'+ldap_class+'(cn='+parameters+'))', 
    scope: 'sub', // search in the tree below the baseDN.
    attributes: ldap_attributes
  };

  // Perform the search
  client.search( ldap_basedn, opts, function(err, res) { 
    var search = ''; // Variable used to collect all the results

    res.on('searchEntry', function(entry) {
      //console.log('entry: ' + JSON.stringify(entry.object)); // Debugging on the console if needed.
      search += JSON.stringify(entry.object)+','; // Add the found entries to the search results
    });
    res.on('searchReference', function(referral) {
      //console.log('referral: ' + referral.uris.join()); // There migth be additional LDAP directories, we're not going to search. Removed here.
    });
    res.on('error', function(err) {
      // console.error('error: ' + err.message);
      // Errors can happen remove comment if neededto log
    });
    res.on('end', function(result) {
      // console.log('status: ' + result.status); // report the final status
      search = search.substr(0,(search.length)-1); // Trim the last , of the JSON string, to make it clean for the output.
      //console.log(search); // If needed prompt on the console
      response.writeHead(200, {"Content-Type": "text/plain"}); // output in plain text, not yet JSON object, allow different end-points to capture this data
      response.write(search); // Ourput the search results to the user.
      response.end(); // End the response and send to the requestor
      console.log ('search completed.')
    });
  });
}

exports.bind = bind;
exports.search = ldapsearch;

