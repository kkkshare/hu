/**
 * 颜体书法练习 v2.0 - 核心逻辑 (SVG 矢量版)
 * 1. 放弃所有图片资源，使用 SVG 绘制米字格。
 * 2. 使用 WebFont 实现汉字显示。
 * 3. 锁死 ViewBox 确保任何屏幕下比例一致。
 */

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const resultContainer = document.getElementById('resultContainer');
    const fullscreenOverlay = document.getElementById('fullscreenOverlay');
    const fullscreenContent = document.getElementById('fullscreenContent');
    const fullscreenCharTitle = document.getElementById('fullscreenChar');
    const closeFullscreen = document.getElementById('closeFullscreen');

    // 搜索逻辑
    const performSearch = () => {
        const text = searchInput.value.trim();
        if (!text) return;

        resultContainer.innerHTML = ''; // 清空
        
        [...text].forEach(char => {
            const card = createCharCard(char);
            resultContainer.appendChild(card);
        });
    };

    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });

    /**
     * 创建汉字卡片 (基于 SVG)
     */
    function createCharCard(char) {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-3xl shadow-md p-6 cursor-pointer hover:shadow-xl transition-all border border-gray-100';
        
        const svgWrapper = document.createElement('div');
        svgWrapper.className = 'svg-container';
        svgWrapper.innerHTML = generateMiZiGeSVG(char);
        
        card.appendChild(svgWrapper);
        
        // 点击进入全屏
        card.onclick = () => openFullscreen(char);
        
        return card;
    }

    /**
     * 生成米字格 SVG
     * @param {string} char 汉字
     * @param {boolean} isFull 是否为全屏模式
     */
    function generateMiZiGeSVG(char, isFull = false) {
        const size = 1000;
        const center = size / 2;
        const color = 'var(--mi-color)';
        const charColor = 'var(--char-color)';
        
        return `
            <svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
                <!-- 边框 -->
                <rect x="10" y="10" width="${size-20}" height="${size-20}" fill="none" stroke="${color}" stroke-width="8" />
                <!-- 米字线条 -->
                <line x1="10" y1="10" x2="${size-10}" y2="${size-10}" stroke="${color}" stroke-width="2" stroke-dasharray="10,10" />
                <line x1="${size-10}" y1="10" x2="10" y2="${size-10}" stroke="${color}" stroke-width="2" stroke-dasharray="10,10" />
                <line x1="${center}" y1="10" x2="${center}" y2="${size-10}" stroke="${color}" stroke-width="2" stroke-dasharray="10,10" />
                <line x1="10" y1="${center}" x2="${size-10}" y2="${center}" stroke="${color}" stroke-width="2" stroke-dasharray="10,10" />
                
                <!-- 汉字本体 -->
                <text x="${center}" y="${center + 350}" 
                    text-anchor="middle" 
                    fill="${charColor}" 
                    style="font-family: 'YanTi', serif; font-size: 850px; font-weight: normal;">
                    ${char}
                </text>
            </svg>
        `;
    }

    /**
     * 全屏临摹模式
     */
    function openFullscreen(char) {
        fullscreenContent.innerHTML = generateMiZiGeSVG(char, true);
        fullscreenCharTitle.innerText = `颜体临摹：${char}`;
        fullscreenOverlay.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // 禁止背景滚动
    }

    closeFullscreen.onclick = () => {
        fullscreenOverlay.style.display = 'none';
        document.body.style.overflow = '';
    };
});
