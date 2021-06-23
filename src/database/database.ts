import mongoose from 'mongoose';

class DataBase {


private _cadenaConexionPortableJavier: string 
    = 'mongodb+srv://virtuouscircle:ka202_2019@cluster0-mms5n.mongodb.net/DatosCalidadAire?retryWrites=true&w=majority'

private _cadenaConexion: string 
    = 'mongodb+srv://usplume:usplume@cluster0.mms5n.mongodb.net/DatosPlume?retryWrites=true&w=majority'

    constructor(){

    }

    conectarBD = async () => {
        const promise = new Promise<string>( async (resolve, reject) => {
            await mongoose.connect(this._cadenaConexion, {
                useNewUrlParser: true, 
                useUnifiedTopology: true, 
                useCreateIndex: true,   // Para que cree el índice único asociado al campo unique
                useFindAndModify: false  // para usar findOneAndDelete y findAndModify
            })
            .then( () => resolve(`Conectado a ${this._cadenaConexion}`) )
            .catch( (error) => reject(`Error conectando a ${this._cadenaConexion}: ${error}`) )     
        })
        return promise

    }

    desconectarBD = async () => {
        const promise = new Promise<string>( async (resolve, reject) => {
            await mongoose.disconnect() 
            .then( () => resolve(`Desconectado de ${this._cadenaConexion}`) )
            .catch( (error) => reject(`Error desconectando de ${this._cadenaConexion}: ${error}`) )     
        })
        return promise
    }

    conectarBDPJ = async () => {
        const promise = new Promise<string>( async (resolve, reject) => {
            await mongoose.connect(this._cadenaConexionPortableJavier, {
                useNewUrlParser: true, 
                useUnifiedTopology: true, 
                useCreateIndex: true,   // Para que cree el índice único asociado al campo unique
                useFindAndModify: false  // para usar findOneAndDelete y findAndModify
            })
            .then( () => resolve(`Conectado a ${this._cadenaConexionPortableJavier}`) )
            .catch( (error) => reject(`Error conectando a ${this._cadenaConexionPortableJavier}: ${error}`) )     
        })
        return promise

    }

    desconectarBDPJ = async () => {
        const promise = new Promise<string>( async (resolve, reject) => {
            await mongoose.disconnect() 
            .then( () => resolve(`Desconectado de ${this._cadenaConexionPortableJavier}`) )
            .catch( (error) => reject(`Error desconectando de ${this._cadenaConexionPortableJavier}: ${error}`) )     
        })
        return promise
    }



}

export const db = new DataBase()