// 教程页面导航高亮和章节滚动功能
document.addEventListener('DOMContentLoaded', function() {
    // 获取所有章节和导航链接
    const chapters = document.querySelectorAll('.chapter');
    const navLinks = document.querySelectorAll('.tutorial-nav a');
    
    // 当前激活的导航项
    let activeNavLink = null;
    
    // 滚动事件处理函数
    function onScroll() {
        let currentChapterId = '';
        
        // 遍历所有章节，找出当前视口中的章节
        chapters.forEach(chapter => {
            const sectionTop = chapter.offsetTop;
            const sectionHeight = chapter.clientHeight;
            
            // 如果章节顶部在视口内，则认为是当前章节
            // 使用 100 像素的偏移量，使导航在章节标题进入视口时就切换
            if (pageYOffset >= (sectionTop - 100)) {
                currentChapterId = chapter.getAttribute('id');
            }
        });
        
        // 更新导航栏高亮
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href').substring(1); // 去掉 #
            if (href === currentChapterId) {
                link.classList.add('active');
                activeNavLink = link;
            }
        });
    }
    
    // 监听滚动事件
    window.addEventListener('scroll', onScroll);
    
    // 页面加载完成后触发一次滚动事件，以设置初始高亮
    onScroll();
    
    // 为导航链接添加平滑滚动功能
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // 滚动到目标元素，偏移 80 像素以考虑固定导航栏
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // 更新 URL hash
                history.pushState(null, null, targetId);
            }
        });
    });
    
    // 为主页的 CTA 按钮添加平滑滚动（如果需要）
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId) {
                window.location.href = targetId;
            }
        });
    }
});