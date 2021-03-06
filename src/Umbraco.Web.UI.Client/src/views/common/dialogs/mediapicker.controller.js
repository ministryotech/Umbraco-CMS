//used for the media picker dialog
angular.module("umbraco")
    .controller("Umbraco.Dialogs.MediaPickerController",
        function ($scope, mediaResource, umbRequestHelper, entityResource, $log, mediaHelper, eventsService, treeService, $cookies) {

            var dialogOptions = $scope.$parent.dialogOptions;
            $scope.onlyImages = dialogOptions.onlyImages;
            $scope.multiPicker = (dialogOptions.multiPicker && dialogOptions.multiPicker !== "0") ? true : false;
            $scope.startNodeId = dialogOptions.startNodeId ? dialogOptions.startNodeId : -1;


            $scope.options = {
                url: umbRequestHelper.getApiUrl("mediaApiBaseUrl", "PostAddFile"),
                autoUpload: true,
                formData: {
                    currentFolder: -1
                }
            };

            //preload selected item
            $scope.target = undefined;
            if(dialogOptions.currentTarget){
                $scope.target = dialogOptions.currentTarget;
            }

            $scope.submitFolder = function(e) {
                if (e.keyCode === 13) {
                    e.preventDefault();
                    $scope.showFolderInput = false;

                    mediaResource
                        .addFolder($scope.newFolderName, $scope.options.formData.currentFolder)
                        .then(function(data) {

                            //we've added a new folder so lets clear the tree cache for that specific item
                            treeService.clearCache({
                                cacheKey: "__media", //this is the main media tree cache key
                                childrenOf: data.parentId //clear the children of the parent
                            });

                            $scope.gotoFolder(data);
                        });
                }
            };

            $scope.gotoFolder = function(folder) {

                if(!folder){
                    folder = {id: -1, name: "Media", icon: "icon-folder"};
                }

                if (folder.id > 0) {
                    entityResource.getAncestors(folder.id, "media")
                        .then(function(anc) {
                            // anc.splice(0,1);  
                            $scope.path = _.filter(anc, function (f) {
                                return f.path.indexOf($scope.startNodeId) !== -1;
                            });
                        });
                }
                else {
                    $scope.path = [];
                }

                //mediaResource.rootMedia()
                mediaResource.getChildren(folder.id)
                    .then(function(data) {

                        $scope.images = [];

                        $scope.searchTerm = "";
                        if(data.items){
                             $scope.images = data.items;
                        }

                        if($scope.onlyImages){
                            $scope.images = _.reject($scope.images, function(item) {
                                return item.contentTypeAlias.toLowerCase() !== "folder" && item.thumbnail === "";
                            });    
                        }
                    });

                $scope.options.formData.currentFolder = folder.id;
                $scope.currentFolder = folder;      
            };

            $scope.$on('fileuploadstop', function(event, files) {
                $scope.gotoFolder($scope.currentFolder);
            });

            $scope.clickHandler = function(image, ev, select) {
                ev.preventDefault();
                
                if (image.contentTypeAlias.toLowerCase() == 'folder' && !select) {
                    $scope.gotoFolder(image);
                }else{
                    eventsService.emit("dialogs.mediaPicker.select", image);
                    
                    if ($scope.multiPicker) {
                        $scope.select(image);
                        image.cssclass = ($scope.dialogData.selection.indexOf(image) > -1) ? "selected" : "";
                    }else {
                        $scope.target= image;
                        $scope.target.url = mediaHelper.resolveFile(image);
                    }
                }
            };

            $scope.exitDetails = function(){
                if(!$scope.currentFolder){
                    $scope.gotoFolder();
                }

                $scope.target = undefined;
            };

            $scope.selectFolder= function(folder) {
                if ($scope.multiPicker) {
                    $scope.select(folder);
                }
                else {
                    $scope.submit(folder);
                }                
            };

            $scope.selectMediaItem = function(image) {
                if (image.contentTypeAlias.toLowerCase() == 'folder') {
                    $scope.gotoFolder(image);
                }else{
                    eventsService.emit("dialogs.mediaPicker.select", image);
                    
                    if ($scope.multiPicker) {
                        $scope.select(image);
                    }
                    else {
                        $scope.submit(image);
                    }
                }
            };

            //default root item
            if(!$scope.target){
                $scope.gotoFolder({ id: $scope.startNodeId, name: "Media", icon: "icon-folder" });  
            }
        });