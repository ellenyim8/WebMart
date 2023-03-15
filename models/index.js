var submit = document.getElementById('submitButton');
submit.onclick = showImage;     //Submit Show image when click button

function showImage() {
var newImage = document.getElementById('image-show').lastElementChild;
newImage.style.visibility = "visible";

document.getElementById('image-upload').style.visibility = 'hidden';

document.getElementById('fileName').textContent = null;     //remove current file name
}

function loadFile(input) {
     var file = input.files[0];	//get selected file
    //add text(file nema) into div field
     var name = document.getElementById('fileName');
     name.textContent = file.name;
      //Add new image div
     var newImage = document.createElement("img");
     newImage.setAttribute("class", 'img');

     //get Image source
     newImage.src = URL.createObjectURL(file);   

     newImage.style.width = "70%";
     newImage.style.height = "70%";
     newImage.style.visibility = "hidden";   //hide it before clicks button
     newImage.style.objectFit = "contain";

     //add img in image-show div
     var container = document.getElementById('image-show');
     container.appendChild(newImage);
};