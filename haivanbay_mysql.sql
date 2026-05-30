-- MySQL dump 10.13  Distrib 8.4.9, for Linux (x86_64)
--
-- Host: localhost    Database: haivanbay
-- ------------------------------------------------------
-- Server version	8.4.9

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `ai_conversations`
--

DROP TABLE IF EXISTS `ai_conversations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ai_conversations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `project_id` bigint NOT NULL,
  `customer_id` bigint DEFAULT NULL,
  `lead_id` bigint DEFAULT NULL,
  `analytics_session_id` bigint DEFAULT NULL,
  `channel_code` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'web_chat',
  `provider_code` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'gemini_live',
  `language_code` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `started_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ended_at` datetime DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_ai_conversations_project_started` (`project_id`,`started_at`),
  KEY `ai_conversations_analytics_session_id_fkey` (`analytics_session_id`),
  KEY `ai_conversations_customer_id_fkey` (`customer_id`),
  KEY `ai_conversations_lead_id_fkey` (`lead_id`),
  CONSTRAINT `ai_conversations_analytics_session_id_fkey` FOREIGN KEY (`analytics_session_id`) REFERENCES `analytics_sessions` (`id`) ON DELETE SET NULL,
  CONSTRAINT `ai_conversations_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL,
  CONSTRAINT `ai_conversations_lead_id_fkey` FOREIGN KEY (`lead_id`) REFERENCES `leads` (`id`) ON DELETE SET NULL,
  CONSTRAINT `ai_conversations_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ai_conversations`
--

/*!40000 ALTER TABLE `ai_conversations` DISABLE KEYS */;
/*!40000 ALTER TABLE `ai_conversations` ENABLE KEYS */;

--
-- Table structure for table `ai_live_events`
--

DROP TABLE IF EXISTS `ai_live_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ai_live_events` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `ai_live_session_id` bigint NOT NULL,
  `event_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role_code` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `transcript_text` text COLLATE utf8mb4_unicode_ci,
  `audio_url` text COLLATE utf8mb4_unicode_ci,
  `payload` json DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_ai_live_events_session_created` (`ai_live_session_id`,`created_at`),
  CONSTRAINT `ai_live_events_ai_live_session_id_fkey` FOREIGN KEY (`ai_live_session_id`) REFERENCES `ai_live_sessions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ai_live_events`
--

/*!40000 ALTER TABLE `ai_live_events` DISABLE KEYS */;
/*!40000 ALTER TABLE `ai_live_events` ENABLE KEYS */;

--
-- Table structure for table `ai_live_sessions`
--

DROP TABLE IF EXISTS `ai_live_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ai_live_sessions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `conversation_id` bigint NOT NULL,
  `websocket_session_key` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ws_url` text COLLATE utf8mb4_unicode_ci,
  `current_panorama_id` bigint DEFAULT NULL,
  `current_scene_id` bigint DEFAULT NULL,
  `mic_started_at` datetime DEFAULT NULL,
  `mic_stopped_at` datetime DEFAULT NULL,
  `connected_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `disconnected_at` datetime DEFAULT NULL,
  `close_reason` text COLLATE utf8mb4_unicode_ci,
  `metadata` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ai_live_sessions_conversation_id_fkey` (`conversation_id`),
  KEY `ai_live_sessions_current_panorama_id_fkey` (`current_panorama_id`),
  KEY `ai_live_sessions_current_scene_id_fkey` (`current_scene_id`),
  CONSTRAINT `ai_live_sessions_conversation_id_fkey` FOREIGN KEY (`conversation_id`) REFERENCES `ai_conversations` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ai_live_sessions_current_panorama_id_fkey` FOREIGN KEY (`current_panorama_id`) REFERENCES `panorama_assets` (`id`) ON DELETE SET NULL,
  CONSTRAINT `ai_live_sessions_current_scene_id_fkey` FOREIGN KEY (`current_scene_id`) REFERENCES `vr_scenes` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ai_live_sessions`
--

/*!40000 ALTER TABLE `ai_live_sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `ai_live_sessions` ENABLE KEYS */;

--
-- Table structure for table `ai_messages`
--

DROP TABLE IF EXISTS `ai_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ai_messages` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `conversation_id` bigint NOT NULL,
  `sender_type` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message_mode` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'text',
  `message_text` text COLLATE utf8mb4_unicode_ci,
  `audio_url` text COLLATE utf8mb4_unicode_ci,
  `transcript_text` text COLLATE utf8mb4_unicode_ci,
  `metadata` json DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_ai_messages_conversation_created` (`conversation_id`,`created_at`),
  CONSTRAINT `ai_messages_conversation_id_fkey` FOREIGN KEY (`conversation_id`) REFERENCES `ai_conversations` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ai_messages_chk_1` CHECK ((`message_mode` in (_utf8mb4'text',_utf8mb4'voice',_utf8mb4'event'))),
  CONSTRAINT `ai_messages_chk_2` CHECK ((`sender_type` in (_utf8mb4'user',_utf8mb4'assistant',_utf8mb4'system')))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ai_messages`
--

/*!40000 ALTER TABLE `ai_messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `ai_messages` ENABLE KEYS */;

--
-- Table structure for table `amenities`
--

DROP TABLE IF EXISTS `amenities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `amenities` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `project_id` bigint NOT NULL,
  `amenity_category_id` bigint DEFAULT NULL,
  `icon_code` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `is_featured` tinyint(1) NOT NULL DEFAULT '0',
  `sort_order` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `idx_amenities_project_category_sort` (`project_id`,`amenity_category_id`,`sort_order`),
  KEY `amenities_amenity_category_id_fkey` (`amenity_category_id`),
  CONSTRAINT `amenities_amenity_category_id_fkey` FOREIGN KEY (`amenity_category_id`) REFERENCES `amenity_categories` (`id`) ON DELETE SET NULL,
  CONSTRAINT `amenities_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `amenities`
--

/*!40000 ALTER TABLE `amenities` DISABLE KEYS */;
/*!40000 ALTER TABLE `amenities` ENABLE KEYS */;

--
-- Table structure for table `amenity_categories`
--

DROP TABLE IF EXISTS `amenity_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `amenity_categories` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `project_id` bigint NOT NULL,
  `code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `amenity_categories_project_id_code_key` (`project_id`,`code`),
  CONSTRAINT `amenity_categories_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `amenity_categories`
--

/*!40000 ALTER TABLE `amenity_categories` DISABLE KEYS */;
/*!40000 ALTER TABLE `amenity_categories` ENABLE KEYS */;

--
-- Table structure for table `analytics_events`
--

DROP TABLE IF EXISTS `analytics_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `analytics_events` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `project_id` bigint NOT NULL,
  `session_id` bigint DEFAULT NULL,
  `customer_id` bigint DEFAULT NULL,
  `lead_id` bigint DEFAULT NULL,
  `panorama_id` bigint DEFAULT NULL,
  `scene_id` bigint DEFAULT NULL,
  `menu_item_id` bigint DEFAULT NULL,
  `event_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `event_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `payload` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_analytics_events_project_event_time` (`project_id`,`event_name`,`event_at`),
  KEY `analytics_events_customer_id_fkey` (`customer_id`),
  KEY `analytics_events_lead_id_fkey` (`lead_id`),
  KEY `analytics_events_menu_item_id_fkey` (`menu_item_id`),
  KEY `analytics_events_panorama_id_fkey` (`panorama_id`),
  KEY `analytics_events_scene_id_fkey` (`scene_id`),
  KEY `analytics_events_session_id_fkey` (`session_id`),
  CONSTRAINT `analytics_events_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL,
  CONSTRAINT `analytics_events_lead_id_fkey` FOREIGN KEY (`lead_id`) REFERENCES `leads` (`id`) ON DELETE SET NULL,
  CONSTRAINT `analytics_events_menu_item_id_fkey` FOREIGN KEY (`menu_item_id`) REFERENCES `menu_items` (`id`) ON DELETE SET NULL,
  CONSTRAINT `analytics_events_panorama_id_fkey` FOREIGN KEY (`panorama_id`) REFERENCES `panorama_assets` (`id`) ON DELETE SET NULL,
  CONSTRAINT `analytics_events_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `analytics_events_scene_id_fkey` FOREIGN KEY (`scene_id`) REFERENCES `vr_scenes` (`id`) ON DELETE SET NULL,
  CONSTRAINT `analytics_events_session_id_fkey` FOREIGN KEY (`session_id`) REFERENCES `analytics_sessions` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `analytics_events`
--

/*!40000 ALTER TABLE `analytics_events` DISABLE KEYS */;
/*!40000 ALTER TABLE `analytics_events` ENABLE KEYS */;

--
-- Table structure for table `analytics_sessions`
--

DROP TABLE IF EXISTS `analytics_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `analytics_sessions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `project_id` bigint NOT NULL,
  `customer_id` bigint DEFAULT NULL,
  `lead_id` bigint DEFAULT NULL,
  `sales_public_link_id` bigint DEFAULT NULL,
  `device_type` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `browser_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `language_code` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `referrer_url` text COLLATE utf8mb4_unicode_ci,
  `utm_source` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `utm_medium` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `utm_campaign` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `started_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ended_at` datetime DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_analytics_sessions_project_started` (`project_id`,`started_at`),
  KEY `analytics_sessions_customer_id_fkey` (`customer_id`),
  KEY `analytics_sessions_lead_id_fkey` (`lead_id`),
  KEY `analytics_sessions_sales_public_link_id_fkey` (`sales_public_link_id`),
  CONSTRAINT `analytics_sessions_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL,
  CONSTRAINT `analytics_sessions_lead_id_fkey` FOREIGN KEY (`lead_id`) REFERENCES `leads` (`id`) ON DELETE SET NULL,
  CONSTRAINT `analytics_sessions_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `analytics_sessions_sales_public_link_id_fkey` FOREIGN KEY (`sales_public_link_id`) REFERENCES `sales_public_links` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `analytics_sessions`
--

/*!40000 ALTER TABLE `analytics_sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `analytics_sessions` ENABLE KEYS */;

--
-- Table structure for table `appointments`
--

DROP TABLE IF EXISTS `appointments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appointments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `project_id` bigint NOT NULL,
  `lead_id` bigint DEFAULT NULL,
  `customer_id` bigint NOT NULL,
  `assigned_user_id` bigint DEFAULT NULL,
  `appointment_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `appointment_location` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `start_at` datetime NOT NULL,
  `end_at` datetime DEFAULT NULL,
  `status_code` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_by_user_id` bigint DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_appointments_project_start` (`project_id`,`start_at`),
  KEY `appointments_assigned_user_id_fkey` (`assigned_user_id`),
  KEY `appointments_created_by_user_id_fkey` (`created_by_user_id`),
  KEY `appointments_customer_id_fkey` (`customer_id`),
  KEY `appointments_lead_id_fkey` (`lead_id`),
  CONSTRAINT `appointments_assigned_user_id_fkey` FOREIGN KEY (`assigned_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `appointments_created_by_user_id_fkey` FOREIGN KEY (`created_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `appointments_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  CONSTRAINT `appointments_lead_id_fkey` FOREIGN KEY (`lead_id`) REFERENCES `leads` (`id`) ON DELETE SET NULL,
  CONSTRAINT `appointments_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `appointments_chk_1` CHECK ((`status_code` in (_utf8mb4'pending',_utf8mb4'confirmed',_utf8mb4'completed',_utf8mb4'cancelled',_utf8mb4'no_show')))
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointments`
--

/*!40000 ALTER TABLE `appointments` DISABLE KEYS */;
INSERT INTO `appointments` VALUES (1,1,1,1,1,'site_visit',NULL,'0000-00-00 00:00:00',NULL,'pending',NULL,NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00'),(2,1,2,2,1,'site_visit',NULL,'0000-00-00 00:00:00',NULL,'pending',NULL,NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00'),(3,1,4,5,1,'site_visit',NULL,'0000-00-00 00:00:00',NULL,'pending',NULL,NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00'),(4,1,5,6,1,'site_visit',NULL,'0000-00-00 00:00:00',NULL,'pending',NULL,NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00'),(5,1,7,9,1,'site_visit',NULL,'0000-00-00 00:00:00',NULL,'pending',NULL,NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00'),(6,1,8,10,1,'site_visit',NULL,'0000-00-00 00:00:00',NULL,'pending',NULL,NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00'),(7,1,10,13,1,'site_visit',NULL,'0000-00-00 00:00:00',NULL,'pending',NULL,NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00'),(8,1,11,14,1,'site_visit',NULL,'0000-00-00 00:00:00',NULL,'pending',NULL,NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00');
/*!40000 ALTER TABLE `appointments` ENABLE KEYS */;

--
-- Table structure for table `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_logs` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `actor_user_id` bigint DEFAULT NULL,
  `entity_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `entity_id` bigint DEFAULT NULL,
  `action_code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `old_data` json DEFAULT NULL,
  `new_data` json DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_audit_logs_actor_created` (`actor_user_id`,`created_at`),
  CONSTRAINT `audit_logs_actor_user_id_fkey` FOREIGN KEY (`actor_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_logs`
--

/*!40000 ALTER TABLE `audit_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `audit_logs` ENABLE KEYS */;

--
-- Table structure for table `auth_sessions`
--

DROP TABLE IF EXISTS `auth_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_sessions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `session_token_hash` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `started_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` datetime NOT NULL,
  `revoked_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_sessions_session_token_hash_key` (`session_token_hash`(255)),
  KEY `auth_sessions_user_id_fkey` (`user_id`),
  CONSTRAINT `auth_sessions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_sessions`
--

/*!40000 ALTER TABLE `auth_sessions` DISABLE KEYS */;
INSERT INTO `auth_sessions` VALUES (1,1,'1464d6e36c86b8f7315a660e0b60046d62add7150b3a4141e277a87a68ce7661','::1','node','0000-00-00 00:00:00','0000-00-00 00:00:00',NULL),(2,22,'4afa4dfdbab4fd1d9a842febbe049ca155b77233387f10c41b7a8c7f29e25b0d','::1','node','0000-00-00 00:00:00','0000-00-00 00:00:00',NULL),(3,21,'7b3d3adde87acb28cc5cdac6b4ccf75d60a6d218a57e0ed85cbcb219fc212f9c','::1','node','0000-00-00 00:00:00','0000-00-00 00:00:00',NULL),(4,22,'964535a138bad8797392170f5f81aee88afe22afb257bfd6b2d54a59f31e9b6e','::1','node','0000-00-00 00:00:00','0000-00-00 00:00:00',NULL),(6,1,'e8585784ce6585cc958ef7be4645991a70614d31e6417a05417985829dbb1e6f','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','0000-00-00 00:00:00','0000-00-00 00:00:00','0000-00-00 00:00:00'),(7,22,'521d4e5b98c31282c2155155c42127ad0c6273710a3bca55519c0d568d345855','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','0000-00-00 00:00:00','0000-00-00 00:00:00','0000-00-00 00:00:00'),(8,22,'90f5e075e60825a080df45392b4fa81fd344999cd003e669507b7f95968339dd','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','0000-00-00 00:00:00','0000-00-00 00:00:00','0000-00-00 00:00:00'),(9,22,'c071c8631b09b10b3cbbf74a768fef3801502da3684f5c41ea8a1f701c2bf1c4','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','0000-00-00 00:00:00','0000-00-00 00:00:00','0000-00-00 00:00:00'),(10,22,'5d413e0df18a4bbb226b1c2338c362bc31937d5e642ca851df7f2b266aad64f1','::1','node','0000-00-00 00:00:00','0000-00-00 00:00:00',NULL),(11,2,'fc4357aa554bda4de45692cd3293b0ef4ebcff11aa67c44184400efee2365157','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','0000-00-00 00:00:00','0000-00-00 00:00:00','0000-00-00 00:00:00'),(12,22,'801536f79fae290ddf04bdbb78e62488a8448a7f4c68495af3f74dad1030241f','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','0000-00-00 00:00:00','0000-00-00 00:00:00','0000-00-00 00:00:00'),(13,21,'1f9661b190ccb1ba8ef28cacf20a0781dbb34ad0a4d4f80978e75dec79dda81d','::1','Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36','2026-05-25 02:29:12','2026-05-25 21:29:13',NULL),(14,21,'b4d029421662ba0cf976a03d93aec5a912b4799938cefba6222f45f740901527','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-26 02:22:46','2026-05-26 21:22:47',NULL),(15,21,'a03c0f74af84fb6528aba62a9f43bfedf99753d8f0b28cd965fc1c919e44c1a8','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-26 06:18:38','2026-05-27 01:18:38',NULL),(16,21,'bb1232b44792c29c48c5464c1dd6955d1c9f1252f6fd91ff4c202470a14e2588','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-26 07:33:52','2026-05-27 02:33:52','2026-05-26 08:19:43'),(17,21,'76b697efba4c80397cc41ac86703b5b821f04fdb529803ea3ff4996ba67fea2b','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-26 08:12:11','2026-05-27 03:12:12',NULL),(18,21,'bcd8f137c180322774da7b6996bf80cac2fea24834587b9ef1319229a8560e9a','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-26 08:19:45','2026-05-27 03:19:45',NULL),(19,22,'969decad767b4838a124c94a655c2822eca25a4c72e5f95021db7700586d446e','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-05-26 08:20:54','2026-05-27 03:20:55',NULL),(20,21,'733df06b5a0b91332598b982df0f0fc540a748832f99e05ef2ae3a15288cd3d8','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-26 08:21:47','2026-05-27 03:21:48',NULL),(21,21,'2dacd18e4ffd41fde63a733fa3994cfeaeb854c0a4d862a99f0d5fc40030d396','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-27 02:19:53','2026-05-27 21:19:53','2026-05-27 04:37:19'),(22,1,'c491af1eb237745280f3b0f24b8488473a9b01e20faef7bf51f866befbc64b1a','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-27 04:37:26','2026-05-27 23:37:26','2026-05-27 07:01:21'),(23,22,'515c87b94659711a702b7633e616a6c062fa4a8462b5dca74d9765c991a0ae21','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-27 07:01:36','2026-05-28 02:01:37','2026-05-27 07:26:17'),(24,1,'a4646677cacd3a92c60f588cff04df78d83719f996c667401e974d6ae974b748','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-27 07:26:20','2026-05-28 02:26:20','2026-05-27 07:26:59');
/*!40000 ALTER TABLE `auth_sessions` ENABLE KEYS */;

--
-- Table structure for table `construction_milestones`
--

DROP TABLE IF EXISTS `construction_milestones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `construction_milestones` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `project_id` bigint NOT NULL,
  `subdivision_code` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phase_name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `milestone_date` date DEFAULT NULL,
  `milestone_date_text` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status_code` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `progress_image_url` text COLLATE utf8mb4_unicode_ci,
  `sort_order` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_construction_milestones_project_sort` (`project_id`,`sort_order`),
  CONSTRAINT `construction_milestones_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `construction_milestones_chk_1` CHECK ((`status_code` in (_utf8mb4'done',_utf8mb4'active',_utf8mb4'upcoming')))
) ENGINE=InnoDB AUTO_INCREMENT=202 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `construction_milestones`
--

/*!40000 ALTER TABLE `construction_milestones` DISABLE KEYS */;
INSERT INTO `construction_milestones` VALUES (194,1,'pk-bach-van','Khởi công',NULL,'Q1 / 2024','done','Lễ khởi công tháp A & B với sự tham dự của UBND Hà Nội. Hoàn thành ép cọc móng cọc khoan nhồi D800.',NULL,0),(195,1,'pk-bach-van','Mở bán GĐ 2',NULL,'Q2 / 2026','active','Ra mắt 312 căn giai đoạn 2 với ưu đãi chiết khấu 8% và cam kết thuê lại 7%/năm.',NULL,1),(196,1,'pk-vinh-may','Hoàn thiện phần ngầm',NULL,'Q3 / 2024','done','Thi công 5 tầng hầm, hệ thống kết cấu móng bè, hoàn thiện tầng kỹ thuật B1.',NULL,0),(197,1,'pk-vinh-may','Hoàn thiện ngoại thất',NULL,'Q1 / 2027','upcoming','Lắp dựng mặt dựng kính Low-E, ốp đá granite ngoại thất, hoàn thiện sảnh tầng 1.',NULL,1),(198,1,'pk-dao-ngoc','Thi công thân tháp A',NULL,'Q4 / 2024','done','Đổ sàn từ tầng 1 đến tầng 20 đúng tiến độ. Lắp đặt hệ thống cơ điện ngầm.',NULL,0),(199,1,'pk-dao-ngoc','Nghiệm thu & PCCC',NULL,'Q2 / 2027','upcoming','Kiểm tra nghiệm thu hệ thống PCCC, thang máy, điện nước toàn tòa. Cấp giấy chứng nhận đủ điều kiện.',NULL,1),(200,1,'pk-tinh-van','Cất nóc tháp A & B',NULL,'Q2 / 2026','done','Hoàn thành kết cấu 42 tầng tháp A và 38 tầng tháp B. Đây là mốc quan trọng nhất của dự án.',NULL,0),(201,1,'pk-tinh-van','Bàn giao tháp A',NULL,'Q4 / 2027','upcoming','Bàn giao toàn bộ 920 căn tháp A kèm sổ hồng dự kiến cấp Q2/2028.',NULL,1);
/*!40000 ALTER TABLE `construction_milestones` ENABLE KEYS */;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `full_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `zalo_phone` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `facebook_url` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES (1,'Vũ Thị Giang','0901234567',NULL,NULL,NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00'),(2,'Nguyễn Văn An','0902345678',NULL,NULL,NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00'),(3,'Trần Thị Bình','0903456789',NULL,NULL,NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00'),(4,'Lê Hoàng Cường','0904567890',NULL,NULL,NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00'),(5,'Vũ Thị Giang','0901234567',NULL,NULL,NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00'),(6,'Nguyễn Văn An','0902345678',NULL,NULL,NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00'),(7,'Trần Thị Bình','0903456789',NULL,NULL,NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00'),(8,'Lê Hoàng Cường','0904567890',NULL,NULL,NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00'),(9,'Vũ Thị Giang','0901234567',NULL,NULL,NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00'),(10,'Nguyễn Văn An','0902345678',NULL,NULL,NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00'),(11,'Trần Thị Bình','0903456789',NULL,NULL,NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00'),(12,'Lê Hoàng Cường','0904567890',NULL,NULL,NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00'),(13,'Vũ Thị Giang','0901234567',NULL,NULL,NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00'),(14,'Nguyễn Văn An','0902345678',NULL,NULL,NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00'),(15,'Trần Thị Bình','0903456789',NULL,NULL,NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00'),(16,'Lê Hoàng Cường','0904567890',NULL,NULL,NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00'),(17,'Khách A','0900000001',NULL,NULL,NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00'),(18,'KháchRR0','090111000',NULL,NULL,NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00'),(19,'KháchRR1','090111001',NULL,NULL,NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00'),(20,'KháchRR2','090111002',NULL,NULL,NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00'),(21,'KháchRR3','090111003',NULL,NULL,NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00'),(22,'A','0123456789','A@gmail.com','0123456789',NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00');
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;

--
-- Table structure for table `entity_translations`
--

DROP TABLE IF EXISTS `entity_translations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `entity_translations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `entity_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `entity_id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `field_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `language_id` bigint NOT NULL,
  `text_value` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_ent` (`entity_type`,`entity_id`,`field_name`,`language_id`),
  KEY `ix_ent_lookup` (`entity_type`,`entity_id`),
  KEY `fk_ent_lang` (`language_id`),
  CONSTRAINT `fk_ent_lang` FOREIGN KEY (`language_id`) REFERENCES `languages` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `entity_translations`
--

/*!40000 ALTER TABLE `entity_translations` DISABLE KEYS */;
/*!40000 ALTER TABLE `entity_translations` ENABLE KEYS */;

--
-- Table structure for table `floors`
--

DROP TABLE IF EXISTS `floors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `floors` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `tower_id` bigint NOT NULL,
  `floor_number` int NOT NULL,
  `floor_label` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `floors_tower_id_floor_number_key` (`tower_id`,`floor_number`),
  CONSTRAINT `floors_tower_id_fkey` FOREIGN KEY (`tower_id`) REFERENCES `towers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `floors`
--

/*!40000 ALTER TABLE `floors` DISABLE KEYS */;
/*!40000 ALTER TABLE `floors` ENABLE KEYS */;

--
-- Table structure for table `gallery_folders`
--

DROP TABLE IF EXISTS `gallery_folders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gallery_folders` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `project_id` bigint NOT NULL,
  `folder_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `media_scope` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'mixed',
  `sort_order` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `gallery_folders_project_id_folder_name_key` (`project_id`,`folder_name`),
  CONSTRAINT `gallery_folders_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `gallery_folders_chk_1` CHECK ((`media_scope` in (_utf8mb4'image',_utf8mb4'video',_utf8mb4'mixed')))
) ENGINE=InnoDB AUTO_INCREMENT=203 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gallery_folders`
--

/*!40000 ALTER TABLE `gallery_folders` DISABLE KEYS */;
INSERT INTO `gallery_folders` VALUES (193,1,'Tổng quan','mixed',0),(194,1,'PK Bạch Vân','mixed',1),(195,1,'PK Đảo Ngọc','mixed',2),(196,1,'PK Tinh Vân','mixed',3),(197,1,'PK Vịnh Mây','mixed',4),(198,1,'TVC','mixed',5),(199,1,'Mood Film','mixed',6),(200,1,'Phân tích giá trị','mixed',7),(201,1,'Vị trí & thị trường','mixed',8),(202,1,'Thị trường','mixed',9);
/*!40000 ALTER TABLE `gallery_folders` ENABLE KEYS */;

--
-- Table structure for table `gallery_items`
--

DROP TABLE IF EXISTS `gallery_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gallery_items` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `project_id` bigint NOT NULL,
  `gallery_folder_id` bigint DEFAULT NULL,
  `subdivision_code` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `scene_id` bigint DEFAULT NULL,
  `media_type` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `source_provider` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'external',
  `title` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `source_url` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `poster_url` text COLLATE utf8mb4_unicode_ci,
  `sort_order` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `metadata` json DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_gallery_items_project_sort` (`project_id`,`sort_order`),
  KEY `gallery_items_gallery_folder_id_fkey` (`gallery_folder_id`),
  KEY `gallery_items_scene_id_fkey` (`scene_id`),
  CONSTRAINT `gallery_items_gallery_folder_id_fkey` FOREIGN KEY (`gallery_folder_id`) REFERENCES `gallery_folders` (`id`) ON DELETE SET NULL,
  CONSTRAINT `gallery_items_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `gallery_items_scene_id_fkey` FOREIGN KEY (`scene_id`) REFERENCES `vr_scenes` (`id`) ON DELETE SET NULL,
  CONSTRAINT `gallery_items_chk_1` CHECK ((`source_provider` in (_utf8mb4'local',_utf8mb4'drive',_utf8mb4'youtube',_utf8mb4'vimeo',_utf8mb4'upload',_utf8mb4'mp4',_utf8mb4'webm',_utf8mb4'external'))),
  CONSTRAINT `gallery_items_chk_2` CHECK ((`media_type` in (_utf8mb4'image',_utf8mb4'video')))
) ENGINE=InnoDB AUTO_INCREMENT=298 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gallery_items`
--

/*!40000 ALTER TABLE `gallery_items` DISABLE KEYS */;
INSERT INTO `gallery_items` VALUES (283,1,193,NULL,NULL,'image','external','Mặt bằng tổng thể Hai Van Bay','img/TBM/TMB-OVERVIEW-VHLV/30032026-MB TONG HAI VAN BAY - PREVIEW-02.jpg','img/TBM/_thumbs/30032026-MB TONG HAI VAN BAY -_853cec018c.jpg',0,1,'{\"thumb\": \"img/TBM/_thumbs/30032026-MB TONG HAI VAN BAY -_853cec018c.jpg\"}','2026-05-27 04:28:03'),(284,1,194,'pk-bach-van',NULL,'image','external','Mặt bằng Bạch Vân','img/TBM/PK BẠCH VÂN/TMB BẠCH VÂN.jpg','img/TBM/_thumbs/TMB BẠCH VÂN_563994d411.jpg',1,1,'{\"thumb\": \"img/TBM/_thumbs/TMB BẠCH VÂN_563994d411.jpg\"}','2026-05-27 04:28:03'),(285,1,194,'pk-bach-van',NULL,'image','external','Mặt bằng chi tiết Bạch Vân','img/TBM/PK BẠCH VÂN/2403-FULL-BACH VAN .jpg','img/TBM/_thumbs/2403-FULL-BACH VAN _943059a63b.jpg',2,1,'{\"thumb\": \"img/TBM/_thumbs/2403-FULL-BACH VAN _943059a63b.jpg\"}','2026-05-27 04:28:03'),(286,1,194,'pk-bach-van',NULL,'image','external','Phối cảnh Bạch Vân','img/TBM/PK BẠCH VÂN/bACHvAN.jpg','img/TBM/_thumbs/bACHvAN_9419a115f6.jpg',3,1,'{\"thumb\": \"img/TBM/_thumbs/bACHvAN_9419a115f6.jpg\"}','2026-05-27 04:28:03'),(287,1,194,'pk-bach-van',NULL,'image','external','Mặt bằng Làng Vân','img/TBM/PK BẠCH VÂN/TMB LÀNG VÂN.jpg','img/TBM/_thumbs/TMB LÀNG VÂN_d9ced65047.jpg',4,1,'{\"thumb\": \"img/TBM/_thumbs/TMB LÀNG VÂN_d9ced65047.jpg\"}','2026-05-27 04:28:03'),(288,1,194,'pk-bach-van',NULL,'image','external','Tiện ích khu Bạch Vân','img/TBM/PK BẠCH VÂN/TMB-ALLIN-TIENTICH- BACH VAN-01.jpg','img/TBM/_thumbs/TMB-ALLIN-TIENTICH- BACH VAN-0_ae693a7fc1.jpg',5,1,'{\"thumb\": \"img/TBM/_thumbs/TMB-ALLIN-TIENTICH- BACH VAN-0_ae693a7fc1.jpg\"}','2026-05-27 04:28:03'),(289,1,195,'pk-dao-ngoc',NULL,'image','external','Mặt bằng Đảo Ngọc','img/TBM/PK ĐẢO NGỌC/CUT-TMB-DAONGOC-VHLV.jpg','img/TBM/_thumbs/CUT-TMB-DAONGOC-VHLV_3c984368ee.jpg',6,1,'{\"thumb\": \"img/TBM/_thumbs/CUT-TMB-DAONGOC-VHLV_3c984368ee.jpg\"}','2026-05-27 04:28:03'),(290,1,196,'pk-tinh-van',NULL,'image','external','Mặt bằng Tinh Vân','img/TBM/PK TINH VÂN/CUT-TMB-TINHVAN-VHLV.JPG','img/TBM/_thumbs/CUT-TMB-TINHVAN-VHLV_4514f3afca.jpg',7,1,'{\"thumb\": \"img/TBM/_thumbs/CUT-TMB-TINHVAN-VHLV_4514f3afca.jpg\"}','2026-05-27 04:28:03'),(291,1,197,'pk-vinh-may',NULL,'image','external','Mặt bằng Vịnh Mây','img/TBM/PK VỊNH MÂY/CUT-TMB-VINHMAY-VHLV.jpg','img/TBM/_thumbs/CUT-TMB-VINHMAY-VHLV_448f467bee.jpg',8,1,'{\"thumb\": \"img/TBM/_thumbs/CUT-TMB-VINHMAY-VHLV_448f467bee.jpg\"}','2026-05-27 04:28:03'),(292,1,198,NULL,NULL,'video','drive','TVC tổng dự án','https://drive.google.com/drive/folders/1OGSwVrNAKoWzFNx2OtEI0MZcJiJPtFVq',NULL,9,1,'{\"thumb\": null}','2026-05-27 04:28:03'),(293,1,199,NULL,NULL,'video','drive','Phim mood tổng dự án','https://drive.google.com/drive/folders/1ZzEyImCqOdHKn5yp6HzWIkTD9HezvdgY',NULL,10,1,'{\"thumb\": null}','2026-05-27 04:28:03'),(294,1,199,NULL,NULL,'video','drive','Phim mood Bạch Vân','https://drive.google.com/drive/folders/1FbkyzaHQLMXSgN5HpC8RXSwBRztGUOdK',NULL,11,1,'{\"thumb\": null}','2026-05-27 04:28:03'),(295,1,200,NULL,NULL,'video','drive','Phim FTZ phân tích giá trị','https://drive.google.com/drive/folders/1jn66TIYpF3M1XBA6QjMXCD-qlMXcWfNF',NULL,12,1,'{\"thumb\": null}','2026-05-27 04:28:03'),(296,1,201,NULL,NULL,'video','drive','Phim vị trí & thị trường','https://drive.google.com/drive/folders/1Ku3ryWPXYxvcWNXsIs2j0PPRYycNnS46',NULL,13,1,'{\"thumb\": null}','2026-05-27 04:28:03'),(297,1,202,NULL,NULL,'video','drive','Chuỗi clip thị trường','https://drive.google.com/drive/folders/10z8i_JEHAzmvdSBWJ5iJVGKiOEtdnzdD',NULL,14,1,'{\"thumb\": null}','2026-05-27 04:28:03');
/*!40000 ALTER TABLE `gallery_items` ENABLE KEYS */;

--
-- Table structure for table `key_visual_groups`
--

DROP TABLE IF EXISTS `key_visual_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `key_visual_groups` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `project_id` bigint NOT NULL,
  `code` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `key_visual_groups_project_id_code_key` (`project_id`,`code`),
  CONSTRAINT `key_visual_groups_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `key_visual_groups`
--

/*!40000 ALTER TABLE `key_visual_groups` DISABLE KEYS */;
INSERT INTO `key_visual_groups` VALUES (57,1,'rumor','rumor',0),(58,1,'launch','launch',1),(59,1,'render','render',2),(60,1,'maps','maps',3);
/*!40000 ALTER TABLE `key_visual_groups` ENABLE KEYS */;

--
-- Table structure for table `key_visual_items`
--

DROP TABLE IF EXISTS `key_visual_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `key_visual_items` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `key_visual_group_id` bigint NOT NULL,
  `title` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `resource_type` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `provider` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'external',
  `resource_url` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `preview_url` text COLLATE utf8mb4_unicode_ci,
  `sort_order` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `metadata` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_key_visual_items_group_sort` (`key_visual_group_id`,`sort_order`),
  CONSTRAINT `key_visual_items_key_visual_group_id_fkey` FOREIGN KEY (`key_visual_group_id`) REFERENCES `key_visual_groups` (`id`) ON DELETE CASCADE,
  CONSTRAINT `key_visual_items_chk_1` CHECK ((`resource_type` in (_utf8mb4'folder',_utf8mb4'file',_utf8mb4'pdf',_utf8mb4'image',_utf8mb4'video',_utf8mb4'link')))
) ENGINE=InnoDB AUTO_INCREMENT=91 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `key_visual_items`
--

/*!40000 ALTER TABLE `key_visual_items` DISABLE KEYS */;
INSERT INTO `key_visual_items` VALUES (85,57,'KV rumor dự án','folder','external','https://drive.google.com/drive/folders/1GHkdq2bnEB8KlPJux9vyhHvX9PcFOdpP',NULL,0,1,NULL),(86,58,'KV ra mắt dự án','folder','external','https://drive.google.com/drive/folders/1yfbjeEV5-ybPjxVz6km0m4Mdf5orzkfy',NULL,0,1,NULL),(87,59,'Ảnh phối cảnh dự án','folder','external','https://drive.google.com/drive/folders/1_4An_DjojZkiBQBvJxA0Tmq_0ARzjqX6',NULL,0,1,NULL),(88,60,'Bản đồ vị trí dự án','folder','external','https://drive.google.com/drive/folders/1CbbpR3pLqmekAKYQhxOLUaDIpAfVlrEJ',NULL,0,1,NULL),(89,60,'Bản đồ tiện ích dự án','file','external','https://drive.google.com/file/d/1sNKDKuIL0VBEiuV5gZf-1I6Fnx-5iJ7F/view',NULL,1,1,NULL),(90,60,'Bản đồ hạ tầng','file','external','https://drive.google.com/file/d/1huWsNlxNCt4QNrP8g7-q9VFAhDpldKqB/view',NULL,2,1,NULL);
/*!40000 ALTER TABLE `key_visual_items` ENABLE KEYS */;

--
-- Table structure for table `languages`
--

DROP TABLE IF EXISTS `languages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `languages` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `code` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_default` tinyint(1) NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `languages_code_key` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `languages`
--

/*!40000 ALTER TABLE `languages` DISABLE KEYS */;
INSERT INTO `languages` VALUES (1,'vi','Vietnamese',1,1),(2,'en','English',0,1),(3,'zh','Chinese',0,0),(4,'ko','Korean',0,0),(5,'ja','Japanese',0,0);
/*!40000 ALTER TABLE `languages` ENABLE KEYS */;

--
-- Table structure for table `lead_assignment_counters`
--

DROP TABLE IF EXISTS `lead_assignment_counters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lead_assignment_counters` (
  `project_id` bigint NOT NULL,
  `last_user_id` bigint DEFAULT NULL,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`project_id`),
  KEY `lead_assignment_counters_last_user_id_fkey` (`last_user_id`),
  CONSTRAINT `lead_assignment_counters_last_user_id_fkey` FOREIGN KEY (`last_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `lead_assignment_counters_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lead_assignment_counters`
--

/*!40000 ALTER TABLE `lead_assignment_counters` DISABLE KEYS */;
INSERT INTO `lead_assignment_counters` VALUES (1,2,'0000-00-00 00:00:00');
/*!40000 ALTER TABLE `lead_assignment_counters` ENABLE KEYS */;

--
-- Table structure for table `lead_assignments`
--

DROP TABLE IF EXISTS `lead_assignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lead_assignments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `lead_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `assigned_by_user_id` bigint DEFAULT NULL,
  `assigned_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `unassigned_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `lead_assignments_assigned_by_user_id_fkey` (`assigned_by_user_id`),
  KEY `lead_assignments_lead_id_fkey` (`lead_id`),
  KEY `lead_assignments_user_id_fkey` (`user_id`),
  CONSTRAINT `lead_assignments_assigned_by_user_id_fkey` FOREIGN KEY (`assigned_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `lead_assignments_lead_id_fkey` FOREIGN KEY (`lead_id`) REFERENCES `leads` (`id`) ON DELETE CASCADE,
  CONSTRAINT `lead_assignments_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lead_assignments`
--

/*!40000 ALTER TABLE `lead_assignments` DISABLE KEYS */;
INSERT INTO `lead_assignments` VALUES (6,18,2,NULL,'0000-00-00 00:00:00',NULL);
/*!40000 ALTER TABLE `lead_assignments` ENABLE KEYS */;

--
-- Table structure for table `lead_consents`
--

DROP TABLE IF EXISTS `lead_consents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lead_consents` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `lead_id` bigint NOT NULL,
  `channel_code` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `granted` tinyint(1) NOT NULL,
  `granted_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `lead_consents_lead_id_channel_code_key` (`lead_id`,`channel_code`),
  CONSTRAINT `lead_consents_lead_id_fkey` FOREIGN KEY (`lead_id`) REFERENCES `leads` (`id`) ON DELETE CASCADE,
  CONSTRAINT `lead_consents_chk_1` CHECK ((`channel_code` in (_utf8mb4'zalo',_utf8mb4'sms',_utf8mb4'email',_utf8mb4'call')))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lead_consents`
--

/*!40000 ALTER TABLE `lead_consents` DISABLE KEYS */;
/*!40000 ALTER TABLE `lead_consents` ENABLE KEYS */;

--
-- Table structure for table `lead_sources`
--

DROP TABLE IF EXISTS `lead_sources`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lead_sources` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `project_id` bigint NOT NULL,
  `source_group` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `source_code` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `source_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_paid` tinyint(1) NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `sort_order` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `lead_sources_project_id_source_code_key` (`project_id`,`source_code`),
  CONSTRAINT `lead_sources_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lead_sources`
--

/*!40000 ALTER TABLE `lead_sources` DISABLE KEYS */;
INSERT INTO `lead_sources` VALUES (1,1,'social','zalo_oa','Zalo OA',1,1,0),(5,1,'other','vr_web','VR Web',0,1,0);
/*!40000 ALTER TABLE `lead_sources` ENABLE KEYS */;

--
-- Table structure for table `lead_status_history`
--

DROP TABLE IF EXISTS `lead_status_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lead_status_history` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `lead_id` bigint NOT NULL,
  `old_status_code` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `new_status_code` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `changed_by_user_id` bigint DEFAULT NULL,
  `note` text COLLATE utf8mb4_unicode_ci,
  `changed_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `lead_status_history_changed_by_user_id_fkey` (`changed_by_user_id`),
  KEY `lead_status_history_lead_id_fkey` (`lead_id`),
  CONSTRAINT `lead_status_history_changed_by_user_id_fkey` FOREIGN KEY (`changed_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `lead_status_history_lead_id_fkey` FOREIGN KEY (`lead_id`) REFERENCES `leads` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lead_status_history`
--

/*!40000 ALTER TABLE `lead_status_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `lead_status_history` ENABLE KEYS */;

--
-- Table structure for table `leads`
--

DROP TABLE IF EXISTS `leads`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `leads` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `project_id` bigint NOT NULL,
  `customer_id` bigint NOT NULL,
  `source_id` bigint DEFAULT NULL,
  `assigned_user_id` bigint DEFAULT NULL,
  `sales_public_link_id` bigint DEFAULT NULL,
  `interested_property_id` bigint DEFAULT NULL,
  `interested_property_type_id` bigint DEFAULT NULL,
  `source_label_raw` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `budget_label` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `budget_min_vnd` decimal(18,2) DEFAULT NULL,
  `budget_max_vnd` decimal(18,2) DEFAULT NULL,
  `purchase_purpose` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `purchase_timing` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `customer_note` text COLLATE utf8mb4_unicode_ci,
  `crm_note` text COLLATE utf8mb4_unicode_ci,
  `status_code` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'new',
  `pipeline_stage` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'lead',
  `created_from` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'web_form',
  `is_manual` tinyint(1) NOT NULL DEFAULT '0',
  `first_contact_at` datetime DEFAULT NULL,
  `last_contact_at` datetime DEFAULT NULL,
  `closed_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_leads_assigned_user` (`assigned_user_id`,`status_code`),
  KEY `idx_leads_project_status` (`project_id`,`status_code`,`created_at`),
  KEY `leads_customer_id_fkey` (`customer_id`),
  KEY `leads_interested_property_id_fkey` (`interested_property_id`),
  KEY `leads_interested_property_type_id_fkey` (`interested_property_type_id`),
  KEY `leads_sales_public_link_id_fkey` (`sales_public_link_id`),
  KEY `leads_source_id_fkey` (`source_id`),
  CONSTRAINT `leads_assigned_user_id_fkey` FOREIGN KEY (`assigned_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `leads_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  CONSTRAINT `leads_interested_property_id_fkey` FOREIGN KEY (`interested_property_id`) REFERENCES `properties` (`id`) ON DELETE SET NULL,
  CONSTRAINT `leads_interested_property_type_id_fkey` FOREIGN KEY (`interested_property_type_id`) REFERENCES `property_types` (`id`) ON DELETE SET NULL,
  CONSTRAINT `leads_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `leads_sales_public_link_id_fkey` FOREIGN KEY (`sales_public_link_id`) REFERENCES `sales_public_links` (`id`) ON DELETE SET NULL,
  CONSTRAINT `leads_source_id_fkey` FOREIGN KEY (`source_id`) REFERENCES `lead_sources` (`id`) ON DELETE SET NULL,
  CONSTRAINT `leads_chk_1` CHECK ((`pipeline_stage` in (_utf8mb4'lead',_utf8mb4'appointment',_utf8mb4'hold',_utf8mb4'deposit',_utf8mb4'won',_utf8mb4'lost'))),
  CONSTRAINT `leads_chk_2` CHECK ((`status_code` in (_utf8mb4'new',_utf8mb4'called',_utf8mb4'interested',_utf8mb4'qualified',_utf8mb4'closed',_utf8mb4'stopped',_utf8mb4'lost')))
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leads`
--

/*!40000 ALTER TABLE `leads` DISABLE KEYS */;
INSERT INTO `leads` VALUES (1,1,1,1,1,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'new','lead','web_form',0,NULL,NULL,NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00'),(2,1,2,1,1,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'new','lead','web_form',0,NULL,NULL,NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00'),(3,1,3,1,1,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'new','lead','web_form',0,NULL,NULL,NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00'),(4,1,5,1,1,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'new','lead','web_form',0,NULL,NULL,NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00'),(5,1,6,1,1,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'new','lead','web_form',0,NULL,NULL,NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00'),(6,1,7,1,1,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'new','lead','web_form',0,NULL,NULL,NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00'),(7,1,9,1,1,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'new','lead','web_form',0,NULL,NULL,NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00'),(8,1,10,1,1,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'new','lead','web_form',0,NULL,NULL,NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00'),(9,1,11,1,1,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'new','lead','web_form',0,NULL,NULL,NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00'),(10,1,13,1,1,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'new','lead','web_form',0,NULL,NULL,NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00'),(11,1,14,1,1,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'new','lead','web_form',0,NULL,NULL,NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00'),(12,1,15,1,1,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'new','lead','web_form',0,NULL,NULL,NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00'),(18,1,22,5,2,NULL,NULL,NULL,NULL,'8to12',NULL,NULL,'invest','flexible','2br · Căn quan tâm: HV5-12.08 · Quan tâm căn: HV5-12.08',NULL,'new','lead','web_form',0,NULL,NULL,NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00');
/*!40000 ALTER TABLE `leads` ENABLE KEYS */;

--
-- Table structure for table `legal_documents`
--

DROP TABLE IF EXISTS `legal_documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `legal_documents` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `project_id` bigint NOT NULL,
  `subdivision_code` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `document_name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `document_number` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `detail_text` text COLLATE utf8mb4_unicode_ci,
  `file_url` text COLLATE utf8mb4_unicode_ci,
  `issued_on` date DEFAULT NULL,
  `is_completed` tinyint(1) NOT NULL DEFAULT '0',
  `sort_order` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `legal_documents_project_id_fkey` (`project_id`),
  CONSTRAINT `legal_documents_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=265 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `legal_documents`
--

/*!40000 ALTER TABLE `legal_documents` DISABLE KEYS */;
INSERT INTO `legal_documents` VALUES (244,1,NULL,'Giấy phép xây dựng',NULL,'Số 1842/GP-UBND — 12/2023',NULL,NULL,1,0),(245,1,NULL,'Quyết định giao đất',NULL,'QĐ 3671/QĐ-UBND — 08/2022',NULL,NULL,1,1),(246,1,NULL,'Thẩm định PCCC',NULL,'Cục PCCC & CHỮA CHÁY — Q1/2024',NULL,NULL,1,2),(247,1,NULL,'Bảo lãnh ngân hàng',NULL,'Vietcombank, BIDV, Techcombank',NULL,NULL,1,3),(248,1,NULL,'Phê duyệt 1/500',NULL,'Quyết định UBND Hà Nội — 06/2022',NULL,NULL,1,4),(249,1,NULL,'Sổ hồng dự kiến',NULL,'Q2/2028 sau bàn giao',NULL,NULL,0,5),(250,1,'pk-bach-van','Giấy phép xây dựng',NULL,'Số 1842/GP-UBND — 12/2023',NULL,NULL,1,0),(251,1,'pk-bach-van','Quyết định giao đất',NULL,'QĐ 3671/QĐ-UBND — 08/2022',NULL,NULL,1,1),(252,1,'pk-bach-van','Thẩm định PCCC',NULL,'Cục PCCC & CHỮA CHÁY — Q1/2024',NULL,NULL,1,2),(253,1,'pk-tinh-van','Giấy phép xây dựng',NULL,'Số 1842/GP-UBND — 12/2023',NULL,NULL,1,0),(254,1,'pk-tinh-van','Quyết định giao đất',NULL,'QĐ 3671/QĐ-UBND — 08/2022',NULL,NULL,1,1),(255,1,'pk-tinh-van','Thẩm định PCCC',NULL,'Cục PCCC & CHỮA CHÁY — Q1/2024',NULL,NULL,1,2),(256,1,'pk-vinh-may','Giấy phép xây dựng',NULL,'Số 1842/GP-UBND — 12/2023',NULL,NULL,1,0),(257,1,'pk-vinh-may','Quyết định giao đất',NULL,'QĐ 3671/QĐ-UBND — 08/2022',NULL,NULL,1,1),(258,1,'pk-vinh-may','Thẩm định PCCC',NULL,'Cục PCCC & CHỮA CHÁY — Q1/2024',NULL,NULL,1,2),(259,1,'pk-vinh-may','Bảo lãnh ngân hàng',NULL,'Vietcombank, BIDV, Techcombank',NULL,NULL,1,3),(260,1,'pk-dao-ngoc','Giấy phép xây dựng',NULL,'Số 1842/GP-UBND — 12/2023',NULL,NULL,1,0),(261,1,'pk-dao-ngoc','Quyết định giao đất',NULL,'QĐ 3671/QĐ-UBND — 08/2022',NULL,NULL,1,1),(262,1,'pk-dao-ngoc','Thẩm định PCCC',NULL,'Cục PCCC & CHỮA CHÁY — Q1/2024',NULL,NULL,1,2),(263,1,'pk-dao-ngoc','Bảo lãnh ngân hàng',NULL,'Vietcombank, BIDV, Techcombank',NULL,NULL,1,3),(264,1,'pk-dao-ngoc','Phê duyệt 1/500',NULL,'Quyết định UBND Hà Nội — 06/2022',NULL,NULL,1,4);
/*!40000 ALTER TABLE `legal_documents` ENABLE KEYS */;

--
-- Table structure for table `masterplan_categories`
--

DROP TABLE IF EXISTS `masterplan_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `masterplan_categories` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `masterplan_id` bigint NOT NULL,
  `code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `label` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `icon_code` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `masterplan_categories_masterplan_id_code_key` (`masterplan_id`,`code`),
  KEY `idx_masterplan_categories_plan` (`masterplan_id`,`sort_order`),
  CONSTRAINT `masterplan_categories_masterplan_id_fkey` FOREIGN KEY (`masterplan_id`) REFERENCES `masterplans` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=91 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `masterplan_categories`
--

/*!40000 ALTER TABLE `masterplan_categories` DISABLE KEYS */;
INSERT INTO `masterplan_categories` VALUES (85,15,'all','Tất cả','grid',0),(86,15,'phankhu','Phân khu','map',1),(87,15,'bds','Bất động sản','home',2),(88,15,'tienich','Tiện ích','leaf',3),(89,15,'hatang','Hạ tầng','road',4),(90,15,'phuchop','Khu phức hợp','transit',5);
/*!40000 ALTER TABLE `masterplan_categories` ENABLE KEYS */;

--
-- Table structure for table `masterplan_filter_groups`
--

DROP TABLE IF EXISTS `masterplan_filter_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `masterplan_filter_groups` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `masterplan_id` bigint NOT NULL,
  `code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `label` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `masterplan_filter_groups_masterplan_id_code_key` (`masterplan_id`,`code`),
  CONSTRAINT `masterplan_filter_groups_masterplan_id_fkey` FOREIGN KEY (`masterplan_id`) REFERENCES `masterplans` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `masterplan_filter_groups`
--

/*!40000 ALTER TABLE `masterplan_filter_groups` DISABLE KEYS */;
INSERT INTO `masterplan_filter_groups` VALUES (57,15,'phanKhu','phanKhu',0),(58,15,'loaiHienThi','loaiHienThi',1),(59,15,'batDongSan','batDongSan',2),(60,15,'trangThai','trangThai',3);
/*!40000 ALTER TABLE `masterplan_filter_groups` ENABLE KEYS */;

--
-- Table structure for table `masterplan_filter_options`
--

DROP TABLE IF EXISTS `masterplan_filter_options`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `masterplan_filter_options` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `filter_group_id` bigint NOT NULL,
  `option_code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `label` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `color_hex` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `masterplan_filter_options_filter_group_id_option_code_key` (`filter_group_id`,`option_code`),
  KEY `idx_masterplan_filter_options_group` (`filter_group_id`,`sort_order`),
  CONSTRAINT `masterplan_filter_options_filter_group_id_fkey` FOREIGN KEY (`filter_group_id`) REFERENCES `masterplan_filter_groups` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=271 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `masterplan_filter_options`
--

/*!40000 ALTER TABLE `masterplan_filter_options` DISABLE KEYS */;
INSERT INTO `masterplan_filter_options` VALUES (253,57,'pk-bach-van','Bạch Vân',NULL,0),(254,57,'pk-vinh-may','Vịnh Mây',NULL,1),(255,57,'pk-dao-ngoc','Đảo Ngọc',NULL,2),(256,57,'pk-tinh-van','Tịnh Vân',NULL,3),(257,58,'tienich','Tiện ích','#f4c97d',0),(258,58,'phuchop','Khu phức hợp','#a78bfa',1),(259,58,'hatang','Hạ tầng','#60a5fa',2),(260,58,'congvien','Công viên cây xanh','#34d399',3),(261,58,'cangbien','Cảng biển','#38bdf8',4),(262,58,'marina','Bến du thuyền','#22d3ee',5),(263,59,'biet-thu','Biệt thự',NULL,0),(264,59,'can-ho','Căn hộ',NULL,1),(265,59,'shophouse','Shophouse',NULL,2),(266,59,'dat-nen','Đất nền',NULL,3),(267,59,'nha-pho','Nhà phố',NULL,4),(268,60,'da-hien','Đã hiện','#34d399',0),(269,60,'trien-khai','Đang triển khai','#f4c97d',1),(270,60,'quy-hoach','Quy hoạch','#94a3b8',2);
/*!40000 ALTER TABLE `masterplan_filter_options` ENABLE KEYS */;

--
-- Table structure for table `masterplan_markers`
--

DROP TABLE IF EXISTS `masterplan_markers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `masterplan_markers` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `masterplan_id` bigint NOT NULL,
  `marker_code` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category_code` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `label` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `x_pct` decimal(6,2) NOT NULL,
  `y_pct` decimal(6,2) NOT NULL,
  `menu_item_id` bigint DEFAULT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `masterplan_markers_masterplan_id_marker_code_key` (`masterplan_id`,`marker_code`),
  KEY `idx_masterplan_markers_plan` (`masterplan_id`,`sort_order`),
  KEY `masterplan_markers_menu_item_id_fkey` (`menu_item_id`),
  CONSTRAINT `masterplan_markers_masterplan_id_fkey` FOREIGN KEY (`masterplan_id`) REFERENCES `masterplans` (`id`) ON DELETE CASCADE,
  CONSTRAINT `masterplan_markers_menu_item_id_fkey` FOREIGN KEY (`menu_item_id`) REFERENCES `menu_items` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=137 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `masterplan_markers`
--

/*!40000 ALTER TABLE `masterplan_markers` DISABLE KEYS */;
INSERT INTO `masterplan_markers` VALUES (128,15,'m-bach-van','phankhu','Bạch Vân','Phân khu logistics & cảng biển',26.00,42.00,NULL,0,1),(129,15,'m-vinh-may','phankhu','Vịnh Mây','Phân khu nghỉ dưỡng ven biển',66.17,26.26,NULL,1,1),(130,15,'m-dao-ngoc','phankhu','Đảo Ngọc','Compound đảo khép kín',85.49,51.07,NULL,2,1),(131,15,'m-tinh-van','phankhu','Tịnh Vân','Đô thị thương mại',9.96,61.34,NULL,3,1),(132,15,'m-cang','hatang','Cảng Liên Chiểu','Cảng biển nước sâu',14.00,30.00,NULL,4,1),(133,15,'m-lrt','hatang','Ga LRT trung tâm','Đường sắt đô thị',40.94,21.37,NULL,5,1),(134,15,'m-tttm','phuchop','TTTM Hai Van Bay','Tổ hợp thương mại',70.69,70.51,NULL,6,1),(135,15,'m-cv','tienich','Công viên trung tâm','Công viên sinh thái 12ha',60.75,51.56,NULL,7,1),(136,15,'m-marina','tienich','Bến du thuyền','Marina quốc tế',77.76,39.95,NULL,8,1);
/*!40000 ALTER TABLE `masterplan_markers` ENABLE KEYS */;

--
-- Table structure for table `masterplans`
--

DROP TABLE IF EXISTS `masterplans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `masterplans` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `project_id` bigint NOT NULL,
  `image_url` text COLLATE utf8mb4_unicode_ci,
  `intro_text` text COLLATE utf8mb4_unicode_ci,
  `updated_by_user_id` bigint DEFAULT NULL,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `masterplans_project_id_key` (`project_id`),
  KEY `masterplans_updated_by_user_id_fkey` (`updated_by_user_id`),
  CONSTRAINT `masterplans_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `masterplans_updated_by_user_id_fkey` FOREIGN KEY (`updated_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `masterplans`
--

/*!40000 ALTER TABLE `masterplans` DISABLE KEYS */;
INSERT INTO `masterplans` VALUES (15,1,'img/masterplan/masterplane.png','Tổng quan quy hoạch khu đô thị Vinhomes Hai Van Bay — 4 phân khu chức năng kết nối đồng bộ hạ tầng, cảng biển và tiện ích.',NULL,'2026-05-27 04:28:03');
/*!40000 ALTER TABLE `masterplans` ENABLE KEYS */;

--
-- Table structure for table `menu_groups`
--

DROP TABLE IF EXISTS `menu_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menu_groups` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `project_id` bigint NOT NULL,
  `parent_menu_item_id` bigint DEFAULT NULL,
  `code` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `display_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `short_code` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `icon_code` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  `is_system` tinyint(1) NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `menu_groups_project_id_parent_menu_item_id_code_key` (`project_id`,`parent_menu_item_id`,`code`),
  KEY `fk_menu_groups_parent_item` (`parent_menu_item_id`),
  CONSTRAINT `fk_menu_groups_parent_item` FOREIGN KEY (`parent_menu_item_id`) REFERENCES `menu_items` (`id`) ON DELETE CASCADE,
  CONSTRAINT `menu_groups_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=363 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu_groups`
--

/*!40000 ALTER TABLE `menu_groups` DISABLE KEYS */;
INSERT INTO `menu_groups` VALUES (345,1,NULL,'tongQuan','Tổng quan',NULL,NULL,0,0,1),(346,1,NULL,'phanKhu','Phân khu',NULL,NULL,1,0,1),(347,1,773,'tienIchNoiKhu','Tiện ích nội khu',NULL,NULL,0,0,1),(348,1,773,'tienIchNgoaiKhu','Tiện ích ngoại khu',NULL,NULL,1,0,1),(349,1,773,'matBangTang','Mặt bằng tầng',NULL,NULL,2,0,1),(350,1,773,'view360Can','View 360 căn',NULL,NULL,3,0,1),(351,1,784,'tienIchNoiKhu','Tiện ích nội khu',NULL,NULL,0,0,1),(352,1,784,'tienIchNgoaiKhu','Tiện ích ngoại khu',NULL,NULL,1,0,1),(353,1,784,'matBangTang','Mặt bằng tầng',NULL,NULL,2,0,1),(354,1,784,'view360Can','View 360 căn',NULL,NULL,3,0,1),(355,1,794,'tienIchNoiKhu','Tiện ích nội khu',NULL,NULL,0,0,1),(356,1,794,'tienIchNgoaiKhu','Tiện ích ngoại khu',NULL,NULL,1,0,1),(357,1,794,'matBangTang','Mặt bằng tầng',NULL,NULL,2,0,1),(358,1,794,'view360Can','View 360 căn',NULL,NULL,3,0,1),(359,1,802,'tienIchNoiKhu','Tiện ích nội khu',NULL,NULL,0,0,1),(360,1,802,'tienIchNgoaiKhu','Tiện ích ngoại khu',NULL,NULL,1,0,1),(361,1,802,'matBangTang','Mặt bằng tầng',NULL,NULL,2,0,1),(362,1,802,'view360Can','View 360 căn',NULL,NULL,3,0,1);
/*!40000 ALTER TABLE `menu_groups` ENABLE KEYS */;

--
-- Table structure for table `menu_item_detail_images`
--

DROP TABLE IF EXISTS `menu_item_detail_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menu_item_detail_images` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `menu_item_id` bigint NOT NULL,
  `image_url` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_menu_item_detail_images_item` (`menu_item_id`,`sort_order`),
  CONSTRAINT `menu_item_detail_images_menu_item_id_fkey` FOREIGN KEY (`menu_item_id`) REFERENCES `menu_items` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=695 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu_item_detail_images`
--

/*!40000 ALTER TABLE `menu_item_detail_images` DISABLE KEYS */;
INSERT INTO `menu_item_detail_images` VALUES (631,774,'img/1.png',0),(632,774,'img/2.png',1),(633,775,'img/1.png',0),(634,775,'img/2.png',1),(635,776,'img/1.png',0),(636,776,'img/2.png',1),(637,777,'img/2.png',0),(638,777,'img/1.png',1),(639,778,'img/2.png',0),(640,778,'img/1.png',1),(641,779,'img/1.png',0),(642,779,'img/2.png',1),(643,780,'img/1.png',0),(644,780,'img/2.png',1),(645,781,'img/2.png',0),(646,781,'img/1.png',1),(647,782,'img/2.png',0),(648,782,'img/1.png',1),(649,783,'img/2.png',0),(650,783,'img/1.png',1),(651,785,'img/1.png',0),(652,785,'img/2.png',1),(653,786,'img/1.png',0),(654,786,'img/2.png',1),(655,787,'img/2.png',0),(656,787,'img/1.png',1),(657,788,'img/2.png',0),(658,788,'img/1.png',1),(659,789,'img/2.png',0),(660,789,'img/1.png',1),(661,790,'img/1.png',0),(662,790,'img/2.png',1),(663,791,'img/2.png',0),(664,791,'img/1.png',1),(665,792,'img/2.png',0),(666,792,'img/1.png',1),(667,793,'img/2.png',0),(668,793,'img/1.png',1),(669,795,'img/1.png',0),(670,795,'img/2.png',1),(671,796,'img/1.png',0),(672,796,'img/2.png',1),(673,797,'img/2.png',0),(674,797,'img/1.png',1),(675,798,'img/1.png',0),(676,798,'img/2.png',1),(677,799,'img/2.png',0),(678,799,'img/1.png',1),(679,800,'img/2.png',0),(680,800,'img/1.png',1),(681,801,'img/2.png',0),(682,801,'img/1.png',1),(683,803,'img/1.png',0),(684,803,'img/2.png',1),(685,804,'img/2.png',0),(686,804,'img/1.png',1),(687,805,'img/2.png',0),(688,805,'img/1.png',1),(689,806,'img/1.png',0),(690,806,'img/2.png',1),(691,807,'img/2.png',0),(692,807,'img/1.png',1),(693,808,'img/2.png',0),(694,808,'img/1.png',1);
/*!40000 ALTER TABLE `menu_item_detail_images` ENABLE KEYS */;

--
-- Table structure for table `menu_item_detail_specs`
--

DROP TABLE IF EXISTS `menu_item_detail_specs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menu_item_detail_specs` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `menu_item_id` bigint NOT NULL,
  `label` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value_text` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_menu_item_detail_specs_item` (`menu_item_id`,`sort_order`),
  CONSTRAINT `menu_item_detail_specs_menu_item_id_fkey` FOREIGN KEY (`menu_item_id`) REFERENCES `menu_items` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1389 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu_item_detail_specs`
--

/*!40000 ALTER TABLE `menu_item_detail_specs` DISABLE KEYS */;
INSERT INTO `menu_item_detail_specs` VALUES (1261,774,'Diện tích mặt nước','850 m²',0),(1262,774,'Độ sâu','0.6 – 1.6 m',1),(1263,774,'Vị trí','Tầng 5 khối đế',2),(1264,774,'Giờ mở cửa','06:00 – 22:00',3),(1265,775,'Loại hình','Tiện ích nội khu',0),(1266,775,'Đối tượng','Cư dân phân khu',1),(1267,775,'Giờ hoạt động','06:00 – 22:00',2),(1268,775,'Tình trạng','Đang vận hành',3),(1269,776,'Chiều dài tuyến','23 km',0),(1270,776,'Số ga','18 ga',1),(1271,776,'Ga gần nhất','450 m',2),(1272,776,'Dự kiến vận hành','2027',3),(1273,777,'Loại hình','Tiện ích ngoại khu',0),(1274,777,'Khoảng cách','0.5 – 2 km',1),(1275,777,'Di chuyển','3 – 8 phút',2),(1276,777,'Tình trạng','Hiện hữu',3),(1277,778,'Loại hình','Tiện ích ngoại khu',0),(1278,778,'Khoảng cách','0.5 – 2 km',1),(1279,778,'Di chuyển','3 – 8 phút',2),(1280,778,'Tình trạng','Hiện hữu',3),(1281,779,'Số tầng','42 tầng',0),(1282,779,'Căn/sàn','8 – 12 căn',1),(1283,779,'Thang máy','6 thang tốc độ cao',2),(1284,779,'Bàn giao','Quý IV / 2027',3),(1285,780,'Số tầng','42 tầng',0),(1286,780,'Căn/sàn','8 – 12 căn',1),(1287,780,'Thang máy','6 thang tốc độ cao',2),(1288,780,'Bàn giao','Quý IV / 2027',3),(1289,781,'Diện tích','34m²',0),(1290,781,'Ban công','Có',1),(1291,781,'Hướng','Đông Nam',2),(1292,781,'Nội thất','Bàn giao cơ bản',3),(1293,782,'Diện tích','54.6m²',0),(1294,782,'Ban công','Có',1),(1295,782,'Hướng','Đông Nam',2),(1296,782,'Nội thất','Bàn giao cơ bản',3),(1297,783,'Diện tích','62.2m²',0),(1298,783,'Ban công','Có',1),(1299,783,'Hướng','Đông Nam',2),(1300,783,'Nội thất','Bàn giao cơ bản',3),(1301,785,'Loại hình','Tiện ích nội khu',0),(1302,785,'Đối tượng','Cư dân phân khu',1),(1303,785,'Giờ hoạt động','06:00 – 22:00',2),(1304,785,'Tình trạng','Đang vận hành',3),(1305,786,'Loại hình','Tiện ích nội khu',0),(1306,786,'Đối tượng','Cư dân phân khu',1),(1307,786,'Giờ hoạt động','06:00 – 22:00',2),(1308,786,'Tình trạng','Đang vận hành',3),(1309,787,'Loại hình','Tiện ích ngoại khu',0),(1310,787,'Khoảng cách','0.5 – 2 km',1),(1311,787,'Di chuyển','3 – 8 phút',2),(1312,787,'Tình trạng','Hiện hữu',3),(1313,788,'Loại hình','Tiện ích ngoại khu',0),(1314,788,'Khoảng cách','0.5 – 2 km',1),(1315,788,'Di chuyển','3 – 8 phút',2),(1316,788,'Tình trạng','Hiện hữu',3),(1317,789,'Loại hình','Tiện ích ngoại khu',0),(1318,789,'Khoảng cách','0.5 – 2 km',1),(1319,789,'Di chuyển','3 – 8 phút',2),(1320,789,'Tình trạng','Hiện hữu',3),(1321,790,'Số tầng','42 tầng',0),(1322,790,'Căn/sàn','8 – 12 căn',1),(1323,790,'Thang máy','6 thang tốc độ cao',2),(1324,790,'Bàn giao','Quý IV / 2027',3),(1325,791,'Diện tích','35.1m²',0),(1326,791,'Ban công','Có',1),(1327,791,'Hướng','Đông Nam',2),(1328,791,'Nội thất','Bàn giao cơ bản',3),(1329,792,'Diện tích','54.7m²',0),(1330,792,'Ban công','Có',1),(1331,792,'Hướng','Đông Nam',2),(1332,792,'Nội thất','Bàn giao cơ bản',3),(1333,793,'Diện tích','74.5m²',0),(1334,793,'Ban công','Có',1),(1335,793,'Hướng','Đông Nam',2),(1336,793,'Nội thất','Bàn giao cơ bản',3),(1337,795,'Loại hình','Tiện ích nội khu',0),(1338,795,'Đối tượng','Cư dân phân khu',1),(1339,795,'Giờ hoạt động','06:00 – 22:00',2),(1340,795,'Tình trạng','Đang vận hành',3),(1341,796,'Quy mô','12 ha',0),(1342,796,'Số giường bệnh','600 giường',1),(1343,796,'Khoảng cách','1.2 km',2),(1344,796,'Tiêu chuẩn','JCI Quốc tế',3),(1345,797,'Loại hình','Tiện ích ngoại khu',0),(1346,797,'Khoảng cách','0.5 – 2 km',1),(1347,797,'Di chuyển','3 – 8 phút',2),(1348,797,'Tình trạng','Hiện hữu',3),(1349,798,'Số tầng','42 tầng',0),(1350,798,'Căn/sàn','8 – 12 căn',1),(1351,798,'Thang máy','6 thang tốc độ cao',2),(1352,798,'Bàn giao','Quý IV / 2027',3),(1353,799,'Diện tích','43m²',0),(1354,799,'Ban công','Có',1),(1355,799,'Hướng','Đông Nam',2),(1356,799,'Nội thất','Bàn giao cơ bản',3),(1357,800,'Diện tích','59.2m²',0),(1358,800,'Ban công','Có',1),(1359,800,'Hướng','Đông Nam',2),(1360,800,'Nội thất','Bàn giao cơ bản',3),(1361,801,'Diện tích','75.6m²',0),(1362,801,'Ban công','Có',1),(1363,801,'Hướng','Đông Nam',2),(1364,801,'Nội thất','Bàn giao cơ bản',3),(1365,803,'Loại hình','Tiện ích nội khu',0),(1366,803,'Đối tượng','Cư dân phân khu',1),(1367,803,'Giờ hoạt động','06:00 – 22:00',2),(1368,803,'Tình trạng','Đang vận hành',3),(1369,804,'Loại hình','Tiện ích ngoại khu',0),(1370,804,'Khoảng cách','0.5 – 2 km',1),(1371,804,'Di chuyển','3 – 8 phút',2),(1372,804,'Tình trạng','Hiện hữu',3),(1373,805,'Loại hình','Tiện ích ngoại khu',0),(1374,805,'Khoảng cách','0.5 – 2 km',1),(1375,805,'Di chuyển','3 – 8 phút',2),(1376,805,'Tình trạng','Hiện hữu',3),(1377,806,'Số tầng','42 tầng',0),(1378,806,'Căn/sàn','8 – 12 căn',1),(1379,806,'Thang máy','6 thang tốc độ cao',2),(1380,806,'Bàn giao','Quý IV / 2027',3),(1381,807,'Diện tích','46.4m²',0),(1382,807,'Ban công','Có',1),(1383,807,'Hướng','Đông Nam',2),(1384,807,'Nội thất','Bàn giao cơ bản',3),(1385,808,'Diện tích','62.2m²',0),(1386,808,'Ban công','Có',1),(1387,808,'Hướng','Đông Nam',2),(1388,808,'Nội thất','Bàn giao cơ bản',3);
/*!40000 ALTER TABLE `menu_item_detail_specs` ENABLE KEYS */;

--
-- Table structure for table `menu_item_details`
--

DROP TABLE IF EXISTS `menu_item_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menu_item_details` (
  `menu_item_id` bigint NOT NULL,
  `title` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subtitle` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`menu_item_id`),
  CONSTRAINT `menu_item_details_menu_item_id_fkey` FOREIGN KEY (`menu_item_id`) REFERENCES `menu_items` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu_item_details`
--

/*!40000 ALTER TABLE `menu_item_details` DISABLE KEYS */;
INSERT INTO `menu_item_details` VALUES (774,'Bể bơi vô cực','Thư giãn','Tiện ích nội khu','Bể bơi vô cực tầm nhìn panorama hướng vịnh, thiết kế tràn bờ tinh tế, khu vực bể riêng cho trẻ em và hệ thống lọc nước thông minh.'),(775,'Sky Lounge','Tiện ích','Tiện ích nội khu','Sky Lounge — tiện ích nội khu phục vụ cư dân, thiết kế hiện đại, không gian xanh, vận hành theo tiêu chuẩn cao cấp.'),(776,'Tuyến Metro số 6','Kết nối','Hạ tầng giao thông','Tuyến đường sắt đô thị kết nối trực tiếp khu đô thị với trung tâm thành phố và sân bay, rút ngắn thời gian di chuyển, gia tăng giá trị bất động sản khu vực.'),(777,'Đại lộ Thăng Long','Kết nối','Hạ tầng & tiện ích ngoại khu','Đại lộ Thăng Long — tiện ích ngoại khu trong bán kính kết nối thuận tiện, gia tăng giá trị bất động sản và chất lượng sống.'),(778,'Đường Lê Trọng Tấn','Kết nối','Hạ tầng & tiện ích ngoại khu','Đường Lê Trọng Tấn — tiện ích ngoại khu trong bán kính kết nối thuận tiện, gia tăng giá trị bất động sản và chất lượng sống.'),(779,'Tòa Thảo Mộc (I5)','Toà căn hộ','Mặt bằng tòa','Tòa Thảo Mộc (I5) — mặt bằng điển hình với bố trí căn hộ tối ưu công năng, hành lang thông thoáng, lõi giao thông trung tâm.'),(780,'Tòa The Lake Premium (I1)','Toà căn hộ','Mặt bằng tòa','Tòa The Lake Premium (I1) — mặt bằng điển hình với bố trí căn hộ tối ưu công năng, hành lang thông thoáng, lõi giao thông trung tâm.'),(781,'Studio - 34m²','Căn mẫu','View 360° căn hộ','Studio - 34m² — căn hộ mẫu trải nghiệm thực tế ảo 360°, nội thất bàn giao cơ bản, tối ưu ánh sáng và thông gió tự nhiên.'),(782,'2 phòng ngủ + 1 - 54.6m²','Căn mẫu','View 360° căn hộ','2 phòng ngủ + 1 - 54.6m² — căn hộ mẫu trải nghiệm thực tế ảo 360°, nội thất bàn giao cơ bản, tối ưu ánh sáng và thông gió tự nhiên.'),(783,'2 phòng ngủ + 1 - 62.2m²','Căn mẫu','View 360° căn hộ','2 phòng ngủ + 1 - 62.2m² — căn hộ mẫu trải nghiệm thực tế ảo 360°, nội thất bàn giao cơ bản, tối ưu ánh sáng và thông gió tự nhiên.'),(785,'Đường dạo bộ','Tiện ích','Tiện ích nội khu','Đường dạo bộ — tiện ích nội khu phục vụ cư dân, thiết kế hiện đại, không gian xanh, vận hành theo tiêu chuẩn cao cấp.'),(786,'Spa & Onsen','Tiện ích','Tiện ích nội khu','Spa & Onsen — tiện ích nội khu phục vụ cư dân, thiết kế hiện đại, không gian xanh, vận hành theo tiêu chuẩn cao cấp.'),(787,'Tuyến đường Ánh Sáng','Kết nối','Hạ tầng & tiện ích ngoại khu','Tuyến đường Ánh Sáng — tiện ích ngoại khu trong bán kính kết nối thuận tiện, gia tăng giá trị bất động sản và chất lượng sống.'),(788,'Vincom Mega Mall','Kết nối','Hạ tầng & tiện ích ngoại khu','Vincom Mega Mall — tiện ích ngoại khu trong bán kính kết nối thuận tiện, gia tăng giá trị bất động sản và chất lượng sống.'),(789,'Trường THCS Nguyễn Quý Đức','Kết nối','Hạ tầng & tiện ích ngoại khu','Trường THCS Nguyễn Quý Đức — tiện ích ngoại khu trong bán kính kết nối thuận tiện, gia tăng giá trị bất động sản và chất lượng sống.'),(790,'Tòa Nguyệt Quế (I4)','Toà căn hộ','Mặt bằng tòa','Tòa Nguyệt Quế (I4) — mặt bằng điển hình với bố trí căn hộ tối ưu công năng, hành lang thông thoáng, lõi giao thông trung tâm.'),(791,'Studio - 35.1m²','Căn mẫu','View 360° căn hộ','Studio - 35.1m² — căn hộ mẫu trải nghiệm thực tế ảo 360°, nội thất bàn giao cơ bản, tối ưu ánh sáng và thông gió tự nhiên.'),(792,'2 phòng ngủ + 1 - 54.7m²','Căn mẫu','View 360° căn hộ','2 phòng ngủ + 1 - 54.7m² — căn hộ mẫu trải nghiệm thực tế ảo 360°, nội thất bàn giao cơ bản, tối ưu ánh sáng và thông gió tự nhiên.'),(793,'3 phòng ngủ - 74.5m²','Căn mẫu','View 360° căn hộ','3 phòng ngủ - 74.5m² — căn hộ mẫu trải nghiệm thực tế ảo 360°, nội thất bàn giao cơ bản, tối ưu ánh sáng và thông gió tự nhiên.'),(795,'Sân chơi trẻ em','Tiện ích','Tiện ích nội khu','Sân chơi trẻ em — tiện ích nội khu phục vụ cư dân, thiết kế hiện đại, không gian xanh, vận hành theo tiêu chuẩn cao cấp.'),(796,'Bệnh viện Quốc tế Vinmec','Bệnh viện','Hạ tầng trọng điểm','Bệnh viện đa khoa quốc tế tiêu chuẩn 5 sao, trang thiết bị hiện đại, đội ngũ chuyên gia đầu ngành, phục vụ chăm sóc sức khỏe toàn diện cho cư dân khu đô thị.'),(797,'TTTM & nhà để xe 10 tầng','Kết nối','Hạ tầng & tiện ích ngoại khu','TTTM & nhà để xe 10 tầng — tiện ích ngoại khu trong bán kính kết nối thuận tiện, gia tăng giá trị bất động sản và chất lượng sống.'),(798,'Tòa The Central (I3)','Toà căn hộ','Mặt bằng tòa','Tòa The Central (I3) — mặt bằng điển hình với bố trí căn hộ tối ưu công năng, hành lang thông thoáng, lõi giao thông trung tâm.'),(799,'1 phòng ngủ + 1 - 43m²','Căn mẫu','View 360° căn hộ','1 phòng ngủ + 1 - 43m² — căn hộ mẫu trải nghiệm thực tế ảo 360°, nội thất bàn giao cơ bản, tối ưu ánh sáng và thông gió tự nhiên.'),(800,'2 phòng ngủ + 1 - 59.2m²','Căn mẫu','View 360° căn hộ','2 phòng ngủ + 1 - 59.2m² — căn hộ mẫu trải nghiệm thực tế ảo 360°, nội thất bàn giao cơ bản, tối ưu ánh sáng và thông gió tự nhiên.'),(801,'3 phòng ngủ - 75.6m²','Căn mẫu','View 360° căn hộ','3 phòng ngủ - 75.6m² — căn hộ mẫu trải nghiệm thực tế ảo 360°, nội thất bàn giao cơ bản, tối ưu ánh sáng và thông gió tự nhiên.'),(803,'Sân thể thao','Tiện ích','Tiện ích nội khu','Sân thể thao — tiện ích nội khu phục vụ cư dân, thiết kế hiện đại, không gian xanh, vận hành theo tiêu chuẩn cao cấp.'),(804,'Zen Park','Kết nối','Hạ tầng & tiện ích ngoại khu','Zen Park — tiện ích ngoại khu trong bán kính kết nối thuận tiện, gia tăng giá trị bất động sản và chất lượng sống.'),(805,'Central Park 10.2ha','Kết nối','Hạ tầng & tiện ích ngoại khu','Central Park 10.2ha — tiện ích ngoại khu trong bán kính kết nối thuận tiện, gia tăng giá trị bất động sản và chất lượng sống.'),(806,'Tòa The Park (I2)','Toà căn hộ','Mặt bằng tòa','Tòa The Park (I2) — mặt bằng điển hình với bố trí căn hộ tối ưu công năng, hành lang thông thoáng, lõi giao thông trung tâm.'),(807,'2 phòng ngủ + 1 - 46.4m²','Căn mẫu','View 360° căn hộ','2 phòng ngủ + 1 - 46.4m² — căn hộ mẫu trải nghiệm thực tế ảo 360°, nội thất bàn giao cơ bản, tối ưu ánh sáng và thông gió tự nhiên.'),(808,'2 phòng ngủ + 1 - 62.2m²','Căn mẫu','View 360° căn hộ','2 phòng ngủ + 1 - 62.2m² — căn hộ mẫu trải nghiệm thực tế ảo 360°, nội thất bàn giao cơ bản, tối ưu ánh sáng và thông gió tự nhiên.');
/*!40000 ALTER TABLE `menu_item_details` ENABLE KEYS */;

--
-- Table structure for table `menu_item_subdivision_facts`
--

DROP TABLE IF EXISTS `menu_item_subdivision_facts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menu_item_subdivision_facts` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `menu_item_id` bigint NOT NULL,
  `label` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value_text` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_menu_item_subdivision_facts_item` (`menu_item_id`,`sort_order`),
  CONSTRAINT `menu_item_subdivision_facts_menu_item_id_fkey` FOREIGN KEY (`menu_item_id`) REFERENCES `menu_items` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=305 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu_item_subdivision_facts`
--

/*!40000 ALTER TABLE `menu_item_subdivision_facts` DISABLE KEYS */;
INSERT INTO `menu_item_subdivision_facts` VALUES (289,773,'Quy mô','~ 320 ha',0),(290,773,'Định hướng','Logistics & cảng biển quốc tế',1),(291,773,'Lô trí kết nối','210 ha',2),(292,773,'Định hướng phát triển','Logistics & Công nghiệp',3),(293,784,'Quy mô','~ 260 ha',0),(294,784,'Định hướng','Nghỉ dưỡng ven biển',1),(295,784,'Mật độ xây dựng','22%',2),(296,784,'Loại hình chủ đạo','Biệt thự & Shophouse',3),(297,794,'Quy mô','~ 95 ha',0),(298,794,'Định hướng','Compound đảo khép kín',1),(299,794,'Mật độ xây dựng','18%',2),(300,794,'Loại hình chủ đạo','Biệt thự đảo',3),(301,802,'Quy mô','~ 180 ha',0),(302,802,'Định hướng','Đô thị thương mại',1),(303,802,'Mật độ xây dựng','35%',2),(304,802,'Loại hình chủ đạo','Shophouse & Căn hộ',3);
/*!40000 ALTER TABLE `menu_item_subdivision_facts` ENABLE KEYS */;

--
-- Table structure for table `menu_item_subdivision_points`
--

DROP TABLE IF EXISTS `menu_item_subdivision_points`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menu_item_subdivision_points` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `menu_item_id` bigint NOT NULL,
  `point_text` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_menu_item_subdivision_points_item` (`menu_item_id`,`sort_order`),
  CONSTRAINT `menu_item_subdivision_points_menu_item_id_fkey` FOREIGN KEY (`menu_item_id`) REFERENCES `menu_items` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=343 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu_item_subdivision_points`
--

/*!40000 ALTER TABLE `menu_item_subdivision_points` DISABLE KEYS */;
INSERT INTO `menu_item_subdivision_points` VALUES (325,773,'Trung tâm logistics quốc tế cấp vùng',0),(326,773,'Cảng Liên Chiểu – cửa ngõ hàng hải chiến lược',1),(327,773,'Khu công nghiệp Hải Vân Bay',2),(328,773,'Depot & LRT – Trung tâm vận tải đa phương thức',3),(329,773,'Tuyến LRT kết nối nội khu & Đà Nẵng',4),(330,773,'Liên kết trực tiếp cao tốc La Sơn – Túy Loan',5),(331,784,'Đường bờ vịnh riêng dài 2.4 km',0),(332,784,'Bến du thuyền quốc tế',1),(333,784,'Hệ tiện ích resort 5 sao',2),(334,784,'Công viên ven biển sinh thái',3),(335,794,'Compound khép kín an ninh 3 lớp',0),(336,794,'Cầu cảnh quan kết nối đất liền',1),(337,794,'Clubhouse & bến du thuyền nội khu',2),(338,794,'Công viên trung tâm đảo',3),(339,802,'Trục phố thương mại trung tâm',0),(340,802,'Quảng trường lễ hội',1),(341,802,'Tổ hợp TTTM & giải trí',2),(342,802,'Kết nối trực tiếp tuyến LRT',3);
/*!40000 ALTER TABLE `menu_item_subdivision_points` ENABLE KEYS */;

--
-- Table structure for table `menu_item_subdivisions`
--

DROP TABLE IF EXISTS `menu_item_subdivisions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menu_item_subdivisions` (
  `menu_item_id` bigint NOT NULL,
  `name` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `cover_url` text COLLATE utf8mb4_unicode_ci,
  `video_url` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`menu_item_id`),
  CONSTRAINT `menu_item_subdivisions_menu_item_id_fkey` FOREIGN KEY (`menu_item_id`) REFERENCES `menu_items` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu_item_subdivisions`
--

/*!40000 ALTER TABLE `menu_item_subdivisions` DISABLE KEYS */;
INSERT INTO `menu_item_subdivisions` VALUES (773,'Phân khu Bạch Vân','Bạch Vân là trung tâm logistics và cảng biển chiến lược của khu đô thị, kết nối trực tiếp Cảng Liên Chiểu, đường sắt LRT và hệ thống cao tốc liên vùng – Tây và cao tốc Bắc – Nam, định hướng phát triển kinh tế biển và thương mại.','img/2.png',NULL),(784,'Phân khu Vịnh Mây','Vịnh Mây là phân khu nghỉ dưỡng cao cấp ven biển, sở hữu đường bờ vịnh riêng, hệ tiện ích resort và mật độ xây dựng thấp, mang đến không gian sống xanh đẳng cấp.','img/2.png',NULL),(794,'Phân khu Đảo Ngọc','Đảo Ngọc là phân khu compound khép kín trên đảo, kết nối bằng cầu cảnh quan, định vị cộng đồng cư dân tinh hoa với an ninh và riêng tư tuyệt đối.','img/2.png',NULL),(802,'Phân khu Tịnh Vân','Tịnh Vân là phân khu đô thị thương mại sầm uất, tập trung shophouse và căn hộ thương mại, là trung tâm mua sắm – dịch vụ của toàn khu đô thị.','img/2.png',NULL);
/*!40000 ALTER TABLE `menu_item_subdivisions` ENABLE KEYS */;

--
-- Table structure for table `menu_items`
--

DROP TABLE IF EXISTS `menu_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menu_items` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `menu_group_id` bigint NOT NULL,
  `panorama_id` bigint DEFAULT NULL,
  `scene_id` bigint DEFAULT NULL,
  `item_code` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `label` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `external_url` text COLLATE utf8mb4_unicode_ci,
  `hotspot_code` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `menu_items_menu_group_id_item_code_key` (`menu_group_id`,`item_code`),
  KEY `idx_menu_items_group_sort` (`menu_group_id`,`sort_order`),
  KEY `menu_items_panorama_id_fkey` (`panorama_id`),
  KEY `menu_items_scene_id_fkey` (`scene_id`),
  CONSTRAINT `menu_items_menu_group_id_fkey` FOREIGN KEY (`menu_group_id`) REFERENCES `menu_groups` (`id`) ON DELETE CASCADE,
  CONSTRAINT `menu_items_panorama_id_fkey` FOREIGN KEY (`panorama_id`) REFERENCES `panorama_assets` (`id`) ON DELETE SET NULL,
  CONSTRAINT `menu_items_scene_id_fkey` FOREIGN KEY (`scene_id`) REFERENCES `vr_scenes` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=809 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu_items`
--

/*!40000 ALTER TABLE `menu_items` DISABLE KEYS */;
INSERT INTO `menu_items` VALUES (767,345,NULL,NULL,'aerial','Tổng quan (Top View)',NULL,NULL,'pano-01',0,1),(768,345,NULL,NULL,'view-1','Tổng quan (View 1)',NULL,NULL,'pano-44',1,1),(769,345,NULL,NULL,'view-2','Tổng quan (View 2)',NULL,NULL,'pano-37',2,1),(770,345,NULL,NULL,'view-3','Tổng quan (View 3)',NULL,NULL,'pano-41',3,1),(771,345,NULL,NULL,'view-4','Tổng quan (View 4)',NULL,NULL,'pano-4',4,1),(772,345,NULL,NULL,'view-5','Tổng quan (View 5)',NULL,NULL,'pano-02',5,1),(773,346,NULL,NULL,'pk-bach-van','Phân khu Bạch Vân',NULL,NULL,'pano-29',0,1),(774,347,NULL,NULL,'be-boi','Bể bơi',NULL,NULL,'pano-13',0,1),(775,347,NULL,NULL,'sky-lounge-tn','Sky Lounge',NULL,NULL,'pano-31',1,1),(776,348,NULL,NULL,'metro-6','Tuyến Metro 6',NULL,NULL,'pano-38',0,1),(777,348,NULL,NULL,'dl-thang-long','Đại lộ Thăng Long',NULL,NULL,'pano-06',1,1),(778,348,NULL,NULL,'le-trong-tan','Đường Lê Trọng Tấn',NULL,NULL,'pano-12',2,1),(779,349,NULL,NULL,'i5','Tòa Thảo Mộc (I5)',NULL,NULL,'pano-03',0,1),(780,349,NULL,NULL,'i1','Tòa The Lake Premium (I1)',NULL,NULL,'pano-33',1,1),(781,350,NULL,NULL,'studio-34','Studio - 34m²',NULL,NULL,'pano-16',0,1),(782,350,NULL,NULL,'2pn1-54a','2 phòng ngủ + 1 - 54.6m²',NULL,NULL,'pano-20',1,1),(783,350,NULL,NULL,'2pn1-62b','2 phòng ngủ + 1 - 62.2m²',NULL,NULL,'pano-26',2,1),(784,346,NULL,NULL,'pk-vinh-may','Phân khu Vịnh Mây',NULL,NULL,'pano-30',1,1),(785,351,NULL,NULL,'duong-dao-bo','Đường dạo bộ',NULL,NULL,'pano-08',0,1),(786,351,NULL,NULL,'spa-onsen','Spa & Onsen',NULL,NULL,'pano-35',1,1),(787,352,NULL,NULL,'duong-as','Tuyến đường Ánh Sáng',NULL,NULL,'pano-42',0,1),(788,352,NULL,NULL,'vincom-mega','Vincom Mega Mall',NULL,NULL,'pano-07',1,1),(789,352,NULL,NULL,'thcs-nqd','Trường THCS Nguyễn Quý Đức',NULL,NULL,'pano-39',2,1),(790,353,NULL,NULL,'i4','Tòa Nguyệt Quế (I4)',NULL,NULL,'pano-04',0,1),(791,354,NULL,NULL,'studio-35','Studio - 35.1m²',NULL,NULL,'pano-17',0,1),(792,354,NULL,NULL,'2pn1-54b','2 phòng ngủ + 1 - 54.7m²',NULL,NULL,'pano-23',1,1),(793,354,NULL,NULL,'3pn-74','3 phòng ngủ - 74.5m²',NULL,NULL,'pano-27',2,1),(794,346,NULL,NULL,'pk-dao-ngoc','Phân khu Đảo Ngọc',NULL,NULL,'pano-32',2,1),(795,355,NULL,NULL,'san-choi-tre','Sân chơi trẻ em',NULL,NULL,'pano-09',0,1),(796,356,NULL,NULL,'vinmec','Bệnh viện Quốc tế Vinmec',NULL,NULL,'pano-43',0,1),(797,356,NULL,NULL,'tttm-10','TTTM & nhà để xe 10 tầng',NULL,NULL,'pano-10',1,1),(798,357,NULL,NULL,'i3','Tòa The Central (I3)',NULL,NULL,'pano-14',0,1),(799,358,NULL,NULL,'1pn1-43','1 phòng ngủ + 1 - 43m²',NULL,NULL,'pano-18',0,1),(800,358,NULL,NULL,'2pn1-59','2 phòng ngủ + 1 - 59.2m²',NULL,NULL,'pano-24',1,1),(801,358,NULL,NULL,'3pn-75','3 phòng ngủ - 75.6m²',NULL,NULL,'pano-28',2,1),(802,346,NULL,NULL,'pk-tinh-van','Phân khu Tịnh Vân',NULL,NULL,'pano-34',3,1),(803,359,NULL,NULL,'san-the-thao','Sân thể thao',NULL,NULL,'pano-15',0,1),(804,360,NULL,NULL,'zen-park','Zen Park',NULL,NULL,'pano-05',0,1),(805,360,NULL,NULL,'central-park','Central Park 10.2ha',NULL,NULL,'pano-11',1,1),(806,361,NULL,NULL,'i2','Tòa The Park (I2)',NULL,NULL,'pano-21',0,1),(807,362,NULL,NULL,'2pn1-46','2 phòng ngủ + 1 - 46.4m²',NULL,NULL,'pano-19',0,1),(808,362,NULL,NULL,'2pn1-62a','2 phòng ngủ + 1 - 62.2m²',NULL,NULL,'pano-25',1,1);
/*!40000 ALTER TABLE `menu_items` ENABLE KEYS */;

--
-- Table structure for table `nearby_places`
--

DROP TABLE IF EXISTS `nearby_places`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nearby_places` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `project_location_id` bigint NOT NULL,
  `category_code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `distance_km` decimal(8,2) DEFAULT NULL,
  `distance_text` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `travel_minutes` int DEFAULT NULL,
  `travel_time_text` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `nearby_places_project_location_id_fkey` (`project_location_id`),
  CONSTRAINT `nearby_places_project_location_id_fkey` FOREIGN KEY (`project_location_id`) REFERENCES `project_locations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=247 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nearby_places`
--

/*!40000 ALTER TABLE `nearby_places` DISABLE KEYS */;
INSERT INTO `nearby_places` VALUES (229,57,'school','Trường THCS Nguyễn Quý Đức',0.40,'0.4 km',5,'5 phút',0,1),(230,57,'school','Trường Liên cấp song ngữ Aurora',0.10,'0.1 km',2,'2 phút',1,1),(231,57,'hospital','BV Quốc tế Vinmec',1.20,'1.2 km',8,'8 phút',2,1),(232,57,'hospital','BV Bạch Mai',3.50,'3.5 km',15,'15 phút',3,1),(233,57,'metro','Ga Metro Tây Hồ Tây',0.60,'0.6 km',7,'7 phút',4,1),(234,57,'metro','Ga Metro Cầu Giấy',2.10,'2.1 km',10,'10 phút',5,1),(235,57,'mall','Vincom Mega Mall',0.80,'0.8 km',5,'5 phút',6,1),(236,57,'mall','AEON Mall Hà Đông',4.20,'4.2 km',18,'18 phút',7,1),(237,57,'airport','Sân bay Nội Bài',28.00,'28 km',35,'35 phút',8,1),(238,58,'school','Trường THCS Nguyễn Quý Đức',0.40,'0.4 km',5,'5 phút',0,1),(239,58,'metro','Ga Metro Tây Hồ Tây',0.60,'0.6 km',7,'7 phút',1,1),(240,58,'airport','Sân bay Nội Bài',28.00,'28 km',35,'35 phút',2,1),(241,59,'hospital','BV Quốc tế Vinmec',1.20,'1.2 km',8,'8 phút',0,1),(242,59,'mall','Vincom Mega Mall',0.80,'0.8 km',5,'5 phút',1,1),(243,60,'hospital','BV Bạch Mai',3.50,'3.5 km',15,'15 phút',0,1),(244,60,'mall','AEON Mall Hà Đông',4.20,'4.2 km',18,'18 phút',1,1),(245,61,'school','Trường Liên cấp song ngữ Aurora',0.10,'0.1 km',2,'2 phút',0,1),(246,61,'metro','Ga Metro Cầu Giấy',2.10,'2.1 km',10,'10 phút',1,1);
/*!40000 ALTER TABLE `nearby_places` ENABLE KEYS */;

--
-- Table structure for table `panorama_assets`
--

DROP TABLE IF EXISTS `panorama_assets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `panorama_assets` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `project_id` bigint NOT NULL,
  `panorama_code` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `source_hex_key` varchar(160) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `thumbnail_url` text COLLATE utf8mb4_unicode_ci,
  `media_url` text COLLATE utf8mb4_unicode_ci,
  `sort_order` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `metadata` json DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `panorama_assets_project_id_panorama_code_key` (`project_id`,`panorama_code`),
  CONSTRAINT `panorama_assets_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `panorama_assets`
--

/*!40000 ALTER TABLE `panorama_assets` DISABLE KEYS */;
/*!40000 ALTER TABLE `panorama_assets` ENABLE KEYS */;

--
-- Table structure for table `project_card_highlights`
--

DROP TABLE IF EXISTS `project_card_highlights`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_card_highlights` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `project_id` bigint NOT NULL,
  `icon_code` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `label` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value_text` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `project_card_highlights_project_id_fkey` (`project_id`),
  CONSTRAINT `project_card_highlights_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=96 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_card_highlights`
--

/*!40000 ALTER TABLE `project_card_highlights` DISABLE KEYS */;
INSERT INTO `project_card_highlights` VALUES (91,1,'area','Diện tích phát triển','1.200 ha',0),(92,1,'port','Cảng biển nước sâu','Liên Chiểu',1),(93,1,'transit','Kết nối LRT','Tuyến Liên Chiểu – Đà Nẵng',2),(94,1,'road','Cao tốc liên vùng','Đà Nẵng – Huế',3),(95,1,'leaf','Định hướng phát triển','Logistics xanh & bền vững',4);
/*!40000 ALTER TABLE `project_card_highlights` ENABLE KEYS */;

--
-- Table structure for table `project_card_overviews`
--

DROP TABLE IF EXISTS `project_card_overviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_card_overviews` (
  `project_id` bigint NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `updated_by_user_id` bigint DEFAULT NULL,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`project_id`),
  KEY `project_card_overviews_updated_by_user_id_fkey` (`updated_by_user_id`),
  CONSTRAINT `project_card_overviews_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `project_card_overviews_updated_by_user_id_fkey` FOREIGN KEY (`updated_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_card_overviews`
--

/*!40000 ALTER TABLE `project_card_overviews` DISABLE KEYS */;
INSERT INTO `project_card_overviews` VALUES (1,'Trung tâm logistics và cảng biển hiện đại, kết nối trực tiếp Cảng Liên Chiểu, đường sắt LRT và hệ thống cao tốc liên vùng, thúc đẩy giao thương quốc tế và chuỗi cung ứng toàn cầu.',NULL,'2026-05-27 04:28:03');
/*!40000 ALTER TABLE `project_card_overviews` ENABLE KEYS */;

--
-- Table structure for table `project_card_quick_links`
--

DROP TABLE IF EXISTS `project_card_quick_links`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_card_quick_links` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `project_id` bigint NOT NULL,
  `action_code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `icon_code` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `label` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `project_card_quick_links_project_id_fkey` (`project_id`),
  CONSTRAINT `project_card_quick_links_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `project_card_quick_links_chk_1` CHECK ((`action_code` in (_utf8mb4'open-masterplan',_utf8mb4'open-phankhu',_utf8mb4'open-properties',_utf8mb4'open-modal')))
) ENGINE=InnoDB AUTO_INCREMENT=77 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_card_quick_links`
--

/*!40000 ALTER TABLE `project_card_quick_links` DISABLE KEYS */;
INSERT INTO `project_card_quick_links` VALUES (73,1,'open-masterplan','map','Xem Masterplan tổng thể',0),(74,1,'open-phankhu','grid','Khám phá 4 phân khu',1),(75,1,'open-properties','home','Danh sách sản phẩm',2),(76,1,'open-modal','doc','Nhận tư vấn dự án',3);
/*!40000 ALTER TABLE `project_card_quick_links` ENABLE KEYS */;

--
-- Table structure for table `project_locations`
--

DROP TABLE IF EXISTS `project_locations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_locations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `project_id` bigint NOT NULL,
  `subdivision_code` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `map_embed_url` text COLLATE utf8mb4_unicode_ci,
  `address_text` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `project_locations_project_id_subdivision_code_key` (`project_id`,`subdivision_code`),
  CONSTRAINT `project_locations_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_locations`
--

/*!40000 ALTER TABLE `project_locations` DISABLE KEYS */;
INSERT INTO `project_locations` VALUES (57,1,NULL,16.2130000,108.1200000,'https://www.google.com/maps?q=16.213,108.12&z=14&hl=vi&output=embed',NULL),(58,1,'pk-bach-van',16.2130000,108.1200000,'https://www.google.com/maps?q=16.213,108.12&z=14&hl=vi&output=embed',NULL),(59,1,'pk-dao-ngoc',16.2130000,108.1200000,'https://www.google.com/maps?q=16.213,108.12&z=14&hl=vi&output=embed',NULL),(60,1,'pk-tinh-van',16.2130000,108.1200000,'https://www.google.com/maps?q=16.213,108.12&z=14&hl=vi&output=embed',NULL),(61,1,'pk-vinh-may',16.2130000,108.1200000,'https://www.google.com/maps?q=16.213,108.12&z=14&hl=vi&output=embed',NULL);
/*!40000 ALTER TABLE `project_locations` ENABLE KEYS */;

--
-- Table structure for table `project_memberships`
--

DROP TABLE IF EXISTS `project_memberships`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_memberships` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `project_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `role_id` bigint NOT NULL,
  `public_slug` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_primary_sales` tinyint(1) NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `project_memberships_project_id_user_id_role_id_key` (`project_id`,`user_id`,`role_id`),
  UNIQUE KEY `project_memberships_project_id_public_slug_key` (`project_id`,`public_slug`),
  KEY `idx_project_memberships_user` (`user_id`),
  KEY `project_memberships_role_id_fkey` (`role_id`),
  CONSTRAINT `project_memberships_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `project_memberships_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`),
  CONSTRAINT `project_memberships_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_memberships`
--

/*!40000 ALTER TABLE `project_memberships` DISABLE KEYS */;
INSERT INTO `project_memberships` VALUES (1,1,1,3,'sales',1,1,'0000-00-00 00:00:00'),(2,1,2,3,'sales2',1,1,'0000-00-00 00:00:00'),(21,1,21,5,NULL,0,1,'0000-00-00 00:00:00'),(22,1,22,1,NULL,0,1,'0000-00-00 00:00:00');
/*!40000 ALTER TABLE `project_memberships` ENABLE KEYS */;

--
-- Table structure for table `project_resources`
--

DROP TABLE IF EXISTS `project_resources`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_resources` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `project_id` bigint NOT NULL,
  `resource_category_id` bigint DEFAULT NULL,
  `subdivision_code` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `resource_key` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `resource_type` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `provider` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'external',
  `resource_url` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `metadata` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `project_resources_project_id_subdivision_code_resource_key_key` (`project_id`,`subdivision_code`,`resource_key`),
  KEY `project_resources_resource_category_id_fkey` (`resource_category_id`),
  CONSTRAINT `project_resources_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `project_resources_resource_category_id_fkey` FOREIGN KEY (`resource_category_id`) REFERENCES `resource_categories` (`id`) ON DELETE SET NULL,
  CONSTRAINT `project_resources_chk_1` CHECK ((`resource_type` in (_utf8mb4'folder',_utf8mb4'file',_utf8mb4'pdf',_utf8mb4'image',_utf8mb4'video',_utf8mb4'link')))
) ENGINE=InnoDB AUTO_INCREMENT=306 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_resources`
--

/*!40000 ALTER TABLE `project_resources` DISABLE KEYS */;
INSERT INTO `project_resources` VALUES (281,1,NULL,'pk-tinh-van','brochure','Tờ rơi dự án','folder','external','',0,1,NULL),(282,1,NULL,'pk-tinh-van','salesKit','Bộ bí kíp tư vấn (nội bộ)','folder','external','',1,1,NULL),(283,1,NULL,'pk-tinh-van','brandKit','Bộ nhận diện thương hiệu','folder','external','',2,1,NULL),(284,1,NULL,'pk-tinh-van','priceList','Bảng giá & chính sách bán hàng','pdf','external','',3,1,NULL),(285,1,NULL,'pk-tinh-van','floorPlanPdf','TMB mã căn & diện tích','folder','external','',4,1,NULL),(286,1,NULL,'pk-bach-van','brochure','Tờ rơi dự án','folder','external','',0,1,NULL),(287,1,NULL,'pk-bach-van','salesKit','Bộ bí kíp tư vấn (nội bộ)','folder','external','',1,1,NULL),(288,1,NULL,'pk-bach-van','brandKit','Bộ nhận diện thương hiệu','folder','external','',2,1,NULL),(289,1,NULL,'pk-bach-van','priceList','Bảng giá & chính sách bán hàng','pdf','external','',3,1,NULL),(290,1,NULL,'pk-bach-van','floorPlanPdf','TMB mã căn & diện tích','folder','external','',4,1,NULL),(291,1,NULL,'pk-dao-ngoc','brochure','Tờ rơi dự án','folder','external','',0,1,NULL),(292,1,NULL,'pk-dao-ngoc','salesKit','Bộ bí kíp tư vấn (nội bộ)','folder','external','',1,1,NULL),(293,1,NULL,'pk-dao-ngoc','brandKit','Bộ nhận diện thương hiệu','folder','external','',2,1,NULL),(294,1,NULL,'pk-dao-ngoc','priceList','Bảng giá & chính sách bán hàng','pdf','external','',3,1,NULL),(295,1,NULL,'pk-dao-ngoc','floorPlanPdf','TMB mã căn & diện tích','folder','external','',4,1,NULL),(296,1,NULL,'pk-vinh-may','brochure','Tờ rơi dự án','folder','external','',0,1,NULL),(297,1,NULL,'pk-vinh-may','salesKit','Bộ bí kíp tư vấn (nội bộ)','folder','external','',1,1,NULL),(298,1,NULL,'pk-vinh-may','brandKit','Bộ nhận diện thương hiệu','folder','external','',2,1,NULL),(299,1,NULL,'pk-vinh-may','priceList','Bảng giá & chính sách bán hàng','pdf','external','',3,1,NULL),(300,1,NULL,'pk-vinh-may','floorPlanPdf','TMB mã căn & diện tích','folder','external','',4,1,NULL),(301,1,NULL,NULL,'brochure','Tờ rơi dự án','folder','external','https://drive.google.com/drive/folders/1m_KyuIsFgP6RLIclH-GJSE82rC9wEy32',0,1,NULL),(302,1,NULL,NULL,'salesKit','Bộ bí kíp tư vấn (nội bộ)','folder','external','https://drive.google.com/drive/folders/1mY4CqH8I0FWKMCyx1nFYeQNdhhKL39Xi',1,1,NULL),(303,1,NULL,NULL,'brandKit','Bộ nhận diện thương hiệu','folder','external','https://drive.google.com/drive/folders/1NeXfCqSULl6mNqQn4YW-BtLi1M8ZmArf',2,1,NULL),(304,1,NULL,NULL,'priceList','Bảng giá & chính sách bán hàng','pdf','external','',3,1,NULL),(305,1,NULL,NULL,'floorPlanPdf','TMB mã căn & diện tích','folder','external','https://drive.google.com/drive/folders/1H5CPAaedDai9qLku8m9p98VKcRitHL09',4,1,NULL);
/*!40000 ALTER TABLE `project_resources` ENABLE KEYS */;

--
-- Table structure for table `project_settings`
--

DROP TABLE IF EXISTS `project_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_settings` (
  `project_id` bigint NOT NULL,
  `publish_mode` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'manual_export',
  `ai_ws_url` text COLLATE utf8mb4_unicode_ci,
  `crm_api_key_enc` text COLLATE utf8mb4_unicode_ci,
  `google_maps_api_key_enc` text COLLATE utf8mb4_unicode_ci,
  `backup_policy_json` json DEFAULT NULL,
  `feature_flags_json` json DEFAULT NULL,
  `updated_by_user_id` bigint DEFAULT NULL,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`project_id`),
  KEY `project_settings_updated_by_user_id_fkey` (`updated_by_user_id`),
  CONSTRAINT `project_settings_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `project_settings_updated_by_user_id_fkey` FOREIGN KEY (`updated_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `project_settings_chk_1` CHECK ((`publish_mode` in (_utf8mb4'manual_export',_utf8mb4'api_publish')))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_settings`
--

/*!40000 ALTER TABLE `project_settings` DISABLE KEYS */;
INSERT INTO `project_settings` VALUES (1,'manual_export',NULL,NULL,NULL,NULL,'{\"siteMap\": {\"zoom\": 14, \"center\": [16.213, 108.12]}}',NULL,'0000-00-00 00:00:00');
/*!40000 ALTER TABLE `project_settings` ENABLE KEYS */;

--
-- Table structure for table `project_statistics`
--

DROP TABLE IF EXISTS `project_statistics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_statistics` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `project_id` bigint NOT NULL,
  `subdivision_code` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `label` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `unit_label` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `value_text` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `numeric_value` decimal(18,4) DEFAULT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `project_statistics_project_id_fkey` (`project_id`),
  CONSTRAINT `project_statistics_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=401 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_statistics`
--

/*!40000 ALTER TABLE `project_statistics` DISABLE KEYS */;
INSERT INTO `project_statistics` VALUES (377,1,NULL,'Cây xanh nội khu','ha','12.4',12.4000,0),(378,1,NULL,'Mật độ xây dựng','%','27',27.0000,1),(379,1,NULL,'Tới hồ Tây','phút','8',8.0000,2),(380,1,NULL,'Tầm view panorama','tầng','42',42.0000,3),(381,1,NULL,'Kinh nghiệm','năm','18',18.0000,100),(382,1,NULL,'Đã bàn giao','căn','12.400',12.4000,101),(383,1,NULL,'Tỉnh thành','dự án','24',24.0000,102),(384,1,NULL,'Cư dân','+','38.000',38.0000,103),(385,1,'pk-bach-van','Kinh nghiệm','năm','18',18.0000,100),(386,1,'pk-bach-van','Đã bàn giao','căn','12.400',12.4000,101),(387,1,'pk-bach-van','Tỉnh thành','dự án','24',24.0000,102),(388,1,'pk-bach-van','Cư dân','+','38.000',38.0000,103),(389,1,'pk-tinh-van','Kinh nghiệm','năm','18',18.0000,100),(390,1,'pk-tinh-van','Đã bàn giao','căn','12.400',12.4000,101),(391,1,'pk-tinh-van','Tỉnh thành','dự án','24',24.0000,102),(392,1,'pk-tinh-van','Cư dân','+','38.000',38.0000,103),(393,1,'pk-vinh-may','Kinh nghiệm','năm','18',18.0000,100),(394,1,'pk-vinh-may','Đã bàn giao','căn','12.400',12.4000,101),(395,1,'pk-vinh-may','Tỉnh thành','dự án','24',24.0000,102),(396,1,'pk-vinh-may','Cư dân','+','38.000',38.0000,103),(397,1,'pk-dao-ngoc','Kinh nghiệm','năm','18',18.0000,100),(398,1,'pk-dao-ngoc','Đã bàn giao','căn','12.400',12.4000,101),(399,1,'pk-dao-ngoc','Tỉnh thành','dự án','24',24.0000,102),(400,1,'pk-dao-ngoc','Cư dân','+','38.000',38.0000,103);
/*!40000 ALTER TABLE `project_statistics` ENABLE KEYS */;

--
-- Table structure for table `project_testimonials`
--

DROP TABLE IF EXISTS `project_testimonials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_testimonials` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `project_id` bigint NOT NULL,
  `subdivision_code` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `initials` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `customer_role` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `unit_label` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `testimonial_text` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `avatar_url` text COLLATE utf8mb4_unicode_ci,
  `sort_order` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `project_testimonials_project_id_fkey` (`project_id`),
  CONSTRAINT `project_testimonials_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=94 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_testimonials`
--

/*!40000 ALTER TABLE `project_testimonials` DISABLE KEYS */;
INSERT INTO `project_testimonials` VALUES (87,1,NULL,'N.T.H','Chuyên gia tài chính','Duplex 3PN tầng 40','Môi trường sống đẳng cấp, view hồ Tây tuyệt đẹp. Quyết định mua là đúng đắn nhất năm ngoái.',NULL,0,1),(88,1,NULL,'P.M.Q','Doanh nhân','2PN+1 tầng 22','Tiến độ xây dựng đúng cam kết, đội ngũ tư vấn chuyên nghiệp. Rất hài lòng với chất lượng hoàn thiện.',NULL,1,1),(89,1,NULL,'L.T.A','Bác sĩ','3PN tầng 35','Tiện ích nội khu vượt kỳ vọng. Bể bơi và công viên là điểm nhấn tuyệt vời cho gia đình.',NULL,2,1),(90,1,'pk-bach-van','N.T.H','Chuyên gia tài chính','Duplex 3PN tầng 40','Môi trường sống đẳng cấp, view hồ Tây tuyệt đẹp. Quyết định mua là đúng đắn nhất năm ngoái.',NULL,0,1),(91,1,'pk-tinh-van','N.T.H','Chuyên gia tài chính','Duplex 3PN tầng 40','Môi trường sống đẳng cấp, view hồ Tây tuyệt đẹp. Quyết định mua là đúng đắn nhất năm ngoái.',NULL,0,1),(92,1,'pk-vinh-may','P.M.Q','Doanh nhân','2PN+1 tầng 22','Tiến độ xây dựng đúng cam kết, đội ngũ tư vấn chuyên nghiệp. Rất hài lòng với chất lượng hoàn thiện.',NULL,0,1),(93,1,'pk-dao-ngoc','L.T.A','Bác sĩ','3PN tầng 35','Tiện ích nội khu vượt kỳ vọng. Bể bơi và công viên là điểm nhấn tuyệt vời cho gia đình.',NULL,0,1);
/*!40000 ALTER TABLE `project_testimonials` ENABLE KEYS */;

--
-- Table structure for table `project_themes`
--

DROP TABLE IF EXISTS `project_themes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_themes` (
  `project_id` bigint NOT NULL,
  `active_theme_preset_id` bigint DEFAULT NULL,
  `custom_tokens_json` json DEFAULT NULL,
  `effects_json` json DEFAULT NULL,
  `updated_by_user_id` bigint DEFAULT NULL,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`project_id`),
  KEY `project_themes_active_theme_preset_id_fkey` (`active_theme_preset_id`),
  KEY `project_themes_updated_by_user_id_fkey` (`updated_by_user_id`),
  CONSTRAINT `project_themes_active_theme_preset_id_fkey` FOREIGN KEY (`active_theme_preset_id`) REFERENCES `theme_presets` (`id`) ON DELETE SET NULL,
  CONSTRAINT `project_themes_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `project_themes_updated_by_user_id_fkey` FOREIGN KEY (`updated_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_themes`
--

/*!40000 ALTER TABLE `project_themes` DISABLE KEYS */;
/*!40000 ALTER TABLE `project_themes` ENABLE KEYS */;

--
-- Table structure for table `project_translations`
--

DROP TABLE IF EXISTS `project_translations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_translations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `project_id` bigint NOT NULL,
  `language_id` bigint NOT NULL,
  `translation_key_id` bigint NOT NULL,
  `translated_text` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `updated_by_user_id` bigint DEFAULT NULL,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `project_translations_project_id_language_id_translation_key_key` (`project_id`,`language_id`,`translation_key_id`),
  UNIQUE KEY `uk_proj_lang_key` (`project_id`,`language_id`,`translation_key_id`),
  KEY `project_translations_language_id_fkey` (`language_id`),
  KEY `project_translations_translation_key_id_fkey` (`translation_key_id`),
  KEY `project_translations_updated_by_user_id_fkey` (`updated_by_user_id`),
  CONSTRAINT `project_translations_language_id_fkey` FOREIGN KEY (`language_id`) REFERENCES `languages` (`id`) ON DELETE CASCADE,
  CONSTRAINT `project_translations_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `project_translations_translation_key_id_fkey` FOREIGN KEY (`translation_key_id`) REFERENCES `translation_keys` (`id`) ON DELETE CASCADE,
  CONSTRAINT `project_translations_updated_by_user_id_fkey` FOREIGN KEY (`updated_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=3768 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_translations`
--

/*!40000 ALTER TABLE `project_translations` DISABLE KEYS */;
INSERT INTO `project_translations` VALUES (1821,1,1,1,'Đang khởi tạo không gian 360°',NULL,'0000-00-00 00:00:00'),(1822,1,2,1,'Initializing 360° space',NULL,'0000-00-00 00:00:00'),(1826,1,1,2,'Bản đồ 2D',NULL,'0000-00-00 00:00:00'),(1827,1,2,2,'2D Map',NULL,'0000-00-00 00:00:00'),(1831,1,1,3,'Bản đồ 2D',NULL,'0000-00-00 00:00:00'),(1832,1,2,3,'2D Map',NULL,'0000-00-00 00:00:00'),(1836,1,1,4,'Thư viện',NULL,'0000-00-00 00:00:00'),(1837,1,2,4,'Gallery',NULL,'0000-00-00 00:00:00'),(1841,1,1,5,'Thư viện ảnh',NULL,'0000-00-00 00:00:00'),(1842,1,2,5,'Photo gallery',NULL,'0000-00-00 00:00:00'),(1846,1,1,6,'Đặt lịch',NULL,'0000-00-00 00:00:00'),(1847,1,2,6,'Book a visit',NULL,'0000-00-00 00:00:00'),(1851,1,1,7,'Giá từ',NULL,'0000-00-00 00:00:00'),(1852,1,2,7,'From',NULL,'0000-00-00 00:00:00'),(1856,1,1,8,'Xem bảng giá & ưu đãi',NULL,'0000-00-00 00:00:00'),(1857,1,2,8,'View pricing & offers',NULL,'0000-00-00 00:00:00'),(1861,1,1,9,'Tải brochure PDF',NULL,'0000-00-00 00:00:00'),(1862,1,2,9,'Download PDF brochure',NULL,'0000-00-00 00:00:00'),(1866,1,1,10,'Kéo để xoay · Cuộn để zoom',NULL,'0000-00-00 00:00:00'),(1867,1,2,10,'Drag to rotate · Scroll to zoom',NULL,'0000-00-00 00:00:00'),(1871,1,1,11,'Tìm kiếm…',NULL,'0000-00-00 00:00:00'),(1872,1,2,11,'Search…',NULL,'0000-00-00 00:00:00'),(1876,1,1,12,'Thu gọn',NULL,'0000-00-00 00:00:00'),(1877,1,2,12,'Collapse',NULL,'0000-00-00 00:00:00'),(1881,1,1,13,'Mở rộng thông tin dự án',NULL,'0000-00-00 00:00:00'),(1882,1,2,13,'Expand project info',NULL,'0000-00-00 00:00:00'),(1886,1,1,14,'Mở bảng điều hướng',NULL,'0000-00-00 00:00:00'),(1887,1,2,14,'Open navigation panel',NULL,'0000-00-00 00:00:00'),(1891,1,1,15,'Hiện giao diện',NULL,'0000-00-00 00:00:00'),(1892,1,2,15,'Show interface',NULL,'0000-00-00 00:00:00'),(1896,1,1,16,'Chat với trợ lý AI',NULL,'0000-00-00 00:00:00'),(1897,1,2,16,'Chat with AI assistant',NULL,'0000-00-00 00:00:00'),(1901,1,1,17,'Bỏ qua',NULL,'0000-00-00 00:00:00'),(1902,1,2,17,'Skip',NULL,'0000-00-00 00:00:00'),(1906,1,1,18,'Click bất kỳ đâu để tiếp tục →',NULL,'0000-00-00 00:00:00'),(1907,1,2,18,'Click anywhere to continue →',NULL,'0000-00-00 00:00:00'),(1911,1,1,19,'Bước {n} / {total}',NULL,'0000-00-00 00:00:00'),(1912,1,2,19,'Step {n} / {total}',NULL,'0000-00-00 00:00:00'),(1916,1,1,20,'Xem 360°',NULL,'0000-00-00 00:00:00'),(1917,1,2,20,'View in 360°',NULL,'0000-00-00 00:00:00'),(1921,1,1,21,'Tiện ích lân cận',NULL,'0000-00-00 00:00:00'),(1922,1,2,21,'Nearby amenity',NULL,'0000-00-00 00:00:00'),(1926,1,1,22,'Không tìm thấy mục phù hợp',NULL,'0000-00-00 00:00:00'),(1927,1,2,22,'No matching items',NULL,'0000-00-00 00:00:00'),(1931,1,1,23,'căn',NULL,'0000-00-00 00:00:00'),(1932,1,2,23,'units',NULL,'0000-00-00 00:00:00'),(1936,1,1,24,'Tự xoay',NULL,'0000-00-00 00:00:00'),(1937,1,2,24,'Auto-rotate',NULL,'0000-00-00 00:00:00'),(1941,1,1,25,'Phóng to',NULL,'0000-00-00 00:00:00'),(1942,1,2,25,'Zoom in',NULL,'0000-00-00 00:00:00'),(1946,1,1,26,'Thu nhỏ',NULL,'0000-00-00 00:00:00'),(1947,1,2,26,'Zoom out',NULL,'0000-00-00 00:00:00'),(1951,1,1,27,'Toàn màn hình',NULL,'0000-00-00 00:00:00'),(1952,1,2,27,'Fullscreen',NULL,'0000-00-00 00:00:00'),(1956,1,1,28,'Hướng dẫn sử dụng',NULL,'0000-00-00 00:00:00'),(1957,1,2,28,'User guide',NULL,'0000-00-00 00:00:00'),(1961,1,1,29,'Ngôn ngữ',NULL,'0000-00-00 00:00:00'),(1962,1,2,29,'Language',NULL,'0000-00-00 00:00:00'),(1966,1,1,30,'BẢNG GIÁ & CĂN HỘ CÒN TRỐNG',NULL,'0000-00-00 00:00:00'),(1967,1,2,30,'PRICING & AVAILABLE UNITS',NULL,'0000-00-00 00:00:00'),(1971,1,1,31,'Tháp A — Mở bán giai đoạn 2',NULL,'0000-00-00 00:00:00'),(1972,1,2,31,'Tower A — Phase 2 launch',NULL,'0000-00-00 00:00:00'),(1976,1,1,32,'Quỹ căn hiện hữu cập nhật theo thời gian thực. Ưu đãi giai đoạn 2: chiết khấu 8% cho thanh toán sớm, cam kết thuê lại 7%/năm trong 24 tháng đầu tiên.',NULL,'0000-00-00 00:00:00'),(1977,1,2,32,'Available inventory updated in real time. Phase 2 offers: 8% early-payment discount and 7%/year guaranteed leaseback for the first 24 months.',NULL,'0000-00-00 00:00:00'),(1981,1,1,33,'Mã căn',NULL,'0000-00-00 00:00:00'),(1982,1,2,33,'Code',NULL,'0000-00-00 00:00:00'),(1986,1,1,34,'Loại',NULL,'0000-00-00 00:00:00'),(1987,1,2,34,'Type',NULL,'0000-00-00 00:00:00'),(1991,1,1,35,'Diện tích',NULL,'0000-00-00 00:00:00'),(1992,1,2,35,'Area',NULL,'0000-00-00 00:00:00'),(1996,1,1,36,'Giá từ',NULL,'0000-00-00 00:00:00'),(1997,1,2,36,'From',NULL,'0000-00-00 00:00:00'),(2001,1,1,37,'Còn lại',NULL,'0000-00-00 00:00:00'),(2002,1,2,37,'Available',NULL,'0000-00-00 00:00:00'),(2006,1,1,38,'Để chúng tôi liên hệ lại',NULL,'0000-00-00 00:00:00'),(2007,1,2,38,'Have us call you back',NULL,'0000-00-00 00:00:00'),(2011,1,1,39,'Họ & tên',NULL,'0000-00-00 00:00:00'),(2012,1,2,39,'Full name',NULL,'0000-00-00 00:00:00'),(2016,1,1,40,'Nguyễn Văn A',NULL,'0000-00-00 00:00:00'),(2017,1,2,40,'John Doe',NULL,'0000-00-00 00:00:00'),(2021,1,1,41,'Số điện thoại',NULL,'0000-00-00 00:00:00'),(2022,1,2,41,'Phone number',NULL,'0000-00-00 00:00:00'),(2026,1,1,42,'09xx xxx xxx',NULL,'0000-00-00 00:00:00'),(2027,1,2,42,'09xx xxx xxx',NULL,'0000-00-00 00:00:00'),(2031,1,1,43,'Loại căn quan tâm',NULL,'0000-00-00 00:00:00'),(2032,1,2,43,'Unit type of interest',NULL,'0000-00-00 00:00:00'),(2036,1,1,44,'2 phòng ngủ',NULL,'0000-00-00 00:00:00'),(2037,1,2,44,'2 bedrooms',NULL,'0000-00-00 00:00:00'),(2041,1,1,45,'2 phòng ngủ +1',NULL,'0000-00-00 00:00:00'),(2042,1,2,45,'2 bedrooms +1',NULL,'0000-00-00 00:00:00'),(2046,1,1,46,'3 phòng ngủ',NULL,'0000-00-00 00:00:00'),(2047,1,2,46,'3 bedrooms',NULL,'0000-00-00 00:00:00'),(2051,1,1,47,'Duplex / Penthouse',NULL,'0000-00-00 00:00:00'),(2052,1,2,47,'Duplex / Penthouse',NULL,'0000-00-00 00:00:00'),(2056,1,1,48,'Ghi chú',NULL,'0000-00-00 00:00:00'),(2057,1,2,48,'Note',NULL,'0000-00-00 00:00:00'),(2061,1,1,49,'Tôi muốn được tư vấn vào cuối tuần…',NULL,'0000-00-00 00:00:00'),(2062,1,2,49,'I\'d like a consultation on the weekend…',NULL,'0000-00-00 00:00:00'),(2066,1,1,50,'Gửi yêu cầu tư vấn',NULL,'0000-00-00 00:00:00'),(2067,1,2,50,'Submit consultation request',NULL,'0000-00-00 00:00:00'),(2071,1,1,51,'Tiến độ dự án',NULL,'0000-00-00 00:00:00'),(2072,1,2,51,'Project timeline',NULL,'0000-00-00 00:00:00'),(2076,1,1,52,'Mặt bằng tổng thể',NULL,'0000-00-00 00:00:00'),(2077,1,2,52,'Master plan',NULL,'0000-00-00 00:00:00'),(2081,1,1,53,'Bản đồ thiết kế 2D',NULL,'0000-00-00 00:00:00'),(2082,1,2,53,'2D design map',NULL,'0000-00-00 00:00:00'),(2086,1,1,54,'Bấm vào các điểm trên bản đồ để vào không gian 360° tương ứng',NULL,'0000-00-00 00:00:00'),(2087,1,2,54,'Click points on the map to enter the corresponding 360° space',NULL,'0000-00-00 00:00:00'),(2091,1,1,55,'Thư viện hình ảnh',NULL,'0000-00-00 00:00:00'),(2092,1,2,55,'Image gallery',NULL,'0000-00-00 00:00:00'),(2096,1,1,56,'Khám phá Vinhomes Hai Van Bay',NULL,'0000-00-00 00:00:00'),(2097,1,2,56,'Explore Vinhomes Hai Van Bay',NULL,'0000-00-00 00:00:00'),(2101,1,1,57,'Trợ lý Vinhomes Hai Van Bay',NULL,'0000-00-00 00:00:00'),(2102,1,2,57,'Vinhomes Hai Van Bay Assistant',NULL,'0000-00-00 00:00:00'),(2106,1,1,58,'Đang hoạt động',NULL,'0000-00-00 00:00:00'),(2107,1,2,58,'Active',NULL,'0000-00-00 00:00:00'),(2111,1,1,59,'Đang lắng nghe…',NULL,'0000-00-00 00:00:00'),(2112,1,2,59,'Listening…',NULL,'0000-00-00 00:00:00'),(2116,1,1,60,'Đang suy nghĩ…',NULL,'0000-00-00 00:00:00'),(2117,1,2,60,'Thinking…',NULL,'0000-00-00 00:00:00'),(2121,1,1,61,'Đang trả lời…',NULL,'0000-00-00 00:00:00'),(2122,1,2,61,'Replying…',NULL,'0000-00-00 00:00:00'),(2126,1,1,62,'Nhập câu hỏi…',NULL,'0000-00-00 00:00:00'),(2127,1,2,62,'Type your question…',NULL,'0000-00-00 00:00:00'),(2131,1,1,63,'Đóng',NULL,'0000-00-00 00:00:00'),(2132,1,2,63,'Close',NULL,'0000-00-00 00:00:00'),(2136,1,1,64,'Trình duyệt chưa hỗ trợ nhận dạng giọng nói. Vui lòng dùng Chrome hoặc Edge.',NULL,'0000-00-00 00:00:00'),(2137,1,2,64,'Your browser does not support speech recognition. Please use Chrome or Edge.',NULL,'0000-00-00 00:00:00'),(2141,1,1,65,'Bạn cần cho phép truy cập micro để dùng tính năng trò chuyện bằng giọng nói.',NULL,'0000-00-00 00:00:00'),(2142,1,2,65,'You need to allow microphone access to use voice chat.',NULL,'0000-00-00 00:00:00'),(2146,1,1,66,'Không thể kết nối dịch vụ nhận dạng giọng nói. Vui lòng thử lại sau.',NULL,'0000-00-00 00:00:00'),(2147,1,2,66,'Cannot connect to speech recognition service. Please try again later.',NULL,'0000-00-00 00:00:00'),(2151,1,1,67,'Cảm ơn câu hỏi của bạn: \"{q}\". Đây là phản hồi mẫu — tích hợp LLM thật sẽ thay thế hàm generateReply().',NULL,'0000-00-00 00:00:00'),(2152,1,2,67,'Thanks for your question: \"{q}\". This is a sample reply — real LLM integration will replace generateReply().',NULL,'0000-00-00 00:00:00'),(2156,1,1,68,'Logo dự án — quay về tổng quan.',NULL,'0000-00-00 00:00:00'),(2157,1,2,68,'Project logo — return to overview.',NULL,'0000-00-00 00:00:00'),(2161,1,1,69,'Bản đồ thiết kế 2D — các điểm chạm dẫn vào không gian 360°.',NULL,'0000-00-00 00:00:00'),(2162,1,2,69,'2D design map — touch points lead into 360° spaces.',NULL,'0000-00-00 00:00:00'),(2166,1,1,70,'Quy hoạch tổng thể — xem mặt bằng phân khu toàn dự án.',NULL,'0000-00-00 00:00:00'),(2167,1,2,70,'Master plan — view the subdivision layout of the whole project.',NULL,'0000-00-00 00:00:00'),(2171,1,1,71,'Bất động sản — danh sách sản phẩm, căn hộ đang mở bán.',NULL,'0000-00-00 00:00:00'),(2172,1,2,71,'Properties — list of units and apartments on sale.',NULL,'0000-00-00 00:00:00'),(2176,1,1,72,'Tiện ích dự án — khám phá tiện ích nội/ngoại khu.',NULL,'0000-00-00 00:00:00'),(2177,1,2,72,'Project amenities — explore internal and external facilities.',NULL,'0000-00-00 00:00:00'),(2181,1,1,73,'Pháp lý & Uy tín — hồ sơ pháp lý, ngân hàng bảo lãnh, đánh giá cư dân.',NULL,'0000-00-00 00:00:00'),(2182,1,2,73,'Legal & Credibility — legal records, guarantor banks, resident reviews.',NULL,'0000-00-00 00:00:00'),(2186,1,1,74,'Vị trí dự án — bản đồ và các tiện ích xung quanh.',NULL,'0000-00-00 00:00:00'),(2187,1,2,74,'Project location — map and surrounding amenities.',NULL,'0000-00-00 00:00:00'),(2191,1,1,75,'Tiến độ dự án — xem các mốc thi công và bàn giao.',NULL,'0000-00-00 00:00:00'),(2192,1,2,75,'Project timeline — view construction and handover milestones.',NULL,'0000-00-00 00:00:00'),(2196,1,1,76,'Thư viện ảnh dự án.',NULL,'0000-00-00 00:00:00'),(2197,1,2,76,'Project photo gallery.',NULL,'0000-00-00 00:00:00'),(2201,1,1,77,'Tài liệu dự án — brochure, bảng giá, mặt bằng để tải về.',NULL,'0000-00-00 00:00:00'),(2202,1,2,77,'Project documents — brochure, price list, floor plans to download.',NULL,'0000-00-00 00:00:00'),(2206,1,1,78,'Đặt lịch tham quan và xem bảng giá chi tiết.',NULL,'0000-00-00 00:00:00'),(2207,1,2,78,'Book a tour and view detailed pricing.',NULL,'0000-00-00 00:00:00'),(2211,1,1,79,'Cụm điều khiển — tự xoay, zoom, toàn màn hình, chọn ngôn ngữ và mở lại hướng dẫn.',NULL,'0000-00-00 00:00:00'),(2212,1,2,79,'Controls — auto-rotate, zoom, fullscreen, language and reopen the guide.',NULL,'0000-00-00 00:00:00'),(2216,1,1,80,'Bật/tắt tự xoay panorama 360°.',NULL,'0000-00-00 00:00:00'),(2217,1,2,80,'Toggle 360° panorama auto-rotate.',NULL,'0000-00-00 00:00:00'),(2221,1,1,81,'Phóng to góc nhìn.',NULL,'0000-00-00 00:00:00'),(2222,1,2,81,'Zoom in.',NULL,'0000-00-00 00:00:00'),(2226,1,1,82,'Thu nhỏ góc nhìn.',NULL,'0000-00-00 00:00:00'),(2227,1,2,82,'Zoom out.',NULL,'0000-00-00 00:00:00'),(2231,1,1,83,'Bật chế độ toàn màn hình.',NULL,'0000-00-00 00:00:00'),(2232,1,2,83,'Enter fullscreen mode.',NULL,'0000-00-00 00:00:00'),(2236,1,1,84,'Đa ngôn ngữ — chọn ngôn ngữ hiển thị (Việt, Anh, Trung, Hàn, Nhật).',NULL,'0000-00-00 00:00:00'),(2237,1,2,84,'Multi-language — choose the display language (Vietnamese, English, Chinese, Korean, Japanese).',NULL,'0000-00-00 00:00:00'),(2241,1,1,85,'Mở lại hướng dẫn này bất cứ lúc nào.',NULL,'0000-00-00 00:00:00'),(2242,1,2,85,'Reopen this guide anytime.',NULL,'0000-00-00 00:00:00'),(2246,1,1,86,'Bảng điều hướng trái — chứa thông tin scene và danh sách các nhóm.',NULL,'0000-00-00 00:00:00'),(2247,1,2,86,'Left navigation — scene info and group list.',NULL,'0000-00-00 00:00:00'),(2251,1,1,87,'Tìm kiếm nhanh trong toàn bộ danh sách.',NULL,'0000-00-00 00:00:00'),(2252,1,2,87,'Quickly search the entire list.',NULL,'0000-00-00 00:00:00'),(2256,1,1,88,'Các nhóm: Tổng quan, Tiện ích nội/ngoại khu, Mặt bằng, Căn hộ. Click vào tiêu đề để mở/đóng nhóm, click vào mục con để chuyển không gian 360°.',NULL,'0000-00-00 00:00:00'),(2257,1,2,88,'Groups: Overview, Internal/External amenities, Floor plans, Units. Click headers to expand/collapse, click items to switch the 360° space.',NULL,'0000-00-00 00:00:00'),(2261,1,1,89,'Thu gọn bảng điều hướng để xem panorama rộng hơn.',NULL,'0000-00-00 00:00:00'),(2262,1,2,89,'Collapse the navigation panel for a wider panorama view.',NULL,'0000-00-00 00:00:00'),(2266,1,1,90,'Thông tin dự án: giá, trạng thái, các chỉ số chính.',NULL,'0000-00-00 00:00:00'),(2267,1,2,90,'Project info: price, status, key stats.',NULL,'0000-00-00 00:00:00'),(2271,1,1,91,'Thu gọn bảng thông tin dự án bên phải.',NULL,'0000-00-00 00:00:00'),(2272,1,2,91,'Collapse the project info panel on the right.',NULL,'0000-00-00 00:00:00'),(2276,1,1,92,'Mở lại bảng thông tin dự án khi đã thu gọn.',NULL,'0000-00-00 00:00:00'),(2277,1,2,92,'Reopen the project info panel when collapsed.',NULL,'0000-00-00 00:00:00'),(2281,1,1,93,'Trợ lý AI — chat text hoặc trò chuyện bằng giọng nói.',NULL,'0000-00-00 00:00:00'),(2282,1,2,93,'AI assistant — text chat or voice conversation.',NULL,'0000-00-00 00:00:00'),(2286,1,1,94,'Khi giao diện bị ẩn (do kéo xoay 360°), bấm nút này để hiện lại.',NULL,'0000-00-00 00:00:00'),(2287,1,2,94,'When the UI auto-hides (while dragging the 360° view), click this to bring it back.',NULL,'0000-00-00 00:00:00'),(2291,1,1,95,'Hotspot trong khung 360° — click để vào không gian khác hoặc xem mô tả.',NULL,'0000-00-00 00:00:00'),(2292,1,2,95,'Hotspot inside the 360° view — click to navigate or view a description.',NULL,'0000-00-00 00:00:00'),(2296,1,1,96,'VR360 EXPERIENCE',NULL,'0000-00-00 00:00:00'),(2297,1,2,96,'VR360 EXPERIENCE',NULL,'0000-00-00 00:00:00'),(2301,1,1,97,'Hết ưu đãi',NULL,'0000-00-00 00:00:00'),(2302,1,2,97,'Offer expired',NULL,'0000-00-00 00:00:00'),(2306,1,1,98,'Không tìm thấy căn phù hợp với bộ lọc',NULL,'0000-00-00 00:00:00'),(2307,1,2,98,'No units match the filter',NULL,'0000-00-00 00:00:00'),(2311,1,1,99,'Studio',NULL,'0000-00-00 00:00:00'),(2312,1,2,99,'Studio',NULL,'0000-00-00 00:00:00'),(2316,1,1,100,'— Chọn loại căn —',NULL,'0000-00-00 00:00:00'),(2317,1,2,100,'— Select unit type —',NULL,'0000-00-00 00:00:00'),(2321,1,1,101,'Xoá',NULL,'0000-00-00 00:00:00'),(2322,1,2,101,'Remove',NULL,'0000-00-00 00:00:00'),(2326,1,1,102,'Vui lòng điền Họ tên và Số điện thoại.',NULL,'0000-00-00 00:00:00'),(2327,1,2,102,'Please enter your name and phone number.',NULL,'0000-00-00 00:00:00'),(2331,1,1,103,'Số điện thoại chưa đúng định dạng (VD: 0901 234 567).',NULL,'0000-00-00 00:00:00'),(2332,1,2,103,'Phone number format is invalid (e.g. 0901 234 567).',NULL,'0000-00-00 00:00:00'),(2336,1,1,104,'Đang gửi…',NULL,'0000-00-00 00:00:00'),(2337,1,2,104,'Sending…',NULL,'0000-00-00 00:00:00'),(2341,1,1,105,'Email',NULL,'0000-00-00 00:00:00'),(2342,1,2,105,'Email',NULL,'0000-00-00 00:00:00'),(2346,1,1,106,'(tuỳ chọn)',NULL,'0000-00-00 00:00:00'),(2347,1,2,106,'(optional)',NULL,'0000-00-00 00:00:00'),(2351,1,1,107,'Zalo',NULL,'0000-00-00 00:00:00'),(2352,1,2,107,'Zalo',NULL,'0000-00-00 00:00:00'),(2356,1,1,108,'(nếu khác SĐT)',NULL,'0000-00-00 00:00:00'),(2357,1,2,108,'(if different from phone)',NULL,'0000-00-00 00:00:00'),(2361,1,1,109,'Mã căn quan tâm',NULL,'0000-00-00 00:00:00'),(2362,1,2,109,'Units of interest',NULL,'0000-00-00 00:00:00'),(2366,1,1,110,'Ngân sách dự kiến',NULL,'0000-00-00 00:00:00'),(2367,1,2,110,'Estimated budget',NULL,'0000-00-00 00:00:00'),(2371,1,1,111,'Dưới 5 tỷ',NULL,'0000-00-00 00:00:00'),(2372,1,2,111,'Under 5B',NULL,'0000-00-00 00:00:00'),(2376,1,1,112,'5 – 8 tỷ',NULL,'0000-00-00 00:00:00'),(2377,1,2,112,'5 – 8B',NULL,'0000-00-00 00:00:00'),(2381,1,1,113,'8 – 12 tỷ',NULL,'0000-00-00 00:00:00'),(2382,1,2,113,'8 – 12B',NULL,'0000-00-00 00:00:00'),(2386,1,1,114,'Trên 12 tỷ',NULL,'0000-00-00 00:00:00'),(2387,1,2,114,'Over 12B',NULL,'0000-00-00 00:00:00'),(2391,1,1,115,'Mục đích mua',NULL,'0000-00-00 00:00:00'),(2392,1,2,115,'Purchase purpose',NULL,'0000-00-00 00:00:00'),(2396,1,1,116,'Ở thực',NULL,'0000-00-00 00:00:00'),(2397,1,2,116,'To live in',NULL,'0000-00-00 00:00:00'),(2401,1,1,117,'Đầu tư',NULL,'0000-00-00 00:00:00'),(2402,1,2,117,'Investment',NULL,'0000-00-00 00:00:00'),(2406,1,1,118,'Cả hai',NULL,'0000-00-00 00:00:00'),(2407,1,2,118,'Both',NULL,'0000-00-00 00:00:00'),(2411,1,1,119,'Thời gian muốn xem',NULL,'0000-00-00 00:00:00'),(2412,1,2,119,'Preferred visit time',NULL,'0000-00-00 00:00:00'),(2416,1,1,120,'Cuối tuần',NULL,'0000-00-00 00:00:00'),(2417,1,2,120,'Weekend',NULL,'0000-00-00 00:00:00'),(2421,1,1,121,'Tuần tới',NULL,'0000-00-00 00:00:00'),(2422,1,2,121,'Next week',NULL,'0000-00-00 00:00:00'),(2426,1,1,122,'Linh hoạt',NULL,'0000-00-00 00:00:00'),(2427,1,2,122,'Flexible',NULL,'0000-00-00 00:00:00'),(2431,1,1,123,'Đồng ý nhận thông tin qua <strong>Zalo</strong>',NULL,'0000-00-00 00:00:00'),(2432,1,2,123,'Agree to receive info via <strong>Zalo</strong>',NULL,'0000-00-00 00:00:00'),(2436,1,1,124,'Đồng ý nhận thông tin qua <strong>SMS</strong>',NULL,'0000-00-00 00:00:00'),(2437,1,2,124,'Agree to receive info via <strong>SMS</strong>',NULL,'0000-00-00 00:00:00'),(2441,1,1,125,'Đã gửi thành công!',NULL,'0000-00-00 00:00:00'),(2442,1,2,125,'Sent successfully!',NULL,'0000-00-00 00:00:00'),(2446,1,1,126,'Chúng tôi sẽ liên hệ lại trong <strong>vòng 30 phút</strong> trong giờ làm việc.',NULL,'0000-00-00 00:00:00'),(2447,1,2,126,'We will contact you within <strong>30 minutes</strong> during business hours.',NULL,'0000-00-00 00:00:00'),(2451,1,1,127,'Chat Zalo ngay',NULL,'0000-00-00 00:00:00'),(2452,1,2,127,'Chat on Zalo now',NULL,'0000-00-00 00:00:00'),(2456,1,1,128,'Gửi yêu cầu khác',NULL,'0000-00-00 00:00:00'),(2457,1,2,128,'Send another request',NULL,'0000-00-00 00:00:00'),(2461,1,1,129,'Đặt lịch tham quan',NULL,'0000-00-00 00:00:00'),(2462,1,2,129,'Book a tour',NULL,'0000-00-00 00:00:00'),(2466,1,1,130,'Chọn căn',NULL,'0000-00-00 00:00:00'),(2467,1,2,130,'Choose unit',NULL,'0000-00-00 00:00:00'),(2471,1,1,131,'Thông tin',NULL,'0000-00-00 00:00:00'),(2472,1,2,131,'Information',NULL,'0000-00-00 00:00:00'),(2476,1,1,132,'Xác nhận',NULL,'0000-00-00 00:00:00'),(2477,1,2,132,'Confirm',NULL,'0000-00-00 00:00:00'),(2481,1,1,133,'Căn hộ quan tâm',NULL,'0000-00-00 00:00:00'),(2482,1,2,133,'Unit of interest',NULL,'0000-00-00 00:00:00'),(2486,1,1,134,'Chưa chọn căn cụ thể →',NULL,'0000-00-00 00:00:00'),(2487,1,2,134,'Skip unit selection →',NULL,'0000-00-00 00:00:00'),(2491,1,1,135,'Tất cả',NULL,'0000-00-00 00:00:00'),(2492,1,2,135,'All',NULL,'0000-00-00 00:00:00'),(2496,1,1,136,'Hướng',NULL,'0000-00-00 00:00:00'),(2497,1,2,136,'Dir.',NULL,'0000-00-00 00:00:00'),(2501,1,1,137,'Tầng',NULL,'0000-00-00 00:00:00'),(2502,1,2,137,'Floor',NULL,'0000-00-00 00:00:00'),(2506,1,1,138,'Tiếp theo',NULL,'0000-00-00 00:00:00'),(2507,1,2,138,'Next',NULL,'0000-00-00 00:00:00'),(2511,1,1,139,'Gửi yêu cầu',NULL,'0000-00-00 00:00:00'),(2512,1,2,139,'Submit',NULL,'0000-00-00 00:00:00'),(2516,1,1,140,'Quay lại',NULL,'0000-00-00 00:00:00'),(2517,1,2,140,'Back',NULL,'0000-00-00 00:00:00'),(2521,1,1,141,'Kiểm tra lại thông tin',NULL,'0000-00-00 00:00:00'),(2522,1,2,141,'Review your information',NULL,'0000-00-00 00:00:00'),(2526,1,1,142,'Nhấn <strong style=\"color:var(--accent)\">Gửi yêu cầu</strong> để hoàn tất.<br/>Chúng tôi sẽ liên hệ trong <strong style=\"color:var(--fg)\">30 phút</strong>.',NULL,'0000-00-00 00:00:00'),(2527,1,2,142,'Press <strong style=\"color:var(--accent)\">Submit</strong> to complete.<br/>We will contact you within <strong style=\"color:var(--fg)\">30 minutes</strong>.',NULL,'0000-00-00 00:00:00'),(2531,1,1,143,'Đã gửi thành công!',NULL,'0000-00-00 00:00:00'),(2532,1,2,143,'Sent successfully!',NULL,'0000-00-00 00:00:00'),(2536,1,1,144,'Chúng tôi sẽ liên hệ lại trong <strong>vòng 30 phút</strong> trong giờ làm việc.',NULL,'0000-00-00 00:00:00'),(2537,1,2,144,'We will contact you within <strong>30 minutes</strong> during business hours.',NULL,'0000-00-00 00:00:00'),(2541,1,1,145,'Chat Zalo ngay',NULL,'0000-00-00 00:00:00'),(2542,1,2,145,'Chat on Zalo now',NULL,'0000-00-00 00:00:00'),(2546,1,1,146,'Gửi yêu cầu khác',NULL,'0000-00-00 00:00:00'),(2547,1,2,146,'Send another request',NULL,'0000-00-00 00:00:00'),(2551,1,1,147,'Căn đã chọn',NULL,'0000-00-00 00:00:00'),(2552,1,2,147,'Selected unit',NULL,'0000-00-00 00:00:00'),(2556,1,1,148,'Thông tin liên hệ',NULL,'0000-00-00 00:00:00'),(2557,1,2,148,'Contact information',NULL,'0000-00-00 00:00:00'),(2561,1,1,149,'Yêu cầu',NULL,'0000-00-00 00:00:00'),(2562,1,2,149,'Request',NULL,'0000-00-00 00:00:00'),(2566,1,1,150,'Họ tên',NULL,'0000-00-00 00:00:00'),(2567,1,2,150,'Name',NULL,'0000-00-00 00:00:00'),(2571,1,1,151,'Điện thoại',NULL,'0000-00-00 00:00:00'),(2572,1,2,151,'Phone',NULL,'0000-00-00 00:00:00'),(2576,1,1,152,'Ngân sách',NULL,'0000-00-00 00:00:00'),(2577,1,2,152,'Budget',NULL,'0000-00-00 00:00:00'),(2581,1,1,153,'Mục đích',NULL,'0000-00-00 00:00:00'),(2582,1,2,153,'Purpose',NULL,'0000-00-00 00:00:00'),(2586,1,1,154,'Thời gian xem',NULL,'0000-00-00 00:00:00'),(2587,1,2,154,'Visit time',NULL,'0000-00-00 00:00:00'),(2591,1,1,155,'Ghi chú',NULL,'0000-00-00 00:00:00'),(2592,1,2,155,'Note',NULL,'0000-00-00 00:00:00'),(2596,1,1,156,'Nhận tin',NULL,'0000-00-00 00:00:00'),(2597,1,2,156,'Notifications',NULL,'0000-00-00 00:00:00'),(2601,1,1,157,'Masterplan',NULL,'0000-00-00 00:00:00'),(2602,1,2,157,'Masterplan',NULL,'0000-00-00 00:00:00'),(2606,1,1,158,'Bất động sản',NULL,'0000-00-00 00:00:00'),(2607,1,2,158,'Properties',NULL,'0000-00-00 00:00:00'),(2611,1,1,159,'Tiện ích',NULL,'0000-00-00 00:00:00'),(2612,1,2,159,'Amenities',NULL,'0000-00-00 00:00:00'),(2616,1,1,160,'Pháp lý',NULL,'0000-00-00 00:00:00'),(2617,1,2,160,'Legal',NULL,'0000-00-00 00:00:00'),(2621,1,1,161,'Vị trí',NULL,'0000-00-00 00:00:00'),(2622,1,2,161,'Location',NULL,'0000-00-00 00:00:00'),(2626,1,1,162,'Tiến độ',NULL,'0000-00-00 00:00:00'),(2627,1,2,162,'Progress',NULL,'0000-00-00 00:00:00'),(2631,1,1,163,'Tài liệu',NULL,'0000-00-00 00:00:00'),(2632,1,2,163,'Documents',NULL,'0000-00-00 00:00:00'),(2636,1,1,164,'Menu',NULL,'0000-00-00 00:00:00'),(2637,1,2,164,'Menu',NULL,'0000-00-00 00:00:00'),(2641,1,1,165,'Thông tin dự án',NULL,'0000-00-00 00:00:00'),(2642,1,2,165,'Project info',NULL,'0000-00-00 00:00:00'),(2646,1,1,166,'Mở thông tin dự án',NULL,'0000-00-00 00:00:00'),(2647,1,2,166,'Open project info',NULL,'0000-00-00 00:00:00'),(2651,1,1,167,'Quy hoạch tổng thể',NULL,'0000-00-00 00:00:00'),(2652,1,2,167,'Master plan',NULL,'0000-00-00 00:00:00'),(2656,1,1,168,'Bất động sản',NULL,'0000-00-00 00:00:00'),(2657,1,2,168,'Properties',NULL,'0000-00-00 00:00:00'),(2661,1,1,169,'Tiện ích dự án',NULL,'0000-00-00 00:00:00'),(2662,1,2,169,'Project amenities',NULL,'0000-00-00 00:00:00'),(2666,1,1,170,'Pháp lý & Uy tín',NULL,'0000-00-00 00:00:00'),(2667,1,2,170,'Legal & Credibility',NULL,'0000-00-00 00:00:00'),(2671,1,1,171,'Vị trí dự án',NULL,'0000-00-00 00:00:00'),(2672,1,2,171,'Project location',NULL,'0000-00-00 00:00:00'),(2676,1,1,172,'Tiến độ dự án',NULL,'0000-00-00 00:00:00'),(2677,1,2,172,'Project progress',NULL,'0000-00-00 00:00:00'),(2681,1,1,173,'Tài liệu dự án',NULL,'0000-00-00 00:00:00'),(2682,1,2,173,'Project documents',NULL,'0000-00-00 00:00:00'),(2686,1,1,174,'Đóng',NULL,'0000-00-00 00:00:00'),(2687,1,2,174,'Close',NULL,'0000-00-00 00:00:00'),(2691,1,1,175,'Tiện ích Vinhomes Hai Van Bay',NULL,'0000-00-00 00:00:00'),(2692,1,2,175,'Vinhomes Hai Van Bay amenities',NULL,'0000-00-00 00:00:00'),(2696,1,1,176,'Hệ thống tiện ích đẳng cấp',NULL,'0000-00-00 00:00:00'),(2697,1,2,176,'Premium amenity system',NULL,'0000-00-00 00:00:00'),(2701,1,1,177,'Nội khu',NULL,'0000-00-00 00:00:00'),(2702,1,2,177,'Internal',NULL,'0000-00-00 00:00:00'),(2706,1,1,178,'Cao tầng',NULL,'0000-00-00 00:00:00'),(2707,1,2,178,'High-rise',NULL,'0000-00-00 00:00:00'),(2711,1,1,179,'Dịch vụ',NULL,'0000-00-00 00:00:00'),(2712,1,2,179,'Services',NULL,'0000-00-00 00:00:00'),(2716,1,1,180,'Hạ tầng',NULL,'0000-00-00 00:00:00'),(2717,1,2,180,'Infrastructure',NULL,'0000-00-00 00:00:00'),(2721,1,1,181,'Pháp lý & Uy tín',NULL,'0000-00-00 00:00:00'),(2722,1,2,181,'Legal & Credibility',NULL,'0000-00-00 00:00:00'),(2726,1,1,182,'Minh bạch — Bảo đảm — Tin cậy',NULL,'0000-00-00 00:00:00'),(2727,1,2,182,'Transparent — Secured — Trusted',NULL,'0000-00-00 00:00:00'),(2731,1,1,183,'Hồ sơ pháp lý',NULL,'0000-00-00 00:00:00'),(2732,1,2,183,'Legal records',NULL,'0000-00-00 00:00:00'),(2736,1,1,184,'Cư dân nói gì',NULL,'0000-00-00 00:00:00'),(2737,1,2,184,'What residents say',NULL,'0000-00-00 00:00:00'),(2741,1,1,185,'Vị trí dự án',NULL,'0000-00-00 00:00:00'),(2742,1,2,185,'Project location',NULL,'0000-00-00 00:00:00'),(2746,1,1,186,'Kết nối hoàn hảo',NULL,'0000-00-00 00:00:00'),(2747,1,2,186,'Perfect connectivity',NULL,'0000-00-00 00:00:00'),(2751,1,1,187,'Tất cả',NULL,'0000-00-00 00:00:00'),(2752,1,2,187,'All',NULL,'0000-00-00 00:00:00'),(2756,1,1,188,'🏫 Trường học',NULL,'0000-00-00 00:00:00'),(2757,1,2,188,'🏫 Schools',NULL,'0000-00-00 00:00:00'),(2761,1,1,189,'🏥 Bệnh viện',NULL,'0000-00-00 00:00:00'),(2762,1,2,189,'🏥 Hospitals',NULL,'0000-00-00 00:00:00'),(2766,1,1,190,'🚇 Metro',NULL,'0000-00-00 00:00:00'),(2767,1,2,190,'🚇 Metro',NULL,'0000-00-00 00:00:00'),(2771,1,1,191,'🛍 TTTM',NULL,'0000-00-00 00:00:00'),(2772,1,2,191,'🛍 Malls',NULL,'0000-00-00 00:00:00'),(2776,1,1,192,'✈ Sân bay',NULL,'0000-00-00 00:00:00'),(2777,1,2,192,'✈ Airport',NULL,'0000-00-00 00:00:00'),(2781,1,1,193,'Tiến độ xây dựng',NULL,'0000-00-00 00:00:00'),(2782,1,2,193,'Construction progress',NULL,'0000-00-00 00:00:00'),(2786,1,1,194,'Cập nhật thực địa',NULL,'0000-00-00 00:00:00'),(2787,1,2,194,'On-site updates',NULL,'0000-00-00 00:00:00'),(2791,1,1,195,'Tài liệu',NULL,'0000-00-00 00:00:00'),(2792,1,2,195,'Documents',NULL,'0000-00-00 00:00:00'),(2796,1,1,196,'Brochure, Bảng giá, Bộ nhận diện',NULL,'0000-00-00 00:00:00'),(2797,1,2,196,'Brochure, Price list, Brand kit',NULL,'0000-00-00 00:00:00'),(2801,1,1,197,'Sản phẩm dự án',NULL,'0000-00-00 00:00:00'),(2802,1,2,197,'Project products',NULL,'0000-00-00 00:00:00'),(2806,1,1,198,'Bất động sản đang mở bán',NULL,'0000-00-00 00:00:00'),(2807,1,2,198,'Properties on sale',NULL,'0000-00-00 00:00:00'),(2811,1,1,199,'Tìm theo mã căn, tên sản phẩm…',NULL,'0000-00-00 00:00:00'),(2812,1,2,199,'Search by unit code or product name…',NULL,'0000-00-00 00:00:00'),(2816,1,1,200,'Lọc',NULL,'0000-00-00 00:00:00'),(2817,1,2,200,'Filter',NULL,'0000-00-00 00:00:00'),(2821,1,1,201,'Bộ lọc',NULL,'0000-00-00 00:00:00'),(2822,1,2,201,'Filters',NULL,'0000-00-00 00:00:00'),(2826,1,1,202,'Đóng bộ lọc',NULL,'0000-00-00 00:00:00'),(2827,1,2,202,'Close filters',NULL,'0000-00-00 00:00:00'),(2831,1,1,203,'Xóa bộ lọc',NULL,'0000-00-00 00:00:00'),(2832,1,2,203,'Clear filters',NULL,'0000-00-00 00:00:00'),(2836,1,1,204,'‹ Danh sách',NULL,'0000-00-00 00:00:00'),(2837,1,2,204,'‹ List',NULL,'0000-00-00 00:00:00'),(2841,1,1,205,'Mặt bằng',NULL,'0000-00-00 00:00:00'),(2842,1,2,205,'Floor plan',NULL,'0000-00-00 00:00:00'),(2846,1,1,206,'Phóng to',NULL,'0000-00-00 00:00:00'),(2847,1,2,206,'Zoom in',NULL,'0000-00-00 00:00:00'),(2851,1,1,207,'Thu nhỏ',NULL,'0000-00-00 00:00:00'),(2852,1,2,207,'Zoom out',NULL,'0000-00-00 00:00:00'),(2856,1,1,208,'Đặt lại',NULL,'0000-00-00 00:00:00'),(2857,1,2,208,'Reset',NULL,'0000-00-00 00:00:00'),(2861,1,1,209,'Cuộn để phóng to · Kéo để di chuyển',NULL,'0000-00-00 00:00:00'),(2862,1,2,209,'Scroll to zoom · Drag to pan',NULL,'0000-00-00 00:00:00'),(2866,1,1,210,'Bộ lọc Masterplan',NULL,'0000-00-00 00:00:00'),(2867,1,2,210,'Masterplan filters',NULL,'0000-00-00 00:00:00'),(2871,1,1,211,'Đặt lại',NULL,'0000-00-00 00:00:00'),(2872,1,2,211,'Reset',NULL,'0000-00-00 00:00:00'),(2876,1,1,212,'Áp dụng',NULL,'0000-00-00 00:00:00'),(2877,1,2,212,'Apply',NULL,'0000-00-00 00:00:00'),(2881,1,1,213,'Đóng',NULL,'0000-00-00 00:00:00'),(2882,1,2,213,'Close',NULL,'0000-00-00 00:00:00'),(2886,1,1,214,'Loại căn',NULL,'0000-00-00 00:00:00'),(2887,1,2,214,'Unit type',NULL,'0000-00-00 00:00:00'),(2891,1,1,215,'Nhóm tầng',NULL,'0000-00-00 00:00:00'),(2892,1,2,215,'Floor group',NULL,'0000-00-00 00:00:00'),(2896,1,1,216,'Trạng thái',NULL,'0000-00-00 00:00:00'),(2897,1,2,216,'Status',NULL,'0000-00-00 00:00:00'),(2901,1,1,217,'Xóa lọc',NULL,'0000-00-00 00:00:00'),(2902,1,2,217,'Clear filter',NULL,'0000-00-00 00:00:00'),(2906,1,1,218,'Tất cả',NULL,'0000-00-00 00:00:00'),(2907,1,2,218,'All',NULL,'0000-00-00 00:00:00'),(2911,1,1,219,'Thấp (1–15)',NULL,'0000-00-00 00:00:00'),(2912,1,2,219,'Low (1–15)',NULL,'0000-00-00 00:00:00'),(2916,1,1,220,'Trung (16–30)',NULL,'0000-00-00 00:00:00'),(2917,1,2,220,'Mid (16–30)',NULL,'0000-00-00 00:00:00'),(2921,1,1,221,'Cao (31+)',NULL,'0000-00-00 00:00:00'),(2922,1,2,221,'High (31+)',NULL,'0000-00-00 00:00:00'),(2926,1,1,222,'Tất cả',NULL,'0000-00-00 00:00:00'),(2927,1,2,222,'All',NULL,'0000-00-00 00:00:00'),(2931,1,1,223,'Còn trống',NULL,'0000-00-00 00:00:00'),(2932,1,2,223,'Available',NULL,'0000-00-00 00:00:00'),(2936,1,1,224,'Đang giữ',NULL,'0000-00-00 00:00:00'),(2937,1,2,224,'On hold',NULL,'0000-00-00 00:00:00'),(2941,1,1,225,'Đã bán',NULL,'0000-00-00 00:00:00'),(2942,1,2,225,'Sold',NULL,'0000-00-00 00:00:00'),(2946,1,1,226,'Tầng',NULL,'0000-00-00 00:00:00'),(2947,1,2,226,'Floor',NULL,'0000-00-00 00:00:00'),(2951,1,1,227,'DT (m²)',NULL,'0000-00-00 00:00:00'),(2952,1,2,227,'Area (m²)',NULL,'0000-00-00 00:00:00'),(2956,1,1,228,'Hướng',NULL,'0000-00-00 00:00:00'),(2957,1,2,228,'Direction',NULL,'0000-00-00 00:00:00'),(2961,1,1,229,'Giá/m²',NULL,'0000-00-00 00:00:00'),(2962,1,2,229,'Price/m²',NULL,'0000-00-00 00:00:00'),(2966,1,1,230,'TT',NULL,'0000-00-00 00:00:00'),(2967,1,2,230,'St.',NULL,'0000-00-00 00:00:00'),(2971,1,1,231,'Giá',NULL,'0000-00-00 00:00:00'),(2972,1,2,231,'Price',NULL,'0000-00-00 00:00:00'),(2976,1,1,596,'Phân khu',NULL,'0000-00-00 00:00:00'),(2977,1,1,597,'Phân khu',NULL,'0000-00-00 00:00:00'),(2978,1,1,598,'Tất cả',NULL,'0000-00-00 00:00:00'),(2979,1,1,599,'Đang lọc',NULL,'0000-00-00 00:00:00'),(2980,1,1,600,'Đang lọc theo',NULL,'0000-00-00 00:00:00'),(2981,1,1,601,'Tổng quan — hiển thị đầy đủ',NULL,'0000-00-00 00:00:00'),(2982,1,1,602,'Nội dung dự án',NULL,'0000-00-00 00:00:00'),(2983,1,1,603,'Chưa có nội dung',NULL,'0000-00-00 00:00:00'),(2984,1,1,232,'Khu Tây Hồ Tây, Hà Nội',NULL,'0000-00-00 00:00:00'),(2985,1,2,232,'Tay Ho Tay District, Hanoi',NULL,'0000-00-00 00:00:00'),(2989,1,1,233,'Đang mở bán giai đoạn 2',NULL,'0000-00-00 00:00:00'),(2990,1,2,233,'Phase 2 selling now',NULL,'0000-00-00 00:00:00'),(2994,1,1,234,'Từ 4.9 tỷ',NULL,'0000-00-00 00:00:00'),(2995,1,2,234,'From 4.9B VND',NULL,'0000-00-00 00:00:00'),(2999,1,1,235,'Bể bơi vô cực',NULL,'0000-00-00 00:00:00'),(3000,1,2,235,'Infinity pool',NULL,'0000-00-00 00:00:00'),(3004,1,1,236,'Gym & Yoga 1200m²',NULL,'0000-00-00 00:00:00'),(3005,1,2,236,'Gym & Yoga 1200m²',NULL,'0000-00-00 00:00:00'),(3009,1,1,237,'Spa & Onsen',NULL,'0000-00-00 00:00:00'),(3010,1,2,237,'Spa & Onsen',NULL,'0000-00-00 00:00:00'),(3014,1,1,238,'Trường liên cấp song ngữ',NULL,'0000-00-00 00:00:00'),(3015,1,2,238,'Bilingual K-12 school',NULL,'0000-00-00 00:00:00'),(3019,1,1,239,'TTTM 18.000 m²',NULL,'0000-00-00 00:00:00'),(3020,1,2,239,'Mall 18,000 m²',NULL,'0000-00-00 00:00:00'),(3024,1,1,240,'Công viên trung tâm',NULL,'0000-00-00 00:00:00'),(3025,1,2,240,'Central park',NULL,'0000-00-00 00:00:00'),(3029,1,1,241,'Sky lounge tầng 42',NULL,'0000-00-00 00:00:00'),(3030,1,2,241,'Sky lounge — 42F',NULL,'0000-00-00 00:00:00'),(3034,1,1,242,'Khu vui chơi trẻ em',NULL,'0000-00-00 00:00:00'),(3035,1,2,242,'Kids\' playground',NULL,'0000-00-00 00:00:00'),(3039,1,1,243,'Cây xanh nội khu',NULL,'0000-00-00 00:00:00'),(3040,1,2,243,'Internal greenery',NULL,'0000-00-00 00:00:00'),(3044,1,1,244,'Mật độ xây dựng',NULL,'0000-00-00 00:00:00'),(3045,1,2,244,'Building density',NULL,'0000-00-00 00:00:00'),(3049,1,1,245,'Tới hồ Tây',NULL,'0000-00-00 00:00:00'),(3050,1,2,245,'To West Lake',NULL,'0000-00-00 00:00:00'),(3054,1,1,246,'Tầm view panorama',NULL,'0000-00-00 00:00:00'),(3055,1,2,246,'Panorama view floors',NULL,'0000-00-00 00:00:00'),(3059,1,1,247,'ha',NULL,'0000-00-00 00:00:00'),(3060,1,2,247,'ha',NULL,'0000-00-00 00:00:00'),(3064,1,1,248,'phút',NULL,'0000-00-00 00:00:00'),(3065,1,2,248,'min',NULL,'0000-00-00 00:00:00'),(3069,1,1,249,'tầng',NULL,'0000-00-00 00:00:00'),(3070,1,2,249,'F',NULL,'0000-00-00 00:00:00'),(3074,1,1,250,'Tổng quan',NULL,'0000-00-00 00:00:00'),(3075,1,2,250,'Overview',NULL,'0000-00-00 00:00:00'),(3079,1,1,251,'Tiện ích nội khu',NULL,'0000-00-00 00:00:00'),(3080,1,2,251,'Internal amenities',NULL,'0000-00-00 00:00:00'),(3084,1,1,252,'Tiện ích ngoại khu',NULL,'0000-00-00 00:00:00'),(3085,1,2,252,'External amenities',NULL,'0000-00-00 00:00:00'),(3089,1,1,253,'Mặt bằng tầng',NULL,'0000-00-00 00:00:00'),(3090,1,2,253,'Floor plans',NULL,'0000-00-00 00:00:00'),(3094,1,1,254,'View 360 căn hộ',NULL,'0000-00-00 00:00:00'),(3095,1,2,254,'Unit 360° views',NULL,'0000-00-00 00:00:00'),(3099,1,1,255,'Tổng quan (Top View)',NULL,'0000-00-00 00:00:00'),(3100,1,2,255,'Overview (Top View)',NULL,'0000-00-00 00:00:00'),(3104,1,1,256,'Tổng quan (View 1)',NULL,'0000-00-00 00:00:00'),(3105,1,2,256,'Overview (View 1)',NULL,'0000-00-00 00:00:00'),(3109,1,1,257,'Tổng quan (View 2)',NULL,'0000-00-00 00:00:00'),(3110,1,2,257,'Overview (View 2)',NULL,'0000-00-00 00:00:00'),(3114,1,1,258,'Tổng quan (View 3)',NULL,'0000-00-00 00:00:00'),(3115,1,2,258,'Overview (View 3)',NULL,'0000-00-00 00:00:00'),(3119,1,1,259,'Tổng quan (View 4)',NULL,'0000-00-00 00:00:00'),(3120,1,2,259,'Overview (View 4)',NULL,'0000-00-00 00:00:00'),(3124,1,1,260,'Tổng quan (View 5)',NULL,'0000-00-00 00:00:00'),(3125,1,2,260,'Overview (View 5)',NULL,'0000-00-00 00:00:00'),(3129,1,1,261,'Bể bơi',NULL,'0000-00-00 00:00:00'),(3130,1,2,261,'Pool',NULL,'0000-00-00 00:00:00'),(3134,1,1,262,'Đường dạo bộ',NULL,'0000-00-00 00:00:00'),(3135,1,2,262,'Walking path',NULL,'0000-00-00 00:00:00'),(3139,1,1,263,'Sân chơi trẻ em',NULL,'0000-00-00 00:00:00'),(3140,1,2,263,'Kids playground',NULL,'0000-00-00 00:00:00'),(3144,1,1,264,'Sân thể thao',NULL,'0000-00-00 00:00:00'),(3145,1,2,264,'Sports court',NULL,'0000-00-00 00:00:00'),(3149,1,1,265,'Sky Lounge',NULL,'0000-00-00 00:00:00'),(3150,1,2,265,'Sky Lounge',NULL,'0000-00-00 00:00:00'),(3154,1,1,266,'Tuyến Metro 6',NULL,'0000-00-00 00:00:00'),(3155,1,2,266,'Metro Line 6',NULL,'0000-00-00 00:00:00'),(3159,1,1,267,'Tuyến đường Ánh Sáng',NULL,'0000-00-00 00:00:00'),(3160,1,2,267,'Anh Sang Avenue',NULL,'0000-00-00 00:00:00'),(3164,1,1,268,'Bệnh viện Quốc tế Vinmec',NULL,'0000-00-00 00:00:00'),(3165,1,2,268,'Vinmec Int\'l Hospital',NULL,'0000-00-00 00:00:00'),(3169,1,1,269,'Zen Park',NULL,'0000-00-00 00:00:00'),(3170,1,2,269,'Zen Park',NULL,'0000-00-00 00:00:00'),(3174,1,1,270,'Đại lộ Thăng Long',NULL,'0000-00-00 00:00:00'),(3175,1,2,270,'Thang Long Boulevard',NULL,'0000-00-00 00:00:00'),(3179,1,1,271,'Vincom Mega Mall',NULL,'0000-00-00 00:00:00'),(3180,1,2,271,'Vincom Mega Mall',NULL,'0000-00-00 00:00:00'),(3184,1,1,272,'TTTM & nhà để xe 10 tầng',NULL,'0000-00-00 00:00:00'),(3185,1,2,272,'Mall & 10F parking',NULL,'0000-00-00 00:00:00'),(3189,1,1,273,'Central Park 10.2ha',NULL,'0000-00-00 00:00:00'),(3190,1,2,273,'Central Park 10.2ha',NULL,'0000-00-00 00:00:00'),(3194,1,1,274,'Đường Lê Trọng Tấn',NULL,'0000-00-00 00:00:00'),(3195,1,2,274,'Le Trong Tan Street',NULL,'0000-00-00 00:00:00'),(3199,1,1,275,'Trường THCS Nguyễn Quý Đức',NULL,'0000-00-00 00:00:00'),(3200,1,2,275,'Nguyen Quy Duc Secondary',NULL,'0000-00-00 00:00:00'),(3204,1,1,276,'Tòa Thảo Mộc (I5)',NULL,'0000-00-00 00:00:00'),(3205,1,2,276,'Thao Moc Tower (I5)',NULL,'0000-00-00 00:00:00'),(3209,1,1,277,'Tòa Nguyệt Quế (I4)',NULL,'0000-00-00 00:00:00'),(3210,1,2,277,'Nguyet Que Tower (I4)',NULL,'0000-00-00 00:00:00'),(3214,1,1,278,'Tòa The Central (I3)',NULL,'0000-00-00 00:00:00'),(3215,1,2,278,'The Central Tower (I3)',NULL,'0000-00-00 00:00:00'),(3219,1,1,279,'Tòa The Park (I2)',NULL,'0000-00-00 00:00:00'),(3220,1,2,279,'The Park Tower (I2)',NULL,'0000-00-00 00:00:00'),(3224,1,1,280,'Tòa The Lake Premium (I1)',NULL,'0000-00-00 00:00:00'),(3225,1,2,280,'The Lake Premium Tower (I1)',NULL,'0000-00-00 00:00:00'),(3229,1,1,281,'Studio - 34m²',NULL,'0000-00-00 00:00:00'),(3230,1,2,281,'Studio – 34m²',NULL,'0000-00-00 00:00:00'),(3234,1,1,282,'Studio - 35.1m²',NULL,'0000-00-00 00:00:00'),(3235,1,2,282,'Studio – 35.1m²',NULL,'0000-00-00 00:00:00'),(3239,1,1,283,'1 phòng ngủ + 1 - 43m²',NULL,'0000-00-00 00:00:00'),(3240,1,2,283,'1BR +1 – 43m²',NULL,'0000-00-00 00:00:00'),(3244,1,1,284,'2 phòng ngủ + 1 - 46.4m²',NULL,'0000-00-00 00:00:00'),(3245,1,2,284,'2BR +1 – 46.4m²',NULL,'0000-00-00 00:00:00'),(3249,1,1,285,'2 phòng ngủ + 1 - 54.6m²',NULL,'0000-00-00 00:00:00'),(3250,1,2,285,'2BR +1 – 54.6m²',NULL,'0000-00-00 00:00:00'),(3254,1,1,286,'2 phòng ngủ + 1 - 54.7m²',NULL,'0000-00-00 00:00:00'),(3255,1,2,286,'2BR +1 – 54.7m²',NULL,'0000-00-00 00:00:00'),(3259,1,1,287,'2 phòng ngủ + 1 - 59.2m²',NULL,'0000-00-00 00:00:00'),(3260,1,2,287,'2BR +1 – 59.2m²',NULL,'0000-00-00 00:00:00'),(3264,1,1,288,'2 phòng ngủ + 1 - 62.2m²',NULL,'0000-00-00 00:00:00'),(3265,1,2,288,'2BR +1 – 62.2m²',NULL,'0000-00-00 00:00:00'),(3269,1,1,289,'3 phòng ngủ - 74.5m²',NULL,'0000-00-00 00:00:00'),(3270,1,2,289,'3BR – 74.5m²',NULL,'0000-00-00 00:00:00'),(3274,1,1,290,'3 phòng ngủ - 75.6m²',NULL,'0000-00-00 00:00:00'),(3275,1,2,290,'3BR – 75.6m²',NULL,'0000-00-00 00:00:00'),(3279,1,1,291,'Sky Lounge — Tầng 42',NULL,'0000-00-00 00:00:00'),(3280,1,2,291,'Sky Lounge — 42F',NULL,'0000-00-00 00:00:00'),(3284,1,1,292,'Tầm nhìn 360° toàn cảnh thành phố',NULL,'0000-00-00 00:00:00'),(3285,1,2,292,'360° city panorama',NULL,'0000-00-00 00:00:00'),(3289,1,1,293,'Tiện ích',NULL,'0000-00-00 00:00:00'),(3290,1,2,293,'Amenity',NULL,'0000-00-00 00:00:00'),(3294,1,1,294,'Penthouse mẫu — Tháp A',NULL,'0000-00-00 00:00:00'),(3295,1,2,294,'Showcase penthouse — Tower A',NULL,'0000-00-00 00:00:00'),(3299,1,1,295,'Căn 3PN duplex 142m² — tầng 41',NULL,'0000-00-00 00:00:00'),(3300,1,2,295,'3BR duplex 142m² — 41F',NULL,'0000-00-00 00:00:00'),(3304,1,1,296,'Căn hộ',NULL,'0000-00-00 00:00:00'),(3305,1,2,296,'Apartment',NULL,'0000-00-00 00:00:00'),(3309,1,1,297,'Phòng ngủ Master',NULL,'0000-00-00 00:00:00'),(3310,1,2,297,'Master Bedroom',NULL,'0000-00-00 00:00:00'),(3314,1,1,298,'Suite riêng — 24m² + walk-in closet',NULL,'0000-00-00 00:00:00'),(3315,1,2,298,'Private suite — 24m² + walk-in closet',NULL,'0000-00-00 00:00:00'),(3319,1,1,299,'Bể bơi vô cực — Tầng 8',NULL,'0000-00-00 00:00:00'),(3320,1,2,299,'Infinity pool — 8F',NULL,'0000-00-00 00:00:00'),(3324,1,1,300,'50m × 25m, hệ nước muối thẩm thấu',NULL,'0000-00-00 00:00:00'),(3325,1,2,300,'50m × 25m, saltwater system',NULL,'0000-00-00 00:00:00'),(3329,1,1,301,'Công viên trung tâm — 12.4ha',NULL,'0000-00-00 00:00:00'),(3330,1,2,301,'Central park — 12.4ha',NULL,'0000-00-00 00:00:00'),(3334,1,1,302,'Vườn Nhật, hồ điều hòa, sân chạy 2.4km',NULL,'0000-00-00 00:00:00'),(3335,1,2,302,'Japanese garden, lake, 2.4km running track',NULL,'0000-00-00 00:00:00'),(3339,1,1,303,'Toàn cảnh dự án',NULL,'0000-00-00 00:00:00'),(3340,1,2,303,'Project panorama',NULL,'0000-00-00 00:00:00'),(3344,1,1,304,'Phối cảnh tổng thể 6 tháp',NULL,'0000-00-00 00:00:00'),(3345,1,2,304,'Overall view — 6 towers',NULL,'0000-00-00 00:00:00'),(3349,1,1,305,'Tổng thể',NULL,'0000-00-00 00:00:00'),(3350,1,2,305,'Overall',NULL,'0000-00-00 00:00:00'),(3354,1,1,306,'Vào penthouse mẫu',NULL,'0000-00-00 00:00:00'),(3355,1,2,306,'Enter showcase penthouse',NULL,'0000-00-00 00:00:00'),(3359,1,1,307,'Khu BBQ ngoài trời',NULL,'0000-00-00 00:00:00'),(3360,1,2,307,'Outdoor BBQ area',NULL,'0000-00-00 00:00:00'),(3364,1,1,308,'Bể bơi tràn 50m hướng tây nhìn hoàng hôn hồ Tây.',NULL,'0000-00-00 00:00:00'),(3365,1,2,308,'50m infinity pool facing west — sunset over West Lake.',NULL,'0000-00-00 00:00:00'),(3369,1,1,309,'Khu BBQ 24 bàn riêng tư có mái che.',NULL,'0000-00-00 00:00:00'),(3370,1,2,309,'24 private BBQ tables under cover.',NULL,'0000-00-00 00:00:00'),(3374,1,1,310,'Phòng khách 38m²',NULL,'0000-00-00 00:00:00'),(3375,1,2,310,'Living room 38m²',NULL,'0000-00-00 00:00:00'),(3379,1,1,311,'Sang phòng ngủ master',NULL,'0000-00-00 00:00:00'),(3380,1,2,311,'To master bedroom',NULL,'0000-00-00 00:00:00'),(3384,1,1,312,'Bếp đảo Bosch',NULL,'0000-00-00 00:00:00'),(3385,1,2,312,'Bosch island kitchen',NULL,'0000-00-00 00:00:00'),(3389,1,1,313,'Cửa kính từ trần đến sàn, view trực diện hồ Tây.',NULL,'0000-00-00 00:00:00'),(3390,1,2,313,'Floor-to-ceiling glass, direct West Lake view.',NULL,'0000-00-00 00:00:00'),(3394,1,1,314,'Trang bị full Bosch, đá Dekton, lò hấp & cảm ứng từ.',NULL,'0000-00-00 00:00:00'),(3395,1,2,314,'Full Bosch, Dekton stone, steam oven & induction.',NULL,'0000-00-00 00:00:00'),(3399,1,1,315,'Tủ âm tường',NULL,'0000-00-00 00:00:00'),(3400,1,2,315,'Built-in wardrobe',NULL,'0000-00-00 00:00:00'),(3404,1,1,316,'Cửa kính lùa toàn cảnh',NULL,'0000-00-00 00:00:00'),(3405,1,2,316,'Panoramic sliding glass',NULL,'0000-00-00 00:00:00'),(3409,1,1,317,'Quay lại Sky Lounge',NULL,'0000-00-00 00:00:00'),(3410,1,2,317,'Back to Sky Lounge',NULL,'0000-00-00 00:00:00'),(3414,1,1,318,'Tủ walk-in closet 6m² thiết kế riêng.',NULL,'0000-00-00 00:00:00'),(3415,1,2,318,'Custom 6m² walk-in closet.',NULL,'0000-00-00 00:00:00'),(3419,1,1,319,'Cửa kính cách âm Low-E 3 lớp.',NULL,'0000-00-00 00:00:00'),(3420,1,2,319,'Triple-pane Low-E soundproof glass.',NULL,'0000-00-00 00:00:00'),(3424,1,1,320,'Bể trẻ em',NULL,'0000-00-00 00:00:00'),(3425,1,2,320,'Kids\' pool',NULL,'0000-00-00 00:00:00'),(3429,1,1,321,'Cabana riêng tư',NULL,'0000-00-00 00:00:00'),(3430,1,2,321,'Private cabanas',NULL,'0000-00-00 00:00:00'),(3434,1,1,322,'Đi cảnh quan',NULL,'0000-00-00 00:00:00'),(3435,1,2,322,'Go to landscape',NULL,'0000-00-00 00:00:00'),(3439,1,1,323,'Bể nông 0.4m riêng biệt cho trẻ dưới 6 tuổi.',NULL,'0000-00-00 00:00:00'),(3440,1,2,323,'0.4m shallow pool for children under 6.',NULL,'0000-00-00 00:00:00'),(3444,1,1,324,'12 cabana có thể đặt riêng.',NULL,'0000-00-00 00:00:00'),(3445,1,2,324,'12 cabanas available for private booking.',NULL,'0000-00-00 00:00:00'),(3449,1,1,325,'Vườn thiền Zen',NULL,'0000-00-00 00:00:00'),(3450,1,2,325,'Zen garden',NULL,'0000-00-00 00:00:00'),(3454,1,1,326,'Sân chạy bộ 2.4km',NULL,'0000-00-00 00:00:00'),(3455,1,2,326,'2.4km running track',NULL,'0000-00-00 00:00:00'),(3459,1,1,327,'Lên Sky Lounge',NULL,'0000-00-00 00:00:00'),(3460,1,2,327,'Up to Sky Lounge',NULL,'0000-00-00 00:00:00'),(3464,1,1,328,'Vườn đá Karesansui phong cách Kyoto.',NULL,'0000-00-00 00:00:00'),(3465,1,2,328,'Kyoto-style Karesansui rock garden.',NULL,'0000-00-00 00:00:00'),(3469,1,1,329,'Đường runway phủ EPDM giảm chấn.',NULL,'0000-00-00 00:00:00'),(3470,1,2,329,'EPDM shock-absorbing runway.',NULL,'0000-00-00 00:00:00'),(3474,1,1,330,'Tháp A — đang bán',NULL,'0000-00-00 00:00:00'),(3475,1,2,330,'Tower A — on sale',NULL,'0000-00-00 00:00:00'),(3479,1,1,331,'Tháp B & C',NULL,'0000-00-00 00:00:00'),(3480,1,2,331,'Towers B & C',NULL,'0000-00-00 00:00:00'),(3484,1,1,332,'Giai đoạn 1 — đã bàn giao 2026.',NULL,'0000-00-00 00:00:00'),(3485,1,2,332,'Phase 1 — handed over in 2026.',NULL,'0000-00-00 00:00:00'),(3489,1,1,333,'2PN',NULL,'0000-00-00 00:00:00'),(3490,1,2,333,'2BR',NULL,'0000-00-00 00:00:00'),(3494,1,1,334,'2PN+1',NULL,'0000-00-00 00:00:00'),(3495,1,2,334,'2BR +1',NULL,'0000-00-00 00:00:00'),(3499,1,1,335,'3PN',NULL,'0000-00-00 00:00:00'),(3500,1,2,335,'3BR',NULL,'0000-00-00 00:00:00'),(3504,1,1,336,'Duplex 3PN',NULL,'0000-00-00 00:00:00'),(3505,1,2,336,'Duplex 3BR',NULL,'0000-00-00 00:00:00'),(3509,1,1,337,'5.4 tỷ',NULL,'0000-00-00 00:00:00'),(3510,1,2,337,'5.4B VND',NULL,'0000-00-00 00:00:00'),(3514,1,1,338,'6.8 tỷ',NULL,'0000-00-00 00:00:00'),(3515,1,2,338,'6.8B VND',NULL,'0000-00-00 00:00:00'),(3519,1,1,339,'8.9 tỷ',NULL,'0000-00-00 00:00:00'),(3520,1,2,339,'8.9B VND',NULL,'0000-00-00 00:00:00'),(3524,1,1,340,'14.2 tỷ',NULL,'0000-00-00 00:00:00'),(3525,1,2,340,'14.2B VND',NULL,'0000-00-00 00:00:00'),(3529,1,1,341,'4.9 tỷ',NULL,'0000-00-00 00:00:00'),(3530,1,2,341,'4.9B VND',NULL,'0000-00-00 00:00:00'),(3534,1,1,342,'Khởi công',NULL,'0000-00-00 00:00:00'),(3535,1,2,342,'Groundbreaking',NULL,'0000-00-00 00:00:00'),(3539,1,1,343,'Cất nóc tháp A & B',NULL,'0000-00-00 00:00:00'),(3540,1,2,343,'Topping out Towers A & B',NULL,'0000-00-00 00:00:00'),(3544,1,1,344,'Mở bán GĐ 2',NULL,'0000-00-00 00:00:00'),(3545,1,2,344,'Phase 2 launch',NULL,'0000-00-00 00:00:00'),(3549,1,1,345,'Hoàn thiện ngoại thất',NULL,'0000-00-00 00:00:00'),(3550,1,2,345,'Façade completion',NULL,'0000-00-00 00:00:00'),(3554,1,1,346,'Bàn giao tháp A',NULL,'0000-00-00 00:00:00'),(3555,1,2,346,'Tower A handover',NULL,'0000-00-00 00:00:00'),(3559,1,1,347,'Q1 / 2024',NULL,'0000-00-00 00:00:00'),(3560,1,2,347,'Q1 / 2024',NULL,'0000-00-00 00:00:00'),(3564,1,1,348,'Q2 / 2026',NULL,'0000-00-00 00:00:00'),(3565,1,2,348,'Q2 / 2026',NULL,'0000-00-00 00:00:00'),(3569,1,1,349,'Q1 / 2027',NULL,'0000-00-00 00:00:00'),(3570,1,2,349,'Q1 / 2027',NULL,'0000-00-00 00:00:00'),(3574,1,1,350,'Q4 / 2027',NULL,'0000-00-00 00:00:00'),(3575,1,2,350,'Q4 / 2027',NULL,'0000-00-00 00:00:00'),(3579,1,1,351,'dự án Vinhomes Hai Van Bay ngay lúc này',NULL,'0000-00-00 00:00:00'),(3580,1,2,351,'Vinhomes Hai Van Bay right now',NULL,'0000-00-00 00:00:00'),(3584,1,1,352,'18 người đang xem',NULL,'0000-00-00 00:00:00'),(3585,1,2,352,'18 people viewing',NULL,'0000-00-00 00:00:00'),(3589,1,1,353,'24 người đang xem',NULL,'0000-00-00 00:00:00'),(3590,1,2,353,'24 people viewing',NULL,'0000-00-00 00:00:00'),(3594,1,1,354,'31 người đang xem',NULL,'0000-00-00 00:00:00'),(3595,1,2,354,'31 people viewing',NULL,'0000-00-00 00:00:00'),(3599,1,1,355,'Vừa đặt giữ 2PN+1 tầng 22',NULL,'0000-00-00 00:00:00'),(3600,1,2,355,'Just reserved 2BR+1 on floor 22',NULL,'0000-00-00 00:00:00'),(3604,1,1,356,'3 phút trước · Khách Hà Nội',NULL,'0000-00-00 00:00:00'),(3605,1,2,356,'3 min ago · Hanoi buyer',NULL,'0000-00-00 00:00:00'),(3609,1,1,357,'Vừa đặt giữ Duplex tầng 40',NULL,'0000-00-00 00:00:00'),(3610,1,2,357,'Just reserved Duplex on floor 40',NULL,'0000-00-00 00:00:00'),(3614,1,1,358,'12 phút trước · Khách TP.HCM',NULL,'0000-00-00 00:00:00'),(3615,1,2,358,'12 min ago · HCM City buyer',NULL,'0000-00-00 00:00:00'),(3619,1,1,359,'Còn 49 căn trong đợt này',NULL,'0000-00-00 00:00:00'),(3620,1,2,359,'49 units remaining this phase',NULL,'0000-00-00 00:00:00'),(3624,1,1,360,'Ưu đãi 8% kết thúc sớm',NULL,'0000-00-00 00:00:00'),(3625,1,2,360,'8% discount ending soon',NULL,'0000-00-00 00:00:00'),(3629,1,1,361,'Vừa đặt giữ 3PN tầng 35',NULL,'0000-00-00 00:00:00'),(3630,1,2,361,'Just reserved 3BR on floor 35',NULL,'0000-00-00 00:00:00'),(3634,1,1,362,'7 phút trước · Khách nước ngoài',NULL,'0000-00-00 00:00:00'),(3635,1,2,362,'7 min ago · International buyer',NULL,'0000-00-00 00:00:00'),(3639,1,1,363,'Căn 3PN tầng 28 vừa giữ',NULL,'0000-00-00 00:00:00'),(3640,1,2,363,'3BR on floor 28 just reserved',NULL,'0000-00-00 00:00:00'),(3644,1,1,364,'Chỉ còn 9 căn 3PN',NULL,'0000-00-00 00:00:00'),(3645,1,2,364,'Only 9 units of 3BR left',NULL,'0000-00-00 00:00:00'),(3649,1,1,604,'Tổng quan',NULL,'2026-05-27 03:15:01'),(3650,1,2,604,'Overview',NULL,'2026-05-27 03:15:01'),(3651,1,1,605,'Phân khu',NULL,'2026-05-27 03:15:01'),(3652,1,2,605,'Subdivisions',NULL,'2026-05-27 03:15:01'),(3653,1,1,606,'Tiện ích nội khu',NULL,'2026-05-27 03:15:01'),(3654,1,2,606,'Internal Amenities',NULL,'2026-05-27 03:15:01'),(3655,1,1,607,'Tiện ích ngoại khu',NULL,'2026-05-27 03:15:01'),(3656,1,2,607,'External Amenities',NULL,'2026-05-27 03:15:01'),(3657,1,1,608,'Mặt bằng tầng',NULL,'2026-05-27 03:15:01'),(3658,1,2,608,'Floor Plans',NULL,'2026-05-27 03:15:01'),(3659,1,1,609,'View 360 c??n h???',NULL,'2026-05-27 03:15:01'),(3660,1,2,609,'Unit 360 View',NULL,'2026-05-27 03:15:01'),(3661,1,1,610,'Tổng quan — hiển thị đầy đủ',NULL,'2026-05-27 03:15:01'),(3662,1,2,610,'Overview — full view',NULL,'2026-05-27 03:15:01'),(3663,1,1,611,'Đang lọc theo',NULL,'2026-05-27 03:15:01'),(3664,1,2,611,'Filtering by',NULL,'2026-05-27 03:15:01'),(3665,1,1,612,'Thông tin nổi bật',NULL,'2026-05-27 03:15:01'),(3666,1,2,612,'Key Highlights',NULL,'2026-05-27 03:15:01'),(3667,1,1,613,'Xem video giới thiệu',NULL,'2026-05-27 03:15:01'),(3668,1,2,613,'Watch intro video',NULL,'2026-05-27 03:15:01'),(3669,1,1,614,'Phân khu',NULL,'2026-05-27 03:15:01'),(3670,1,2,614,'Subdivision',NULL,'2026-05-27 03:15:01'),(3671,1,1,615,'Thông tin tổng quan',NULL,'2026-05-27 03:15:01'),(3672,1,2,615,'Overview',NULL,'2026-05-27 03:15:01'),(3673,1,1,616,'Điểm nhấn nổi bật',NULL,'2026-05-27 03:15:01'),(3674,1,2,616,'Highlights',NULL,'2026-05-27 03:15:01'),(3675,1,1,617,'Xem sản phẩm tại phân khu',NULL,'2026-05-27 03:15:01'),(3676,1,2,617,'View products in subdivision',NULL,'2026-05-27 03:15:01'),(3677,1,1,618,'Khám phá VR Tour phân khu',NULL,'2026-05-27 03:15:01'),(3678,1,2,618,'Explore VR Tour',NULL,'2026-05-27 03:15:01'),(3679,1,1,619,'Đang mở bán',NULL,'2026-05-27 03:15:01'),(3680,1,2,619,'On sale',NULL,'2026-05-27 03:15:01'),(3681,1,1,620,'Còn trống',NULL,'2026-05-27 03:15:01'),(3682,1,2,620,'Available',NULL,'2026-05-27 03:15:01'),(3683,1,1,621,'Đang giữ',NULL,'2026-05-27 03:15:01'),(3684,1,2,621,'On hold',NULL,'2026-05-27 03:15:01'),(3685,1,1,622,'Đã bán',NULL,'2026-05-27 03:15:01'),(3686,1,2,622,'Sold',NULL,'2026-05-27 03:15:01'),(3687,1,1,623,'Chưa có video nào trong thư viện.',NULL,'2026-05-27 03:15:01'),(3688,1,2,623,'No videos in the library yet.',NULL,'2026-05-27 03:15:01'),(3689,1,1,624,'Chưa có ảnh nào trong thư viện.',NULL,'2026-05-27 03:15:01'),(3690,1,2,624,'No photos in the library yet.',NULL,'2026-05-27 03:15:01'),(3691,1,1,625,'Chưa có nội dung',NULL,'2026-05-27 03:15:01'),(3692,1,2,625,'No content yet',NULL,'2026-05-27 03:15:01'),(3693,1,1,626,'Chưa có địa điểm',NULL,'2026-05-27 03:15:01'),(3694,1,2,626,'No locations yet',NULL,'2026-05-27 03:15:01'),(3695,1,1,627,'Chưa có mốc tiến độ',NULL,'2026-05-27 03:15:01'),(3696,1,2,627,'No milestones yet',NULL,'2026-05-27 03:15:01'),(3697,1,1,628,'Hoàn thành',NULL,'2026-05-27 03:15:01'),(3698,1,2,628,'Completed',NULL,'2026-05-27 03:15:01'),(3699,1,1,629,'Đang thực hiện',NULL,'2026-05-27 03:15:01'),(3700,1,2,629,'In progress',NULL,'2026-05-27 03:15:01'),(3701,1,1,630,'Sắp tới',NULL,'2026-05-27 03:15:01'),(3702,1,2,630,'Upcoming',NULL,'2026-05-27 03:15:01'),(3703,1,1,631,'Brochure dự án',NULL,'2026-05-27 03:15:01'),(3704,1,2,631,'Project brochure',NULL,'2026-05-27 03:15:01'),(3705,1,1,632,'Bộ nhận diện thương hiệu',NULL,'2026-05-27 03:15:01'),(3706,1,2,632,'Brand kit',NULL,'2026-05-27 03:15:01'),(3707,1,1,633,'Bảng giá & chính sách',NULL,'2026-05-27 03:15:01'),(3708,1,2,633,'Price list & policy',NULL,'2026-05-27 03:15:01'),(3709,1,1,634,'TMB mã căn & diện tích',NULL,'2026-05-27 03:15:01'),(3710,1,2,634,'Floor plan codes & area',NULL,'2026-05-27 03:15:01'),(3711,1,1,635,'Không có sản phẩm phù hợp bộ lọc.',NULL,'2026-05-27 03:15:01'),(3712,1,2,635,'No products match the filter.',NULL,'2026-05-27 03:15:01'),(3713,1,1,636,'Loại hình',NULL,'2026-05-27 03:15:01'),(3714,1,2,636,'Type',NULL,'2026-05-27 03:15:01'),(3715,1,1,637,'Mức giá tối đa',NULL,'2026-05-27 03:15:01'),(3716,1,2,637,'Max price',NULL,'2026-05-27 03:15:01'),(3717,1,1,638,'Nhân viên tư vấn',NULL,'2026-05-27 03:15:01'),(3718,1,2,638,'Consultant',NULL,'2026-05-27 03:15:01'),(3719,1,1,639,'Giá bán dự kiến',NULL,'2026-05-27 03:15:01'),(3720,1,2,639,'Estimated price',NULL,'2026-05-27 03:15:01'),(3721,1,1,640,'Tình trạng',NULL,'2026-05-27 03:15:01'),(3722,1,2,640,'Status',NULL,'2026-05-27 03:15:01'),(3723,1,1,641,'Loại hình',NULL,'2026-05-27 03:15:01'),(3724,1,2,641,'Type',NULL,'2026-05-27 03:15:01'),(3725,1,1,642,'Pháp lý',NULL,'2026-05-27 03:15:01'),(3726,1,2,642,'Legal',NULL,'2026-05-27 03:15:01'),(3727,1,1,643,'Dự kiến bàn giao',NULL,'2026-05-27 03:15:01'),(3728,1,2,643,'Expected handover',NULL,'2026-05-27 03:15:01'),(3729,1,1,644,'Chưa có mặt bằng.',NULL,'2026-05-27 03:15:01'),(3730,1,2,644,'No floor plans yet.',NULL,'2026-05-27 03:15:01'),(3731,1,1,645,'Tổng quan dự án',NULL,'2026-05-27 03:15:01'),(3732,1,2,645,'Project Overview',NULL,'2026-05-27 03:15:01'),(3733,1,1,646,'Lọc',NULL,'2026-05-27 03:15:01'),(3734,1,2,646,'Filter',NULL,'2026-05-27 03:15:01'),(3735,1,1,647,'Khám phá VR Tour →',NULL,'2026-05-27 03:15:01'),(3736,1,2,647,'Explore VR Tour →',NULL,'2026-05-27 03:15:01'),(3737,1,1,648,'Phân khu',NULL,'2026-05-27 03:15:01'),(3738,1,2,648,'Subdivision',NULL,'2026-05-27 03:15:01'),(3739,1,1,649,'Loại hiển thị',NULL,'2026-05-27 03:15:01'),(3740,1,2,649,'Display type',NULL,'2026-05-27 03:15:01'),(3741,1,1,650,'Bất động sản',NULL,'2026-05-27 03:15:01'),(3742,1,2,650,'Property',NULL,'2026-05-27 03:15:01'),(3743,1,1,651,'Trạng thái',NULL,'2026-05-27 03:15:01'),(3744,1,2,651,'Status',NULL,'2026-05-27 03:15:01'),(3745,1,1,652,'Chọn tất cả',NULL,'2026-05-27 03:15:01'),(3746,1,2,652,'Select all',NULL,'2026-05-27 03:15:01'),(3747,1,1,653,'Nhập câu hỏi…',NULL,'2026-05-27 03:15:01'),(3748,1,2,653,'Type your question…',NULL,'2026-05-27 03:15:01'),(3749,1,1,654,'Trình duyệt không hỗ trợ tính năng này.',NULL,'2026-05-27 03:15:01'),(3750,1,2,654,'Your browser does not support this feature.',NULL,'2026-05-27 03:15:01'),(3751,1,1,655,'Bạn cần cho phép truy cập micro.',NULL,'2026-05-27 03:15:01'),(3752,1,2,655,'Please allow microphone access.',NULL,'2026-05-27 03:15:01'),(3753,1,1,656,'Đang kết nối…',NULL,'2026-05-27 03:15:01'),(3754,1,2,656,'Connecting…',NULL,'2026-05-27 03:15:01'),(3755,1,1,657,'Mất kết nối…',NULL,'2026-05-27 03:15:01'),(3756,1,2,657,'Disconnected…',NULL,'2026-05-27 03:15:01'),(3757,1,1,658,'Thông báo',NULL,'2026-05-27 03:15:01'),(3758,1,2,658,'Notice',NULL,'2026-05-27 03:15:01'),(3759,1,1,659,'Đã hiểu',NULL,'2026-05-27 03:15:01'),(3760,1,2,659,'Got it',NULL,'2026-05-27 03:15:01');
/*!40000 ALTER TABLE `project_translations` ENABLE KEYS */;

--
-- Table structure for table `project_versions`
--

DROP TABLE IF EXISTS `project_versions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_versions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `project_id` bigint NOT NULL,
  `version_no` int NOT NULL,
  `version_type` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `snapshot_json` json NOT NULL,
  `note` text COLLATE utf8mb4_unicode_ci,
  `created_by_user_id` bigint DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `published_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `project_versions_project_id_version_no_key` (`project_id`,`version_no`),
  KEY `project_versions_created_by_user_id_fkey` (`created_by_user_id`),
  CONSTRAINT `project_versions_created_by_user_id_fkey` FOREIGN KEY (`created_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `project_versions_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `project_versions_chk_1` CHECK ((`version_type` in (_utf8mb4'draft',_utf8mb4'published',_utf8mb4'import',_utf8mb4'backup')))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_versions`
--

/*!40000 ALTER TABLE `project_versions` DISABLE KEYS */;
/*!40000 ALTER TABLE `project_versions` ENABLE KEYS */;

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projects` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tagline` text COLLATE utf8mb4_unicode_ci,
  `location_text` text COLLATE utf8mb4_unicode_ci,
  `developer_name` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sales_status` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `handover_text` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price_from_text` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price_unit_text` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price_from_vnd` decimal(18,2) DEFAULT NULL,
  `area_range_text` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `total_units` int DEFAULT NULL,
  `total_towers` int DEFAULT NULL,
  `floors_text` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `density_pct` decimal(5,2) DEFAULT NULL,
  `green_space_text` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `green_space_ha` decimal(10,2) DEFAULT NULL,
  `units_left` int DEFAULT NULL,
  `total_units_for_sale` int DEFAULT NULL,
  `promo_deadline_at` datetime DEFAULT NULL,
  `timezone_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Asia/Ho_Chi_Minh',
  `logo_url` text COLLATE utf8mb4_unicode_ci,
  `favicon_url` text COLLATE utf8mb4_unicode_ci,
  `cover_image_url` text COLLATE utf8mb4_unicode_ci,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `projects_code_key` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects`
--

/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
INSERT INTO `projects` VALUES (1,'haivanbay','Vinhomes Hai Van Bay','Sống trên tầng mây — Đô thị sinh thái cao cấp','Làng Vân, Hải Vân, Đà Nẵng','Vinhomes','Đang mở bán giai đoạn 2','Quý IV / 2027','Từ 4.9 tỷ','VND / căn',4900000000.00,'58 — 142 m²',1840,6,'42 tầng',27.00,'12.4 ha công viên nội khu',NULL,49,312,'2025-07-31 16:59:59','Asia/Ho_Chi_Minh',NULL,NULL,NULL,1,'0000-00-00 00:00:00','2026-05-27 04:28:02');
/*!40000 ALTER TABLE `projects` ENABLE KEYS */;

--
-- Table structure for table `properties`
--

DROP TABLE IF EXISTS `properties`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `properties` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `project_id` bigint NOT NULL,
  `tower_id` bigint DEFAULT NULL,
  `floor_id` bigint DEFAULT NULL,
  `property_type_id` bigint DEFAULT NULL,
  `scene_id` bigint DEFAULT NULL,
  `sales_user_id` bigint DEFAULT NULL,
  `property_code` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subdivision_code` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subdivision_label` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type_code` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type_label` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `area_sqm` decimal(10,2) DEFAULT NULL,
  `bedroom_count` smallint DEFAULT NULL,
  `bathroom_count` smallint DEFAULT NULL,
  `floor_number` int DEFAULT NULL,
  `facing_direction` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price_vnd` decimal(18,2) DEFAULT NULL,
  `price_display` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price_per_sqm_vnd` decimal(18,2) DEFAULT NULL,
  `price_per_sqm_display` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `available_count` int DEFAULT NULL,
  `total_count` int DEFAULT NULL,
  `legal_text` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `handover_text` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status_code` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'available',
  `status_label` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `metadata` json DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `properties_project_id_property_code_key` (`project_id`,`property_code`),
  KEY `idx_properties_project_status` (`project_id`,`status_code`),
  KEY `idx_properties_project_tower_floor` (`project_id`,`tower_id`,`floor_id`),
  KEY `idx_properties_sales_user` (`sales_user_id`),
  KEY `properties_floor_id_fkey` (`floor_id`),
  KEY `properties_property_type_id_fkey` (`property_type_id`),
  KEY `properties_scene_id_fkey` (`scene_id`),
  KEY `properties_tower_id_fkey` (`tower_id`),
  CONSTRAINT `properties_floor_id_fkey` FOREIGN KEY (`floor_id`) REFERENCES `floors` (`id`) ON DELETE SET NULL,
  CONSTRAINT `properties_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `properties_property_type_id_fkey` FOREIGN KEY (`property_type_id`) REFERENCES `property_types` (`id`) ON DELETE SET NULL,
  CONSTRAINT `properties_sales_user_id_fkey` FOREIGN KEY (`sales_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `properties_scene_id_fkey` FOREIGN KEY (`scene_id`) REFERENCES `vr_scenes` (`id`) ON DELETE SET NULL,
  CONSTRAINT `properties_tower_id_fkey` FOREIGN KEY (`tower_id`) REFERENCES `towers` (`id`) ON DELETE SET NULL,
  CONSTRAINT `properties_chk_1` CHECK ((`status_code` in (_utf8mb4'available',_utf8mb4'holding',_utf8mb4'reserved',_utf8mb4'sold',_utf8mb4'blocked',_utf8mb4'off_market')))
) ENGINE=InnoDB AUTO_INCREMENT=91 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `properties`
--

/*!40000 ALTER TABLE `properties` DISABLE KEYS */;
INSERT INTO `properties` VALUES (85,1,NULL,NULL,NULL,NULL,NULL,'AN11-08','Ngọc Ánh','pk-bach-van','Phân khu Bạch Vân','can-ho','Căn hộ','Căn hộ 2 phòng ngủ tầm nhìn vịnh, thiết kế tối ưu công năng, ban công rộng đón gió biển.',80.00,2,2,NULL,'Đông Nam',5400000000.00,'5.400.000.000',NULL,'75.000.000',NULL,NULL,'Sổ đỏ lâu dài','Quý IV/2026','available','Đang mở bán',0,1,'{\"slug\": \"HV5-12-08\", \"priceVal\": 5.4, \"thumbsFloor\": [\"img/1.png\", \"img/2.png\", \"img/1.png\", \"img/2.png\"], \"consultEmail\": \"\", \"consultPhone\": \"\"}','2026-05-27 04:28:03','2026-05-27 04:28:03'),(86,1,NULL,NULL,NULL,NULL,NULL,'VM-SH-06.03','Shophouse Vịnh Mây','pk-vinh-may','Vịnh Mây','shophouse','Shophouse','Shophouse mặt phố thương mại, kết cấu 4 tầng, vừa ở vừa kinh doanh, vị trí trục chính sầm uất.',120.00,4,5,NULL,'Tây Nam',15600000000.00,'15.600.000.000',NULL,'130.000.000',NULL,NULL,'Sổ đỏ lâu dài','Quý IV/2026','available','Đang mở bán',1,1,'{\"slug\": \"VM-SH-06-03\", \"priceVal\": 15.6, \"thumbsFloor\": [\"img/1.png\", \"img/2.png\", \"img/1.png\", \"img/2.png\"], \"consultEmail\": \"tuvanduan@haivanbay.vn\", \"consultPhone\": \"1900 1234\"}','2026-05-27 04:28:03','2026-05-27 04:28:03'),(87,1,NULL,NULL,NULL,NULL,NULL,'BV-BT-02.11','Biệt thự Bạch Vân','pk-bach-van','Bạch Vân','biet-thu','Biệt thự','Biệt thự đơn lập sân vườn rộng, hồ bơi riêng, không gian sống đẳng cấp gần công viên trung tâm.',300.00,5,6,NULL,'Đông',28500000000.00,'28.500.000.000',NULL,'95.000.000',NULL,NULL,'Sổ đỏ lâu dài','Quý II/2027','holding','Đang giữ chỗ',2,1,'{\"slug\": \"BV-BT-02-11\", \"priceVal\": 28.5, \"thumbsFloor\": [\"img/1.png\", \"img/2.png\", \"img/1.png\", \"img/2.png\"], \"consultEmail\": \"tuvanduan@haivanbay.vn\", \"consultPhone\": \"1900 1234\"}','2026-05-27 04:28:03','2026-05-27 04:28:03'),(88,1,NULL,NULL,NULL,NULL,NULL,'DN-BT-01.05','Biệt thự đảo Đảo Ngọc','pk-dao-ngoc','Đảo Ngọc','biet-thu','Biệt thự','Biệt thự đảo compound khép kín, bến du thuyền riêng, an ninh tuyệt đối cho cộng đồng tinh hoa.',350.00,5,6,NULL,'Nam',42000000000.00,'42.000.000.000',NULL,'120.000.000',NULL,NULL,'Sổ đỏ lâu dài','Quý III/2027','available','Đang mở bán',3,1,'{\"slug\": \"DN-BT-01-05\", \"priceVal\": 42, \"thumbsFloor\": [\"img/1.png\", \"img/2.png\", \"img/1.png\", \"img/2.png\"], \"consultEmail\": \"tuvanduan@haivanbay.vn\", \"consultPhone\": \"1900 1234\"}','2026-05-27 04:28:03','2026-05-27 04:28:03'),(89,1,NULL,NULL,NULL,NULL,NULL,'TV-CH-09.21','Căn hộ Tịnh Vân','pk-tinh-van','Tịnh Vân','can-ho','Căn hộ','Căn hộ 1 phòng ngủ trung tâm thương mại, phù hợp đầu tư cho thuê, thanh khoản cao.',58.00,1,1,NULL,'Bắc',3900000000.00,'3.900.000.000',NULL,'68.000.000',NULL,NULL,'Sổ đỏ lâu dài','Quý IV/2026','available','Đang mở bán',4,1,'{\"slug\": \"TV-CH-09-21\", \"priceVal\": 3.9, \"thumbsFloor\": [\"img/1.png\", \"img/2.png\", \"img/1.png\", \"img/2.png\"], \"consultEmail\": \"tuvanduan@haivanbay.vn\", \"consultPhone\": \"1900 1234\"}','2026-05-27 04:28:03','2026-05-27 04:28:03'),(90,1,NULL,NULL,NULL,NULL,NULL,'TV-NP-03.14','Nhà phố Tịnh Vân','pk-tinh-van','Tịnh Vân','nha-pho','Nhà phố','Nhà phố liền kề khu dân cư hiện hữu, hạ tầng hoàn thiện, môi trường sống xanh.',100.00,3,4,NULL,'Đông Bắc',11200000000.00,'11.200.000.000',NULL,'112.000.000',NULL,NULL,'Sổ đỏ lâu dài','Quý IV/2026','sold','Đã bán',5,1,'{\"slug\": \"TV-NP-03-14\", \"priceVal\": 11.2, \"thumbsFloor\": [\"img/1.png\", \"img/2.png\", \"img/1.png\", \"img/2.png\"], \"consultEmail\": \"tuvanduan@haivanbay.vn\", \"consultPhone\": \"1900 1234\"}','2026-05-27 04:28:03','2026-05-27 04:28:03');
/*!40000 ALTER TABLE `properties` ENABLE KEYS */;

--
-- Table structure for table `property_documents`
--

DROP TABLE IF EXISTS `property_documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `property_documents` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `property_id` bigint NOT NULL,
  `document_name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `document_type` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PDF',
  `document_url` text COLLATE utf8mb4_unicode_ci,
  `sort_order` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_property_documents_property` (`property_id`,`sort_order`),
  CONSTRAINT `property_documents_property_id_fkey` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=271 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `property_documents`
--

/*!40000 ALTER TABLE `property_documents` DISABLE KEYS */;
INSERT INTO `property_documents` VALUES (253,85,'Brochure dự án','PDF',NULL,0),(254,85,'Bảng giá chi tiết','PDF',NULL,1),(255,85,'Hợp đồng mẫu','PDF',NULL,2),(256,86,'Brochure dự án','PDF',NULL,0),(257,86,'Bảng giá chi tiết','PDF',NULL,1),(258,86,'Hợp đồng mẫu','PDF',NULL,2),(259,87,'Brochure dự án','PDF',NULL,0),(260,87,'Bảng giá chi tiết','PDF',NULL,1),(261,87,'Hợp đồng mẫu','PDF',NULL,2),(262,88,'Brochure dự án','PDF',NULL,0),(263,88,'Bảng giá chi tiết','PDF',NULL,1),(264,88,'Hợp đồng mẫu','PDF',NULL,2),(265,89,'Brochure dự án','PDF',NULL,0),(266,89,'Bảng giá chi tiết','PDF',NULL,1),(267,89,'Hợp đồng mẫu','PDF',NULL,2),(268,90,'Brochure dự án','PDF',NULL,0),(269,90,'Bảng giá chi tiết','PDF',NULL,1),(270,90,'Hợp đồng mẫu','PDF',NULL,2);
/*!40000 ALTER TABLE `property_documents` ENABLE KEYS */;

--
-- Table structure for table `property_floor_plans`
--

DROP TABLE IF EXISTS `property_floor_plans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `property_floor_plans` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `property_id` bigint NOT NULL,
  `image_url` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `label` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_property_floor_plans_property` (`property_id`,`sort_order`),
  CONSTRAINT `property_floor_plans_property_id_fkey` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=361 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `property_floor_plans`
--

/*!40000 ALTER TABLE `property_floor_plans` DISABLE KEYS */;
INSERT INTO `property_floor_plans` VALUES (337,85,'img/1.png',NULL,0),(338,85,'img/2.png',NULL,1),(339,85,'img/1.png',NULL,2),(340,85,'img/2.png',NULL,3),(341,86,'img/1.png',NULL,0),(342,86,'img/2.png',NULL,1),(343,86,'img/1.png',NULL,2),(344,86,'img/2.png',NULL,3),(345,87,'img/1.png',NULL,0),(346,87,'img/2.png',NULL,1),(347,87,'img/1.png',NULL,2),(348,87,'img/2.png',NULL,3),(349,88,'img/1.png',NULL,0),(350,88,'img/2.png',NULL,1),(351,88,'img/1.png',NULL,2),(352,88,'img/2.png',NULL,3),(353,89,'img/1.png',NULL,0),(354,89,'img/2.png',NULL,1),(355,89,'img/1.png',NULL,2),(356,89,'img/2.png',NULL,3),(357,90,'img/1.png',NULL,0),(358,90,'img/2.png',NULL,1),(359,90,'img/1.png',NULL,2),(360,90,'img/2.png',NULL,3);
/*!40000 ALTER TABLE `property_floor_plans` ENABLE KEYS */;

--
-- Table structure for table `property_highlights`
--

DROP TABLE IF EXISTS `property_highlights`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `property_highlights` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `property_id` bigint NOT NULL,
  `highlight_text` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `property_highlights_property_id_fkey` (`property_id`),
  CONSTRAINT `property_highlights_property_id_fkey` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=271 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `property_highlights`
--

/*!40000 ALTER TABLE `property_highlights` DISABLE KEYS */;
INSERT INTO `property_highlights` VALUES (253,85,'View trực diện vịnh biển',0),(254,85,'Bàn giao nội thất cơ bản',1),(255,85,'Tầng trung tầm nhìn đẹp',2),(256,86,'Mặt tiền phố thương mại',0),(257,86,'Kết cấu 4 tầng linh hoạt',1),(258,86,'Vừa ở vừa kinh doanh',2),(259,87,'Sân vườn & hồ bơi riêng',0),(260,87,'Biệt thự đơn lập 3 mặt thoáng',1),(261,87,'Gần công viên trung tâm',2),(262,88,'Bến du thuyền riêng',0),(263,88,'Compound an ninh 3 lớp',1),(264,88,'Tầm nhìn biển trọn vẹn',2),(265,89,'Trung tâm thương mại sầm uất',0),(266,89,'Phù hợp đầu tư cho thuê',1),(267,89,'Bàn giao sớm',2),(268,90,'Hạ tầng hoàn thiện',0),(269,90,'Khu dân cư hiện hữu',1),(270,90,'Gần trường học',2);
/*!40000 ALTER TABLE `property_highlights` ENABLE KEYS */;

--
-- Table structure for table `property_images`
--

DROP TABLE IF EXISTS `property_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `property_images` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `property_id` bigint NOT NULL,
  `image_url` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_property_images_property` (`property_id`,`sort_order`),
  CONSTRAINT `property_images_property_id_fkey` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=271 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `property_images`
--

/*!40000 ALTER TABLE `property_images` DISABLE KEYS */;
INSERT INTO `property_images` VALUES (253,85,'img/2.png',0),(254,85,'img/1.png',1),(255,85,'img/2.png',2),(256,86,'img/2.png',0),(257,86,'img/1.png',1),(258,86,'img/2.png',2),(259,87,'img/2.png',0),(260,87,'img/1.png',1),(261,87,'img/2.png',2),(262,88,'img/2.png',0),(263,88,'img/1.png',1),(264,88,'img/2.png',2),(265,89,'img/2.png',0),(266,89,'img/1.png',1),(267,89,'img/2.png',2),(268,90,'img/2.png',0),(269,90,'img/1.png',1),(270,90,'img/2.png',2);
/*!40000 ALTER TABLE `property_images` ENABLE KEYS */;

--
-- Table structure for table `property_milestones`
--

DROP TABLE IF EXISTS `property_milestones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `property_milestones` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `property_id` bigint NOT NULL,
  `phase_name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phase_date_text` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_done` tinyint(1) NOT NULL DEFAULT '0',
  `sort_order` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_property_milestones_property` (`property_id`,`sort_order`),
  CONSTRAINT `property_milestones_property_id_fkey` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=361 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `property_milestones`
--

/*!40000 ALTER TABLE `property_milestones` DISABLE KEYS */;
INSERT INTO `property_milestones` VALUES (337,85,'Khởi công','Q1/2024',1,0),(338,85,'Hoàn thiện móng','Q3/2024',1,1),(339,85,'Xây thô','Q2/2025',0,2),(340,85,'Bàn giao','Q4/2026',0,3),(341,86,'Khởi công','Q1/2024',1,0),(342,86,'Hoàn thiện móng','Q3/2024',1,1),(343,86,'Xây thô','Q2/2025',0,2),(344,86,'Bàn giao','Q4/2026',0,3),(345,87,'Khởi công','Q1/2024',1,0),(346,87,'Hoàn thiện móng','Q3/2024',1,1),(347,87,'Xây thô','Q2/2025',0,2),(348,87,'Bàn giao','Q4/2026',0,3),(349,88,'Khởi công','Q1/2024',1,0),(350,88,'Hoàn thiện móng','Q3/2024',1,1),(351,88,'Xây thô','Q2/2025',0,2),(352,88,'Bàn giao','Q4/2026',0,3),(353,89,'Khởi công','Q1/2024',1,0),(354,89,'Hoàn thiện móng','Q3/2024',1,1),(355,89,'Xây thô','Q2/2025',0,2),(356,89,'Bàn giao','Q4/2026',0,3),(357,90,'Khởi công','Q1/2024',1,0),(358,90,'Hoàn thiện móng','Q3/2024',1,1),(359,90,'Xây thô','Q2/2025',0,2),(360,90,'Bàn giao','Q4/2026',0,3);
/*!40000 ALTER TABLE `property_milestones` ENABLE KEYS */;

--
-- Table structure for table `property_policies`
--

DROP TABLE IF EXISTS `property_policies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `property_policies` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `property_id` bigint NOT NULL,
  `policy_text` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `property_policies_property_id_fkey` (`property_id`),
  CONSTRAINT `property_policies_property_id_fkey` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=361 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `property_policies`
--

/*!40000 ALTER TABLE `property_policies` DISABLE KEYS */;
INSERT INTO `property_policies` VALUES (337,85,'Chiết khấu 8% thanh toán sớm',0),(338,85,'Hỗ trợ lãi suất 0% trong 18 tháng',1),(339,85,'Cam kết mua lại 7%/năm',2),(340,85,'Tặng gói nội thất cao cấp',3),(341,86,'Chiết khấu 8% thanh toán sớm',0),(342,86,'Hỗ trợ lãi suất 0% trong 18 tháng',1),(343,86,'Cam kết mua lại 7%/năm',2),(344,86,'Tặng gói nội thất cao cấp',3),(345,87,'Chiết khấu 8% thanh toán sớm',0),(346,87,'Hỗ trợ lãi suất 0% trong 18 tháng',1),(347,87,'Cam kết mua lại 7%/năm',2),(348,87,'Tặng gói nội thất cao cấp',3),(349,88,'Chiết khấu 8% thanh toán sớm',0),(350,88,'Hỗ trợ lãi suất 0% trong 18 tháng',1),(351,88,'Cam kết mua lại 7%/năm',2),(352,88,'Tặng gói nội thất cao cấp',3),(353,89,'Chiết khấu 8% thanh toán sớm',0),(354,89,'Hỗ trợ lãi suất 0% trong 18 tháng',1),(355,89,'Cam kết mua lại 7%/năm',2),(356,89,'Tặng gói nội thất cao cấp',3),(357,90,'Chiết khấu 8% thanh toán sớm',0),(358,90,'Hỗ trợ lãi suất 0% trong 18 tháng',1),(359,90,'Cam kết mua lại 7%/năm',2),(360,90,'Tặng gói nội thất cao cấp',3);
/*!40000 ALTER TABLE `property_policies` ENABLE KEYS */;

--
-- Table structure for table `property_price_history`
--

DROP TABLE IF EXISTS `property_price_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `property_price_history` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `property_id` bigint NOT NULL,
  `price_vnd` decimal(18,2) DEFAULT NULL,
  `price_per_sqm_vnd` decimal(18,2) DEFAULT NULL,
  `effective_from` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `effective_to` datetime DEFAULT NULL,
  `changed_by_user_id` bigint DEFAULT NULL,
  `note` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `property_price_history_changed_by_user_id_fkey` (`changed_by_user_id`),
  KEY `property_price_history_property_id_fkey` (`property_id`),
  CONSTRAINT `property_price_history_changed_by_user_id_fkey` FOREIGN KEY (`changed_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `property_price_history_property_id_fkey` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `property_price_history`
--

/*!40000 ALTER TABLE `property_price_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `property_price_history` ENABLE KEYS */;

--
-- Table structure for table `property_reservations`
--

DROP TABLE IF EXISTS `property_reservations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `property_reservations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `project_id` bigint NOT NULL,
  `property_id` bigint NOT NULL,
  `lead_id` bigint DEFAULT NULL,
  `customer_id` bigint NOT NULL,
  `sales_user_id` bigint DEFAULT NULL,
  `reservation_type` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status_code` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `hold_started_at` datetime DEFAULT NULL,
  `hold_expires_at` datetime DEFAULT NULL,
  `deposit_amount_vnd` decimal(18,2) DEFAULT NULL,
  `payment_method` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_reference` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_property_reservations_property_status` (`property_id`,`status_code`),
  KEY `property_reservations_customer_id_fkey` (`customer_id`),
  KEY `property_reservations_lead_id_fkey` (`lead_id`),
  KEY `property_reservations_project_id_fkey` (`project_id`),
  KEY `property_reservations_sales_user_id_fkey` (`sales_user_id`),
  CONSTRAINT `property_reservations_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  CONSTRAINT `property_reservations_lead_id_fkey` FOREIGN KEY (`lead_id`) REFERENCES `leads` (`id`) ON DELETE SET NULL,
  CONSTRAINT `property_reservations_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `property_reservations_property_id_fkey` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`),
  CONSTRAINT `property_reservations_sales_user_id_fkey` FOREIGN KEY (`sales_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `property_reservations_chk_1` CHECK ((`status_code` in (_utf8mb4'requested',_utf8mb4'holding',_utf8mb4'confirmed',_utf8mb4'expired',_utf8mb4'cancelled',_utf8mb4'converted'))),
  CONSTRAINT `property_reservations_chk_2` CHECK ((`reservation_type` in (_utf8mb4'interest',_utf8mb4'hold',_utf8mb4'booking',_utf8mb4'deposit')))
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `property_reservations`
--

/*!40000 ALTER TABLE `property_reservations` DISABLE KEYS */;
/*!40000 ALTER TABLE `property_reservations` ENABLE KEYS */;

--
-- Table structure for table `property_status_history`
--

DROP TABLE IF EXISTS `property_status_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `property_status_history` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `property_id` bigint NOT NULL,
  `old_status_code` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `new_status_code` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `changed_by_user_id` bigint DEFAULT NULL,
  `change_reason` text COLLATE utf8mb4_unicode_ci,
  `changed_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `property_status_history_changed_by_user_id_fkey` (`changed_by_user_id`),
  KEY `property_status_history_property_id_fkey` (`property_id`),
  CONSTRAINT `property_status_history_changed_by_user_id_fkey` FOREIGN KEY (`changed_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `property_status_history_property_id_fkey` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `property_status_history`
--

/*!40000 ALTER TABLE `property_status_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `property_status_history` ENABLE KEYS */;

--
-- Table structure for table `property_types`
--

DROP TABLE IF EXISTS `property_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `property_types` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `project_id` bigint NOT NULL,
  `type_code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bedroom_count` smallint DEFAULT NULL,
  `extra_room_count` smallint NOT NULL DEFAULT '0',
  `unit_class` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `area_from_sqm` decimal(10,2) DEFAULT NULL,
  `area_to_sqm` decimal(10,2) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `property_types_project_id_type_code_key` (`project_id`,`type_code`),
  CONSTRAINT `property_types_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `property_types`
--

/*!40000 ALTER TABLE `property_types` DISABLE KEYS */;
INSERT INTO `property_types` VALUES (1,1,'3pn','Căn 3 phòng ngủ',3,0,NULL,NULL,NULL,1);
/*!40000 ALTER TABLE `property_types` ENABLE KEYS */;

--
-- Table structure for table `resource_categories`
--

DROP TABLE IF EXISTS `resource_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `resource_categories` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `project_id` bigint NOT NULL,
  `code` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `resource_categories_project_id_code_key` (`project_id`,`code`),
  CONSTRAINT `resource_categories_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resource_categories`
--

/*!40000 ALTER TABLE `resource_categories` DISABLE KEYS */;
/*!40000 ALTER TABLE `resource_categories` ENABLE KEYS */;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `roles_code_key` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'owner','Owner','Full project control','0000-00-00 00:00:00'),(3,'sales','Sales','Sales consultant','0000-00-00 00:00:00'),(5,'developer','Developer','Technical operator','0000-00-00 00:00:00');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;

--
-- Table structure for table `sales_public_links`
--

DROP TABLE IF EXISTS `sales_public_links`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sales_public_links` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `project_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `slug` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `destination_url` text COLLATE utf8mb4_unicode_ci,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sales_public_links_project_id_slug_key` (`project_id`,`slug`),
  KEY `sales_public_links_user_id_fkey` (`user_id`),
  CONSTRAINT `sales_public_links_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `sales_public_links_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales_public_links`
--

/*!40000 ALTER TABLE `sales_public_links` DISABLE KEYS */;
/*!40000 ALTER TABLE `sales_public_links` ENABLE KEYS */;

--
-- Table structure for table `site_map_points`
--

DROP TABLE IF EXISTS `site_map_points`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `site_map_points` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `site_map_id` bigint NOT NULL,
  `panorama_id` bigint DEFAULT NULL,
  `scene_id` bigint DEFAULT NULL,
  `point_code` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `label` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `x_pct` decimal(6,2) NOT NULL,
  `y_pct` decimal(6,2) NOT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `metadata` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `site_map_points_site_map_id_point_code_key` (`site_map_id`,`point_code`),
  KEY `idx_site_map_points_map_sort` (`site_map_id`,`sort_order`),
  KEY `site_map_points_panorama_id_fkey` (`panorama_id`),
  KEY `site_map_points_scene_id_fkey` (`scene_id`),
  CONSTRAINT `site_map_points_panorama_id_fkey` FOREIGN KEY (`panorama_id`) REFERENCES `panorama_assets` (`id`) ON DELETE SET NULL,
  CONSTRAINT `site_map_points_scene_id_fkey` FOREIGN KEY (`scene_id`) REFERENCES `vr_scenes` (`id`) ON DELETE SET NULL,
  CONSTRAINT `site_map_points_site_map_id_fkey` FOREIGN KEY (`site_map_id`) REFERENCES `site_maps` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=134 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `site_map_points`
--

/*!40000 ALTER TABLE `site_map_points` DISABLE KEYS */;
INSERT INTO `site_map_points` VALUES (127,19,NULL,NULL,'i1','Tòa The Lake Premium (I1)',0.00,0.00,0,1,'{\"lat\": 16.2155, \"lng\": 108.118, \"tdvPanoramaId\": \"pano-01\"}'),(128,19,NULL,NULL,'i2','Tòa The Park (I2)',0.00,0.00,1,1,'{\"lat\": 16.2145, \"lng\": 108.121, \"tdvPanoramaId\": \"pano-05\"}'),(129,19,NULL,NULL,'i3','Tòa The Central (I3)',0.00,0.00,2,1,'{\"lat\": 16.2135, \"lng\": 108.123, \"tdvPanoramaId\": \"pano-10\"}'),(130,19,NULL,NULL,'i4','Tòa Nguyệt Quế (I4)',0.00,0.00,3,1,'{\"lat\": 16.212, \"lng\": 108.1195, \"tdvPanoramaId\": \"pano-15\"}'),(131,19,NULL,NULL,'i5','Tòa Thảo Mộc (I5)',0.00,0.00,4,1,'{\"lat\": 16.211, \"lng\": 108.122, \"tdvPanoramaId\": \"pano-20\"}'),(132,19,NULL,NULL,'park','Công viên trung tâm',0.00,0.00,5,1,'{\"lat\": 16.214, \"lng\": 108.116, \"tdvPanoramaId\": \"pano-08\"}'),(133,19,NULL,NULL,'pool','Bể bơi vô cực',0.00,0.00,6,1,'{\"lat\": 16.2125, \"lng\": 108.1245, \"tdvPanoramaId\": \"pano-13\"}');
/*!40000 ALTER TABLE `site_map_points` ENABLE KEYS */;

--
-- Table structure for table `site_maps`
--

DROP TABLE IF EXISTS `site_maps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `site_maps` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `project_id` bigint NOT NULL,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `background_url` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_default` tinyint(1) NOT NULL DEFAULT '0',
  `sort_order` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `site_maps_project_id_fkey` (`project_id`),
  CONSTRAINT `site_maps_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `site_maps`
--

/*!40000 ALTER TABLE `site_maps` DISABLE KEYS */;
INSERT INTO `site_maps` VALUES (19,1,'Site map chính','',1,0);
/*!40000 ALTER TABLE `site_maps` ENABLE KEYS */;

--
-- Table structure for table `theme_presets`
--

DROP TABLE IF EXISTS `theme_presets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `theme_presets` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `project_id` bigint DEFAULT NULL,
  `preset_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokens_json` json NOT NULL,
  `is_system` tinyint(1) NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by_user_id` bigint DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `theme_presets_created_by_user_id_fkey` (`created_by_user_id`),
  KEY `theme_presets_project_id_fkey` (`project_id`),
  CONSTRAINT `theme_presets_created_by_user_id_fkey` FOREIGN KEY (`created_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `theme_presets_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `theme_presets`
--

/*!40000 ALTER TABLE `theme_presets` DISABLE KEYS */;
/*!40000 ALTER TABLE `theme_presets` ENABLE KEYS */;

--
-- Table structure for table `towers`
--

DROP TABLE IF EXISTS `towers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `towers` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `project_id` bigint NOT NULL,
  `tower_code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tower_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_floors` int DEFAULT NULL,
  `total_units` int DEFAULT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `towers_project_id_tower_code_key` (`project_id`,`tower_code`),
  CONSTRAINT `towers_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `towers`
--

/*!40000 ALTER TABLE `towers` DISABLE KEYS */;
/*!40000 ALTER TABLE `towers` ENABLE KEYS */;

--
-- Table structure for table `translation_keys`
--

DROP TABLE IF EXISTS `translation_keys`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `translation_keys` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `namespace_code` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `key_code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `default_text` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `translation_keys_namespace_code_key_code_key` (`namespace_code`,`key_code`),
  UNIQUE KEY `uk_ns_key` (`namespace_code`,`key_code`)
) ENGINE=InnoDB AUTO_INCREMENT=1281 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `translation_keys`
--

/*!40000 ALTER TABLE `translation_keys` DISABLE KEYS */;
INSERT INTO `translation_keys` VALUES (1,'ui','ui.loaderSub','Đang khởi tạo không gian 360°'),(2,'ui','ui.sitemap','Bản đồ 2D'),(3,'ui','ui.sitemapTitle','Bản đồ 2D'),(4,'ui','ui.gallery','Thư viện'),(5,'ui','ui.galleryTitle','Thư viện ảnh'),(6,'ui','ui.book','Đặt lịch'),(7,'ui','ui.priceFrom','Giá từ'),(8,'ui','ui.viewPricePromo','Xem bảng giá & ưu đãi'),(9,'ui','ui.downloadBrochure','Tải brochure PDF'),(10,'ui','ui.dragTip','Kéo để xoay · Cuộn để zoom'),(11,'ui','ui.search','Tìm kiếm…'),(12,'ui','ui.collapse','Thu gọn'),(13,'ui','ui.expand','Mở rộng thông tin dự án'),(14,'ui','ui.expandNav','Mở bảng điều hướng'),(15,'ui','ui.showUI','Hiện giao diện'),(16,'ui','ui.aiChat','Chat với trợ lý AI'),(17,'ui','ui.skip','Bỏ qua'),(18,'ui','ui.continueHint','Click bất kỳ đâu để tiếp tục →'),(19,'ui','ui.step','Bước {n} / {total}'),(20,'ui','ui.viewIn360','Xem 360°'),(21,'ui','ui.nearbyAmenity','Tiện ích lân cận'),(22,'ui','ui.noResults','Không tìm thấy mục phù hợp'),(23,'ui','ui.units','căn'),(24,'ui','ui.rotate','Tự xoay'),(25,'ui','ui.zoomIn','Phóng to'),(26,'ui','ui.zoomOut','Thu nhỏ'),(27,'ui','ui.fullscreen','Toàn màn hình'),(28,'ui','ui.help','Hướng dẫn sử dụng'),(29,'ui','ui.language','Ngôn ngữ'),(30,'ui','modal.eyebrow','BẢNG GIÁ & CĂN HỘ CÒN TRỐNG'),(31,'ui','modal.title','Tháp A — Mở bán giai đoạn 2'),(32,'ui','modal.desc','Quỹ căn hiện hữu cập nhật theo thời gian thực. Ưu đãi giai đoạn 2: chiết khấu 8% cho thanh toán sớm, cam kết thuê lại 7%/năm trong 24 tháng đầu tiên.'),(33,'ui','modal.col.code','Mã căn'),(34,'ui','modal.col.type','Loại'),(35,'ui','modal.col.area','Diện tích'),(36,'ui','modal.col.price','Giá từ'),(37,'ui','modal.col.avail','Còn lại'),(38,'ui','modal.contactTitle','Để chúng tôi liên hệ lại'),(39,'ui','modal.name','Họ & tên'),(40,'ui','modal.namePh','Nguyễn Văn A'),(41,'ui','modal.phone','Số điện thoại'),(42,'ui','modal.phonePh','09xx xxx xxx'),(43,'ui','modal.interest','Loại căn quan tâm'),(44,'ui','modal.opt.2br','2 phòng ngủ'),(45,'ui','modal.opt.2br1','2 phòng ngủ +1'),(46,'ui','modal.opt.3br','3 phòng ngủ'),(47,'ui','modal.opt.duplex','Duplex / Penthouse'),(48,'ui','modal.note','Ghi chú'),(49,'ui','modal.notePh','Tôi muốn được tư vấn vào cuối tuần…'),(50,'ui','modal.submit','Gửi yêu cầu tư vấn'),(51,'ui','modal.timeline','Tiến độ dự án'),(52,'ui','sitemap.eyebrow','Mặt bằng tổng thể'),(53,'ui','sitemap.title','Bản đồ thiết kế 2D'),(54,'ui','sitemap.desc','Bấm vào các điểm trên bản đồ để vào không gian 360° tương ứng'),(55,'ui','gallery.eyebrow','Thư viện hình ảnh'),(56,'ui','gallery.title','Khám phá Vinhomes Hai Van Bay'),(57,'ui','ui.ai.title','Trợ lý Vinhomes Hai Van Bay'),(58,'ui','ui.ai.active','Đang hoạt động'),(59,'ui','ui.ai.listening','Đang lắng nghe…'),(60,'ui','ui.ai.thinking','Đang suy nghĩ…'),(61,'ui','ui.ai.speaking','Đang trả lời…'),(62,'ui','ai.placeholder','Nhập câu hỏi…'),(63,'ui','ui.ai.close','Đóng'),(64,'ui','ai.noSR','Trình duyệt chưa hỗ trợ nhận dạng giọng nói. Vui lòng dùng Chrome hoặc Edge.'),(65,'ui','ai.micDenied','Bạn cần cho phép truy cập micro để dùng tính năng trò chuyện bằng giọng nói.'),(66,'ui','ai.networkErr','Không thể kết nối dịch vụ nhận dạng giọng nói. Vui lòng thử lại sau.'),(67,'ui','ai.replyStub','Cảm ơn câu hỏi của bạn: \"{q}\". Đây là phản hồi mẫu — tích hợp LLM thật sẽ thay thế hàm generateReply().'),(68,'ui','tour.brand','Logo dự án — quay về tổng quan.'),(69,'ui','tour.sitemap','Bản đồ thiết kế 2D — các điểm chạm dẫn vào không gian 360°.'),(70,'ui','tour.masterplan','Quy hoạch tổng thể — xem mặt bằng phân khu toàn dự án.'),(71,'ui','tour.properties','Bất động sản — danh sách sản phẩm, căn hộ đang mở bán.'),(72,'ui','tour.amenities','Tiện ích dự án — khám phá tiện ích nội/ngoại khu.'),(73,'ui','tour.legal','Pháp lý & Uy tín — hồ sơ pháp lý, ngân hàng bảo lãnh, đánh giá cư dân.'),(74,'ui','tour.location','Vị trí dự án — bản đồ và các tiện ích xung quanh.'),(75,'ui','tour.timeline','Tiến độ dự án — xem các mốc thi công và bàn giao.'),(76,'ui','tour.gallery','Thư viện ảnh dự án.'),(77,'ui','tour.resources','Tài liệu dự án — brochure, bảng giá, mặt bằng để tải về.'),(78,'ui','tour.book','Đặt lịch tham quan và xem bảng giá chi tiết.'),(79,'ui','tour.ctrlgroup','Cụm điều khiển — tự xoay, zoom, toàn màn hình, chọn ngôn ngữ và mở lại hướng dẫn.'),(80,'ui','tour.rotate','Bật/tắt tự xoay panorama 360°.'),(81,'ui','tour.zoomIn','Phóng to góc nhìn.'),(82,'ui','tour.zoomOut','Thu nhỏ góc nhìn.'),(83,'ui','tour.fullscreen','Bật chế độ toàn màn hình.'),(84,'ui','tour.lang','Đa ngôn ngữ — chọn ngôn ngữ hiển thị (Việt, Anh, Trung, Hàn, Nhật).'),(85,'ui','tour.help','Mở lại hướng dẫn này bất cứ lúc nào.'),(86,'ui','tour.nav','Bảng điều hướng trái — chứa thông tin scene và danh sách các nhóm.'),(87,'ui','tour.search','Tìm kiếm nhanh trong toàn bộ danh sách.'),(88,'ui','tour.list','Các nhóm: Tổng quan, Tiện ích nội/ngoại khu, Mặt bằng, Căn hộ. Click vào tiêu đề để mở/đóng nhóm, click vào mục con để chuyển không gian 360°.'),(89,'ui','tour.collapse','Thu gọn bảng điều hướng để xem panorama rộng hơn.'),(90,'ui','tour.project','Thông tin dự án: giá, trạng thái, các chỉ số chính.'),(91,'ui','tour.pcCollapse','Thu gọn bảng thông tin dự án bên phải.'),(92,'ui','tour.infoFab','Mở lại bảng thông tin dự án khi đã thu gọn.'),(93,'ui','tour.bot','Trợ lý AI — chat text hoặc trò chuyện bằng giọng nói.'),(94,'ui','tour.restore','Khi giao diện bị ẩn (do kéo xoay 360°), bấm nút này để hiện lại.'),(95,'ui','tour.hotspot','Hotspot trong khung 360° — click để vào không gian khác hoặc xem mô tả.'),(96,'ui','ui.vrExperience','VR360 EXPERIENCE'),(97,'ui','ui.expired','Hết ưu đãi'),(98,'ui','ui.noFilterResults','Không tìm thấy căn phù hợp với bộ lọc'),(99,'ui','modal.opt.studio','Studio'),(100,'ui','modal.selectType','— Chọn loại căn —'),(101,'ui','modal.removeUnit','Xoá'),(102,'ui','modal.errRequired','Vui lòng điền Họ tên và Số điện thoại.'),(103,'ui','modal.errPhone','Số điện thoại chưa đúng định dạng (VD: 0901 234 567).'),(104,'ui','modal.sending','Đang gửi…'),(105,'ui','modal.fieldEmail','Email'),(106,'ui','modal.fieldEmailOpt','(tuỳ chọn)'),(107,'ui','modal.fieldZalo','Zalo'),(108,'ui','modal.fieldZaloNote','(nếu khác SĐT)'),(109,'ui','modal.fieldCodeInterest','Mã căn quan tâm'),(110,'ui','modal.fieldBudget','Ngân sách dự kiến'),(111,'ui','modal.budget.under5','Dưới 5 tỷ'),(112,'ui','modal.budget.5to8','5 – 8 tỷ'),(113,'ui','modal.budget.8to12','8 – 12 tỷ'),(114,'ui','modal.budget.over12','Trên 12 tỷ'),(115,'ui','modal.fieldPurpose','Mục đích mua'),(116,'ui','modal.purpose.live','Ở thực'),(117,'ui','modal.purpose.invest','Đầu tư'),(118,'ui','modal.purpose.both','Cả hai'),(119,'ui','modal.fieldTime','Thời gian muốn xem'),(120,'ui','modal.time.weekend','Cuối tuần'),(121,'ui','modal.time.nextweek','Tuần tới'),(122,'ui','modal.time.flexible','Linh hoạt'),(123,'ui','modal.consentZalo','Đồng ý nhận thông tin qua <strong>Zalo</strong>'),(124,'ui','modal.consentSms','Đồng ý nhận thông tin qua <strong>SMS</strong>'),(125,'ui','modal.successTitle','Đã gửi thành công!'),(126,'ui','modal.successSub','Chúng tôi sẽ liên hệ lại trong <strong>vòng 30 phút</strong> trong giờ làm việc.'),(127,'ui','modal.successZalo','Chat Zalo ngay'),(128,'ui','modal.successReset','Gửi yêu cầu khác'),(129,'ui','stepper.title','Đặt lịch tham quan'),(130,'ui','stepper.step1','Chọn căn'),(131,'ui','stepper.step2','Thông tin'),(132,'ui','stepper.step3','Xác nhận'),(133,'ui','stepper.sectionTitle','Căn hộ quan tâm'),(134,'ui','stepper.skipUnit','Chưa chọn căn cụ thể →'),(135,'ui','stepper.filterAll','Tất cả'),(136,'ui','stepper.direction','Hướng'),(137,'ui','stepper.floor','Tầng'),(138,'ui','stepper.next','Tiếp theo'),(139,'ui','stepper.submit','Gửi yêu cầu'),(140,'ui','stepper.back','Quay lại'),(141,'ui','stepper.confirmTitle','Kiểm tra lại thông tin'),(142,'ui','stepper.confirmAction','Nhấn <strong style=\"color:var(--accent)\">Gửi yêu cầu</strong> để hoàn tất.<br/>Chúng tôi sẽ liên hệ trong <strong style=\"color:var(--fg)\">30 phút</strong>.'),(143,'ui','stepper.successTitle','Đã gửi thành công!'),(144,'ui','stepper.successSub','Chúng tôi sẽ liên hệ lại trong <strong>vòng 30 phút</strong> trong giờ làm việc.'),(145,'ui','stepper.successZalo','Chat Zalo ngay'),(146,'ui','stepper.successReset','Gửi yêu cầu khác'),(147,'ui','stepper.confirm.unitSelected','Căn đã chọn'),(148,'ui','stepper.confirm.contactInfo','Thông tin liên hệ'),(149,'ui','stepper.confirm.request','Yêu cầu'),(150,'ui','stepper.confirm.name','Họ tên'),(151,'ui','stepper.confirm.phone','Điện thoại'),(152,'ui','stepper.confirm.budget','Ngân sách'),(153,'ui','stepper.confirm.purpose','Mục đích'),(154,'ui','stepper.confirm.time','Thời gian xem'),(155,'ui','stepper.confirm.note','Ghi chú'),(156,'ui','stepper.confirm.contacts','Nhận tin'),(157,'ui','ui.masterplan','Masterplan'),(158,'ui','ui.properties','Bất động sản'),(159,'ui','ui.amenities','Tiện ích'),(160,'ui','ui.legal','Pháp lý'),(161,'ui','ui.location','Vị trí'),(162,'ui','ui.timeline','Tiến độ'),(163,'ui','ui.resources','Tài liệu'),(164,'ui','ui.menu','Menu'),(165,'ui','ui.projectInfo','Thông tin dự án'),(166,'ui','ui.openProjectInfo','Mở thông tin dự án'),(167,'ui','ui.masterplanTitle','Quy hoạch tổng thể'),(168,'ui','ui.propertiesTitle','Bất động sản'),(169,'ui','ui.amenitiesTitle','Tiện ích dự án'),(170,'ui','ui.legalTitle','Pháp lý & Uy tín'),(171,'ui','ui.locationTitle','Vị trí dự án'),(172,'ui','ui.timelineTitle','Tiến độ dự án'),(173,'ui','ui.resourcesTitle','Tài liệu dự án'),(174,'ui','ui.close','Đóng'),(175,'ui','amen.eyebrow','Tiện ích Vinhomes Hai Van Bay'),(176,'ui','amen.title','Hệ thống tiện ích đẳng cấp'),(177,'ui','amen.tab.noiKhu','Nội khu'),(178,'ui','amen.tab.skyAmenity','Cao tầng'),(179,'ui','amen.tab.dichVu','Dịch vụ'),(180,'ui','amen.tab.haTang','Hạ tầng'),(181,'ui','legal.eyebrow','Pháp lý & Uy tín'),(182,'ui','legal.title','Minh bạch — Bảo đảm — Tin cậy'),(183,'ui','legal.docs','Hồ sơ pháp lý'),(184,'ui','legal.reviews','Cư dân nói gì'),(185,'ui','location.eyebrow','Vị trí dự án'),(186,'ui','location.title','Kết nối hoàn hảo'),(187,'ui','location.cat.all','Tất cả'),(188,'ui','location.cat.school','🏫 Trường học'),(189,'ui','location.cat.hospital','🏥 Bệnh viện'),(190,'ui','location.cat.metro','🚇 Metro'),(191,'ui','location.cat.mall','🛍 TTTM'),(192,'ui','location.cat.airport','✈ Sân bay'),(193,'ui','timeline.eyebrow','Tiến độ xây dựng'),(194,'ui','timeline.title','Cập nhật thực địa'),(195,'ui','resources.eyebrow','Tài liệu'),(196,'ui','resources.title','Brochure, Bảng giá, Bộ nhận diện'),(197,'ui','props.eyebrow','Sản phẩm dự án'),(198,'ui','props.title','Bất động sản đang mở bán'),(199,'ui','props.searchPh','Tìm theo mã căn, tên sản phẩm…'),(200,'ui','props.filter','Lọc'),(201,'ui','props.filterTitle','Bộ lọc'),(202,'ui','props.filterClose','Đóng bộ lọc'),(203,'ui','props.filterReset','Xóa bộ lọc'),(204,'ui','pd.back','‹ Danh sách'),(205,'ui','fpv.title','Mặt bằng'),(206,'ui','fpv.zoomIn','Phóng to'),(207,'ui','fpv.zoomOut','Thu nhỏ'),(208,'ui','fpv.zoomReset','Đặt lại'),(209,'ui','fpv.hint','Cuộn để phóng to · Kéo để di chuyển'),(210,'ui','mpf.title','Bộ lọc Masterplan'),(211,'ui','mpf.reset','Đặt lại'),(212,'ui','mpf.apply','Áp dụng'),(213,'ui','mp.close','Đóng'),(214,'ui','modal.filter.unitType','Loại căn'),(215,'ui','modal.filter.floorGroup','Nhóm tầng'),(216,'ui','modal.filter.status','Trạng thái'),(217,'ui','modal.filter.reset','Xóa lọc'),(218,'ui','modal.floor.all','Tất cả'),(219,'ui','modal.floor.low','Thấp (1–15)'),(220,'ui','modal.floor.mid','Trung (16–30)'),(221,'ui','modal.floor.high','Cao (31+)'),(222,'ui','modal.status.all','Tất cả'),(223,'ui','modal.status.available','Còn trống'),(224,'ui','modal.status.holding','Đang giữ'),(225,'ui','modal.status.sold','Đã bán'),(226,'ui','modal.col.floor','Tầng'),(227,'ui','modal.col.area2','DT (m²)'),(228,'ui','modal.col.dir','Hướng'),(229,'ui','modal.col.ppm','Giá/m²'),(230,'ui','modal.col.st','TT'),(231,'ui','modal.col.price2','Giá'),(232,'dynamic','Khu Tây Hồ Tây, Hà Nội','Khu Tây Hồ Tây, Hà Nội'),(233,'dynamic','Đang mở bán giai đoạn 2','Đang mở bán giai đoạn 2'),(234,'dynamic','Từ 4.9 tỷ','Từ 4.9 tỷ'),(235,'dynamic','Bể bơi vô cực','Bể bơi vô cực'),(236,'dynamic','Gym & Yoga 1200m²','Gym & Yoga 1200m²'),(237,'dynamic','Spa & Onsen','Spa & Onsen'),(238,'dynamic','Trường liên cấp song ngữ','Trường liên cấp song ngữ'),(239,'dynamic','TTTM 18.000 m²','TTTM 18.000 m²'),(240,'dynamic','Công viên trung tâm','Công viên trung tâm'),(241,'dynamic','Sky lounge tầng 42','Sky lounge tầng 42'),(242,'dynamic','Khu vui chơi trẻ em','Khu vui chơi trẻ em'),(243,'dynamic','Cây xanh nội khu','Cây xanh nội khu'),(244,'dynamic','Mật độ xây dựng','Mật độ xây dựng'),(245,'dynamic','Tới hồ Tây','Tới hồ Tây'),(246,'dynamic','Tầm view panorama','Tầm view panorama'),(247,'dynamic','ha','ha'),(248,'dynamic','phút','phút'),(249,'dynamic','tầng','tầng'),(250,'dynamic','Tổng quan','Tổng quan'),(251,'dynamic','Tiện ích nội khu','Tiện ích nội khu'),(252,'dynamic','Tiện ích ngoại khu','Tiện ích ngoại khu'),(253,'dynamic','Mặt bằng tầng','Mặt bằng tầng'),(254,'dynamic','View 360 căn hộ','View 360 căn hộ'),(255,'dynamic','Tổng quan (Top View)','Tổng quan (Top View)'),(256,'dynamic','Tổng quan (View 1)','Tổng quan (View 1)'),(257,'dynamic','Tổng quan (View 2)','Tổng quan (View 2)'),(258,'dynamic','Tổng quan (View 3)','Tổng quan (View 3)'),(259,'dynamic','Tổng quan (View 4)','Tổng quan (View 4)'),(260,'dynamic','Tổng quan (View 5)','Tổng quan (View 5)'),(261,'dynamic','Bể bơi','Bể bơi'),(262,'dynamic','Đường dạo bộ','Đường dạo bộ'),(263,'dynamic','Sân chơi trẻ em','Sân chơi trẻ em'),(264,'dynamic','Sân thể thao','Sân thể thao'),(265,'dynamic','Sky Lounge','Sky Lounge'),(266,'dynamic','Tuyến Metro 6','Tuyến Metro 6'),(267,'dynamic','Tuyến đường Ánh Sáng','Tuyến đường Ánh Sáng'),(268,'dynamic','Bệnh viện Quốc tế Vinmec','Bệnh viện Quốc tế Vinmec'),(269,'dynamic','Zen Park','Zen Park'),(270,'dynamic','Đại lộ Thăng Long','Đại lộ Thăng Long'),(271,'dynamic','Vincom Mega Mall','Vincom Mega Mall'),(272,'dynamic','TTTM & nhà để xe 10 tầng','TTTM & nhà để xe 10 tầng'),(273,'dynamic','Central Park 10.2ha','Central Park 10.2ha'),(274,'dynamic','Đường Lê Trọng Tấn','Đường Lê Trọng Tấn'),(275,'dynamic','Trường THCS Nguyễn Quý Đức','Trường THCS Nguyễn Quý Đức'),(276,'dynamic','Tòa Thảo Mộc (I5)','Tòa Thảo Mộc (I5)'),(277,'dynamic','Tòa Nguyệt Quế (I4)','Tòa Nguyệt Quế (I4)'),(278,'dynamic','Tòa The Central (I3)','Tòa The Central (I3)'),(279,'dynamic','Tòa The Park (I2)','Tòa The Park (I2)'),(280,'dynamic','Tòa The Lake Premium (I1)','Tòa The Lake Premium (I1)'),(281,'dynamic','Studio - 34m²','Studio - 34m²'),(282,'dynamic','Studio - 35.1m²','Studio - 35.1m²'),(283,'dynamic','1 phòng ngủ + 1 - 43m²','1 phòng ngủ + 1 - 43m²'),(284,'dynamic','2 phòng ngủ + 1 - 46.4m²','2 phòng ngủ + 1 - 46.4m²'),(285,'dynamic','2 phòng ngủ + 1 - 54.6m²','2 phòng ngủ + 1 - 54.6m²'),(286,'dynamic','2 phòng ngủ + 1 - 54.7m²','2 phòng ngủ + 1 - 54.7m²'),(287,'dynamic','2 phòng ngủ + 1 - 59.2m²','2 phòng ngủ + 1 - 59.2m²'),(288,'dynamic','2 phòng ngủ + 1 - 62.2m²','2 phòng ngủ + 1 - 62.2m²'),(289,'dynamic','3 phòng ngủ - 74.5m²','3 phòng ngủ - 74.5m²'),(290,'dynamic','3 phòng ngủ - 75.6m²','3 phòng ngủ - 75.6m²'),(291,'dynamic','Sky Lounge — Tầng 42','Sky Lounge — Tầng 42'),(292,'dynamic','Tầm nhìn 360° toàn cảnh thành phố','Tầm nhìn 360° toàn cảnh thành phố'),(293,'dynamic','Tiện ích','Tiện ích'),(294,'dynamic','Penthouse mẫu — Tháp A','Penthouse mẫu — Tháp A'),(295,'dynamic','Căn 3PN duplex 142m² — tầng 41','Căn 3PN duplex 142m² — tầng 41'),(296,'dynamic','Căn hộ','Căn hộ'),(297,'dynamic','Phòng ngủ Master','Phòng ngủ Master'),(298,'dynamic','Suite riêng — 24m² + walk-in closet','Suite riêng — 24m² + walk-in closet'),(299,'dynamic','Bể bơi vô cực — Tầng 8','Bể bơi vô cực — Tầng 8'),(300,'dynamic','50m × 25m, hệ nước muối thẩm thấu','50m × 25m, hệ nước muối thẩm thấu'),(301,'dynamic','Công viên trung tâm — 12.4ha','Công viên trung tâm — 12.4ha'),(302,'dynamic','Vườn Nhật, hồ điều hòa, sân chạy 2.4km','Vườn Nhật, hồ điều hòa, sân chạy 2.4km'),(303,'dynamic','Toàn cảnh dự án','Toàn cảnh dự án'),(304,'dynamic','Phối cảnh tổng thể 6 tháp','Phối cảnh tổng thể 6 tháp'),(305,'dynamic','Tổng thể','Tổng thể'),(306,'dynamic','Vào penthouse mẫu','Vào penthouse mẫu'),(307,'dynamic','Khu BBQ ngoài trời','Khu BBQ ngoài trời'),(308,'dynamic','Bể bơi tràn 50m hướng tây nhìn hoàng hôn hồ Tây.','Bể bơi tràn 50m hướng tây nhìn hoàng hôn hồ Tây.'),(309,'dynamic','Khu BBQ 24 bàn riêng tư có mái che.','Khu BBQ 24 bàn riêng tư có mái che.'),(310,'dynamic','Phòng khách 38m²','Phòng khách 38m²'),(311,'dynamic','Sang phòng ngủ master','Sang phòng ngủ master'),(312,'dynamic','Bếp đảo Bosch','Bếp đảo Bosch'),(313,'dynamic','Cửa kính từ trần đến sàn, view trực diện hồ Tây.','Cửa kính từ trần đến sàn, view trực diện hồ Tây.'),(314,'dynamic','Trang bị full Bosch, đá Dekton, lò hấp & cảm ứng từ.','Trang bị full Bosch, đá Dekton, lò hấp & cảm ứng từ.'),(315,'dynamic','Tủ âm tường','Tủ âm tường'),(316,'dynamic','Cửa kính lùa toàn cảnh','Cửa kính lùa toàn cảnh'),(317,'dynamic','Quay lại Sky Lounge','Quay lại Sky Lounge'),(318,'dynamic','Tủ walk-in closet 6m² thiết kế riêng.','Tủ walk-in closet 6m² thiết kế riêng.'),(319,'dynamic','Cửa kính cách âm Low-E 3 lớp.','Cửa kính cách âm Low-E 3 lớp.'),(320,'dynamic','Bể trẻ em','Bể trẻ em'),(321,'dynamic','Cabana riêng tư','Cabana riêng tư'),(322,'dynamic','Đi cảnh quan','Đi cảnh quan'),(323,'dynamic','Bể nông 0.4m riêng biệt cho trẻ dưới 6 tuổi.','Bể nông 0.4m riêng biệt cho trẻ dưới 6 tuổi.'),(324,'dynamic','12 cabana có thể đặt riêng.','12 cabana có thể đặt riêng.'),(325,'dynamic','Vườn thiền Zen','Vườn thiền Zen'),(326,'dynamic','Sân chạy bộ 2.4km','Sân chạy bộ 2.4km'),(327,'dynamic','Lên Sky Lounge','Lên Sky Lounge'),(328,'dynamic','Vườn đá Karesansui phong cách Kyoto.','Vườn đá Karesansui phong cách Kyoto.'),(329,'dynamic','Đường runway phủ EPDM giảm chấn.','Đường runway phủ EPDM giảm chấn.'),(330,'dynamic','Tháp A — đang bán','Tháp A — đang bán'),(331,'dynamic','Tháp B & C','Tháp B & C'),(332,'dynamic','Giai đoạn 1 — đã bàn giao 2026.','Giai đoạn 1 — đã bàn giao 2026.'),(333,'dynamic','2PN','2PN'),(334,'dynamic','2PN+1','2PN+1'),(335,'dynamic','3PN','3PN'),(336,'dynamic','Duplex 3PN','Duplex 3PN'),(337,'dynamic','5.4 tỷ','5.4 tỷ'),(338,'dynamic','6.8 tỷ','6.8 tỷ'),(339,'dynamic','8.9 tỷ','8.9 tỷ'),(340,'dynamic','14.2 tỷ','14.2 tỷ'),(341,'dynamic','4.9 tỷ','4.9 tỷ'),(342,'dynamic','Khởi công','Khởi công'),(343,'dynamic','Cất nóc tháp A & B','Cất nóc tháp A & B'),(344,'dynamic','Mở bán GĐ 2','Mở bán GĐ 2'),(345,'dynamic','Hoàn thiện ngoại thất','Hoàn thiện ngoại thất'),(346,'dynamic','Bàn giao tháp A','Bàn giao tháp A'),(347,'dynamic','Q1 / 2024','Q1 / 2024'),(348,'dynamic','Q2 / 2026','Q2 / 2026'),(349,'dynamic','Q1 / 2027','Q1 / 2027'),(350,'dynamic','Q4 / 2027','Q4 / 2027'),(351,'dynamic','dự án Vinhomes Hai Van Bay ngay lúc này','dự án Vinhomes Hai Van Bay ngay lúc này'),(352,'dynamic','18 người đang xem','18 người đang xem'),(353,'dynamic','24 người đang xem','24 người đang xem'),(354,'dynamic','31 người đang xem','31 người đang xem'),(355,'dynamic','Vừa đặt giữ 2PN+1 tầng 22','Vừa đặt giữ 2PN+1 tầng 22'),(356,'dynamic','3 phút trước · Khách Hà Nội','3 phút trước · Khách Hà Nội'),(357,'dynamic','Vừa đặt giữ Duplex tầng 40','Vừa đặt giữ Duplex tầng 40'),(358,'dynamic','12 phút trước · Khách TP.HCM','12 phút trước · Khách TP.HCM'),(359,'dynamic','Còn 49 căn trong đợt này','Còn 49 căn trong đợt này'),(360,'dynamic','Ưu đãi 8% kết thúc sớm','Ưu đãi 8% kết thúc sớm'),(361,'dynamic','Vừa đặt giữ 3PN tầng 35','Vừa đặt giữ 3PN tầng 35'),(362,'dynamic','7 phút trước · Khách nước ngoài','7 phút trước · Khách nước ngoài'),(363,'dynamic','Căn 3PN tầng 28 vừa giữ','Căn 3PN tầng 28 vừa giữ'),(364,'dynamic','Chỉ còn 9 căn 3PN','Chỉ còn 9 căn 3PN'),(596,'ui','ui.subdivision','Phân khu'),(597,'ui','ui.subdivisions','Phân khu'),(598,'ui','ui.allTab','Tất cả'),(599,'ui','ui.filtering','Đang lọc'),(600,'ui','ui.filteringBy','Đang lọc theo'),(601,'ui','ui.overviewMode','Tổng quan — hiển thị đầy đủ'),(602,'ui','ui.projectContent','Nội dung dự án'),(603,'ui','ui.noContent','Chưa có nội dung'),(604,'ui','ui.group.tongQuan','Tổng quan'),(605,'ui','ui.group.phanKhu','Phân khu'),(606,'ui','ui.group.tienIchNoiKhu','Tiện ích nội khu'),(607,'ui','ui.group.tienIchNgoaiKhu','Tiện ích ngoại khu'),(608,'ui','ui.group.matBangTang','Mặt bằng tầng'),(609,'ui','ui.group.view360','View 360 căn hộ'),(610,'ui','ui.pc.overviewFull','Tổng quan — hiển thị đầy đủ'),(611,'ui','ui.pc.filteringBy','Đang lọc theo'),(612,'ui','ui.pc.highlightInfo','Thông tin nổi bật'),(613,'ui','ui.pc.watchIntroVideo','Xem video giới thiệu'),(614,'ui','ui.pc.subdivision','Phân khu'),(615,'ui','ui.pc.overviewInfo','Thông tin tổng quan'),(616,'ui','ui.pc.highlightPoints','Điểm nhấn nổi bật'),(617,'ui','ui.pc.viewProductsInPk','Xem sản phẩm tại phân khu'),(618,'ui','ui.pc.exploreVrTour','Khám phá VR Tour phân khu'),(619,'ui','ui.pc.status.opening','Đang mở bán'),(620,'ui','ui.status.available','Còn trống'),(621,'ui','ui.status.holding','Đang giữ'),(622,'ui','ui.status.sold','Đã bán'),(623,'ui','ui.gallery.emptyVideo','Chưa có video nào trong thư viện.'),(624,'ui','ui.gallery.emptyPhoto','Chưa có ảnh nào trong thư viện.'),(625,'ui','ui.empty.content','Chưa có nội dung'),(626,'ui','ui.empty.location','Chưa có địa điểm'),(627,'ui','ui.empty.milestone','Chưa có mốc tiến độ'),(628,'ui','ui.timeline.done','Hoàn thành'),(629,'ui','ui.timeline.doing','Đang thực hiện'),(630,'ui','ui.timeline.upcoming','Sắp tới'),(631,'ui','ui.res.brochure','Brochure dự án'),(632,'ui','ui.res.brandKit','Bộ nhận diện thương hiệu'),(633,'ui','ui.res.priceList','Bảng giá & chính sách'),(634,'ui','ui.res.floorPlanPdf','TMB mã căn & diện tích'),(635,'ui','ui.props.empty','Không có sản phẩm phù hợp bộ lọc.'),(636,'ui','ui.props.filter.type','Loại hình'),(637,'ui','ui.props.filter.maxPrice','Mức giá tối đa'),(638,'ui','ui.props.detail.consultant','Nhân viên tư vấn'),(639,'ui','ui.props.detail.price','Giá bán dự kiến'),(640,'ui','ui.props.detail.status','Tình trạng'),(641,'ui','ui.props.detail.type','Loại hình'),(642,'ui','ui.props.detail.legal','Pháp lý'),(643,'ui','ui.props.detail.handover','Dự kiến bàn giao'),(644,'ui','ui.props.emptyFloorplan','Chưa có mặt bằng.'),(645,'ui','ui.mp.overviewEyebrow','Tổng quan dự án'),(646,'ui','ui.mp.filter','Lọc'),(647,'ui','ui.mp.exploreVrTour','Khám phá VR Tour →'),(648,'ui','ui.mp.group.subdivision','Phân khu'),(649,'ui','ui.mp.group.displayType','Loại hiển thị'),(650,'ui','ui.mp.group.property','Bất động sản'),(651,'ui','ui.mp.group.status','Trạng thái'),(652,'ui','ui.mp.selectAll','Chọn tất cả'),(653,'ui','ui.ai.inputPh','Nhập câu hỏi…'),(654,'ui','ui.ai.errBrowser','Trình duyệt không hỗ trợ tính năng này.'),(655,'ui','ui.ai.errMic','Bạn cần cho phép truy cập micro.'),(656,'ui','ui.ai.connecting','Đang kết nối…'),(657,'ui','ui.ai.disconnected','Mất kết nối…'),(658,'ui','ui.ai.alertTitle','Thông báo'),(659,'ui','ui.ai.alertOk','Đã hiểu');
/*!40000 ALTER TABLE `translation_keys` ENABLE KEYS */;

--
-- Table structure for table `user_role_bindings`
--

DROP TABLE IF EXISTS `user_role_bindings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_role_bindings` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `role_id` bigint NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_role_bindings_user_id_role_id_key` (`user_id`,`role_id`),
  KEY `user_role_bindings_role_id_fkey` (`role_id`),
  CONSTRAINT `user_role_bindings_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`),
  CONSTRAINT `user_role_bindings_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_role_bindings`
--

/*!40000 ALTER TABLE `user_role_bindings` DISABLE KEYS */;
INSERT INTO `user_role_bindings` VALUES (1,1,3,'0000-00-00 00:00:00'),(2,2,3,'0000-00-00 00:00:00'),(21,21,5,'0000-00-00 00:00:00'),(22,22,1,'0000-00-00 00:00:00');
/*!40000 ALTER TABLE `user_role_bindings` ENABLE KEYS */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar_url` text COLLATE utf8mb4_unicode_ci,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `last_login_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `social_links_json` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_username_key` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'sales','$2a$10$44x7TFqnzquhKRhROYO.BuuezIlOv.bnjIBbG4WDBJNUNZ2eLkWLO','Nguyễn Minh Anh 123','anh.nguyen@auroraheights.vn','0911 222 333','Chuyên viên tư vấn cao cấp 112',NULL,1,'2026-05-27 07:26:20','0000-00-00 00:00:00','2026-05-27 07:26:20',NULL),(2,'sales2','$2a$10$FJ9pAyqazHaR8xWn6r9qT.awtFTZtfhXfXh1l0WK0eZF9lrTSWtPu','Trần Bảo Khánh','khanh.tran@auroraheights.vn','0922 333 444','Chuyên viên tư vấn',NULL,1,'0000-00-00 00:00:00','0000-00-00 00:00:00','0000-00-00 00:00:00',NULL),(21,'dev','$2a$10$0HGyTnMW.1SzSA90usp//uovw0OvVUTGdpXYUolOso0BK3.5gEyrq','Developer',NULL,NULL,'Kỹ thuật — Toàn quyền',NULL,1,'2026-05-27 02:19:53','0000-00-00 00:00:00','2026-05-27 02:19:53',NULL),(22,'admin','$2a$10$4Gp49.wG4CRS.Hx0rQ/jZOkqk9PE38W/X5.bD022Xn8jqqbX2chbK','Chủ Đầu Tư',NULL,NULL,'Quản trị dự án',NULL,1,'2026-05-27 07:01:36','0000-00-00 00:00:00','2026-05-27 07:01:36',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;

--
-- Table structure for table `vr_hotspots`
--

DROP TABLE IF EXISTS `vr_hotspots`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vr_hotspots` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `scene_id` bigint NOT NULL,
  `target_scene_id` bigint DEFAULT NULL,
  `hotspot_code` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `hotspot_type` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `label` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `x_ratio` decimal(8,6) DEFAULT NULL,
  `y_ratio` decimal(8,6) DEFAULT NULL,
  `yaw_deg` decimal(9,4) DEFAULT NULL,
  `pitch_deg` decimal(9,4) DEFAULT NULL,
  `media_url` text COLLATE utf8mb4_unicode_ci,
  `sort_order` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `metadata` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `vr_hotspots_scene_id_hotspot_code_key` (`scene_id`,`hotspot_code`),
  KEY `idx_vr_hotspots_scene_sort` (`scene_id`,`sort_order`),
  KEY `vr_hotspots_target_scene_id_fkey` (`target_scene_id`),
  CONSTRAINT `vr_hotspots_scene_id_fkey` FOREIGN KEY (`scene_id`) REFERENCES `vr_scenes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `vr_hotspots_target_scene_id_fkey` FOREIGN KEY (`target_scene_id`) REFERENCES `vr_scenes` (`id`) ON DELETE SET NULL,
  CONSTRAINT `vr_hotspots_chk_1` CHECK ((`hotspot_type` in (_utf8mb4'info',_utf8mb4'nav',_utf8mb4'image',_utf8mb4'video',_utf8mb4'link_unit')))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vr_hotspots`
--

/*!40000 ALTER TABLE `vr_hotspots` DISABLE KEYS */;
/*!40000 ALTER TABLE `vr_hotspots` ENABLE KEYS */;

--
-- Table structure for table `vr_scenes`
--

DROP TABLE IF EXISTS `vr_scenes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vr_scenes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `project_id` bigint NOT NULL,
  `panorama_id` bigint DEFAULT NULL,
  `scene_code` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `scene_name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `scene_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `horizon_y` decimal(8,4) DEFAULT NULL,
  `palette_json` json DEFAULT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `metadata` json DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `vr_scenes_project_id_scene_code_key` (`project_id`,`scene_code`),
  KEY `idx_vr_scenes_project_sort` (`project_id`,`sort_order`),
  KEY `vr_scenes_panorama_id_fkey` (`panorama_id`),
  CONSTRAINT `vr_scenes_panorama_id_fkey` FOREIGN KEY (`panorama_id`) REFERENCES `panorama_assets` (`id`) ON DELETE SET NULL,
  CONSTRAINT `vr_scenes_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vr_scenes`
--

/*!40000 ALTER TABLE `vr_scenes` DISABLE KEYS */;
/*!40000 ALTER TABLE `vr_scenes` ENABLE KEYS */;

--
-- Dumping events for database 'haivanbay'
--

--
-- Dumping routines for database 'haivanbay'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-30  2:22:00
