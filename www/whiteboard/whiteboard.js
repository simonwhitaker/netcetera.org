var COLOURS = ['black', 'red', 'orange', 'yellow', 'green', 'blue', 'darkblue', 'purple'];

var WELL_HEIGHT = 12;
var WELL_WIDTH = 12;

var TOOLBAR_HEIGHT = 40;
var TOOLBAR_BOTTOM_BORDER_WIDTH = 1;

var tools = new Array();
var last_tool_index = -1;

function init() {
    toolbar = document.getElementById('toolbar');
    cvs = document.getElementById('canvas');
    handleWindowResize();

    window.addEventListener('resize', handleWindowResize, false);

    ctx = cvs.getContext("2d");
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, cvs.width, cvs.height);

    // add palette buttons
    for (i = 0; i < COLOURS.length; i++) {
        var pen = document.createElement('span');
        pen.style.height = "12px";
        pen.className = "pen";
        pen.style.backgroundColor = COLOURS[i];
        var img = document.createElement('img');
        img.src = "pen.png";
        img.width = 12;
        img.height = 12;
        img.style.verticalAlign = "bottom";
        img.style.backgroundColor = COLOURS[i];
        img.title = COLOURS[i];
        
        pen.addEventListener("click", getPenColourCallback(i), false);
        pen.appendChild(img);
        addToToolbar(pen);
    }

    // add eraser button
    var tool = document.createElement('span');
    var img = document.createElement('img');
    img.src = 'eraser.png';
    img.width = 14;
    img.height = 13;
    img.style.verticalAlign = "bottom";
    tool.addEventListener("click", useEraser, false);
    tool.appendChild(img);
    addToToolbar(tool);

    // initialise UI
    setPenColour(0);
    selectTool(0);
    renderPng();

    cvs.addEventListener("mousedown", startDrawing, false);
    cvs.addEventListener("mouseup", stopDrawing, false);
}

function addToToolbar(element) {
    var button = document.createElement('span');
    button.className = "toolbar_button";
    element.addEventListener("click", getSelectToolCallback(tools.length), false);
    document.getElementById('tools').appendChild(button);
    button.appendChild(element)
    tools.push(button);
}

function handleWindowResize() {
    cvs = document.getElementById('canvas');

    aspect_ratio = cvs.width / cvs.height;

    max_width = window.innerWidth;
    max_height = window.innerHeight - (TOOLBAR_HEIGHT + TOOLBAR_BOTTOM_BORDER_WIDTH);

    if (max_width / aspect_ratio <= max_height) {
        max_height = max_width / aspect_ratio;
    } else {
        max_width = max_height * aspect_ratio;
    }

    cvs.style.width = max_width + 'px';
    cvs.style.height = max_height + 'px';
}

function getPenColourCallback(index) {
    return function() {
        setPenColour(index);
    };
}

function getSelectToolCallback(index) {
    return function() {
        selectTool(index);
    };
}

function setPenColour(index) {
    ctx = document.getElementById('canvas').getContext("2d");
    ctx.strokeStyle = COLOURS[index];
    ctx.lineWidth = 3;
}

function useEraser() {
    ctx = document.getElementById('canvas').getContext("2d");
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 100;
}

function selectTool(index) {
    if (last_tool_index >= 0) {
        deselectTool(last_tool_index);
    }
    tools[index].style.borderColor = "black";
    last_tool_index = index;
}

function deselectTool(index) {
    tools[index].style.borderColor = "transparent";
}

function startDrawing(e) {
    cvs = e.target;
    cvs.addEventListener("mousemove", doDrawing, false);

    coords = getMouseLocation(e);
    ctx = cvs.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(coords[0], coords[1]);

    // need to draw a dot if they just click and release
    ctx.lineTo(coords[0], coords[1]);
    ctx.stroke();
}

function stopDrawing(e) {
    cvs = e.target;
    cvs.removeEventListener("mousemove", doDrawing, false);
    renderPng();
}

function doDrawing(e) {
    coords = getMouseLocation(e);
    ctx = cvs.getContext("2d");
    ctx.lineTo(coords[0], coords[1]);
    ctx.stroke();
}

function getMouseLocation(e) {
    target = e.target;

    x_factor = target.width / target.clientWidth;
    y_factor = target.height / target.clientHeight;

    return [(e.pageX - target.offsetLeft) * x_factor, (e.pageY - target.offsetTop) * y_factor];
}

function renderPng() {
    cvs = document.getElementById('canvas');
    
    if (cvs.toDataURL) {
        img = document.getElementById('rendered_image');
        uri = cvs.toDataURL();
        img.src = uri;
        img.width = (cvs.width / cvs.height) * TOOLBAR_HEIGHT;
        img.height = TOOLBAR_HEIGHT;
        img.style.display = 'block';
    }
}
