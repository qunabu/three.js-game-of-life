var renderer, scene, camera, stats;
var sphere;
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var SQUARE = 10;

var state = gof(randomArray());

init();
animate();

function init() {
    camera = new THREE.PerspectiveCamera(40, WIDTH / HEIGHT, 1, 10000);
    camera.position.z = 3000;
    scene = new THREE.Scene();
    var amount = ROWS * COLS;
    SQUARE = WIDTH / ROWS;
    var radius = 200;
    var positions = new Float32Array(amount * 3);
    var colors = new Float32Array(amount * 3);
    var sizes = new Float32Array(amount);
    //var visible = new Float32Array(amount);
    var vertex = new THREE.Vector3();
    var color = new THREE.Color(0xffffff);
    var i = 0;
    for (var x=0; x<COLS; x++) {
        for (var y=0; y<ROWS; y++) {
            vertex.x = SQUARE * x - WIDTH / 2; 
            vertex.y = SQUARE * y - WIDTH / 2;
            vertex.z = (Math.random() * 2 - 1) * radius;
            vertex.z = 0;
            vertex.toArray(positions, i * 3);
            if (vertex.x < 0) {
                //color.setHSL(0.5 + 0.1 * (i / amount), 0.7, 0.5);
            } else {
                //color.setHSL(0.0 + 0.1 * (i / amount), 0.9, 0.5);
            }
            color.toArray(colors, i * 3);
            sizes[i] = SQUARE + 100;
            //visible[i] = 0;
            i++;
        }
    }

    var geometry = new THREE.BufferGeometry();
    geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.addAttribute('customColor', new THREE.BufferAttribute(colors, 3));
    geometry.addAttribute('size', new THREE.BufferAttribute(sizes, 1));
    //geometry.addAttribute('visible', new THREE.BufferAttribute(visible, 1));
    //
    var material = new THREE.ShaderMaterial({
        uniforms: {
            amplitude: {
                value: 1.0
            },
            color: {
                value: new THREE.Color(0xffffff)
            },
            texture: {
                value: new THREE.TextureLoader().load("pixel.png")
            }
        },
        vertexShader: `
        uniform float amplitude;
        attribute float size;
        attribute vec3 customColor;
        varying vec3 vColor;
        void main() {
            vColor = customColor;
            vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
            gl_PointSize = size * ( 300.0 / -mvPosition.z );
            gl_Position = projectionMatrix * mvPosition;
        }`,

        fragmentShader: `
        uniform vec3 color;
        uniform sampler2D texture;
        varying vec3 vColor;
        void main() {
            gl_FragColor = vec4( color * vColor, 1.0 );
            gl_FragColor = gl_FragColor * texture2D( texture, gl_PointCoord );
        }        
        `,

        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true
    });
    //
    sphere = new THREE.Points(geometry, material);
    scene.add(sphere);
    //
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(WIDTH, HEIGHT);
    var container = document.getElementById('gof');
    container.appendChild(renderer.domElement);
    //stats = new Stats();
    //container.appendChild(stats.dom);
    //
    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    render();
    state = gof(state);
    //stats.update();
}

function render() {
    var time = Date.now() * 0.005;
    sphere.rotation.z = 0.01 * time;
    var geometry = sphere.geometry;
    var attributes = geometry.attributes;
    var i = 0;
    state.forEach((col,x) => {
        col.forEach((row,y) => {
            attributes.size.array[i] = row == 1 ? SQUARE + 100: 0 ;
            i++;
        });
    });
    //for (var i = 0; i < attributes.size.array.length; i++) {
        //attributes.size.array[i] = 14 + 13 * Math.sin(0.1 * i + time);
        //attributes.size.array[i] = Math.random() > 0.9 ? SQUARE: 0 ;
    //}
    attributes.size.needsUpdate = true;
    renderer.render(scene, camera);
}