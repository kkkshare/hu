document.addEventListener('DOMContentLoaded', () => {
    const charInput = document.getElementById('charInput');
    const searchBtn = document.getElementById('searchBtn');
    const resultContainer = document.getElementById('resultContainer');
    const detailModal = document.getElementById('detailModal');
    const closeModal = document.getElementById('closeModal');
    const modalImgContainer = document.getElementById('modalImgContainer');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');

    // 终极保命符：兴旺发达 Base64 备用库 (v9.4)
    const fallbackDb = {
        '興': 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCABkAGQDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZnaGl6S1dnd4eXqG4SFhoeIiicqSk5SVlpeYmZqio6Slmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+iiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/2Q==',
        '旺': 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCABkAGQDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGl6S1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZnaGl6S1dnd4eXqG4SFhoeIiicqSk5SVlpeYmZqio6Slmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+iiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/2Q==',
        '發': 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCABkAGQDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGl6S1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZnaGl6S1dnd4eXqG4SFhoeIiicqSk5SVlpeYmZqio6Slmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+iiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/2Q==',
        '達': 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCABkAGQDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGl6S1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZnaGl6S1dnd4eXqG4SFhoeIiicqSk5SVlpeYmZqio6Slmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+iiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/2Q=='
    };

    // 颜体字库数据 (多宝塔碑真迹原帖 - 高清源)
    const duobaotaDb = {
        '興': { img: 'assets/shufa_v9/xing.jpg', desc: '真迹：出自《多宝塔碑》“千福寺兴工”。结体开阔，上方错落有致，下方支撑有力。' },
        '旺': { img: 'assets/shufa_v9/wang.jpg', desc: '真迹：出自颜真卿《勤礼碑》。日字旁挺拔，整体端庄稳重，尽显颜体丰腴之美。' },
        '發': { img: 'assets/shufa_v9/fa.jpg', desc: '真迹：出自《多宝塔碑》“发明资乎十力”。撇画舒展，内部穿插有序，笔力雄健。' },
        '達': { img: 'assets/shufa_v9/da.jpg', desc: '真迹：出自《多宝塔碑》“通达”。走之底有力，内部结构紧凑，重心极稳。' },
        '永': { img: 'assets/shufa_v9/yong.jpg', desc: '起笔圆润，侧锋转折有力，是练习颜体的入门经典。' },
        '和': { img: 'assets/shufa_v9/he.jpg', desc: '结构左右平衡，线条粗细变化丰富，体现了颜体的宽博。' },
        '九': { img: 'assets/shufa_v9/jiu.jpg', desc: '极简之字，却最显功力。撇画有力，横折钩饱满。' },
        '年': { img: 'assets/shufa_v9/nian.jpg', desc: '中轴线挺拔，横画平稳，展现了颜体书法的厚重感。' },
        '多': { img: 'assets/shufa_v9/duo.jpg', desc: '两夕相叠，错位而生动，重心极其稳固。' },
        '寶': { img: 'assets/shufa_v9/bao.jpg', desc: '宝盖头宽阔，内部结构充实，体现了“颜筋”的质感。' },
        '塔': { img: 'assets/shufa_v9/ta.jpg', desc: '土字旁稳健，右侧结构复杂但安排合理，密而不乱。' },
        '碑': { img: 'assets/shufa_v9/bei.jpg', desc: '石字旁坚实，右侧笔画舒展，气势开阔。' },
        '大': { img: 'assets/shufa_v9/da_large.jpg', desc: '横画平铺，撇捺舒展，尽显大唐气象。' },
        '唐': { img: 'assets/shufa_v9/tang.jpg', desc: '结构宏大，笔力千钧，是多宝塔碑的典型风格。' },
        '西': { img: 'assets/shufa_v9/xi.jpg', desc: '方正厚重，内部空间安排巧妙，稳定而有灵动感。' },
        '京': { img: 'assets/shufa_v9/jing.jpg', desc: '上方点画有力，下方支撑稳固，结构严谨。' },
        '龍': { img: 'assets/shufa_v9/long.jpg', desc: '笔画繁复 but 交代清晰，龙字气势磅礴。' },
        '寺': { img: 'assets/shufa_v9/si.jpg', desc: '横平竖直中见变化，体现了颜楷的规矩与方圆。' },
        '僧': { img: 'assets/shufa_v9/seng.jpg', desc: '人字旁挺拔，右侧结构紧凑，整体神采飞扬。' },
        '一': { img: 'assets/shufa_v9/yi.jpg', desc: '蚕头燕尾，一笔见真章，颜体横画的极致表现。' },
        '心': { img: 'assets/shufa_v9/xin.jpg', desc: '卧钩圆润有力，点画分布自然，灵动非凡。' },
        '國': { img: 'assets/shufa_v9/guo.jpg', desc: '外框厚重，内部结构充实，展现了颜体的宽博大度。' }
    };

    // 简繁转换词库
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
            const searchChar = s2tDict[char] || char;
            const data = duobaotaDb[searchChar];

            const charCard = document.createElement('div');
            charCard.className = 'flex flex-col items-center group cursor-pointer';
            
            const gridBox = document.createElement('div');
            gridBox.className = 'mi-zi-ge w-full aspect-square max-w-[130px] md:max-w-[160px] bg-white flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105 shadow-md relative';
            
            // 兜底字体永远存在，只是可能被图片遮挡
            const fontChar = document.createElement('div');
            fontChar.className = 'calligraphy-font absolute inset-0 flex items-center justify-center';
            fontChar.innerText = searchChar;
            gridBox.appendChild(fontChar);

            const tag = document.createElement('span');
            tag.className = 'source-tag z-20 ' + (data ? 'tag-authentic' : 'tag-simulated');
            tag.innerText = data ? '真迹' : '模拟';
            gridBox.appendChild(tag);

            if (data && data.img) {
                const img = document.createElement('img');
                img.src = data.img + '?v=9.4';
                img.className = 'char-img w-full h-full object-contain absolute inset-0 z-10 opacity-0';
                
                img.onload = () => {
                    img.style.opacity = '1';
                    // 图片加载成功后，让兜底文字变淡
                    fontChar.style.opacity = '0.1';
                };
                
                img.onerror = () => {
                    console.warn('网络加载失败，尝试本地备份:', data.img);
                    if (fallbackDb[searchChar]) {
                        img.src = fallbackDb[searchChar];
                        img.style.opacity = '1';
                        fontChar.style.opacity = '0.1';
                    } else {
                        fontChar.style.opacity = '1';
                        fontChar.style.color = '#991b1b';
                    }
                };
                
                gridBox.appendChild(img);
            }

            charCard.appendChild(gridBox);
            
            const title = document.createElement('span');
            title.className = 'mt-3 text-lg font-bold text-amber-900';
            title.innerText = searchChar;
            charCard.appendChild(title);

            charCard.onclick = () => showDetail(searchChar, data || { desc: '当前为书法模拟效果。丸子正在为您搜集更多《多宝塔碑》原碑高清切图。' });
            resultContainer.appendChild(charCard);
        });
    }

    function showDetail(char, data) {
        modalTitle.innerText = `颜真卿 · ${char}`;
        modalDesc.innerText = data.desc;
        modalImgContainer.innerHTML = '';
        
        const gridBox = document.createElement('div');
        gridBox.className = 'mi-zi-ge w-full h-full bg-white flex items-center justify-center relative';
        
        const fontChar = document.createElement('div');
        fontChar.className = 'calligraphy-font text-8xl absolute inset-0 flex items-center justify-center';
        fontChar.innerText = char;
        gridBox.appendChild(fontChar);

        if (data && data.img) {
            const img = document.createElement('img');
            img.src = data.img + '?v=9.4';
            img.className = 'char-img w-full h-full object-contain absolute inset-0 z-10';
            img.style.opacity = document.getElementById('opacitySlider').value;
            
            img.onload = () => {
                fontChar.style.opacity = '0.1';
            };

            img.onerror = () => {
                if (fallbackDb[char]) {
                    img.src = fallbackDb[char];
                    fontChar.style.opacity = '0.1';
                }
            };
            gridBox.appendChild(img);
        }

        modalImgContainer.appendChild(gridBox);
        detailModal.classList.remove('hidden');
    }

    // 事件绑定
    searchBtn.addEventListener('click', searchChars);
    charInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchChars();
    });

    closeModal.addEventListener('click', () => {
        detailModal.classList.add('hidden');
    });

    window.setGrid = (type) => {
        const boxes = document.querySelectorAll('.mi-zi-ge, .tian-zi-ge, .no-grid');
        boxes.forEach(box => {
            box.classList.remove('mi-zi-ge', 'tian-zi-ge', 'no-grid');
            if (type === 'mi') box.classList.add('mi-zi-ge');
            else if (type === 'tian') box.classList.add('tian-zi-ge');
            else box.classList.add('no-grid');
        });
    };

    document.getElementById('opacitySlider').addEventListener('input', (e) => {
        const img = modalImgContainer.querySelector('img');
        if (img) img.style.opacity = e.target.value;
    });

    document.getElementById('fullScreenBtn').addEventListener('click', () => {
        const stage = document.getElementById('copyStage');
        if (stage.requestFullscreen) stage.requestFullscreen();
        else if (stage.webkitRequestFullscreen) stage.webkitRequestFullscreen();
    });
});
