import styles from './App.module.css';
import { Alert } from './Components/Alert/Alert';
import { Form } from './Components/Form/Form';
import useWeather from './Components/Hooks/useWeather';
import { Spinner } from './Components/Spinner/Spinner';
import { WeatherDetail } from './Components/WeatherDetails/WeatherDetail';


function App() {
        
        const {weather,  loading, notFound, fetchWeather, hasWeatherData} = useWeather();

        console.log(import.meta.env);
  return (
    <>
    <h1 className={styles.title}>Buscador de Clima</h1>
    <div className={styles.container}>
      <Form
        fetchWeather={fetchWeather}
      />
        {loading && <Spinner/>}
        {hasWeatherData && 
            <WeatherDetail
            weather={weather} />
        }
        {notFound && <Alert>Cuidad no Econtrada</Alert>}
        
    </div>
    </>
  )
}

export default App
