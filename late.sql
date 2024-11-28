-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 28, 2024 at 11:26 AM
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
-- Database: `spendapp`
--

-- --------------------------------------------------------

--
-- Table structure for table `bills`
--

CREATE TABLE `bills` (
  `bill_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `payment_date` date NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `recurring` tinyint(1) DEFAULT 0,
  `frequency` varchar(50) DEFAULT NULL,
  `status` enum('paid','unpaid','pending') DEFAULT 'unpaid',
  `budget_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `budget`
--

CREATE TABLE `budget` (
  `budget_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `period` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `category_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `type` enum('income','expense','savings') NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`category_id`, `name`, `description`, `type`, `user_id`, `created_at`) VALUES
(1, 'weekend gig', 'online marketing', 'income', 1, '2024-11-21 09:53:23'),
(2, 'remotask', 'online', 'expense', 1, '2024-11-21 10:22:17'),
(3, 'giving back to society', 'giving', 'expense', 1, '2024-11-21 11:27:18'),
(5, 'street', 'hustle', 'income', 1, '2024-11-26 10:09:31');

-- --------------------------------------------------------

--
-- Table structure for table `debts`
--

CREATE TABLE `debts` (
  `debt_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `balance` decimal(10,2) NOT NULL,
  `due_date` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `interest_rate` decimal(5,2) NOT NULL DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `debt_payments`
--

CREATE TABLE `debt_payments` (
  `payment_id` int(11) NOT NULL,
  `debt_id` int(11) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_date` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `expenses`
--

CREATE TABLE `expenses` (
  `expense_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `type` varchar(50) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `description` text DEFAULT NULL,
  `date` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `category_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `expenses`
--

INSERT INTO `expenses` (`expense_id`, `user_id`, `type`, `amount`, `description`, `date`, `created_at`, `updated_at`, `category_id`) VALUES
(5, 1, 'bills', 5000.00, 'rent', '2024-11-20', '2024-11-20 08:59:43', '2024-11-20 08:59:43', NULL),
(6, 1, 'medication', 6000.00, NULL, '2024-11-05', '2024-11-20 13:07:11', '2024-11-20 13:07:11', NULL),
(7, 1, 'remo', 200.00, 'remo', '2024-11-04', '2024-11-21 10:23:24', '2024-11-21 10:23:24', 2),
(8, 1, 'giving', 500.00, 'giving', '2024-11-14', '2024-11-21 11:28:51', '2024-11-21 11:28:51', 3),
(9, 1, 'change', 300.00, 'street', '2024-11-14', '2024-11-26 10:27:55', '2024-11-26 10:27:55', 3);

-- --------------------------------------------------------

--
-- Table structure for table `income`
--

CREATE TABLE `income` (
  `income_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `type` varchar(50) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `period` varchar(20) NOT NULL,
  `date` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `category_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `income`
--

INSERT INTO `income` (`income_id`, `user_id`, `type`, `amount`, `period`, `date`, `created_at`, `category_id`) VALUES
(1, 1, 'salary', 15000.00, 'monthly', '2024-11-04', '2024-11-20 08:42:06', NULL),
(2, 1, 'salary', 20000.00, 'monthly', '2024-11-05', '2024-11-20 08:53:47', NULL),
(3, 1, 'frelance', 8000.00, 'weekly', '2024-11-05', '2024-11-20 08:54:40', NULL),
(4, 1, 'weekend gigs', 12000.00, 'weekly', '2024-11-09', '2024-11-20 12:58:02', NULL),
(5, 1, 'remo', 200.00, 'daily', '2024-11-07', '2024-11-21 11:25:46', 1),
(6, 1, 'change', 300.00, '2 days', '2024-11-20', '2024-11-26 10:26:50', 5);

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `notification_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `recurring_savings`
--

CREATE TABLE `recurring_savings` (
  `recurring_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `goal_id` int(11) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `frequency` enum('Daily','Weekly','Monthly') NOT NULL,
  `start_date` date DEFAULT curdate(),
  `end_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `savings`
--

CREATE TABLE `savings` (
  `savings_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `goal_id` int(11) DEFAULT NULL,
  `date_added` date DEFAULT curdate()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `saving_goals`
--

CREATE TABLE `saving_goals` (
  `goal_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `target_amount` decimal(10,2) DEFAULT NULL,
  `period` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `saved_amount` int(11) DEFAULT 0,
  `deadline` date DEFAULT curdate(),
  `priority` enum('High','Medium','Low') DEFAULT 'Medium'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `saving_goals`
--

INSERT INTO `saving_goals` (`goal_id`, `user_id`, `name`, `target_amount`, `period`, `created_at`, `saved_amount`, `deadline`, `priority`) VALUES
(1, 1, 'Emergency Fund', 5000.00, NULL, '2024-11-19 09:47:30', 2000, '2024-11-28', 'Medium'),
(11, 2, 'cleaning carpets', 23000.00, NULL, '2024-11-19 10:32:47', 10000, '2024-11-28', 'Medium'),
(12, 2, 'rusinga visit', 45000.00, NULL, '2024-11-19 10:41:08', 0, '2024-11-28', 'Medium'),
(14, 2, 'giving back to society', 50000.00, NULL, '2024-11-19 11:02:28', 0, '2024-11-28', 'Medium'),
(17, 2, 'plant trees', 5000.00, NULL, '2024-11-19 11:05:03', 0, '2024-11-28', 'Medium'),
(18, 2, 'career growth', 20000.00, NULL, '2024-11-19 11:26:59', 0, '2024-11-28', 'Medium');

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `transaction_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `goal_id` int(11) DEFAULT NULL,
  `transaction_type` enum('income','expense','saving') NOT NULL,
  `category` varchar(255) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `transaction_date` date NOT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `email`, `full_name`, `password`, `created_at`, `updated_at`) VALUES
(1, 'test@example.com', 'Test User', 'hashedPasswordHere', '2024-11-12 12:56:54', '2024-11-12 12:56:54'),
(2, 'caleb@gmail.com', 'caleb', '$2b$10$oOch1pCHGkDejKbiVHiGyuHlhn0T5GfiuNHvom4rgdgPTcbaxptKi', '2024-11-14 12:06:41', '2024-11-14 12:06:41'),
(5, 'lewis@gmail.com', 'lewis', '$2b$10$oh0TEQ1p67ABD7gtQHHwKO1zGtq29uC.L5TjmtfXIE/EZkkdwENBy', '2024-11-14 12:10:22', '2024-11-14 12:10:22');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bills`
--
ALTER TABLE `bills`
  ADD PRIMARY KEY (`bill_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `budget_id` (`budget_id`);

--
-- Indexes for table `budget`
--
ALTER TABLE `budget`
  ADD PRIMARY KEY (`budget_id`),
  ADD KEY `fk_user_budget` (`user_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`category_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `debts`
--
ALTER TABLE `debts`
  ADD PRIMARY KEY (`debt_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `debt_payments`
--
ALTER TABLE `debt_payments`
  ADD PRIMARY KEY (`payment_id`),
  ADD KEY `debt_id` (`debt_id`);

--
-- Indexes for table `expenses`
--
ALTER TABLE `expenses`
  ADD PRIMARY KEY (`expense_id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `fk_user_expenses` (`user_id`);

--
-- Indexes for table `income`
--
ALTER TABLE `income`
  ADD PRIMARY KEY (`income_id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `fk_user_income` (`user_id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`notification_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `recurring_savings`
--
ALTER TABLE `recurring_savings`
  ADD PRIMARY KEY (`recurring_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `goal_id` (`goal_id`);

--
-- Indexes for table `savings`
--
ALTER TABLE `savings`
  ADD PRIMARY KEY (`savings_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `goal_id` (`goal_id`);

--
-- Indexes for table `saving_goals`
--
ALTER TABLE `saving_goals`
  ADD PRIMARY KEY (`goal_id`),
  ADD KEY `fk_user_id` (`user_id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`transaction_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `goal_id` (`goal_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bills`
--
ALTER TABLE `bills`
  MODIFY `bill_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `budget`
--
ALTER TABLE `budget`
  MODIFY `budget_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `debts`
--
ALTER TABLE `debts`
  MODIFY `debt_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `debt_payments`
--
ALTER TABLE `debt_payments`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `expenses`
--
ALTER TABLE `expenses`
  MODIFY `expense_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `income`
--
ALTER TABLE `income`
  MODIFY `income_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `notification_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `recurring_savings`
--
ALTER TABLE `recurring_savings`
  MODIFY `recurring_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `savings`
--
ALTER TABLE `savings`
  MODIFY `savings_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `saving_goals`
--
ALTER TABLE `saving_goals`
  MODIFY `goal_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `transaction_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bills`
--
ALTER TABLE `bills`
  ADD CONSTRAINT `bills_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `bills_ibfk_2` FOREIGN KEY (`budget_id`) REFERENCES `budget` (`budget_id`) ON DELETE CASCADE;

--
-- Constraints for table `budget`
--
ALTER TABLE `budget`
  ADD CONSTRAINT `budget_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `fk_user_budget` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `debts`
--
ALTER TABLE `debts`
  ADD CONSTRAINT `debts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `debt_payments`
--
ALTER TABLE `debt_payments`
  ADD CONSTRAINT `debt_payments_ibfk_1` FOREIGN KEY (`debt_id`) REFERENCES `debts` (`debt_id`);

--
-- Constraints for table `expenses`
--
ALTER TABLE `expenses`
  ADD CONSTRAINT `expenses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `expenses_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`),
  ADD CONSTRAINT `fk_user_expenses` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `income`
--
ALTER TABLE `income`
  ADD CONSTRAINT `fk_user_income` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `income_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `income_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`);

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `recurring_savings`
--
ALTER TABLE `recurring_savings`
  ADD CONSTRAINT `recurring_savings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `recurring_savings_ibfk_2` FOREIGN KEY (`goal_id`) REFERENCES `saving_goals` (`goal_id`);

--
-- Constraints for table `savings`
--
ALTER TABLE `savings`
  ADD CONSTRAINT `savings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `savings_ibfk_2` FOREIGN KEY (`goal_id`) REFERENCES `saving_goals` (`goal_id`);

--
-- Constraints for table `saving_goals`
--
ALTER TABLE `saving_goals`
  ADD CONSTRAINT `fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `saving_goals_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `transactions_ibfk_2` FOREIGN KEY (`goal_id`) REFERENCES `saving_goals` (`goal_id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
