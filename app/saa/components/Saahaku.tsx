'use client'
import Button from "react-bootstrap/Button";
import {useEffect, useState} from "react";

export default function Saahaku() {

    const [data, setData] = useState(null);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        fetch('https://www.ilmatieteenlaitos.fi/api//weather/forecasts?place=kovelahti&area=ikaalinen')
            .then((res) => res.json())
            .then((data) => {
                setData(data);
                setLoading(false);
            })
    }, [])

    if (isLoading) {
        return <p>Loading...</p>;
    }
    if (!data) {
        return <p>No data available...</p>
    }


    return (
        <div>
            <p>Client side rendering</p>
            <div>
                {data.municipalityCode}
            </div>
        </div>
    ) ;

}