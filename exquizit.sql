-- phpMyAdmin SQL Dump
-- version 4.7.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 17, 2017 at 04:31 PM
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
-- Table structure for table `new_device`
--

CREATE TABLE `new_device` (
  `new_device_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `ip_address` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `new_device`
--

INSERT INTO `new_device` (`new_device_id`, `user_id`, `ip_address`) VALUES
(40, 15, 'wfMw0K/zHByHQD8eQ0e8whr/fBeZCHI1NfKzFyNwJSU='),
(41, 15, 'wfMw0K/zHByHQD8eQ0e8whr/fBeZCHI1NfKzFyNwJSU='),
(42, 15, 'wfMw0K/zHByHQD8eQ0e8whr/fBeZCHI1NfKzFyNwJSU='),
(43, 16, 'wfMw0K/zHByHQD8eQ0e8whr/fBeZCHI1NfKzFyNwJSU='),
(44, 15, 'wfMw0K/zHByHQD8eQ0e8whr/fBeZCHI1NfKzFyNwJSU='),
(45, 15, 'wfMw0K/zHByHQD8eQ0e8whr/fBeZCHI1NfKzFyNwJSU='),
(46, 15, 'wfMw0K/zHByHQD8eQ0e8whr/fBeZCHI1NfKzFyNwJSU=');

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
(15, 15, '312312', 0, 'jkl', 312312312, 0, '2017-07-17');

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
(26, 15, 1, 0, '89f03833e4d1baa2b26fd4aa180a98a2', '6e901ce5e45055e4399fbbaf450224cb', 121, 3123123, 10);

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
(8, 26, '172939e42adc5458e1582dbc3f61e56e9dc0a01858cfc4e1c084a82f387727f9155ce791f3267b88541ad5806f0e9ba17c0c2577c1c130bfb38fb3479a0e4327693e3c3aa41c42d8448bac1ac6bc1a34', 1);

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
(9, 12, '2017-06-29', 'a9f6b177338fb1d9dec06f380948037e', ''),
(10, 15, '2017-07-11', '9b10c3ceb898d822803338d5a7b2b569', ''),
(11, 16, '2017-07-19', '9b10c3ceb898d822803338d5a7b2b569', ''),
(12, 17, '2017-08-03', '9b10c3ceb898d822803338d5a7b2b569', '');

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
  `contact` text NOT NULL,
  `about_me` text NOT NULL,
  `password_hash` text NOT NULL,
  `salt` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user_account`
--

INSERT INTO `user_account` (`user_id`, `name`, `username`, `email`, `contact`, `about_me`, `password_hash`, `salt`) VALUES
(1, 'aa182b3c9847fd7b6c61a9591a92757d0576a0e01008eb21128550d2cbe63c0cc32f5fdd5b0eb89dd1e9b908232a1bed', 'nigelhao123456', '0c5f3fbb26322c11cde4b3c895c304dc38933c2bb514cdc751177567bf417d2f585c4593c8c6f90c0d2f621a44b2cbc3', '', '5d354f426860f22d22e58d35e87c647032d0fdf44c8118c484c817ff682999654113bce51938570995dec0b2a954c1301ccdd5231e2c42b3b028435b362d0fbcc9aab01cb065346863647b756f0f173f96928b246178a328f037dc33f47364e07bbed9c18d7ccae29160f09e9bfebbcb5ba42238545fcf64ea74112038ef2e9184708c7ab281d1126d2d4999464b74103b5595a317f5f828a69ff4d502c2486fcbfdafa901ace0aea6efad95c23a83e0', 'b697106f3e0f8ca62b090adb3005fc089fae885834f862917ed70627c2c10158a39f3aef608c561585c8434eec3390721c1931414615f20f1bc264f969bfd091bcb69a46f47cb0fe83c994a565db7bf7', 'adc2023401f6190ff780e919d05d219d329c495bfdabb68ba94e5e380185030ad0c844d419a98ad83f77d4d434602773ba9311d57f9418578772ae68e4b6f9d587c1dbe661e751688fe2d7e231679c50'),
(2, 'b09a3caa4fd40530a4b11e03f4bfc44a', 'jinkuan', '9348762009d880f3703e5f74dbd3424fdfa550ec5482dc5363d4f7c5197e8e0387434137de627def105d8215e8b49372', '', 'd8e46f9dda0e39724bc87907f937452cab38cc9c0f7e42f8f2cb1213baf9cb0345c5aca2b67be66daa3d788e6018cb8e', 'c237af20702a5a56c63a40292d76b2f8ac11292c6f2c783eb7bcf4b3b2e134bd9c3fd95274c43d2c2145e7e125e439b87c79a58e15d29da4ab162c71f655bf35e2647394e2be3426583709db03058433', 'd9e976b2e93979acae600f0ff2b33bc2b5edac8a230c0561bdc4cf19c8fdae990ef6584c884d0bbb102784a57cdef3604c70dda5517d1ede04671e54ae42244472d4be160a95786082e5f4ed58c35b1e'),
(3, 'a06637a02a28229fa47a9b81d9c53c90', 'chloeang', 'a4a3d0886d4ef4100c9347ee92e2bd1098db94a4d36b80aa0361afbfe7a0e05fa512c52d39a113621288b90db037cc09', '', 'd8e46f9dda0e39724bc87907f937452cab38cc9c0f7e42f8f2cb1213baf9cb0345c5aca2b67be66daa3d788e6018cb8e', 'd3b122972e88f24e84826bf5d7c1a9155a3118f00082f5ca62fbdf4058161c33526b1a950f19686cfee0843f0c40fd62adb45e393c92cbf8a882403187be31ea6694c27746428e547fcd1f43c71d6b06', '440bce1f7bf83f386024046341ef8f898356b914675c722955bc8a3b5f67e033b826cf01a006565b6d9afc2de95f0ec5a714073dd9dbaf82d0cc39b7725a9b718f04f61182091669eee91329e058bd0a'),
(4, 'a8fb266685a3f256859391c0c92d69ae', 'bryantan', 'e14353172dbf5f6ab93d69ed8b767fa3de1e904b375390b00e6f3d6c68c51ee8ae6d110ab5885df5b977398d873007c4', '', 'd8e46f9dda0e39724bc87907f937452cab38cc9c0f7e42f8f2cb1213baf9cb0345c5aca2b67be66daa3d788e6018cb8e', 'b3708e3469503cedfe02cfa5ca81f6679f3c7c9060f7fade3223fb693f708a0e638f805cf9cf7ce4af6124f2bfd52ebb8972942244ac901bd40497437f6c37c594d10b2bb7d7a146dafaf4fc79dea34d', 'bc4c95d31561b4c20faedbbc59659f72e3fe945291de5f0bdb9d3eb34e44678c81a5b0eb37b4d2c538e5c09b6156567aa78bd73c204bbde4db97246a54b94b9a4bd717c5e3453659c499326658db919b'),
(5, '796275eb407cf924ac8ea05c41278cb1', 'qingning', '6a25cd8829de2338e267f048835e024cbd944214c69e3a5c9dceba9d07271761f0c698a769afca1f9f4cb3394a047aa6', '', 'd8e46f9dda0e39724bc87907f937452cab38cc9c0f7e42f8f2cb1213baf9cb0345c5aca2b67be66daa3d788e6018cb8e', 'b9e2783621c316bbaac172d97a3024b1c2b3cfa9867e2bc5854d52071e66379a698f906f0adb67a3168b21676d34a5a964eddfd96cc1f10d3aff54871de0767a6974be0bb3053179fc3dee213c2c8a42', '3800e5ace02c3c469cbce314cbde4f7791dcdf9c7b1e5e7ef0b5cb2c7ead259ebecd95690d68902d5a9af004bf1b5f9a8cff77729599cefd222b53ef14b104b7bce7a23fd24498a03c9e6c096c8e5186'),
(7, 'Unencrypted Name', 'Unencrypted Teach Name', 'unencryptedteachname@gmail.com', '', 'd8e46f9dda0e39724bc87907f937452cab38cc9c0f7e42f8f2cb1213baf9cb0345c5aca2b67be66daa3d788e6018cb8e', 'exo8XOHnDV2gvPD2wLvSvrYAVDV++F6wxpfnuA7Y4+A=', 'Yaog6ZhUnEYMDJI8QcQV9TpUoyLOQ/TiDOhP/pRGLZw='),
(8, 'new name', 'nigelhao22', 'unencryptedstuname@gmail.com', '', 'HELLO', 'Dy4gFRDQJYQexIo5uuG/NzaVbEls+Q849qB5dRXPaeM=', 'Q8VbdgIpg0oERhhFjWpzgwoHwYFCX0wgdhkX3YzpA0g='),
(10, '77d3ab94ee790f4941be36f0872d927d9efb3e8da48f69f22f15753b5de4951933c6f5a2e6cf9d3e99cce17b5f7949ac', 'doing presentation', '571272e80d9dbb09fc77fef118ea801ec0595d0a10df56dfcb3a257d5f56aa6828b6b8e3577e5c73144d2750397293c0', '', '5d354f426860f22d22e58d35e87c647032d0fdf44c8118c484c817ff682999654113bce51938570995dec0b2a954c1301ccdd5231e2c42b3b028435b362d0fbcc9aab01cb065346863647b756f0f173f96928b246178a328f037dc33f47364e07bbed9c18d7ccae29160f09e9bfebbcb5ba42238545fcf64ea74112038ef2e9184708c7ab281d1126d2d4999464b74103b5595a317f5f828a69ff4d502c2486fcbfdafa901ace0aea6efad95c23a83e0', '2dec332584436293d09b7600993cb168486dac0c44bc150a61686a807701dc6efec15ffee13734296cf4fec2a907b1b58a09d335769e9a0727ef32c97fc0ca6d10ec4bf0271fdd30dfd976e82226ef9f', '91a7e66bdb7fe1ad66619a8efd7ac35525ecf51c8673b333a3306d76c44135cf4c698e1b6738d5449aa9ad72ea02692be934050b3cdf8d00e31d73f428161de3b2c895cda83c0a7e88a2f63f68cc0332'),
(11, '1743bba70a51c7bb52ac7dec677c8af6', 'nigelhao22324432342534', '0c5f3fbb26322c11cde4b3c895c304dc38933c2bb514cdc751177567bf417d2f0aeed2a1b94ebe3e267e7f7b1fb59f40', '', '', '9148d9e73e4aea79d2b54e09b7d60ade611cbc748ebe881a07fd72e7dd2f4bc937bc0326589dbe53a7d5841f929a63c38a9117c1f51134311b8a0a7c46885ae8a80ed14c47cc495d834bd40e856483f5', 'ff2b7bed8428f1dced93796ac131d385132e6a4ba820d9d3fc2d9e40f444e850db51db06b0a35ce39fbcd422dd1e2dbf884500e21d81e2e8033a693f570f87149981deb5c8416e42f2481de1f2fb6708'),
(12, '1989512acce3fbeeb5155cc054766e5f', '321312', 'dd7f2f0353303dc7d730b4425feb72df7b4c28a1f9609d24dbf9eaae51c4e86a55d616894e5694b7d448fdb8431679d1', '', '', 'f260757a81638acdd2f60e56bebfdffb77a56e44c75bfa1b53577e831c39f0d763c12dfb722baf1001efaa05c642c6554b50a88a0a372deb382cbfbb54984feb4648839d677cafae39895a4e520f7651', '85f160a0452ab823aa223bf742d77269ae973314fb59f8b3d0107f0467636ffe41e70a0e56e073b56e5d5fb442866f259502e5bb8c58997111418feebfa7eff96b265530c329ce6bd27d6a5fd735cb93'),
(13, '1fe4feadb2e85b06834062ed4fd4061d', 'dasd@dasdsa.com', 'e37cbf7ff5219a57f81e186dfb663539', '', '', '02b1036ae2dd616e3b4fb6ac13b60e726579b0efd60fee76bfd3ad507a9f0076e200d7f048e2c6d18fc634f4f2fd7ea6f2e692204da3e8b6c56bbaf21a0a9904861035452457a51ade4e1e7ff68da4e9', '56ee32e156b5f495583f76feebe25a7de5ea9ac329d1d29fbe3ac4cccacd331e682df8e5158da6203f26008e0f62796263c5790c04b1dcef798ae90a2323954b239dbf22b82e2b53d4f8d7321cb63b7e'),
(14, 'f', '', '', '', '', '', ''),
(15, '948b68cb8558720309654b3682f78e78', 'nigelhao', '6c627602388a6ef2f766a015eb287dbd80956c4667b69cdc733a4e97ad1455842952d55383e07e36afcc097d3254f46e', '', '', '67e4fe12b11d6aab6e25a811759bdd84a40f2511b94f7bd5b91964fc5bb3a6fbf2c51dcc97a777e03304d17713b066bc657ad0118598a82138f8d6b157ffefd528a67cf821120cfaea9975ffc1b771d9', '4c17d0a7bd55b23c4c81e68ff937a92f9920bb123999a1bebbe2259507126eab106d40af42a93aecfe4c4dbcf59bb87413265ca9e90d634b7de11ca16231083540d105a1fc1264244b3e7a97c4b0dda0'),
(16, 'd7285ab32a956959c83ee4a499149deb07bf13b019ef4044ad8ee3e51a5c3d7649158a9fb1de1d065b2f644cc4e0bc28c4c186b939966b7066fcbf6de9ac4438', 'script', '05b5a451a9d9ff93736a8546c75189075b259e3cacf70f97718fe430d81412696901883ecad66321655e6733bc5d237b', '', '', '20c1e26a8a465f82db1d6e48d37fd51c4f2aa4e522822466c689f1853e5f311c13714ab43bd5a02aa7fccfa656ac2884d47b3fe4a507b9a50593b82db6071656b727cca717eefb443da71a446d027d1a', 'e1baad05fcceae5b318baec0a033e2b2aed5b99bdacad520f6d2ba312e784b7ea74be7ef5e40dbad602b559d5b6ae5c2b487b964277f12585626b6fc6c503c8c117210004c2d65b06059681aeb02b7ca'),
(17, '5a521260aecb2aa57499ae249693a28c', '<script>alert(\"kill\");</script>', 'dbf16a60f5709f270422e5402f3905c6e865b9b6f3f255e02c067b75083abfdce3da45f5945a9592896220f5a07b79e52e654f62f10e45075e1102185e48b9f33fca65a936f87efb3f756e193c9390bab41236730be614c6e85f143fe6e009b66492cb6ce5ab479ccff049ee3a273aef119d3b2fbc911b4cbcc18d1815790e5983192d946c07b4889303f4216c0fe357', '', '', 'd4790fd0498f69a368e125dcd9508a4dc0fa525e47c545b0f67ab99dd0e4a31c0d6755400df6c5ddefc3e0765320026e8d9710feee209f2d6410f3a81dd85cdfcec85fc7e00ed9124a6fabfa0cd5da93', '6d531f5971453b78c8be6736225c6f01a483a44125f14d93def5e1c78290283eca9cb20a25e186ee7b23cbc0e191377d150ad20aa1010d2c3a36bc419e3bfc30c73e4c8fa407e21abdda5aa4ebde31e4');

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
-- AUTO_INCREMENT for table `new_device`
--
ALTER TABLE `new_device`
  MODIFY `new_device_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;
--
-- AUTO_INCREMENT for table `quiz`
--
ALTER TABLE `quiz`
  MODIFY `quiz_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;
--
-- AUTO_INCREMENT for table `quiz_question`
--
ALTER TABLE `quiz_question`
  MODIFY `question_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;
--
-- AUTO_INCREMENT for table `quiz_question_choices`
--
ALTER TABLE `quiz_question_choices`
  MODIFY `choice_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
--
-- AUTO_INCREMENT for table `student_details`
--
ALTER TABLE `student_details`
  MODIFY `student_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
--
-- AUTO_INCREMENT for table `teacher_details`
--
ALTER TABLE `teacher_details`
  MODIFY `teacher_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `user_account`
--
ALTER TABLE `user_account`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;
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
