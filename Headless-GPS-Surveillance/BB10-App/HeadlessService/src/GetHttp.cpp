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

#include "GetHttp.hpp"

#include "AppSettings.hpp"

#include <bb/data/JsonDataAccess>

#include <QDebug>
#include <QNetworkAccessManager>
#include <QSettings>
#include <QSslConfiguration>
#include <QUrl>
#include <bb/platform/Notification>
#include <bb/platform/NotificationDefaultApplicationSettings>

/**
 * GetHttp -    constructor for GetHttp. Initialized notifications for BlackBerry Hub &
 *                          QNetworkAcccessManager
 */
//! [0]
GetHttp::GetHttp(QObject* parent)
    : QObject(parent)
    , m_notify(new bb::platform::Notification(this))
    , m_networkAccessManager(new QNetworkAccessManager(this))

{
}

void GetHttp::notify(QString title, QString body) {
    m_notify->setTitle(title);
    m_notify->setBody(body);
    m_notify->notify();
}



void GetHttp::get(QString pin, QString timestamp, QString lat, QString lng)
{
    QUrl url(AppSettings::url());
    url.addQueryItem("p", pin);
    url.addQueryItem("t", timestamp);
    url.addQueryItem("lat", lat);
    url.addQueryItem("lng", lng);

    QNetworkRequest request(url);
    //  request.setRawHeader("User-Agent", "MyOwnBrowser 1.0");

    // Check App settings to see if we should use SSL
    if (AppSettings::isUsingHttps()) {
        request.setUrl(url);

        QSslConfiguration config = request.sslConfiguration();
        config.setPeerVerifyMode(QSslSocket::VerifyNone);
        config.setProtocol(QSsl::TlsV1);
        request.setSslConfiguration(config);
    }

    QNetworkReply* reply = m_networkAccessManager->get(request);


    connect(reply, SIGNAL(finished()), this, SLOT(onGetReply()));
    // for future use
    connect(reply, SIGNAL(error(QNetworkReply::NetworkError)), this, SLOT(onGetError(QNetworkReply::NetworkError)));
}

void GetHttp::onGetReply(){
    QString response="";
    QNetworkReply* reply = qobject_cast<QNetworkReply*>(sender());

    disconnect(reply, SIGNAL(finished()), this, SLOT(onGetReply()));

    if (reply) {
        if (reply->error() == QNetworkReply::NoError) {
            const int available = reply->bytesAvailable();
            if (available > 0) {
                // following code for future use
                const QByteArray buffer(reply->readAll());
                response = QString::fromUtf8(buffer);

                if(AppSettings::debug()) {
                    notify("Debug Msg", "Update successful = "+response);
                }

            }
        } else {
            // onGetError(reply->error());
        }

        reply->deleteLater();
    }
}

void GetHttp::onGetError(QNetworkReply::NetworkError errorCode){

    QString errMsg="";
    switch ( errorCode ) {
        // this error code should not be encountered here (included for completeness)
        case QNetworkReply::NoError:
            errMsg+= "Should never occur";
            break;

        case QNetworkReply::ConnectionRefusedError:
            errMsg+= "Connection Refused - recheck url - the remote server refused the connection (the server is not accepting requests)";
            break;

        case QNetworkReply::RemoteHostClosedError:
            errMsg+="RemoteHostClosed Error: the remote server closed the connection prematurely, before the entire reply was received and processed";
            break;

        case QNetworkReply::HostNotFoundError:
            errMsg+= "Host Not Found - recheck url - the remote host name was not found (invalid hostname)";
            break;

        case QNetworkReply::TimeoutError:
            errMsg+= "TimeoutError - the connection to the remote server timed out";
            break;

        case QNetworkReply::OperationCanceledError:
            errMsg+= "Operation Canceled - the operation was canceled via calls to abort() or close() before it was finished." ;
            break;

        case QNetworkReply::SslHandshakeFailedError:
            errMsg+= "SSL Error - the SSL/TLS handshake failed and the encrypted channel could not be established. The sslErrors() signal should have been emitted." ;
            break;

        case QNetworkReply::UnknownNetworkError:
            errMsg+= "Unknown Network Error #99 - an unknown network-related error was detected" ;
            break;

        case QNetworkReply::ContentAccessDenied:
            errMsg+= "Content Access Denied!" ;
            break;

        default:
            errMsg+= "Unknown: check error code - " + errorCode;
            break;
    }
    if(AppSettings::debug()){
        notify(AppSettings::hubTitle() + " Inactive", errMsg);
    }
}
