# GPS Surveillance for BlackBerry 10 - Server Code

This is the server component of the head app which stores the geo-location of the BB10 headless app. The PHP code 
accepts a GET request for PIN, Timestamp, Longitude, and Latitude, then saves it into a MySql database. 
This code could be ported into any other language within minutes but it's provided to be able to test the BB10 app immediately.

The sample code for this application is Open Source under the [Apache 2.0 License](http://www.apache.org/licenses/LICENSE-2.0.html).


**Author** 

* [Shikhir Singh](http://www.shikhir.com/)


**Dependencies** 

* Any PHP Server (Apache, IIS, etc)
* MySql

**Installation** 

1. Copy php files located under PHP directory into any PHP server (ie. Apache, IIS, etc...)
2. Import the SurveillanceDB.sql file into your mysql database. 
3. Change the config.php so that it reference your mysql database credentials
4. The code as written continuously deletes stale data that is older than 365 days for privacy reasons. Modify variable $daysToKeep in the LocationSave.php file as needed. 

Example Import of SurveillanceDB.sql file for step #2 
```
mysql -u username -p -h localhost database_name < mysql-db/SurveillanceDB.sql
```

**MDS/BES/Enterprise Push** 

* MDS push can be used to get the BB10 Surveillance app to respond with a GPS location immediately instead of waiting for the next 1/2 hour cycle. This can be useful if the user's location in needed immediately. Run the push/PushExample.html file and enter the right values. 
* Additional documentation for [MDS-CS Push](https://developer.blackberry.com/devzone/develop/enterprise/enterprise_blackberry_push_format.html)

**Surveillance Warning**

* Monitoring an a person's GPS location without their consent is illegal in many countries. Make sure you have the user's written consent.
* Be sure to inform the user how long their location data will be stored
* This App by default warns it's users that they are under GPS surveillance on a frequent basis. This should not be considered consent to monitor.

## Disclaimer

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING 
BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE 
AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR 
ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR 
OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR 
OTHER DEALINGS IN THE SOFTWARE.