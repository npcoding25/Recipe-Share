DROP DATABASE tasks;
CREATE DATABASE tasks;
USE tasks;

CREATE TABLE tasks (
    `id` INTEGER AUTO_INCREMENT PRIMARY KEY,
    `priority` ENUM('danger','primary','secondary') DEFAULT 'primary', /* using bootstrap class as priority colouring */
    `info` VARCHAR(255) NOT NULL,
    `due` TIMESTAMP DEFAULT NULL,
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)