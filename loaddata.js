
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
	// these are set in the index.html file
let imageData = [];
let imageHeight = 0;
let imageWidth = 0;
let imageDepth = 0;

	// global geometry arrays
	// you need set these
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


	// pick the larger of height or width and use that to calculate
	//    x and z step size
	// calculate step size for x and z values


	// calculate vertex array for height map
	// calculate normals for height map


	// set the vertexCount equal to the number of vertices


	// create the indices[] array 
	// if vertices[] contains all of the values generated from the
	//    image (including duplicates) then the number of indices is the
	//    (height-1) * (width-1) of the image * the number of vertices
	//    neede to create two triangles (6)
	// the indices[] array will contain the values from 0 to the
	//    number of indices - 1


	// load textures coordinates, currently use same texture for colour
	//    for all points
	// you don't need to change this code but you do need to set
	//     numberIndices to the number of indices 
    for (let i=0; i<(numberIndices/3); i++) {
       textureCoords.push(0.0,0.0,  1.0,0.0,   1.0,1.0,);
    }

}


/* you don't need to change anything past this point
   the following functions return the geometry information
*/


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

