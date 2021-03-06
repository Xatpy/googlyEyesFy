window.onload = function() {
  trackEyes();
  showLoadingSpinner(false);

  document.getElementById('getval').addEventListener('change', readURL, true);
};

window.onresize = function(event) {
  reload();
};

function showLoadingSpinner(value) {
  document.getElementById("loading").style.display = value ? "block": "none" ;
}

function createEyeImage(rectElement) {
  var imageEye = new Image();
  imageEye.style.maxWidth = "60%";
  imageEye.style.position = "absolute";
  imageEye.style.margin = "auto";
  imageEye.style.top = 0;
  imageEye.style.left = 0;
  imageEye.style.right = 0;
  imageEye.style.bottom = 0;
  var rotationRandom = Math.floor((Math.random() * 360));
  imageEye.style.transform = "rotate(" + rotationRandom + "deg)";
  
  imageEye.onload = function() {
    rectElement.appendChild(imageEye);
  };
  imageEye.src = './data/eye.png';
}

function detectEyes(x, y, w, h, showRect) {
  var rect = document.createElement('div');
  document.querySelector('.container').appendChild(rect);
  rect.classList.add('rect');
  rect.style.width = w + 'px';
  rect.style.height = h + 'px';
  rect.style.left = (img.offsetLeft + x) + 'px';
  rect.style.top = (img.offsetTop + y) + 'px';
  showRect ? (rect.style.borderColor = "#FF0000") : (rect.style.border = "none");
  
  createEyeImage(rect);
};

function trackEyes() {
  showLoadingSpinner(true);
  var tracker = new tracking.ObjectTracker(['eye']);
  tracker.setStepSize(1.7);
  removeOldEyes();
  tracking.track('#img', tracker);

  tracker.on('track', function(event) {
    document.getElementById("message").style.visibility = "hidden";
    showLoadingSpinner(false);
    if (event.data.length <= 0) {
      document.getElementById("message").style.visibility = "visible";
      console.log("No eyes detected.");
      return;
    }

    event.data.forEach(function(rect) {
      var rect = detectEyes(rect.x, rect.y, rect.width, rect.height, false);
    });
  });
}

function removeOldEyes() {
  parent = document.getElementById("mainContainer");
  oldEyes = parent.getElementsByClassName("rect");
  if (oldEyes < 1) {
    return;
  }
  for (var index = oldEyes.length - 1; index >= 0 ; --index) {
    parent.removeChild(oldEyes[index]);
  }
}

function readURL() {
  showLoadingSpinner(true);
  var file = document.getElementById("getval").files[0];
  var reader = new FileReader();
  reader.onloadend = function() {
    var img = new Image();
    img.src = reader.result;
    document.getElementById('img').src = reader.result;
    setTimeout(function(){trackEyes()},500);
  }
  if (file) {
    reader.readAsDataURL(file);
  }
}

function reload() {
  trackEyes();
}