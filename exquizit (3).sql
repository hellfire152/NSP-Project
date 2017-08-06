-- phpMyAdmin SQL Dump
-- version 4.7.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 05, 2017 at 07:52 PM
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
(89, 15, '7/jnylBmJ/4V3aXg5RL8qtcLbVIPN8x2WX/bTy2DoaM=', 'rA8bMecAaNU1Coc3LY7QwEgG+0n8IWSv0f9zq312rI4=Quh0/2X0sWmoDcwKoU9cTcZGnj2PcDVg3FqTXc2EPQI='),
(90, 73, '7/jnylBmJ/4V3aXg5RL8qtcLbVIPN8x2WX/bTy2DoaM=', NULL),
(91, 15, 'PkjvnSLgltpoOFQPuEaZmJBGLIoycwpPel6u5pRTFfc=', NULL),
(92, 74, '7/jnylBmJ/4V3aXg5RL8qtcLbVIPN8x2WX/bTy2DoaM=', NULL);

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
(1, 15, 'Who am i?', 1, '123', 123, 0, '2017-07-17'),
(2, 15, '576', 0, '567', 567, 0, '2017-07-17'),
(3, 15, '79', 0, '8798', 789, 0, '2017-07-17'),
(4, 15, 'h', 0, 'kh', 213, 0, '2017-07-17'),
(5, 15, '78', 1, '789', 7, 0, '2017-07-17'),
(6, 15, '7', 1, '897', 9879, 0, '2017-07-17'),
(7, 15, 'h', 1, 'uhk', 789, 0, '2017-07-17'),
(8, 15, '123', 0, '123', 123, 0, '2017-07-17'),
(9, 15, '123', 0, '123', 123, 0, '2017-07-17'),
(10, 15, '123', 0, '123', 123, 0, '2017-07-17'),
(11, 15, '123', 0, '123123', 123123, 0, '2017-07-17'),
(12, 15, '123', 0, '213', 123, 0, '2017-07-17'),
(13, 15, 'QUIZ TITLE', 1, 'TESTING YAY', 100, 0, '2017-07-17'),
(14, 15, '312312', 0, 'jkl', 312312312, 0, '2017-07-17'),
(15, 15, '312312', 0, 'jkl', 312312312, 0, '2017-07-17'),
(17, 15, 'quizTest1', 1, 'quizTestdescription', 2, 5, '2017-08-10');

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
(1, 1, 1, 0, 'f39172464caf277d09c07ec748b45862', '1115a549fac3ca63c99bad5f45a43b46', 123, 123, 10),
(2, 1, 2, 1, '5de53b4d3cb289ade5f6bb31405341c4fba9695661e488d447afcf28ee6109b51ada86b5fa06bd921fab4b44479c485a', 'e58a3707f907731866d4619b33208538ab2e9a17cb2e2dd76827f2190b0be2ee9c755e96835d0f282d3d1ec9ce82b02a', 123, 123, 5),
(3, 2, 1, 0, '7da03a02eaaabcc6db50c7e7f53933ca', '1115a549fac3ca63c99bad5f45a43b46', 809, 809, 5),
(4, 3, 1, 0, '2638a8f6aaf500a7bc91a07b37ca27c5', '071dcc75df9773498dbd38ef6446f0b3', 78, 99789, 5),
(5, 4, 1, 0, '0b92e50ee2e0599f7acd5891a25b37c8', '071dcc75df9773498dbd38ef6446f0b3', 879, 798, 5),
(6, 5, 1, 0, '3757c117cdc4f9f31ddc7bc34d71ccc6', '071dcc75df9773498dbd38ef6446f0b3', 9879, 789, 5),
(7, 5, 2, 0, 'f9b207dadbd706f2f6dfff852ae212f3', '', 79, 8798, 5),
(8, 6, 1, 0, 'cb1bee95eff1b2df8a864c396b873bc5', '071dcc75df9773498dbd38ef6446f0b3', 79, 798, 5),
(9, 7, 1, 0, '3c48fe03962019e2a709078989e2c3ac', '071dcc75df9773498dbd38ef6446f0b3', 89789, 79, 5),
(10, 7, 2, 0, '69e59dbdb26af1662d387a33e64c91f0', '', 798, 798789, 5),
(11, 8, 1, 0, '0e3d9577bcdb7fc0b8e376e3b7ba9005', '071dcc75df9773498dbd38ef6446f0b3', 213, 132, 5),
(12, 9, 1, 0, '0e3d9577bcdb7fc0b8e376e3b7ba9005', '071dcc75df9773498dbd38ef6446f0b3', 12312, 312312, 5),
(13, 10, 1, 0, '0e3d9577bcdb7fc0b8e376e3b7ba9005', '0fc07294dc362f73e72b3d97bc676451', 12312, 3123123, 5),
(14, 11, 1, 0, '77f03e5abd0b39b7c0c0183e1209321a', '071dcc75df9773498dbd38ef6446f0b3', 12312, 1312, 10),
(15, 12, 1, 0, '0e3d9577bcdb7fc0b8e376e3b7ba9005', '071dcc75df9773498dbd38ef6446f0b3', 345, 34, 5),
(16, 13, 1, 0, '86dac03cc767659a9b46372aebfe2ce1', '6e901ce5e45055e4399fbbaf450224cb', 100, 40, 5),
(17, 13, 2, 1, 'd4f9a4f9d482b1614f401e19145f44e7fc0e04ceffc21df3643db59c9b73071d3d804eee2aa647b60bfa69201ca93818', '9b10c3ceb898d822803338d5a7b2b569', 1000, NULL, 5),
(18, 13, 3, 0, '2983cadc7b281aba93e48b0c8b48d66424d25635c36c78b72e9946bbbb2698d9382a9e1b4b471698afa5b911d97e2b71', '1115a549fac3ca63c99bad5f45a43b46', NULL, NULL, 5),
(19, 13, 4, 1, '610e242becb0b4f2a2c1a5e2eba4c90e45035d9c616cd0809644b4d603682f76fd2044cca35bf4a0a44bb7577d867fb8', '2f253f8235980550fa185b1f442e8d6c', 1000000, NULL, 5),
(20, 13, 5, 0, '275aac0017e16c9e66ef1e5459beee2190f8418dcf5cddbeb806964c058c1e1e9cd49fe21c20a07f91f45ab45c166879', '1115a549fac3ca63c99bad5f45a43b46', NULL, 50000, 5),
(21, 14, 1, 0, '86bb67e147d2ded2875ea66a183999f5', '071dcc75df9773498dbd38ef6446f0b3', 3123, 123123, 5),
(22, 14, 2, 0, '0e3d9577bcdb7fc0b8e376e3b7ba9005', '6e901ce5e45055e4399fbbaf450224cb', 312, 3123123, 5),
(23, 14, 3, 0, '0e3d9577bcdb7fc0b8e376e3b7ba9005', '6e901ce5e45055e4399fbbaf450224cb', 3123, 123, 5),
(24, 14, 4, 1, '0e3d9577bcdb7fc0b8e376e3b7ba9005', '77f03e5abd0b39b7c0c0183e1209321a', 312312, 312312, 5),
(25, 14, 5, 1, '59f7446a7a9042e7445e6953832f27ec', '132043ad28e2e52701733e6e65989a94', 12, 312321, 5),
(26, 15, 1, 0, '89f03833e4d1baa2b26fd4aa180a98a2', '6e901ce5e45055e4399fbbaf450224cb', 121, 3123123, 10),
(27, 17, 1, 0, 'shdflhkj', '8', 12, 123, 123),
(28, 17, 123, 1, 'fqe hlkjl', 'adn,dsnf,sd', 1231, 1, 1);

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
(1, 15, '03e637affd5ec92e0059ab0f53ae495f630d8f750028f5bb132c006d631f476d9d9138e398626d81c62502932f67a8600eb8cd2b5fc8cafab7be16ebd9ae6684', 1),
(2, 16, '1a7039278c87c6f32ea126774a2ffa92f44517276c276a9bcb99aa76e98bbed49e92e0b1dd3dafe0535af9bbba27419e', 1),
(3, 18, 'ad29ce767d52fc3beb186bd843482a5a0af8ac9f99d325f3a4b54717ede2acf8fb979e64592ff88ac535206b85a5ca57', 3),
(4, 20, 'e115e29e9e6a2ff8f2bf3e25b174a91a588daea8ec60b008c82185b6fa366161043c338d47284b6250b5469157678435', 5),
(5, 21, '4159eb823f56496d2ba10dd3718b4668662f1294bfbb15c1b3d69f6434dc70930fb4ca15895fb499e3dac79cc481080f8911c1f75fc75ea3b9a882642ce2332482e02e4d06b16e2236456d0f0a3996c6', 1),
(6, 22, '0ce6ad0cf95da9f59443a93971a1eee0b9ab254f6562b45d4ae5e0f35c38423275c358757449693cb652e2ecaf3787269d9fecc583e3085ae6c5704bb13c1ebf01d3387a52ec26034501269dcbd95fc6', 2),
(7, 23, '4f30d46e79a3746bb24c39a4f3beb5abc844d98e747221b84aefc54f4da1cd3bfc068af929cc40b2c34547d361849a9ce69d3c1af1dcf14fe272eb9cf6fd0ef8216ef9b206c772734fb1e8ccf2da5470', 3),
(8, 26, '172939e42adc5458e1582dbc3f61e56e9dc0a01858cfc4e1c084a82f387727f9155ce791f3267b88541ad5806f0e9ba17c0c2577c1c130bfb38fb3479a0e4327693e3c3aa41c42d8448bac1ac6bc1a34', 1),
(9, 27, '[\'hello\', \'my\', \'name\', \'is nigel\']', 1);

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
(1, '0Nobis ea.', '0Ducimus.'),
(2, '1Fuga facere.', '1Aut iusto.'),
(3, '2Amet qui.', '2Magnam.'),
(4, '3Cumque.', '3Culpa.'),
(5, '4Distinctio.', '4Nihil.'),
(6, '5Aut.', '5Sequi sunt.'),
(7, '6Adipisci.', '6Eveniet vel.'),
(8, '7Voluptate.', '7Hic.'),
(9, '8Perferendis.', '8Tempore.'),
(10, '9Ipsam.', '9Culpa.'),
(11, '10Doloribus.', '10Nemo.'),
(12, '11Quo debitis.', '11Dignissimos.'),
(13, '12Ut.', '12Nisi.'),
(14, '13Illum.', '13Ducimus.'),
(15, '14Excepturi.', '14Harum.'),
(16, '15Atque.', '15Magni quia.'),
(17, '16Sint soluta.', '16Numquam ex.'),
(18, '17Animi.', '17Repellendus.'),
(19, '18Maiores quo.', '18Praesentium.'),
(20, '19Voluptatum.', '19Quia vitae.'),
(21, '20Ullam minus.', '20Neque nihil.'),
(22, '21Quam harum.', '21Harum nihil.'),
(23, '22Possimus.', '22Eum optio.'),
(24, '23Pariatur.', '23Cum.'),
(25, '24Corporis.', '24Suscipit.'),
(26, '25Voluptates.', '25Corporis.'),
(27, '26Qui.', '26Ut.'),
(28, '27Reiciendis.', '27Quaerat non.'),
(29, '28Molestiae.', '28Ea.'),
(30, '29Ex quasi.', '29Neque.'),
(31, '30Omnis.', '30Nihil optio.'),
(32, '31Ab quos.', '31Molestiae.'),
(33, '32Labore.', '32Corporis.'),
(34, '33Accusamus.', '33Rerum.'),
(35, '34Ratione.', '34Natus.'),
(36, '35Vero.', '35Voluptatem.'),
(37, '36Impedit.', '36Autem.'),
(38, '37Itaque.', '37Harum quia.'),
(39, '38Quidem.', '38Libero.'),
(40, '39Itaque quos.', '39Totam.'),
(41, '40In natus.', '40Labore quo.'),
(42, '41Aliquam.', '41Quam.'),
(43, '42Fuga ea.', '42Laudantium.'),
(44, '43Accusantium.', '43Quaerat.'),
(45, '44Saepe cum.', '44Voluptatum.'),
(46, '45Ullam.', '45Itaque quas.'),
(47, '46Possimus.', '46Iusto quas.'),
(48, '47Fugiat.', '47Rerum.'),
(49, '48Sequi.', '48Aliquam eos.'),
(50, '49Cumque.', '49Ab neque.'),
(51, '50Distinctio.', '50Reiciendis.'),
(52, '51Sit sequi.', '51Corrupti.'),
(53, '52Tenetur.', '52Voluptatem.'),
(54, '53Odio at.', '53Autem.'),
(55, '54Ullam rem.', '54Suscipit.'),
(56, '55Hic.', '55Possimus.'),
(57, '56Rem est.', '56Unde.'),
(58, '57Laboriosam.', '57Animi.'),
(59, '58Doloremque.', '58Rem odio.'),
(60, '59Officiis.', '59Quaerat.'),
(61, '60Blanditiis.', '60Voluptates.'),
(62, '61Sequi nam.', '61Totam.'),
(63, '62Iste amet.', '62Labore at.'),
(64, '63Quidem amet.', '63Alias.'),
(65, '64Velit.', '64Odit.'),
(66, '65Ducimus.', '65Architecto.'),
(67, '66Perferendis.', '66Veritatis.'),
(68, '67Quaerat.', '67Ipsum.'),
(69, '68Praesentium.', '68Excepturi.'),
(70, '69Occaecati.', '69Temporibus.'),
(71, '70Ipsam.', '70Illum ad.'),
(72, '71Reiciendis.', '71Sapiente.'),
(73, '72Illum nihil.', '72Dolore.'),
(74, '73Quia.', '73Possimus.'),
(75, '74Illum quo.', '74Nulla odio.'),
(76, '75Sunt.', '75Nam.'),
(77, '76Doloremque.', '76Accusantium.'),
(78, '77Saepe sed.', '77Laboriosam.'),
(79, '78Debitis.', '78Deleniti.'),
(80, '79Itaque.', '79Sunt error.'),
(81, '80Debitis.', '80Saepe eaque.'),
(82, '81Fuga.', '81Et alias.'),
(83, '82Ut dolorum.', '82Minus.'),
(84, '83Illum earum.', '83Corporis.'),
(85, '84Repellendus.', '84Temporibus.'),
(86, '85Quam.', '85Ipsa odit.'),
(87, '86Odit.', '86Eaque nulla.'),
(88, '87Aspernatur.', '87Provident.'),
(89, '88Debitis.', '88Rerum.'),
(90, '89Expedita.', '89Fugiat.'),
(91, '90Corporis ea.', '90Quod.'),
(92, '91Quia ipsa.', '91Quisquam.'),
(93, '92Quod quae.', '92Quis vitae.'),
(94, '93Molestias.', '93Alias.'),
(95, '94Sunt eum.', '94Iste magni.'),
(96, '95Itaque.', '95Quia.'),
(97, '96Dolorem quo.', '96Accusantium.'),
(98, '97Provident.', '97Aliquid.'),
(99, '98A minima.', '98Nisi odio.'),
(100, '99Asperiores.', '99Beatae.'),
(101, '100A sit.', '100Iste maxime.'),
(102, '101Vitae.', '101Fugit sit.'),
(103, '102Officia.', '102Ex quos.'),
(104, '103Nesciunt.', '103Accusamus.'),
(105, '104Accusantium.', '104Veritatis.'),
(106, '105Sint quasi.', '105Vel ullam.'),
(107, '106Minima at.', '106Eius.'),
(108, '107Maiores.', '107Facere hic.'),
(109, '108Qui magni.', '108Illo.'),
(110, '109Quia.', '109Iusto ipsa.'),
(111, '110Magni error.', '110Dolores.'),
(112, '111Nisi aut.', '111Odit.'),
(113, '112Consectetur.', '112Soluta.'),
(114, '113Magnam.', '113Iste.'),
(115, '114Deserunt.', '114Distinctio.'),
(116, '115Ipsam.', '115Eveniet.'),
(117, '116Doloribus.', '116Molestiae.'),
(118, '117Corporis.', '117Atque.'),
(119, '118Officia.', '118Mollitia.'),
(120, '119Error rem.', '119Cum.'),
(121, '120Dicta rerum.', '120Molestias.'),
(122, '121Similique.', '121Provident.'),
(123, '122Officiis.', '122Voluptates.'),
(124, '123In quo.', '123Mollitia.'),
(125, '124Ducimus.', '124Quidem.'),
(126, '125Ipsam error.', '125Cumque.'),
(127, '126Recusandae.', '126Dicta.'),
(128, '127Placeat quo.', '127Minima.'),
(129, '128Placeat.', '128Autem.'),
(130, '129Veniam.', '129A quis.'),
(131, '130Qui.', '130Dolorem.'),
(132, '131Similique.', '131Praesentium.'),
(133, '132Deleniti.', '132Occaecati.'),
(134, '133Eligendi.', '133Repudiandae.'),
(135, '134Quasi nulla.', '134Cupiditate.'),
(136, '135Laboriosam.', '135Tempore eos.'),
(137, '136Vel.', '136Dolores.'),
(138, '137Assumenda.', '137Modi iste.'),
(139, '138Quaerat.', '138Corporis.'),
(140, '139Eum.', '139Ullam atque.'),
(141, '140Quam.', '140Enim labore.'),
(142, '141Ullam.', '141Distinctio.'),
(143, '142Voluptates.', '142Magni eum.'),
(144, '143Velit et.', '143Ut debitis.'),
(145, '144Est eum.', '144Rem aliquam.'),
(146, '145Maxime vel.', '145Veritatis.'),
(147, '146Officia.', '146Tenetur.'),
(148, '147Consequatur.', '147Sunt alias.'),
(149, '148Libero nisi.', '148Maxime.'),
(150, '149Natus quas.', '149Repudiandae.'),
(151, '150Deleniti.', '150Iusto.'),
(152, '151Corrupti.', '151Nisi.'),
(153, '152Saepe eos.', '152Nisi vero.'),
(154, '153Laboriosam.', '153Ab sequi.'),
(155, '154Unde.', '154Cum esse.'),
(156, '155Sunt.', '155Repudiandae.'),
(157, '156Unde.', '156Nihil.'),
(158, '157Delectus.', '157Tempora.'),
(159, '158Ipsam.', '158Ab rem est.'),
(160, '159Soluta.', '159Hic.'),
(161, '160Nam placeat.', '160Provident.'),
(162, '161Deserunt.', '161Provident.'),
(163, '162Neque.', '162Hic tempora.'),
(164, '163Accusantium.', '163Neque.'),
(165, '164Pariatur ex.', '164Alias nulla.'),
(166, '165Dolorum.', '165Pariatur.'),
(167, '166Possimus.', '166Velit totam.'),
(168, '167Ipsam ab.', '167Ratione.'),
(169, '168Tempora ad.', '168Quo quis.'),
(170, '169Commodi.', '169Adipisci.'),
(171, '170Magnam vel.', '170Assumenda.'),
(172, '171Qui tempore.', '171Ex magni.'),
(173, '172Tenetur.', '172Ducimus.'),
(174, '173Dolorum.', '173Esse quasi.'),
(175, '174Autem.', '174Aspernatur.'),
(176, '175Dolores.', '175Pariatur.'),
(177, '176Labore modi.', '176Corrupti.'),
(178, '177Ipsa.', '177Quos quam.'),
(179, '178Aut cumque.', '178Qui earum.'),
(180, '179Ab.', '179Nemo.'),
(181, '180Debitis.', '180Eius quia.'),
(182, '181Assumenda.', '181Nesciunt.'),
(183, '182Saepe hic.', '182Reiciendis.'),
(184, '183Fugit.', '183Nisi.'),
(185, '184Fuga iure.', '184Velit sint.'),
(186, '185Deserunt.', '185Consequatur.'),
(187, '186Reiciendis.', '186Dolorum hic.'),
(188, '187Incidunt.', '187Omnis.'),
(189, '188Non debitis.', '188Et dolorem.'),
(190, '189Quos.', '189Maxime quae.'),
(191, '190Culpa.', '190Corporis.'),
(192, '191Ullam culpa.', '191Dolores.'),
(193, '192Vero eum.', '192Quasi.'),
(194, '193Numquam.', '193Delectus.'),
(195, '194Minima.', '194Rerum.'),
(196, '195Quo.', '195Ex dolor.'),
(197, '196Sint ex.', '196Autem vel.'),
(198, '197Aperiam.', '197Ratione.'),
(199, '198Architecto.', '198Sed error.'),
(200, '199Explicabo.', '199Possimus.'),
(201, '200Eligendi.', '200Debitis.'),
(202, '201Tempore quo.', '201Aliquam.'),
(203, '202Tempore.', '202Tenetur.'),
(204, '203Commodi.', '203Vitae.'),
(205, '204Blanditiis.', '204Natus.'),
(206, '205Inventore.', '205Corporis.'),
(207, '206Quasi quod.', '206Molestiae.'),
(208, '207Dolor.', '207Ducimus.'),
(209, '208Magnam nemo.', '208Aperiam.'),
(210, '209Laborum.', '209Fuga labore.'),
(211, '210Atque earum.', '210Consectetur.'),
(212, '211Earum.', '211Itaque non.'),
(213, '212Quis dicta.', '212Voluptate.'),
(214, '213Dolorem.', '213Minus ea.'),
(215, '214Sed qui.', '214Tempora.'),
(216, '215Ex.', '215Eaque.'),
(217, '216Sit.', '216Laboriosam.'),
(218, '217Maxime.', '217Aliquid.'),
(219, '218Officiis.', '218Minus.'),
(220, '219Facilis a.', '219Nostrum.'),
(221, '220Ea nihil.', '220Ut.'),
(222, '221Consectetur.', '221Omnis optio.'),
(223, '222Aspernatur.', '222Fugiat.'),
(224, '223Ad cumque.', '223Molestiae.'),
(225, '224Saepe.', '224Unde.'),
(226, '225Excepturi.', '225Sapiente.'),
(227, '226Quam libero.', '226Tempora.'),
(228, '227Dolor.', '227Amet eos.'),
(229, '228Aliquid.', '228Assumenda.'),
(230, '229Animi.', '229Ducimus.'),
(231, 'sfdhkj', 'wkj'),
(232, '123', '213');

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
(66, 66, '1980-01-12', 'a0ca80206c1f1df76878301a3d0ba170', ''),
(67, 67, '1972-04-19', '661379c27f421f3162d74fe46448d05d', ''),
(68, 68, '1985-12-11', '51041f7f6bdc158eef5c5ba6f6e687c5', ''),
(69, 69, '1971-05-01', '5d9b1bd413ce0c935daac2c4ee05734f', ''),
(70, 70, '1982-08-13', 'c61feae84c6f327561a76645114eb669', ''),
(71, 71, '1990-01-25', 'c12a066d7ed10595abea81f9311c7f8b', ''),
(72, 72, '1997-05-08', 'c12a066d7ed10595abea81f9311c7f8b', ''),
(73, 74, '1998-05-08', 'NYP', '');

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
(1, 73, 'c12a066d7ed10595abea81f9311c7f8b');

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
(15, 'e30f3fd4f0d49f551880d77b20644275db9ce8cdc965a5d932aba311a67e5ba7c43e3a4cf14e9a1975aec0d73d35c1eb', 'nigelhao', '5893c8f04a4ae2087852ce2aef5dee46dbec241889cc94d553f28d898114978a94ef4683b8c11707205cdde87a406712', 'ec7f44783bf622056d1692637cf76c52', '', 'a15f04c0a10888c4975fbce0a46f7dcb11b0119f02edf41666ad97994f480b31530202f07a8cbce32d8c395d7d73571acad672631b6a078f9b7d3edbece021931dd7ba3df4f75f825ebfcc4fb939755f', 'bf808fba0a496f3063e8c928de0acb8a53fccd46ce9b1c6fab7a76a03b070a7f9b00d06bac7c13bd76539584944b379aae04d9e2d2e630c5b96a1839cb8d12ebc2f5ea9dddc21cac7cf85b9d37f255c5'),
(66, '76a746fed366e0c957ad5e471c92ba59', '0Deserunt.', '0e6c567bdec5f62f37f5bc60867cc89144f7dfc88c7dd3987fed3fb27d2fe255e27cd205ac4611e4033ba7641133e291', 'a76494dad8e16069e44160f6b3e95d01', '', '881f1d4ceafcba7bbe87fc1b5362e6479ee7c257ed2708b7ade88ee2b237601a6ec05cb8c4e76143e52bd6fde07c161b7a1ea097a75aa97f61dc3401d150916b57c89f2ae91617e1fbb0b2847663c0f7', '3b16375fc9561fda5951ef16278417c837cc3583ab85e1640ca7cc4a82c41db1f66e6a26c83cd2015fa183a142925703bff3e9665c71e31c83305883a80efde15af8905be0278d0fdd237f7956e15bd0'),
(67, 'e69cf5f5f7368461f955880d847647e2', '1Hic cumque.', 'c5dac5f7a937133bee1d39ecc6c89b84a06a88149f3b04cff4988ebb2eb20a75a282888f4a1432c3f9a536ef0e446c14aaecda6a1dcd4caad7e236bf982153f5e3b2ce034b6a749db07d7159a50c7438', 'a76494dad8e16069e44160f6b3e95d01', '', '6176a263b794367d696c3af19514414cb4807a5d5e4a81b5791cc47e3b102338de616c2ebc96a74035ec2718391d7104d78f900523861535f4bdbcd44425bd7ae78b19902ed91825b66c7f2b7675712d', '0430a15740f5bd3fd5f0d9f02fd1eb7c16cddee1988c940bb8c2fdbcaa28f09f1e72315177cbbdd2de859d35d28808fd97a82d7647af758c7697dbba0d32e585aea8eadfb3691933d9773d0976cbb328'),
(68, 'd24128a43f78f9b6bfd354a77c22463d', '2Ullam magni.', '5eac1587ceaf307e572807c928638653bc3fdcd84a77e9b730606eb649386824d6c6b560d3e3b0a7da021b157d212e5a02d18dfd0f46d2a7c71cf28e9bcb6314', 'a76494dad8e16069e44160f6b3e95d01', '', 'ef74980b15ee9d74beb63edc8b12c4b8631e1225372b6d4bccfb99438ca87acb09152c6d452a89263933cb96d5e5a3322e9f8cd7802939096d1ba78123d629033506fd6c157514fde302f372d08d3720', '0c21e7e9a47d8b8a41928d552bcb0ed524ca4ba41dcc7b80fb674a4e307097d31f62fb0c708907c18d414b6fde757739b024e6fa0dfa8a3f5b426dda247cac1d3fe49aef978351c579406262633e5d92'),
(69, '30f6298eb4509ddddc5ff272843f1aa0', '0Assumenda.', 'a2bb74115f8633f717081c5020cf2fad7a46eabc3f78dcfc2e35670fd04ac3d7f6cfff2d70f871938fa704e40a4a8404', 'a76494dad8e16069e44160f6b3e95d01', '', 'eecce3dfb42d712a35d364d39e92acc31f872a035f4099726b13201e2084e279ceb68c85e5d64c59b88f089ac8094e0fe061d5ef090b0701c0e801e1f9bfedbeea53a84bba77fe7f6a1f9d9cb7c7fc64', '9189b2ffeab9137dc51123013b4b36be20944073fc05f33af35ceb9bc92bf99d945460f9330ec6696816f7b3fe20f00a9064df5beb7bfb8884c0340655a8764acf42d3591ab45ea873eeffa22f5d49c0'),
(70, '09116963caea1818a28d7619dabd3270', '1Voluptatum.', '7ba4b182b62995f3b3294d8a6d75ecc6ac1160ad8813bf3ac2adfede917c8f05300ca7ac4d9700fb0a28ced075d7fcc58faa8d80e43f1382ac400649370e736c7c84802977af08ce9104568851576089', 'a76494dad8e16069e44160f6b3e95d01', '', '8ddcdc08aa1123246198d1f79bb167700c769a0bcda6c42f84d72507d166ad9f27df1f4b4c6d8f5c0b697d288660cd7c93ed6903f90e8bcdf1af12ed0aaeb21e935afc9bf351b21739ef957417251f66', '48d915ce909a5a79f6cec59be596c6c015c2d256d02f1c5b5acd677cd0d325b515a92aca18516a7f696c4f0d6c61063f80e1f13fa1f990ff026a429fbda43837a3cd5e9c4db1d4714a79787819d3ceb2'),
(71, '4df9d63cc54985873cb1d07b2bb7b8de', 'user1', 'b0054b0dac0ae3ebc55a9518db3008c516cdeac3e514e92e1d76dab74723aad0', 'a76494dad8e16069e44160f6b3e95d01', '', '5b1d937fc6fa77847f29c30a4e60466cb0bfc2673c21cb2d7d598a0da267e7623eaaea1a56b0847f9b0d7f6906b51f00525751a7e5af1da473ec3148d30a7fdb63a7fe79997bcff229cb5a655f5473de', 'ea08f66583ed8ca8d18953d8b896b38ea0b424164778c111fed72d04ca89d8ec3522f3cdb215d881770c30e2dda7a880db3e4a9ef89e57bc8ab724f9be42a4946a4e8732370b0baf528da10515100dcb'),
(72, 'f032ed6de0292677795f2cdeaffe1861', 'user2', '728f152f5df92bcc5eda4265ddb77f8e', 'a76494dad8e16069e44160f6b3e95d01', '', '67f31a1ad65352d7859b487c9d77233bddd46f418d8ca39d71c53eb6f4ce67f9e7e18e0ff899315564b295933a684e9437356bb5c58538ecf0476e081b24db0739e19c06b83e4ce8c93532ad1625a00c', '716c305cfcebba4591471867def3e006327e00de6875f6e559433ebd431fa47e458994cbc23da2008e07864a896f96ffe40bae76a19760da120e82dd7a7e43d5889457ee250c28c344af8279f123a007'),
(73, 'ec5a1585923655f638486e05fa55a63e', 'nigelhaoteach', 'a6769de573e63d1d11fbb8a8c362448286d3b742bb048a3b8b7dbaa749a185b0edf6c3f61ae4ffeab9ff945ed0c4b0d9', 'ec7f44783bf622056d1692637cf76c52', '', '8899949dca861b08c400b1626e1c1d6c506d96f60da44019166a289d98731d633d775e4b69fb08660b66851c8d77c1735c767bb38d6ae61f6802dcc98cf15eeea26e8b45f8f7c4c0b33b1b197e3883e1', 'e89a796e21c4846846d49de3a14e9221837366a6e53bfb92c13c579f670d87c161053f7b2982f9fbd5473224f26211f9213ca4bfbf7324fadc8031743e51e2afdaa1eb2561e35ce8641ba348c5cbf464'),
(74, 'NigelUn', 'nigelhaoun', 'nigel.zchun@gmail.com', '97732551', '', 'KjVZJ9Lx2pZIWtlOYrzdRCUDTyMhrukSc6aicizzgAw=', 'WNCpXf4bjmdppfxCamBXWNQpzFgJ1BDcFYCQFd7Au/M=');

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
  MODIFY `ip_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
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
  MODIFY `new_device_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=93;
--
-- AUTO_INCREMENT for table `quiz`
--
ALTER TABLE `quiz`
  MODIFY `quiz_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;
--
-- AUTO_INCREMENT for table `quiz_question`
--
ALTER TABLE `quiz_question`
  MODIFY `question_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;
--
-- AUTO_INCREMENT for table `quiz_question_choices`
--
ALTER TABLE `quiz_question_choices`
  MODIFY `choice_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
--
-- AUTO_INCREMENT for table `spam_area`
--
ALTER TABLE `spam_area`
  MODIFY `spam_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=233;
--
-- AUTO_INCREMENT for table `student_details`
--
ALTER TABLE `student_details`
  MODIFY `student_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=74;
--
-- AUTO_INCREMENT for table `teacher_details`
--
ALTER TABLE `teacher_details`
  MODIFY `teacher_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `user_account`
--
ALTER TABLE `user_account`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=75;
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
