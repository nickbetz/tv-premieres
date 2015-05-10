app.directive("qtip", function ($compile, $templateCache) {
  var clone = $compile($templateCache.get("qtip.html"));

  function link (scope, el, attr) {
    el.qtip({
      position: {
        at: "bottom center"
      },
      style: {
        tip: {
          corner: "top left"
        },
        classes: "qtipCustom"
      },
      content: {
        text: function () {
          return scope.$apply(function () {
            return clone(scope);
          });
        }
      }
    });
  }
  return {
    link: link,
    scope: {
      text: "=qtip"
    }
  };
});