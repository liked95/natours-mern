
const Tour = require('../models/tourModel')
exports.aliasTopTours = (req, res, next) => {
    req.query.limit = 5
    req.query.sort = '-ratingsAverage,price'
    req.query.fields - 'name,price,ratingsAverage,summary,difficulty'
    next()
}

class APIFeatures {
    constructor(query, queryString) {
        this.query = query
        this.queryString = queryString
    }

    filter() {
        const queryObj = { ...this.queryString }
        const excludeFields = ['page', 'sort', 'limit', 'fields']
        excludeFields.forEach(el => delete queryObj[el])
        const queryStr = JSON.stringify(queryObj)
        const sanitizedQuery = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
        this.query = this.query.find(JSON.parse(sanitizedQuery))

        return this
    }
    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ')
            console.log(sortBy)
            this.query = this.query.sort(sortBy)
            // sort('price')
        }
        return this
    }

    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ')
            this.query = this.query.select(fields)
        } else {
            this.query = this.query.select('-__v')
        }
        return this
    }

    paginate() {
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 100
        const skip = (page - 1) * limit
        this.query = this.query.skip(skip).limit(limit)
    }
}

exports.createTour = async (req, res) => {
    try {
        let newTour = await Tour.create(req.body)
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        })
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err,
        })
    }
}


exports.getAllTours = async (req, res) => {

    try {
        //BUILD query
        // 1.Filter
        // const queryObj = { ...req.query }
        // const excludeFields = ['page', 'sort', 'limit', 'fields']
        // excludeFields.forEach(el => delete queryObj[el])

        // console.log('init query', req.query)
        // // 2. Advanced filter
        // const queryStr = JSON.stringify(queryObj)
        // const sanitizedQuery = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)

        // let query = Tour.find(JSON.parse(sanitizedQuery))

        // 3. Sort 
        // if (req.query.sort) {
        //     const sortBy = req.query.sort.split(',').join(' ')
        //     console.log(sortBy)
        //     query = query.sort(sortBy)
        //     // sort('price')
        // } else {
        //     // query = query.sort('-createdAt')
        // }

        // 4. Field limiting
        // if (req.query.fields) {
        //     const fields = req.query.fields.split(',').join(' ')
        //     query = query.select(fields)
        // } else {
        //     query = query.select('-__v')
        // }

        // 5) Pagination
        // page=2&limit=10
        // const page = req.query.page * 1 || 1
        // const limit = req.query.limit * 1 || 100
        // const skip = (page - 1) * limit

        // query = query.skip(skip).limit(limit)

        // if (req.query.page) {
        //     const numTours = await Tour.countDocuments()
        //     if (skip >= numTours) {
        //         throw new Error('This page does not exists')
        //     }
        // }
        // EXECUTE QUERY
        const features = new APIFeatures(Tour.find(), req.query).filter()
        const tours = await features.query

        res.status(200).json({
            status: 'success',
            results: tours.length,
            data: { tours }
        })
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err,
        })
    }
}

exports.getTour = async (req, res) => {
    try {
        const { id } = req.params
        const tour = await Tour.findOne({ _id: id })
        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        })
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err,
        })
    }
}



exports.updateTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
        res.status(200).json({
            status: 'Success',
            data: {
                tour: tour
            }
        })
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err,
        })
    }
}

exports.deleteTour = async (req, res) => {
    try {
        await Tour.findOneAndDelete({ _id: req.params.id })
        res.status(204).json({
            status: 'Success',
            data: null
        })
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err,
        })
    }
}

