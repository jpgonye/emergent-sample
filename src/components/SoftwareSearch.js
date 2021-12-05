import React, { useEffect, useState } from 'react'
import { getSoftwareByVersion, getAllSoftware } from '../data/software';
import { parseSemver } from '../utilities/semver';

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

    const handleChange = (inputVal) => {
        const value = inputVal.target.value;
        const parsedData = parseSemver(value);
        setVersionInput(value);
        setParsedVersion(parsedData);
    };

    useEffect(() => {
        loadData();
    }, [parsedVersion]);

    return (
        <div>
            <h2>
                Software Version Search
                </h2>
            <div className="mb-3">
                <input type="text" className="form-control form-control-lg" onChange={handleChange} value={versionInput} placeholder="ex. 2, 2.0, 2.0.0" />
            </div>

            {loading ? <div>Loading...</div> : <>
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
                    </tbody>
                </table>
            </>}
        </div>
    )
}
