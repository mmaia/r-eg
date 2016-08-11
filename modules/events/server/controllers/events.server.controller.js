/**
 * Created by mmaia on 13/08/15.
 * Contains basic persistence operations. Interacts with MongoDB(uses mongoose) to handle data manipulation.
 */
'use strict';
/**
 * Module dependencies.
 */
var path = require('path'),
    fs = require('fs'),
    mongoose = require('mongoose'),
    TheEvent = mongoose.model('Event'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an Event
 */
exports.create = function (req, res) {
    var event = new TheEvent(req.body);
    event.user = req.user;
    console.log('events.server.controller.create' + event);
    event.save(function (err) {
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            console.log('Event Created... ');
            console.log(event);
            //return persisted json event if operation completes.
            res.json(event);
        }
    });
};

/**
 * Show the current event
 */
exports.read = function (req, res) {
    res.json(req.event);
};

/**
 * Update a event
 */
exports.update = function (req, res) {
    console.log(req.body);
    var event = req.event;

    event.title = req.body.title;
    event.description = req.body.description;
    event.start = req.body.start;
    event.end = req.body.end;
    event.descriptionDetails = req.body.descriptionDetails;
    event.venue = req.body.venue;
    event.tickets = req.body.tickets;
    event.map = req.body.map;

    event.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(event);
        }
    });
};

/**
 * Delete an event
 */
exports.delete = function (req, res) {
    var event = req.event;

    event.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(event);
        }
    });
};

/**
 * List of events
 */
exports.list = function (req, res) {
    console.log('EventController.server.list');
    TheEvent.find().sort('-created').populate('user', 'displayName').exec(function (err, events) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(events);
        }
    });
};

/**
 * event middleware
 */
exports.eventByID = function (req, res, next, id) {
    console.log('recoverign event with id: ' + id);
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'event is invalid'
        });
    }

    TheEvent.findById(id).populate('user', 'displayName').exec(function (err, event) {
        if (err) {
            return next(err);
        } else if (!event) {
            return res.status(404).send({
                message: 'No event with that identifier has been found'
            });
        }
        req.event = event;
        next();
    });
};

/**
 * Update event main picture
 */
exports.changeEventMainPicture= function (req, res) {
    console.log('events.server.controller.changeEventMainPicture');
    var user = req.user;
    console.log(req);
    var event = req.event;
    var message = null;

    if (user) {
        fs.writeFile('./modules/events/client/img/main/uploads/' + req.files.file.name, req.files.file.buffer, function (uploadError) {
            if (uploadError) {
                return res.status(400).send({
                    message: 'Error occurred while uploading event main picture'
                });
            } else {
                event.mainImageURL = 'modules/events/img/main/uploads/' + req.files.file.name;
                event.save(function (saveError) {
                    if (saveError) {
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(saveError)
                        });
                    } else {
                        res.json(event);
                    }
                });
            }
        });
    } else {
        res.status(400).send({
            message: 'User is not signed in'
        });
    }
};

/**
 * Update logo main picture
 */
exports.changeLogoPicture= function (req, res) {
    console.log('events.server.controller.changeLogoMainPicture');
    var user = req.user;
    console.log(req);
    var event = req.event;
    var message = null;

    if (user) {
        fs.writeFile('./modules/events/client/img/logo/uploads/' + req.files.file.name, req.files.file.buffer, function (uploadError) {
            if (uploadError) {
                return res.status(400).send({
                    message: 'Error occurred while uploading event logo picture'
                });
            } else {
                event.logoImageURL = 'modules/events/img/logo/uploads/' + req.files.file.name;
                event.save(function (saveError) {
                    if (saveError) {
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(saveError)
                        });
                    } else {
                        res.json(event);
                    }
                });
            }
        });
    } else {
        res.status(400).send({
            message: 'User is not signed in'
        });
    }
};
