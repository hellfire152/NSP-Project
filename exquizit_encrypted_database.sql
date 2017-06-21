-- phpMyAdmin SQL Dump
-- version 4.6.5.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 20, 2017 at 06:28 PM
-- Server version: 10.1.21-MariaDB
-- PHP Version: 5.6.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `exquizit`
--

-- --------------------------------------------------------

--
-- Table structure for table `achievements`
--

CREATE TABLE `achievements` (
  `achievement_id` int(11) NOT NULL,
  `title` varchar(50) NOT NULL,
  `points` int(11) NOT NULL,
  `description` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `achievement_earned`
--

CREATE TABLE `achievement_earned` (
  `achievement_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `date_achieved` date NOT NULL,
  `total_points` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `log_question`
--

CREATE TABLE `log_question` (
  `log_question_id` int(11) NOT NULL,
  `log_quiz_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `score_gained` int(11) NOT NULL,
  `correct_or_wrong` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `log_quiz`
--

CREATE TABLE `log_quiz` (
  `log_quiz_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `quiz_id` int(11) NOT NULL,
  `score` int(11) NOT NULL,
  `feedback` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `quiz`
--

CREATE TABLE `quiz` (
  `quiz_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `quiz_title` text NOT NULL,
  `quiz_type` varchar(30) NOT NULL,
  `visibility` tinyint(1) NOT NULL,
  `description` text NOT NULL,
  `quiz_rating` int(11) NOT NULL,
  `date_created` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=COMPACT;

--
-- Dumping data for table `quiz`
--

INSERT INTO `quiz` (`quiz_id`, `user_id`, `quiz_title`, `quiz_type`, `visibility`, `description`, `quiz_rating`, `date_created`) VALUES
(1, 1, 'quiz title', 'Classic', 1, 'quiz description', 5, '2017-06-20');

-- --------------------------------------------------------

--
-- Table structure for table `quiz_question`
--

CREATE TABLE `quiz_question` (
  `question_id` int(11) NOT NULL,
  `quiz_id` int(11) NOT NULL,
  `question_no` int(11) NOT NULL,
  `type` int(11) NOT NULL,
  `prompt` text NOT NULL,
  `solution` text NOT NULL,
  `time` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `quiz_question`
--

INSERT INTO `quiz_question` (`question_id`, `quiz_id`, `question_no`, `type`, `prompt`, `solution`, `time`) VALUES
(1, 1, 1, 0, 'b33655b2e1d7e5a5ff69d19866bdc260c712334b1c2c022da8575c2a0b8c29c791dcaf2aab5b7cb2e85cce58be2d2d6a', '616ea200da02461a4cda781027ff4e7d', 30),
(2, 1, 2, 1, 'b33655b2e1d7e5a5ff69d19866bdc260c712334b1c2c022da8575c2a0b8c29c7c9f50302f7e39b78573471c7a1bb9419', 'e12d0f2ca5ceb07b494d5b55003e989ccddf564a73fab9c2deef26523f90b3f7e50a8412117241f1c07079d93a1c25ecd20e563c22c9993d91d04e92fa2230d0bc778b992571b0e9b5f005f0dc75102e', 30),
(3, 1, 3, 1, 'b33655b2e1d7e5a5ff69d19866bdc260c712334b1c2c022da8575c2a0b8c29c78f0c1272acdbc8b78f69f05044fb0032', '27793325a8a2190224d4b69f7095cc3d', 30),
(4, 1, 4, 0, 'b33655b2e1d7e5a5ff69d19866bdc260c712334b1c2c022da8575c2a0b8c29c7f8b43fb298ba4894d535e2bc7a15eff3', '227aeb34deb44cb6550fe5bf08199e5d', 30),
(5, 1, 5, 0, 'b33655b2e1d7e5a5ff69d19866bdc260c712334b1c2c022da8575c2a0b8c29c7cae7b3f08b899986543507c92ddc9677', '0847a0bf26a678a0d899832543220da6', 30);

-- --------------------------------------------------------

--
-- Table structure for table `quiz_question_choices`
--

CREATE TABLE `quiz_question_choices` (
  `choice_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `choices` text NOT NULL,
  `question_no` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `quiz_question_choices`
--

INSERT INTO `quiz_question_choices` (`choice_id`, `question_id`, `choices`, `question_no`) VALUES
(1, 1, '2dcea3442fb3f9f29921a7cc8cb66ffa0670fc7cde5cb853c5f8258fac0bc1fc99c664b9861d7b2bb00fbf2371ba6ae7', 1),
(2, 4, '2dcea3442fb3f9f29921a7cc8cb66ffa0670fc7cde5cb853c5f8258fac0bc1fc99c664b9861d7b2bb00fbf2371ba6ae7', 4),
(3, 5, '2dcea3442fb3f9f29921a7cc8cb66ffa0670fc7cde5cb853c5f8258fac0bc1fc99c664b9861d7b2bb00fbf2371ba6ae7', 5);

-- --------------------------------------------------------

--
-- Table structure for table `student_details`
--

CREATE TABLE `student_details` (
  `student_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `date_of_birth` date NOT NULL,
  `school` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `student_details`
--

INSERT INTO `student_details` (`student_id`, `user_id`, `date_of_birth`, `school`) VALUES
(4, 4, '2017-06-20', '9b10c3ceb898d822803338d5a7b2b569');

-- --------------------------------------------------------

--
-- Table structure for table `teacher_details`
--

CREATE TABLE `teacher_details` (
  `teacher_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `organisation` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `user_account`
--

CREATE TABLE `user_account` (
  `user_id` int(11) NOT NULL,
  `name` text NOT NULL,
  `username` text NOT NULL,
  `email` text NOT NULL,
  `password_hash` text NOT NULL,
  `salt` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user_account`
--

INSERT INTO `user_account` (`user_id`, `name`, `username`, `email`, `password_hash`, `salt`) VALUES
(4, 'aa182b3c9847fd7b6c61a9591a92757d0576a0e01008eb21128550d2cbe63c0c89575cb0de78a940a1785f93aaa2adaa', '948b68cb8558720309654b3682f78e78', 'c58cce27b48d21be9044c7f4795ae71dda4e6664703425eb0b5406d4f93f062ca139148d996294dc1cdae7a1a3ce4bee', 'd8c4a8372b792daaabdd392b15ce31120ce5a4d53686f685f038a971af62c01a30c34885d2c3cda4077a1cf252145534be0ce4159aea34a1c08ade1f0e18423d99228d64cc3963a8a8fb085986fcf8dc', 'a9deb98e683085eac04bc6c3a41acc57d8f9b8b365eae98bec6c73061014d2ccbfc24a159d7b4c48ac906f54bb5be602a0acdcd9cbe6a2eb85ab98e6efce5e2825d881be0e7a9d3ea2805d9a7321b244');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `achievements`
--
ALTER TABLE `achievements`
  ADD PRIMARY KEY (`achievement_id`);

--
-- Indexes for table `achievement_earned`
--
ALTER TABLE `achievement_earned`
  ADD PRIMARY KEY (`achievement_id`,`student_id`),
  ADD KEY `student_id` (`student_id`);

--
-- Indexes for table `log_question`
--
ALTER TABLE `log_question`
  ADD PRIMARY KEY (`log_question_id`),
  ADD KEY `question_id` (`question_id`),
  ADD KEY `log_quiz_id` (`log_quiz_id`);

--
-- Indexes for table `log_quiz`
--
ALTER TABLE `log_quiz`
  ADD PRIMARY KEY (`log_quiz_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `quiz_id` (`quiz_id`);

--
-- Indexes for table `quiz`
--
ALTER TABLE `quiz`
  ADD PRIMARY KEY (`quiz_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `quiz_question`
--
ALTER TABLE `quiz_question`
  ADD PRIMARY KEY (`question_id`),
  ADD KEY `quiz_question_ibfk_1` (`quiz_id`);

--
-- Indexes for table `quiz_question_choices`
--
ALTER TABLE `quiz_question_choices`
  ADD PRIMARY KEY (`choice_id`),
  ADD KEY `question_id` (`question_id`);

--
-- Indexes for table `student_details`
--
ALTER TABLE `student_details`
  ADD PRIMARY KEY (`student_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `teacher_details`
--
ALTER TABLE `teacher_details`
  ADD PRIMARY KEY (`teacher_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `user_account`
--
ALTER TABLE `user_account`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `achievements`
--
ALTER TABLE `achievements`
  MODIFY `achievement_id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `log_question`
--
ALTER TABLE `log_question`
  MODIFY `log_question_id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `log_quiz`
--
ALTER TABLE `log_quiz`
  MODIFY `log_quiz_id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `quiz`
--
ALTER TABLE `quiz`
  MODIFY `quiz_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `quiz_question`
--
ALTER TABLE `quiz_question`
  MODIFY `question_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `quiz_question_choices`
--
ALTER TABLE `quiz_question_choices`
  MODIFY `choice_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `student_details`
--
ALTER TABLE `student_details`
  MODIFY `student_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `teacher_details`
--
ALTER TABLE `teacher_details`
  MODIFY `teacher_id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `user_account`
--
ALTER TABLE `user_account`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `achievement_earned`
--
ALTER TABLE `achievement_earned`
  ADD CONSTRAINT `achievement_earned_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student_details` (`student_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `achievement_earned_ibfk_2` FOREIGN KEY (`achievement_id`) REFERENCES `achievements` (`achievement_id`);

--
-- Constraints for table `log_question`
--
ALTER TABLE `log_question`
  ADD CONSTRAINT `log_question_ibfk_1` FOREIGN KEY (`log_quiz_id`) REFERENCES `log_quiz` (`log_quiz_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `log_question_ibfk_2` FOREIGN KEY (`log_quiz_id`) REFERENCES `log_quiz` (`log_quiz_id`);

--
-- Constraints for table `log_quiz`
--
ALTER TABLE `log_quiz`
  ADD CONSTRAINT `log_quiz_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user_account` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `log_quiz_ibfk_2` FOREIGN KEY (`quiz_id`) REFERENCES `quiz` (`quiz_id`);

--
-- Constraints for table `quiz_question`
--
ALTER TABLE `quiz_question`
  ADD CONSTRAINT `quiz_question_ibfk_1` FOREIGN KEY (`quiz_id`) REFERENCES `quiz` (`quiz_id`) ON DELETE CASCADE;

--
-- Constraints for table `quiz_question_choices`
--
ALTER TABLE `quiz_question_choices`
  ADD CONSTRAINT `quiz_question_choices_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `quiz_question` (`question_id`) ON DELETE CASCADE;

--
-- Constraints for table `student_details`
--
ALTER TABLE `student_details`
  ADD CONSTRAINT `student_details_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user_account` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `teacher_details`
--
ALTER TABLE `teacher_details`
  ADD CONSTRAINT `teacher_details_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user_account` (`user_id`) ON DELETE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
