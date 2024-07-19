let undoStack = [];
let redoStack = [];

document.getElementById('addText').addEventListener('click', function() {
    addTextBox();
    saveState();
});

document.getElementById('addImage').addEventListener('click', function() {
    document.getElementById('imageUpload').click();
});

document.getElementById('imageUpload').addEventListener('change', function(event) {
    if (event.target.files && event.target.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            addImageBox(e.target.result);
            saveState();
        };
        reader.readAsDataURL(event.target.files[0]);
    }
});

document.getElementById('fontSize').addEventListener('input', function() {
    const selectedElement = document.querySelector('.selected');
    if (selectedElement && selectedElement.classList.contains('text-box')) {
        selectedElement.style.fontSize = this.value + 'px';
        saveState();
    }
});

document.getElementById('fontColor').addEventListener('input', function() {
    const selectedElement = document.querySelector('.selected');
    if (selectedElement && selectedElement.classList.contains('text-box')) {
        selectedElement.style.color = this.value;
        saveState();
    }
});

document.getElementById('undo').addEventListener('click', function() {
    undo();
});

document.getElementById('redo').addEventListener('click', function() {
    redo();
});

function addTextBox() {
    const textBox = document.createElement('div');
    textBox.className = 'text-box';
    textBox.contentEditable = true;
    textBox.innerText = 'Edit me!';
    textBox.style.left = '50px';
    textBox.style.top = '50px';
    document.getElementById('canvas').appendChild(textBox);
    makeDraggable(textBox);
    textBox.addEventListener('click', selectElement);
}

function addImageBox(src) {
    const imageBox = document.createElement('div');
    imageBox.className = 'image-box';
    const img = document.createElement('img');
    img.src = src;
    imageBox.appendChild(img);
    imageBox.style.left = '150px';
    imageBox.style.top = '150px';
    document.getElementById('canvas').appendChild(imageBox);
    makeDraggable(imageBox);
    imageBox.addEventListener('click', selectElement);
}

function makeDraggable(element) {
    let isMouseDown = false;
    let offset = [0, 0];

    element.addEventListener('mousedown', function(e) {
        isMouseDown = true;
        offset = [
            element.offsetLeft - e.clientX,
            element.offsetTop - e.clientY
        ];
        element.classList.add('selected');
    });

    document.addEventListener('mouseup', function() {
        isMouseDown = false;
        document.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
    });

    document.addEventListener('mousemove', function(event) {
        event.preventDefault();
        if (isMouseDown) {
            element.style.left = (event.clientX + offset[0]) + 'px';
            element.style.top = (event.clientY + offset[1]) + 'px';
        }
    });
}

function selectElement(event) {
    document.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
    event.target.classList.add('selected');
}

function saveState() {
    const canvas = document.getElementById('canvas');
    undoStack.push(canvas.innerHTML);
    redoStack = [];
}

function undo() {
    if (undoStack.length > 0) {
        const canvas = document.getElementById('canvas');
        redoStack.push(canvas.innerHTML);
        const previousState = undoStack.pop();
        canvas.innerHTML = previousState;
        addEventListenersToElements();
    }
}

function redo() {
    if (redoStack.length > 0) {
        const canvas = document.getElementById('canvas');
        undoStack.push(canvas.innerHTML);
        const nextState = redoStack.pop();
        canvas.innerHTML = nextState;
        addEventListenersToElements();
    }
}

function addEventListenersToElements() {
    document.querySelectorAll('.text-box').forEach(makeDraggable);
    document.querySelectorAll('.image-box').forEach(makeDraggable);
    document.querySelectorAll('.text-box, .image-box').forEach(element => {
        element.addEventListener('click', selectElement);
    });
}

// Initial state save
saveState();
