-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: stroimag_db
-- ------------------------------------------------------
-- Server version	9.1.0

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
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT 'placeholder.jpg',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Перфоратор Bosch',8500.00,'Инструменты','perforator.jpg'),(2,'Шуруповерт Makita',5200.00,'Инструменты','drill.jpg'),(3,'Набор отверток (12 шт)',1200.00,'Инструменты','screwdrivers.jpg'),(4,'Молоток слесарный',450.00,'Инструменты','hammer.jpg'),(5,'Уровень лазерный',3100.00,'Инструменты','laser.jpg'),(6,'Краска белая (10л)',2400.00,'Малярные товары','paint.jpg'),(7,'Валик малярный',350.00,'Малярные товары','roller.jpg'),(8,'Кисть плоская 50мм',120.00,'Малярные товары','brush.jpg'),(9,'Шпатлевка финишная',800.00,'Стройматериалы','putty.jpg'),(10,'Цемент М500 (50кг)',450.00,'Стройматериалы','cement.jpg'),(11,'Смеситель для ванны',4200.00,'Сантехника','faucet.jpg'),(12,'Труба ПП 20мм (2м)',150.00,'Сантехника','pipe.jpg'),(13,'Унитаз компакт',7800.00,'Сантехника','toilet.jpg'),(14,'Раковина 60см',3200.00,'Сантехника','sink.jpg'),(15,'Кабель ВВГнг 3x2.5',85.00,'Электрика','cable.jpg'),(16,'Розетка двойная',250.00,'Электрика','socket.jpg'),(17,'Выключатель одноклавишный',180.00,'Электрика','switch.jpg'),(18,'Лампа светодиодная',150.00,'Электрика','lamp.jpg'),(19,'Автомат 16А',320.00,'Электрика','breaker.jpg'),(20,'Плитка напольная 30x30',950.00,'Плитка','tile1.jpg'),(21,'Керамзит (50л)',280.00,'Стройматериалы','gravel.jpg'),(22,'Гипсокартон 12.5мм',420.00,'Стройматериалы','drywall.jpg'),(23,'Профиль направляющий',180.00,'Стройматериалы','profile.jpg'),(24,'Саморезы по металлу (1000шт)',650.00,'Крепеж','screws.jpg'),(25,'Дюбель-гвоздь 6x40',2.00,'Крепеж','dowels.jpg'),(26,'Лобзик электрический',3900.00,'Инструменты','jigsaw.jpg'),(27,'Болгарка (УШМ)',4500.00,'Инструменты','grinder.jpg'),(28,'Стремянка 4 ступени',2100.00,'Инструменты','ladder.jpg'),(29,'Клей для плитки (25кг)',550.00,'Стройматериалы','glue.jpg'),(30,'Грунтовка (5л)',600.00,'Малярные товары','primer.jpg'),(31,'Пена монтажная',450.00,'Стройматериалы','foam.jpg'),(32,'Силиконовый герметик',320.00,'Стройматериалы','sealant.jpg'),(33,'Рулетка 5м',280.00,'Инструменты','measure.jpg'),(34,'Ножовка по дереву',550.00,'Инструменты','saw.jpg'),(35,'Плоскогубцы',680.00,'Инструменты','pliers.jpg'),(36,'Ключ разводной',890.00,'Инструменты','wrench.jpg'),(37,'Фонарь налобный',750.00,'Электрика','flashlight.jpg'),(38,'Удлинитель 5м',900.00,'Электрика','extension.jpg'),(39,'Радиатор отопления',5600.00,'Сантехника','radiator.jpg'),(40,'Гибкая подводка',220.00,'Сантехника','hose.jpg'),(41,'Вентилятор вытяжной',1400.00,'Электрика','fan.jpg'),(42,'Сетка штукатурная',1100.00,'Стройматериалы','mesh.jpg'),(43,'Малярный скотч',150.00,'Малярные товары','tape.jpg'),(44,'Пленка защитная',200.00,'Малярные товары','film.jpg'),(45,'Ведро строительное',180.00,'Инструменты','bucket.jpg'),(46,'Лопата совковая',650.00,'Инструменты','shovel.jpg'),(47,'Кельма каменщика',420.00,'Инструменты','trowel.jpg'),(48,'Тачка садовая',3800.00,'Инструменты','barrow.jpg'),(49,'Перчатки рабочие',45.00,'Инструменты','gloves.jpg'),(50,'Очки защитные',250.00,'Инструменты','glasses.jpg'),(51,'Перфоратор Bosch GBH 2-26',12500.00,'Инструменты','perforator_bosch.jpg'),(52,'Шуруповерт Makita 18V',9800.00,'Инструменты','makita_drill.jpg'),(53,'Болгарка DeWalt 125мм',7400.00,'Инструменты','dewalt_grinder.jpg'),(54,'Набор ключей комбинированных (24 шт)',3500.00,'Инструменты','keys_set.jpg'),(55,'Лобзик электрический Metabo',6200.00,'Инструменты','metabo_jigsaw.jpg'),(56,'Лазерный осепостроитель (360 градусов)',11200.00,'Инструменты','laser_level.jpg'),(57,'Степлер строительный усиленный',1200.00,'Инструменты','stapler.jpg'),(58,'Молоток-гвоздодер 500г',850.00,'Инструменты','hammer_pro.jpg'),(59,'Ножовка по металлу (с полотном)',950.00,'Инструменты','saw_metal.jpg'),(60,'Набор сверл по бетону (8 шт)',1500.00,'Инструменты','drills_concrete.jpg'),(61,'Цемент М500 Extra (50 кг)',550.00,'Стройматериалы','cement_m500.jpg'),(62,'Гипсокартон Knauf (1200х2500)',480.00,'Стройматериалы','knauf_list.jpg'),(63,'Пескобетон М300 (30 кг)',280.00,'Стройматериалы','peskobeton.jpg'),(64,'Утеплитель Технониколь (50 мм)',1850.00,'Стройматериалы','isolation.jpg'),(65,'Кирпич облицовочный красный',28.00,'Стройматериалы','brick.jpg'),(66,'Плиточный клей усиленный (25 кг)',640.00,'Стройматериалы','tile_glue.jpg'),(67,'Штукатурка Волма-Слой (30 кг)',520.00,'Стройматериалы','shpatel.jpg'),(68,'Профиль направляющий 60х27',190.00,'Стройматериалы','profile_60.jpg'),(69,'Сетка армирующая (50м)',1400.00,'Стройматериалы','mesh_arm.jpg'),(70,'Пена монтажная всесезонная',650.00,'Стройматериалы','foam_pro.jpg'),(71,'Смеситель Grohe для раковины',8900.00,'Сантехника','grohe_faucet.jpg'),(72,'Инсталляция Geberit с кнопкой',18500.00,'Сантехника','geberit.jpg'),(73,'Душевая стойка с тропическим дошем',12400.00,'Сантехника','shower_set.jpg'),(74,'Радиатор биметаллический (10 секций)',7200.00,'Сантехника','radiator.jpg'),(75,'Труба полипропиленовая 25мм (4м)',380.00,'Сантехника','pipe_pp.jpg'),(76,'Полотенцесушитель водяной L-образный',4500.00,'Сантехника','towel_warmer.jpg'),(77,'Фильтр для воды проточный',5600.00,'Сантехника','water_filter.jpg'),(78,'Счетчик воды универсальный',1100.00,'Сантехника','water_meter.jpg'),(79,'Герметик силиконовый санитарный',420.00,'Сантехника','sealant_san.jpg'),(80,'Сифон для ванны клик-клак',1800.00,'Сантехника','siphon.jpg'),(81,'Кабель ВВГнг-LS 3х2.5 (100м)',8500.00,'Электрика','cable_vvg.jpg'),(82,'Автоматический выключатель ABB 16A',450.00,'Электрика','abb_16.jpg'),(83,'Розетка Legrand Valena (белая)',350.00,'Электрика','legrand_socket.jpg'),(84,'Щит электрический на 24 модуля',2800.00,'Электрика','electric_box.jpg'),(85,'Светильник светодиодный 36Вт',1450.00,'Электрика','led_light.jpg'),(86,'УЗО Schneider Electric 2P 25A',3200.00,'Электрика','schneider_uzo.jpg'),(87,'Коробка распределительная IP55',180.00,'Электрика','junction_box.jpg'),(88,'Подрозетник для бетона (комплект 10 шт)',250.00,'Электрика','socket_base.jpg'),(89,'Гофра ПВХ 20мм с протяжкой (50м)',750.00,'Электрика','gofra.jpg'),(90,'Теплый пол под плитку (4м2)',6900.00,'Электрика','warm_floor.jpg'),(91,'Краска Tikkurila Euro Power 7 (9л)',7800.00,'Малярные товары','tikkurila.jpg'),(92,'Грунтовка глубокого проникновения (10л)',950.00,'Малярные товары','primer_10.jpg'),(93,'Валик велюровый 250мм',480.00,'Малярные товары','roller_velour.jpg'),(94,'Кисть малярная натуральная щетина',220.00,'Малярные товары','brush_natural.jpg'),(95,'Шпатель фасадный нержавеющий',550.00,'Малярные товары','spatula_pro.jpg'),(96,'Малярная лента (50м)',150.00,'Малярные товары','masking_tape.jpg'),(97,'Растворитель Уайт-спирит (1л)',320.00,'Малярные товары','spirit.jpg'),(98,'Клей для тяжелых обоев (Quelyd)',680.00,'Малярные товары','wallpaper_glue.jpg'),(99,'Скребок для удаления краски',350.00,'Малярные товары','scraper.jpg'),(100,'Затирка для швов влагостойкая (2кг)',420.00,'Малярные товары','fuga.jpg');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (8,'Алексей Наливайко','nalialex2005@gmail.com','1111','2025-12-18 09:59:37'),(9,'1','test@example.com','1111','2025-12-18 10:00:40'),(10,'человек','nalialasdfsdex2005@gmail.com','1111','2025-12-18 11:05:52');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'stroimag_db'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-20 15:33:56
