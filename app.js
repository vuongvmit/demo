function generateQRCode() {
  let win = _sfaWins.sfaWins.createWindow("mailTimerChange", 400, 300, 320, 320);
  win.setText("QR Code Schedule");
  win.button("minmax1").hide();
  win.button("park").hide();
  win.button("close").attachEvent("onClick", function(){
      win.setModal(false);
      win.close();
  });
  win.setModal(true);
  let qrForm = win.attachForm();
  qrForm.loadStruct(loadJSON(getTemplatePath(_SFA.DATA_PATH.DEMO_QR_CODE)), function(){
      var qrcode = new QRCode(document.getElementById("qrcode"), {
          width : 250,
          height : 250
      });
      qrcode.makeCode("Vu Minh Vuong");
  });
}

function readQRCode() {
  var video = document.createElement("video");
  var canvasElement = document.getElementById("canvas");
  var canvas = canvasElement.getContext("2d");
  var loadingMessage = document.getElementById("loadingMessage");
  var outputContainer = document.getElementById("output");
  var outputMessage = document.getElementById("outputMessage");
  var outputData = document.getElementById("outputData");
  navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(function(stream) {
      video.srcObject = stream;
      video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
      video.play();
      requestAnimationFrame(tick);
  });
}

function drawLine(ctx, pos, options={color:"blue", size:5}){
    // 線のスタイル設定
    ctx.strokeStyle = options.color;
    ctx.lineWidth   = options.size;

    // 線を描く
    ctx.beginPath();
    ctx.moveTo(pos.topLeftCorner.x, pos.topLeftCorner.y);         // 左上からスタート
    ctx.lineTo(pos.topRightCorner.x, pos.topRightCorner.y);       // 右上
    ctx.lineTo(pos.bottomRightCorner.x, pos.bottomRightCorner.y); // 右下
    ctx.lineTo(pos.bottomLeftCorner.x, pos.bottomLeftCorner.y);   // 左下
    ctx.lineTo(pos.topLeftCorner.x, pos.topLeftCorner.y);         // 左上に戻る
    ctx.stroke();
};

function tick() {
    loadingMessage.innerText = "⌛ Loading video..."
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        loadingMessage.hidden = true;
        canvasElement.hidden = false;
        outputContainer.hidden = false;

        canvasElement.height = video.videoHeight;
        canvasElement.width = video.videoWidth;
        canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
        var imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
        var code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
        });
        if (code) {
            drawLine(code.location.topLeftCorner, code.location.topRightCorner, "#FF3B58");
            drawLine(code.location.topRightCorner, code.location.bottomRightCorner, "#FF3B58");
            drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, "#FF3B58");
            drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, "#FF3B58");
            outputMessage.hidden = true;
            outputData.parentElement.hidden = false;
            outputData.innerText = code.data;
        } else {
            outputMessage.hidden = false;
            outputData.parentElement.hidden = true;
        }
    }
    requestAnimationFrame(tick);
}
