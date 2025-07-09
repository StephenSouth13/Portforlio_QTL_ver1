// scene-3d.js
// Quản lý toàn bộ cảnh 3D và các đối tượng động một cách mượt mà và liên tục

let scene, camera, renderer, starField, gltfLoader, controls;
let mouseX = 0, mouseY = 0;

// Mảng lưu trữ các đối tượng cần được di chuyển và xoay
const animatedObjects = [];

export function initThreeScene(THREE, GLTFLoaderClass, OrbitControlsClass) {
    gltfLoader = new GLTFLoaderClass();

    // 1. Khởi tạo Scene
    scene = new THREE.Scene();
    // Thay vì FogExp2, sử dụng Fog để kiểm soát tốt hơn khoảng cách nhìn thấy
    scene.fog = new THREE.Fog(0x080a1c, 50, 400); // Màu, gần, xa

    // 2. Khởi tạo Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 15); // Đặt camera gần hơn một chút
    camera.lookAt(scene.position);

    // 3. Khởi tạo Renderer
    renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('backgroundCanvas'),
        antialias: true,
        alpha: true // Cho phép nền trong suốt để CSS background-color hoạt động nếu cần
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true; // Kích hoạt đổ bóng (nếu mô hình và ánh sáng hỗ trợ)

    // 4. Ánh sáng
    const ambientLight = new THREE.AmbientLight(0x404040, 2); // Ánh sáng môi trường
    scene.add(ambientLight);

    // Ánh sáng định hướng chính (mạnh hơn, tạo bóng)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(50, 50, 50).normalize(); // Đặt xa hơn và normalize
    directionalLight.castShadow = true; // Bật đổ bóng
    directionalLight.shadow.mapSize.width = 1024; // Độ phân giải bóng
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 500;
    directionalLight.shadow.camera.left = -100;
    directionalLight.shadow.camera.right = 100;
    directionalLight.shadow.camera.top = 100;
    directionalLight.shadow.camera.bottom = -100;
    scene.add(directionalLight);

    // Thêm một ánh sáng phụ để các mặt khác không quá tối
    const pointLight = new THREE.PointLight(0x00e6ff, 1, 100); // Màu neon xanh
    pointLight.position.set(-20, 10, 20);
    scene.add(pointLight);

    // 5. Thêm OrbitControls (Tùy chọn: chỉ dùng để phát triển)
    // RẤT QUAN TRỌNG: Comment dòng này lại khi triển khai sản phẩm để người dùng không thể di chuyển cảnh 3D
    controls = new OrbitControlsClass(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.maxPolarAngle = Math.PI / 2; // Giới hạn góc nhìn lên/xuống

    // 6. Thêm trường sao (Starfield)
    function addStarfield() {
        const vertices = [];
        const numStars = 10000; // Tăng số lượng sao
        const starFieldRadius = 1500; // Bán kính trường sao

        for (let i = 0; i < numStars; i++) {
            // Tạo sao trong hình cầu
            const x = THREE.MathUtils.randFloatSpread(starFieldRadius * 2);
            const y = THREE.MathUtils.randFloatSpread(starFieldRadius * 2);
            const z = THREE.MathUtils.randFloatSpread(starFieldRadius * 2);
            vertices.push(x, y, z);
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

        const material = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.8, // Kích thước sao
            map: new THREE.TextureLoader().load('assets/images/star.png'), // Đảm bảo đường dẫn này đúng
            transparent: true,
            blending: THREE.AdditiveBlending, // Hiệu ứng sáng hơn khi chồng lên nhau
            sizeAttenuation: true // Sao xa hơn sẽ nhỏ hơn
        });

        starField = new THREE.Points(geometry, material);
        scene.add(starField);
    }
    addStarfield();

    // 7. Tải các mô hình 3D thực tế từ assets/models/
    // Hàm chung để tải và thêm mô hình GLB với thông số chuyển động và đặt lại vị trí
    function loadAndAnimateModel(path, config) {
        gltfLoader.load(path, (gltf) => {
            const model = gltf.scene;
            
            // Duyệt qua tất cả các mesh con để áp dụng đổ bóng và kiểm tra vật liệu
            model.traverse((node) => {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = true; // Các vật thể có thể nhận bóng từ nhau
                    
                    // Nếu vật liệu là PBR, bạn có thể tinh chỉnh thêm
                    if (node.material.isMeshStandardMaterial || node.material.isMeshPhysicalMaterial) {
                        node.material.roughness = Math.max(0.5, node.material.roughness || 0.7); // Đảm bảo độ nhám vừa phải
                        node.material.metalness = node.material.metalness || 0; // Đảm bảo độ kim loại không quá cao nếu không phải kim loại
                    }
                }
            });

            // Đặt vị trí, tỉ lệ và xoay ban đầu
            model.position.copy(config.initialPosition);
            model.scale.copy(config.scale);
            model.rotation.set(config.rotation.x, config.rotation.y, config.rotation.z);
            
            scene.add(model);

            animatedObjects.push({
                object: model,
                initialPosition: config.initialPosition.clone(), // Lưu trữ vị trí ban đầu
                velocity: config.velocity.clone(), // Vận tốc
                rotationSpeed: config.rotationSpeed, // Tốc độ xoay
                resetZ: config.resetZ || -200, // Z khi reset (rất xa phía sau)
                resetRangeX: config.resetRangeX || 100, // Phạm vi X khi reset
                resetRangeY: config.resetRangeY || 100, // Phạm vi Y khi reset
                minScale: config.scale.x * 0.8, // Để vật thể nhỏ hơn khi reset và lớn dần lên
                maxScale: config.scale.x * 1.2,
                currentScale: config.scale.x // Lưu trữ scale hiện tại
            });
            console.log(`Mô hình ${path} đã được tải thành công.`);
        }, undefined, (error) => {
            console.error(`Lỗi khi tải mô hình ${path}:`, error);
        });
    }

    // --- Cấu hình các mô hình 3D và chuyển động của chúng ---

    // Phi thuyền (spaceship.glb): Bay lướt qua màn hình, hơi xoay
    loadAndAnimateModel(
        'assets/models/spaceship.glb',
        {
            initialPosition: new THREE.Vector3(-80, 15, -150),
            scale: new THREE.Vector3(0.2, 0.2, 0.2),
            rotation: new THREE.Vector3(0, Math.PI / 4, 0),
            velocity: new THREE.Vector3(0.1, -0.02, 0.08), // Bay từ trái sang phải, hơi xuống, tiến về phía trước
            rotationSpeed: 0.005,
            resetZ: -200,
            resetRangeX: 150,
            resetRangeY: 50
        }
    );

    // Trái Đất (earth.glb): Một hành tinh lớn ở phía xa, xoay chậm
    loadAndAnimateModel(
        'assets/models/earth.glb',
        {
            initialPosition: new THREE.Vector3(40, -30, -250),
            scale: new THREE.Vector3(7, 7, 7),
            rotation: new THREE.Vector3(0, 0, 0),
            velocity: new THREE.Vector3(0, 0, 0), // Không di chuyển, chỉ xoay
            rotationSpeed: 0.0005 // Xoay cực chậm
        }
    );

    // Sao Hỏa (mars.glb): Một hành tinh khác ở cự ly trung bình
    loadAndAnimateModel(
        'assets/models/mars.glb',
        {
            initialPosition: new THREE.Vector3(-50, 20, -300),
            scale: new THREE.Vector3(8, 8, 8),
            rotation: new THREE.Vector3(Math.PI / 8, 0, 0),
            velocity: new THREE.Vector3(0, 0, 0), // Không di chuyển, chỉ xoay
            rotationSpeed: 0.0007
        }
    );
    
    // Lỗ đen (black_hole.glb): Vị trí trung tâm và ở rất xa, xoay tạo cảm giác hút
    // Nếu mô hình của bạn đơn giản, nó sẽ chỉ xoay. Để hiệu ứng hút, bạn cần shaders phức tạp.
    loadAndAnimateModel(
        'assets/models/black_hole.glb',
        {
            initialPosition: new THREE.Vector3(0, 0, -400),
            scale: new THREE.Vector3(25, 25, 25), // Kích thước lớn hơn nữa
            rotation: new THREE.Vector3(0, 0, 0),
            velocity: new THREE.Vector3(0, 0, 0), // Không di chuyển, chỉ xoay
            rotationSpeed: 0.001 // Tốc độ xoay vừa phải
        }
    );

    // Thêm các vật thể bay ngẫu nhiên nhỏ (ví dụ: thiên thạch nhỏ, mảnh vỡ)
    // Để tạo cảm giác 3D động liên tục
    for (let i = 0; i < 10; i++) {
        const randomScale = THREE.MathUtils.randFloat(0.05, 0.5);
        loadAndAnimateModel(
            'assets/models/spaceship.glb', // Có thể tái sử dụng mô hình nhỏ hoặc dùng mô hình thiên thạch
            {
                initialPosition: new THREE.Vector3(
                    THREE.MathUtils.randFloatSpread(200), // Phạm vi x lớn
                    THREE.MathUtils.randFloatSpread(200), // Phạm vi y lớn
                    THREE.MathUtils.randFloat(-300, -50)  // Khởi tạo xa và không quá gần
                ),
                scale: new THREE.Vector3(randomScale, randomScale, randomScale),
                rotation: new THREE.Vector3(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI),
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.05, // Vận tốc x ngẫu nhiên
                    (Math.random() - 0.5) * 0.05, // Vận tốc y ngẫu nhiên
                    Math.random() * 0.1 + 0.05 // Luôn tiến về phía trước (Z dương)
                ),
                rotationSpeed: (Math.random() - 0.5) * 0.02,
                resetZ: -400, // Đặt lại rất xa khi đi qua camera
                resetRangeX: 200,
                resetRangeY: 200
            }
        );
    }


    // --- Animation Loop ---
    function animate() {
        requestAnimationFrame(animate);

        // Cập nhật OrbitControls (nếu đang dùng)
        if (controls) {
            controls.update();
        }

        // Xoay trường sao (chậm rãi)
        starField.rotation.y += 0.0002;
        starField.rotation.x += 0.0001;

        // Cập nhật vị trí và xoay của các đối tượng 3D
        animatedObjects.forEach(item => {
            if (item.object) { // Đảm bảo object đã được tải
                item.object.rotation.y += item.rotationSpeed;
                item.object.position.add(item.velocity);

                // Kiểm tra nếu đối tượng đi quá gần camera, reset vị trí
                if (item.object.position.z > camera.position.z + 10) { // Đi quá phía trước camera
                    item.object.position.set(
                        THREE.MathUtils.randFloatSpread(item.resetRangeX),
                        THREE.MathUtils.randFloatSpread(item.resetRangeY),
                        item.resetZ // Đặt lại ở phía rất xa
                    );
                    // Ngẫu nhiên hóa vận tốc và tốc độ xoay một chút khi reset
                    if (item.velocity.z > 0) { // Chỉ ngẫu nhiên hóa nếu nó là vật thể bay tới
                        item.velocity.x = (Math.random() - 0.5) * 0.05;
                        item.velocity.y = (Math.random() - 0.5) * 0.05;
                        item.velocity.z = Math.random() * 0.1 + 0.05;
                    }
                    item.rotationSpeed = (Math.random() - 0.5) * 0.02;
                    
                    // Thay đổi kích thước một chút khi reset (nếu là các vật thể nhỏ ngẫu nhiên)
                    if (item.minScale && item.maxScale) {
                        item.currentScale = THREE.MathUtils.randFloat(item.minScale, item.maxScale);
                        item.object.scale.set(item.currentScale, item.currentScale, item.currentScale);
                    }
                }
            }
        });

        // Điều khiển camera theo chuyển động chuột (tạo hiệu ứng parallax nhẹ)
        // Camera sẽ dịch chuyển nhẹ theo chuột nhưng luôn nhìn về trung tâm
        camera.position.x += (mouseX * 0.05 - camera.position.x) * 0.01;
        camera.position.y += (-mouseY * 0.05 - camera.position.y) * 0.01;
        camera.lookAt(scene.position); // Đảm bảo camera luôn hướng về gốc tọa độ

        renderer.render(scene, camera);
    }

    // --- Event Listeners ---
    window.addEventListener('resize', onWindowResize);
    document.addEventListener('mousemove', onDocumentMouseMove);

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function onDocumentMouseMove(event) {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    // Bắt đầu vòng lặp hoạt ảnh
    animate();

    console.log("Three.js Scene đã được khởi tạo và đang chạy với hiệu ứng 3D động!");
}