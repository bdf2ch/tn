-- phpMyAdmin SQL Dump
-- version 4.5.4.1deb2ubuntu2
-- http://www.phpmyadmin.net
--
-- Хост: localhost
-- Время создания: Окт 07 2016 г., 18:54
-- Версия сервера: 5.7.13-0ubuntu0.16.04.2
-- Версия PHP: 7.0.8-0ubuntu0.16.04.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `wfs_base`
--

-- --------------------------------------------------------

--
-- Структура таблицы `attachments`
--

CREATE TABLE `attachments` (
  `ID` int(10) UNSIGNED NOT NULL COMMENT 'Идентификатор файла',
  `VIOLATION_ID` int(11) NOT NULL,
  `DIVISION_ID` int(11) NOT NULL DEFAULT '0',
  `TITLE` varchar(500) NOT NULL COMMENT 'Имя файла',
  `SIZE` bigint(11) NOT NULL COMMENT 'Размер файла',
  `MIME_TYPE` varchar(200) NOT NULL COMMENT 'Тип файла',
  `URL` varchar(800) NOT NULL COMMENT 'Ссылка на файл',
  `USER_ID` int(11) NOT NULL DEFAULT '0',
  `DATE_ADDED` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `attachments`
--

INSERT INTO `attachments` (`ID`, `VIOLATION_ID`, `DIVISION_ID`, `TITLE`, `SIZE`, `MIME_TYPE`, `URL`, `USER_ID`, `DATE_ADDED`) VALUES
(1, 49, 145, 'mod_auth_sspi-1.0.4-2.2.2.zip', 39674, 'application/octet-stream', '/uploads/49/mod_auth_sspi-1.0.4-2.2.2.zip', 0, 1473851040),
(2, 147, 20, 'miranda-im-v0.10.49-unicode.exe', 8003382, 'application/x-msdownload', '/uploads/147/miranda-im-v0.10.49-unicode.exe', 0, 1473851111),
(3, 147, 20, 'mod_auth_sspi-1.0.4-2.2.2.zip', 39674, 'application/octet-stream', '/uploads/147/mod_auth_sspi-1.0.4-2.2.2.zip', 0, 1473851115),
(4, 147, 20, 'mod_auth_sspi-1.0.4-x64.zip', 18971, 'application/octet-stream', '/uploads/147/mod_auth_sspi-1.0.4-x64.zip', 0, 1473851128),
(5, 79, 92, 'mod_auth_sspi-1.0.4-2.2.2.zip', 39674, 'application/octet-stream', '/uploads/79/mod_auth_sspi-1.0.4-2.2.2.zip', 0, 1473851420),
(6, 74, 109, 'mod_auth_sspi-1.0.4-2.2.2.zip', 39674, 'application/octet-stream', '/uploads/74/mod_auth_sspi-1.0.4-2.2.2.zip', 0, 1473851471),
(7, 74, 109, 'mod_auth_sspi-1.0.4-x64.zip', 18971, 'application/octet-stream', '/uploads/74/mod_auth_sspi-1.0.4-x64.zip', 0, 1473851474),
(8, 141, 48, 'miranda-im-v0.10.49-unicode.exe', 8003382, 'application/x-msdownload', '/uploads/141/miranda-im-v0.10.49-unicode.exe', 0, 1473851548),
(9, 147, 20, 'Firefox Setup Stub 46.0.1.exe', 242304, 'application/x-msdownload', '/uploads/147/Firefox Setup Stub 46.0.1.exe', 0, 1473851571),
(10, 148, 68, 'mod_auth_sspi-1.0.4-2.2.2.zip', 39674, 'application/octet-stream', '/uploads/148/mod_auth_sspi-1.0.4-2.2.2.zip', 0, 1473851669),
(11, 148, 68, 'mod_auth_sspi-1.0.4-x64.zip', 18971, 'application/octet-stream', '/uploads/148/mod_auth_sspi-1.0.4-x64.zip', 0, 1473851671),
(12, 151, 5, 'Git-2.8.1-64-bit.exe', 31168480, 'application/x-msdownload', '/uploads/151/Git-2.8.1-64-bit.exe', 0, 1473852169),
(13, 144, 129, 'mod_auth_sspi-1.0.4-2.2.2.zip', 39674, 'application/octet-stream', '/uploads/144/mod_auth_sspi-1.0.4-2.2.2.zip', 0, 1473852204),
(14, 144, 129, 'mod_auth_sspi-1.0.4-x64.zip', 18971, 'application/octet-stream', '/uploads/144/mod_auth_sspi-1.0.4-x64.zip', 0, 1473852207),
(15, 151, 5, 'miranda-im-v0.10.49-unicode.exe', 8003382, 'application/x-msdownload', '/uploads/151/miranda-im-v0.10.49-unicode.exe', 0, 1473852821),
(16, 152, 2, 'mod_auth_sspi-1.0.4-x64.zip', 18971, 'application/octet-stream', '/uploads/152/mod_auth_sspi-1.0.4-x64.zip', 0, 1473854940),
(17, 152, 2, 'mod_auth_sspi-1.0.4-2.2.2.zip', 39674, 'application/octet-stream', '/uploads/152/mod_auth_sspi-1.0.4-2.2.2.zip', 0, 1473854943),
(18, 153, 12, 'ChromeFrameSetup.exe', 763424, 'application/x-msdownload', '/uploads/153/ChromeFrameSetup.exe', 0, 1473855133),
(19, 153, 12, 'mod_auth_sspi-1.0.4-2.2.2.zip', 39674, 'application/octet-stream', '/uploads/153/mod_auth_sspi-1.0.4-2.2.2.zip', 0, 1473855136),
(20, 153, 12, 'miranda-im-v0.10.49-unicode.exe', 8003382, 'application/x-msdownload', '/uploads/153/miranda-im-v0.10.49-unicode.exe', 0, 1473855142),
(21, 153, 12, 'mod_auth_sspi-1.0.4-x64.zip', 18971, 'application/octet-stream', '/uploads/153/mod_auth_sspi-1.0.4-x64.zip', 0, 1473855146),
(22, 154, 12, 'miranda-im-v0.10.49-unicode.exe', 8003382, 'application/x-msdownload', '/uploads/154/miranda-im-v0.10.49-unicode.exe', 0, 1473855823),
(23, 154, 12, 'mod_auth_sspi-1.0.4-2.2.2.zip', 39674, 'application/octet-stream', '/uploads/154/mod_auth_sspi-1.0.4-2.2.2.zip', 0, 1473855825),
(24, 154, 12, 'mod_auth_sspi-1.0.4-x64.zip', 18971, 'application/octet-stream', '/uploads/154/mod_auth_sspi-1.0.4-x64.zip', 0, 1473855827),
(25, 155, 0, 'IE8-WindowsXP-KB2618444-x86-RUS.exe', 10603392, 'application/x-msdownload', '/uploads/155/IE8-WindowsXP-KB2618444-x86-RUS.exe', 0, 1473856001),
(26, 154, 12, 'ChromeFrameSetup.exe', 763424, 'application/x-msdownload', '/uploads/154/ChromeFrameSetup.exe', 0, 1473858109),
(27, 154, 12, 'Firefox Setup Stub 46.0.1.exe', 242304, 'application/x-msdownload', '/uploads/154/Firefox Setup Stub 46.0.1.exe', 0, 1473858137),
(28, 154, 12, 'jxplorer-3.3.1-windows-installer.exe', 7312501, 'application/x-msdownload', '/uploads/154/jxplorer-3.3.1-windows-installer.exe', 0, 1473858366),
(29, 50, 94, 'Firefox Setup Stub 46.0.1.exe', 242304, 'application/x-msdownload', '/uploads/50/Firefox Setup Stub 46.0.1.exe', 0, 1473859704),
(30, 50, 94, 'Firefox Setup Stub 45.0.2.exe', 242344, 'application/x-msdownload', '/uploads/50/Firefox Setup Stub 45.0.2.exe', 0, 1473859733),
(31, 150, 91, 'mod_auth_sspi-1.0.4-x64.zip', 18971, 'application/octet-stream', '/uploads/150/mod_auth_sspi-1.0.4-x64.zip', 0, 1473859766),
(32, 150, 91, 'IE8-WindowsXP-x86-RUS.exe', 17028448, 'application/x-msdownload', '/uploads/150/IE8-WindowsXP-x86-RUS.exe', 0, 1473859955),
(33, 150, 91, 'mod_auth_sspi-1.0.4-2.2.2.zip', 39674, 'application/octet-stream', '/uploads/150/mod_auth_sspi-1.0.4-2.2.2.zip', 0, 1473859970),
(34, 150, 91, 'jxplorer-3.3.1-windows-installer.exe', 7312501, 'application/x-msdownload', '/uploads/150/jxplorer-3.3.1-windows-installer.exe', 0, 1473859974),
(35, 50, 94, 'mod_auth_sspi-1.0.4-2.2.2.zip', 39674, 'application/octet-stream', '/uploads/50/mod_auth_sspi-1.0.4-2.2.2.zip', 0, 1473860025),
(36, 156, 0, 'mod_auth_sspi-1.0.4-2.2.2.zip', 39674, 'application/octet-stream', '/uploads/156/mod_auth_sspi-1.0.4-2.2.2.zip', 0, 1473860042),
(37, 156, 0, 'mod_auth_sspi-1.0.4-x64.zip', 18971, 'application/octet-stream', '/uploads/156/mod_auth_sspi-1.0.4-x64.zip', 0, 1473860051),
(38, 50, 94, 'mod_auth_sspi-1.0.4-x64.zip', 18971, 'application/octet-stream', '/uploads/50/mod_auth_sspi-1.0.4-x64.zip', 0, 1473860129),
(39, 152, 2, 'jxplorer-3.3.1-windows-installer.exe', 7312501, 'application/x-msdownload', '/uploads/152/jxplorer-3.3.1-windows-installer.exe', 0, 1473860190),
(40, 151, 5, 'mod_auth_sspi-1.0.4-2.2.2.zip', 39674, 'application/octet-stream', '/uploads/151/mod_auth_sspi-1.0.4-2.2.2.zip', 0, 1473860252),
(41, 151, 5, 'mod_auth_sspi-1.0.4-x64.zip', 18971, 'application/octet-stream', '/uploads/151/mod_auth_sspi-1.0.4-x64.zip', 0, 1473860257),
(42, 50, 94, 'miranda-im-v0.10.49-unicode.exe', 8003382, 'application/x-msdownload', '/uploads/50/miranda-im-v0.10.49-unicode.exe', 0, 1473861384),
(43, 157, 114, 'mod_auth_sspi-1.0.4-2.2.2.zip', 39674, 'application/octet-stream', '/uploads/157/mod_auth_sspi-1.0.4-2.2.2.zip', 0, 1473923186),
(44, 157, 114, 'mod_auth_sspi-1.0.4-x64.zip', 18971, 'application/octet-stream', '/uploads/157/mod_auth_sspi-1.0.4-x64.zip', 0, 1473923191),
(45, 41, 92, '222.jpg', 37924, 'image/jpeg', '/uploads/41/222.jpg', 0, 1473934291),
(46, 159, 75, 'jxplorer-3.3.1-windows-installer.exe', 7312501, 'application/x-msdownload', '/uploads/159/jxplorer-3.3.1-windows-installer.exe', 0, 1473935301),
(47, 159, 75, 'miranda-im-v0.10.49-unicode.exe', 8003382, 'application/x-msdownload', '/uploads/159/miranda-im-v0.10.49-unicode.exe', 0, 1473935304),
(48, 159, 75, 'FileZilla_3.6.0.2_win32-setup.exe', 4702459, 'application/x-msdownload', '/uploads/159/FileZilla_3.6.0.2_win32-setup.exe', 0, 1473935438),
(49, 55, 4, 'Firefox Setup Stub 46.0.1.exe', 242304, 'application/x-msdownload', '/uploads/55/Firefox Setup Stub 46.0.1.exe', 0, 1473941667),
(50, 58, 4, 'mod_auth_sspi-1.0.4-2.2.2.zip', 39674, 'application/octet-stream', '/uploads/58/mod_auth_sspi-1.0.4-2.2.2.zip', 0, 1473941748),
(52, 160, 4, '222.jpg', 37924, 'image/jpeg', '/uploads/160/222.jpg', 0, 1473946205),
(53, 55, 4, '222.jpg', 37924, 'image/jpeg', '/uploads/55/222.jpg', 0, 1473946276),
(54, 161, 0, 'Firefox Setup Stub 45.0.2.exe', 242344, 'application/x-msdownload', '/uploads/161/Firefox Setup Stub 45.0.2.exe', 0, 1473955814),
(55, 162, 1, 'mod_auth_sspi-1.0.4-2.2.2.zip', 39674, 'application/octet-stream', '/uploads/162/mod_auth_sspi-1.0.4-2.2.2.zip', 0, 1473956003),
(56, 162, 1, 'mod_auth_sspi-1.0.4-x64.zip', 18971, 'application/octet-stream', '/uploads/162/mod_auth_sspi-1.0.4-x64.zip', 0, 1473956007),
(57, 141, 48, 'Firefox Setup Stub 45.0.2.exe', 242344, 'application/x-msdownload', '/uploads/141/Firefox Setup Stub 45.0.2.exe', 0, 1474006483),
(58, 141, 48, 'Firefox Setup Stub 46.0.1.exe', 242304, 'application/x-msdownload', '/uploads/141/Firefox Setup Stub 46.0.1.exe', 0, 1474006489),
(59, 164, 4, '222.jpg', 37924, 'image/jpeg', '/uploads/164/222.jpg', 0, 1474012765),
(60, 164, 4, 'zxxz.jpg', 34682, 'image/jpeg', '/uploads/164/zxxz.jpg', 0, 1474012788),
(61, 162, 0, 'Firefox Setup Stub 46.0.1.exe', 242304, 'application/x-msdownload', '/uploads/162/Firefox Setup Stub 46.0.1.exe', 0, 1474205187),
(62, 162, 1, 'miranda-im-v0.10.49-unicode.exe', 8003382, 'application/x-msdownload', '/uploads/162/miranda-im-v0.10.49-unicode.exe', 0, 1474205233),
(63, 165, 1, 'Git-2.8.1-64-bit.exe', 31168480, 'application/x-msdownload', '/uploads/165/Git-2.8.1-64-bit.exe', 0, 1474205501),
(64, 166, 1, 'Git-2.8.1-64-bit.exe', 31168480, 'application/x-msdownload', '/uploads/166/Git-2.8.1-64-bit.exe', 0, 1474205666),
(65, 167, 1, 'Git-2.8.1-64-bit.exe', 31168480, 'application/x-msdownload', '/uploads/167/Git-2.8.1-64-bit.exe', 0, 1474205730),
(66, 168, 1, 'Git-2.8.1-64-bit.exe', 31168480, 'application/x-msdownload', '/uploads/168/Git-2.8.1-64-bit.exe', 0, 1474205924),
(67, 169, 1, 'jxplorer-3.3.1-windows-installer.exe', 7312501, 'application/x-msdownload', '/uploads/169/jxplorer-3.3.1-windows-installer.exe', 0, 1474206149),
(68, 170, 0, 'ChromeFrameSetup.exe', 763424, 'application/x-msdownload', '/uploads/170/ChromeFrameSetup.exe', 0, 1474206680),
(69, 171, 0, 'Git-2.8.1-64-bit.exe', 31168480, 'application/x-msdownload', '/uploads/171/Git-2.8.1-64-bit.exe', 0, 1474206740),
(70, 172, 0, 'Firefox Setup 16.0.2.exe', 18523768, 'application/x-msdownload', '/uploads/172/Firefox Setup 16.0.2.exe', 0, 1474206996),
(71, 173, 0, 'miranda-im-v0.10.49-unicode.exe', 8003382, 'application/x-msdownload', '/uploads/173/miranda-im-v0.10.49-unicode.exe', 0, 1474207253),
(72, 174, 0, 'mod_auth_sspi-1.0.4-2.2.2.zip', 39674, 'application/octet-stream', '/uploads/174/mod_auth_sspi-1.0.4-2.2.2.zip', 0, 1474207318),
(73, 175, 48, 'mod_auth_sspi-1.0.4-2.2.2.zip', 39674, 'application/octet-stream', '/uploads/175/mod_auth_sspi-1.0.4-2.2.2.zip', 0, 1474207383),
(74, 141, 48, 'mod_auth_sspi-1.0.4-2.2.2.zip', 39674, 'application/octet-stream', '/uploads/141/mod_auth_sspi-1.0.4-2.2.2.zip', 0, 1474207477),
(75, 141, 48, 'Git-2.8.1-64-bit.exe', 31168480, 'application/x-msdownload', '/uploads/141/Git-2.8.1-64-bit.exe', 0, 1474207730),
(76, 141, 48, 'ChromeFrameSetup.exe', 763424, 'application/x-msdownload', '/uploads/141/ChromeFrameSetup.exe', 0, 1474207773),
(77, 162, 1, 'ChromeFrameSetup.exe', 763424, 'application/x-msdownload', '/uploads/162/ChromeFrameSetup.exe', 0, 1474208007),
(78, 162, 1, 'jxplorer-3.3.1-windows-installer.exe', 7312501, 'application/x-msdownload', '/uploads/162/jxplorer-3.3.1-windows-installer.exe', 0, 1474208054),
(79, 162, 1, 'FileZilla_3.6.0.2_win32-setup.exe', 4702459, 'application/x-msdownload', '/uploads/162/FileZilla_3.6.0.2_win32-setup.exe', 0, 1474208411),
(80, 50, 94, 'FileZilla_3.6.0.2_win32-setup.exe', 4702459, 'application/x-msdownload', '/uploads/50/FileZilla_3.6.0.2_win32-setup.exe', 0, 1474208465),
(81, 162, 1, 'putty-0.62-installer.exe', 1849240, 'application/x-msdownload', '/uploads/162/putty-0.62-installer.exe', 0, 1474208523),
(82, 162, 1, 'tcm80x64.exe', 4324352, 'application/x-msdownload', '/uploads/162/tcm80x64.exe', 0, 1474209058),
(83, 141, 48, 'putty.exe', 531368, 'application/x-msdownload', '/uploads/141/putty.exe', 0, 1474209424),
(84, 78, 45, '222.jpg', 37924, 'image/jpeg', '/uploads/78/222.jpg', 0, 1474290533),
(85, 162, 1, 'Параметры подключения к БД Параметры подключения к БД Параметры подключения к БД.jpg', 55699, 'image/jpeg', '/uploads/162/Параметры подключения к БД Параметры подключения к БД Параметры подключения к БД.jpg', 0, 1474438874),
(86, 177, 137, 'do.ini', 203, 'application/octet-stream', '/uploads/177/do.ini', 0, 1474636723),
(87, 179, 123, 'gnclient.ini', 973, 'application/octet-stream', '/uploads/179/gnclient.ini', 0, 1474636985),
(88, 193, 91, 'do.ini', 203, 'application/octet-stream', '/uploads/193/do.ini', 0, 1474813216),
(89, 193, 91, 'gnclient.ini', 973, 'application/octet-stream', '/uploads/193/gnclient.ini', 0, 1474813367),
(90, 187, 115, 'gnclient.ini', 973, 'application/octet-stream', '/uploads/187/gnclient.ini', 0, 1474813406),
(91, 194, 108, 'checkout.tpl', 22286, 'application/octet-stream', '/uploads/194/checkout.tpl', 0, 1474813489),
(92, 194, 108, 'gnclient.ini', 973, 'application/octet-stream', '/uploads/194/gnclient.ini', 0, 1474813498),
(93, 191, 107, 'gnclient.ini', 973, 'application/octet-stream', '/uploads/191/gnclient.ini', 0, 1474813854),
(94, 190, 97, 'test.png', 11305, 'image/png', '/uploads/190/test.png', 0, 1474869110),
(95, 161, 1, 'PT_Sans.zip', 887905, 'application/octet-stream', '/uploads/161/PT_Sans.zip', 0, 1474956141),
(96, 194, 108, 'dotNetFx40_Full_x86_x64.exe', 50449456, 'application/x-msdownload', '/uploads/194/dotNetFx40_Full_x86_x64.exe', 0, 1474980868),
(97, 194, 108, 'jdk-7u79-windows-i586.exe', 145030048, 'application/x-msdownload', '/uploads/194/jdk-7u79-windows-i586.exe', 0, 1474981225),
(98, 194, 108, 'jdk-8u92-windows-x64.exe', 203071032, 'application/x-msdownload', '/uploads/194/jdk-8u92-windows-x64.exe', 0, 1474981740),
(99, 194, 108, 'mysql-installer-community-5.7.11.0.msi', 396300288, 'application/octet-stream', '/uploads/194/mysql-installer-community-5.7.11.0.msi', 0, 1474981944),
(100, 194, 108, 'WinClient32x.zip', 902922170, 'application/octet-stream', '/uploads/194/WinClient32x.zip', 0, 1474982718),
(101, 195, 4, 'dotNetFx40_Full_x86_x64.exe', 50449456, 'application/x-msdownload', '/uploads/195/dotNetFx40_Full_x86_x64.exe', 0, 1474983047),
(102, 195, 4, 'jdk-8u92-windows-x64.exe', 203071032, 'application/x-msdownload', '/uploads/195/jdk-8u92-windows-x64.exe', 0, 1474983079),
(103, 196, 19, '_NtK73nlG6A[1].jpg', 310713, 'image/jpeg', '/uploads/196/_NtK73nlG6A[1].jpg', 0, 1474984723),
(104, 197, 0, 'aecherkasov.jpg', 9839, 'image/jpeg', '/uploads/197/aecherkasov.jpg', 0, 1475061548),
(105, 198, 4, 'auth.png', 1176074, 'image/png', '/uploads/198/auth.png', 0, 1475581193),
(106, 198, 4, 'browse.png', 47530, 'image/png', '/uploads/198/browse.png', 0, 1475581196),
(107, 198, 4, 'divisions.png', 34250, 'image/png', '/uploads/198/divisions.png', 0, 1475581202),
(108, 198, 4, 'filter.png', 8380, 'image/png', '/uploads/198/filter.png', 0, 1475581204),
(109, 199, 9, 'divisions.png', 34250, 'image/png', '/uploads/199/divisions.png', 0, 1475581234),
(110, 200, 0, 'violation.png', 29861, 'image/png', '/uploads/200/violation.png', 0, 1475646172),
(111, 200, 0, 'browse.png', 47530, 'image/png', '/uploads/200/browse.png', 0, 1475646299),
(112, 200, 0, 'filter.png', 8380, 'image/png', '/uploads/200/filter.png', 0, 1475646302),
(113, 200, 0, 'auth.png', 1176074, 'image/png', '/uploads/200/auth.png', 0, 1475646305),
(114, 201, 13, 'auth.png', 1176074, 'image/png', '/uploads/201/auth.png', 0, 1475646731),
(115, 201, 13, 'new-violation.png', 22252, 'image/png', '/uploads/201/new-violation.png', 0, 1475646754),
(116, 201, 13, 'violation.png', 29861, 'image/png', '/uploads/201/violation.png', 0, 1475646759),
(117, 202, 12, 'violation-new.png', 1071, 'image/png', '/uploads/202/violation-new.png', 0, 1475646897),
(118, 202, 12, 'new-violation.png', 22252, 'image/png', '/uploads/202/new-violation.png', 0, 1475646898),
(119, 202, 12, 'savi-violation-button.png', 1248, 'image/png', '/uploads/202/savi-violation-button.png', 0, 1475646900),
(120, 203, 14, 'auth.png', 1176074, 'image/png', '/uploads/203/auth.png', 0, 1475647508),
(121, 203, 14, 'browse.png', 47530, 'image/png', '/uploads/203/browse.png', 0, 1475647511),
(122, 203, 14, 'divisions.png', 35305, 'image/png', '/uploads/203/divisions.png', 0, 1475647513),
(123, 216, 0, 'new-violation.png', 22252, 'image/png', 'http://wfs.kolenergo.ru/uploads/216/new-violation.png', 0, 1475657367),
(124, 216, 0, 'browse.png', 47530, 'image/png', 'http://wfs.kolenergo.ru/uploads/216/browse.png', 0, 1475657468),
(125, 216, 0, 'filter.png', 8380, 'image/png', 'http://wfs.kolenergo.ru/uploads/216/filter.png', 0, 1475657652),
(126, 217, 0, 'new-violation.png', 22252, 'image/png', 'http://wfs.kolenergo.ru/uploads/217/new-violation.png', 0, 1475658350),
(127, 218, 0, 'violation-new.png', 1071, 'image/png', 'http://wfs.kolenergo.ru/uploads/218/violation-new.png', 0, 1475658893),
(132, 221, 0, 'violation-new.png', 1071, 'image/png', 'http://wfs.kolenergo.ru/uploads/221/violation-new.png', 0, 1475660146),
(134, 228, 0, 'violation.png', 29861, 'image/png', 'http://wfs.kolenergo.ru/uploads/violations/228/violation.png', 0, 1475669896),
(136, 231, 142, 'add-division-modal.png', 28763, 'image/png', 'http://wfs.kolenergo.ru/uploads/violations/231/add-division-modal.png', 0, 1475745053),
(137, 231, 142, 'add-user-section.png', 19663, 'image/png', 'http://wfs.kolenergo.ru/uploads/violations/231/add-user-section.png', 0, 1475745056),
(138, 231, 142, 'users.png', 19901, 'image/png', 'http://wfs.kolenergo.ru/uploads/violations/231/users.png', 0, 1475745059),
(139, 231, 142, 'violation.png', 29861, 'image/png', 'http://wfs.kolenergo.ru/uploads/violations/231/violation.png', 0, 1475745060),
(140, 231, 142, 'edit-division-modal.png', 30677, 'image/png', 'http://wfs.kolenergo.ru/uploads/violations/231/edit-division-modal.png', 0, 1475745064),
(141, 232, 142, 'new-violation.png', 22252, 'image/png', 'http://wfs.kolenergo.ru/uploads/violations/232/new-violation.png', 0, 1475745495),
(142, 233, 121, 'browse.png', 47530, 'image/png', 'http://wfs.kolenergo.ru/uploads/violations/233/browse.png', 0, 1475746964),
(143, 233, 121, 'violation.png', 29861, 'image/png', 'http://wfs.kolenergo.ru/uploads/violations/233/violation.png', 0, 1475746966),
(144, 233, 121, 'violation-attachments.png', 14553, 'image/png', 'http://wfs.kolenergo.ru/uploads/violations/233/violation-attachments.png', 0, 1475746967),
(145, 233, 121, 'divisions-section.png', 28179, 'image/png', 'http://wfs.kolenergo.ru/uploads/violations/233/divisions-section.png', 0, 1475746969),
(146, 236, 8, 'users.png', 19901, 'image/png', 'http://wfs.kolenergo.ru/uploads/violations/236/users.png', 0, 1475747878),
(147, 237, 2, 'auth.png', 1176074, 'image/png', 'http://wfs.kolenergo.ru/uploads/violations/237/auth.png', 0, 1475830594),
(149, 239, 0, 'new-violation.png', 22252, 'image/png', 'http://wfs.kolenergo.ru/uploads/violations/239/new-violation.png', 0, 1475832016),
(150, 240, 0, 'new-violation.png', 22252, 'image/png', 'http://wfs.kolenergo.ru/uploads/violations/240/new-violation.png', 0, 1475832060),
(151, 241, 0, 'auth.png', 1176074, 'image/png', 'http://wfs.kolenergo.ru/uploads/violations/241/auth.png', 0, 1475832113),
(152, 242, 0, 'edit-user-section.png', 25401, 'image/png', 'http://wfs.kolenergo.ru/uploads/violations/242/edit-user-section.png', 0, 1475833507),
(153, 243, 0, 'edit-division-modal.png', 30677, 'image/png', 'http://wfs.kolenergo.ru/uploads/violations/243/edit-division-modal.png', 0, 1475833578),
(154, 244, 0, 'edit-division-modal.png', 30677, 'image/png', 'http://wfs.kolenergo.ru/uploads/violations/244/edit-division-modal.png', 0, 1475842034),
(155, 245, 0, 'new-violation.png', 22252, 'image/png', 'http://wfs.kolenergo.ru/uploads/violations/245/new-violation.png', 0, 1475842060),
(157, 247, 0, 'add-division-modal.png', 28763, 'image/png', '/uploads/247/add-division-modal.png', 0, 1475836938),
(158, 249, 0, 'violation.png', 29861, 'image/png', '/uploads/violations/249/violation.png', 0, 1475837434),
(159, 250, 0, 'edit-user-section.png', 25401, 'image/png', '/uploads/violations/250/edit-user-section.png', 0, 1475837826),
(160, 250, 0, 'edit-division-button_.png', 1289, 'image/png', '/uploads/violations/250/edit-division-button_.png', 0, 1475837857),
(161, 250, 0, 'upload-file-button.png', 1635, 'image/png', '/uploads/violations/250/upload-file-button.png', 0, 1475837873),
(162, 251, 0, 'add-user-section.png', 19663, 'image/png', '/uploads/violations/251/add-user-section.png', 0, 1475838179),
(163, 252, 0, 'edit-division-modal.png', 30677, 'image/png', '/uploads/violations/252/edit-division-modal.png', 0, 1475838495),
(164, 253, 0, 'auth.png', 1176074, 'image/png', '/uploads/violations/253/auth.png', 0, 1475838540),
(165, 254, 0, 'new-violation.png', 22252, 'image/png', '/uploads/violations/254/new-violation.png', 0, 1475839417),
(166, 254, 0, 'filter.png', 8380, 'image/png', '/uploads/violations/9/254/filter.png', 0, 1475839679),
(167, 254, 0, 'sqldeveloper-4.1.1.19.59-x64.zip', 391917843, 'application/octet-stream', '/uploads/violations/9/254/sqldeveloper-4.1.1.19.59-x64.zip', 0, 1475839781),
(168, 255, 147, 'Firefox Setup Stub 46.0.1.exe', 242304, 'application/x-msdownload', '/uploads/violations/2/255/Firefox Setup Stub 46.0.1.exe', 0, 1475845193),
(169, 255, 147, 'FileZilla_3.6.0.2_win32-setup.exe', 4702459, 'application/x-msdownload', '/uploads/violations//255/FileZilla_3.6.0.2_win32-setup.exe', 0, 1475845315),
(170, 256, 147, 'ChromeFrameSetup.exe', 763424, 'application/x-msdownload', '/uploads/violations/2/256/ChromeFrameSetup.exe', 0, 1475845842),
(171, 257, 0, 'Firefox Setup Stub 45.0.2.exe', 242344, 'application/x-msdownload', '/uploads/violations//257/Firefox Setup Stub 45.0.2.exe', 0, 1475846314),
(172, 258, 0, 'FileZilla_3.6.0.2_win32-setup.exe', 4702459, 'application/x-msdownload', '/uploads/violations//258/FileZilla_3.6.0.2_win32-setup.exe', 0, 1475846959);

-- --------------------------------------------------------

--
-- Структура таблицы `divisions`
--

CREATE TABLE `divisions` (
  `ID` int(10) UNSIGNED NOT NULL COMMENT 'Уникальный ключ',
  `PARENT_ID` int(10) UNSIGNED NOT NULL COMMENT 'Родительский индекс',
  `TITLE_SHORT` varchar(255) NOT NULL COMMENT 'Краткое наименование',
  `TITLE_FULL` varchar(1000) NOT NULL COMMENT 'Полное наименование',
  `SORT_ID` int(11) NOT NULL DEFAULT '0' COMMENT 'Сортировочное внутри подразделения',
  `IS_DEPARTMENT` int(11) NOT NULL DEFAULT '0',
  `is_leaf` enum('0','1') NOT NULL DEFAULT '0' COMMENT 'Лист или узел',
  `PATH` varchar(500) NOT NULL,
  `FILE_STORAGE_HOST` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Структура предприятия';

--
-- Дамп данных таблицы `divisions`
--

INSERT INTO `divisions` (`ID`, `PARENT_ID`, `TITLE_SHORT`, `TITLE_FULL`, `SORT_ID`, `IS_DEPARTMENT`, `is_leaf`, `PATH`, `FILE_STORAGE_HOST`) VALUES
(1, 0, 'МРСК С-З ИА', 'ПАО "МРСК Северо-Запада" Исполнительный Аппарат', 0, 1, '0', '/1/', ''),
(2, 1, 'филиал «Колэнерго»', 'филиал "Колэнерго" ПАО "МРСК Северо-Запада" ', 4, 1, '0', '/1/2/', 'http://wfs.kolenergo.ru'),
(4, 2, 'ПО СЭС ', 'ПО "Северные Электрические Сети"  филиала "Колэнерго" ПАО "МРСК Северо-Запада"', 0, 0, '1', '/1/2/4/', 'http://wfs.kolenergo.ru'),
(5, 2, 'ПО ЦЭС', 'ПО "Центральные Электрические Сети"  филиала "Колэнерго" ПАО "МРСК Северо-Запада"', 0, 0, '1', '/1/2/5/', 'http://wfs.kolenergo.ru'),
(8, 1, 'филиал «Карелэнерго»', 'филиал "Карелэнерго" ПАО "МРСК Северо-Запада"', 3, 1, '0', '/1/8/', ''),
(9, 1, 'филиал «Вологдаэнерго»', 'филиал "Вологдаэнерго" ПАО "МРСК Северо-Запада"', 2, 1, '0', '/1/9/', ''),
(12, 1, 'филиал «Архэнерго»', 'филиал "Архэнерго" ПАО "МРСК Северо-Запада"', 1, 1, '0', '/1/12/', ''),
(13, 1, 'филиал «Псковэнерго»', 'филиал "Псковэнерго" ПАО "МРСК Северо-Запада"', 7, 1, '0', '/1/13/', ''),
(14, 1, 'филиал «Новгородэнерго»', 'филиал "Новгородэнерго" ПАО "МРСК Северо-Запада"', 6, 1, '0', '/1/14/', ''),
(15, 8, 'ПО Западно-Карельские Электрические Сети', 'ПО Западно-Карельские Электрические Сети', 1, 0, '0', '/1/8/15/', ''),
(16, 8, 'ПО Южно-Карельские Электрические Сети', 'ПО Южно-Карельские Электрические Сети', 2, 0, '0', '/1/8/16/', ''),
(17, 8, 'ПО Северные Электрические Сети', 'ПО Северные Электрические Сети', 3, 0, '0', '/1/8/17/', ''),
(18, 15, 'РЭС №1 "Сортавала"', 'РЭС №1 "Сортавала"', 0, 0, '1', '/1/8/15/18/', ''),
(19, 15, 'РЭС №2 "Суоярви"', 'РЭС №2 "Суоярви"', 0, 0, '1', '/1/8/15/19/', ''),
(20, 15, 'РЭС №3 "Лахденпохья"', 'РЭС №3 "Лахденпохья"', 0, 0, '1', '/1/8/15/20/', ''),
(21, 15, 'РЭС №4 "Ляскеля"', 'РЭС №4 "Ляскеля"', 0, 0, '1', '/1/8/15/21/', ''),
(22, 16, 'РЭС №1 Прионежский сетевой район', 'РЭС №1 Прионежский сетевой район', 0, 0, '1', '/1/8/16/22/', ''),
(23, 16, 'РЭС №2 Олонецкий сетевой район', 'РЭС №2 Олонецкий сетевой район', 0, 0, '1', '/1/8/16/23/', ''),
(24, 16, 'РЭС №3 Медвежьегорский сетевой район', 'РЭС №3 Медвежьегорский сетевой район', 0, 0, '1', '/1/8/16/24/', ''),
(25, 16, 'РЭС №4 Пудожский сетевой район', 'РЭС №4 Пудожский сетевой район', 0, 0, '1', '/1/8/16/25/', ''),
(26, 17, 'РЭС №1 Выгский сетевой район', 'РЭС №1 Выгский сетевой район', 0, 0, '1', '/1/8/17/26/', ''),
(27, 17, 'РЭС №2 Беломорский сетевой район', 'РЭС №2 Беломорский сетевой район', 0, 0, '1', '/1/8/17/27/', ''),
(30, 17, 'РЭС №3 Кемский сетевой район', 'РЭС №3 Кемский сетевой район', 0, 0, '1', '/1/8/17/30/', ''),
(31, 17, 'РЭС №4 Лоухский сетевой район', 'РЭС №4 Лоухский сетевой район', 0, 0, '1', '/1/8/17/31/', ''),
(32, 9, 'Вологодские Электрические Сети', 'Вологодские Электрические Сети', 0, 0, '0', '/1/9/32/', ''),
(33, 9, 'Череповецкие Электрические Сети', 'Череповецкие Электрические Сети', 0, 0, '0', '/1/9/33/', ''),
(34, 9, 'Великоустюгские Электрические Сети', 'Великоустюгские Электрические Сети', 0, 0, '0', '/1/9/34/', ''),
(35, 9, 'Тотемские Электрические Сети', 'Тотемские Электрические Сети', 0, 0, '0', '/1/9/35/', ''),
(36, 9, 'Кириловские Электрические Сети', 'Кириловские Электрические Сети', 0, 0, '0', '/1/9/36/', ''),
(37, 32, 'Вологодский РЭС', 'Вологодский РЭС', 0, 0, '1', '/1/9/32/37/', ''),
(38, 32, 'Вожегодский РЭС', 'Вожегодский РЭС', 0, 0, '1', '/1/9/32/38/', ''),
(39, 32, 'Грязовецкий РЭС', 'Грязовецкий РЭС', 0, 0, '1', '/1/9/32/39/', ''),
(40, 32, 'Сокольский РЭС', 'Сокольский РЭС', 0, 0, '1', '/1/9/32/40/', ''),
(41, 32, 'Сяженский РЭС', 'Сяженский РЭС', 0, 0, '1', '/1/9/32/41/', ''),
(42, 32, 'Усть-Кубенский РЭС', 'Усть-Кубенский РЭС', 0, 0, '1', '/1/9/32/42/', ''),
(43, 32, 'Харовский РЭС', 'Харовский РЭС', 0, 0, '1', '/1/9/32/43/', ''),
(44, 32, 'Междуреченский РЭС', 'Междуреченский РЭС', 0, 0, '1', '/1/9/32/44/', ''),
(45, 33, 'Череповецкий РЭС', 'Череповецкий РЭС', 0, 0, '1', '/1/9/33/45/', ''),
(46, 33, 'Кадуйский РЭС', 'Кадуйский РЭС', 0, 0, '1', '/1/9/33/46/', ''),
(47, 33, 'Мяксинский РЭС', 'Мяксинский РЭС', 0, 0, '1', '/1/9/33/47/', ''),
(48, 33, 'Чагодощенский РЭС', 'Чагодощенский РЭС', 0, 0, '1', '/1/9/33/48/', ''),
(49, 33, 'Устюженский РЭС', 'Устюженский РЭС', 0, 0, '1', '/1/9/33/49/', ''),
(50, 33, 'Бабаевский РЭС', 'Бабаевский РЭС', 0, 0, '1', '/1/9/33/50/', ''),
(51, 33, 'Шекснинский РЭС', 'Шекснинский РЭС', 0, 0, '1', '/1/9/33/51/', ''),
(52, 34, 'Великоустюгский РЭС', 'Великоустюгский РЭС', 0, 0, '1', '/1/9/34/52/', ''),
(53, 34, 'Кич-Городецкий РЭС', 'Кич-Городецкий РЭС', 0, 0, '1', '/1/9/34/53/', ''),
(54, 34, 'Никольский РЭС', 'Никольский РЭС', 0, 0, '1', '/1/9/34/54/', ''),
(55, 34, 'Нюксенский РЭС', 'Нюксенский РЭС', 0, 0, '1', '/1/9/34/55/', ''),
(56, 35, 'Бабушкинский РЭС', 'Бабушкинский РЭС', 0, 0, '1', '/1/9/35/56/', ''),
(57, 35, 'Верховажский РЭС', 'Верховажский РЭС', 0, 0, '1', '/1/9/35/57/', ''),
(58, 35, 'Тарногский РЭС', 'Тарногский РЭС', 0, 0, '1', '/1/9/35/58/', ''),
(59, 35, 'Тотемский РЭС', 'Тотемский РЭС', 0, 0, '1', '/1/9/35/59/', ''),
(60, 36, 'Кириловский РЭС', 'Кириловский РЭС', 0, 0, '1', '/1/9/36/60/', ''),
(61, 36, 'Белозерский РЭС', 'Белозерский РЭС', 0, 0, '1', '/1/9/36/61/', ''),
(62, 36, 'Вашкинский РЭС', 'Вашкинский РЭС', 0, 0, '1', '/1/9/36/62/', ''),
(63, 36, 'Вытегоский РЭС', 'Вытегоский РЭС', 0, 0, '1', '/1/9/36/63/', ''),
(64, 12, 'Архангельские Электрические Сети', 'Архангельские Электрические Сети', 0, 0, '0', '/1/12/64/', ''),
(65, 12, 'Плесецкие Электрические Сети', 'Плесецкие Электрические Сети', 0, 0, '0', '/1/12/65/', ''),
(66, 12, 'Вельские Электрические Сети', 'Вельские Электрические Сети', 0, 0, '0', '/1/12/66/', ''),
(67, 12, 'Котласские Электрические Сети', 'Котласские Электрические Сети', 0, 0, '0', '/1/12/67/', ''),
(68, 64, 'Архангельский РЭС', 'Архангельский РЭС', 0, 0, '1', '/1/12/64/68/', ''),
(69, 64, 'Мезенский РЭС', 'Мезенский РЭС', 0, 0, '1', '/1/12/64/69/', ''),
(70, 64, 'Пинежский РЭС', 'Пинежский РЭС', 0, 0, '1', '/1/12/64/70/', ''),
(71, 64, 'Приморский РЭС', 'Приморский РЭС', 0, 0, '1', '/1/12/64/71/', ''),
(72, 64, 'Северодвинский РЭС', 'Северодвинский РЭС', 0, 0, '1', '/1/12/64/72/', ''),
(73, 64, 'Холмогорский РЭС', 'Холмогорский РЭС', 0, 0, '1', '/1/12/64/73/', ''),
(74, 65, 'Каргопольский РЭС', 'Каргопольский РЭС', 0, 0, '1', '/1/12/65/74/', ''),
(75, 65, 'Коношский РЭС', 'Коношский РЭС', 0, 0, '1', '/1/12/65/75/', ''),
(76, 65, 'Няндомский РЭС', 'Няндомский РЭС', 0, 0, '1', '/1/12/65/76/', ''),
(77, 65, 'Онежский РЭС', 'Онежский РЭС', 0, 0, '1', '/1/12/65/77/', ''),
(78, 65, 'Плесецкий РЭС', 'Плесецкий РЭС', 0, 0, '1', '/1/12/65/78/', ''),
(79, 66, 'Вельский РЭС', 'Вельский РЭС', 0, 0, '1', '/1/12/66/79/', ''),
(80, 66, 'Виноградовский РЭС', 'Виноградовский РЭС', 0, 0, '1', '/1/12/66/80/', ''),
(81, 66, 'Устьянский РЭС', 'Устьянский РЭС', 0, 0, '1', '/1/12/66/81/', ''),
(82, 66, 'Шенкурский РЭС', 'Шенкурский РЭС', 0, 0, '1', '/1/12/66/82/', ''),
(83, 67, 'Верхне-тотемский РЭС', 'Верхне-тотемский РЭС', 0, 0, '1', '/1/12/67/83/', ''),
(84, 67, 'Вилегодский РЭС', 'Вилегодский РЭС', 0, 0, '1', '/1/12/67/84/', ''),
(85, 67, 'Котласский городской РЭС', 'Котласский городской РЭС', 0, 0, '1', '/1/12/67/85/', ''),
(86, 67, 'Котласский РЭС', 'Котласский РЭС', 0, 0, '1', '/1/12/67/86/', ''),
(87, 67, 'Ленский РЭС', 'Ленский РЭС', 0, 0, '1', '/1/12/67/87/', ''),
(88, 67, 'Сольвычегодский РЭС', 'Сольвычегодский РЭС', 0, 0, '1', '/1/12/67/88/', ''),
(89, 67, 'Черевковский РЭС', 'Черевковский РЭС', 0, 0, '1', '/1/12/67/89/', ''),
(90, 1, 'филиал «Комиэнерго»', 'филиал "Комиэнерго" ПАО "МРСК Северо-Запада"', 5, 1, '0', '/1/90/', ''),
(91, 13, 'Центральные Электрические Сети', 'Центральные Электрические Сети', 0, 0, '1', '/1/13/91/', ''),
(92, 13, 'Северные Электрические Сети', 'Северные Электрические Сети', 0, 0, '0', '/1/13/92/', ''),
(93, 13, 'Восточные Электрические Сети', 'Восточные Электрические Сети', 0, 0, '0', '/1/13/93/', ''),
(94, 13, 'Южные Электрические Сети', 'Южные Электрические Сети', 0, 0, '0', '/1/13/94/', ''),
(95, 13, 'Западные Электрические Сети', 'Западные Электрические Сети', 0, 0, '0', '/1/13/95/', ''),
(96, 92, '1-й РЭС', '1-й РЭС', 0, 0, '1', '/1/13/92/96/', ''),
(97, 92, '2-й РЭС', '2-й РЭС', 0, 0, '1', '/1/13/92/97/', ''),
(98, 92, '3-й РЭС', '3-й РЭС', 0, 0, '1', '/1/13/92/98/', ''),
(99, 92, '4-й РЭС', '4-й РЭС', 0, 0, '1', '/1/13/92/99/', ''),
(100, 92, 'Подстанции СЭС в Псковском районе', 'Подстанции СЭС в Псковском районе', 0, 0, '1', '/1/13/92/100/', ''),
(101, 93, 'РЭС №1', 'РЭС №1', 0, 0, '1', '/1/13/93/101/', ''),
(102, 93, 'РЭС №2', 'РЭС №2', 0, 0, '1', '/1/13/93/102/', ''),
(103, 93, 'РЭС №3', 'РЭС №3', 0, 0, '1', '/1/13/93/103/', ''),
(104, 93, 'РЭС №4', 'РЭС №4', 0, 0, '1', '/1/13/93/104/', ''),
(105, 93, 'Дновский УЭС', 'Дновский УЭС', 0, 0, '1', '/1/13/93/105/', ''),
(106, 94, '1-й РЭС ', '1-й РЭС ', 0, 0, '1', '/1/13/94/106/', ''),
(107, 94, '2-й РЭС', '2-й РЭС', 0, 0, '1', '/1/13/94/107/', ''),
(108, 94, '3-й РЭС', '3-й РЭС', 0, 0, '1', '/1/13/94/108/', ''),
(109, 94, '4-й РЭС', '4-й РЭС', 0, 0, '1', '/1/13/94/109/', ''),
(110, 94, 'Высоковольтный РЭС', 'Высоковольтный РЭС', 0, 0, '1', '/1/13/94/110/', ''),
(111, 94, 'Великолукский участок 2-го РЭС', 'Великолукский участок 2-го РЭС', 0, 0, '1', '/1/13/94/111/', ''),
(112, 94, 'Усвятский участок', 'Усвятский участок', 0, 0, '1', '/1/13/94/112/', ''),
(113, 95, 'РЭС №1', 'РЭС №1', 0, 0, '1', '/1/13/95/113/', ''),
(114, 95, 'РЭС №2', 'РЭС №2', 0, 0, '1', '/1/13/95/114/', ''),
(115, 95, 'РЭС №3', 'РЭС №3', 0, 0, '1', '/1/13/95/115/', ''),
(116, 95, 'Высоковольтный РЭС', 'Высоковольтный РЭС', 0, 0, '1', '/1/13/95/116/', ''),
(117, 14, 'ПО "Боровические Электрические Сети"', 'ПО "Боровические Электрические Сети"', 0, 0, '0', '/1/14/117/', ''),
(118, 14, 'ПО "Валдайские Электрические Сети"', 'ПО "Валдайские Электрические Сети"', 0, 0, '0', '/1/14/118/', ''),
(119, 14, 'ПО "Ильменьские Электрические Сети"', 'ПО "Ильменьские Электрические Сети"', 0, 0, '0', '/1/14/119/', ''),
(120, 14, 'ПО "Старорусские Электрические Сети"', 'ПО "Старорусские Электрические Сети"', 0, 0, '0', '/1/14/120/', ''),
(121, 117, 'Боровический РЭС', 'Боровический РЭС', 0, 0, '1', '/1/14/117/121/', ''),
(122, 117, 'Любытинский РЭС', 'Любытинский РЭС', 0, 0, '1', '/1/14/117/122/', ''),
(123, 117, 'Мошенской РЭС', 'Мошенской РЭС', 0, 0, '1', '/1/14/117/123/', ''),
(124, 117, 'Окуловский РЭС', 'Окуловский РЭС', 0, 0, '1', '/1/14/117/124/', ''),
(125, 117, 'Пестовский РЭС', 'Пестовский РЭС', 0, 0, '1', '/1/14/117/125/', ''),
(126, 117, 'Хвойнинский РЭС', 'Хвойнинский РЭС', 0, 0, '1', '/1/14/117/126/', ''),
(127, 118, 'Валдайский РЭС', 'Валдайский РЭС', 0, 0, '1', '/1/14/118/127/', ''),
(128, 118, 'Демянский РЭС', 'Демянский РЭС', 0, 0, '1', '/1/14/118/128/', ''),
(129, 118, 'Крестецкий РЭС', 'Крестецкий РЭС', 0, 0, '1', '/1/14/118/129/', ''),
(130, 118, 'Маревский РЭС', 'Маревский РЭС', 0, 0, '1', '/1/14/118/130/', ''),
(131, 119, 'Новгородский РЭС', 'Новгородский РЭС', 0, 0, '1', '/1/14/119/131/', ''),
(132, 119, 'Шимский РЭС', 'Шимский РЭС', 0, 0, '1', '/1/14/119/132/', ''),
(133, 119, 'Чудовский РЭС', 'Чудовский РЭС', 0, 0, '1', '/1/14/119/133/', ''),
(134, 119, 'Солецкий РЭС', 'Солецкий РЭС', 0, 0, '1', '/1/14/119/134/', ''),
(135, 119, 'Маловишерский РЭС', 'Маловишерский РЭС', 0, 0, '1', '/1/14/119/135/', ''),
(136, 119, 'Батецкий РЭС', 'Батецкий РЭС', 0, 0, '1', '/1/14/119/136/', ''),
(137, 120, 'Старорусский РЭС', 'Старорусский РЭС', 0, 0, '1', '/1/14/120/137/', ''),
(138, 120, 'Старорусский РЭС', 'Старорусский РЭС', 0, 0, '1', '/1/14/120/138/', ''),
(139, 120, 'Парфинский РЭС', 'Парфинский РЭС', 0, 0, '1', '/1/14/120/139/', ''),
(140, 120, 'Поддорский РЭС', 'Поддорский РЭС', 0, 0, '1', '/1/14/120/140/', ''),
(141, 120, 'Холмский РЭС', 'Холмский РЭС', 0, 0, '1', '/1/14/120/141/', ''),
(142, 90, 'Сыктывкарские Электрические Сети', 'Сыктывкарские Электрические Сети', 0, 0, '1', '/1/90/142/', ''),
(143, 90, 'Печерские Электрические Сети', 'Печерские Электрические Сети', 0, 0, '1', '/1/90/143/', ''),
(144, 90, 'Центральные Электрические Сети', 'Центральные Электрические Сети', 0, 0, '1', '/1/90/144/', ''),
(145, 90, 'Южные Электрические Сети', 'Южные Электрические Сети', 0, 0, '1', '/1/90/145/', ''),
(146, 90, 'Воркутинские Электрические Сети', 'Воркутинские Электрические Сети', 0, 0, '1', '/1/90/146/', ''),
(147, 2, '111', '1111', 0, 0, '0', '/1/2/147/', '00000');

-- --------------------------------------------------------

--
-- Структура таблицы `esk_groups`
--

CREATE TABLE `esk_groups` (
  `ID` int(10) UNSIGNED NOT NULL COMMENT 'Идентификатор ЭКС',
  `TITLE` varchar(500) NOT NULL COMMENT 'Наименование ЭКС',
  `ORDER_ID` int(11) NOT NULL,
  `DESCRIPTION` varchar(500) NOT NULL COMMENT 'Примечание'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `esk_groups`
--

INSERT INTO `esk_groups` (`ID`, `TITLE`, `ORDER_ID`, `DESCRIPTION`) VALUES
(1, 'ВЛ - 35 кВ ', 1, ''),
(2, 'ВЛ - 110 кВ и выше', 2, ''),
(4, 'Подстанции 110 кВ и выше', 3, ''),
(5, 'Подстанции 35 кВ', 4, ''),
(6, 'Прочее', 5, '');

-- --------------------------------------------------------

--
-- Структура таблицы `settings`
--

CREATE TABLE `settings` (
  `ID` int(11) NOT NULL,
  `TITLE` varchar(300) NOT NULL,
  `DESCRIPTION` varchar(1000) NOT NULL,
  `VALUE` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `ID` int(11) NOT NULL,
  `DIVISION_ID` int(11) NOT NULL DEFAULT '0',
  `SURNAME` varchar(500) NOT NULL,
  `NAME` varchar(500) NOT NULL,
  `FNAME` varchar(500) NOT NULL,
  `EMAIL` varchar(500) NOT NULL,
  `LOGIN` varchar(50) NOT NULL,
  `PASSWORD` varchar(16) NOT NULL,
  `IS_ADMINISTRATOR` int(11) NOT NULL DEFAULT '0',
  `ALLOW_EDIT` int(11) NOT NULL DEFAULT '0',
  `ALLOW_CONFIRM` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`ID`, `DIVISION_ID`, `SURNAME`, `NAME`, `FNAME`, `EMAIL`, `LOGIN`, `PASSWORD`, `IS_ADMINISTRATOR`, `ALLOW_EDIT`, `ALLOW_CONFIRM`) VALUES
(1, 147, 'Воронов', 'Сергей', 'Александрович', 'savoronov@kolenergo.ru', 'kolu0897', 'qwerty', 1, 1, 1),
(2, 1, 'Гончаров', 'Игорь', 'Вячеславович', 'igoncharov@kolenergo.ru', 'kolu0534', 'qwerty', 1, 1, 1),
(3, 2, 'Герасим', 'Владислав', 'Янович', 'vygerasim@kolenergo.ru', 'kolu0325', 'qwerty', 0, 0, 0);

-- --------------------------------------------------------

--
-- Структура таблицы `violations`
--

CREATE TABLE `violations` (
  `ID` int(10) UNSIGNED NOT NULL COMMENT 'Идентификатор события',
  `DIVISION_ID` int(10) UNSIGNED NOT NULL COMMENT 'Идентификатор стуктурного подразделения',
  `USER_ID` int(11) NOT NULL COMMENT 'автор сообщения',
  `ESK_GROUP_ID` int(10) UNSIGNED NOT NULL COMMENT 'Идентификатор ЕКС',
  `DATE_HAPPENED` int(11) NOT NULL COMMENT 'Дата события',
  `DESCRIPTION` varchar(4000) NOT NULL COMMENT 'Описание события',
  `ESK_OBJECT` varchar(1000) NOT NULL,
  `DATE_ADDED` int(11) NOT NULL,
  `IS_CONFIRMED` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='События - Технологического Нарушения';

--
-- Дамп данных таблицы `violations`
--

INSERT INTO `violations` (`ID`, `DIVISION_ID`, `USER_ID`, `ESK_GROUP_ID`, `DATE_HAPPENED`, `DESCRIPTION`, `ESK_OBJECT`, `DATE_ADDED`, `IS_CONFIRMED`) VALUES
(2, 1, 0, 5, 1472822738, 'тест', 'тест', 1472823344, 0),
(3, 4, 0, 5, 1473058333, 'Описание тестового технологического нарушения', 'Тестовый объект', 1473058374, 0),
(4, 4, 0, 5, 1473058333, 'Описание тестового технологического нарушения', 'Тестовый объект', 1473058374, 0),
(5, 12, 0, 2, 1473058728, 'Описание технологического нарушения 2', 'Тестовый объект 2', 1473058763, 0),
(6, 12, 0, 2, 1473058728, 'Описание технологического нарушения 2', 'Тестовый объект 2', 1473058764, 0),
(7, 1, 0, 5, 1473058807, '0001', '0001', 1473058945, 0),
(8, 9, 0, 4, 1472677200, '22222', '2222', 1473072258, 0),
(9, 9, 0, 4, 1472677200, '555', '5555', 1473072274, 0),
(10, 1, 0, 1, 1473073639, '33333', '3333', 1473073651, 0),
(26, 4, 0, 2, 1473159814, 'ОПИСАНИЕ ТЕСТОВОГО ТЕХНОЛОГИЧЕСКОГО НАРУШЕНИЯ', 'ТЕСТОВЫЙ ОБЪЕКТ', 1473159957, 0),
(28, 2, 0, 4, 1473164851, 'ОПИСАНИЕ НОВОГО ТЕСТОВОГО ТЕХНОЛОГИЧЕСКОГО НАРУШЕНИЯ', 'Опора №46 ВЛ-76', 1473164902, 0),
(29, 8, 1, 2, 1473237857, 'Описание ТН', 'Объект объект', 1473237889, 0),
(30, 1, 1, 2, 1473238303, 'авпвапв', 'павпав', 1473238311, 0),
(31, 1, 1, 5, 1473238574, 'павпавп', 'пав', 1473238584, 0),
(32, 5, 2, 5, 1472590800, 'fddsfsdf', 'eqwe', 1473245979, 0),
(33, 4, 2, 2, 1472418000, 'bnbn', 'bn', 1473246005, 0),
(34, 8, 2, 6, 1473246005, 'asasas', 'asas', 1473246044, 0),
(35, 68, 3, 2, 1473246099, 'bnb', 'bnbn', 1473246138, 0),
(36, 34, 3, 4, 1470949200, 'jkjk', 'jkj', 1473246163, 0),
(41, 92, 1, 2, 1472763600, 'Описание ТН', 'Опора №44 ВЛ-75', 1473254003, 0),
(42, 90, 1, 2, 1473254174, 'пппп', 'ппп', 1473254200, 0),
(43, 79, 1, 1, 1473254359, 'счмчсмч', 'мсмчсм', 1473254384, 0),
(44, 33, 1, 5, 1473254560, 'мисм', 'имси', 1473254586, 0),
(45, 128, 1, 5, 1473254626, 'генг', 'нгне', 1473254653, 0),
(46, 5, 1, 4, 1472763600, 'рапрапр', 'парап', 1473254769, 0),
(47, 91, 1, 5, 1473254920, '2222', '222', 1473254946, 0),
(49, 145, 1, 4, 1473329133, 'ggggg', 'gggg', 1473330239, 0),
(50, 94, 1, 2, 1474405200, 'ТЕСТ', 'ТЕСТ', 1473331930, 0),
(51, 35, 1, 6, 1473341589, '0000', '0000', 1473341655, 0),
(52, 5, 1, 2, 1473341784, '666', '666', 1473341827, 0),
(53, 142, 1, 2, 1473341871, '888', '888', 1473341893, 0),
(54, 2, 1, 4, 1473341942, '999', '999', 1473341993, 0),
(55, 4, 2, 2, 1473342227, '1121212\njasghdjhdg\n\nываыаыва\nываыва\nsd', '12122', 1473342269, 0),
(56, 14, 1, 2, 1473399388, 'Обрыв кабеля', 'опора №37 ВЛ-75', 1473399424, 0),
(57, 12, 1, 4, 1473399481, 'тест', 'тест', 1473399514, 0),
(58, 4, 1, 2, 1473226200, 'Обрыв кабеля', 'Опора №44 ВЛ-46', 1473399938, 0),
(74, 109, 1, 4, 1473762911, '77', '77', 1473762929, 0),
(75, 12, 1, 2, 1473762986, '11', '11', 1473763024, 0),
(76, 5, 1, 4, 1473765156, 'hhh', 'hhh', 1473765266, 0),
(77, 2, 1, 5, 1473765266, 'sss', 'sss', 1473765386, 0),
(78, 45, 1, 2, 1473766169, 'jjjdddd', 'jj', 1473766291, 0),
(79, 92, 2, 2, 1473766920, 'ВЛ-321КТВ што-то поломалось', 'ВЛ-321КТВ', 1473767089, 0),
(80, 89, 1, 4, 1473771023, '4444', '444', 1473771097, 0),
(83, 0, 0, 0, 0, '', '', 0, 0),
(85, 0, 0, 0, 0, '', '', 0, 0),
(86, 0, 0, 0, 0, '', '', 0, 0),
(87, 0, 0, 0, 0, '', '', 0, 0),
(88, 0, 0, 0, 0, '', '', 0, 0),
(90, 0, 0, 0, 0, '', '', 0, 0),
(91, 0, 0, 0, 0, '', '', 0, 0),
(92, 0, 0, 0, 0, '', '', 0, 0),
(93, 0, 0, 0, 0, '', '', 0, 0),
(94, 0, 0, 0, 0, '', '', 0, 0),
(95, 0, 0, 0, 0, '', '', 0, 0),
(96, 0, 0, 0, 0, '', '', 0, 0),
(97, 0, 0, 0, 0, '', '', 0, 0),
(98, 0, 0, 0, 0, '', '', 0, 0),
(99, 0, 0, 0, 0, '', '', 0, 0),
(100, 0, 0, 0, 0, '', '', 0, 0),
(101, 0, 0, 0, 0, '', '', 0, 0),
(102, 0, 0, 0, 0, '', '', 0, 0),
(103, 0, 0, 0, 0, '', '', 0, 0),
(104, 0, 0, 0, 0, '', '', 0, 0),
(105, 0, 0, 0, 0, '', '', 0, 0),
(106, 0, 0, 0, 0, '', '', 0, 0),
(107, 0, 0, 0, 0, '', '', 0, 0),
(108, 9, 1, 4, 1473834261, 'jhkjhkhj', 'kjhk', 1473834348, 0),
(109, 0, 0, 0, 0, '', '', 0, 0),
(110, 0, 0, 0, 0, '', '', 0, 0),
(111, 53, 1, 2, 1473836335, 'uuuu', 'uuu', 1473836733, 0),
(113, 0, 0, 0, 0, '', '', 0, 0),
(114, 0, 0, 0, 0, '', '', 0, 0),
(115, 0, 0, 0, 0, '', '', 0, 0),
(116, 0, 0, 0, 0, '', '', 0, 0),
(117, 0, 0, 0, 0, '', '', 0, 0),
(118, 0, 0, 0, 0, '', '', 0, 0),
(119, 0, 0, 0, 0, '', '', 0, 0),
(120, 0, 0, 0, 0, '', '', 0, 0),
(121, 0, 0, 0, 0, '', '', 0, 0),
(122, 0, 0, 0, 0, '', '', 0, 0),
(123, 0, 0, 0, 0, '', '', 0, 0),
(124, 0, 0, 0, 0, '', '', 0, 0),
(125, 0, 0, 0, 0, '', '', 0, 0),
(126, 0, 0, 0, 0, '', '', 0, 0),
(127, 0, 0, 0, 0, '', '', 0, 0),
(128, 0, 0, 0, 0, '', '', 0, 0),
(129, 0, 0, 0, 0, '', '', 0, 0),
(130, 0, 0, 0, 0, '', '', 0, 0),
(131, 0, 0, 0, 0, '', '', 0, 0),
(132, 0, 0, 0, 0, '', '', 0, 0),
(138, 66, 1, 1, 1473839288, 'гггг', 'ггг', 1473839365, 0),
(139, 19, 1, 1, 1473839640, '4444', '444', 1473839658, 0),
(140, 21, 1, 2, 1473839658, '55', '55', 1473839683, 0),
(141, 48, 1, 4, 1473839727, '777', '77', 1473839763, 0),
(142, 22, 1, 1, 1473839960, '8888', '888', 1473839995, 0),
(143, 8, 1, 2, 1473840156, 'пп', 'пп', 1473840196, 0),
(144, 129, 1, 6, 1473840205, 'пппп', 'ппп', 1473840325, 0),
(145, 31, 1, 1, 1473840685, 'аа', 'аа', 1473840721, 0),
(146, 144, 1, 2, 1473840978, 'шш', 'шш', 1473841114, 0),
(147, 20, 1, 1, 1473851024, '321321365465465\n6546541564', '1111', 1473851134, 0),
(148, 68, 1, 1, 1473851646, '5555', '555', 1473851674, 0),
(149, 1, 1, 2, 1473851984, 'jj', 'jj', 1473852008, 0),
(150, 91, 1, 2, 1473852008, 'jj', 'jj', 1473852025, 0),
(151, 5, 1, 2, 1473852025, 'tt', 'tt', 1473852044, 0),
(152, 2, 1, 2, 1473854812, 'kkk', 'kkk', 1473854948, 0),
(153, 12, 1, 2, 1473855109, 'ggg', 'ggg', 1473855152, 0),
(154, 12, 1, 5, 1473855811, 'ffff', 'ffff', 1473855855, 0),
(155, 146, 1, 4, 1473855962, 'b', 'b', 1473856018, 0),
(156, 0, 0, 0, 0, '', '', 0, 0),
(157, 114, 1, 6, 1474089900, '1010101', '1010110', 1473923098, 0),
(158, 107, 1, 5, 1473923170, 'ghghgh', 'ghghgh', 1473923274, 0),
(159, 75, 1, 2, 1473928318, '55555', '55555', 1473935310, 0),
(161, 1, 1, 1, 1473955788, '444', '444', 1473955817, 1),
(162, 1, 1, 4, 1474723500, '77777', '8888888888', 1473956010, 1),
(163, 65, 1, 2, 1473956011, '222', '222', 1474004192, 0),
(164, 4, 2, 5, 1474012639, 'вапвып\nвап\nвпвыпвыап\nвп\nвп', '654654', 1474012769, 0),
(165, 0, 0, 0, 0, '', '', 0, 0),
(166, 0, 0, 0, 0, '', '', 0, 0),
(167, 0, 0, 0, 0, '', '', 0, 0),
(168, 0, 0, 0, 0, '', '', 0, 0),
(169, 0, 0, 0, 0, '', '', 0, 0),
(170, 0, 0, 0, 0, '', '', 0, 0),
(171, 0, 0, 0, 0, '', '', 0, 0),
(172, 0, 0, 0, 0, '', '', 0, 0),
(173, 0, 0, 0, 0, '', '', 0, 0),
(174, 0, 0, 0, 0, '', '', 0, 0),
(175, 0, 0, 0, 0, '', '', 0, 0),
(176, 45, 2, 5, 1474290332, 'Вышел из строя выключатель элегазовый....', 'ПС-152', 1474290633, 0),
(177, 137, 2, 2, 1474636388, 'test', 'test', 1474636731, 0),
(178, 133, 2, 4, 1474636864, 'rrrrr', 'rrrr', 1474636878, 0),
(179, 123, 2, 5, 1474636963, 'uu', 'uu', 1474636987, 0),
(180, 122, 2, 2, 1474637261, 'rr', 'rr', 1474637430, 0),
(181, 121, 2, 5, 1474637474, 'g', 'g', 1474637764, 1),
(182, 102, 1, 2, 1474638867, 'yy', 'yy', 1474638886, 0),
(183, 103, 1, 2, 1474809939, '555', '555', 1474809977, 0),
(184, 104, 1, 4, 1474810010, '66', '66', 1474810024, 0),
(185, 101, 1, 5, 1474810045, '77', '77', 1474810059, 0),
(186, 113, 1, 1, 1474810141, '777', '77', 1474810158, 0),
(187, 115, 1, 2, 1474810266, '55', '55', 1474810280, 0),
(188, 97, 1, 2, 1474810427, 'ggg', 'ggg', 1474810451, 0),
(189, 99, 1, 2, 1474811924, '444', '444', 1474811992, 0),
(190, 97, 1, 2, 1474812003, '55', '55', 1474812163, 0),
(191, 107, 1, 1, 1474812908, 'gg', 'gg', 1474812945, 0),
(192, 91, 1, 2, 1474813051, 'gg', 'gg', 1474813065, 0),
(193, 91, 1, 5, 1474813180, 'hhh', 'hhh', 1474813201, 0),
(194, 108, 1, 2, 1474813445, 'bbb', 'bbb', 1474813505, 1),
(195, 4, 1, 4, 1473925200, 'тестовое описание', 'тест', 1474983082, 0),
(196, 19, 3, 1, 1474984639, 'Развалилсо', 'Разидинитель', 1474984711, 0),
(197, 0, 0, 0, 0, '', '', 0, 0),
(198, 4, 1, 2, 1475581184, 'test', 'ntcn', 1475581214, 0),
(199, 9, 1, 5, 1475581214, 'ytrytry', 'tryrt', 1475581240, 0),
(200, 90, 1, 1, 1475646158, '777', '777', 1475646366, 0),
(201, 13, 1, 2, 1475646720, 'hgjhgj', 'jhgj', 1475646826, 0),
(202, 12, 1, 2, 1475646880, '8888', '888', 1475646930, 0),
(203, 14, 1, 2, 1475647499, 'gfdgdfg', 'gfdgdf', 1475647525, 0),
(204, 0, 0, 0, 0, '', '', 0, 0),
(205, 0, 0, 0, 0, '', '', 0, 0),
(206, 0, 0, 0, 0, '', '', 0, 0),
(207, 0, 0, 0, 0, '', '', 0, 0),
(208, 0, 0, 0, 0, '', '', 0, 0),
(209, 0, 0, 0, 0, '', '', 0, 0),
(210, 0, 0, 0, 0, '', '', 0, 0),
(211, 0, 0, 0, 0, '', '', 0, 0),
(212, 0, 0, 0, 0, '', '', 0, 0),
(213, 0, 0, 0, 0, '', '', 0, 0),
(214, 0, 0, 0, 0, '', '', 0, 0),
(215, 0, 0, 0, 0, '', '', 0, 0),
(216, 0, 0, 0, 0, '', '', 0, 0),
(217, 0, 0, 0, 0, '', '', 0, 0),
(218, 0, 0, 0, 0, '', '', 0, 0),
(222, 0, 0, 0, 0, '', '', 0, 0),
(224, 5, 1, 2, 1475270280, '666', '666', 1475658178, 0),
(225, 13, 1, 2, 1473241440, '1111', '111', 1475658266, 0),
(226, 1, 1, 4, 1475528400, '000', '000', 1475659599, 0),
(227, 1, 1, 4, 1475459340, 'tttttt', 'ttttt', 1475659964, 0),
(228, 0, 0, 0, 0, '', '', 0, 0),
(229, 0, 0, 0, 0, '', '', 0, 0),
(231, 142, 1, 2, 1473109200, 'Провисание кабеля', 'Опора №67', 1475737905, 1),
(232, 142, 1, 1, 1473272040, 'тест', 'тест', 1475738403, 0),
(233, 121, 1, 4, 1475302260, 'Нарушение', 'Подстанция', 1475739808, 0),
(234, 68, 1, 2, 1475454780, '11111', 'jjjjjjj', 1475740360, 1),
(235, 8, 1, 1, 1475359980, '0000', 'воскресение', 1475740482, 0),
(236, 8, 1, 1, 1475701200, '999', '999', 1475740720, 0),
(237, 2, 1, 2, 1475802840, '4444', '4444', 1475823439, 0),
(239, 0, 0, 0, 0, '', '', 0, 0),
(240, 0, 0, 0, 0, '', '', 0, 0),
(241, 0, 0, 0, 0, '', '', 0, 0),
(242, 0, 0, 0, 0, '', '', 0, 0),
(243, 0, 0, 0, 0, '', '', 0, 0),
(244, 0, 0, 0, 0, '', '', 0, 0),
(245, 0, 0, 0, 0, '', '', 0, 0),
(247, 0, 0, 0, 0, '', '', 0, 0),
(248, 0, 0, 0, 0, '', '', 0, 0),
(249, 0, 0, 0, 0, '', '', 0, 0),
(250, 0, 0, 0, 0, '', '', 0, 0),
(251, 0, 0, 0, 0, '', '', 0, 0),
(252, 0, 0, 0, 0, '', '', 0, 0),
(253, 0, 0, 0, 0, '', '', 0, 0),
(254, 0, 0, 0, 0, '', '', 0, 0),
(255, 147, 1, 1, 1475787600, 'ffff', 'ff', 1475845337, 0),
(256, 147, 1, 2, 1475787600, '88888', '8888', 1475845912, 0),
(257, 0, 0, 0, 0, '', '', 0, 0),
(258, 0, 0, 0, 0, '', '', 0, 0);

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `attachments`
--
ALTER TABLE `attachments`
  ADD PRIMARY KEY (`ID`);

--
-- Индексы таблицы `divisions`
--
ALTER TABLE `divisions`
  ADD PRIMARY KEY (`ID`);

--
-- Индексы таблицы `esk_groups`
--
ALTER TABLE `esk_groups`
  ADD PRIMARY KEY (`ID`);

--
-- Индексы таблицы `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`ID`);

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`ID`);

--
-- Индексы таблицы `violations`
--
ALTER TABLE `violations`
  ADD PRIMARY KEY (`ID`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `attachments`
--
ALTER TABLE `attachments`
  MODIFY `ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Идентификатор файла', AUTO_INCREMENT=173;
--
-- AUTO_INCREMENT для таблицы `divisions`
--
ALTER TABLE `divisions`
  MODIFY `ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Уникальный ключ', AUTO_INCREMENT=148;
--
-- AUTO_INCREMENT для таблицы `esk_groups`
--
ALTER TABLE `esk_groups`
  MODIFY `ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Идентификатор ЭКС', AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT для таблицы `settings`
--
ALTER TABLE `settings`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT для таблицы `violations`
--
ALTER TABLE `violations`
  MODIFY `ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Идентификатор события', AUTO_INCREMENT=259;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
