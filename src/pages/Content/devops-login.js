(async function () {
    let script = document.currentScript;
    if (!script?.dataset?.quickLogin) return;

    function showToast(message, closeCallback) {
        var toast = document.createElement('div');
        toast.className = 'doraemon-toast';
        toast.innerText = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.className = 'doraemon-toast doraemon-toast--show';
        }, 100);

        setTimeout(() => {
            toast.className = 'doraemon-toast';
            setTimeout(() => {
                document.body.removeChild(toast);
                closeCallback?.();
            }, 500);
        }, 2000);
    }

    function getUrlParams(url = window.location.href) {
        const aQuery = url.split('?');
        const aGET = {};
        if (aQuery.length > 1) {
            const aBuf = aQuery[1].split('&');
            for (let i = 0, iLoop = aBuf.length; i < iLoop; i++) {
                const aTmp = aBuf[i].split('=');
                aGET[aTmp[0]] = aTmp[1];
            }
        }
        return aGET;
    }

    async function getPulicKey() {
        if (sessionStorage.getItem('publicKey')) {
            return Promise.resolve(sessionStorage.getItem('publicKey'));
        }
        return fetch('/uic/api/v2/account/login/get-publi-key')
            .then((response) => {
                return response.json();
            })
            .then((res) => {
                if (res.success) {
                    sessionStorage.setItem('publicKey', res.data);
                    return res.data;
                } else {
                    showToast('获取公钥失败');
                    return Promise.reject();
                }
            });
    }

    async function waitPageDidMount() {
        return new Promise((resolve) => {
            const observer = new MutationObserver((mutationList, observer) => {
                for (const mutation of mutationList) {
                    if (
                        mutation.type === 'childList' &&
                        document.querySelector('.c-login__container__form__btn')
                    ) {
                        resolve(true);
                        observer.disconnect();
                    }
                }
            });
            observer.observe(document.querySelector('#app'), {
                childList: true,
                subtree: true,
            });
        });
    }

    function createLoginButton() {
        var loginBtn = document.createElement('div');
        loginBtn.className = 'doraemon-login-btn';
        loginBtn.innerHTML = `
            <div class="sign">
                <svg t="1724381735188" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="28531" width="200" height="200"><path d="M865.829463 21.72878a149.853659 149.853659 0 0 1 149.853659 149.853659v699.317073a149.853659 149.853659 0 0 1-149.853659 149.853659h-199.804878a49.95122 49.95122 0 1 1 0-99.902439h199.804878c24.97561 0.074927 46.104976-18.382049 49.451708-43.132878l0.499512-6.793366v-699.317073c0.049951-24.97561-18.407024-46.129951-43.157854-49.451708l-6.793366-0.499512h-199.804878a49.95122 49.95122 0 1 1 0-99.902439h199.804878zM454.056585 238.716878l247.258537 247.258537a49.95122 49.95122 0 0 1 0 70.631024l-247.258537 247.258537a49.95122 49.95122 0 1 1-70.631024-70.631025l161.941854-162.041756-478.782439 0.049951a49.95122 49.95122 0 0 1 0-99.902439l478.732487-0.049951-161.841951-161.941854a49.95122 49.95122 0 0 1 70.581073-70.631024z" fill="#333333" p-id="28532"></path></svg>            </div>
            <div class="doraemon-text">快速登录</div>
        `;
        return loginBtn;
    }

    async function execQuickLogin(username, password, jumpUrl, tenantId) {
        const loginBtnText = document.querySelector(
            '.doraemon-login-btn .doraemon-text'
        );
        loginBtnText.innerText = '登录中...';
        const publicKey = await getPulicKey().catch(() => {
            loginBtnText.innerText = '快速登录';
        });
        if (!publicKey) {
            showToast('公钥获取失败，请稍后再试...');
            return;
        }
        const encryptPwd = `04${sm2.doEncrypt(password, publicKey, 0)}`;
        const params = {
            username,
            password: encryptPwd,
            verify_code: '0000',
        };
        if (tenantId) params.tenantId = tenantId;
        const formData = new URLSearchParams();
        Object.keys(params).forEach((key) => {
            formData.append(key, params[key]);
        });
        fetch('/uic/api/v2/account/login', {
            method: 'POST',
            headers: {
                'X-Custom-Header': 'dtuic',
                'Content-Type':
                    'application/x-www-form-urlencoded;charset=UTF-8',
            },
            body: formData.toString(),
        })
            .then((response) => response.json())
            .then((res) => {
                if (!res.success) {
                    showToast('快速登录失败：' + res.message);
                    return;
                }
                window.location.href = jumpUrl;
            })
            .finally(() => {
                loginBtnText.innerText = '快速登录';
            });
    }

    try {
        const { quickLogin } = script.dataset;
        const loginConfig = JSON.parse(quickLogin);
        const { username, password, jumpProductPath, defaultTenantId } =
            loginConfig;

        var loginBtn = createLoginButton();
        loginBtn.addEventListener('click', function () {
            if (!username || !password) {
                showToast(
                    '未配置账号或密码，即将为您打开扩展选项页进行配置...',
                    () => {
                        script.dispatchEvent(new CustomEvent('openOptionPage'));
                    }
                );
                return;
            }

            const configUrl = new URL(window.PARAMCONFIG?.DEFAULT_JUMP_PATH);
            configUrl.pathname = !defaultTenantId
                ? '/publicService'
                : jumpProductPath;
            configUrl.hash = '';

            const urlParams = getUrlParams();

            let insightRedirectUrl = '';
            if (urlParams.insightRedirectUrl) {
                const decodeUrl = decodeURIComponent(
                    urlParams.insightRedirectUrl
                );
                const tempUrl = new URL(decodeUrl);
                // 排除portal页，因为未登录被强制退出时默认会跳回portal页
                if (!tempUrl.pathname.includes('/portal'))
                    insightRedirectUrl = decodeUrl;
            }

            const jumpUrl =
                insightRedirectUrl && urlParams.tenantId
                    ? decodeURIComponent(urlParams.insightRedirectUrl)
                    : configUrl.toString();

            execQuickLogin(
                username,
                password,
                jumpUrl,
                urlParams.tenantId ?? defaultTenantId
            );
        });
        await waitPageDidMount();
        document.body.appendChild(loginBtn);
    } catch (error) {
        console.log('注入失败', error);
    }
})();
