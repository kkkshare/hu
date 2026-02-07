document.addEventListener('DOMContentLoaded', () => {
    const charInput = document.getElementById('charInput');
    const searchBtn = document.getElementById('searchBtn');
    const resultContainer = document.getElementById('resultContainer');
    const detailModal = document.getElementById('detailModal');
    const closeModal = document.getElementById('closeModal');
    const modalImg = document.getElementById('modalImg');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');

    // 颜体字库数据 (多宝塔碑部分常用字)
    const duobaotaDb = {
        '永': { 
            img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Yan_Zhenqing_001.jpg/200px-Yan_Zhenqing_001.jpg', 
            desc: '出自《多宝塔碑》，起笔圆润，侧锋转折有力。' 
        },
        '和': { 
            img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Yan_Zhenqing_002.jpg/200px-Yan_Zhenqing_002.jpg', 
            desc: '左侧“禾”字收放有度，右侧“口”字稳重。' 
        },
        '九': { 
            img: 'https://shufazidian.com/images/yanzhenqing/duobaota/jiu.jpg',
            desc: '撇画舒展，横折弯钩转折圆劲。' 
        },
        '年': { 
            img: 'https://shufazidian.com/images/yanzhenqing/duobaota/nian.jpg',
            desc: '横画排叠整齐，中竖力透纸背。' 
        },
        '多': {
            img: 'https://shufazidian.com/images/yanzhenqing/duobaota/duo.jpg',
            desc: '上下两个“夕”字重心对齐，撇画厚重。'
        },
        '宝': {
            img: 'https://shufazidian.com/images/yanzhenqing/duobaota/bao.jpg',
            desc: '宝盖头覆盖全字，内部“玉”字精炼。'
        },
        '塔': {
            img: 'https://shufazidian.com/images/yanzhenqing/duobaota/ta.jpg',
            desc: '左窄右宽，右侧“答”字重心稳固。'
        },
        '碑': {
            img: 'https://shufazidian.com/images/yanzhenqing/duobaota/bei.jpg',
            desc: '石字旁挺拔，右侧笔画穿插自然。'
        },
        '大': {
            img: 'https://shufazidian.com/images/yanzhenqing/duobaota/da.jpg',
            desc: '横画平稳，撇捺舒展，尽显大唐气度。'
        },
        '唐': {
            img: 'https://shufazidian.com/images/yanzhenqing/duobaota/tang.jpg',
            desc: '结构严谨，上部覆盖感强，下部稳健。'
        },
        '西': {
            img: 'https://shufazidian.com/images/yanzhenqing/duobaota/xi.jpg',
            desc: '方正厚重，内部撇点呼应。'
        },
        '京': {
            img: 'https://shufazidian.com/images/yanzhenqing/duobaota/jing.jpg',
            desc: '点画有力，横钩利落，下部支撑稳固。'
        },
        '龙': {
            img: 'https://shufazidian.com/images/yanzhenqing/duobaota/long.jpg',
            desc: '撇折灵动，右侧竖弯钩雄劲有力。'
        },
        '兴': {
            img: 'https://shufazidian.com/images/yanzhenqing/duobaota/xing.jpg',
            desc: '上部错落有致，下部撇点支撑有力。'
        },
        '寺': {
            img: 'https://shufazidian.com/images/yanzhenqing/duobaota/si.jpg',
            desc: '上下比例协调，横画长短变化丰富。'
        },
        '僧': {
            img: 'https://shufazidian.com/images/yanzhenqing/duobaota/seng.jpg',
            desc: '单人旁挺拔，右侧部分笔画密集而有序。' 
        },
        '一': {
            img: 'https://shufazidian.com/images/yanzhenqing/duobaota/yi.jpg',
            desc: '虽只有一横，但起笔、行笔、收笔交代得极其清楚，力透纸背。'
        },
        '心': {
            img: 'https://shufazidian.com/images/yanzhenqing/duobaota/xin.jpg',
            desc: '卧钩圆劲，三点位置错落有致，意态生动。'
        },
        '月': {
            img: 'https://shufazidian.com/images/yanzhenqing/duobaota/yue.jpg',
            desc: '外框稳健，内部两横平齐，体现了颜体宽博的特点。'
        }
    };

    // 简繁转换词库 (书法常用字扩充)
    const s2tDict = {
        '兴': '興', '旺': '旺', '发': '發', '达': '達',
        '国': '國', '爱': '愛', '书': '書', '法': '法', '颜': '顔', '真': '眞', '唐': '唐',
        '宝': '寶', '年': '年', '九': '九', '永': '永', '和': '和', '多': '多', '塔': '塔', '碑': '碑',
        '龙': '龍', '寺': '寺', '僧': '僧', '京': '京', '西': '西', '大': '大',
        '一': '一', '心': '心', '月': '月', '门': '門', '无': '無', '时': '時',
        '开': '開', '礼': '禮', '广': '廣', '万': '萬', '义': '義', '见': '見',
        '云': '雲', '气': '氣', '华': '華', '东': '東', '后': '後', '当': '當'
    };

    function searchChars() {
        const input = charInput.value.trim();
        if (!input) return;

        resultContainer.innerHTML = '';
        const chars = input.split('');
        
        chars.forEach(char => {
            // 优先转繁体，确保书法练习的严谨性
            const searchChar = s2tDict[char] || char;
            const data = duobaotaDb[searchChar];

            const charCard = document.createElement('div');
            charCard.className = 'flex flex-col items-center group cursor-pointer';
            
            // 创建容器
            const gridBox = document.createElement('div');
            gridBox.className = 'mi-zi-ge w-full aspect-square max-w-[140px] md:max-w-[160px] bg-white flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105 shadow-md relative';
            
            // 模拟模式强制使用繁体字体展示
            const fontChar = document.createElement('div');
            fontChar.className = 'calligraphy-font';
            fontChar.innerText = searchChar; // 这里已经是繁体了
            gridBox.appendChild(fontChar);

            // 来源标签
            const tag = document.createElement('span');
            tag.className = 'source-tag ' + (data ? 'tag-authentic' : 'tag-simulated');
            tag.innerText = data ? '真迹' : '模拟';
            gridBox.appendChild(tag);

            if (data && data.img) {
                const img = document.createElement('img');
                img.src = data.img;
                img.alt = searchChar;
                img.className = 'char-img w-full h-full object-contain absolute inset-0 opacity-0 transition-opacity duration-300';
                
                img.onload = () => {
                    img.classList.remove('opacity-0');
                    fontChar.style.display = 'none';
                };
                
                img.onerror = () => {
                    console.log(`图片加载失败: ${searchChar}`);
                    img.remove();
                };
                
                gridBox.appendChild(img);
            }

            charCard.appendChild(gridBox);
            
            const title = document.createElement('span');
            title.className = 'mt-3 text-lg font-bold text-amber-900';
            title.innerText = searchChar;
            charCard.appendChild(title);

            const subtitle = document.createElement('span');
            subtitle.className = 'text-xs text-gray-400';
            subtitle.innerText = data ? '颜真卿 · 多宝塔碑' : '书法模拟 (颜体风)';
            charCard.appendChild(subtitle);

            charCard.onclick = () => showDetail(searchChar, data || { desc: '当前为书法模拟效果。丸子正在为您搜集更多《多宝塔碑》原碑高清切图。' });
            resultContainer.appendChild(charCard);
        });
    }

    function showDetail(char, data) {
        modalTitle.innerText = `颜真卿 · ${char}`;
        modalDesc.innerText = data.desc;
        
        const modalImgContainer = document.getElementById('modalImgContainer');
        modalImgContainer.innerHTML = '';
        
        // 清理旧的详情页标签
        const existingTag = document.querySelector('#copyStage .source-tag');
        if (existingTag) existingTag.remove();
        
        const fontChar = document.createElement('div');
        fontChar.className = 'calligraphy-font';
        fontChar.innerText = char;
        modalImgContainer.appendChild(fontChar);

        // 详情页来源标签
        const tag = document.createElement('span');
        tag.className = 'source-tag ' + (data.img ? 'tag-authentic' : 'tag-simulated');
        tag.style.top = '12px';
        tag.style.right = '12px';
        tag.style.fontSize = '14px';
        tag.innerText = data.img ? '颜真卿 · 真迹原帖' : '书法 AI 模拟 (颜体风)';
        document.getElementById('copyStage').appendChild(tag);

        if (data && data.img) {
            const img = document.createElement('img');
            img.src = data.img;
            img.className = 'char-img w-full h-full object-contain absolute inset-0 opacity-0 transition-opacity';
            img.id = 'currentCharImg'; // 为透明度调节设置ID
            
            img.onload = () => {
                img.classList.remove('opacity-0');
                fontChar.style.display = 'none';
                // 重置透明度滑块
                document.getElementById('opacitySlider').value = 1;
            };
            modalImgContainer.appendChild(img);
        }

        detailModal.classList.remove('hidden');
    }

    // 暴露给全局的格线切换函数
    window.setGrid = (type) => {
        const copyStage = document.getElementById('copyStage');
        // 保持响应式基础类名
        copyStage.className = 'mi-zi-ge w-full aspect-square max-w-[300px] md:max-w-[384px] bg-white mb-4 md:mb-6 flex items-center justify-center overflow-hidden relative shadow-inner';
        
        if (type === 'mi') copyStage.classList.add('mi-zi-ge');
        else if (type === 'tian') copyStage.classList.add('tian-zi-ge');
        else if (type === 'none') {
            copyStage.classList.remove('mi-zi-ge');
            copyStage.classList.add('no-grid');
        }

        // 更新按钮样式
        document.querySelectorAll('.grid-btn').forEach(btn => {
            btn.classList.remove('bg-amber-700', 'text-white');
            btn.classList.add('bg-white', 'border', 'border-amber-200');
        });
        
        // 兼容点击事件对象
        const target = event ? event.target : null;
        if (target) {
            target.classList.remove('bg-white', 'border', 'border-amber-200');
            target.classList.add('bg-amber-700', 'text-white');
        }
    };

    // 透明度调节
    const opacitySlider = document.getElementById('opacitySlider');
    opacitySlider.addEventListener('input', (e) => {
        const img = document.getElementById('currentCharImg');
        if (img) {
            img.style.opacity = e.target.value;
        }
    });

    // 全屏临摹
    const fullScreenBtn = document.getElementById('fullScreenBtn');
    fullScreenBtn.addEventListener('click', () => {
        const copyStage = document.getElementById('copyStage');
        if (copyStage.requestFullscreen) {
            copyStage.requestFullscreen();
        } else if (copyStage.webkitRequestFullscreen) {
            copyStage.webkitRequestFullscreen();
        } else if (copyStage.msRequestFullscreen) {
            copyStage.msRequestFullscreen();
        }
    });

    searchBtn.addEventListener('click', searchChars);
    charInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchChars();
    });

    closeModal.addEventListener('click', () => {
        detailModal.classList.add('hidden');
    });

    detailModal.addEventListener('click', (e) => {
        if (e.target === detailModal) detailModal.classList.add('hidden');
    });
});
