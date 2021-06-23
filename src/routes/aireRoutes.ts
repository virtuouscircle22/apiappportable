import { Request, Response, Router } from 'express'
import { Aires } from '../model/aire'
import {AiresPlume } from '../model/airePlume'
import { PortableJavier } from '../model/portableJavier'
import { db } from '../database/database'

class AireRoutes {
    private _router: Router

    constructor() {
        this._router = Router()
    }
    get router(){
        return this._router
    }

    private getAiresPlume = async (req:Request, res: Response) => {
        await db.conectarBD()
        .then( async ()=> {
            const query = await AiresPlume.find()
            res.json(query)
        })
        .catch((mensaje) => {
            res.send(mensaje)
        })
        await db.desconectarBD()
    }

    private getAires = async (req:Request, res: Response) => {
        await db.conectarBD()
        .then( async ()=> {
            const query = await Aires.find()
            res.json(query)
        })
        .catch((mensaje) => {
            res.send(mensaje)
        })
        await db.desconectarBD()
    }

    private getFechaPlume = async (req:Request, res: Response) => {
        const { ano, mes, dia } = req.params
        await db.conectarBD()
        .then( async ()=> {
            const query = await AiresPlume.aggregate([
                {
                    $addFields: {
                        date: {$toDate: "$date"}
                    }
                },
                {
                    $addFields: {
                        "fecha": {
                            $dateToParts: {date: "$date"}
                        }
                    }
                },
                {
                    $addFields: {
                        "ano": {$toString: "$fecha.year"},
                        "mes": {$toString: "$fecha.month"},
                        "dia": {$toString: "$fecha.day"},
                    }
                },
                {
                    $match: {
                        "ano": ano,
                        "mes": mes,
                        "dia": dia
                    }
                },
                {
                    $project: {
                        "date": 1,
                        "NO2": {$round: [{ $multiply: [ "$NO2", (46.0055/24.45)] }, 2]}, // Paso de ppb a microgramos/m3
                        "pm10": {$round: ["$pm10", 2]},
                        "pm25": {$round: ["$pm25", 2]},
                        "latitude": 1,
                        "longitude": 1,
                        "timestamp": 1
                    }
                }
            ])
            console.log(query)
            res.json(query)
        })
        .catch((mensaje) => {
            res.send(mensaje)
        })
        await db.desconectarBD()
    }

    private getFecha = async (req:Request, res: Response) => {
        const { ano, mes, dia } = req.params
        await db.conectarBD()
        .then( async ()=> {
            const query = await Aires.aggregate([
                {
                    $match:{}
                },
                {
                    $addFields: {
                        "ano": {$toString: {$year: "$fecha"}},
                        "mes": {$toString: {$month: "$fecha"}},
                        "dia": {$toString: {$dayOfMonth: "$fecha"}}
                    }
                },
                {
                    $match: {
                        "ano": ano,
                        "mes": mes,
                        "dia": dia
                    }
                }
            ])
            res.json(query)
        })
        .catch((mensaje) => {
            res.send(mensaje)
        })
        await db.desconectarBD()
    }


    private getFechasDistintasPlume = async (req:Request, res: Response) => {
        await db.conectarBD()
        .then( async ()=> {
            const query = await AiresPlume.aggregate([
                {
                    $addFields: {
                        date: {$toDate: "$date"}
                    }
                },
                {
                    $project: {
                        _id: 0,
                        fecha: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }
                    }
                },
                {
                    $group: {
                        _id: "$fecha"
                    }
                },
                {
                    $project: {
                        _id: 0,
                        fechas: "$_id"
                    }
                },
                {
                    $sort: {
                        fechas: -1
                    }
                }
            ])
            console.log()
            res.json(query)
        })
        .catch((mensaje) => {
            res.send(mensaje)
        })
        await db.desconectarBD()
    }

    private getFechasDistintas = async (req:Request, res: Response) => {
        await db.conectarBD()
        .then( async ()=> {
            const query = await Aires.aggregate([
                {
                    $project: {
                        _id: 0,
                        fecha: { $dateToString: { format: "%Y-%m-%d", date: "$fecha" } }
                    }
                },
                {
                    $group: {
                        _id: "$fecha"
                    }
                },
                {
                    $project: {
                        _id: 0,
                        fechas: "$_id"
                    }
                },
                {
                    $sort: {
                        fechas: -1
                    }
                }
            ])
            res.json(query)
        })
        .catch((mensaje) => {
            res.send(mensaje)
        })
        await db.desconectarBD()
    }



// Para devolver las distintas fechas
    private getFechasDistintasPJ = async (req:Request, res: Response) => {
        await db.conectarBDPJ()
        .then( async ()=> {
            const query = await PortableJavier.aggregate([
                {
                    $project: {
                        _id: 0,
                        fecha: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }
                    }
                },
                {
                    $group: {
                        _id: "$fecha"
                    }
                },
                {
                    $project: {
                        _id: 0,
                        fechas: "$_id"
                    }
                },
                {
                    $sort: {
                        fechas: -1
                    }
                }
            ])
            res.json(query)
        })
        .catch((mensaje) => {
            res.send(mensaje)
        })
        await db.desconectarBDPJ()
    }

    private getFechaPJ = async (req:Request, res: Response) => {
        const { ano, mes, dia } = req.params
        await db.conectarBDPJ()
        .then( async ()=> {
            const query = await PortableJavier.aggregate([
                {
                    $match:{}
                },
                {
                    $addFields: {
                        "ano": {$toString: {$year: "$date"}},
                        "mes": {$toString: {$month: "$date"}},
                        "dia": {$toString: {$dayOfMonth: "$date"}}
                    }
                },
                {
                    $match: {
                        "ano": ano,
                        "mes": mes,
                        "dia": dia
                    }
                }
            ])
            res.json(query)
        })
        .catch((mensaje) => {
            res.send(mensaje)
        })
        await db.desconectarBDPJ()
    }

    private getFecha2Plume = async (req:Request, res: Response) => {
        const { ano, mes, dia, cont } = req.params
        await db.conectarBD()
        .then( async ()=> {
            const query = await AiresPlume.aggregate([
                {
                    $addFields: {
                        date: {$toDate: "$date"}
                    }
                },
                {
                    $addFields: {
                        "fecha": {
                            $dateToParts: {date: "$date"}
                        },
                        "cont": cont
                    }
                },
                {
                    $addFields: {
                        "ano": {$toString: "$fecha.year"},
                        "mes": {$toString: "$fecha.month"},
                        "dia": {$toString: "$fecha.day"},
                    }
                },
                {
                    $match: {
                        "ano": ano,
                        "mes": mes,
                        "dia": dia
                    }
                },
                {
                    $project: {
                        "ano": 1,
                        "mes": 1,
                        "dia": 1,
                        "latitude": 1,
                        "longitude": 1,
                        "cont": 1,
                        "dato": { $switch: {
                            branches: [
                                {case: { $regexMatch: { input: "$cont", regex: "no2"} }, then: [{$round: ["$NO2", 2]}] },
                                {case: { $regexMatch: { input: "$cont", regex: "pm10"} }, then: [{$round: ["$pm10", 2]}] },
                                {case: { $regexMatch: { input: "$cont", regex: "pm25"} }, then: [{$round: ["$pm25", 2]}] },
                                {case: { $regexMatch: { input: "$cont", regex: "todo"} }, then: [{$round: ["$NO2", 2]}, {$round: ["$pm10", 2]}, {$round: ["$pm25", 2]}] }
                            ]
                        }}
                    }
                }
            ])
            res.json(query)
        })
        .catch((mensaje) => {
            res.send(mensaje)
        })
        await db.desconectarBD()
    }


    private getFecha2 = async (req:Request, res: Response) => {
        const { ano, mes, dia, cont } = req.params
        await db.conectarBD()
        .then( async ()=> {
            const query = await Aires.aggregate([
                {
                    $match:{}
                },
                {
                    $addFields: {
                        "ano": {$toString: {$year: "$fecha"}},
                        "mes": {$toString: {$month: "$fecha"}},
                        "dia": {$toString: {$dayOfMonth: "$fecha"}},
                        "cont": cont,
                    }
                },
                {
                    $match: {
                        "ano": ano,
                        "mes": mes,
                        "dia": dia
                    }
                },
                {
                    $project: {
                        "ano": 1,
                        "mes": 1,
                        "dia": 1,
                        "Latitud": 1,
                        "Longitud": 1,
                        "cont": 1,
                        "dato": { $switch: {
                            branches: [
                                {case: { $regexMatch: { input: "$cont", regex: "O3"} }, then: ["$O3"] },
                                {case: { $regexMatch: { input: "$cont", regex: "NO2"} }, then: ["$NO2"] },
                                {case: { $regexMatch: { input: "$cont", regex: "CO"} }, then: ["$CO"] },
                                {case: { $regexMatch: { input: "$cont", regex: "Todo"} }, then: ["$O3", "$NO2", "$CO"] }
                            ]
                        }}
                    }
                }
            ])
            res.json(query)
        })
        .catch((mensaje) => {
            res.send(mensaje)
        })
        await db.desconectarBD()
    }

    private getFecha3Plume = async (req:Request, res: Response) => {
        const { time } = req.params
        await db.conectarBD()
        .then( async ()=> {
            const query = await AiresPlume.aggregate([
                {
                    $match: {
                        "timestamp": time
                    }
                },
                {
                    $project: {
                        "dato": [{$round: ["$NO2", 2]}, {$round: ["$pm10", 2]}, {$round: ["$pm25", 2]}],
                        "latitude": 1,
                        "longitude": 1
                    }
                }
            ])
            res.json(query)
        })
        .catch((mensaje) => {
            res.send(mensaje)
        })
        await db.desconectarBD()
    }

    private getFecha3 = async (req:Request, res: Response) => {
        const { ano, mes, dia, hora, min, seg } = req.params
        await db.conectarBD()
        .then( async ()=> {
            const query = await Aires.aggregate([
                {
                    $match:{}
                },
                {
                    $addFields: {
                        "ano": {$toString: {$year: "$fecha"}},
                        "mes": {$toString: {$month: "$fecha"}},
                        "dia": {$toString: {$dayOfMonth: "$fecha"}},
                        "hora": {$toString: {$hour: "$fecha"}},
                        "min": {$toString: {$minute: "$fecha"}},
                        "seg": {$toString: {$second: "$fecha"}}
                    }
                },
                {
                    $match: {
                        "ano": ano,
                        "mes": mes,
                        "dia": dia,
                        "hora": hora,
                        "min": min,
                        "seg": seg
                    }
                },
                {
                    $project: {
                        "dato": ["$O3", "$NO2", "$CO"],
                        "Latitud": 1,
                        "Longitud": 1
                    }
                }
            ])
            res.json(query)
        })
        .catch((mensaje) => {
            res.send(mensaje)
        })
        await db.desconectarBD()
    }

    misRutas(){
        this._router.get('/plume', this.getAiresPlume)
        this._router.get('/', this.getAires),
        this._router.get('/plume/getFecha/:ano&:mes&:dia', this.getFechaPlume)
        this._router.get('/getFecha/:ano&:mes&:dia', this.getFecha),
        this._router.get('/getFechaPJ/:ano&:mes&:dia', this.getFechaPJ),
        this._router.get('/getFechasDistintasPJ', this.getFechasDistintasPJ),
        this._router.get('/plume/getFechasDistintas', this.getFechasDistintasPlume),
        this._router.get('/getFechasDistintas', this.getFechasDistintas),
        this._router.get('/plume/getFecha2/:ano&:mes&:dia&:cont', this.getFecha2Plume)
        this._router.get('/getFecha2/:ano&:mes&:dia&:cont', this.getFecha2)
        this._router.get('/plume/getFecha3/:time', this.getFecha3Plume)
        this._router.get('/getFecha3/:ano&:mes&:dia&:hora&:min&:seg', this.getFecha3)
    }
}
const obj = new AireRoutes()
obj.misRutas()
export const aireRoutes = obj.router