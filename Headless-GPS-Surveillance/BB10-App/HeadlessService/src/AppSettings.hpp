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

#ifndef APPSETTINGS_HPP
#define APPSETTINGS_HPP
#include <QObject>

/**
 * AppSettings
 *
 */
class AppSettings
{
public:
    /*
     * Retrieves the https settings flag saved in the QSettings db
     */
    static bool isUsingHttps();

    /*
     * Saves the https setting flag in the QSettings db
     */
    static void setHttps(bool value);

    static bool timerEnabled();

    static void startTimer(bool value);

    static bool debug();

    static int timerInterval();

    static QString url();

    static QString hubTitle();

    static QString hubSurveillanceMsg();
    static QString pinPermissionNotGrantedWarning();
    static QString gpsPermissionNotGrantedWarning();
    static QString locationServicesPermissionNotGranted();

    static int getTimeout();
    static void saveTimeout(int value);

    static int getLastSuccess();
    static void saveLastSuccess(int value);



};


#endif
