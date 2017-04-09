// Tracker is global
var tracker = new tracking.ObjectTracker(['eye']);
tracker.setStepSize(1.7);

function trackEyes() {
  removeOldEyes();

  tracking.track('#img', tracker);
  tracker.on('track', function(event) {
    if (event.data.length == 0) {
      console.log("No eyes detected.");
      document.getElementById("status").innerHTML = "No eyes detected :( Please, try with another photo.";
      return;
    }

    event.data.forEach(function(rect) {
      var rect = detectEyes(rect.x, rect.y, rect.width, rect.height, false);
      document.getElementById("status").innerHTML = "Done!";
    });
  });

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
    document.querySelector('.demo-container').appendChild(rect);
    rect.classList.add('rect');
    rect.style.width = w + 'px';
    rect.style.height = h + 'px';
    rect.style.left = (img.offsetLeft + x) + 'px';
    rect.style.top = (img.offsetTop + y) + 'px';
    showRect ? (rect.style.borderColor = "#FF0000") : (rect.style.border = "none");
    
    createEyeImage(rect);
  };
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

window.onload = function() {
  trackEyes();

  document.getElementById('getval').addEventListener('change', readURL, true);
};

function readURL(){
    var file = document.getElementById("getval").files[0];
    var reader = new FileReader();
    reader.onloadend = function(){
      document.getElementById('img').src = reader.result;
      trackEyes();
    }
    if(file){
      reader.readAsDataURL(file);
    }
}

function loadLink() {
  var urlLink = document.getElementById('urlLink').value;
  if (checkURL(urlLink)) {
      document.getElementById('img').src = urlLink;
      trackEyes();
  } else {
    alert("Please insert a jpeg|jpg|png url file");
  }
}

function checkURL(url) {
    return(url.match(/\.(jpeg|jpg|png)$/) != null);
}