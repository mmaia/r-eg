/**
 * Created by mmaia on 20/09/15.
 */
'use strict';

var acl = require('acl');
// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Events Permissions for each REST endpoint / role.
 */
exports.invokeRolesPolicies = function(){
    acl.allow([{
        roles: ['admin'],
        allows: [{
            resources: '/api/events',
            permissions: '*'
        },{
           resources: '/api/events/:eventId',
            permissions: '*'
        }]
    }, {
        roles: ['user'],
        allows: [{
            resources: '/api/events',
            permissions: ['get', 'post']
        }, {
            resources: '/api/events/:eventId',
            permissions: ['get']
        }]
    }, {
       roles: ['user', 'admin'],
        allows: [{
            resources: '/api/events/pictures/main-picture',
            permissions: ['post']
        }]
    }, {
        roles: ['guest'],
        allows: [{
            resources: '/api/events',
            permissions: ['get']
        },{
            resources: '/api/events/:eventId',
            permissions: ['get']
        }]
    },{
        roles: ['user', 'admin'],
        allows: [{
            resources: '/api/events/pictures/logo-picture',
            permissions: ['post']
        }]
    }
    ]);
};


exports.isAllowed = function(req, res, next){
    console.log('checking event permissions...');
    var roles = (req.user) ? req.user.roles : ['guest'];
    console.log(roles);
    // If an event is being processed and the current user created it then allow any manipulation
    if (req.event && req.user && req.event.user.id === req.user.id) {
        return next();
    }

    // Check for user roles
    acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
        console.log('checking permissions in events.policy....');
        console.log('roles: ' + roles);
        console.log('req.route.path: ' + req.route.path);
        console.log('req.method.toLowerCase: ' + req.method.toLowerCase());
        console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
        console.log('isAllowed: ' + isAllowed);
        if (err) {
            // An authorization error occurred.
            return res.status(500).send('Unexpected authorization error');
        } else {
            if (isAllowed) {
                console.log('Dude, it works!!! Awesome');
                // Access granted! Invoke next middleware
                return next();
            } else {
                console.log('returning 403... crap...');
                return res.status(403).json({
                    message: 'User is not authorized'
                });
            }
        }
    });
};
