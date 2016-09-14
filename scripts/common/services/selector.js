//This is the main API service which connects to the MicrositeAPI
//The API base URL and the languageID are global variables and are defined in /app.js
(function () {
    'use strict';

    angular.module('services.selector', ['ngCookies'])
     .factory('selector', ['$http','$cookieStore', selector]);

    function selector($http, $cookieStore) {

       //get selected flight details or nothing 
       var selectedFlightDetails = $cookieStore.get('selectedFlightDetails') || null;
        
        
        //********
        //Set Flight Selection
        //********
        var setFlightSelection = function (_selectedFlightDetails) {
            console.log('Saving flight details.  id: ' + _selectedFlightDetails.id +    'From: ' + _selectedFlightDetails.from + ' To: ' + _selectedFlightDetails.name + ' ToID: ' + _selectedFlightDetails.toid );
            //if all properties are null then remove cookie (it means that user has chosen null values on route selector)
            if (_selectedFlightDetails.from=='' && _selectedFlightDetails.to=='' ){
                //remove cookie
                console.log('Clearing flight selection');
                $cookieStore.remove('selectedFlightDetails');
                selectedFlightDetails=null;
            }else{
                //persist in cookie
                $cookieStore.put('selectedFlightDetails', _selectedFlightDetails);
            }
            return;
        }
        
    
        
        //********
        //Get Flight Selection
        //********
        var getFlightSelection = function () {
            return $cookieStore.get('selectedFlightDetails');
        }
        
        
        var getGenre= function(_genre) {
            
            var genreCurrent= _genre;
           
            
            
        }
        
        //********
        //Filter out the results according to the selection made on the homepage(route selector)
        //********
        var filterContentForSelectedFlight = function (input_data) {
            
            //CANCELLED CODE BELOW BELONGS TO THE NORMAL BEHAVIOR OF THE ROUTE SELECTOR. THIS IS TURNED OF FOR NORWEGIAN
            
            //check if route selector is saved
//            if($cookieStore.get('selectedFlightDetails')!=null){
//                selectedFlightDetails=$cookieStore.get('selectedFlightDetails');
//                //get the chosen flight details
//                console.log('Filtering the content, From: ' + selectedFlightDetails.from + ' To: ' + selectedFlightDetails.to + ' Class: ' + selectedFlightDetails.class + ' Month: ' + selectedFlightDetails.month);
//
//
//
//                // check if from,to,class and month are set and if they are then filter and build a new array to return
//                
//                    var arrayOfSelectedFilters=[];
//                    
//                    //check if filter is selected and add it to an array if it is
//                    if(selectedFlightDetails.from != null && selectedFlightDetails.from != ''){
//                        arrayOfSelectedFilters.push( parseInt(selectedFlightDetails.from));
//                    }
//                    if(selectedFlightDetails.to != null && selectedFlightDetails.to != ''){
//                        arrayOfSelectedFilters.push( parseInt(selectedFlightDetails.to));
//                    }
//                    if(selectedFlightDetails.class != null && selectedFlightDetails.class != ''){
//                        arrayOfSelectedFilters.push(parseInt(selectedFlightDetails.class));
//                    }
//                    if(selectedFlightDetails.month != null && selectedFlightDetails.month != ''){
//                        arrayOfSelectedFilters.push(parseInt(selectedFlightDetails.month));
//                    }
//                
//                    console.log('Array of selected Filter IDs',arrayOfSelectedFilters );
//
//                
//                    var amountOfFilters =arrayOfSelectedFilters.length;
//
//                    var data_onflight = _.filter(input_data, function(item) {
//                    
//                    //console.log("arrayOfSelectedFilters", arrayOfSelectedFilters);
//                    return _.intersection(arrayOfSelectedFilters, item.assignedAttributeID).length == amountOfFilters;
//                    
//                    //return _.contains(item.assignedAttributeID,  parseInt(selectedFlightDetails.class)); 
//                    });
//                
//
//                return data_onflight;
//
//            } else{
//                return input_data;
//            }
            return input_data;
        };
        
       




        //API public methods
        return {
            setFlightSelection: setFlightSelection,           
            getFlightSelection: getFlightSelection,
            filterContentForSelectedFlight: filterContentForSelectedFlight,
            getGenre:getGenre
        };

    };
}());
