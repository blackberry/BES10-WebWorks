LDAP Search through a NodeJS server
===================================

This is a little sample code that has 2 parts:

The LDAP client Web Server hosting the WEB API for LDAP searches agains the company Active directory.

The BlackBerry 10 Cordova project that leverages this WEB API to present the search results.

**Applies To**

* Client: [Cordova 3.3 or higher](http://cordova.apache.org/) or [WebWorks 2.0 or higher](http://developer.blackberry.com/html5/)
* Server: [NodeJS](http://nodejes.org), HTML5, CSS3 and JavaScript

**Author(s)**

* [Dennis Reumer](http://www.twitter.com/reumerd)

**Dependencies**

1. You will need a mobile device (BB10, iOS or Android) to test.
2. This sample can be run direct or through and BlackBerry Enterprise Server 10.

## Setup NodeJS server

Steps for installing NopdeJS and use the LDAP module

1. install NodeJS from nodejs.org
2. Install the ldapjs node module [npm install ldapjs]


Create your configuration

1. [Open the nodejs\server\ldap\client.js] file

2. Set your own parameters:
    ```
    const ldap_url = '<ldap(s)://<your server address>' // Your Active Directory LDAP server
    const binduser = 'cn=<user cd name>,cn=<from sub>,dc=<your domain>,dc=<your domain extension>'; // Your Active Directory Bind users (e.g. generic search account)
    const bindpw = '<bind password>'; // Active Directory Bind password 
    const ldap_basedn = 'CN=<e.g. Users>,DC=<your domain>,DC=<your domain extension>';
    const ldap_attributes = ['cn','givenName','sn','name','mobile','homePhone','mail']; // We onyl want these attributes to be found
    const ldap_class = '(objectClass=person)'; // set the search class to persons
    ```

3. If needed adjust the listening port in the server.js
    ```
    http.createServer(onRequest).listen(<yourport>); 
    ```

Run NodeJS server

1. Open a command line/terminal and navigate to the directory where the index.js file is listed

2. Enter [node index.js] to start the server

3. Check if the server is live by going to [http://localhost:<yourport>/?<search parameter>] (yourport, e.g. 8888, search parameter, e.g. Dennis)


## Build the Cordova project.

1. Ensure you have installed Cordova 3.3 or higher

2. Ensure you have properly setup your signing keys

3. Create a new Cordova Project (e.g. "cordova create ldapsearch com.acme.cordova.ldapsearch LdapSearch")

4. Add the proper platforms to the cordova project to which you want to deploy (e.g. in the project directory: "cordova platform add blackberry10")

5. Copy over the files from the "ldap-search-cordova" directory to your new project directory (e.g. "ldapsearch") replace any existing files

6. Edit the existing config.xml from your root directoy of you new project, use teh following information:
    ```
    Change id="...." to your own package name (e.g. "com.acme.corova.ldapsearch")
    Change Author email, href and label to your own <author...>...</author>to yourown description
    Optional: Change App Name <name>...</name> to your own app name (e.g. "Ldap Search")
    Optional: Change the desription to your own description <description>...</description>
    ```


7. Open the home.html file in the www directory and edit the nodejs server variable "nodeJS_server" to match the host url or IP address (e.g. "http://mynodejsserver.test:8888/")

8. To deploy and run you can use: "cordova run client" from the root of your cordova project. For a BB10 deployment ensure the device is in development mode.

9. To test in the work perimeter over the BES MDS-CS connection, ensure the BB10 device is in development mode and has been activatd against a BES10 server. Switch to Work on teh device (Swipe down for settings, switch to Work) and use the deploy command again "cordova run client"




