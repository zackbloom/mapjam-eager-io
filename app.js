(function(){

  console.log('init');

  // We check for features which are not universally supported, and don't try to
  // show the app if it would error.
  if (!window.addEventListener)
    return;

  // The INSTALL_OPTIONS constant is inserted by the Eager bundler.  It's value is the
  // value of the options defined in the install.json file.
  var options = INSTALL_OPTIONS;

  // We fake a view count by storing it locally.  It only updates for the currently
  // viewing visitor, making it pretty much useless.

  var el = null;
  var prevEl = null;

  var updateElement = function(){
    console.log('updateElement');
    // We keep track of the last element to allow us to restore the removed element
    // when we do live updating of the preview.  Details:
    // https://eager.io/developer/docs/install-json/preview#dealing-with-element-fields
    if (el && el.parentNode){
      if (prevEl){
        el.parentNode.replaceChild(prevEl, el);
        prevEl = null;
      } else {
        el.parentNode.removeChild(el);
      }
    } else {
      if (options.element.method == 'replace')
        prevEl = document.querySelector(options.element.selector);

      el = Eager.createElement(options.element);
    }
  };

  var update = function(){
    console.log(options);
    updateElement();
    // build the querystring for embeds based on user input
    var params = {
        app_url: '//mapjam.com/',
        cdn_url: '//mapjamjson.global.ssl.fastly.net/',
        map_id: options.map,
        container: 'mapjam-1',
        domain: 'mapjam.com',
        disableClusteringAtZoom: 1
    };
    if (options.zoom) {
      params.zoom = Math.max(Math.min(options.zoom, 18), 1);
    }
    if (options.sharing_visible) {
      params.sharing_visible = !options.sharing_visible;
    }
    function validLat(lat) {
      return lat !== null && lat !== undefined && !isNaN(lat);
    }
    if (validLat(options.lat) && validLat(options.lng)) {
      params.map_lat_lng = options.lng + ',' + options.lat;
    }
    var parts = [];
    for (var i in params) {
      if (params.hasOwnProperty(i)) {
        parts.push(encodeURIComponent(i) + "=" + encodeURIComponent(params[i]));
      }
    }
    var qs = parts.join("&");
    console.log('qs: ' + qs);
    el.innerHTML = '<iframe class="mapjam-iframe" frameborder="0" id="mapjam-iframe" src="//embeds.mapjam.com/v2/map-embed.html?' + qs + '" style="width: 100%;height:{{height_px}}px"></iframe>';
  };

  var setOptions = function(opts){
    options = opts;

    update();
  };

  // Since we're adding an element to the body, we need to wait until the DOM is
  // ready before inserting our widget.
  if (document.readyState == 'loading')
    document.addEventListener('DOMContentLoaded', update);
  else
    update();

  // This is used by the preview to enable live updating of the app while previewing.
  // See the preview.handlers section of the install.json file to see where it's used.
  window.MapjamWidget = {
    setOptions: setOptions
  };

})();