CREATE DATABASE fooddb;
USE fooddb;

SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE IF NOT EXISTS user(
`id` INTEGER NOT NULL,
`username` varchar(255) NOT NULL,
`password` varchar(255) NOT NULL,
PRIMARY KEY (id),
`createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reciepe (
    `reciepe_id` INTEGER PRIMARY KEY,
    `frequency` ENUM('danger','primary','secondary') DEFAULT 'primary', /* using bootstrap class as priority colouring */
    `title` VARCHAR(255) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `sourceUrl` VARCHAR(255) NOT NULL DEFAULT "https://rapidapi.com/webknox/api/recipe/endpoints",
    CONSTRAINT FOREIGN KEY (user_id) REFERENCES user(id),
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)