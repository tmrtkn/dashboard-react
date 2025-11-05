'use client'


import {readWeatherDataFromRedis, writeWeatherDataToRedis} from "@/app/actions";
import Button from "react-bootstrap/Button";
import {useEffect, useState} from "react";
import LocalizedDateTime from "@/app/components/util/LocalizedDateTime";
import StringToDate from "@/app/components/util/StringToDate";

async function refreshData() {
    console.log("Reading the data from remote API")
    const res = await fetch('https://www.ilmatieteenlaitos.fi/api//weather/forecasts?place=kovelahti&area=ikaalinen');
    await writeWeatherDataToRedis("kovelahti", JSON.stringify(await res.json()));
    return res;
}



export default function SaahakuCache() {
    const [data, setData] = useState(null);
    // const data = getData();
    // console.log(data);

    const handleButtonClick = async ()=>  {
        console.log("Weather fetch button clicked");
        const d = await refreshData();
        const redisData = JSON.parse(await readWeatherDataFromRedis("kovelahti"));
        // const weatherData = JSON.parse(redisData.data);
        console.log(redisData.data.municipalityCode);
        setData(redisData);
    }

    const getData = async ()=> {
        console.log("Getting data from Redis");
        const d = await readWeatherDataFromRedis("kovelahti");
        if (d) {
            const redisData = JSON.parse(d);
            // const weatherData = JSON.parse(redisData.data);
            setData(redisData);
            return;
        }
        return refreshData();
    }

    useEffect(() => {
       getData();
    }, []);

    if (!data) {
        return "";
    }

    const paivanPituus:number = data.data.dayLengthValues[0].daylength;
    const tuntienMaaraPaivassa: number = Math.floor(paivanPituus / 60);

    return (
        <div>

            <Button onClick={handleButtonClick}>
                Fetch the data
            </Button>

            <p>Server side fetch</p>
            Kuntakoodi {data && data.data.municipalityCode}
            <p>
                Lokaatio {data && data.key}
            </p>
            <p>
               Haettu <LocalizedDateTime timestamp={data && data.time}/>
            </p>
            <p>
                Auringon nousu <StringToDate string={data && data.data.dayLengthValues[0].Sunrise} />
                <br/>
                Auringon lasku <StringToDate string={data && data.data.dayLengthValues[0].Sunset} />
                <br/>
                Päivän pituus { paivanPituus } minuuttia. Eli { tuntienMaaraPaivassa } tuntia ja {  paivanPituus - (tuntienMaaraPaivassa * 60) } minuuttia.
            </p>
        </div>
    )
}