# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.5.5-10.6.12-MariaDB-1:10.6.12+maria~ubu2004)
# Database: recpcrtr
# Generation Time: 2023-04-15 16:45:06 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


CREATE TABLE IF NOT EXISTS `folder` (
  `fdr_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `fdr_name` varchar(50) NOT NULL DEFAULT '',
  `fdr_img` blob DEFAULT NULL,
  `fdr_num_rcp` int(11) NOT NULL DEFAULT 0,
  `fdr_owner` int(11) unsigned NOT NULL,
  PRIMARY KEY (`fdr_id`),
  KEY `FK_USR_ID` (`fdr_owner`),
  CONSTRAINT `FK_USR_ID` FOREIGN KEY (`fdr_owner`) REFERENCES `user` (`usr_id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE IF NOT EXISTS `folder_recipe` (
  `frp_rcp_id` int(11) unsigned NOT NULL,
  `frp_fdr_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`frp_rcp_id`,`frp_fdr_id`),
  KEY `FK_FRP_RCP` (`frp_rcp_id`),
  KEY `FK_FRP_FDR` (`frp_fdr_id`),
  CONSTRAINT `FK_FRP_FDR` FOREIGN KEY (`frp_fdr_id`) REFERENCES `folder` (`fdr_id`) ON DELETE CASCADE,
  CONSTRAINT `FK_FRP_RCP` FOREIGN KEY (`frp_rcp_id`) REFERENCES `recipe` (`rcp_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE IF NOT EXISTS `follow` (
  `id` int(11) unsigned NOT NULL,
  `user_id` int(11) unsigned NOT NULL,
  `fol_target` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_FOL_SRC` (`user_id`),
  CONSTRAINT `FK_FOL_SRC` FOREIGN KEY (`user_id`) REFERENCES `user` (`usr_id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



CREATE TABLE IF NOT EXISTS `ingredient` (
  `ing_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `ing_name` varchar(25) NOT NULL DEFAULT '',
  `ing_amount` smallint(6) NOT NULL,
  `ing_measurement` varchar(10) NOT NULL DEFAULT '',
  `ing_rcp_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`ing_id`),
  KEY `FK_ING_RCP` (`ing_rcp_id`),
  CONSTRAINT `FK_ING_RCP` FOREIGN KEY (`ing_rcp_id`) REFERENCES `recipe` (`rcp_id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE IF NOT EXISTS `recipe` (
  `rcp_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `rcp_name` varchar(50) NOT NULL DEFAULT '',
  `rcp_description` blob NOT NULL,
  `rcp_instruction` blob NOT NULL,
  `rcp_img` blob DEFAULT NULL,
  `rcp_public` tinyint(1) NOT NULL DEFAULT 0,
  `rcp_time` smallint(4) NOT NULL,
  `rcp_date` datetime NOT NULL,
  PRIMARY KEY (`rcp_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE IF NOT EXISTS `recipe_tag` (
  `rct_rcp_id` int(11) unsigned NOT NULL,
  `rct_tag_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`rct_rcp_id`,`rct_tag_id`),
  KEY `FK_RCT_RCP` (`rct_rcp_id`),
  KEY `FK_RCT_TAG` (`rct_tag_id`),
  CONSTRAINT `FK_RCT_RCP` FOREIGN KEY (`rct_rcp_id`) REFERENCES `recipe` (`rcp_id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `FK_RCT_TAG` FOREIGN KEY (`rct_tag_id`) REFERENCES `tags` (`tag_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE IF NOT EXISTS `tags` (
  `tag_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `tag_name` varchar(25) NOT NULL DEFAULT '',
  PRIMARY KEY (`tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

LOCK TABLES `tags` WRITE;
/*!40000 ALTER TABLE `tags` DISABLE KEYS */;

INSERT INTO `tags` (`tag_id`, `tag_name`)
VALUES
	(1,'Gluten Free'),
	(2,'Keto'),
	(3,'Paleo'),
	(4,'Pork'),
	(5,'Beef'),
	(6,'Chicken'),
	(7,'Vegetarian'),
	(8,' Vegan'),
	(9,'Seafood');

/*!40000 ALTER TABLE `tags` ENABLE KEYS */;
UNLOCK TABLES;

CREATE TABLE IF NOT EXISTS `user` (
  `usr_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `usr_username` varchar(50) NOT NULL DEFAULT '',
  `usr_name` varchar(50) NOT NULL DEFAULT '',
  `usr_salt` varchar(100) NOT NULL DEFAULT '',
  `usr_img` varchar(255) DEFAULT NULL,
  `usr_password` varchar(255) NOT NULL DEFAULT '',
  `usr_bio` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`usr_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `user_recipe` (
  `usp_usr_id` int(11) unsigned NOT NULL,
  `usp_rcp_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`usp_usr_id`,`usp_rcp_id`),
  KEY `FK_USP_USR` (`usp_usr_id`),
  KEY `FK_USP_RCP` (`usp_rcp_id`),
  CONSTRAINT `FK_USP_RCP` FOREIGN KEY (`usp_rcp_id`) REFERENCES `recipe` (`rcp_id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `FK_USP_USR` FOREIGN KEY (`usp_usr_id`) REFERENCES `user` (`usr_id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
