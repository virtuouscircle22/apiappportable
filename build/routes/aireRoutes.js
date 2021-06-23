"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aireRoutes = void 0;
const express_1 = require("express");
const aire_1 = require("../model/aire");
const airePlume_1 = require("../model/airePlume");
const portableJavier_1 = require("../model/portableJavier");
const database_1 = require("../database/database");
class AireRoutes {
    constructor() {
        this.getAiresPlume = (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield database_1.db.conectarBD()
                .then(() => __awaiter(this, void 0, void 0, function* () {
                const query = yield airePlume_1.AiresPlume.find();
                res.json(query);
            }))
                .catch((mensaje) => {
                res.send(mensaje);
            });
            yield database_1.db.desconectarBD();
        });
        this.getAires = (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield database_1.db.conectarBD()
                .then(() => __awaiter(this, void 0, void 0, function* () {
                const query = yield aire_1.Aires.find();
                res.json(query);
            }))
                .catch((mensaje) => {
                res.send(mensaje);
            });
            yield database_1.db.desconectarBD();
        });
        this.getFechaPlume = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { ano, mes, dia } = req.params;
            yield database_1.db.conectarBD()
                .then(() => __awaiter(this, void 0, void 0, function* () {
                const query = yield airePlume_1.AiresPlume.aggregate([
                    {
                        $addFields: {
                            date: { $toDate: "$date" }
                        }
                    },
                    {
                        $addFields: {
                            "fecha": {
                                $dateToParts: { date: "$date" }
                            }
                        }
                    },
                    {
                        $addFields: {
                            "ano": { $toString: "$fecha.year" },
                            "mes": { $toString: "$fecha.month" },
                            "dia": { $toString: "$fecha.day" },
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
                            "NO2": { $round: [{ $multiply: ["$NO2", (46.0055 / 24.45)] }, 2] },
                            "pm10": { $round: ["$pm10", 2] },
                            "pm25": { $round: ["$pm25", 2] },
                            "latitude": 1,
                            "longitude": 1,
                            "timestamp": 1
                        }
                    }
                ]);
                console.log(query);
                res.json(query);
            }))
                .catch((mensaje) => {
                res.send(mensaje);
            });
            yield database_1.db.desconectarBD();
        });
        this.getFecha = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { ano, mes, dia } = req.params;
            yield database_1.db.conectarBD()
                .then(() => __awaiter(this, void 0, void 0, function* () {
                const query = yield aire_1.Aires.aggregate([
                    {
                        $match: {}
                    },
                    {
                        $addFields: {
                            "ano": { $toString: { $year: "$fecha" } },
                            "mes": { $toString: { $month: "$fecha" } },
                            "dia": { $toString: { $dayOfMonth: "$fecha" } }
                        }
                    },
                    {
                        $match: {
                            "ano": ano,
                            "mes": mes,
                            "dia": dia
                        }
                    }
                ]);
                res.json(query);
            }))
                .catch((mensaje) => {
                res.send(mensaje);
            });
            yield database_1.db.desconectarBD();
        });
        this.getFechasDistintasPlume = (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield database_1.db.conectarBD()
                .then(() => __awaiter(this, void 0, void 0, function* () {
                const query = yield airePlume_1.AiresPlume.aggregate([
                    {
                        $addFields: {
                            date: { $toDate: "$date" }
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
                ]);
                console.log();
                res.json(query);
            }))
                .catch((mensaje) => {
                res.send(mensaje);
            });
            yield database_1.db.desconectarBD();
        });
        this.getFechasDistintas = (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield database_1.db.conectarBD()
                .then(() => __awaiter(this, void 0, void 0, function* () {
                const query = yield aire_1.Aires.aggregate([
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
                ]);
                res.json(query);
            }))
                .catch((mensaje) => {
                res.send(mensaje);
            });
            yield database_1.db.desconectarBD();
        });
        // Para devolver las distintas fechas
        this.getFechasDistintasPJ = (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield database_1.db.conectarBDPJ()
                .then(() => __awaiter(this, void 0, void 0, function* () {
                const query = yield portableJavier_1.PortableJavier.aggregate([
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
                ]);
                res.json(query);
            }))
                .catch((mensaje) => {
                res.send(mensaje);
            });
            yield database_1.db.desconectarBDPJ();
        });
        this.getFechaPJ = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { ano, mes, dia } = req.params;
            yield database_1.db.conectarBDPJ()
                .then(() => __awaiter(this, void 0, void 0, function* () {
                const query = yield portableJavier_1.PortableJavier.aggregate([
                    {
                        $match: {}
                    },
                    {
                        $addFields: {
                            "ano": { $toString: { $year: "$date" } },
                            "mes": { $toString: { $month: "$date" } },
                            "dia": { $toString: { $dayOfMonth: "$date" } }
                        }
                    },
                    {
                        $match: {
                            "ano": ano,
                            "mes": mes,
                            "dia": dia
                        }
                    }
                ]);
                res.json(query);
            }))
                .catch((mensaje) => {
                res.send(mensaje);
            });
            yield database_1.db.desconectarBDPJ();
        });
        this.getFecha2Plume = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { ano, mes, dia, cont } = req.params;
            yield database_1.db.conectarBD()
                .then(() => __awaiter(this, void 0, void 0, function* () {
                const query = yield airePlume_1.AiresPlume.aggregate([
                    {
                        $addFields: {
                            date: { $toDate: "$date" }
                        }
                    },
                    {
                        $addFields: {
                            "fecha": {
                                $dateToParts: { date: "$date" }
                            },
                            "cont": cont
                        }
                    },
                    {
                        $addFields: {
                            "ano": { $toString: "$fecha.year" },
                            "mes": { $toString: "$fecha.month" },
                            "dia": { $toString: "$fecha.day" },
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
                                        { case: { $regexMatch: { input: "$cont", regex: "no2" } }, then: [{ $round: ["$NO2", 2] }] },
                                        { case: { $regexMatch: { input: "$cont", regex: "pm10" } }, then: [{ $round: ["$pm10", 2] }] },
                                        { case: { $regexMatch: { input: "$cont", regex: "pm25" } }, then: [{ $round: ["$pm25", 2] }] },
                                        { case: { $regexMatch: { input: "$cont", regex: "todo" } }, then: [{ $round: ["$NO2", 2] }, { $round: ["$pm10", 2] }, { $round: ["$pm25", 2] }] }
                                    ]
                                } }
                        }
                    }
                ]);
                res.json(query);
            }))
                .catch((mensaje) => {
                res.send(mensaje);
            });
            yield database_1.db.desconectarBD();
        });
        this.getFecha2 = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { ano, mes, dia, cont } = req.params;
            yield database_1.db.conectarBD()
                .then(() => __awaiter(this, void 0, void 0, function* () {
                const query = yield aire_1.Aires.aggregate([
                    {
                        $match: {}
                    },
                    {
                        $addFields: {
                            "ano": { $toString: { $year: "$fecha" } },
                            "mes": { $toString: { $month: "$fecha" } },
                            "dia": { $toString: { $dayOfMonth: "$fecha" } },
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
                                        { case: { $regexMatch: { input: "$cont", regex: "O3" } }, then: ["$O3"] },
                                        { case: { $regexMatch: { input: "$cont", regex: "NO2" } }, then: ["$NO2"] },
                                        { case: { $regexMatch: { input: "$cont", regex: "CO" } }, then: ["$CO"] },
                                        { case: { $regexMatch: { input: "$cont", regex: "Todo" } }, then: ["$O3", "$NO2", "$CO"] }
                                    ]
                                } }
                        }
                    }
                ]);
                res.json(query);
            }))
                .catch((mensaje) => {
                res.send(mensaje);
            });
            yield database_1.db.desconectarBD();
        });
        this.getFecha3Plume = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { time } = req.params;
            yield database_1.db.conectarBD()
                .then(() => __awaiter(this, void 0, void 0, function* () {
                const query = yield airePlume_1.AiresPlume.aggregate([
                    {
                        $match: {
                            "timestamp": time
                        }
                    },
                    {
                        $project: {
                            "dato": [{ $round: ["$NO2", 2] }, { $round: ["$pm10", 2] }, { $round: ["$pm25", 2] }],
                            "latitude": 1,
                            "longitude": 1
                        }
                    }
                ]);
                res.json(query);
            }))
                .catch((mensaje) => {
                res.send(mensaje);
            });
            yield database_1.db.desconectarBD();
        });
        this.getFecha3 = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { ano, mes, dia, hora, min, seg } = req.params;
            yield database_1.db.conectarBD()
                .then(() => __awaiter(this, void 0, void 0, function* () {
                const query = yield aire_1.Aires.aggregate([
                    {
                        $match: {}
                    },
                    {
                        $addFields: {
                            "ano": { $toString: { $year: "$fecha" } },
                            "mes": { $toString: { $month: "$fecha" } },
                            "dia": { $toString: { $dayOfMonth: "$fecha" } },
                            "hora": { $toString: { $hour: "$fecha" } },
                            "min": { $toString: { $minute: "$fecha" } },
                            "seg": { $toString: { $second: "$fecha" } }
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
                ]);
                res.json(query);
            }))
                .catch((mensaje) => {
                res.send(mensaje);
            });
            yield database_1.db.desconectarBD();
        });
        this._router = express_1.Router();
    }
    get router() {
        return this._router;
    }
    misRutas() {
        this._router.get('/plume', this.getAiresPlume);
        this._router.get('/', this.getAires),
            this._router.get('/plume/getFecha/:ano&:mes&:dia', this.getFechaPlume);
        this._router.get('/getFecha/:ano&:mes&:dia', this.getFecha),
            this._router.get('/getFechaPJ/:ano&:mes&:dia', this.getFechaPJ),
            this._router.get('/getFechasDistintasPJ', this.getFechasDistintasPJ),
            this._router.get('/plume/getFechasDistintas', this.getFechasDistintasPlume),
            this._router.get('/getFechasDistintas', this.getFechasDistintas),
            this._router.get('/plume/getFecha2/:ano&:mes&:dia&:cont', this.getFecha2Plume);
        this._router.get('/getFecha2/:ano&:mes&:dia&:cont', this.getFecha2);
        this._router.get('/plume/getFecha3/:time', this.getFecha3Plume);
        this._router.get('/getFecha3/:ano&:mes&:dia&:hora&:min&:seg', this.getFecha3);
    }
}
const obj = new AireRoutes();
obj.misRutas();
exports.aireRoutes = obj.router;
