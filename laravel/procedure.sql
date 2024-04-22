DELIMITER //

CREATE PROCEDURE checkChildAvailability(IN placementId BIGINT)
BEGIN
    DECLARE leftCount INT;
    DECLARE rightCount INT;
    
    SET @SUID = placementId;

    SET @sqlQuery1 = CONCAT('SELECT COUNT(id) AS leftCount FROM binary_tree WHERE placement_id = ? AND leg_position = "left"');
    PREPARE STMT FROM @sqlQuery1;
    EXECUTE STMT USING @SUID;
    DEALLOCATE PREPARE STMT;

    SET @sqlQuery2 = CONCAT('SELECT COUNT(id) AS rightCount FROM binary_tree WHERE placement_id = ? AND leg_position = "right"');
    PREPARE STMT FROM @sqlQuery2;
    EXECUTE STMT USING @SUID;
    DEALLOCATE PREPARE STMT;
    
    -- Now you can use the leftCount and rightCount as needed
END //

DELIMITER ;



/* ########################################################################## */