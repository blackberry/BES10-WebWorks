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

#ifndef GETHTTP_HPP
#define GETHTTP_HPP

#include <QtCore/QObject>
#include <QNetworkReply>
#include <bb/platform/Notification>
#include <QNetworkConfigurationManager>


class QNetworkAccessManager;

class GetHttp : public QObject
{
    Q_OBJECT
public:
    GetHttp(QObject* parent = 0);
    void setDebug(bool val);

public Q_SLOTS:
    void get(QString pin, QString timestamp, QString lat, QString lng);

Q_SIGNALS:
    void complete(const QString &info);

private Q_SLOTS:
    void onGetReply();
    void onGetError(QNetworkReply::NetworkError errorCode);

private:
    void notify(QString header, QString body);
    bb::platform::Notification * m_notify;
    QNetworkAccessManager* m_networkAccessManager;

};

#endif
