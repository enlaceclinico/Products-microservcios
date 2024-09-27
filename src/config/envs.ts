import "dotenv/config"

import * as joi from 'joi'

interface EnvVars{
    PORT :  number;
    DATABASE:string;

     
}
const envsSchema = joi.object({
   
    PORT: joi.number().required(),
    DATABASEURL:joi.string().required
}).unknown(true)

const {error,value} = envsSchema.validate(process.env)
if (error){
    throw new Error(`configiration validation error : ${error.message}`)
}
const envVars:EnvVars = value
export const config =  {
    port: envVars.PORT,
    databaseUrl:envVars.DATABASE

}