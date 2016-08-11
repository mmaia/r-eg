/**
 * Created by mmaia on 13/08/15.
 */
/*global google */ //this was only used to make google object be recognized by jshint while runing gulp or grunt.
/*jshint -W110 */ // this was used to avoid jshint considering an error doublequotes with nested single codes i.e - " ' ' "
'use strict';

// Create the 'events' controller
angular.module('events').controller('EventsController', ['$log', '$scope', '$stateParams', '$location', 'Events',
    'Authentication', '$state', '$timeout', '$window', 'FileUploader', '$compile',
    function ($log, $scope, $stateParams, $location, Events, Authentication, $state, $timeout, $window, FileUploader, $compile) {

        $scope.authentication = Authentication;
        var self = this;

        self.events = [];


        self.preview = false;

        // Find a list of Events
        $scope.find = function () {
            $log.info('executing EventsController.$scope.find');
            self.events = Events.query();
        };

        $scope.createEvent = function () {
            var result = ''; //returns path
            console.log('CreateEventController.createEvent');

            var event = new Events({
                title: this.title,
                description: this.description,
                start: this.start,
                end: this.end
            });
            console.log(event);

            event.$save(function (response) {
                console.log('response:');
                console.log(response);
                console.log('events/' + response._id + '/edit');
                result = 'events/' + response._id + '/edit';
                $state.go('events.list');
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find existing Event
        $scope.findOne = function () {
            console.log('findOne');
            $scope.event = Events.get({
                eventId: $stateParams.eventId
            });
            console.log($scope.event);

            //this is called to use a template placeholder image for event main image in case one doesn't exists so far.
            self.getEventReady();
            self.getLogoReady();
        };

        /**used to parse persisted html formatted code to be escaped and display
         * TODO - NOT WORKING SO FAR..
         * */
        self.escapeHtml = function (textToParse) {
            var result;
            console.log(textToParse);
            result = textToParse
                .replace(/>/g, '&gt;')
                .replace(/</g, '&lt;')
                .replace(/"/g, '&quot;');
            console.log(result);
            return result;
        };


        // Remove existing Event
        $scope.remove = function (event) {
            if (event) {
                event.$remove();

                for (var i in $scope.events) {
                    if ($scope.events[i] === event) {
                        $scope.events.splice(i, 1);
                    }
                }
            } else {
                $scope.event.$remove(function () {
                    $location.path('events');
                });
            }
        };

        // Update existing Event
        $scope.update = function () {
            var event = $scope.event;
            console.log('about to make an update call event.$update');
            console.log(event);
            event.$update(function () {
                $location.path('events/' + event._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Update existing Event
        $scope.addEventDetail = function () {
            var eventDetail = {
                title: $scope.event.descriptionDetails.title,
                description: $scope.event.descriptionDetails.description
            };
            var event = $scope.event;
            event.descriptionDetails.push(eventDetail);

            console.log(event);
            event.$update(function () {
                $location.path('events/' + event._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        /**Add ticket informational link to this event*/
        $scope.addTicket = function () {
            var ticket = {
                label: $scope.event.tickets.label,
                url: $scope.event.tickets.url
            };
            var event = $scope.event;
            event.tickets.push(ticket);
            console.log(event);

            event.$update(function () {
                $location.path('events/' + event._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };


        $scope.cancel = function () {
            $state.go('events.list');
        };

//============================================================UPLOADERS=================================================
        //event main image uploader=============================================================================
        // Create file uploader instance for main image--------------------------------

        $scope.eventMainImageURL = '';


        //function just to set a placeholder image if an event main image is not yet picked.
        self.getEventReady = function () {
            $scope.event.$promise.then(function (event) {
                console.log('event.mainImageURL: ' + event.mainImageURL);

                //takes care of event mainImageURL
                if (event.mainImageURL === '' || event.mainImageURL === undefined) {
                    $scope.eventMainImageURL = '/modules/core/img/placeholderEventImage.png';
                    console.log('mainImage set ' + $scope.eventMainImageURL);
                } else {
                    $scope.eventMainImageURL = event.mainImageURL;
                }

                //takes care of uploaderMain.url attribute...
                $scope.uploaderMain.url = 'api/events/' + $scope.event._id + '/main-picture';
            });
        };

        $scope.uploaderMain = new FileUploader({
            url: 'api/events/$should_be_replaced_with_event_id/main-picture'
        });

        $scope.uploaderMain.filters.push({
            name: 'imageFilter',
            fn: function (item, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });

        // Called after the user selected a new picture file --------------------------
        $scope.uploaderMain.onAfterAddingFile = function (fileItem) {
            console.log('onAfterAddingFile of uploaderMain');
            if ($window.FileReader) {
                var fileReader = new FileReader();
                fileReader.readAsDataURL(fileItem._file);

                fileReader.onload = function (fileReaderEvent) {
                    $timeout(function () {
                        $scope.eventMainImageURL = fileReaderEvent.target.result;
                    }, 0);
                };
            }
        };

        // Called after the user has successfully uploaded a new picture
        $scope.uploaderMain.onSuccessItem = function (fileItem, response, status, headers) {
            // Show success message
            $scope.success = true;

            // Clear upload buttons
            $scope.uploaderMain.clearQueue();
        };

        // Called after the user has failed to uploaded a new picture
        $scope.uploaderMain.onErrorItem = function (fileItem, response, status, headers) {
            // Clear upload buttons
            $scope.cancelUploadMain();

            // Show error message
            $scope.error = response.message;
        };

        // Change user main event picture, send it to server side.
        $scope.uploadEventMainPicture = function () {
            console.log('uploadEventMainPicture, uploaderMain: ');

            $scope.uploaderMain.url = 'api/events/' + $scope.event._id + '/main-picture';
            console.log($scope.uploaderMain);
            console.log($scope.event);

            // Clear messages
            $scope.success = $scope.error = null;

            // Start upload, this is the action that actually call the server for the upload action.
            $scope.uploaderMain.uploadAll();
        };
        // Cancel the upload process for main event picture
        $scope.cancelUploadMain = function () {
            console.log('cancelUploadMain $scope.event.mainImageURL: ' + $scope.event.mainImageURL);
            $scope.uploaderMain.clearQueue();
            if ($scope.event.mainImageURL === '' || $scope.event.mainImageURL === undefined) {
                $scope.eventMainImageURL = '/modules/core/img/placeholderEventImage.png';
            } else {
                $scope.eventMainImageURL = $scope.event.mainImageURL;
            }
        };


        //event logo image uploader=============================================================================
        // Create file uploader instance for event logo image--------------------------------
        $scope.logoImageURL = '';


        //function just to set a placeholder image if an event main image is not yet picked.
        self.getLogoReady = function () {
            $scope.event.$promise.then(function (event) {
                console.log('event.logoImageURL: ' + event.logoImageURL);

                //takes care of event mainImageURL
                if (event.logoImageURL === '' || event.logoImageURL === undefined) {
                    $scope.logoImageURL = '/modules/core/img/sunEventPlaceholderImage.png';
                    console.log('logoImageURL set ' + $scope.logoImageURL);
                } else {
                    $scope.logoImageURL = event.logoImageURL;
                }

                //takes care of uploaderLogo.url attribute...
                $scope.uploaderLogo.url = 'api/events/' + $scope.event._id + '/logo-picture';
            });
        };

        // initializes uploaderLogo url to an invalid / temporary one as it's required by the entry that references it @ the html page
        $scope.uploaderLogo = new FileUploader({
            url: 'api/events/$should_be_replaced_with_event_id/logo-picture'
        });

        $scope.uploaderLogo.filters.push({
            name: 'imageFilter',
            fn: function (item, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });

        // Called after the user selected a new picture file --------------------------
        $scope.uploaderLogo.onAfterAddingFile = function (fileItem) {
            console.log('onAfterAddingFile of uploaderLogo');
            if ($window.FileReader) {
                var fileReader = new FileReader();
                fileReader.readAsDataURL(fileItem._file);

                fileReader.onload = function (fileReaderEvent) {
                    $timeout(function () {
                        $scope.logoImageURL = fileReaderEvent.target.result;
                    }, 0);
                };
            }
        };

        // Called after the user has successfully uploaded a new event logo picture
        $scope.uploaderLogo.onSuccessItem = function (fileItem, response, status, headers) {
            // Show success message
            $scope.success = true;

            // Clear upload buttons
            $scope.uploaderLogo.clearQueue();
        };

        // Called after the user has failed to uploaded a new event logo picture
        $scope.uploaderLogo.onErrorItem = function (fileItem, response, status, headers) {
            // Clear upload buttons
            $scope.cancelUploadLogo();

            // Show error message
            $scope.error = response.message;
        };

        // Change user logo event picture, send it to server side.
        $scope.uploadEventLogoPicture = function () {
            console.log('uploadEventLogoPicture, uploaderLogo: ');

            $scope.uploaderLogo.url = 'api/events/' + $scope.event._id + '/logo-picture';
            console.log($scope.uploaderLogo);
            console.log($scope.event);

            // Clear messages
            $scope.success = $scope.error = null;

            // Start upload, this is the action that actually call the server for the upload action.
            $scope.uploaderLogo.uploadAll();
        };
        // Cancel the upload process for logo event picture
        $scope.cancelUploadLogo = function () {
            console.log('cancelUploadLogo $scope.event.logoImageURL: ' + $scope.event.logoImageURL);
            $scope.uploaderLogo.clearQueue();
            if ($scope.event.logoImageURL === '' || $scope.event.logoImageURL === undefined) {
                $scope.logoImageURL = '/modules/core/img/sunEventPlaceholderImage.png';
            } else {
                $scope.logoImageURL = $scope.event.logoImageURL;
            }
        };


        //map -------------------------------------------------------------------------------------
        // Create map instance ====================================================================

        $scope.types = "['establishment']";
        $scope.address = '';
        $scope.currLat = '';
        $scope.currLng = '';
        $scope.placeChanged = function () {
            $scope.place = this.getPlace();
            $scope.currLat = $scope.place.geometry.location.lat();
            $scope.currLng = $scope.place.geometry.location.lng();
            $scope.map.setCenter($scope.place.geometry.location);
        };

        $scope.addMap = function () {
            var map = {
                address: $scope.address,
                lat: $scope.currLat,
                long: $scope.currLng
            };
            var event = $scope.event;
            event.map = map;
            console.log(event);

            event.$update(function () {
                $location.path('events/' + event._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };


        $scope.openGMaps = function () {
            console.log('openGMaps called');
            $window.open('http://maps.google.com/?q=' + $scope.event.map.lat + ',' + $scope.event.map.long + '&z=15', '_blank');
        };

        //Date -------------------------------------------------------------------------------------------------
        //Deals with Date fields ===============================================================================
        $scope.today = function () {
            $scope.start = new Date();
            $scope.end = new Date();
        };

        $scope.today();

        $scope.openInitialDate = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.openedInitialDate = true;
        };

        $scope.openFinalDate = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.openedFinalDate = true;
        };
        $scope.format = 'dd-MMMM-yyyy';
    }
]);
