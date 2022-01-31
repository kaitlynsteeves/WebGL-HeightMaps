
/* 
   original code taken from MDN Web Docs
   https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Lighting_in_WebGL

   -the functions which return the 3D vertices, normals, indices to
   the WebGL program
   -image array structure and variables
*/


	// flag indicating that data has been loaded and image can be drawn 
let loaded = false;

    // global variables for image data, size, and depth
	// set in the index.html file
let imageData = [];
let imageHeight = 0;
let imageWidth = 0;
let imageDepth = 0;

	// global geometry arrays
	// set in this file
let vertices = [];
let indices = [];
let normals = [];
let textureCoords = [];
let vertexCount = 0; 	// number of vertices, not individual values 



	// create geometry which will be drawn by WebGL
	// create vertex, normal, index arrays using
	// the data from the input file is in the imageData[] array 
	// your code goes here
function initGeometry() {
	let height = getHeight();
	let width = getWidth();

	// calculate vertex array for height map
	calculateVertices(height,width);

	// calculate normals for height map
	calculateNormals();


	//TODO DELETE
	console.log(imageData); 
	console.log(vertices);
	console.log(vertices.length);
	//

indices.push(0);
indices.push(1);
indices.push(2);
indices.push(0);
indices.push(2);
indices.push(3);
	// set the vertexCount equal to the number of vertices
	vertexCount = indices.length;

	// create the indices[] array 
	// if vertices[] contains all of the values generated from the
	//    image (including duplicates) then the number of indices is the
	//    (height-1) * (width-1) of the image * the number of vertices
	//    neede to create two triangles (6)
	// the indices[] array will contain the values from 0 to the
	//    number of indices - 1
	
	
	// load textures coordinates, currently use same texture for colour
	//    for all points
	let numberIndices = indices.length;

    for (let i=0; i<(numberIndices/3); i++) {
       textureCoords.push(0.0,0.0,  1.0,0.0,   1.0,1.0,);
    }

}

function getHeight() {
	let max = 0;

	for(let row = 0; row < imageData.length; row++) {
		if(imageData[row][0] > max) {
			max = imageData[row][0];
		}
	}

	return max;
}

function getWidth() {
	let max = 0;

	for(let row = 0; row < imageData.length; row++) {
		if(imageData[row][0] > max) {
			max = imageData[row][1];
		}
	}

	return max;
}

function getStepSize(height, width) {
	if(height > width)
		return 1.0 / height;
	else
		return 1.0 / width;
}

function calculateVertices(height,width) {
	// calculate step size for x and z values
	let stepSize = getStepSize(height,width);

	for(let row = 0; row < height; row++){
		for(let col = 0; col < width; col++) {	
		// triangle 1
			// x1 value
			vertices.push(row / stepSize);
			// y1 value
			vertices.push((parseFloat(getFromArray(row,col)) / imageDepth)*0.3); //scale y value by image depth and then again by 0.3
			// z1 value
			vertices.push(col / stepSize);

			// x2 value
			vertices.push(row / stepSize);
			// y2 value
			vertices.push((parseFloat(getFromArray(row,col+1)) / imageDepth)*0.3); //scale y value by image depth and then again by 0.3
			// z2 value
			vertices.push((col + 1) / stepSize);

			// x3 value
			vertices.push((row + 1) / stepSize);
			// y3 value
			vertices.push((parseFloat(getFromArray(row+1,col+1)) / imageDepth)*0.3); //scale y value by image depth and then again by 0.3
			// z3 value
			vertices.push((col + 1) / stepSize);

		// triangle 2
			// x1 value
			vertices.push((row + 1) / stepSize);
			// y1 value
			vertices.push((parseFloat(getFromArray(row+1,col+1)) / imageDepth)*0.3); //scale y value by image depth and then again by 0.3
			// z1 value
			vertices.push((col + 1) / stepSize);

			// x2 value
			vertices.push((row + 1) / stepSize);
			// y2 value
			vertices.push((parseFloat(getFromArray(row+1,col)) / imageDepth)*0.3); //scale y value by image depth and then again by 0.3
			// z2 value
			vertices.push(col / stepSize);

			// x3 value
			vertices.push(row / stepSize);
			// y3 value
			vertices.push((parseFloat(getFromArray(row,col)) / imageDepth)*0.3); //scale y value by image depth and then again by 0.3
			// z3 value
			vertices.push(col / stepSize);
		}
	}	
}

function getFromArray(x,z) {
	for(let row = 0; row < imageData.length; row++){
		if(imageData[row][0] == x && imageData[row][1] == z) {
			return imageData[row][2];
		}
	}

	return 0;
}

function calculateNormals() {
	for(let i = 0; i < vertices.length; i += 9){
	// get 3 vertices
	let vertice1x = vertices[i];
	let vertice1y = vertices[i+1];
	let vertice1z = vertices[i+2];

	let vertice2x = vertices[i+3];
	let vertice2y = vertices[i+4];
	let vertice2z = vertices[i+5];

	let vertice3x = vertices[i+6];
	let vertice3y = vertices[i+7];
	let vertice3z = vertices[i+8];
	
	let vector1 = [(vertice1x - vertice2x), (vertice1y - vertice2y), (vertice1z - vertice2z)];
	let vector2 = [(vertice3x - vertice2x), (vertice3y - vertice2y), (vertice3z - vertice2z)];

	let crossProduct = ([((vector1[1] * vector2[2]) - (vector1[2] * vector2[1])), 
						 ((vector1[2] * vector2[0]) - (vector1[0] * vector2[2])), 
						 ((vector1[0] * vector2[1]) - (vector1[1] * vector2[0]))]);

	let crossProductLength = Math.sqrt((crossProduct[0] * crossProduct[0]) + 
									   (crossProduct[1] * crossProduct[1]) + 
									   (crossProduct[2] * crossProduct[2]));
	
	crossProduct[0] /= crossProductLength;
	crossProduct[1] /= crossProductLength;
	crossProduct[2] /= crossProductLength;
	
	normals.push(crossProduct[0]);
	normals.push(crossProduct[1]);
	normals.push(crossProduct[2]);

	normals.push(crossProduct[0]);
	normals.push(crossProduct[1]);
	normals.push(crossProduct[2]);

	normals.push(crossProduct[0]);
	normals.push(crossProduct[1]);
	normals.push(crossProduct[2]);
	}
}

	// return the number of indices in the object
	// this should match the number of values in the indices[] array
function getVertexCount() {
   return(vertexCount);
}

	// position array
	// vertex positions
function loadvertices() {
  return(vertices);
}


	// normals array
function loadnormals() {
   return(normals);
}


	// texture coordinates
function loadtextcoords() {
       return(textureCoords);
}


	// load vertex indices
function loadvertexindices() {
   return(indices);
}


	// texture array size and data
function loadwidth() {
   return 2;
}

function loadheight() {
   return 2;
}

	// using a fixed texture map to colour object
function loadtexture() {
   return( new Uint8Array([128,128,128,255,
                                128,128,128,255,
                                128,128,128,255,
                                128,128,128,255]) );

}

