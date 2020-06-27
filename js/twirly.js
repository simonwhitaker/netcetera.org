var TRAILLENGTH = 15;
var DT = 50; // time between frames in ms

var mouse_x;
var mouse_y;

var t = new Array();

function createTwirlyFromForm()
{
	var x = document.getElementById('x').value;
	var y = document.getElementById('y').value;
	var colour = document.getElementById('colour').value;
	
	if (x && y && colour)
	{
		var temp = new Twirly(x,y,colour);
		temp.twirl();
	}
}

function createSampleTwirlies()
{
	t[0] = new Twirly(20,20,'#090',20, true);
	t[0].twirl();
	
	t[1] = new Twirly(30,30,'#B36514',15, false);
	t[1].twirl();
}

function killSampleTwirlies()
{
	for (i = 0; i < t.length; i++)
	{
		t[i].stop();
	}
}

document.addEventListener('mousemove', getMouseCoordinates, false);

function getMouseCoordinates(e)
{	
//	if (t == null) createTwirlies();
	
	var IE = document.all ? true : false;

	var tempX = 0;
	var tempY = 0;
	
	if (IE) 
	{ 
		tempX = event.clientX + document.body.scrollLeft;
		tempY = event.clientY + document.body.scrollTop;
	}
	else 
	{
		tempX = e.pageX;
		tempY = e.pageY;
	}

	if (tempX < 0) tempX = 0;
	if (tempY < 0) tempY = 0;
	
	mouse_x = tempX;
	mouse_y = tempY;
}

function Twirly(radius_x, radius_y, colour, speed, clockwise)
{
	this.radius_x = radius_x;
	this.radius_y = radius_y;
	this.speed = speed;
	this.clockwise = clockwise;

	this.d = new Array(TRAILLENGTH);

	this.angle = 0;
	this.anim_ref = null;
	
	this.history_x = new Array(TRAILLENGTH);
	this.history_y = new Array(TRAILLENGTH);

	for (i = 0; i < TRAILLENGTH; i++)
	{
		this.history_x[i] = 0;
		this.history_y[i] = 0;
	}
	
	// methods
	this.twirl = twirl;
	this.stop = stop;

	for (i = 0; i < TRAILLENGTH; i++)
	{
		this.d[i] = document.createElement('div');
		document.getElementsByTagName('body')[0].appendChild(this.d[i]);

		this.d[i].style.position = 'absolute';
		this.d[i].style.color = colour;
		this.d[i].innerHTML = '*';
		this.d[i].style.opacity = 1.0 - 0.9 / TRAILLENGTH * i;
	}
	var ref = this;

	function stop()
	{
		if (ref.anim_ref != null)
		{
			clearInterval(ref.anim_ref);
		}
	}

	function twirl()
	{
		var dd = ref.speed;
		if (ref.clockwise) dd = dd * -1;
		ref.angle = (ref.angle + dd) % 360;

		ref.history_x.pop();
		ref.history_x.unshift(mouse_x);

		ref.history_y.pop();
		ref.history_y.unshift(mouse_y);
		
		for (i = 0; i < ref.d.length; i++)
		{
			var temp_x = avg(ref.history_x, i+1);
			var temp_y = avg(ref.history_y, i+1);

			if (ref.clockwise)
				degs = ref.angle + ((180 / ref.d.length) * i);
			else
				degs = ref.angle - ((180 / ref.d.length) * i);
			
			rads = degs / 180 * Math.PI;

			var x = Math.round(temp_x + (Math.sin(rads) * ref.radius_x) );
			var y = Math.round(temp_y + (Math.cos(rads) * ref.radius_y) );
			
			ref.d[i].style.left = x + 'px';
			ref.d[i].style.top = y + 'px';
		}
						
		if (ref.anim_ref != null)
		{
			clearInterval(ref.anim_ref);
		}
		ref.anim_ref = setInterval(twirl, DT);
	}
};

function avg(array, length)
{
	var sum = 0;
	var j = 0;
	for (j = 0; j < length; j++)
	{
		sum = sum + array[j];
	}
	var result = sum / length;
	
	return result;
}