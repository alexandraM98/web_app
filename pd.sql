-- phpMyAdmin SQL Dump
-- version 4.7.7
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Oct 04, 2018 at 10:43 AM
-- Server version: 5.6.38
-- PHP Version: 7.2.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";
--
-- Database: `pd_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `Medicine`
--

CREATE TABLE `Medicine` (
  `medicineID` int(11) NOT NULL,
  `name` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Medicine`
--

INSERT INTO `Medicine` (`medicineID`, `name`) VALUES
(1, 'Medicine 1'),
(2, 'Medicine 2');

-- --------------------------------------------------------

--
-- Table structure for table `Note`
--

CREATE TABLE `Note` (
  `noteID` int(11) NOT NULL,
  `Test_Session_IDtest_session` int(11) NOT NULL,
  `note` longtext NOT NULL,
  `User_IDmed` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Note`
--

INSERT INTO `Note` (`noteID`, `Test_Session_IDtest_session`, `note`, `User_IDmed`) VALUES
(1, 1, 'Well this is interesting.', 2),
(2, 1, 'This seams a bit weird.', 1);

-- --------------------------------------------------------

--
-- Table structure for table `Organization`
--

CREATE TABLE `Organization` (
  `organizationID` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Organization`
--

INSERT INTO `Organization` (`organizationID`, `name`) VALUES
(1, 'Hospital'),
(2, 'LNU University');

-- --------------------------------------------------------

--
-- Table structure for table `Role`
--

CREATE TABLE `Role` (
  `roleID` int(11) NOT NULL,
  `name` varchar(45) NOT NULL,
  `type` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Role`
--

INSERT INTO `Role` (`roleID`, `name`, `type`) VALUES
(1, 'patient', '1'),
(2, 'physician', '2'),
(3, 'researcher', '3'),
(4, 'junior researcher', '3');

-- --------------------------------------------------------

--
-- Table structure for table `Test`
--

CREATE TABLE `Test` (
  `testID` int(11) NOT NULL,
  `dateTime` datetime NOT NULL,
  `Therapy_IDtherapy` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Test`
--

INSERT INTO `Test` (`testID`, `dateTime`, `Therapy_IDtherapy`) VALUES
(1, '2009-12-01 18:00:00', 1),
(2, '2009-12-02 18:00:00', 1),
(3, '2009-12-02 18:00:00', 2);

-- --------------------------------------------------------

--
-- Table structure for table `Test_Session`
--

CREATE TABLE `Test_Session` (
  `test_SessionID` int(11) NOT NULL,
  `test_type` int(11) NOT NULL,
  `Test_IDtest` int(11) NOT NULL,
  `DataURL` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Test_Session`
--

INSERT INTO `Test_Session` (`test_SessionID`, `test_type`, `Test_IDtest`, `DataURL`) VALUES
(1, 1, 1, 'data1'),
(2, 2, 1, 'data2'),
(3, 1, 2, 'data3'),
(4, 2, 2, 'data4'),
(5, 1, 3, 'data5'),
(6, 2, 3, 'data6');

-- --------------------------------------------------------

--
-- Table structure for table `Therapy`
--

CREATE TABLE `Therapy` (
  `therapyID` int(11) NOT NULL,
  `User_IDpatient` int(11) NOT NULL,
  `User_IDmed` int(11) NOT NULL,
  `TherapyList_IDtherapylist` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Therapy`
--

INSERT INTO `Therapy` (`therapyID`, `User_IDpatient`, `User_IDmed`, `TherapyList_IDtherapylist`) VALUES
(1, 3, 1, 1),
(2, 4, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `Therapy_List`
--

CREATE TABLE `Therapy_List` (
  `therapy_listID` int(11) NOT NULL,
  `name` varchar(45) NOT NULL,
  `Medicine_IDmedicine` int(11) NOT NULL,
  `Dosage` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Therapy_List`
--

INSERT INTO `Therapy_List` (`therapy_listID`, `name`, `Medicine_IDmedicine`, `Dosage`) VALUES
(1, 'Therapy trials with Medicine 1', 1, '400 ml');

-- --------------------------------------------------------

--
-- Table structure for table `User`
--

CREATE TABLE `User` (
  `userID` int(11) NOT NULL,
  `username` varchar(45) NOT NULL,
  `email` varchar(255) NOT NULL,
  `Role_IDrole` int(11) NOT NULL,
  `Organization` int(11) NOT NULL,
  `Lat` float DEFAULT NULL,
  `Long` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `User`
--

INSERT INTO `User` (`userID`, `username`, `email`, `Role_IDrole`, `Organization`, `Lat`, `Long`) VALUES
(1, 'doc', 'doc@hospital.com', 2, 1, NULL, NULL),
(2, 'researcher', 'res@uni.se', 3, 2, NULL, NULL),
(3, 'patient1', 'x@gmail.com', 1, 1, 59.6567, 16.6709),
(4, 'patient2', 'y@happyemail.com', 1, 1, 57.3365, 12.5164);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Medicine`
--
ALTER TABLE `Medicine`
  ADD PRIMARY KEY (`medicineID`);

--
-- Indexes for table `Note`
--
ALTER TABLE `Note`
  ADD PRIMARY KEY (`noteID`),
  ADD KEY `fk_Test_SessionID_idx` (`Test_Session_IDtest_session`),
  ADD KEY `fk_UserID_idx` (`User_IDmed`);

--
-- Indexes for table `Organization`
--
ALTER TABLE `Organization`
  ADD PRIMARY KEY (`organizationID`);

--
-- Indexes for table `Role`
--
ALTER TABLE `Role`
  ADD PRIMARY KEY (`roleID`);

--
-- Indexes for table `Test`
--
ALTER TABLE `Test`
  ADD PRIMARY KEY (`testID`),
  ADD KEY `fk_TherapyID_idx` (`Therapy_IDtherapy`);

--
-- Indexes for table `Test_Session`
--
ALTER TABLE `Test_Session`
  ADD PRIMARY KEY (`test_SessionID`),
  ADD KEY `fk_TestID_idx` (`Test_IDtest`);

--
-- Indexes for table `Therapy`
--
ALTER TABLE `Therapy`
  ADD PRIMARY KEY (`therapyID`),
  ADD KEY `fk_UserID_Patient_idx` (`User_IDpatient`),
  ADD KEY `fk_UserID_medic_idx` (`User_IDmed`),
  ADD KEY `fk_Therapy_ListID_idx` (`TherapyList_IDtherapylist`);

--
-- Indexes for table `Therapy_List`
--
ALTER TABLE `Therapy_List`
  ADD PRIMARY KEY (`therapy_listID`),
  ADD KEY `fk_medicineID_idx` (`Medicine_IDmedicine`);

--
-- Indexes for table `User`
--
ALTER TABLE `User`
  ADD PRIMARY KEY (`userID`),
  ADD UNIQUE KEY `username_UNIQUE` (`username`),
  ADD KEY `roleID_idx` (`Role_IDrole`),
  ADD KEY `fk_User_Organization_idx` (`Organization`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Medicine`
--
ALTER TABLE `Medicine`
  MODIFY `medicineID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `Note`
--
ALTER TABLE `Note`
  MODIFY `noteID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `Organization`
--
ALTER TABLE `Organization`
  MODIFY `organizationID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Role`
--
ALTER TABLE `Role`
  MODIFY `roleID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `Test`
--
ALTER TABLE `Test`
  MODIFY `testID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `Test_Session`
--
ALTER TABLE `Test_Session`
  MODIFY `test_SessionID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `Therapy`
--
ALTER TABLE `Therapy`
  MODIFY `therapyID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `Therapy_List`
--
ALTER TABLE `Therapy_List`
  MODIFY `therapy_listID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `User`
--
ALTER TABLE `User`
  MODIFY `userID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Note`
--
ALTER TABLE `Note`
  ADD CONSTRAINT `fk_Test_SessionID` FOREIGN KEY (`Test_Session_IDtest_session`) REFERENCES `Test_Session` (`test_SessionID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_UserID` FOREIGN KEY (`User_IDmed`) REFERENCES `User` (`userID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `Test`
--
ALTER TABLE `Test`
  ADD CONSTRAINT `fk_TherapyID` FOREIGN KEY (`Therapy_IDtherapy`) REFERENCES `Therapy` (`therapyID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `Test_Session`
--
ALTER TABLE `Test_Session`
  ADD CONSTRAINT `fk_TestID` FOREIGN KEY (`Test_IDtest`) REFERENCES `Test` (`testID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `Therapy`
--
ALTER TABLE `Therapy`
  ADD CONSTRAINT `fk_Therapy_ListID` FOREIGN KEY (`TherapyList_IDtherapylist`) REFERENCES `Therapy_List` (`therapy_listID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_UserID_Patient` FOREIGN KEY (`User_IDpatient`) REFERENCES `User` (`userID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_UserID_medic` FOREIGN KEY (`User_IDmed`) REFERENCES `User` (`userID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `Therapy_List`
--
ALTER TABLE `Therapy_List`
  ADD CONSTRAINT `fk_MedicineID` FOREIGN KEY (`Medicine_IDmedicine`) REFERENCES `Medicine` (`medicineID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `User`
--
ALTER TABLE `User`
  ADD CONSTRAINT `fk_User_Organization` FOREIGN KEY (`Organization`) REFERENCES `Organization` (`OrganizationID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_User_Role` FOREIGN KEY (`Role_IDrole`) REFERENCES `Role` (`roleID`) ON DELETE NO ACTION ON UPDATE NO ACTION;
