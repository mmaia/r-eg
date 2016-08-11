/**
 * Created by mmaia on 13/08/15.
 */
'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Event Schema
 */
var EventSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String,
        default: '',
        trim: true,
        required: 'Title cannot be blank'
    },
    description: {
        type: String,
        default: '',
        trim: true
    },
    start: {
        type: Date,
        default: Date.now
    },
    end: {
        type: Date,
        default: Date.now
    },
    descriptionDetails: {
        type: Array,
        default: []
    },
    tickets: {
        type: Array,
        default: []
    },
    mainImageURL: {
        type: String,
        default: '',
        trim: true
    },
    logoImageURL: {
        type: String,
        default: '',
        trim: true
    },
    venue: {
        type: String,
        default: ''
    },
    map: {
        type: Object,
        default: {}
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

mongoose.model('Event', EventSchema);
