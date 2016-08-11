/**
 * Created by mmaia on 13/08/15.
 */
'use strict';

// Setting up route
angular.module('events').config(['$stateProvider',
    function ($stateProvider) {
        // Articles state routing
        $stateProvider
            .state('events', {
                abstract: true,
                url: '/events',
                template: '<ui-view/>',
                data: {
                    roles: ['user', 'admin']
                }
            })
            .state('events.list', {
                url: '',
                templateUrl: 'modules/events/views/list-events.client.view.html'
            })
            .state('events.new', {
                url: '/new',
                templateUrl: 'modules/events/views/new-event.client.view.html'
            })
            .state('events.view', {
                url: '/:eventId',
                templateUrl: 'modules/events/views/view-event.client.view.html'
            })
            .state('events.edit', {
                url: '/:eventId/edit',
                templateUrl: 'modules/events/views/edit-event.client.view.html'
            })
            .state('events.newDescription', {
                url: '/:eventId/new-description',
                templateUrl: 'modules/events/views/new-description-event.client.view.html'
            })
            .state('events.newVenue', {
                url: '/:eventId/new-venue',
                templateUrl: 'modules/events/views/new-venue-event.client.view.html'
            })
            .state('events.newTicket', {
                url: '/:eventId/new-ticket',
                templateUrl: 'modules/events/views/new-ticket-event.client.view.html'
            })
            .state('events.newMap', {
                url: '/:eventId/new-map',
                templateUrl: 'modules/events/views/new-map-event.client.view.html'
            });
    }
]);
