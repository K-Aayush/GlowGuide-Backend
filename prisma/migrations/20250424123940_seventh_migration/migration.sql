-- DropForeignKey
ALTER TABLE `productskinconcern` DROP FOREIGN KEY `ProductSkinConcern_productId_fkey`;

-- DropForeignKey
ALTER TABLE `productskintype` DROP FOREIGN KEY `ProductSkinType_productId_fkey`;

-- DropForeignKey
ALTER TABLE `progresslog` DROP FOREIGN KEY `ProgressLog_userId_fkey`;

-- DropForeignKey
ALTER TABLE `routine` DROP FOREIGN KEY `Routine_userId_fkey`;

-- DropForeignKey
ALTER TABLE `routinestep` DROP FOREIGN KEY `RoutineStep_productId_fkey`;

-- DropForeignKey
ALTER TABLE `routinestep` DROP FOREIGN KEY `RoutineStep_routineId_fkey`;

-- DropForeignKey
ALTER TABLE `skinconcernonprofile` DROP FOREIGN KEY `SkinConcernOnProfile_skinProfileId_fkey`;

-- DropForeignKey
ALTER TABLE `skinprofile` DROP FOREIGN KEY `SkinProfile_userId_fkey`;

-- DropForeignKey
ALTER TABLE `skintypeonprofile` DROP FOREIGN KEY `SkinTypeOnProfile_skinProfileId_fkey`;

-- DropIndex
DROP INDEX `ProductSkinConcern_productId_fkey` ON `productskinconcern`;

-- DropIndex
DROP INDEX `ProductSkinType_productId_fkey` ON `productskintype`;

-- DropIndex
DROP INDEX `ProgressLog_userId_fkey` ON `progresslog`;

-- DropIndex
DROP INDEX `Routine_userId_fkey` ON `routine`;

-- DropIndex
DROP INDEX `RoutineStep_productId_fkey` ON `routinestep`;

-- DropIndex
DROP INDEX `RoutineStep_routineId_fkey` ON `routinestep`;

-- DropIndex
DROP INDEX `SkinConcernOnProfile_skinProfileId_fkey` ON `skinconcernonprofile`;

-- DropIndex
DROP INDEX `SkinTypeOnProfile_skinProfileId_fkey` ON `skintypeonprofile`;

-- AddForeignKey
ALTER TABLE `SkinProfile` ADD CONSTRAINT `SkinProfile_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SkinTypeOnProfile` ADD CONSTRAINT `SkinTypeOnProfile_skinProfileId_fkey` FOREIGN KEY (`skinProfileId`) REFERENCES `SkinProfile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SkinConcernOnProfile` ADD CONSTRAINT `SkinConcernOnProfile_skinProfileId_fkey` FOREIGN KEY (`skinProfileId`) REFERENCES `SkinProfile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductSkinType` ADD CONSTRAINT `ProductSkinType_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductSkinConcern` ADD CONSTRAINT `ProductSkinConcern_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Routine` ADD CONSTRAINT `Routine_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RoutineStep` ADD CONSTRAINT `RoutineStep_routineId_fkey` FOREIGN KEY (`routineId`) REFERENCES `Routine`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RoutineStep` ADD CONSTRAINT `RoutineStep_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProgressLog` ADD CONSTRAINT `ProgressLog_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
