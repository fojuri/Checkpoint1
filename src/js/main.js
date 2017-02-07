const app = angular.module('myApp', ['ngMessages', 'angularModalService']);
app.controller('appCtrl', ['$scope', 'ModalService', ($scope, ModalService) => {
  $scope.fileNames = [];
  $scope.invertedIndex = new Index();
  $scope.uploader = () => {
    if (window.File && window.FileReader && window.FileList) {
      $scope.files = document.getElementById('upload').files;
      if (Object.keys($scope.files).length > 0) {
        Object.keys($scope.files).forEach((file, index) => {
          const filename = $scope.files[index].name;
          const reader = new FileReader();
          reader.onload = (e) => {
            let fileContent = e.target.result;
            try {
              fileContent = JSON.parse(fileContent);
              $scope.verifyFile(fileContent);
              if ($scope.valid) {
                $scope.displayDiv();
                $scope.invertedIndex.allBooks = $scope.invertedIndex.allBooks
                .concat(fileContent);
                $scope.invertedIndex.createIndex('allBooks',
                $scope.invertedIndex.allBooks);
                $scope.invertedIndex.createIndex(filename, fileContent);
                $scope.$apply((scope) => {
                  scope.fileNames.push(filename);
                });
              }
              document.getElementById('upload').value = null;
            } catch (err) {
              $scope.message =
              'File type not Supported;Upload only a JSON file';
              $scope.showModal();
            }
          };
          reader.readAsText($scope.files[index]);
        });
      } else {
        $scope.message = 'Kindly choose a file to upload';
        $scope.showModal();
      }
    } else {
      $scope.message = 'The File APIs are not fully supported by your browser.';
      $scope.showModal();
    }
  };
  $scope.create = () => {
    $scope.e = document.getElementById('filename');
    let filename = $scope.e.options[$scope.e.selectedIndex].value;
    $scope.filen = filename;
    filename = filename.replace(/\.json|\.|\s/g, '');
    $scope.createdIndex = $scope.invertedIndex.getIndex(filename);
    if (!$scope.createdIndex) {
      $scope.message =
      'You have not selected any file,Kindly select a file to proceed';
      $scope.showModal();
    }
    $scope.count = $scope.invertedIndex.docNum[filename];
  };
  $scope.search = () => {
    $scope.e = document.getElementById('filename');
    const filename = $scope.e.options[$scope.e.selectedIndex].value;
    $scope.term = document.getElementById('term').value;
    if ($scope.term === '') {
      $scope.message = 'Kindly enter a term to search';
      $scope.showModal();
    } else {
      $scope.createdIndex = $scope.invertedIndex.search(filename, $scope.term);
    }
  };
  $scope.displayDiv = () => {
    document.getElementById('crt').style.display = 'block';
    document.getElementById('book').style.display = 'block';
  };

  $scope.showModal = () => {
    ModalService.showModal({
      templateUrl: 'html/modal.html',
      controller: 'appCtrl',
      scope: $scope
    }).then((modal) => {
      modal.element.modal();
    });
  };

  $scope.verifyFile = (file) => {
    $scope.valid = true;
    if (file.length === 0) {
      $scope.message = 'File cannot be Empty';
      $scope.showModal();
      $scope.valid = false;
    } else {
      file.forEach((book) => {
        if (!book.title || !book.text) {
          $scope.valid = false;
        }
      });
      if (!$scope.valid) {
        $scope.message = 'Your books must be an object of title and text';
        $scope.showModal();
      }
    }
  };
}]);
