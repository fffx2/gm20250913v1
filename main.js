document.addEventListener('DOMContentLoaded', () => {
    const deviceSelect = document.getElementById('device-select');
    const osSelect = document.getElementById('os-select');
    const starterKitDiv = document.getElementById('starter-kit');
    const kitList = document.getElementById('kit-list');

    let projectData = {};

    // 1. 데이터 로드 및 드롭다운 초기화
    fetch('project-data.json')
        .then(response => response.json())
        .then(data => {
            projectData = data;
            if (projectData.devices) {
                projectData.devices.forEach((device, index) => {
                    const option = document.createElement('option');
                    option.value = index;
                    option.textContent = device.name;
                    deviceSelect.appendChild(option);
                });
            }
        })
        .catch(error => console.error('Error fetching project data:', error));

    // 2. 디바이스 선택 시 OS 드롭다운 업데이트
    deviceSelect.addEventListener('change', () => {
        osSelect.innerHTML = '<option value="">-- 2. OS/플랫폼 선택 --</option>';
        osSelect.disabled = true;
        starterKitDiv.classList.remove('visible'); // Hide with animation

        const deviceIndex = deviceSelect.value;
        if (deviceIndex !== "") {
            const selectedDevice = projectData.devices[deviceIndex];
            if (selectedDevice && selectedDevice.os) {
                selectedDevice.os.forEach((os, index) => {
                    const option = document.createElement('option');
                    option.value = index;
                    option.textContent = os.name;
                    osSelect.appendChild(option);
                });
                osSelect.disabled = false;
            }
        }
    });

    // 3. OS 선택 시 AI 스타터킷 표시 (✨ 애니메이션 적용)
    osSelect.addEventListener('change', () => {
        const deviceIndex = deviceSelect.value;
        const osIndex = osSelect.value;

        // 먼저 카드를 숨겨서 애니메이션을 다시 트리거할 준비를 합니다.
        starterKitDiv.classList.remove('visible');
        starterKitDiv.classList.add('hidden');

        if (deviceIndex !== "" && osIndex !== "") {
            const guidelines = projectData.devices[deviceIndex].os[osIndex].guidelines;
            kitList.innerHTML = `
                <li><strong>추천 폰트:</strong> ${guidelines.font}</li>
                <li><strong>최소 본문 크기:</strong> ${guidelines.minBodySize}</li>
                <li><strong>추천 행간:</strong> ${guidelines.lineHeight}</li>
                <li><strong>명도 대비 기준:</strong> ${guidelines.contrastRatio}</li>
            `;
            // 약간의 딜레이 후 'visible' 클래스를 추가하여 fade-in 효과를 보여줍니다.
            setTimeout(() => {
                starterKitDiv.classList.remove('hidden'); // display: block으로 만듦
                setTimeout(() => {
                    starterKitDiv.classList.add('visible'); // fade-in 애니메이션 트리거
                }, 10);
            }, 100); // Reset animation state
            
        }
    });
});
