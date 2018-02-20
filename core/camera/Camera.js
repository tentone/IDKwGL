"use strict";

function Camera(){}

Camera.PERSPECTIVE = 0;
Camera.ORTHOGRAPHIC = 1;

Camera.prototype.updateMatrix = function(){};
Camera.prototype.updateProjectionMatrix = function(){};
Camera.prototype.resize = function(){};