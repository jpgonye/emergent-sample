export function parseSemver(versionString) {
    if (versionString) {
        if (isValidSemverString(versionString)) {
            const components = versionString.split(".");
            const majorString = components.length > 0 ? components[0] : null;
            const minorString = components.length > 1 ? components[1] : null;
            const patchString = components.length > 2 ? components[2] : null;

            const majorVal = majorString ? parseInt(majorString, 10) : 0;
            const minorVal = minorString ? parseInt(minorString, 10) : 0;
            const patchVal = patchString ? parseInt(patchString, 10) : 0;

            return {
                valid: true,
                major: majorVal,
                minor: minorVal,
                patch: patchVal
            };
        } else {
            return { valid: false };
        }
    } else {
        return { valid: false };
    }
}

export function isValidSemverString(versionString) {
    if (versionString) {
        const exp = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/gi;
        const exp2 = /^((0|[1-9]\d*)\.(0|[1-9]\d*))$/gi;
        const exp3 = /^(0|[1-9]\d*)$/gi;
        const result = exp.test(versionString) || exp2.test(versionString) || exp3.test(versionString);
        console.debug(versionString + " is " + (result ? "" : "not") + "a valid version string");
        return result;
    } else {
        return false;
    }
}

export function compareSemver(item1, item2) {
    if(item1.major > item2.major) {
        return 1;
    } else if(item1.major < item2.major) {
        return -1;
    } else {
        // major versions are equal - look at minor
        if(item1.minor > item2.minor) {
            return 1;
        } else if(item1.minor < item2.minor) {
            return -1;
        } else {
            // major and minor are equal - look at patch
            if(item1.patch > item2.patch) {
                return 1;
            } else if (item1.patch < item2.patch) {
                return -1;
            } else {
                // major, minor and patch are equal - return 0
                return 0;
            }
        }
    }
}