# GPS Surveillance for BlackBerry 10

This is a simple BB10 headless app with a HTML5(WebWorks/Cordova) UI that runs in the background to reports to a server a user's GPS location every 1/2 hour or on demand via Enterprise Push.
This sample code was requested by a health organization to track employees(with their consent) who are entering dangerous regions on foreign soil. 

The sample code for this application is Open Source under the [Apache 2.0 License](http://www.apache.org/licenses/LICENSE-2.0.html).


**Author** 

* [Shikhir Singh](http://www.shikhir.com/)

**Version**

* **V1.0.0 Candidate Release** Updated for to work with QTimer instead of Timer Triggers to become backward compatible to 10.2.1. Fixed call cancelations issues. 

**Dependencies to run app**

* BlackBerry 10.2.1+ device -  

**Dependencies prior to compiling app**

* [Momentics IDE v2.1.1+](http://developer.blackberry.com/native/downloads/) installed 
* [BlackBerry WebWorks 2.2](http://developer.blackberry.com/html5/downloads/) installed
* [BlackBerry 10 Signing Keys](https://www.blackberry.com/SignedKeys/codesigning.html) (free) installed and linked to your BlackBerry ID


**Steps to compile the app**


1. (Optional) Replace application icon, file: icon.png
2. (Optional) Change application name located in www/config.xml under the <name> tag. Be very careful changing other fields. 
3. Import only the HeadlessService directory into Momentics.
4. Change the URL located at HeadlessService/src/AppSettings.cpp in the function url() to your server's address. 
5. Make sure debugMode variable is set to false in HeadlessService/src/AppSettings.cpp. 
6. Right click on the project in the Project Explorer, goto Properties. Then make sure "BlackBerry API Level" is set to "BlackBerry 10 Native SDK 10.2.1" or above. 
7. Clean and set Build Configuration to "Device-Release" for the HeadlessService project in Momentics. Build the code. If no errors, Exit/Close Momentics.  
8. Change the phone number for the Emergency Operating Center located at www/js/app.js (around line 18). Use country codes using + symbol(ie +1 for USA, +44 for UK, +91 for India)
9. Make sure debugMode variable is set to false in www/js/app.js (around line 19).
10. Build the WebWorks app using the "webworks build" command from command prompt. See documentation for [Building and signing your completed app](http://developer.blackberry.com/html5/documentation/v2_2/build_and_sign_your_app.html). See example below. If no errors, your final binary is ready! 
11. Prior to deploying app on device, make sure the BlackBerry device is running version 10.3.0+. The app can be sideloaded for testing or deployed using BES. If the app is sideloaded, Enterprise Push will not work

Note: To make changes to the headless portion of the app(steps 3-6 above), you will need to import that folder into Momentics and compile that portion separately and before running the webworks build command. The headless portion is compiled separately but running webworks build produces one combined binary file (.bar file). You will deploy this one bar file only and both the headless portion and the UI portion will be installed and maintained simultaneously by the BlackBerry 10 OS. 


WebWorks Build Example (from step 8 above):
```
webworks build --release --keystorepass MyPasswordGoesHere --buildId 3
```

**Known Issues**

* The GPS data sent via GET is not encrypted. If the app is deployed using BlackBerry Balance / BES and the server is kept behind the firewall, the data will be encrypted automatically. This code is intended to be used within the Work Space.
* The headless portion of the app must be compiled with BlackBerry Native SDK 10.2+
* If you get an Invoke-Target-Key compile error, you will need to change the invoke target id IN ALL SOURCE CODE LOCATIONS it's used(prior to compiling via Momentics for the headless portion and WebWorks for the app). Source files exist in .js, .cpp, .hpp, .xml, and .json files.

Invoke-Target-Key Error - If you are on a OSX, you can run the following grep/sed commands to replace target id in all source code files automatically. You will still need to recompile the HeadlessService via Momentics and the app via WebWorks. Be sure to change the value CHANGE-ME below. 
``` 
grep --include \*.cpp --include \*.hpp --include \*.xml --include \*.json --include \*.js -rli 'community.surveillance' * | xargs sed -i '' 's/community.surveillance/com.CHANGE-ME.surveillance/g'
```

**Roadmap**

* Port directed SMS - response with GPS data immediately
* Location Services - invoke Location Services if turned off

**Surveillance Warning**

* Monitoring an a person's GPS location without their consent is illegal in many countries. Make sure you have the user's written consent and consult your lawyer as appropriate.
* Be sure to inform the user how long their location data will be stored
* This App by default warns it's users that they are under GPS surveillance on a frequent basis. This should not be considered consent to monitor.


## Disclaimer

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING 
BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE 
AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR 
ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR 
OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR 
OTHER DEALINGS IN THE SOFTWARE.