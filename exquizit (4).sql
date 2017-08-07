-- phpMyAdmin SQL Dump
-- version 4.7.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 07, 2017 at 11:58 AM
-- Server version: 10.1.22-MariaDB
-- PHP Version: 7.1.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
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
-- Table structure for table `banned_ip`
--

CREATE TABLE `banned_ip` (
  `ip_id` int(11) NOT NULL,
  `ip_address` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `completed_quiz`
--

CREATE TABLE `completed_quiz` (
  `user_id` int(11) NOT NULL,
  `complete_id` int(11) NOT NULL,
  `no_of_quiz` int(11) NOT NULL,
  `score` int(11) NOT NULL,
  `correctAnswers` int(11) NOT NULL DEFAULT '0',
  `wrongAnswers` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `completed_quiz`
--

INSERT INTO `completed_quiz` (`user_id`, `complete_id`, `no_of_quiz`, `score`, `correctAnswers`, `wrongAnswers`) VALUES
(78, 7, 6, 6, 8, 6),
(79, 8, 4, 3, 4, 3);

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

--
-- Dumping data for table `log_quiz`
--

INSERT INTO `log_quiz` (`log_quiz_id`, `user_id`, `quiz_id`, `score`, `feedback`, `date`) VALUES
(3, 15, 13, 100, 'It is a good game', '2017-08-03');

-- --------------------------------------------------------

--
-- Table structure for table `new_device`
--

CREATE TABLE `new_device` (
  `new_device_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `ip_address` text NOT NULL,
  `temp_token` text
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `new_device`
--

INSERT INTO `new_device` (`new_device_id`, `user_id`, `ip_address`, `temp_token`) VALUES
(93, 15, '7/jnylBmJ/4V3aXg5RL8qtcLbVIPN8x2WX/bTy2DoaM=', NULL),
(94, 15, '7/jnylBmJ/4V3aXg5RL8qtcLbVIPN8x2WX/bTy2DoaM=', NULL),
(95, 15, 'PkjvnSLgltpoOFQPuEaZmJBGLIoycwpPel6u5pRTFfc=', NULL),
(96, 15, '7/jnylBmJ/4V3aXg5RL8qtcLbVIPN8x2WX/bTy2DoaM=', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `quiz`
--

CREATE TABLE `quiz` (
  `quiz_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `quiz_title` text NOT NULL,
  `visibility` tinyint(1) NOT NULL,
  `description` text NOT NULL,
  `reward` int(11) NOT NULL,
  `quiz_rating` int(11) NOT NULL,
  `date_created` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=COMPACT;

--
-- Dumping data for table `quiz`
--

INSERT INTO `quiz` (`quiz_id`, `user_id`, `quiz_title`, `visibility`, `description`, `reward`, `quiz_rating`, `date_created`) VALUES
(1, 15, '123', 1, '123', 123, 0, '2017-08-06'),
(2, 15, '123', 1, '123', 123, 0, '2017-08-06'),
(3, 15, '123', 1, '123', 123123, 0, '2017-08-06'),
(4, 15, '123', 1, '123', 123, 0, '2017-08-06'),
(5, 15, '123', 1, '123', 123, 0, '2017-08-06'),
(6, 15, '123', 1, '123', 123, 0, '2017-08-06'),
(7, 15, 'hi', 1, '123', 123, 0, '2017-08-06'),
(8, 15, '13', 1, '123', 123, 0, '2017-08-06'),
(9, 15, '123', 1, '123', 123, 0, '2017-08-06'),
(10, 15, '123', 1, '123', 123, 0, '2017-08-06');

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
  `reward` int(11) DEFAULT NULL,
  `penalty` int(11) DEFAULT NULL,
  `time` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `quiz_question`
--

INSERT INTO `quiz_question` (`question_id`, `quiz_id`, `question_no`, `type`, `prompt`, `solution`, `reward`, `penalty`, `time`) VALUES
(1, 1, 1, 0, 'a29e3db5473da77c4f1c62d6352cde4a', '1189776fbffe6945878e23b26b9dcaf0d17e641d8cf9e07d671d07d511ee63e056790a3e552040ae8b2d079a26e18c18', 123, 123, 10),
(2, 1, 2, 0, 'a29e3db5473da77c4f1c62d6352cde4a', '1189776fbffe6945878e23b26b9dcaf0d17e641d8cf9e07d671d07d511ee63e056790a3e552040ae8b2d079a26e18c18', 123, 123, 10),
(3, 2, 1, 0, 'a29e3db5473da77c4f1c62d6352cde4a', '6fb3edbc744fd3e72c44d7869c28fc85', 123, 123123, 10),
(4, 3, 1, 0, 'a29e3db5473da77c4f1c62d6352cde4a', 'f3cd47f3af4d695b96b87a4e37e8ff7e', 12312, 3123, 5),
(5, 3, 2, 0, 'a29e3db5473da77c4f1c62d6352cde4a', 'b39c96cbb767f1d14d06c9e729ea3819', 12321, 0, 5),
(6, 5, 1, 0, 'a29e3db5473da77c4f1c62d6352cde4a', '6fb3edbc744fd3e72c44d7869c28fc85', 123, 123, 5),
(7, 6, 1, 0, 'a29e3db5473da77c4f1c62d6352cde4a', '6fb3edbc744fd3e72c44d7869c28fc85', 123, 123, 10),
(8, 6, 2, 1, 'a29e3db5473da77c4f1c62d6352cde4a', 'a29e3db5473da77c4f1c62d6352cde4a', 123, 123, 10),
(9, 7, 1, 0, 'a29e3db5473da77c4f1c62d6352cde4a', '1089df69da3203461bf103d78faea93c', 123, 123, 10),
(10, 7, 2, 1, 'a29e3db5473da77c4f1c62d6352cde4a', 'd6956945642d3b72febd1c85c9a7cd548899e7f98a66e6e150233f76f1f6718b55cf9eeb3e3eb3797b53b6896b3d444d', 123123, 123, 10),
(11, 8, 1, 0, 'a29e3db5473da77c4f1c62d6352cde4a', 'b39c96cbb767f1d14d06c9e729ea3819', 123, 123, 30),
(12, 8, 2, 0, 'a29e3db5473da77c4f1c62d6352cde4a', 'f3cd47f3af4d695b96b87a4e37e8ff7e', 0, 0, 30),
(13, 8, 3, 1, 'a29e3db5473da77c4f1c62d6352cde4a', 'a29e3db5473da77c4f1c62d6352cde4a', 0, 0, 30),
(14, 8, 4, 1, 'a29e3db5473da77c4f1c62d6352cde4a', 'a29e3db5473da77c4f1c62d6352cde4a', 123123, 123, 30),
(15, 9, 1, 0, '1b823a2749bfd9e74902bdf46af38585', 'e7782aef5517de9232b0591940cd9c12', 0, 0, 30),
(16, 9, 2, 0, '1b823a2749bfd9e74902bdf46af38585', 'f3cd47f3af4d695b96b87a4e37e8ff7e', 0, 0, 30),
(17, 10, 1, 0, 'a29e3db5473da77c4f1c62d6352cde4a', 'f3cd47f3af4d695b96b87a4e37e8ff7e', 12312, 1123, 30);

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
(1, 1, 'ee36c74a0ca53a9e0615140f168910e297dbba1362ea8cbc1efb047555f250b5f5b38eb61c38432860bbad0411ab333b', 1),
(2, 2, 'edbf97e904c7edd29db93cc114536c5a05ca55d74ee296e02ef61168b71a57b4adb07b21a36d0f91084cebc5e30412b5', 2),
(3, 3, 'edbf97e904c7edd29db93cc114536c5a05ca55d74ee296e02ef61168b71a57b4adb07b21a36d0f91084cebc5e30412b5', 1),
(4, 4, 'a904959661611c50d3816ff8ee4db26648936cd57b41d53e72e1b5ad2808a5b237ce72dce21b871962bceabda2320246', 1),
(5, 5, 'edbf97e904c7edd29db93cc114536c5a05ca55d74ee296e02ef61168b71a57b4b7ceb6f12597db8a8d4c99e4d3300008', 2),
(6, 6, 'edbf97e904c7edd29db93cc114536c5a05ca55d74ee296e02ef61168b71a57b4adb07b21a36d0f91084cebc5e30412b5', 1),
(7, 7, 'edbf97e904c7edd29db93cc114536c5a05ca55d74ee296e02ef61168b71a57b4adb07b21a36d0f91084cebc5e30412b5', 1),
(8, 9, 'edbf97e904c7edd29db93cc114536c5a05ca55d74ee296e02ef61168b71a57b4adb07b21a36d0f91084cebc5e30412b5', 1),
(9, 11, 'edbf97e904c7edd29db93cc114536c5a05ca55d74ee296e02ef61168b71a57b4adb07b21a36d0f91084cebc5e30412b5', 1),
(10, 12, '3757587a2cdc269f2032b707281e8318', 2),
(11, 15, '52666c982296e7e17e6a66e4885471bced6cb1163ad205708631f5ad5e4957b83c49e2b9303bc4d211699e82997de913', 1),
(12, 16, '52666c982296e7e17e6a66e4885471bced6cb1163ad205708631f5ad5e4957b85bf4f0657b5128266e74f9a12d5b435c', 2),
(13, 17, 'edbf97e904c7edd29db93cc114536c5a05ca55d74ee296e02ef61168b71a57b455784f1465c72276d98d8bb6b4dd590c', 1);

-- --------------------------------------------------------

--
-- Table structure for table `spam_area`
--

CREATE TABLE `spam_area` (
  `spam_id` int(11) NOT NULL,
  `username` text NOT NULL,
  `spam_text` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `spam_area`
--

INSERT INTO `spam_area` (`spam_id`, `username`, `spam_text`) VALUES
(1, '0Architecto.', '0Eligendi.'),
(2, '1Odit illo.', '1Quas iure.'),
(3, '2Aspernatur.', '2Veniam.'),
(4, '3Provident.', '3Illo quis.'),
(5, '4Neque.', '4Beatae iure.'),
(6, '5Molestiae.', '5Tenetur.'),
(7, '6Magni nulla.', '6Delectus.'),
(8, '7Distinctio.', '7Soluta.'),
(9, '8Vitae natus.', '8Accusantium.'),
(10, '9Corrupti.', '9Molestiae.'),
(11, '10Nesciunt.', '10Odio veniam.'),
(12, '11Quis rem.', '11Quam.'),
(13, '12Laboriosam.', '12Unde.'),
(14, '13Debitis.', '13Nemo itaque.'),
(15, '14Accusantium.', '14Quaerat.'),
(16, '15Asperiores.', '15Quae minus.'),
(17, '16Beatae.', '16Animi porro.'),
(18, '17Veritatis.', '17Praesentium.'),
(19, '18In id at.', '18Eligendi.'),
(20, '19Architecto.', '19Impedit.'),
(21, '20Ex aliquid.', '20Quibusdam.'),
(22, '21Ipsum esse.', '21Veniam.'),
(23, '22Pariatur.', '22Corporis.'),
(24, '23Perferendis.', '23Iste.'),
(25, '24Dolorem.', '24Iusto error.'),
(26, '25Minima unde.', '25Quia.'),
(27, '26Enim.', '26Sint dicta.'),
(28, '27Delectus.', '27Repellendus.'),
(29, '28Quaerat aut.', '28Quia.'),
(30, '29Quaerat.', '29Voluptate.'),
(31, '30Tempora.', '30Mollitia.'),
(32, '31Quae culpa.', '31Saepe ex ab.'),
(33, '32Ipsa.', '32Molestias.'),
(34, '33Aspernatur.', '33Soluta.'),
(35, '34Pariatur.', '34Tempore.'),
(36, '35Earum.', '35At.'),
(37, '36Corrupti.', '36Vero.'),
(38, '37Temporibus.', '37Rerum non.'),
(39, '38Quibusdam.', '38Non quasi.'),
(40, '39Id.', '39Quo.'),
(41, '40Doloribus.', '40Rem illo.'),
(42, '41Quibusdam.', '41Quibusdam.'),
(43, '42Occaecati.', '42Fugiat.'),
(44, '43Ab.', '43Atque quae.'),
(45, '44Est eos.', '44Dolore.'),
(46, '45Quidem.', '45Corrupti.'),
(47, '46Repellat.', '46Quam.'),
(48, '47Itaque.', '47A deserunt.'),
(49, '48Corrupti.', '48Laborum.'),
(50, '49Cum natus.', '49Voluptate.'),
(51, '50Ipsa.', '50Ullam.'),
(52, '51Ducimus.', '51Adipisci.'),
(53, '52Temporibus.', '52Distinctio.'),
(54, '53Quae.', '53Omnis rem.'),
(55, '54Optio ut.', '54Eum eveniet.'),
(56, '55Saepe autem.', '55Sint ad.'),
(57, '56Debitis.', '56Commodi in.'),
(58, '57Sequi id.', '57Veniam.'),
(59, '58Eius ex non.', '58Veritatis.'),
(60, '59Commodi.', '59Quibusdam.'),
(61, '60Hic totam.', '60Quod.'),
(62, '61Quia.', '61Alias ex.'),
(63, '62Minima.', '62Dicta illo.'),
(64, '63Distinctio.', '63Debitis.'),
(65, '64Repellendus.', '64Nobis sit.'),
(66, '65Quod quod.', '65Tenetur.'),
(67, '66Natus est.', '66Quibusdam.'),
(68, '67Quas.', '67Veritatis.'),
(69, '68Facere.', '68Dolor porro.'),
(70, '69Facilis.', '69Nobis.'),
(71, '70Veritatis.', '70Beatae.'),
(72, '71Eius modi.', '71Facilis.'),
(73, '72Aliquid.', '72Vitae odit.'),
(74, '73Nostrum.', '73Similique.'),
(75, '74Vel.', '74Velit.'),
(76, '75Quidem.', '75Pariatur.'),
(77, '76Reiciendis.', '76Odit earum.'),
(78, '77Voluptatem.', '77Hic maxime.'),
(79, '78Tempora.', '78Animi nisi.'),
(80, '79Ipsa.', '79Autem fuga.'),
(81, '80Aspernatur.', '80Temporibus.'),
(82, '81Minus.', '81Molestiae.'),
(83, '82Aliquid.', '82Iste magnam.'),
(84, '83Libero.', '83Porro ex.'),
(85, '84Quod.', '84Pariatur.'),
(86, '85Aperiam.', '85Facilis.'),
(87, '86Excepturi.', '86Sequi a in.'),
(88, '87Optio nihil.', '87Quod.'),
(89, '88Alias.', '88Esse.'),
(90, '89Veritatis.', '89Aut rerum.'),
(91, '90Harum vitae.', '90Nesciunt.'),
(92, '91Ad aliquid.', '91Maxime.'),
(93, '92Sequi.', '92Sapiente.'),
(94, '93Quaerat.', '93Maxime.'),
(95, '94Porro quod.', '94Enim.'),
(96, '95Quam.', '95Libero.'),
(97, '96Iusto.', '96Libero.'),
(98, '97Voluptate.', '97Dolore.');

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
(65, 15, '1998-05-08', 'c12a066d7ed10595abea81f9311c7f8b', 'c12a066d7ed10595abea81f9311c7f8b'),
(76, 78, '1998-05-08', 'c12a066d7ed10595abea81f9311c7f8b', ''),
(77, 79, '1998-05-08', 'c12a066d7ed10595abea81f9311c7f8b', ''),
(78, 80, '1992-12-01', '8d892f5ebd06682cf61876bdedc38b97', '');

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
  `contact` text NOT NULL,
  `about_me` text NOT NULL,
  `password_hash` text NOT NULL,
  `salt` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user_account`
--

INSERT INTO `user_account` (`user_id`, `name`, `username`, `email`, `contact`, `about_me`, `password_hash`, `salt`) VALUES
(15, 'e30f3fd4f0d49f551880d77b20644275db9ce8cdc965a5d932aba311a67e5ba7c43e3a4cf14e9a1975aec0d73d35c1eb', 'nigelhao', '5893c8f04a4ae2087852ce2aef5dee46dbec241889cc94d553f28d898114978a94ef4683b8c11707205cdde87a406712', 'ec7f44783bf622056d1692637cf76c52', 'e30f3fd4f0d49f551880d77b20644275db9ce8cdc965a5d932aba311a67e5ba78dcfce444126272d7a15ecaa4ddd6f0c', 'a15f04c0a10888c4975fbce0a46f7dcb11b0119f02edf41666ad97994f480b31530202f07a8cbce32d8c395d7d73571acad672631b6a078f9b7d3edbece021931dd7ba3df4f75f825ebfcc4fb939755f', 'bf808fba0a496f3063e8c928de0acb8a53fccd46ce9b1c6fab7a76a03b070a7f9b00d06bac7c13bd76539584944b379aae04d9e2d2e630c5b96a1839cb8d12ebc2f5ea9dddc21cac7cf85b9d37f255c5'),
(78, 'e30f3fd4f0d49f551880d77b20644275db9ce8cdc965a5d932aba311a67e5ba72ff66625d6aa2c173b452d18ca424e8a', 'nigelhao2', '54355a5ac47bad9bca8ad0e5ee70e016e7928ca5db4cdf9a1bf914e3f132f69855fc276a611f123cb4461474d96d3b4f', 'ec7f44783bf622056d1692637cf76c52', '', 'af44d7f84dd0458d6d0455e8ffe5eea2d0ba031c9af23e0c1f2fe5e8eadf4cec2451495082f3067dcc7e0f08ffc68e313ee270bb45f789bd8520818c3c36541385f51c17b1a04cdcdbe148e983ab8738', '4da7674e692164b5c47e5bcb0bc09a841e673b1bb7395c26f14680a5ffd1f498bf2aada17f7c8f12cd3c66129b46b2570b70a1c3c94e18c84a8584c45411ec7278ad5ae5ba47526c43a0386ff92a6f42'),
(79, 'e30f3fd4f0d49f551880d77b20644275db9ce8cdc965a5d932aba311a67e5ba7621ea4bb72d1b317f093937fc0e6ca41', 'nigelhao3', 'e8edb2734beaa9f3f80b2c56d359cbd20f83fe8c1540091712f3d600a39da90a55fc276a611f123cb4461474d96d3b4f', 'ec7f44783bf622056d1692637cf76c52', '', '2bc54b148fd7b64080ebde18430406a10b056f3af24c0b316ac52fe8ed43d9597179dd63c8a7482f7fee50d01651344956d6ea8fe1e68326209b9efe23cc23f2ed32202da1668e9d9aba6fb211d74dd7', '887b3684af5a57643dc7e621cd745f6a8c7c77fb2b742b63121a53b580dcebdc6950b5a19f19ec5e6fac50659b077d094006f00f02ea3978c133cd20f7e790b0f721c495136baeb04fc68fb5f36f5bc3'),
(80, '323cad99422b97fc338c87c09c558128', 'chloe', 'f57b95fb3a9274f9cf99bd1ee89d4d0f2b752a0eb8859466cd7610586bca1d7c55fc276a611f123cb4461474d96d3b4f', '72c16b34ee2ee53bc4181318cf8b177f', '', '77eeaf21d9a3aeae812f385a1a7168e575aa6d79ec665d0c89ca0f9b4a2a20f9d62af4e2d5af2f442e8e71896e7c38aaa6e1f1d5120d8c3d940429af63743158f0475b162309fef4ddbee6ea4bc0c7ca', '344fd2ad48c9fbc0d82e862842a952aa97f112e90663d2ff3f2f67652511d2fc53f6d232d2ee2d7b879d1ede5696c41bb899de8dcbc52cf749bd534378d97913d4818499c8a5375c725226271c8f3cd5');

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
-- Indexes for table `banned_ip`
--
ALTER TABLE `banned_ip`
  ADD PRIMARY KEY (`ip_id`);

--
-- Indexes for table `completed_quiz`
--
ALTER TABLE `completed_quiz`
  ADD PRIMARY KEY (`complete_id`),
  ADD KEY `user_id` (`user_id`);

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
-- Indexes for table `new_device`
--
ALTER TABLE `new_device`
  ADD PRIMARY KEY (`new_device_id`),
  ADD KEY `user_id` (`user_id`);

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
-- Indexes for table `spam_area`
--
ALTER TABLE `spam_area`
  ADD PRIMARY KEY (`spam_id`);

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
-- AUTO_INCREMENT for table `banned_ip`
--
ALTER TABLE `banned_ip`
  MODIFY `ip_id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `completed_quiz`
--
ALTER TABLE `completed_quiz`
  MODIFY `complete_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
--
-- AUTO_INCREMENT for table `log_question`
--
ALTER TABLE `log_question`
  MODIFY `log_question_id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `log_quiz`
--
ALTER TABLE `log_quiz`
  MODIFY `log_quiz_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `new_device`
--
ALTER TABLE `new_device`
  MODIFY `new_device_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=98;
--
-- AUTO_INCREMENT for table `quiz`
--
ALTER TABLE `quiz`
  MODIFY `quiz_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
--
-- AUTO_INCREMENT for table `quiz_question`
--
ALTER TABLE `quiz_question`
  MODIFY `question_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;
--
-- AUTO_INCREMENT for table `quiz_question_choices`
--
ALTER TABLE `quiz_question_choices`
  MODIFY `choice_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
--
-- AUTO_INCREMENT for table `spam_area`
--
ALTER TABLE `spam_area`
  MODIFY `spam_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=99;
--
-- AUTO_INCREMENT for table `student_details`
--
ALTER TABLE `student_details`
  MODIFY `student_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=79;
--
-- AUTO_INCREMENT for table `teacher_details`
--
ALTER TABLE `teacher_details`
  MODIFY `teacher_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `user_account`
--
ALTER TABLE `user_account`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=81;
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
-- Constraints for table `completed_quiz`
--
ALTER TABLE `completed_quiz`
  ADD CONSTRAINT `completed_quiz_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user_account` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

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
-- Constraints for table `new_device`
--
ALTER TABLE `new_device`
  ADD CONSTRAINT `new_device_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user_account` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

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
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
