'use client'


import {getWeatherKeys, readWeatherDataFromRedis, writeWeatherDataToRedis} from "@/app/actions";
import Button from "react-bootstrap/Button";
import {useEffect, useState} from "react";
import LocalizedDateTime from "@/app/components/util/LocalizedDateTime";
import StringToDate from "@/app/components/util/StringToDate";
import {Dropdown} from "react-bootstrap";
import Form from "react-bootstrap/Form";

async function refreshData(paikkakunta: string) {
    console.log("Reading the data from remote API")
    const res = await fetch('https://www.ilmatieteenlaitos.fi/api/weather/forecasts?place=' + paikkakunta);
    await writeWeatherDataToRedis(paikkakunta, JSON.stringify(await res.json()));
    return res;
}



export default function SaahakuCache() {
    const [data, setData] = useState(null);
    const [inputValue, setInputValue] = useState("");
    const [cachedDataKeys, setCachedDataKeys] = useState(new Array());
    // const data = getData();
    // console.log(data);

    const handleButtonClick = async ()=>  {
        console.log("Weather fetch button clicked");
        const d = await refreshData(inputValue);
        const redisData = JSON.parse(await readWeatherDataFromRedis(inputValue));
        // const weatherData = JSON.parse(redisData.data);
        console.log(redisData.data.municipalityCode);
        setData(redisData);
        await updateCachedDataKeys();
    }

    const selectCachedData = async (index: number)=> {
        console.log(`Selected index ${index} with value ${cachedDataKeys[index]}`);

        const k:  string = cachedDataKeys[index].substr(8, cachedDataKeys[index].length);
        console.log("Key: ", k);
        const redisData = JSON.parse(await readWeatherDataFromRedis(k));
        // const weatherData = JSON.parse(redisData.data);
        // console.log(redisData.data.municipalityCode);
        setData(redisData);
        setInputValue(k);

    }
    async function updateCachedDataKeys() {
        console.log("Getting weather data keys from Redis");
        const weatherLocations = await getWeatherKeys();
        console.log("Got weatherLocations: ", weatherLocations);
        setCachedDataKeys(weatherLocations[1]);
    }

    const getData = async ()=> {
        console.log("Getting data from Redis");
        const d = await readWeatherDataFromRedis("kovelahti");
        if (d) {
            const redisData = JSON.parse(d);
            // const weatherData = JSON.parse(redisData.data);
            setData(redisData);
            // return;
        } else {
            // return refreshData("kovelahti");
            refreshData("kovelahti");

        }
        await updateCachedDataKeys();
    }

    // const get

    useEffect(() => {
       getData();
    }, []);

    if (!data) {
        return "";
    }

    const paivanPituus:number = data.data.dayLengthValues[0].daylength;
    const tuntienMaaraPaivassa: number = Math.floor(paivanPituus / 60);

    const dropdownItems: Element[] = cachedDataKeys.map( (item, i) =>
        <Dropdown.Item onClick={(e) =>
                 selectCachedData(i)
            }
                       key={item}
            >
            { item }

        </Dropdown.Item>)


    return (
        <div>

                Hae säädata välimuistista
                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            Olemassaolevat säätiedot
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            { dropdownItems }
                        </Dropdown.Menu>
                    </Dropdown>

            <p>Hae olemassaolevat säätiedot (alasvetovalikko)</p>
            <Form.Control type="text"
                          size="sm"
                          maxLength={50}
                          value={inputValue}
                          onChange={
                              (e) => {
                                  const value = e.target.value;
                                  if (value) {
                                      setInputValue(e.target.value.toLowerCase())
                                  }
                              }
                          }
                          placeholder="Syötä paikkakunta"
            />

            <Button onClick={handleButtonClick}>
                Päivitä säätiedot
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