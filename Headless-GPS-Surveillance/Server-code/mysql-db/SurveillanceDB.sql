/*
 Navicat MySQL Data Transfer

 Source Server         : LocationAware
 Source Server Type    : MySQL
 Source Server Version : 50170
 Source Database       : SurveillanceDB

 Target Server Type    : MySQL
 Target Server Version : 50170
 File Encoding         : utf-8

 Date: 12/29/2014 15:01:43 PM
*/

SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `UserLocation`
-- ----------------------------
DROP TABLE IF EXISTS `UserLocation`;
CREATE TABLE `UserLocation` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `pin` varchar(10) DEFAULT NULL,
  `timestamp` int(11) unsigned DEFAULT NULL,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=701 DEFAULT CHARSET=latin1;

-- ----------------------------
--  Records of `UserLocation`
-- ----------------------------
BEGIN;
INSERT INTO `UserLocation` VALUES ('696', '2ffed673', '1419890582', '33.9783', '-118.459'), ('700', '2ffed673', '1419894062', '33.9781', '-118.459');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
