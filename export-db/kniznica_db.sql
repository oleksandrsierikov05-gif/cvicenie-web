-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 23, 2026 at 11:10 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `kniznica_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `knihy`
--

CREATE TABLE `knihy` (
  `id` int(11) NOT NULL,
  `nazov` varchar(180) DEFAULT NULL,
  `autor` varchar(120) DEFAULT NULL,
  `rok` int(11) NOT NULL,
  `cena` decimal(10,2) NOT NULL DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `knihy`
--

INSERT INTO `knihy` (`id`, `nazov`, `autor`, `rok`, `cena`) VALUES
(1, 'Duna', 'Herbert', 1966, 73.00),
(2, 'm', 'Bob', 1888, 66.00),
(3, 'K1', 'Bosansky', 2016, 222.00),
(4, 'Kobzar', 'Taras Shevchenko', 1840, 0.00),
(5, 'Hobbit', 'J. R. R. Tolkien', 1937, 0.00);

-- --------------------------------------------------------

--
-- Table structure for table `pouzivatelia`
--

CREATE TABLE `pouzivatelia` (
  `id` int(11) NOT NULL,
  `meno` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `heslo_hash` varchar(255) NOT NULL,
  `vytvoreny` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pouzivatelia`
--

INSERT INTO `pouzivatelia` (`id`, `meno`, `email`, `heslo_hash`, `vytvoreny`) VALUES
(1, 'Vlad Lakusta', 'R234234@gmail.com', '$2b$10$iOw0Fjb4dVCHQFDiF9JpruuG4BPj14GGZixvNOQ19GoxwM6mjMa8O', '2026-11-23 09:49:42'),
(2, 'Jozef Tra', 'jf@gmail.com', '$2b$10$AmGr41dcI7hV3OkqHVPx1uOnW0l7g9rqy3MRY/Y2zmMUjSXCZWsru', '2026-11-23 09:51:29');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `knihy`
--
ALTER TABLE `knihy`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pouzivatelia`
--
ALTER TABLE `pouzivatelia`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `knihy`
--
ALTER TABLE `knihy`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `pouzivatelia`
--
ALTER TABLE `pouzivatelia`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
