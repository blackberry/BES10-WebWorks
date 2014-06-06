BlackBerry 10 WebWorks Web launcher V1.0
========================================

## Description

The BlackBerry 10 WebWorks web launcher is a simple WebWorks project that can be used to 
create BES deployable shortcuts to internal company web resources.
By specifying the URL, icon, name and description, this launcher will open the browser on 
the device to the specified url. An easy way to publish internal websites and other web resources.

In the docs directory an detailed instruction manual on how to build the launcher is included.

**Applies To**

* Client: [WebWorks 2.0 or higher](http://developer.blackberry.com/html5/)

**Author(s)**

* [Dennis Reumer](http://www.twitter.com/reumerd)


## Instructions how to build

1. Ensure you have WebWorks 2.0 Gold or higher installed

2. Ensure you have properly setup your signing keys

3. Run WebWorks

4. Create your new Project

5. In the plugins tab add the "com.blackberry.app" plugin

6. Copy over the files from this Github project onto the newly created project replacing all existing files

7. Create your own 114x114px icon and save it as logo.png as save it to the www/img/ directory in your newly created poject

8. Adjust and save the projects settings (!! dont forget to press the save button)
	```
    - Change App ID to your own package name
    - Change App Name to your own app name
    - Change App Description to your own description
    - Change the Author to your own author name
    - Change the Author email to your own author email
    - !! IMPORTANT !!
    - Change the Author URL to the URL you want to launch (e.g. http://www.blackberry.com)
    ```

9. Build the App

10. Deploy through the BES (get the build from "<WebWorks Projects>/<your project>/platforms/blackbery10/build/device/bb10app.bar" )


