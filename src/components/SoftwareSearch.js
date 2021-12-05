import React, { useEffect, useState, useMemo } from 'react'
import { getSoftwareByVersion, getAllSoftware } from '../data/software';
import { parseSemver } from '../utilities/semver';
import debounce from 'lodash.debounce';

export default function SoftwareSearch() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [versionInput, setVersionInput] = useState("");
    const [parsedVersion, setParsedVersion] = useState({ valid: false });

    const loadData = async () => {
        setLoading(true);
        let itemData = [];

        if (parsedVersion.valid) {
            itemData = await getSoftwareByVersion(versionInput);
        } else {
            itemData = await getAllSoftware();
        }

        setItems(itemData);
        setLoading(false);
    };

    const handleChange = (event) => {
        const value = event.target.value;
        setVersionInput(value);
        setParsedVersion(parseSemver(value));
    };

    useEffect(() => {
        loadData();
    }, [parsedVersion]);

    const debouncedChangeHandler = useMemo(
        () => debounce(handleChange, 500)
        , []);
    
        useEffect(() => {
        return () => {
            debouncedChangeHandler.cancel();
        }
    }, [debouncedChangeHandler]);

    const resultsTable = () => {
        return loading ? <div>Loading...</div> : <>
            <div className="mb-3">
                <span className="badge bg-primary rounded-pill">{items.length}</span> matching versions found
            </div>
            <table className="table table-hover border">
                <thead className="bg-light text-dark border-bottom">
                    <tr>
                        <th className="fw-normal">Product Name</th>
                        <th className="fw-normal">Version</th>
                    </tr>
                </thead>
                <tbody className="border-top-0">
                    {items.map(item =>
                        <tr key={item.Name + item.Version}>
                            <td>{item.Name}</td>
                            <td>{item.Version}</td>
                        </tr>
                    )}
                    {items.length === 0 && <tr>
                        <td colSpan="2">No matching records found</td>
                    </tr>}
                </tbody>
            </table>
        </>
    };

    const invalidSearchMessage = <>
        <p className="alert alert-light border p-5 text-center">The version number you have entered is invalid.  Please use the format [major].[minor].[patch] to search  (ex. 2, 2.0, 2.0.0, etc.).</p>
    </>;

    const searchResults = () => {
        return parsedVersion && parsedVersion.valid ? resultsTable() : invalidSearchMessage;
    }

    return (
        <div>
            <h2>
                Software Version Search
                </h2>
            <div className="mb-3">
                <input type="text" className="form-control form-control-lg" onChange={debouncedChangeHandler} placeholder="Enter a version number (ex. 2, 2.0, 2.0.0, etc.)" />
            </div>

            {searchResults()}
        </div>
    )
}
