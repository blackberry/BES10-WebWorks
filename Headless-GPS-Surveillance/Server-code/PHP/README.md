# GPS Surveillance for BlackBerry 10 - Server/PHP Files

The PHP files contain small bits example code which are useful in test the BB10 Surveillance App

**Relevant Files** 

* LocationSave.php - This files saves the location as sent by the app. Most important file.
* nearby.php - this file returns which other devices are nearby and their distance if given your latitude, longitude, and radius(in miles)
* config.php - this file is a dependency for all other php files

**Author** 

* [Shikhir Singh](http://www.shikhir.com/)


**Dependencies** 

* Any PHP Server (Apache, IIS, etc)
* MySql

**Installation** 

* Copy .php files located under PHP directory into any PHP server (ie. Apache, IIS, etc...)
* Import the SurveillanceDB.sql file into your mysql database. Example: mysql -u username -p -h localhost database_name < mysql-db/SurveillanceDB.sql
* Change the config.php so that it reference your mysql database credentials
* The code as written in LocationSave.php continuously deletes stale data that is older than 365 days for privacy reasons. Modify variable $daysToKeep in the LocationSave.php file as needed. 

**Server Code Version** 

See attached files


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