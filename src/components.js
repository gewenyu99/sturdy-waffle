import axios from "axios";
import React, {Fragment, useState} from "react";



export const BASE_URL = `some url`;
export const LONDON = `api`;

axios.defaults.baseURL = BASE_URL;

export function WikiSummary(props) {
    const [summary, setSummary] = useState();
    const getSummary = async () => {
        const [response, error] = await get(LONDON, {"header": "header_content"});
        if (error) {
            props.propagateError(error, null);
            return;
        }
        setSummary(response['data']);
    };

    return (
        <Fragment>
            <p>{JSON.stringify(summary)}</p>
            <button onClick={getSummary}>Get Summary</button>
        </Fragment>
    )
}

async function get(suburl, headers) {
    let response, error;
    try {
        response = await axios.get(suburl,
            {
                headers: headers
            });
    } catch (e) {
        error = e;
    }
    return [response, error]
}

export async function getAll(requests) {
    let [r, error] = [null, null];
    await axios.all(requests).then(axios.spread((...responses) => {
        console.log(responses);
        r = responses;
    })).catch(e => {
        error = e;
    });
    return [r, error];
}

