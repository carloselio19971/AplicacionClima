import axios from "axios";
import {z} from 'zod';
//import {object, string, number , InferOutput , parse} from 'valibot';

import { SearchType} from "../../types";
import { useMemo, useState } from "react";


const initialState  ={
    name:'',
    main:{
        temp:0,
        temp_max:0,
        temp_min:0
    }
}


// //Type Guards  o Assestion
// function isWeatheResponse(wheater: unknown ): wheater  is Weather {
//         return (
//             Boolean(wheater) &&
//             typeof wheater === 'object' &&
//             typeof (wheater as Weather).name ==='string' &&
//             typeof (wheater as Weather).main.temp=='number' &&
//             typeof (wheater as Weather).main.temp_max=='number' &&
//             typeof (wheater as Weather).main.temp_min=='number' 
//         )
// }
//ZOD
const Weather = z.object({
        name:z.string(),
        main:z.object({
            temp:z.number(),
            temp_max:z.number(),
            temp_min:z.number()
        })
})

export type Weather = z.infer<typeof Weather>

//Valibot 

// const WeatherSchema= object({
//     name:string(),
//     main:object({
//         temp:number(),
//         temp_max:number(),
//         temp_min:number()
//     })
// })

//type Weather = InferOutput<typeof WeatherSchema>

export default function useWeather() {


    const [weather, setWeather] = useState<Weather>(initialState);
    const [loading , setLoading] = useState(false);
    const [notFound, setNotFound]=useState(false);

    const fetchWeather =  async(search:SearchType) =>{
        
        const appId=import.meta.env.VITE_API_KEY;
        setLoading(true);
        setWeather(initialState);
        const { city, country}= search;

        try {
            const geoUrl=`https://api.openweathermap.org/geo/1.0/direct?q=${city},${country}&appid=${appId}`
            const {data}= await axios(geoUrl);
            
            //Comprobar si existe
            if(!data[0]){
               setNotFound(true);
                return;
            }


            const lat=data[0].lat
            const lon=data[0].lon

            const weatherUrl=`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appId}`

            //Como Castear el type
            // const {data:wheaterResult} = await axios<Weather>(weatherUrl)
            // console.log(wheaterResult.main.temp_max);

            //Type Guard
           // const {data:wheaterResult} = await axios(weatherUrl)
            
            // const result = isWeatheResponse(wheaterResult);
            // if(result){
            //    console.log(wheaterResult.name)
            // }
            // else {
            //     console.log("Respuesta mal formada");
            // }
            
            //ZOD
            const {data:wheaterResult} = await axios(weatherUrl)
            const result = Weather.safeParse(wheaterResult)
            if(result.success){
                    setWeather(result.data);

            }

            //Valibot 
           // const {data:wheaterResult} = await axios(weatherUrl);
           // const result = parse(WeatherSchema,wheaterResult);
           // if(result){
           //     console.log(result.name)
           // }
           // else {
           //     console.log('Respuesta mal formada');
           // }

        } catch (error) {
            console.log(error);
        }
        finally {
            setLoading(false);
        }
    }


    const hasWeatherData = useMemo(()=> weather.name,[weather])

    return {
        weather,
        loading,
        notFound,
        fetchWeather,
        hasWeatherData
    }
}