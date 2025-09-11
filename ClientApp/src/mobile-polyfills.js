// Mobile browser polyfills and error handling
// This file provides compatibility fixes for mobile browsers

/* eslint-disable no-extend-native */
/* eslint-disable import/no-anonymous-default-export */

// Console error handling to prevent crashes on mobile
if (typeof console === 'undefined') {
  window.console = {
    log: function() {},
    error: function() {},
    warn: function() {},
    info: function() {}
  };
}

// Polyfill for older mobile browsers
if (!Array.prototype.includes) {
  Array.prototype.includes = function(searchElement, fromIndex) {
    var O = Object(this);
    var len = parseInt(O.length) || 0;
    if (len === 0) {
      return false;
    }
    var n = parseInt(fromIndex) || 0;
    var k;
    if (n >= 0) {
      k = n;
    } else {
      k = len + n;
      if (k < 0) {k = 0;}
    }
    var currentElement;
    while (k < len) {
      currentElement = O[k];
      if (searchElement === currentElement) {
        return true;
      }
      k++;
    }
    return false;
  };
}

// Object.assign polyfill for older browsers
if (typeof Object.assign !== 'function') {
  Object.assign = function(target) {
    if (target == null) {
      throw new TypeError('Cannot convert undefined or null to object');
    }

    var to = Object(target);

    for (var index = 1; index < arguments.length; index++) {
      var nextSource = arguments[index];

      if (nextSource != null) {
        for (var nextKey in nextSource) {
          if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
    }
    return to;
  };
}

// Global error handler for mobile devices
window.addEventListener('error', function(event) {
  console.error('Global error caught:', event.error);
  // Prevent the error from crashing the app
  event.preventDefault();
  return false;
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', function(event) {
  console.error('Unhandled promise rejection:', event.reason);
  // Prevent the error from crashing the app
  event.preventDefault();
});

// Touch event setup for better mobile interaction
document.addEventListener('DOMContentLoaded', function() {
  // Add touch support for better mobile interaction
  if ('ontouchstart' in window) {
    document.body.classList.add('touch-device');
  }
  
  // Prevent zoom on input focus for iOS
  if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
    var inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(function(input) {
      input.style.fontSize = '16px';
    });
  }
  
  // Better mobile navigation handling
  // Close menu when clicking outside on mobile
  document.addEventListener('click', function(event) {
    var sidebar = document.querySelector('.sidebar');
    var toggleButton = document.querySelector('#sidebarToggleTop');
    
    if (sidebar && window.innerWidth <= 768) {
      if (!sidebar.contains(event.target) && 
          !toggleButton.contains(event.target) && 
          sidebar.classList.contains('toggled')) {
        sidebar.classList.remove('toggled');
        document.body.classList.remove('sidebar-toggled');
      }
    }
  });
});

// Viewport height fix for mobile browsers
function setViewportHeight() {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', vh + 'px');
}

// Set initial viewport height
setViewportHeight();

// Update viewport height on resize/orientation change
window.addEventListener('resize', setViewportHeight);
window.addEventListener('orientationchange', function() {
  setTimeout(setViewportHeight, 100);
});

const mobilePolyfills = {};
export default mobilePolyfills;