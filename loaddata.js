
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
	console.log("H: " + height, "w: " + width);

	// calculate vertex array for height map
	calculateVertices(height,width);

	// calculate surface normals for height map
	calculateSurfaceNormals();

	// calculate vertex normals for height map
	calculateVertexNormals(getMax(height,width));
	
	// set the vertexCount equal to the number of indices
	vertexCount = indices.length;

	
	
	
	// load textures coordinates, currently use same texture for colour
	//    for all points
    for (let i=0; i<(vertexCount/3); i++) {
       textureCoords.push(0.0,0.0,  1.0,0.0,   1.0,1.0,);
    }
}

	// finds the height
function getHeight() {
	let max = 0;

	for(let row = 0; row < imageData.length; row++) {
		if(imageData[row][0] > max) {
			max = imageData[row][0];
		}
	}

	return max;
}

	// finds the width 
function getWidth() {
	let max = 0;

	for(let row = 0; row < imageData.length; row++) {
		if(imageData[row][1] > max) {
			max = imageData[row][1];
		}
	}

	return max;
}

	// calculates step size
function getStepSize(height, width) {
	if(height > width)
		return 1.0 / height;
	else
		return 1.0 / width;
}

	// gets the max of height and width
function getMax(height, width) {
	if(height > width)
		return height;
	else
		return width;
}

	// calculates all of the vertices
function calculateVertices(height,width) {
	// calculate step size for x and z values
	let stepSize = getStepSize(height,width);
	let index = 0;

	for(let row = 0; row < height; row++){
		for(let col = 0; col < width; col++) {	
		// triangle 1
			// x1 value
			vertices.push((row * stepSize) - 0.5);
			// y1 value
			vertices.push((parseFloat(getFromArray(row,col)) / imageDepth)*0.3); //scale y value by image depth and then again by 0.3
			// z1 value
			vertices.push((col * stepSize) - 0.5);

			indices.push(index + 0);

			// x2 value
			vertices.push((row * stepSize) - 0.5);
			// y2 value
			vertices.push((parseFloat(getFromArray(row,col+1)) / imageDepth)*0.3); //scale y value by image depth and then again by 0.3
			// z2 value
			vertices.push(((col + 1) * stepSize) - 0.5);

			indices.push(index + 1);

			// x3 value
			vertices.push(((row + 1) * stepSize) - 0.5);
			// y3 value
			vertices.push((parseFloat(getFromArray(row+1,col+1)) / imageDepth)*0.3); //scale y value by image depth and then again by 0.3
			// z3 value
			vertices.push(((col + 1) * stepSize) - 0.5);

			indices.push(index + 2);

		// triangle 2
			// x1 value
			vertices.push(((row + 1) * stepSize) - 0.5);
			// y1 value
			vertices.push((parseFloat(getFromArray(row+1,col+1)) / imageDepth)*0.3); //scale y value by image depth and then again by 0.3
			// z1 value
			vertices.push(((col + 1) * stepSize) - 0.5);

			indices.push(index + 3);

			// x2 value
			vertices.push(((row + 1) * stepSize) - 0.5);
			// y2 value
			vertices.push((parseFloat(getFromArray(row+1,col)) / imageDepth)*0.3); //scale y value by image depth and then again by 0.3
			// z2 value
			vertices.push((col * stepSize) - 0.5);

			indices.push(index + 4);

			// x3 value
			vertices.push((row * stepSize) - 0.5);
			// y3 value
			vertices.push((parseFloat(getFromArray(row,col)) / imageDepth)*0.3); //scale y value by image depth and then again by 0.3
			// z3 value
			vertices.push((col * stepSize) - 0.5);

			indices.push(index + 5);	
			index += 3;
		}
	}	
}

	// gets y value from the imageData array for a given x and z
function getFromArray(x,z) {
	for(let row = 0; row < imageData.length; row++){
		if(imageData[row][0] == x && imageData[row][1] == z) {
			return imageData[row][2];
		}
	}

	return 0;
}

	// calculates the surface normals
function calculateSurfaceNormals() {
	let surfaceNormals = [];

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
		
		// create two vectors from the vertices
		let vector1 = [(vertice1x - vertice2x), (vertice1y - vertice2y), (vertice1z - vertice2z)];
		let vector2 = [(vertice3x - vertice2x), (vertice3y - vertice2y), (vertice3z - vertice2z)];

		// calculate the cross product
		let crossProduct = ([((vector1[1] * vector2[2]) - (vector1[2] * vector2[1])), 
							 ((vector1[2] * vector2[0]) - (vector1[0] * vector2[2])), 
							 ((vector1[0] * vector2[1]) - (vector1[1] * vector2[0])) ]);

		// use Pythagorean theorem to calculate length
		let crossProductLength = Math.sqrt((crossProduct[0] * crossProduct[0]) + 
										   (crossProduct[1] * crossProduct[1]) + 
										   (crossProduct[2] * crossProduct[2]) );
		
		// divide cross product by the length to convert it to a unit normal
		crossProduct[0] /= crossProductLength;
		crossProduct[1] /= crossProductLength;
		crossProduct[2] /= crossProductLength;
		
		// multiply by -1
		crossProduct[0] *= -1;
		crossProduct[1] *= -1;
		crossProduct[2] *= -1;

		//add to normals array for each vertex
		surfaceNormals.push(crossProduct[0]);
		surfaceNormals.push(crossProduct[1]);
		surfaceNormals.push(crossProduct[2]);

		surfaceNormals.push(crossProduct[0]);
		surfaceNormals.push(crossProduct[1]);
		surfaceNormals.push(crossProduct[2]);

		surfaceNormals.push(crossProduct[0]);
		surfaceNormals.push(crossProduct[1]);
		surfaceNormals.push(crossProduct[2]);
	}

	return surfaceNormals;
}

	// calculates the vertex normals
function calculateVertexNormals(max) {
	let surfaceNormals = calculateSurfaceNormals();
	
	for(let i = 0; i < vertices.length; i += 3){
		let sharedNormals = [];

		for(let j = i; vertices[j] <= max ; j += 3){
			// if we find a shared vertex 
			if(vertices[j] == vertices[i] && vertices[j+1] == vertices[i + 1] && vertices[j + 2] == vertices[i + 2]) {
				sharedNormals.push([surfaceNormals[j],surfaceNormals[j+1],surfaceNormals[j+2]]);
			}
		}

		// calculate average normal
		let nx = 0;
		let ny = 0;
		let nz = 0;

		for(let k = 0; k < sharedNormals.length; k++) {
			nx += sharedNormals[k][0];
			ny += sharedNormals[k][1];
			nz += sharedNormals[k][2];
		}

		nx /= sharedNormals.length;
		ny /= sharedNormals.length;
		nz /= sharedNormals.length;
		
		normals.push(nx);
		normals.push(ny);
		normals.push(nz);
	}
	console.log(imageData);
	console.log(vertices);
	console.log(surfaceNormals);
	console.log(normals);
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

