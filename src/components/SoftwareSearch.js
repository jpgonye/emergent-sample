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
            <div className="my-2 fw-bold text-end">
                <span className="text-primary h5">{items.length}</span> records found
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
                        <td colSpan="2">No software found with version <b>{versionInput}</b> or greater</td>
                    </tr>}
                </tbody>
            </table>
        </>
    };

    const invalidSearchMessage = <>
        <div className="alert alert-light border mt-3 px-4">
            <div className="d-flex">
                <div>
                    <h4 className="text-danger"><i className="bi bi-exclamation-triangle-fill text-danger"></i> Invalid Version Entered</h4>
                    <p>
                        The version number you have entered is invalid.
                    </p>
                    <p>
                        Please use the format <span className="fw-bold fst-italic">major.minor.patch</span> to search.
                    </p>
                    <p className="mb-0">
                        <b>Examples:</b> 2, 2.0, 2.0.0
                    </p>
                </div>
            </div>
        </div>
    </>;

    const emptySearchMessage = <>
        <div className="alert alert-light border mt-3 px-4">
            <div className="d-flex">
                <div>
                    <h4 className="text-danger"><i className="bi bi-exclamation-triangle-fill text-danger"></i> Enter a Version Number to Search</h4>
                    <p>
                        Please enter a version number to search.  All software with that
                        version or higher will be displayed.
                    </p>
                    <p>
                        Use the format <span className="fw-bold fst-italic">major.minor.patch</span> to search.
                    </p>
                    <p className="mb-0">
                        <b>Examples:</b> 2, 2.0, 2.0.0
                    </p>
                </div>
            </div>
        </div>
    </>;

    const searchMessage = versionInput === "" ? emptySearchMessage : invalidSearchMessage;

    const searchResults = () => {
        return parsedVersion && parsedVersion.valid ? resultsTable() : searchMessage;
    }

    return (
        <div>
            <h2 className="display-6 text-primary mb-3">
                Software Catalog Search
                </h2>
            <div className="">
                <input type="text" className="form-control" onChange={debouncedChangeHandler} placeholder="Version number (e.g. 2, 2.0, 2.0.0, etc.)" />
            </div>

            {searchResults()}
        </div>
    )
}
