"use server";

import Redis from "ioredis";

// const redis = new Redis(process.env.REDIS_CONNECTION_STRING as string);
const redis = new Redis("redis://127.0.0.1:6379");

export enum DataType {
    WEATHER="weather-"
}
export async function writeWeatherDataToRedis(key: string, data: string) : Promise<void> {

    const dataType: DataType = DataType.WEATHER;
    try {
        const redisKey:string = dataType + key;
        console.log("Saving " + redisKey + " to Redis");
        const redisData = {
            key: key,
            time: Date.now(),
            data: JSON.parse(data)
        }
        console.log("Data: ", redisData);
        await redis.set(redisKey, JSON.stringify(redisData));
    } catch (error) {
        console.error("Error writing data to Redis: " + dataType + ", " + key);
    }
}

function isEmpty(object) {
    return Object.keys(object).length === 0;
}

export async function readWeatherDataFromRedis(key: string): Promise<string> {
    try {
        const redisKey = DataType.WEATHER + key;
        console.log("Reading data from Redis: " + redisKey);
        const value = await redis.get(redisKey);
        if (!isEmpty(value)) {
            // console.log("Returning value: " + value);
            console.log("Returning value: ...", JSON.parse(value) );
            return value || "";
        }
        console.log("Returning an empty value: " + value);
        return "";

    } catch (error) {
        console.error("Error reading from Redis: ", error);
        return "";
    }
}

export async function writeToRedis(name: string): Promise<void> {
    try {
        console.log("Saving to Redis: ", name);
        await redis.set("name", name);
    } catch (error) {
        console.error("Error writing to Redis: ", error);
    }
}

export async function readFromRedis(): Promise<string> {
    try {
        const value = await redis.get("name");
        console.log("Reading the name from Redis: ", value);
        return value as string;
    } catch (error) {
        console.error("Error reading from Redis: ", error);
        return "";
    }
}