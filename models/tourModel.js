const mongoose = require('mongoose')
const slugify = require('slugify')
const validator = require('validator')
const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true,
        trim: true,
        maxLength: [40, 'A tour name must have less or equal than 40 characters'],
        minLength: [10, 'A tour name must more than 10 characters'],
        // validate: [validator.isApha, 'A tour name must be alpha characters']
    },
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a max group size'],
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty is eaither easy, medium or difficulty'
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5'],
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function (val) {
                return val <= this.price
            },
            message: 'Discount price ({VALUE}) should be below the regular price'
        }
    },
    summary: {
        type: String,
        trim: true,
        require: [true, 'A tour must have a description']
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have a cover image']
    },
    images: {
        type: [String]
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    startDates: {
        type: [Date]
    },
    slug: String,
    secretTour: {
        type: Boolean,
        default: false
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})

tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7
})

// DOCUMENT Middleware, runs before .save() and .create() 
tourSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true })
    next()
})

// tourSchema.pre('save', function (next) {
//     console.log('WIll save document')
//     next()
// })

// tourSchema.post('save', function (doc, next) {
//     console.log(doc)
//     next()
// })

// QUERY MIDDLEWARE
tourSchema.pre(/^find/, function (next) {
    this.find({ secretTour: { $ne: true } })
    Object.assign(this, { start: Date.now() })
    // this.start = Date.now()
    next()
})

tourSchema.post(/^find/, function (docs, next) {
    console.log(`Query took ${Date.now() - this.start} miliseconds`)
    console.log('post', docs)
    next()
})

tourSchema.pre('aggregate', function (next) {
    console.log(this.pipeline())
    this.pipeline().unshift({
        $match: {
            secretTour: {
                $ne: true
            }
        }
    })
    next()
})

module.exports = mongoose.model('Tour', tourSchema) 