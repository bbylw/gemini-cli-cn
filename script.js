// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM loaded, initializing...');
    initializeNavigation();
    initializeSmoothScrolling();
    initializeCodeCopy();
    initializeFAQ();
    initializeActiveSection();

    // 延迟一秒后再次检查FAQ
    setTimeout(() => {
        console.log('Re-checking FAQ after 1 second...');
        const faqItems = document.querySelectorAll('.faq-item');
        console.log('FAQ items found in delayed check:', faqItems.length);
        if (faqItems.length > 0 && !faqItems[0].hasAttribute('data-initialized')) {
            console.log('FAQ not properly initialized, re-initializing...');
            initializeFAQ();
        }
    }, 1000);
});

// 导航功能初始化
function initializeNavigation() {
    const navToggle = document.getElementById('navToggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');

    // 移动端导航切换
    if (navToggle) {
        navToggle.addEventListener('click', function () {
            sidebar.classList.toggle('open');
            navToggle.classList.toggle('active');
        });
    }

    // 点击主内容区域关闭侧边栏（移动端）
    if (mainContent) {
        mainContent.addEventListener('click', function () {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('open');
                navToggle.classList.remove('active');
            }
        });
    }
}





// 平滑滚动初始化
function initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // 关闭移动端侧边栏
                if (window.innerWidth <= 768) {
                    document.getElementById('sidebar').classList.remove('open');
                    document.getElementById('navToggle').classList.remove('active');
                }
            }
        });
    });
}

// 代码复制功能初始化
function initializeCodeCopy() {
    const copyButtons = document.querySelectorAll('.copy-btn');

    copyButtons.forEach(button => {
        button.addEventListener('click', function () {
            const codeBlock = this.closest('.code-block');
            const code = codeBlock.querySelector('code').textContent;

            copyToClipboard(code).then(() => {
                // 显示复制成功反馈
                const originalText = this.textContent;
                this.textContent = '已复制!';
                this.style.background = '#34a853';

                setTimeout(() => {
                    this.textContent = originalText;
                    this.style.background = '';
                }, 2000);
            }).catch(err => {
                console.error('复制失败:', err);
                this.textContent = '复制失败';
                setTimeout(() => {
                    this.textContent = '复制';
                }, 2000);
            });
        });
    });
}

// 复制到剪贴板函数
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
    } catch (err) {
        // 降级方案
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        return new Promise((resolve, reject) => {
            if (document.execCommand('copy')) {
                resolve();
            } else {
                reject(new Error('复制命令失败'));
            }
            document.body.removeChild(textArea);
        });
    }
}

// FAQ交互初始化
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    console.log('FAQ items found:', faqItems.length);

    faqItems.forEach((item, index) => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = item.querySelector('.faq-icon');

        if (question && answer) {
            console.log(`Initializing FAQ item ${index + 1}`);

            // 确保初始状态正确
            item.classList.remove('open');
            answer.style.maxHeight = '0';
            answer.style.overflow = 'hidden';
            answer.style.transition = 'max-height 0.3s ease, padding 0.3s ease';
            if (icon) icon.textContent = '+';

            question.addEventListener('click', function () {
                const isOpen = item.classList.contains('open');
                console.log(`FAQ item ${index + 1} clicked, currently open:`, isOpen);

                // 关闭所有其他FAQ项
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('open');
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        const otherIcon = otherItem.querySelector('.faq-icon');
                        if (otherAnswer) otherAnswer.style.maxHeight = '0';
                        if (otherIcon) otherIcon.textContent = '+';
                    }
                });

                // 切换当前FAQ项
                if (isOpen) {
                    item.classList.remove('open');
                    answer.style.maxHeight = '0';
                    if (icon) icon.textContent = '+';
                } else {
                    item.classList.add('open');
                    // 使用scrollHeight来确保内容完全显示
                    const scrollHeight = answer.scrollHeight;
                    console.log(`Setting maxHeight to: ${scrollHeight + 20}px`);
                    answer.style.maxHeight = scrollHeight + 20 + 'px';
                    if (icon) icon.textContent = '−';
                }
            });
        } else {
            console.log(`FAQ item ${index + 1} missing question or answer element`);
        }
    });
}

// 当前激活章节初始化
function initializeActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const tocLinks = document.querySelectorAll('.toc-link, .toc-sublink');
    const navLinks = document.querySelectorAll('.nav-link');

    let currentActiveSection = null;

    // 创建Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        // 找到最靠近视口顶部的可见section
        let topMostSection = null;
        let topMostPosition = Infinity;

        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const rect = entry.boundingClientRect;
                const distanceFromTop = Math.abs(rect.top);

                if (distanceFromTop < topMostPosition) {
                    topMostPosition = distanceFromTop;
                    topMostSection = entry.target;
                }
            }
        });

        // 如果找到了新的最顶部section，且与当前激活的不同
        if (topMostSection && topMostSection !== currentActiveSection) {
            currentActiveSection = topMostSection;
            const sectionId = topMostSection.id;

            // 更新TOC链接状态
            tocLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });

            // 更新导航链接状态
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    }, {
        threshold: [0, 0.1, 0.3, 0.5, 0.7, 1.0],
        rootMargin: '-10% 0px -70% 0px'
    });

    // 观察所有章节
    sections.forEach(section => {
        observer.observe(section);
    });

    // 手动检查初始状态
    setTimeout(() => {
        const viewportHeight = window.innerHeight;
        const navbarHeight = document.querySelector('.navbar').offsetHeight;

        let initialActiveSection = null;
        let minDistance = Infinity;

        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const sectionTop = rect.top - navbarHeight;

            // 如果section在视口中且距离顶部最近
            if (sectionTop <= viewportHeight * 0.3 && rect.bottom >= navbarHeight) {
                const distance = Math.abs(sectionTop);
                if (distance < minDistance) {
                    minDistance = distance;
                    initialActiveSection = section;
                }
            }
        });

        if (initialActiveSection) {
            currentActiveSection = initialActiveSection;
            const sectionId = initialActiveSection.id;

            tocLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    }, 100);
}

// 窗口大小变化处理
window.addEventListener('resize', function () {
    const sidebar = document.getElementById('sidebar');
    const navToggle = document.getElementById('navToggle');

    if (window.innerWidth > 768) {
        sidebar.classList.remove('open');
        if (navToggle) {
            navToggle.classList.remove('active');
        }
    }
});

// 滚动时的导航栏效果和导航定位
let lastScrollTop = 0;
let navigationUpdateTimeout = null;

window.addEventListener('scroll', function () {
    const navbar = document.querySelector('.navbar');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // 导航栏显示/隐藏效果
    if (scrollTop > lastScrollTop && scrollTop > 100) {
        // 向下滚动，隐藏导航栏
        navbar.style.transform = 'translateY(-100%)';
    } else {
        // 向上滚动，显示导航栏
        navbar.style.transform = 'translateY(0)';
    }

    lastScrollTop = scrollTop;

    // 防抖动地更新导航状态
    if (navigationUpdateTimeout) {
        clearTimeout(navigationUpdateTimeout);
    }

    navigationUpdateTimeout = setTimeout(() => {
        updateActiveNavigation();
    }, 50);
});

// 更新激活导航状态的函数
function updateActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const tocLinks = document.querySelectorAll('.toc-link, .toc-sublink');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbarHeight = document.querySelector('.navbar').offsetHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    let activeSection = null;
    let minDistance = Infinity;

    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const sectionTop = rect.top + scrollTop;
        const distance = Math.abs(sectionTop - scrollTop - navbarHeight - 20);

        // 如果section在视口中或即将进入视口
        if (rect.top <= navbarHeight + 100 && rect.bottom >= navbarHeight) {
            if (distance < minDistance) {
                minDistance = distance;
                activeSection = section;
            }
        }
    });

    if (activeSection) {
        const sectionId = activeSection.id;

        // 更新TOC链接状态
        tocLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });

        // 更新导航链接状态
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });
    }
}



// 全局函数：复制代码（供HTML中的onclick使用）
function copyCode(button) {
    const codeBlock = button.closest('.code-block');
    const code = codeBlock.querySelector('code').textContent;

    copyToClipboard(code).then(() => {
        const originalText = button.textContent;
        button.textContent = '已复制!';
        button.style.background = '#34a853';

        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 2000);
    }).catch(err => {
        console.error('复制失败:', err);
        button.textContent = '复制失败';
        setTimeout(() => {
            button.textContent = '复制';
        }, 2000);
    });
}

// 高级交互效果

// 视差滚动效果
function initParallaxEffect() {
    const hero = document.querySelector('.hero');
    const terminalDemo = document.querySelector('.terminal-demo');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;

        if (hero) {
            hero.style.transform = `translateY(${rate}px)`;
        }

        if (terminalDemo) {
            const terminalRate = scrolled * 0.3;
            terminalDemo.style.transform = `perspective(1000px) rotateY(-8deg) rotateX(4deg) translateY(${terminalRate}px)`;
        }
    });
}

// 元素进入视口动画
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // 观察所有卡片和章节
    const animateElements = document.querySelectorAll('.feature-card, .mode-card, .command-card, .section');
    animateElements.forEach(el => {
        el.classList.add('animate-target');
        observer.observe(el);
    });
}

// 动态粒子效果
function initDynamicParticles() {
    const particlesBg = document.getElementById('particles-bg');
    if (!particlesBg) return;

    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 20 + 10) + 's';
        particle.style.opacity = Math.random() * 0.5 + 0.1;
        particle.style.transform = `scale(${Math.random() * 0.5 + 0.5})`;

        particlesBg.appendChild(particle);

        // 删除完成动画的粒子
        setTimeout(() => {
            particle.remove();
        }, 25000);
    }

    // 定期创建粒子
    setInterval(createParticle, 3000);
}

// 初始化所有高级效果
function initAdvancedEffects() {
    initParallaxEffect();
    initScrollAnimations();
    initDynamicParticles();
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function () {
    initializeNavigation();
    initializeSmoothScrolling();
    initializeCodeCopy();
    initializeFAQ();
    initializeActiveSection();

    // 延迟初始化高级效果以提高性能
    setTimeout(initAdvancedEffects, 1000);
});