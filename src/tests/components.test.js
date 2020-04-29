import {getAll, LONDON, WikiSummary} from "../components";
import React from "react";
import axios from "axios";
import {act, fireEvent, render, wait} from '@testing-library/react'
import {ErrorBoundary} from "../ErrorBoundries";

jest.mock('axios');

it('should return summary', async function () {
    let urlReceived, headersReceived;
    axios.get.mockImplementation((url, headers) => {
        [urlReceived, headersReceived] = [url, headers];
        return {"data": {"test": "response"}}
    });
    let container, getByText, getByLabelText;
    await act(async () => {
        let c = render(
            <WikiSummary/>
        );
        container = c.container;
        getByText = c.getByText;
        getByLabelText = c.getByLabelText;
        await wait(() => expect(container.textContent).toContain('Get Summary'));
        fireEvent.click(getByText('Get Summary'), {button: 0});
        await wait(() => expect(container.textContent).toContain("{\"test\":\"response\"}"));
    });
    expect(urlReceived).toEqual(LONDON);
    expect(headersReceived).toEqual({
        "headers": {
            "header": "header_content"
        }
    });
});

it('should throw error when request fails', async function () {
    axios.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Pretend this request failed")),
    );
    let container, getByText, getByLabelText;
    const f = jest.fn();

    await act(async () => {
        let c = render(
            <ErrorBoundary reportError={f}>
                <WikiSummary/>
            </ErrorBoundary>
        );
        container = c.container;
        getByText = c.getByText;
        await wait(() => expect(container.textContent).toContain('Get Summary'));
        fireEvent.click(getByText('Get Summary'), {button: 0});
        await wait(() => expect(container.textContent).toContain('Something went wrong.'));
    });
    expect(f).toHaveBeenCalledWith(Error("Pretend this request failed"), null);
});

test('should get all success', async (done) => {
    const urls = new Set(["one", "two", "three"]);
    const interceptedUrls = [];
    const interceptedConfigs = [];
    const mockResponses = ["mock response 1", "mock response 2", "mock response 3"];

    //mock individual get request
    axios.get.mockImplementation((url, config) => {
        interceptedUrls.push(url);
        interceptedConfigs.push(config);
        return Promise.resolve()
    });
    //replace all behavior, which just resolves
    axios.all.mockImplementation(() => {
        return Promise.resolve()
    });
    //mock spread implementation
    axios.spread.mockImplementation((r) => {
        r(...mockResponses);
    });

    //write requests
    const requests = ["one", "two", "three"].map((id) => {
        return axios.get(id, {
            'headers': {'uid': id}
        })
    });

    await getAll(requests).then((r) => {
        let [response, error] = r;
        expect(interceptedUrls).toEqual(["one", "two", "three"]);
        expect(interceptedConfigs).toEqual(["one", "two", "three"].map((url)=>{
            return {'headers': {'uid': url}}
        }));
        expect(response).toEqual([
            "mock response 1",
            "mock response 2",
            "mock response 3"
        ]);
        done();
    });
});

test('should get handle error', async (done) => {
    const urls = new Set(["one", "two", "three"]);

    //mock individual get request
    axios.get.mockImplementation((url, config) => {
        return Promise.resolve()
    });
    //replace all behavior, which just resolves
    axios.all.mockImplementation(() => {
        return Promise.reject("reason")
    });

    //write requests
    const requests = ["one", "two", "three"].map((id) => {
        return axios.get(id, {
            'headers': {'uid': id}
        })
    });

    await getAll(requests).then((r) => {
        let [response, error] = r;
        console.log(error);
        expect(error).toEqual('reason');
        done();
    });
});