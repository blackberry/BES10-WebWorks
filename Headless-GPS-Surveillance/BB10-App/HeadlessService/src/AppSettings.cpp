/* Copyright (c) 2012, 2013, 2014, 2015  BlackBerry Limited.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

#include "AppSettings.hpp"

#include <QSettings>
#include <QObject>
#include <string>

namespace
{
    const QString httpsSettings = QLatin1String("usehttps");
    const QString timer  = QLatin1String("timerEnabled");
    const bool debugMode = false; // *** MAKE SURE THIS IS FALSE prior to deploying in production ***
}

/**
 * AppSettings::isUsingHttps()
 * Check Apps QSettings for key httpsSettings and return
 *
 * return httpsSettings value
 */
bool AppSettings::isUsingHttps()
{
    QSettings settings;
    return settings.value(httpsSettings, false).toBool();
}

/**
 * AppSettings::setHttps(bool value)
 * Set httpsSettings flag in your Apps QSettings
 */
void AppSettings::setHttps(bool value)
{
    QSettings settings;
    settings.setValue(httpsSettings, QVariant(value));
}

bool AppSettings::timerEnabled()
{
    QSettings settings;
    return settings.value(timer, false).toBool();
}

void AppSettings::startTimer(bool value)
{
    QSettings settings;
    settings.setValue(timer, QVariant(value));
}


/**
 * AppSettings::debug()
 * Returns if Debug mode is on
 */
bool AppSettings::debug()
{
    return debugMode;
}

/**
 * AppSettings::timerInterval()
 * Returns the timerInterval
 */
int AppSettings::timerInterval()
{
    if(debug()){
        return 7;
    }
    else{
        return 15; // CHANGE THIS VALUE! Unit is minutes. Do not choose a value below 7 or the app will not run(OS limitiation)!
    }
}

QString AppSettings::url()
{
    if(debug()){
        return "http://shikhir.com/LocationSave.php"; // for testing use - can be changed
    }
    else{
        return "http://shikhir.com/LocationSave.php"; // CHANGE THIS VALUE
    }
}

QString AppSettings::hubTitle()
{
    return "Surveillance"; // CHANGE THIS VALUE to name of app
}

QString AppSettings::hubSurveillanceMsg()
{  // CHANGE THIS VALUE BELOW
    return "Be advised, your phone is currently under GPS Surveillance by IT. Your location details are being tracked and logged. Contact your company's IT/BES Admin for more details. Contact your IT if you do not wish to be tracked. Turning off Location Services will disable tracking. Secure Wiping your phone will also remove the application which is tracking your location."; // the name of the app as shown in the hub;
}

int AppSettings::getTimeout()
{
    QSettings settings;
    return settings.value("timeoutCount", 0).toInt();
}

/**
 * AppSettings::setHttps(bool value)
 * Set httpsSettings flag in your Apps QSettings
 */
void AppSettings::saveTimeout(int value)
{
    QSettings settings;
    settings.setValue("timeoutCount", QVariant(value));
}

int AppSettings::getLastSuccess()
{
    QSettings settings;
    return settings.value("lastSuccess", 0).toInt();
}

void AppSettings::saveLastSuccess(int value)
{
    QSettings settings;
    settings.setValue("lastSuccess", QVariant(value));
}

QString AppSettings::pinPermissionNotGrantedWarning()
{  // CHANGE THIS VALUE BELOW
    QString pinWarn ="You have not granted the app "+hubTitle()+
                     " permission for \"Device Identifying Information\". "+
                     "This prevents reporting your location to IT. Please grant this permission using the Settings App. "+
                     "Select \"Security and Privacy\", then \"Application Permissions\". "+
                     "If you have questions as to why this is needed, please contact IT";
    return pinWarn;
}

QString AppSettings::gpsPermissionNotGrantedWarning(){
    // CHANGE THIS VALUE BELOW
    QString gpsWarn = "You have not granted the app "+hubTitle()+
                        " permission for \"Location\". This prevents reporting your location to IT. "+
                        "Please grant this permission using the Settings App. Select \"Security and Privacy\", "+
                        "then \"Application Permissions\". If you have questions as to why this is needed, "+
                        "please contact IT"; // the name of the app as shown in the hub;
    return gpsWarn;
}

QString AppSettings::locationServicesPermissionNotGranted()
{
    // CHANGE THIS VALUE BELOW
    QString errMsg= "Location Services Disabled - Location services has been disabled on this phone. ";
    errMsg+= "This app cannot transmit the location back to the server until Location Services is turned on. ";
    errMsg+= "To turn on location services, goto the Setting app then select \"Location Services\"";

    return errMsg;
}


