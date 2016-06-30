/**
 * Common utilities
 */

/**
 * Generate the current Unix Timestamp
 * @returns {number} the timestamp
 */
exports.unixTimestamp = function () {
    return Math.round(new Date().getTime() / 1000);
};