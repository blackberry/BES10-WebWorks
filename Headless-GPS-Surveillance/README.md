# GPS Surveillance for BlackBerry 10

This is a BB10 headless app(including UI) that runs in the background to reports to a server a user's GPS location every 1/2 hour to a server. Additionally
Enterprise Push can be used to get the BlackBerry location on demand. This sample code was requested by a health organization to track employees who are 
entering dangerous regions on foreign soil(with employee consent). 

The sample code for this application is Open Source under the [Apache 2.0 License](http://www.apache.org/licenses/LICENSE-2.0.html).


**Author** 

* [Shikhir Singh](http://www.shikhir.com/)


**Components** 

* BB10 App - A BlackBerry 10 headless app + HTML5 / WebWorks UI which runs in background and reports a user's GPS location at periodic 1/2 hour intervals or on demand to a server.
* Server Code - A super simple PHP code that saves the PIN, Latitude, Longitude, and timestamp into a MySql database. Useful in testing the BlackBerry 10 code. 


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