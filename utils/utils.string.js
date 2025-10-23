export class UtilsString {
    constructor() {}
    static capitalizeFirstLetter(str) {
        if (typeof str !== 'string' || str.length === 0) {
            return str;
        }
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    static ipv4FromString(text) {
        // Regular expression to match an IPv4 address
        // It looks for four sets of numbers (0-255) separated by dots.
        const ipv4Regex = /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g;

        const matches = text.match(ipv4Regex);

        if (matches && matches.length > 0) {
            // If multiple IPs are found, this will return the first one.
            // To get all, return 'matches'.
            return matches[0];
        } else {
            return null; // No IPv4 address found
        }
    }
  // Other string utility methods can be added here
}

