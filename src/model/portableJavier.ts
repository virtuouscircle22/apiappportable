import { Schema, model } from 'mongoose'
const portableJavierSchema = new Schema({
    "ID": String,
    "CO2": Number,
    "NO": Number,
    "NH3": Number,
    "Coordenadas": {
        "Latitud": Number,
        "Longitud": Number
      },
    "date": Date
},{
    collection: 'DatosDispositivosPortables'
})

export const PortableJavier = model('DatosDispositivosPortables', portableJavierSchema)