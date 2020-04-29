import React from 'react';
import {WikiSummary} from "./src/components";
import {ErrorBoundary} from "./src/ErrorBoundries";

function App(props) {
    return (
        <ErrorBoundary reportError={report}>
            <WikiSummary/>
        </ErrorBoundary>
    )
}

let report = (e, i) => {
    console.log("Error: ", e, i)
};
export default App;