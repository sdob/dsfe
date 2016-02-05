(function() {

  // We have to inject 'maps' into this, because we
  // don't have a guarantee that the maps API will have
  // loaded when this module runs...

  return {
    getLongPress,
  };

  function getLongPress(maps) {

    LongPress.prototype.onMouseUp_ = function(e) {
      clearTimeout(this.timeoutId_);
    };

    LongPress.prototype.onMouseDown_ = function(e) {
      clearTimeout(this.timeoutId_);
      const map = this.map_;
      const event = e;
      this.timeoutId_ = setTimeout(function() {
        vm.maps.event.trigger(map, 'longpress', event);
      }, this.length_);
    };

    LongPress.prototype.onMapDrag_ = function(e) {
      clearTimeout(this.timeoutId_);
    };

    return LongPress;

    // Implement a long-press listener
    function LongPress(map, length) {
      this.length_ = length;
      const vm = this;
      vm.map_ = map;
      vm.timeoutId_ = null;
      maps.event.addListener(map, 'mousedown', function(e) {
        vm.onMouseDown_(e);
      });

      maps.event.addListener(map, 'mouseup', function(e) {
        vm.onMouseUp_(e);
      });

      maps.event.addListener(map, 'drag', function(e) {
        vm.onMapDrag_(e);
      });
    }
  }

})();
