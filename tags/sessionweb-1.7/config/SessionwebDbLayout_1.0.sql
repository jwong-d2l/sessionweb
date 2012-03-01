SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL';

DROP SCHEMA IF EXISTS `sessionwebos` ;
CREATE SCHEMA IF NOT EXISTS `sessionwebos` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci ;
USE `sessionwebos` ;

-- -----------------------------------------------------
-- Table `sessionwebos`.`members`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `sessionwebos`.`members` ;

CREATE  TABLE IF NOT EXISTS `sessionwebos`.`members` (
  `username` VARCHAR(45) NOT NULL ,
  `fullname` VARCHAR(45) NULL ,
  `active` TINYINT(1)  NULL DEFAULT TRUE ,
  `superuser` TINYINT(1)  NOT NULL ,
  `admin` TINYINT(1)  NOT NULL ,
  `updated` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP ,
  `password` VARCHAR(100) NOT NULL ,
  PRIMARY KEY (`username`) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `sessionwebos`.`sprintnames`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `sessionwebos`.`sprintnames` ;

CREATE  TABLE IF NOT EXISTS `sessionwebos`.`sprintnames` (
  `sprintname` VARCHAR(100) NOT NULL ,
  `updated` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ,
  PRIMARY KEY (`sprintname`) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `sessionwebos`.`teamnames`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `sessionwebos`.`teamnames` ;

CREATE  TABLE IF NOT EXISTS `sessionwebos`.`teamnames` (
  `teamname` VARCHAR(100) NOT NULL ,
  `updated` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ,
  PRIMARY KEY (`teamname`) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `sessionwebos`.`teamsprintnames`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `sessionwebos`.`teamsprintnames` ;

CREATE  TABLE IF NOT EXISTS `sessionwebos`.`teamsprintnames` (
  `teamsprintname` VARCHAR(100) NOT NULL ,
  `updated` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ,
  PRIMARY KEY (`teamsprintname`) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `sessionwebos`.`sessionid`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `sessionwebos`.`sessionid` ;

CREATE  TABLE IF NOT EXISTS `sessionwebos`.`sessionid` (
  `sessionid` INT NOT NULL AUTO_INCREMENT ,
  `updated` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ,
  `createdby` VARCHAR(45) NOT NULL ,
  PRIMARY KEY (`sessionid`, `createdby`) ,
  INDEX `fk_sessionid_members1` (`createdby` ASC) ,
  CONSTRAINT `fk_sessionid_members1`
    FOREIGN KEY (`createdby` )
    REFERENCES `sessionwebos`.`members` (`username` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `sessionwebos`.`testenvironment`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `sessionwebos`.`testenvironment` ;

CREATE  TABLE IF NOT EXISTS `sessionwebos`.`testenvironment` (
  `name` VARCHAR(45) NOT NULL ,
  PRIMARY KEY (`name`) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `sessionwebos`.`mission`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `sessionwebos`.`mission` ;

CREATE  TABLE IF NOT EXISTS `sessionwebos`.`mission` (
  `versionid` INT NOT NULL AUTO_INCREMENT ,
  `sessionid` INT NOT NULL ,
  `title` VARCHAR(500) NULL ,
  `charter` TEXT NULL ,
  `notes` TEXT NULL ,
  `username` VARCHAR(45) NOT NULL ,
  `teamname` VARCHAR(100) NULL ,
  `sprintname` VARCHAR(100) NULL ,
  `teamsprintname` VARCHAR(100) NULL ,
  `depricated` TINYINT(1)  NULL DEFAULT 0 ,
  `updated` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP ,
  `publickey` VARCHAR(100) NOT NULL ,
  `testenvironment` VARCHAR(45) NULL ,
  `software` VARCHAR(45) NULL ,
  INDEX `fk_mission_members` (`username` ASC) ,
  INDEX `fk_mission_sprintnames` (`sprintname` ASC) ,
  INDEX `fk_mission_teamnames` (`teamname` ASC) ,
  INDEX `fk_mission_teamsprintnames1` (`teamsprintname` ASC) ,
  UNIQUE INDEX `sessionid_UNIQUE` (`sessionid` ASC) ,
  UNIQUE INDEX `versionid_UNIQUE` (`versionid` ASC) ,
  PRIMARY KEY (`versionid`) ,
  INDEX `fk_mission_testenvironment1` (`testenvironment` ASC) ,
  CONSTRAINT `fk_mission_members`
    FOREIGN KEY (`username` )
    REFERENCES `sessionwebos`.`members` (`username` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_mission_sprintnames`
    FOREIGN KEY (`sprintname` )
    REFERENCES `sessionwebos`.`sprintnames` (`sprintname` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_mission_teamnames`
    FOREIGN KEY (`teamname` )
    REFERENCES `sessionwebos`.`teamnames` (`teamname` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_mission_teamsprintnames1`
    FOREIGN KEY (`teamsprintname` )
    REFERENCES `sessionwebos`.`teamsprintnames` (`teamsprintname` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_mission_sessionid1`
    FOREIGN KEY (`sessionid` )
    REFERENCES `sessionwebos`.`sessionid` (`sessionid` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_mission_testenvironment1`
    FOREIGN KEY (`testenvironment` )
    REFERENCES `sessionwebos`.`testenvironment` (`name` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `sessionwebos`.`mission_status`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `sessionwebos`.`mission_status` ;

CREATE  TABLE IF NOT EXISTS `sessionwebos`.`mission_status` (
  `versionid` INT NOT NULL ,
  `executed` TINYINT(1)  NOT NULL DEFAULT false ,
  `debriefed` TINYINT(1)  NOT NULL DEFAULT false ,
  `masterdibriefed` TINYINT(1)  NOT NULL DEFAULT false ,
  `executed_timestamp` TIMESTAMP NULL ,
  `debriefed_timestamp` TIMESTAMP NULL ,
  PRIMARY KEY (`versionid`) ,
  CONSTRAINT `fk_mission_status_mission1`
    FOREIGN KEY (`versionid` )
    REFERENCES `sessionwebos`.`mission` (`versionid` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `sessionwebos`.`mission_sessionmetrics`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `sessionwebos`.`mission_sessionmetrics` ;

CREATE  TABLE IF NOT EXISTS `sessionwebos`.`mission_sessionmetrics` (
  `versionid` INT NOT NULL ,
  `setup_percent` INT NULL ,
  `test_percent` INT NULL ,
  `bug_percent` INT NULL ,
  `opportunity_percent` INT NULL ,
  `duration_time` INT NULL ,
  PRIMARY KEY (`versionid`) ,
  CONSTRAINT `fk_mision_sessionmetrics_mission1`
    FOREIGN KEY (`versionid` )
    REFERENCES `sessionwebos`.`mission` (`versionid` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `sessionwebos`.`mission_debriefnotes`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `sessionwebos`.`mission_debriefnotes` ;

CREATE  TABLE IF NOT EXISTS `sessionwebos`.`mission_debriefnotes` (
  `versionid` INT NOT NULL ,
  `notes` VARCHAR(45) NULL ,
  `debriefedby` VARCHAR(45) NOT NULL ,
  PRIMARY KEY (`versionid`) ,
  INDEX `fk_debriefnotes_users1` (`debriefedby` ASC) ,
  INDEX `fk_debriefnotes_mission1` (`versionid` ASC) ,
  CONSTRAINT `fk_debriefnotes_users1`
    FOREIGN KEY (`debriefedby` )
    REFERENCES `sessionwebos`.`members` (`username` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_debriefnotes_mission1`
    FOREIGN KEY (`versionid` )
    REFERENCES `sessionwebos`.`mission` (`versionid` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `sessionwebos`.`settings`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `sessionwebos`.`settings` ;

CREATE  TABLE IF NOT EXISTS `sessionwebos`.`settings` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `normalized_session_time` INT NULL ,
  `team` TINYINT(1)  NULL ,
  `sprint` TINYINT(1)  NULL ,
  `teamsprint` TINYINT(1)  NULL ,
  `area` TINYINT(1)  NULL ,
  `testenvironment` TINYINT(1)  NULL ,
  `publicview` TINYINT(1)  NULL ,
  `analyticsid` VARCHAR(45) NULL COMMENT 'google analytics id' ,
  `url_to_dms` VARCHAR(500) NULL ,
  `url_to_rms` VARCHAR(500) NULL ,
  PRIMARY KEY (`id`) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `sessionwebos`.`areas`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `sessionwebos`.`areas` ;

CREATE  TABLE IF NOT EXISTS `sessionwebos`.`areas` (
  `areaname` VARCHAR(100) NOT NULL ,
  `updated` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ,
  PRIMARY KEY (`areaname`) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `sessionwebos`.`mission_areas`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `sessionwebos`.`mission_areas` ;

CREATE  TABLE IF NOT EXISTS `sessionwebos`.`mission_areas` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `versionid` INT NOT NULL ,
  `areaname` VARCHAR(100) NOT NULL ,
  INDEX `fk_debriefnotes_mission1` (`versionid` ASC) ,
  INDEX `fk_mission_debriefnotes_copy1_areas1` (`areaname` ASC) ,
  PRIMARY KEY (`id`) ,
  CONSTRAINT `fk_mission_areas_mission`
    FOREIGN KEY (`versionid` )
    REFERENCES `sessionwebos`.`mission` (`versionid` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_mission_debriefnotes_copy1_areas1`
    FOREIGN KEY (`areaname` )
    REFERENCES `sessionwebos`.`areas` (`areaname` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `sessionwebos`.`mission_bugs`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `sessionwebos`.`mission_bugs` ;

CREATE  TABLE IF NOT EXISTS `sessionwebos`.`mission_bugs` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `versionid` INT NOT NULL ,
  `bugid` VARCHAR(45) NOT NULL ,
  INDEX `fk_debriefnotes_mission1` (`versionid` ASC) ,
  PRIMARY KEY (`id`) ,
  CONSTRAINT `fk_bugs_mission100`
    FOREIGN KEY (`versionid` )
    REFERENCES `sessionwebos`.`mission` (`versionid` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `sessionwebos`.`mission_requirements`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `sessionwebos`.`mission_requirements` ;

CREATE  TABLE IF NOT EXISTS `sessionwebos`.`mission_requirements` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `versionid` INT NOT NULL ,
  `requirementsid` VARCHAR(45) NOT NULL ,
  INDEX `fk_missionreq_mission1` (`versionid` ASC) ,
  PRIMARY KEY (`id`) ,
  CONSTRAINT `fk_bugs_mission1000`
    FOREIGN KEY (`versionid` )
    REFERENCES `sessionwebos`.`mission` (`versionid` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `sessionwebos`.`mission_sessionsconnections`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `sessionwebos`.`mission_sessionsconnections` ;

CREATE  TABLE IF NOT EXISTS `sessionwebos`.`mission_sessionsconnections` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `linked_from_versionid` INT NOT NULL ,
  `linked_to_versionid` INT NOT NULL ,
  PRIMARY KEY (`id`) ,
  INDEX `fk_mission_sessionsconnections_mission1` (`linked_from_versionid` ASC) ,
  CONSTRAINT `fk_mission_sessionsconnections_mission1`
    FOREIGN KEY (`linked_from_versionid` )
    REFERENCES `sessionwebos`.`mission` (`versionid` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `sessionwebos`.`user_settings`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `sessionwebos`.`user_settings` ;

CREATE  TABLE IF NOT EXISTS `sessionwebos`.`user_settings` (
  `username` VARCHAR(45) NOT NULL ,
  `teamname` VARCHAR(100) NULL ,
  `list_view` VARCHAR(45) NULL ,
  PRIMARY KEY (`username`) ,
  INDEX `fk_user_settings_members1` (`username` ASC) ,
  INDEX `fk_user_settings_teamnames1` (`teamname` ASC) ,
  CONSTRAINT `fk_user_settings_members1`
    FOREIGN KEY (`username` )
    REFERENCES `sessionwebos`.`members` (`username` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_user_settings_teamnames1`
    FOREIGN KEY (`teamname` )
    REFERENCES `sessionwebos`.`teamnames` (`teamname` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Placeholder table for view `sessionwebos`.`sessioninfo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sessionwebos`.`sessioninfo` (`sessionid` INT, `versionid` INT, `title` INT, `username` INT, `executed` INT, `debriefed` INT, `publickey` INT, `updated` INT);

-- -----------------------------------------------------
-- View `sessionwebos`.`sessioninfo`
-- -----------------------------------------------------
DROP VIEW IF EXISTS `sessionwebos`.`sessioninfo` ;
DROP TABLE IF EXISTS `sessionwebos`.`sessioninfo`;
USE `sessionwebos`;
CREATE  OR REPLACE VIEW `sessionwebos`.`sessioninfo` AS SELECT m.sessionid, m.versionid, m.title, m.username, ms.executed, ms.debriefed, m.publickey, m.updated 
from mission m, mission_status ms WHERE m.versionid = ms.versionid;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- -----------------------------------------------------
-- Data for table `sessionwebos`.`members`
-- -----------------------------------------------------
SET AUTOCOMMIT=0;
USE `sessionwebos`;
INSERT INTO `sessionwebos`.`members` (`username`, `fullname`, `active`, `superuser`, `admin`, `updated`, `password`) VALUES ('admin', 'Administrator', '1', '1', '1', NULL, '21232f297a57a5a743894a0e4a801fc3');

COMMIT;

-- -----------------------------------------------------
-- Data for table `sessionwebos`.`settings`
-- -----------------------------------------------------
SET AUTOCOMMIT=0;
USE `sessionwebos`;
INSERT INTO `sessionwebos`.`settings` (`id`, `normalized_session_time`, `team`, `sprint`, `teamsprint`, `area`, `testenvironment`, `publicview`, `analyticsid`, `url_to_dms`, `url_to_rms`) VALUES (NULL, '90', '1', '1', '1', '1', '1', '1', NULL, NULL, NULL);

COMMIT;

-- -----------------------------------------------------
-- Data for table `sessionwebos`.`user_settings`
-- -----------------------------------------------------
SET AUTOCOMMIT=0;
USE `sessionwebos`;
INSERT INTO `sessionwebos`.`user_settings` (`username`, `teamname`, `list_view`) VALUES ('admin', NULL, 'all');

COMMIT;