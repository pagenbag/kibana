define(function (require) {
  var _ = require('lodash');
  require('components/paginated_table/paginated_table');

  require('modules').get('apps/settings')
  .directive('scriptedFields', function ($compile, kbnUrl) {
    var rowScopes = []; // track row scopes, so they can be destroyed as needed
    var controlsHtml = require('text!plugins/settings/sections/indices/_scripted_field_controls.html');

    return {
      restrict: 'E',
      template: require('text!plugins/settings/sections/indices/_scripted_fields.html'),
      scope: true,
      link: function ($scope, $el, attr) {
        var fieldEditorPath = '/settings/indices/{{ indexPattern }}/scriptedField';
        $scope.perPage = 25;

        $scope.columns = [{
          title: 'name'
        }, {
          title: 'script'
        }, {
          title: 'controls',
          class: 'pull-right',
          sortable: false
        }];

        $scope.$watch('indexPattern.scriptedFields', function () {
          _.invoke(rowScopes, '$destroy');

          $scope.rows = $scope.indexPattern.scriptedFields.map(function (field, i) {
            var rowScope = $scope.$new();
            var columns = [field.name, field.script];
            rowScope.field = field;
            rowScopes.push(rowScope);

            columns.push({
              markup: $compile(controlsHtml)(rowScope)
            });

            return columns;
          });
        });

        $scope.create = function () {
          var params = {
            indexPattern: $scope.indexPattern.id
          };

          kbnUrl.change(fieldEditorPath, params);
        };

        $scope.edit = function (field) {
          var params = {
            indexPattern: $scope.indexPattern.id,
            fieldName: field.name
          };

          kbnUrl.change(fieldEditorPath + '/{{ fieldName }}', params);
        };

        $scope.remove = function (field) {
          console.log('remove');
        };
      }
    };
  });
});