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
            <div class="sign"><svg viewBox="0 0 512 512">
                    <path
                        d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z">
                    </path>
                </svg></div>
            <div class="doraemon-text">快速登录</div>
        `;
        return loginBtn;
    }

    async function execQuickLogin(username, password, jumpUrl, tenantId) {
        const loginBtnText = document.querySelector('.doraemon-login-btn .doraemon-text');
        loginBtnText.innerText = '登录中...'
        const publicKey = await getPulicKey().catch(() => {
             loginBtnText.innerText = '快速登录'
        }
        );
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
            // 优先取insightRedirectUrl的跳转地址
            const jumpUrl =
                urlParams.insightRedirectUrl && urlParams.tenantId
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
