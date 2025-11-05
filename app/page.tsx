'use client'

import Image from "next/image";
import styles from "./page.module.css";
import {useEffect, useState} from "react";
import { writeToRedis, readFromRedis} from "@/app/actions";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';


export default function Page() {
    const [inputValue, setInputValue] = useState("");
    const [name, setName] = useState("");

    const handleButtonClick = async () => {
        await writeToRedis(inputValue);
        setInputValue("");
        await fetchName();
    };

    const fetchName = async () => {
        const nameFromRedis = await readFromRedis();
        setName(nameFromRedis);
    };

    useEffect(() => {
        fetchName();
    }, []);

    return (
        <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center"}}>
            <h1>Redis Server Action</h1>
            <p>
                This is a simple example of a server action using Redis.
            </p>
            <p>
                <input
                    className="form-control form-control-sm"
                    size="sm"
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    maxLength={50}
                    placeholder="Say hi!"
                />

                <Button onClick={handleButtonClick}>
                   Bootstrap submit
                </Button>
            </p>
            {name && (
                <div>
                    <strong>
                        Stored Name:
                    </strong>
                    {name}
                </div>

            )}
        </div>


    );
}
