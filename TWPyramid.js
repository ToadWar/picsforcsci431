"use strict";

var canvas;
var gl;

var numPositions  = 12;

var texSize = 256;
var texture;

var program;


var flag = true;



var positionsArray = [];
var colorsArray = [];
var texCoordsArray = [];

var texCoord = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),

];

var vertices = [

    vec4(0.5, -0.2722,  0.2886, 1.0),
    vec4(0.0,  -0.2722,  -0.5773, 1.0),
    vec4(-0.5,  -0.2722,  0.2886, 1.0),
    vec4(0.0, 0.5443,  0.0, 1.0),

];

var vertexColors = [
  
 vec4(1.0, 0.0, 0.0, 1.0),  // red
 vec4(0.0, 1.0, 0.0, 1.0),  // green
 vec4(0.0, 0.0, 1.0, 1.0),  // blue
 vec4(1.0, 1.0, 0.0, 1.0),  // Yellow 

];

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = xAxis;

var theta = vec3(45.0, 45.0, 45.0);

var thetaLoc;

function configureTexture(image) {

    texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB,
         gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                      gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.uniform1i(gl.getUniformLocation(program, "uTexMap"), 0);
}

function triple(a, b, c) {
     positionsArray.push(vertices[a]);
     colorsArray.push(vertexColors[a]);
     texCoordsArray.push(texCoord[0]);

     positionsArray.push(vertices[b]);
     colorsArray.push(vertexColors[a]);
     texCoordsArray.push(texCoord[1]);

     positionsArray.push(vertices[c]);
     colorsArray.push(vertexColors[a]);
     texCoordsArray.push(texCoord[2]);



}

function colorPyramid()
{
    triple(0,1,2);
    triple(1,2,3);
    triple(2,3,0);
    triple(3,0,1);
}


window.onload = function init() {

    canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available");

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    colorPyramid();

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW);

    var colorLoc = gl.getAttribLocation( program, "aColor");
    gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLoc);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(positionsArray), gl.STATIC_DRAW);

    var positionLoc = gl.getAttribLocation( program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc );

    var tBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW);

    var texCoordLoc = gl.getAttribLocation(program, "aTexCoord");
    gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(texCoordLoc);


    //
    // Initialize a texture
    //

   // const image = new Image();
   // image.onload = function() {
    //   configureTexture( image );
    //}
    //image.crossOrigin = "";
   // image.src = "TIGER.PNG";
    

    const image1 = document.getElementById("texImage1");
    //var image2 = document.getElementById("texImage2");
    //var image3 = document.getElementById("texImage3");
    //var image4 = document.getElementById("texImage4");

    configureTexture(image1);

  //  gl.activeTexture(gl.TEXTURE0);
  //  gl.bindTexture(gl.TEXTURE_2D, texture);
  //  gl.uniform1i(gl.getUniformLocation( program, "uTex0"), 0);

    //gl.activeTexture(gl.TEXTURE1 );
    //gl.bindTexture(gl.TEXTURE_2D, texture2);
    //gl.uniform1i(gl.getUniformLocation( program, "uTex1"), 1);

    thetaLoc = gl.getUniformLocation(program, "uTheta");


 document.getElementById("ButtonX").onclick = function(){axis = xAxis;};
 document.getElementById("ButtonY").onclick = function(){axis = yAxis;};
 document.getElementById("ButtonZ").onclick = function(){axis = zAxis;};
 document.getElementById("ButtonT").onclick = function(){flag = !flag;};

    render();
}

var render = function() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    if(flag) theta[axis] += 2.0;
    gl.uniform3fv(thetaLoc, theta);
    gl.drawArrays(gl.TRIANGLES, 0, numPositions);
    requestAnimationFrame(render);
}
