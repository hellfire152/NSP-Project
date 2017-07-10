-- phpMyAdmin SQL Dump
-- version 4.6.5.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 10, 2017 at 07:15 PM
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
  `feedback` text NOT NULL,
  `date` date NOT NULL
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
(2, 1, 'baby product', 'Classic', 1, 'for couples that have new born baby', 5, '2017-06-30'),
(3, 1, 'java test 101', 'Classic', 1, 'test your ultimate coding skill', 5, '2017-06-30'),
(4, 1, 'Network security project', 'Classic', 1, 'Use any language C# java, anything', 5, '2017-06-30'),
(5, 1, 'Cyber Defenders Discovery Camp', 'Classic', 1, 'Protect the cyber space with your knowledge', 5, '2017-06-30'),
(6, 1, 'java is not awesome', 'Classic', 1, 'It is so slow, but you still need to know', 5, '2017-06-30'),
(7, 1, 'Marriage', 'Classic', 1, 'Choose your baby name', 5, '2017-06-30'),
(8, 1, 'Romance', 'Classic', 1, 'Learn how to take care of a baby', 5, '2017-06-30'),
(9, 1, 'Netridder', 'Classic', 1, 'Network is very difficult', 5, '2017-06-30'),
(10, 1, 'Know your product', 'Classic', 1, 'About new technology', 5, '2017-06-30');

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
(6, 2, 1, 0, 'b33655b2e1d7e5a5ff69d19866bdc260c712334b1c2c022da8575c2a0b8c29c791dcaf2aab5b7cb2e85cce58be2d2d6a', '6e901ce5e45055e4399fbbaf450224cb', 30),
(8, 2, 3, 1, 'b33655b2e1d7e5a5ff69d19866bdc260c712334b1c2c022da8575c2a0b8c29c78f0c1272acdbc8b78f69f05044fb0032', '27793325a8a2190224d4b69f7095cc3d', 30),
(9, 2, 4, 0, 'b33655b2e1d7e5a5ff69d19866bdc260c712334b1c2c022da8575c2a0b8c29c7f8b43fb298ba4894d535e2bc7a15eff3', '1115a549fac3ca63c99bad5f45a43b46', 30),
(10, 2, 5, 0, 'b33655b2e1d7e5a5ff69d19866bdc260c712334b1c2c022da8575c2a0b8c29c7cae7b3f08b899986543507c92ddc9677', '6e901ce5e45055e4399fbbaf450224cb', 30),
(11, 3, 1, 0, 'b33655b2e1d7e5a5ff69d19866bdc260c712334b1c2c022da8575c2a0b8c29c791dcaf2aab5b7cb2e85cce58be2d2d6a', '6e901ce5e45055e4399fbbaf450224cb', 30),
(12, 3, 2, 1, 'b33655b2e1d7e5a5ff69d19866bdc260c712334b1c2c022da8575c2a0b8c29c7c9f50302f7e39b78573471c7a1bb9419', 'e12d0f2ca5ceb07b494d5b55003e989ccddf564a73fab9c2deef26523f90b3f7e50a8412117241f1c07079d93a1c25ecd20e563c22c9993d91d04e92fa2230d0bc778b992571b0e9b5f005f0dc75102e', 30),
(13, 3, 3, 1, 'b33655b2e1d7e5a5ff69d19866bdc260c712334b1c2c022da8575c2a0b8c29c78f0c1272acdbc8b78f69f05044fb0032', '27793325a8a2190224d4b69f7095cc3d', 30),
(14, 3, 4, 0, 'b33655b2e1d7e5a5ff69d19866bdc260c712334b1c2c022da8575c2a0b8c29c7f8b43fb298ba4894d535e2bc7a15eff3', '1115a549fac3ca63c99bad5f45a43b46', 30),
(15, 3, 5, 0, 'b33655b2e1d7e5a5ff69d19866bdc260c712334b1c2c022da8575c2a0b8c29c7cae7b3f08b899986543507c92ddc9677', '6e901ce5e45055e4399fbbaf450224cb', 30),
(16, 4, 1, 0, 'b33655b2e1d7e5a5ff69d19866bdc260c712334b1c2c022da8575c2a0b8c29c791dcaf2aab5b7cb2e85cce58be2d2d6a', '6e901ce5e45055e4399fbbaf450224cb', 30),
(17, 4, 2, 1, 'b33655b2e1d7e5a5ff69d19866bdc260c712334b1c2c022da8575c2a0b8c29c7c9f50302f7e39b78573471c7a1bb9419', 'e12d0f2ca5ceb07b494d5b55003e989ccddf564a73fab9c2deef26523f90b3f7e50a8412117241f1c07079d93a1c25ecd20e563c22c9993d91d04e92fa2230d0bc778b992571b0e9b5f005f0dc75102e', 30),
(18, 4, 3, 1, 'b33655b2e1d7e5a5ff69d19866bdc260c712334b1c2c022da8575c2a0b8c29c78f0c1272acdbc8b78f69f05044fb0032', '27793325a8a2190224d4b69f7095cc3d', 30),
(19, 4, 4, 0, 'b33655b2e1d7e5a5ff69d19866bdc260c712334b1c2c022da8575c2a0b8c29c7f8b43fb298ba4894d535e2bc7a15eff3', '1115a549fac3ca63c99bad5f45a43b46', 30),
(20, 4, 5, 0, 'b33655b2e1d7e5a5ff69d19866bdc260c712334b1c2c022da8575c2a0b8c29c7cae7b3f08b899986543507c92ddc9677', '6e901ce5e45055e4399fbbaf450224cb', 30),
(21, 5, 1, 0, 'b33655b2e1d7e5a5ff69d19866bdc260c712334b1c2c022da8575c2a0b8c29c791dcaf2aab5b7cb2e85cce58be2d2d6a', '6e901ce5e45055e4399fbbaf450224cb', 30),
(22, 5, 2, 1, 'b33655b2e1d7e5a5ff69d19866bdc260c712334b1c2c022da8575c2a0b8c29c7c9f50302f7e39b78573471c7a1bb9419', 'e12d0f2ca5ceb07b494d5b55003e989ccddf564a73fab9c2deef26523f90b3f7e50a8412117241f1c07079d93a1c25ecd20e563c22c9993d91d04e92fa2230d0bc778b992571b0e9b5f005f0dc75102e', 30),
(23, 5, 3, 1, 'b33655b2e1d7e5a5ff69d19866bdc260c712334b1c2c022da8575c2a0b8c29c78f0c1272acdbc8b78f69f05044fb0032', '27793325a8a2190224d4b69f7095cc3d', 30),
(25, 5, 5, 0, 'b33655b2e1d7e5a5ff69d19866bdc260c712334b1c2c022da8575c2a0b8c29c7cae7b3f08b899986543507c92ddc9677', '6e901ce5e45055e4399fbbaf450224cb', 30),
(26, 6, 1, 0, 'b33655b2e1d7e5a5ff69d19866bdc260c712334b1c2c022da8575c2a0b8c29c791dcaf2aab5b7cb2e85cce58be2d2d6a', '6e901ce5e45055e4399fbbaf450224cb', 30),
(27, 6, 2, 1, 'b33655b2e1d7e5a5ff69d19866bdc260c712334b1c2c022da8575c2a0b8c29c7c9f50302f7e39b78573471c7a1bb9419', 'e12d0f2ca5ceb07b494d5b55003e989ccddf564a73fab9c2deef26523f90b3f7e50a8412117241f1c07079d93a1c25ecd20e563c22c9993d91d04e92fa2230d0bc778b992571b0e9b5f005f0dc75102e', 30),
(28, 6, 3, 1, 'b33655b2e1d7e5a5ff69d19866bdc260c712334b1c2c022da8575c2a0b8c29c78f0c1272acdbc8b78f69f05044fb0032', '27793325a8a2190224d4b69f7095cc3d', 30),
(29, 6, 4, 0, 'b33655b2e1d7e5a5ff69d19866bdc260c712334b1c2c022da8575c2a0b8c29c7f8b43fb298ba4894d535e2bc7a15eff3', '1115a549fac3ca63c99bad5f45a43b46', 30),
(30, 6, 5, 0, 'b33655b2e1d7e5a5ff69d19866bdc260c712334b1c2c022da8575c2a0b8c29c7cae7b3f08b899986543507c92ddc9677', '6e901ce5e45055e4399fbbaf450224cb', 30),
(31, 7, 1, 0, 'b33655b2e1d7e5a5ff69d19866bdc260c712334b1c2c022da8575c2a0b8c29c791dcaf2aab5b7cb2e85cce58be2d2d6a', '6e901ce5e45055e4399fbbaf450224cb', 30),
(32, 7, 2, 1, 'b33655b2e1d7e5a5ff69d19866bdc260c712334b1c2c022da8575c2a0b8c29c7c9f50302f7e39b78573471c7a1bb9419', 'e12d0f2ca5ceb07b494d5b55003e989ccddf564a73fab9c2deef26523f90b3f7e50a8412117241f1c07079d93a1c25ecd20e563c22c9993d91d04e92fa2230d0bc778b992571b0e9b5f005f0dc75102e', 30),
(33, 7, 3, 1, 'b33655b2e1d7e5a5ff69d19866bdc260c712334b1c2c022da8575c2a0b8c29c78f0c1272acdbc8b78f69f05044fb0032', '27793325a8a2190224d4b69f7095cc3d', 30),
(34, 7, 4, 0, 'b33655b2e1d7e5a5ff69d19866bdc260c712334b1c2c022da8575c2a0b8c29c7f8b43fb298ba4894d535e2bc7a15eff3', '1115a549fac3ca63c99bad5f45a43b46', 30),
(35, 7, 5, 0, 'b33655b2e1d7e5a5ff69d19866bdc260c712334b1c2c022da8575c2a0b8c29c7cae7b3f08b899986543507c92ddc9677', '6e901ce5e45055e4399fbbaf450224cb', 30),
(36, 8, 1, 0, 'b33655b2e1d7e5a5ff69d19866bdc260c712334b1c2c022da8575c2a0b8c29c791dcaf2aab5b7cb2e85cce58be2d2d6a', '6e901ce5e45055e4399fbbaf450224cb', 30),
(37, 8, 2, 1, 'b33655b2e1d7e5a5ff69d19866bdc260c712334b1c2c022da8575c2a0b8c29c7c9f50302f7e39b78573471c7a1bb9419', 'e12d0f2ca5ceb07b494d5b55003e989ccddf564a73fab9c2deef26523f90b3f7e50a8412117241f1c07079d93a1c25ecd20e563c22c9993d91d04e92fa2230d0bc778b992571b0e9b5f005f0dc75102e', 30),
(38, 8, 3, 1, 'b33655b2e1d7e5a5ff69d19866bdc260c712334b1c2c022da8575c2a0b8c29c78f0c1272acdbc8b78f69f05044fb0032', '27793325a8a2190224d4b69f7095cc3d', 30),
(39, 8, 4, 0, 'b33655b2e1d7e5a5ff69d19866bdc260c712334b1c2c022da8575c2a0b8c29c7f8b43fb298ba4894d535e2bc7a15eff3', '1115a549fac3ca63c99bad5f45a43b46', 30),
(40, 8, 5, 0, 'b33655b2e1d7e5a5ff69d19866bdc260c712334b1c2c022da8575c2a0b8c29c7cae7b3f08b899986543507c92ddc9677', '6e901ce5e45055e4399fbbaf450224cb', 30),
(41, 9, 1, 0, 'b33655b2e1d7e5a5ff69d19866bdc260c712334b1c2c022da8575c2a0b8c29c791dcaf2aab5b7cb2e85cce58be2d2d6a', '6e901ce5e45055e4399fbbaf450224cb', 30),
(42, 9, 2, 1, 'b33655b2e1d7e5a5ff69d19866bdc260c712334b1c2c022da8575c2a0b8c29c7c9f50302f7e39b78573471c7a1bb9419', 'e12d0f2ca5ceb07b494d5b55003e989ccddf564a73fab9c2deef26523f90b3f7e50a8412117241f1c07079d93a1c25ecd20e563c22c9993d91d04e92fa2230d0bc778b992571b0e9b5f005f0dc75102e', 30),
(43, 9, 3, 1, 'b33655b2e1d7e5a5ff69d19866bdc260c712334b1c2c022da8575c2a0b8c29c78f0c1272acdbc8b78f69f05044fb0032', '27793325a8a2190224d4b69f7095cc3d', 30),
(44, 9, 4, 0, 'b33655b2e1d7e5a5ff69d19866bdc260c712334b1c2c022da8575c2a0b8c29c7f8b43fb298ba4894d535e2bc7a15eff3', '1115a549fac3ca63c99bad5f45a43b46', 30),
(45, 9, 5, 0, 'b33655b2e1d7e5a5ff69d19866bdc260c712334b1c2c022da8575c2a0b8c29c7cae7b3f08b899986543507c92ddc9677', '6e901ce5e45055e4399fbbaf450224cb', 30),
(46, 10, 1, 0, 'b33655b2e1d7e5a5ff69d19866bdc260c712334b1c2c022da8575c2a0b8c29c791dcaf2aab5b7cb2e85cce58be2d2d6a', '6e901ce5e45055e4399fbbaf450224cb', 30),
(47, 10, 2, 1, 'b33655b2e1d7e5a5ff69d19866bdc260c712334b1c2c022da8575c2a0b8c29c7c9f50302f7e39b78573471c7a1bb9419', 'e12d0f2ca5ceb07b494d5b55003e989ccddf564a73fab9c2deef26523f90b3f7e50a8412117241f1c07079d93a1c25ecd20e563c22c9993d91d04e92fa2230d0bc778b992571b0e9b5f005f0dc75102e', 30),
(48, 10, 3, 1, 'b33655b2e1d7e5a5ff69d19866bdc260c712334b1c2c022da8575c2a0b8c29c78f0c1272acdbc8b78f69f05044fb0032', '27793325a8a2190224d4b69f7095cc3d', 30),
(49, 10, 4, 0, 'b33655b2e1d7e5a5ff69d19866bdc260c712334b1c2c022da8575c2a0b8c29c7f8b43fb298ba4894d535e2bc7a15eff3', '1115a549fac3ca63c99bad5f45a43b46', 30);

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
(4, 6, '2dcea3442fb3f9f29921a7cc8cb66ffa0670fc7cde5cb853c5f8258fac0bc1fc99c664b9861d7b2bb00fbf2371ba6ae7', 1),
(5, 9, '2dcea3442fb3f9f29921a7cc8cb66ffa0670fc7cde5cb853c5f8258fac0bc1fc99c664b9861d7b2bb00fbf2371ba6ae7', 4),
(6, 10, '2dcea3442fb3f9f29921a7cc8cb66ffa0670fc7cde5cb853c5f8258fac0bc1fc99c664b9861d7b2bb00fbf2371ba6ae7', 5),
(7, 11, '2dcea3442fb3f9f29921a7cc8cb66ffa0670fc7cde5cb853c5f8258fac0bc1fc99c664b9861d7b2bb00fbf2371ba6ae7', 1),
(8, 14, '2dcea3442fb3f9f29921a7cc8cb66ffa0670fc7cde5cb853c5f8258fac0bc1fc99c664b9861d7b2bb00fbf2371ba6ae7', 4),
(9, 15, '2dcea3442fb3f9f29921a7cc8cb66ffa0670fc7cde5cb853c5f8258fac0bc1fc99c664b9861d7b2bb00fbf2371ba6ae7', 5),
(10, 16, '2dcea3442fb3f9f29921a7cc8cb66ffa0670fc7cde5cb853c5f8258fac0bc1fc99c664b9861d7b2bb00fbf2371ba6ae7', 1),
(11, 19, '2dcea3442fb3f9f29921a7cc8cb66ffa0670fc7cde5cb853c5f8258fac0bc1fc99c664b9861d7b2bb00fbf2371ba6ae7', 4),
(12, 20, '2dcea3442fb3f9f29921a7cc8cb66ffa0670fc7cde5cb853c5f8258fac0bc1fc99c664b9861d7b2bb00fbf2371ba6ae7', 5),
(13, 21, '2dcea3442fb3f9f29921a7cc8cb66ffa0670fc7cde5cb853c5f8258fac0bc1fc99c664b9861d7b2bb00fbf2371ba6ae7', 1),
(15, 25, '2dcea3442fb3f9f29921a7cc8cb66ffa0670fc7cde5cb853c5f8258fac0bc1fc99c664b9861d7b2bb00fbf2371ba6ae7', 5),
(16, 26, '2dcea3442fb3f9f29921a7cc8cb66ffa0670fc7cde5cb853c5f8258fac0bc1fc99c664b9861d7b2bb00fbf2371ba6ae7', 1),
(17, 29, '2dcea3442fb3f9f29921a7cc8cb66ffa0670fc7cde5cb853c5f8258fac0bc1fc99c664b9861d7b2bb00fbf2371ba6ae7', 4),
(18, 30, '2dcea3442fb3f9f29921a7cc8cb66ffa0670fc7cde5cb853c5f8258fac0bc1fc99c664b9861d7b2bb00fbf2371ba6ae7', 5),
(19, 31, '2dcea3442fb3f9f29921a7cc8cb66ffa0670fc7cde5cb853c5f8258fac0bc1fc99c664b9861d7b2bb00fbf2371ba6ae7', 1),
(20, 34, '2dcea3442fb3f9f29921a7cc8cb66ffa0670fc7cde5cb853c5f8258fac0bc1fc99c664b9861d7b2bb00fbf2371ba6ae7', 4),
(21, 35, '2dcea3442fb3f9f29921a7cc8cb66ffa0670fc7cde5cb853c5f8258fac0bc1fc99c664b9861d7b2bb00fbf2371ba6ae7', 5),
(22, 36, '2dcea3442fb3f9f29921a7cc8cb66ffa0670fc7cde5cb853c5f8258fac0bc1fc99c664b9861d7b2bb00fbf2371ba6ae7', 1),
(23, 39, '2dcea3442fb3f9f29921a7cc8cb66ffa0670fc7cde5cb853c5f8258fac0bc1fc99c664b9861d7b2bb00fbf2371ba6ae7', 4),
(24, 40, '2dcea3442fb3f9f29921a7cc8cb66ffa0670fc7cde5cb853c5f8258fac0bc1fc99c664b9861d7b2bb00fbf2371ba6ae7', 5),
(25, 41, '2dcea3442fb3f9f29921a7cc8cb66ffa0670fc7cde5cb853c5f8258fac0bc1fc99c664b9861d7b2bb00fbf2371ba6ae7', 1),
(26, 44, '2dcea3442fb3f9f29921a7cc8cb66ffa0670fc7cde5cb853c5f8258fac0bc1fc99c664b9861d7b2bb00fbf2371ba6ae7', 4),
(27, 45, '2dcea3442fb3f9f29921a7cc8cb66ffa0670fc7cde5cb853c5f8258fac0bc1fc99c664b9861d7b2bb00fbf2371ba6ae7', 5),
(28, 46, '2dcea3442fb3f9f29921a7cc8cb66ffa0670fc7cde5cb853c5f8258fac0bc1fc99c664b9861d7b2bb00fbf2371ba6ae7', 1),
(29, 49, '2dcea3442fb3f9f29921a7cc8cb66ffa0670fc7cde5cb853c5f8258fac0bc1fc99c664b9861d7b2bb00fbf2371ba6ae7', 4);

-- --------------------------------------------------------

--
-- Table structure for table `student_details`
--

CREATE TABLE `student_details` (
  `student_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `date_of_birth` date NOT NULL,
  `school` text NOT NULL,
  `student_category` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `student_details`
--

INSERT INTO `student_details` (`student_id`, `user_id`, `date_of_birth`, `school`, `student_category`) VALUES
(1, 1, '1998-05-08', '9b10c3ceb898d822803338d5a7b2b569', '1a5d81749867e764beab15f1ed49303d'),
(2, 2, '2017-06-30', '9b10c3ceb898d822803338d5a7b2b569', ''),
(3, 3, '2017-06-30', '9b10c3ceb898d822803338d5a7b2b569', ''),
(4, 5, '2017-06-30', '9b10c3ceb898d822803338d5a7b2b569', ''),
(5, 8, '2017-06-30', 'Unencrypted NYP', ''),
(7, 10, '2017-07-13', 'a9f6b177338fb1d9dec06f380948037e', ''),
(8, 11, '2017-07-06', 'a9f6b177338fb1d9dec06f380948037e', ''),
(9, 12, '2017-06-29', 'a9f6b177338fb1d9dec06f380948037e', '');

-- --------------------------------------------------------

--
-- Table structure for table `teacher_details`
--

CREATE TABLE `teacher_details` (
  `teacher_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `organisation` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `teacher_details`
--

INSERT INTO `teacher_details` (`teacher_id`, `user_id`, `organisation`) VALUES
(1, 4, '3fe1d9da31529b765b380c5f5a708958'),
(3, 7, 'Unencrypted Organisation'),
(4, 13, '9b10c3ceb898d822803338d5a7b2b569');

-- --------------------------------------------------------

--
-- Table structure for table `user_account`
--

CREATE TABLE `user_account` (
  `user_id` int(11) NOT NULL,
  `name` text NOT NULL,
  `username` text NOT NULL,
  `email` text NOT NULL,
  `about_me` text NOT NULL,
  `password_hash` text NOT NULL,
  `salt` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user_account`
--

INSERT INTO `user_account` (`user_id`, `name`, `username`, `email`, `about_me`, `password_hash`, `salt`) VALUES
(1, 'aa182b3c9847fd7b6c61a9591a92757d0576a0e01008eb21128550d2cbe63c0cc32f5fdd5b0eb89dd1e9b908232a1bed', 'nigelhao', '0c5f3fbb26322c11cde4b3c895c304dc38933c2bb514cdc751177567bf417d2f585c4593c8c6f90c0d2f621a44b2cbc3', '5d354f426860f22d22e58d35e87c647032d0fdf44c8118c484c817ff682999654113bce51938570995dec0b2a954c1301ccdd5231e2c42b3b028435b362d0fbcc9aab01cb065346863647b756f0f173f96928b246178a328f037dc33f47364e07bbed9c18d7ccae29160f09e9bfebbcb5ba42238545fcf64ea74112038ef2e9184708c7ab281d1126d2d4999464b74103b5595a317f5f828a69ff4d502c2486fcbfdafa901ace0aea6efad95c23a83e0', '08d1894a1543245280effc8a9e1be9345c9fe89c973c679e5f7ec1ecdd1070207ff40c15c9fa012691a55ee0b4b1f982c09fd1f8a832841518ffadba80ee6a6b71c2331ee2beb3d99d621ee53d239eb7', '23233e851c79783e8a3a829fc95737d68de051e01af5e8e9ccb8f4de79835eba68ea0a272850ed1bf546666e0c073f18ef86056c23e2e711653c37cba45a1484340c4fa1454456f23f0e2cb82790bb2f'),
(2, 'b09a3caa4fd40530a4b11e03f4bfc44a', 'jinkuan', '9348762009d880f3703e5f74dbd3424fdfa550ec5482dc5363d4f7c5197e8e0387434137de627def105d8215e8b49372', 'd8e46f9dda0e39724bc87907f937452cab38cc9c0f7e42f8f2cb1213baf9cb0345c5aca2b67be66daa3d788e6018cb8e', 'c237af20702a5a56c63a40292d76b2f8ac11292c6f2c783eb7bcf4b3b2e134bd9c3fd95274c43d2c2145e7e125e439b87c79a58e15d29da4ab162c71f655bf35e2647394e2be3426583709db03058433', 'd9e976b2e93979acae600f0ff2b33bc2b5edac8a230c0561bdc4cf19c8fdae990ef6584c884d0bbb102784a57cdef3604c70dda5517d1ede04671e54ae42244472d4be160a95786082e5f4ed58c35b1e'),
(3, 'a06637a02a28229fa47a9b81d9c53c90', 'chloeang', 'a4a3d0886d4ef4100c9347ee92e2bd1098db94a4d36b80aa0361afbfe7a0e05fa512c52d39a113621288b90db037cc09', 'd8e46f9dda0e39724bc87907f937452cab38cc9c0f7e42f8f2cb1213baf9cb0345c5aca2b67be66daa3d788e6018cb8e', 'd3b122972e88f24e84826bf5d7c1a9155a3118f00082f5ca62fbdf4058161c33526b1a950f19686cfee0843f0c40fd62adb45e393c92cbf8a882403187be31ea6694c27746428e547fcd1f43c71d6b06', '440bce1f7bf83f386024046341ef8f898356b914675c722955bc8a3b5f67e033b826cf01a006565b6d9afc2de95f0ec5a714073dd9dbaf82d0cc39b7725a9b718f04f61182091669eee91329e058bd0a'),
(4, 'a8fb266685a3f256859391c0c92d69ae', 'bryantan', 'e14353172dbf5f6ab93d69ed8b767fa3de1e904b375390b00e6f3d6c68c51ee8ae6d110ab5885df5b977398d873007c4', 'd8e46f9dda0e39724bc87907f937452cab38cc9c0f7e42f8f2cb1213baf9cb0345c5aca2b67be66daa3d788e6018cb8e', 'b3708e3469503cedfe02cfa5ca81f6679f3c7c9060f7fade3223fb693f708a0e638f805cf9cf7ce4af6124f2bfd52ebb8972942244ac901bd40497437f6c37c594d10b2bb7d7a146dafaf4fc79dea34d', 'bc4c95d31561b4c20faedbbc59659f72e3fe945291de5f0bdb9d3eb34e44678c81a5b0eb37b4d2c538e5c09b6156567aa78bd73c204bbde4db97246a54b94b9a4bd717c5e3453659c499326658db919b'),
(5, '796275eb407cf924ac8ea05c41278cb1', 'qingning', '6a25cd8829de2338e267f048835e024cbd944214c69e3a5c9dceba9d07271761f0c698a769afca1f9f4cb3394a047aa6', 'd8e46f9dda0e39724bc87907f937452cab38cc9c0f7e42f8f2cb1213baf9cb0345c5aca2b67be66daa3d788e6018cb8e', 'b9e2783621c316bbaac172d97a3024b1c2b3cfa9867e2bc5854d52071e66379a698f906f0adb67a3168b21676d34a5a964eddfd96cc1f10d3aff54871de0767a6974be0bb3053179fc3dee213c2c8a42', '3800e5ace02c3c469cbce314cbde4f7791dcdf9c7b1e5e7ef0b5cb2c7ead259ebecd95690d68902d5a9af004bf1b5f9a8cff77729599cefd222b53ef14b104b7bce7a23fd24498a03c9e6c096c8e5186'),
(7, 'Unencrypted Name', 'Unencrypted Teach Name', 'unencryptedteachname@gmail.com', 'd8e46f9dda0e39724bc87907f937452cab38cc9c0f7e42f8f2cb1213baf9cb0345c5aca2b67be66daa3d788e6018cb8e', 'exo8XOHnDV2gvPD2wLvSvrYAVDV++F6wxpfnuA7Y4+A=', 'Yaog6ZhUnEYMDJI8QcQV9TpUoyLOQ/TiDOhP/pRGLZw='),
(8, 'new name', 'nigelhao22', 'unencryptedstuname@gmail.com', 'HELLO', 'Dy4gFRDQJYQexIo5uuG/NzaVbEls+Q849qB5dRXPaeM=', 'Q8VbdgIpg0oERhhFjWpzgwoHwYFCX0wgdhkX3YzpA0g='),
(10, '77d3ab94ee790f4941be36f0872d927d9efb3e8da48f69f22f15753b5de4951933c6f5a2e6cf9d3e99cce17b5f7949ac', 'doing presentation', '571272e80d9dbb09fc77fef118ea801ec0595d0a10df56dfcb3a257d5f56aa6828b6b8e3577e5c73144d2750397293c0', '5d354f426860f22d22e58d35e87c647032d0fdf44c8118c484c817ff682999654113bce51938570995dec0b2a954c1301ccdd5231e2c42b3b028435b362d0fbcc9aab01cb065346863647b756f0f173f96928b246178a328f037dc33f47364e07bbed9c18d7ccae29160f09e9bfebbcb5ba42238545fcf64ea74112038ef2e9184708c7ab281d1126d2d4999464b74103b5595a317f5f828a69ff4d502c2486fcbfdafa901ace0aea6efad95c23a83e0', '2dec332584436293d09b7600993cb168486dac0c44bc150a61686a807701dc6efec15ffee13734296cf4fec2a907b1b58a09d335769e9a0727ef32c97fc0ca6d10ec4bf0271fdd30dfd976e82226ef9f', '91a7e66bdb7fe1ad66619a8efd7ac35525ecf51c8673b333a3306d76c44135cf4c698e1b6738d5449aa9ad72ea02692be934050b3cdf8d00e31d73f428161de3b2c895cda83c0a7e88a2f63f68cc0332'),
(11, '1743bba70a51c7bb52ac7dec677c8af6', 'nigelhao22324432342534', '0c5f3fbb26322c11cde4b3c895c304dc38933c2bb514cdc751177567bf417d2f0aeed2a1b94ebe3e267e7f7b1fb59f40', '', '9148d9e73e4aea79d2b54e09b7d60ade611cbc748ebe881a07fd72e7dd2f4bc937bc0326589dbe53a7d5841f929a63c38a9117c1f51134311b8a0a7c46885ae8a80ed14c47cc495d834bd40e856483f5', 'ff2b7bed8428f1dced93796ac131d385132e6a4ba820d9d3fc2d9e40f444e850db51db06b0a35ce39fbcd422dd1e2dbf884500e21d81e2e8033a693f570f87149981deb5c8416e42f2481de1f2fb6708'),
(12, '1989512acce3fbeeb5155cc054766e5f', '321312', 'dd7f2f0353303dc7d730b4425feb72df7b4c28a1f9609d24dbf9eaae51c4e86a55d616894e5694b7d448fdb8431679d1', '', 'f260757a81638acdd2f60e56bebfdffb77a56e44c75bfa1b53577e831c39f0d763c12dfb722baf1001efaa05c642c6554b50a88a0a372deb382cbfbb54984feb4648839d677cafae39895a4e520f7651', '85f160a0452ab823aa223bf742d77269ae973314fb59f8b3d0107f0467636ffe41e70a0e56e073b56e5d5fb442866f259502e5bb8c58997111418feebfa7eff96b265530c329ce6bd27d6a5fd735cb93'),
(13, '1fe4feadb2e85b06834062ed4fd4061d', 'dasd@dasdsa.com', 'e37cbf7ff5219a57f81e186dfb663539', '', '02b1036ae2dd616e3b4fb6ac13b60e726579b0efd60fee76bfd3ad507a9f0076e200d7f048e2c6d18fc634f4f2fd7ea6f2e692204da3e8b6c56bbaf21a0a9904861035452457a51ade4e1e7ff68da4e9', '56ee32e156b5f495583f76feebe25a7de5ea9ac329d1d29fbe3ac4cccacd331e682df8e5158da6203f26008e0f62796263c5790c04b1dcef798ae90a2323954b239dbf22b82e2b53d4f8d7321cb63b7e');

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
  ADD KEY `quiz_question_choices_ibfk_1` (`question_id`);

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
  MODIFY `quiz_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
--
-- AUTO_INCREMENT for table `quiz_question`
--
ALTER TABLE `quiz_question`
  MODIFY `question_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;
--
-- AUTO_INCREMENT for table `quiz_question_choices`
--
ALTER TABLE `quiz_question_choices`
  MODIFY `choice_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;
--
-- AUTO_INCREMENT for table `student_details`
--
ALTER TABLE `student_details`
  MODIFY `student_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
--
-- AUTO_INCREMENT for table `teacher_details`
--
ALTER TABLE `teacher_details`
  MODIFY `teacher_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `user_account`
--
ALTER TABLE `user_account`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
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
-- Constraints for table `quiz`
--
ALTER TABLE `quiz`
  ADD CONSTRAINT `quiz_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user_account` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `quiz_question`
--
ALTER TABLE `quiz_question`
  ADD CONSTRAINT `quiz_question_ibfk_1` FOREIGN KEY (`quiz_id`) REFERENCES `quiz` (`quiz_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `quiz_question_choices`
--
ALTER TABLE `quiz_question_choices`
  ADD CONSTRAINT `quiz_question_choices_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `quiz_question` (`question_id`) ON DELETE CASCADE ON UPDATE CASCADE;

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
