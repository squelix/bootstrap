angular.module('ui.bootstrap.collapse', [])

  .directive('uibCollapse', ['$animate', '$q', '$parse', '$injector', function($animate, $q, $parse, $injector) {
    var $animateCss = $injector.has('$animateCss') ? $injector.get('$animateCss') : null;
    return {
      link: function(scope, element, attrs) {
        var expandingExpr = $parse(attrs.expanding),
            expandedExpr = $parse(attrs.expanded),
            collapsingExpr = $parse(attrs.collapsing),
            collapsedExpr = $parse(attrs.collapsed),
            horizontal = false;

        horizontal = !!('horizontal' in attrs);

        if (!scope.$eval(attrs.uibCollapse)) {
          if (horizontal) {
            element.addClass('in')
              .addClass('collapse')
              .attr('aria-expanded', true)
              .attr('aria-hidden', false)
              .css({width: 'auto'})
              .css({height: 'inherit'});
          } else {
            element.addClass('in')
              .addClass('collapse')
              .attr('aria-expanded', true)
              .attr('aria-hidden', false)
              .css({height: 'auto'});
          }
        }

        function expand() {
          if (element.hasClass('collapse') && element.hasClass('in')) {
            return;
          }

          $q.resolve(expandingExpr(scope))
            .then(function() {
              element.removeClass('collapse')
                .addClass('collapsing')
                .attr('aria-expanded', true)
                .attr('aria-hidden', false);

              if (horizontal) {
                if ($animateCss) {
                  $animateCss(element, {
                    addClass: 'in',
                    easing: 'ease',
                    to: {width: element[0].scrollWidth + 'px'}
                  }).start()['finally'](expandDone);
                } else {
                  $animate.addClass(element, 'in', {
                    to: {width: element[0].scrollWidth + 'px'}
                  }).then(expandDone);
                }
              } else {
                if ($animateCss) {
                  $animateCss(element, {
                    addClass: 'in',
                    easing: 'ease',
                    to: {height: element[0].scrollHeight + 'px'}
                  }).start()['finally'](expandDone);
                } else {
                  $animate.addClass(element, 'in', {
                    to: {height: element[0].scrollHeight + 'px'}
                  }).then(expandDone);
                }
              }
            });
        }

        function expandDone() {
          if (horizontal) {
            element.removeClass('collapsing')
              .addClass('collapse')
              .css({width: 'auto'});
          } else {
            element.removeClass('collapsing')
              .addClass('collapse')
              .css({height: 'auto'});
          }
          expandedExpr(scope);
        }

        function collapse() {
          if (!element.hasClass('collapse') && !element.hasClass('in')) {
            return collapseDone();
          }

          $q.resolve(collapsingExpr(scope))
            .then(function() {
              if (horizontal) {
                element
                // IMPORTANT: The width must be set before adding "collapsing" class.
                // Otherwise, the browser attempts to animate from width 0 (in
                // collapsing class) to the given width here.
                  .css({width: element[0].scrollWidth + 'px'})
                  // initially all panel collapse have the collapse class, this removal
                  // prevents the animation from jumping to collapsed state
                  .removeClass('collapse')
                  .addClass('collapsing')
                  .attr('aria-expanded', false)
                  .attr('aria-hidden', true);

                if ($animateCss) {
                  $animateCss(element, {
                    removeClass: 'in',
                    to: {width: '0'}
                  }).start()['finally'](collapseDone);
                } else {
                  $animate.removeClass(element, 'in', {
                    to: {width: '0'}
                  }).then(collapseDone);
                }
              } else {
                element
                // IMPORTANT: The height must be set before adding "collapsing" class.
                // Otherwise, the browser attempts to animate from height 0 (in
                // collapsing class) to the given height here.
                  .css({height: element[0].scrollHeight + 'px'})
                  // initially all panel collapse have the collapse class, this removal
                  // prevents the animation from jumping to collapsed state
                  .removeClass('collapse')
                  .addClass('collapsing')
                  .attr('aria-expanded', false)
                  .attr('aria-hidden', true);

                if ($animateCss) {
                  $animateCss(element, {
                    removeClass: 'in',
                    to: {height: '0'}
                  }).start()['finally'](collapseDone);
                } else {
                  $animate.removeClass(element, 'in', {
                    to: {height: '0'}
                  }).then(collapseDone);
                }
              }
            });
        }

        function collapseDone() {
          if (horizontal) {
            element.css({width: '0'}); // Required so that collapse works when animation is disabled
          } else {
            element.css({height: '0'}); // Required so that collapse works when animation is disabled
          }
          element.removeClass('collapsing')
            .addClass('collapse');
          collapsedExpr(scope);
        }

        scope.$watch(attrs.uibCollapse, function(shouldCollapse) {
          if (shouldCollapse) {
            collapse();
          } else {
            expand();
          }
        });
      }
    };
  }]);
