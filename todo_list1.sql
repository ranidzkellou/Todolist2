-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: todo_list1
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `basetable`
--

DROP TABLE IF EXISTS `basetable`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `basetable` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `module` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `basetable`
--

LOCK TABLES `basetable` WRITE;
/*!40000 ALTER TABLE `basetable` DISABLE KEYS */;
INSERT INTO `basetable` VALUES (1,'Module Example');
/*!40000 ALTER TABLE `basetable` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Catégorie Exemple'),(2,'Catégorie Exemple');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `folders`
--

DROP TABLE IF EXISTS `folders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `folders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `user_id` int NOT NULL,
  `emoji` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `folders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `folders`
--

LOCK TABLES `folders` WRITE;
/*!40000 ALTER TABLE `folders` DISABLE KEYS */;
INSERT INTO `folders` VALUES (4,'New Folder','This is a new folder','2024-12-21 00:37:37','2024-12-21 00:37:37',1,'?'),(6,'gggggfddfrwfaffa',NULL,'2024-12-21 12:15:19','2024-12-21 12:31:52',10,'?'),(7,'Testfolder',NULL,'2024-12-22 10:14:17','2024-12-22 10:14:17',10,'?'),(8,'new one',NULL,'2024-12-22 11:42:03','2024-12-22 11:42:03',13,'?'),(9,'test',NULL,'2024-12-22 12:41:48','2024-12-22 12:41:48',13,'?'),(10,'afaf',NULL,'2024-12-22 12:42:53','2024-12-22 12:42:53',13,'?');
/*!40000 ALTER TABLE `folders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subtasks`
--

DROP TABLE IF EXISTS `subtasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subtasks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `task_id` int DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `details` text,
  `deadline` datetime DEFAULT NULL,
  `status` enum('pending','in-progress','completed') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `priority` varchar(50) DEFAULT NULL,
  `deadlineTime` time DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `task_id` (`task_id`),
  KEY `idx_subtask_deadline` (`deadline`),
  CONSTRAINT `subtasks_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chk_subtask_priority` CHECK ((`priority` in (_utf8mb4'High',_utf8mb4'Medium',_utf8mb4'Low')))
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subtasks`
--

LOCK TABLES `subtasks` WRITE;
/*!40000 ALTER TABLE `subtasks` DISABLE KEYS */;
INSERT INTO `subtasks` VALUES (8,9,'Nouvelle sous-tâche modifiée','Détails mis à jour','2024-12-20 00:00:00','','2024-12-15 14:14:21','2024-12-15 14:18:48',NULL,NULL),(9,NULL,'Test me ',NULL,NULL,'pending','2024-12-22 10:14:34','2024-12-22 10:14:34','Medium','14:19:00'),(10,NULL,'ADD SUBTASK ',NULL,NULL,'pending','2024-12-22 10:17:50','2024-12-22 10:17:50','Medium','11:22:00'),(11,16,'qwrrqw',NULL,NULL,'pending','2024-12-22 10:20:02','2024-12-22 10:20:02','Medium','11:21:00'),(12,17,'rwrw',NULL,NULL,'pending','2024-12-22 11:44:24','2024-12-22 11:44:24','Medium','12:49:00'),(13,23,'qwrwqr',NULL,NULL,'completed','2024-12-22 13:15:04','2024-12-22 15:05:58','Medium','17:15:00');
/*!40000 ALTER TABLE `subtasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tasks`
--

DROP TABLE IF EXISTS `tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tasks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `details` text,
  `deadline` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `folder_id` int DEFAULT NULL,
  `priority` varchar(50) DEFAULT NULL,
  `deadlineTime` time DEFAULT NULL,
  `categories` json DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `emoji` varchar(10) DEFAULT 0xF09F939D,
  PRIMARY KEY (`id`),
  KEY `fk_folder` (`folder_id`),
  KEY `idx_task_deadline` (`deadline`),
  CONSTRAINT `fk_folder` FOREIGN KEY (`folder_id`) REFERENCES `folders` (`id`) ON DELETE SET NULL,
  CONSTRAINT `chk_task_priority` CHECK ((`priority` in (_utf8mb4'High',_utf8mb4'Medium',_utf8mb4'Low')))
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tasks`
--

LOCK TABLES `tasks` WRITE;
/*!40000 ALTER TABLE `tasks` DISABLE KEYS */;
INSERT INTO `tasks` VALUES (9,'Terminer le rapport','Finaliser le rapport avant la réunion','2024-12-20 00:00:00','2024-12-15 14:12:43','2024-12-15 14:12:43',NULL,NULL,NULL,NULL,NULL,'?'),(13,'test thingwrwrrrr','','2024-12-25 00:00:00','2024-12-21 20:28:43','2024-12-22 09:07:22',6,'Medium','04:28:00',NULL,'pending','?'),(14,'test','twt','2024-12-11 00:00:00','2024-12-22 10:14:34','2024-12-22 10:14:34',7,'Medium','11:16:00',NULL,'pending','?'),(15,'dgdgd','gssgsgsgssgsg','2024-12-28 00:00:00','2024-12-22 10:17:50','2024-12-22 10:17:50',7,'Medium','11:20:00',NULL,'pending','?'),(16,'eerw','werqrqw','2024-12-25 00:00:00','2024-12-22 10:20:02','2024-12-22 10:20:02',6,'Medium','15:19:00',NULL,'pending','?'),(17,'gfhf','dfghgdhd','2024-12-27 00:00:00','2024-12-22 11:44:24','2024-12-22 16:06:30',8,'Medium','15:41:00',NULL,'completed','?'),(18,'qada','eeqqweq','2024-12-11 00:00:00','2024-12-22 12:01:10','2024-12-22 12:01:10',8,'Medium','17:01:00',NULL,'pending','?'),(19,'afafafw','wfqfqffwa','2025-01-03 00:00:00','2024-12-22 12:19:59','2024-12-22 12:19:59',8,'Medium','17:19:00',NULL,'pending','?'),(20,'eqweqeqwe','qqw','2024-12-24 00:00:00','2024-12-22 12:37:07','2024-12-22 12:37:07',8,'Medium','15:36:00',NULL,'pending','?'),(21,'qeqeqqweqeqeeqe3443','qeqw','2024-12-24 00:00:00','2024-12-22 12:43:03','2024-12-22 12:43:03',10,'Medium','17:45:00',NULL,'pending','?'),(22,'wrwr','wrwerw','2024-12-24 18:14:00','2024-12-22 13:14:11','2024-12-22 13:14:11',9,'Medium',NULL,NULL,'pending','?'),(23,'w4twt','wtwtw','2024-12-12 17:14:00','2024-12-22 13:15:04','2024-12-22 14:55:36',9,'Medium',NULL,NULL,'pending','?'),(24,'qeq','qweqw','2024-12-24 17:18:00','2024-12-22 13:18:23','2024-12-22 13:18:23',9,'Medium',NULL,NULL,'pending','?'),(25,'qeq','qeq','2024-12-19 16:20:00','2024-12-22 13:20:57','2024-12-22 13:20:57',9,'Medium',NULL,NULL,'pending','?'),(26,'wrewr','','2024-12-25 14:54:00','2024-12-22 14:51:14','2024-12-22 14:51:14',8,'Medium',NULL,NULL,'pending','?'),(27,'wdqdq','qdqdq','2024-12-24 19:54:00','2024-12-22 14:54:43','2024-12-22 14:54:43',9,'High',NULL,NULL,'pending','?'),(28,'fgd','gsg','2024-12-25 19:58:00','2024-12-22 16:59:01','2024-12-22 16:59:01',9,'High',NULL,NULL,'pending','?');
/*!40000 ALTER TABLE `tasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tasks_category`
--

DROP TABLE IF EXISTS `tasks_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tasks_category` (
  `task_id` int NOT NULL,
  `category_id` int NOT NULL,
  PRIMARY KEY (`task_id`,`category_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `tasks_category_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE,
  CONSTRAINT `tasks_category_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tasks_category`
--

LOCK TABLES `tasks_category` WRITE;
/*!40000 ALTER TABLE `tasks_category` DISABLE KEYS */;
INSERT INTO `tasks_category` VALUES (9,2);
/*!40000 ALTER TABLE `tasks_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `verified` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `token` varchar(255) DEFAULT NULL,
  `emailVerificationToken` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `email_2` (`email`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'john_doe','john@example.com','password123',0,'2024-12-18 15:16:01','2024-12-18 15:16:01','sample_token',NULL,NULL,NULL),(2,'testuser','testuser@example.com','$2b$10$YwaD9fkBqSeegcU0yMzY/eogf0rJlInoEdX/OW1aj9TUkm5QVZiS2',0,'2024-12-20 23:21:30','2024-12-20 23:21:30',NULL,NULL,NULL,NULL),(4,'testuser2','kellour77@gmail.com','$2b$10$Id5uB80jHw7GEmofxRNDS.Vfw.tSI023EcjHtrfk3DpufWfAZ6Foq',0,'2024-12-20 23:23:25','2024-12-20 23:23:25',NULL,NULL,NULL,NULL),(6,'testuser3','kellour6@gmail.com','$2b$10$A1FrzMChDdgTK2BKoq.YCuSSfmjw2lcI60o7n65j86hnvMJA93PCS',0,'2024-12-20 23:47:13','2024-12-20 23:47:13',NULL,'e159530129f60b0c3dc719e54e127a71d023e5d631dd91e1904672c57915ff04',NULL,NULL),(8,'testuser77','kellour4@gmail.com','$2b$10$b738ljgX/x8WAYqopYmHweeCEkYAi2z/4ft6B7sH86NQ.y9gPq2f6',0,'2024-12-20 23:54:59','2024-12-20 23:54:59',NULL,NULL,NULL,NULL),(10,'rani3','kellour7744@gmail.com','$2b$10$tpfW8A8df0bPtatQmNOyHe0gXq9WG/HzIDeNJ7IbWqyo3XbVDvPcW',0,'2024-12-21 05:43:07','2024-12-21 23:49:35',NULL,NULL,'raniadaadadaaadad','kelloudaDasdaDadadaFA'),(12,'Ghani','kellour8@gmail.com','$2b$10$zzrMKOUae3dJBIAqfJh8/.1Drwk/AayG2bvBVfGceaO9BGqt8kxxm',0,'2024-12-22 10:33:42','2024-12-22 10:33:42',NULL,NULL,NULL,NULL),(13,'rani  a','kellour774@gmail.com','$2b$10$jH8hHAs4YAWixRkC17sgGerpoUbAwCUbYKZMvGq2pGhOWstFLWy7y',0,'2024-12-22 11:36:58','2024-12-22 16:52:36',NULL,NULL,NULL,NULL),(14,'erm ','sss@gmail.com','$2b$10$t0KmGK7FH0WzNFiFi4OZJOHtajnY0u8EFngaKVdPkD3lYdB3CG7f2',0,'2024-12-22 17:19:28','2024-12-22 17:19:28',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-22 18:26:27
