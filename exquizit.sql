-- phpMyAdmin SQL Dump
-- version 4.6.5.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 15, 2017 at 11:52 AM
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
  `quiz_title` varchar(50) NOT NULL,
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
(23, 1, 'quiz title', 'Classic', 1, 'quiz description', 5, '2017-06-15'),
(24, 1, 'quiz title', 'Classic', 1, 'quiz description', 5, '2017-06-15');

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
  `solution` varchar(100) NOT NULL,
  `time` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `quiz_question`
--

INSERT INTO `quiz_question` (`question_id`, `quiz_id`, `question_no`, `type`, `prompt`, `solution`, `time`) VALUES
(105, 23, 1, 0, 'Question statement 1', '2', 30),
(106, 23, 2, 1, 'Question statement 2', 'This is the answer for short answer', 30),
(107, 23, 3, 1, 'Question statement 3', 'No answer', 30),
(108, 23, 4, 0, 'Question statement 4', '4', 30),
(109, 23, 5, 0, 'Question statement 5', '2', 30),
(110, 24, 1, 0, 'Question statement 1', '0', 30),
(111, 24, 2, 1, 'Question statement 2', 'This is the answer for short answer', 30),
(112, 24, 3, 1, 'Question statement 3', 'No answer', 30),
(113, 24, 4, 0, 'Question statement 4', '8', 30),
(114, 24, 5, 0, 'Question statement 5', '8', 30);

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
(31, 105, '[\"ANS1\",\"ANS2\",\"ANS3\",\"ANS4\"]', 1),
(32, 108, '[\"ANS1\",\"ANS2\",\"ANS3\",\"ANS4\"]', 4),
(33, 109, '[\"ANS1\",\"ANS2\",\"ANS3\",\"ANS4\"]', 5),
(34, 110, '[\"ANS1\",\"ANS2\",\"ANS3\",\"ANS4\"]', 1),
(35, 113, '[\"ANS1\",\"ANS2\",\"ANS3\",\"ANS4\"]', 4),
(36, 114, '[\"ANS1\",\"ANS2\",\"ANS3\",\"ANS4\"]', 5);

-- --------------------------------------------------------

--
-- Table structure for table `student_details`
--

CREATE TABLE `student_details` (
  `student_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `date_of_birth` date NOT NULL,
  `school` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `student_details`
--

INSERT INTO `student_details` (`student_id`, `user_id`, `date_of_birth`, `school`) VALUES
(1, 2, '2017-06-14', 'NYP');

-- --------------------------------------------------------

--
-- Table structure for table `teacher_details`
--

CREATE TABLE `teacher_details` (
  `teacher_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `organisation` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `teacher_details`
--

INSERT INTO `teacher_details` (`teacher_id`, `user_id`, `organisation`) VALUES
(1, 1, 'NYP organisation');

-- --------------------------------------------------------

--
-- Table structure for table `user_account`
--

CREATE TABLE `user_account` (
  `user_id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `username` varchar(30) NOT NULL,
  `email` text NOT NULL,
  `password_hash` varchar(64) NOT NULL,
  `salt` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user_account`
--

INSERT INTO `user_account` (`user_id`, `name`, `username`, `email`, `password_hash`, `salt`) VALUES
(1, 'Nigel Chen Chin Hao Teacher', 'nigelhao_teacher', 'nigel.zch@gmail.com', 'hYTFh4g9zcsrbhJLghFclKpKxBO+z+BxG8U3e6OQx5Q=', 'HiyrvTsZ3TtLWAoI2FczQNPTogefxr4xmdkPChPmzVA='),
(2, 'Nigel Chen Chin Hao', 'nigelhao', 'nigel_ncch@hotmail.com', 'nTRf725SxSGxVnIHsnYeIiqUKBLw3oMMK7Y3hGic2Gw=', '5BE3Tqi4kkpbtQLijhvroknO/OwH/FVTgcpBIvNxZRY=');

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
  MODIFY `quiz_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;
--
-- AUTO_INCREMENT for table `quiz_question`
--
ALTER TABLE `quiz_question`
  MODIFY `question_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=115;
--
-- AUTO_INCREMENT for table `quiz_question_choices`
--
ALTER TABLE `quiz_question_choices`
  MODIFY `choice_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;
--
-- AUTO_INCREMENT for table `student_details`
--
ALTER TABLE `student_details`
  MODIFY `student_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `teacher_details`
--
ALTER TABLE `teacher_details`
  MODIFY `teacher_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `user_account`
--
ALTER TABLE `user_account`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
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
