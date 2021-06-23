db.DatosDispositivosPortables.find({"Coordenadas.Latitud": NaN}).count()

db.DatosDispositivosPortables.find({"Coordenadas.Latitud":{$exists: false}}).count()

{ a: { $exists: true } } 

db.DatosDispositivosPortables.find().count()

db.DatosDispositivosPortables.deleteMany({"Coordenadas.Latitud": NaN})

db.DatosDispositivosPortables.deleteMany({"Coordenadas.Latitud":{$exists: false}})

db.DatosDispositivosPortables.aggregate([
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
            fechas: "$_id"
        }
    },
    {
        $sort: {
            fechas: -1
        }
    }
])


db.portable.aggregate([
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
            fechas: "$_id"
        }
    },
    {
        $sort: {
            fechas: -1
        }
    }
])