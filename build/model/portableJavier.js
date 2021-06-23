"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortableJavier = void 0;
const mongoose_1 = require("mongoose");
const portableJavierSchema = new mongoose_1.Schema({
    "ID": String,
    "CO2": Number,
    "NO": Number,
    "NH3": Number,
    "Coordenadas": {
        "Latitud": Number,
        "Longitud": Number
    },
    "date": Date
}, {
    collection: 'DatosDispositivosPortables'
});
exports.PortableJavier = mongoose_1.model('DatosDispositivosPortables', portableJavierSchema);
