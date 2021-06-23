"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiresPlume = void 0;
const mongoose_1 = require("mongoose");
const airePlumeSchema = new mongoose_1.Schema({
    "timestamp": { type: String, unique: true },
    "date": { type: String },
    "NO2": { type: Number },
    "VOC": { type: Number },
    "pm10": { type: Number },
    "pm25": { type: Number },
    "NO2_AQI": { type: Number },
    "VOC_AQI": { type: Number },
    "pm10_AQI": { type: Number },
    "pm25_AQI": { type: Number },
    "pm1": { type: Number },
    "pm1_AQI": { type: Number },
    "latitude": { type: String },
    "longitude": { type: String }
}, {
    collection: 'plume'
});
exports.AiresPlume = mongoose_1.model('airePlume', airePlumeSchema);
