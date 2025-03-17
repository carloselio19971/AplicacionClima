import { ChangeEvent, FormEvent, useState } from "react";
import { countries } from "../../data/countries"
import type { SearchType } from "../../types";
import styles from './Form.module.css';
import { Alert } from "../Alert/Alert";

type FromProps = {
    fetchWeather: (search: SearchType) => Promise<void>;
  }
  


export const Form = ({fetchWeather}:FromProps) => {

    const [search, setSearch] = useState<SearchType>({
        city:'',
        country:''
    });
    
    const [alert , setAlert] = useState('');
    const handleChange =(e:ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>)=>
        {   
            setSearch({
                ...search,
                [e.target.name]:e.target.value
            })

        }    

    const handleSubmit = (e:FormEvent<HTMLFormElement>)=>{
            e.preventDefault();
            if(Object.values(search).includes('')){
                console.log("Si hay campos vacios")
                setAlert('Todos los campos son obligatorios');
                return
            }
            fetchWeather(search);
    }

  return (
    <form className={styles.form}
     onSubmit={handleSubmit}
    >

        {alert && <Alert>{alert}</Alert>}
        <div className={styles.field}>
            <label htmlFor="city">Cuidad:</label>
            <input 
                 id="city"
                 type="text"
                 name="city"
                 placeholder="Cuidad"
                 value={search.city}
                 onChange={handleChange}
            />
        </div>
        <div className={styles.field}>
            <label htmlFor="country">País:</label>
            <select
                id="country"
                name="country"
                value={search.country}
                onChange={handleChange}
            >
            <option value="">--Selecciones un Pais</option>
                {countries.map((country)=>(
                    <option
                    key={country.code}
                    value={country.code}
                        >{country.name}
                    </option>
                ))}
            </select>
        
        </div>
        <input className={styles.submit} type="submit" value='Consulta Clima'></input>
    </form>
  )
}
