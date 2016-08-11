/**
 * Created by mmaia on 22/09/15.
 */
'use strict';

/**
 * Module dependencies.
 */
var eventsPolicy = require('../policies/events.server.policy'),
    events = require('../controllers/events.server.controller');

module.exports = function (app) {
    // events collection routes
    app.route('/api/events').all(eventsPolicy.isAllowed)
        .get(events.list)
        .post(events.create);

    // Single event routes
    app.route('/api/events/:eventId').all(eventsPolicy.isAllowed)
        .get(events.read)
        .put(events.update)
        .delete(events.delete);

    app.route('/api/events/:eventId/main-picture').all(eventsPolicy.isAllowed)
        .post(events.changeEventMainPicture);

    app.route('/api/events/:eventId/logo-picture').all(eventsPolicy.isAllowed)
        .post(events.changeLogoPicture);

    app.param('eventId', events.eventByID);
};
