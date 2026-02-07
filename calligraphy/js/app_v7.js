document.addEventListener('DOMContentLoaded', () => {
    const charInput = document.getElementById('charInput');
    const searchBtn = document.getElementById('searchBtn');
    const resultContainer = document.getElementById('resultContainer');
    const detailModal = document.getElementById('detailModal');
    const closeModal = document.getElementById('closeModal');
    const modalImg = document.getElementById('modalImg');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');

    // 颜体字库数据 (多宝塔碑真迹原帖 - 高清源)
    const duobaotaDb = {
        '興': { 
            img: './assets/shufa_chars/xing.jpg?v=final_20260207_v6', 
            desc: '真迹：出自《多宝塔碑》“千福寺兴工”。结体开阔，上方错落有致，下方支撑有力。' 
        },
        '旺': { 
            img: './assets/shufa_chars/wang.jpg?v=final_20260207_v6', 
            desc: '真迹：出自颜真卿《勤礼碑》。日字旁挺拔，整体端庄稳重，尽显颜体丰腴之美。' 
        },
        '發': { 
            img: './assets/shufa_chars/fa.jpg?v=final_20260207_v6', 
            desc: '真迹：出自《多宝塔碑》“发明资乎十力”。撇画舒展，内部穿插有序，笔力雄健。' 
        },
        '達': { 
            img: './assets/shufa_chars/da.jpg?v=final_20260207_v6', 
            desc: '真迹：出自《多宝塔碑》“通达”。走之底有力，内部结构紧凑，重心极稳。' 
        },
        '永': { 
            img: './assets/shufa_chars/yong.jpg?v=final_20260207_v6', 
            desc: '起笔圆润，侧锋转折有力，是练习颜体的入门经典。' 
        },
        '和': { 
            img: './assets/shufa_chars/he.jpg?v=final_20260207_v6', 
            desc: '结构左右平衡，线条粗细变化丰富，体现了颜体的宽博。' 
        },
        '九': { 
            img: './assets/shufa_chars/jiu.jpg?v=final_20260207_v6', 
            desc: '极简之字，却最显功力。撇画有力，横折钩饱满。' 
        },
        '年': { 
            img: './assets/shufa_chars/nian.jpg?v=final_20260207_v6', 
            desc: '中轴线挺拔，横画平稳，展现了颜体书法的厚重感。' 
        },
        '多': { 
            img: './assets/shufa_chars/duo.jpg?v=final_20260207_v6', 
            desc: '两夕相叠，错位而生动，重心极其稳固。' 
        },
        '寶': { 
            img: './assets/shufa_chars/bao.jpg?v=final_20260207_v6', 
            desc: '宝盖头宽阔，内部结构充实，体现了“颜筋”的质感。' 
        },
        '塔': { 
            img: './assets/shufa_chars/ta.jpg?v=final_20260207_v6', 
            desc: '土字旁稳健，右侧结构复杂但安排合理，密而不乱。' 
        },
        '碑': { 
            img: './assets/shufa_chars/bei.jpg?v=final_20260207_v6', 
            desc: '石字旁坚实，右侧笔画舒展，气势开阔。' 
        },
        '大': {
            img: './assets/shufa_chars/da_large.jpg?v=final_20260207_v6',
            desc: '横画平铺，撇捺舒展，尽显大唐气象。'
        },
        '唐': {
            img: './assets/shufa_chars/tang.jpg?v=final_20260207_v6',
            desc: '结构宏大，笔力千钧，是多宝塔碑的典型风格。'
        },
        '西': {
            img: './assets/shufa_chars/xi.jpg?v=final_20260207_v6',
            desc: '方正厚重，内部空间安排巧妙，稳定而有灵动感。'
        },
        '京': {
            img: './assets/shufa_chars/jing.jpg?v=final_20260207_v6',
            desc: '上方点画有力，下方支撑稳固，结构严谨。'
        },
        '龍': {
            img: './assets/shufa_chars/long.jpg?v=final_20260207_v6',
            desc: '笔画繁复 but 交代清晰，龙字气势磅礴。'
        },
        '寺': {
            img: './assets/shufa_chars/si.jpg?v=final_20260207_v6',
            desc: '横平竖直中见变化，体现了颜楷的规矩与方圆。'
        },
        '僧': {
            img: './assets/shufa_chars/seng.jpg?v=final_20260207_v6',
            desc: '人字旁挺拔，右侧结构紧凑，整体神采飞扬。'
        },
        '一': {
            img: './assets/shufa_chars/yi.jpg?v=final_20260207_v6',
            desc: '蚕头燕尾，一笔见真章，颜体横画的极致表现。'
        },
        '心': {
            img: './assets/shufa_chars/xin.jpg?v=final_20260207_v6',
            desc: '卧钩圆润有力，点画分布自然，灵动非凡。'
        },
        '國': {
            img: './assets/shufa_chars/guo.jpg?v=final_20260207_v6',
            desc: '外框厚重，内部结构充实，展现了颜体的宽博大度。'
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
            gridBox.className = 'mi-zi-ge w-full aspect-square max-w-[130px] md:max-w-[160px] bg-white flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105 shadow-md relative';
            
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
                img.alt = searchChar;
                img.className = 'char-img w-full h-full object-contain absolute inset-0 opacity-0 transition-opacity duration-300';
                
                // 先设置监听器，再设置 src，防止缓存导致的 onload 错过
                img.onload = () => {
                    img.classList.remove('opacity-0');
                    fontChar.style.display = 'none';
                };
                
                img.onerror = () => {
                    console.error(`图片加载失败: ${searchChar}`, data.img);
                    img.remove();
                    // 加载失败时显示备用文字，并给个提示
                    fontChar.style.color = '#999';
                };
                
                img.src = data.img;
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
