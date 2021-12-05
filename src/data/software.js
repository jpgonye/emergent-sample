import { compareSemver, parseSemver } from "../utilities/semver";

export async function getAllSoftware()
{
    const result = await fetch("/data/software.json");
    const jsonResult = await result.json();
    
    console.debug("got all software: ", jsonResult);
    
    return jsonResult;
}

export async function getSoftwareByVersion(versionString) {
    const softwareData = await getAllSoftware();
    const inputVersion = parseSemver(versionString);
    
    return softwareData.filter((software) => {
        const softwareVersion = parseSemver(software.Version);
        return compareSemver(softwareVersion, inputVersion) >= 0;
    })
}