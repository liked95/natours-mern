const mongoose = require('mongoose')
const dotenv = require('dotenv')
const fs = require('fs')
const Tour = require('../../models/tourModel')
dotenv.config({ path: './config.env' })


const port = process.env.PORT || 3000
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
}).then(con => {
    console.log('DB connection succesfully')
}).catch(console.log)

// READ JSOMN FILE

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'))
const importData = async () => {
    try {
        await Tour.create(tours)
        console.log('Data has been successfully imported')
    } catch (error) {
        console.log(error)
    }
    process.exit()
}

const deleteData = async () => {
    try {
        await Tour.deleteMany()
        console.log('Data has been successfully deleted')
    } catch (error) {
        console.log(error)
    }
    process.exit()
}

if (process.argv[2] === '--import') {
    importData()
}

if (process.argv[2] === '--delete') {
    deleteData()
}





