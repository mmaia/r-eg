/**
 * Created by mmaia on 13/08/15.
 */
'use strict';

// Configuring the Events module
angular.module('events').run(['Menus',
    function (Menus) {
        // Set top bar menu items
        Menus.addMenuItem('topbar', {
            title: 'Events',
            state: 'events',
            type: 'dropdown'
        });

        Menus.addSubMenuItem('topbar', 'events', {
            title: 'List Events',
            state: 'events.list'
        });

        Menus.addSubMenuItem('topbar', 'events', {
            title: 'New Event',
            state: 'events.new'
        });
    }
]);
