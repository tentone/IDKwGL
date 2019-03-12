"use strict";

/**
 * Body object wraps a renderable object with a physics body object.
 *
 * The object extends the Body class and can be used a normal physics entity.
 */
function BodyObject(model)
{
	this.model = model;

	Body.call(this, this.model.getBox());
}

BodyObject.prototype = Object.create(Body.prototype);

BodyObject.prototype.update = function(world)
{
	Body.prototype.update.call(this, world);

	this.model.position.set(this.geometry.position.x, this.geometry.position.y, this.geometry.position.z);
	this.model.updateMatrix();
};
